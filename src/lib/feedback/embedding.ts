/**
 * Embedding provider for the feedback brain.
 *
 * Semantic dedupe and clustering (AI triage) need vector embeddings of feedback
 * text. They run through the Synapse AI gateway on a product-scoped key billed
 * to the workspace under Backfeed's included AI allowance (Posture C):
 *
 * - Not configured (no gateway URL or provisioner): the noop provider returns
 *   `null`, and callers fall back to lexical (pg_trgm) dedupe; clustering stays
 *   dormant.
 * - Configured: each call resolves the acting user's key for the workspace and
 *   posts to the gateway's `/v1/embeddings`. The gateway refuses tiers without
 *   AI triage (403) and an exhausted allowance (402); every refusal or failure
 *   degrades to `null` (lexical), and a 402 is never retried.
 *
 * Background work with no acting user (inbound email) has no one to mint a key
 * for, so it stays lexical.
 */

import { synapseProvisioner } from "lib/ai/synapse";
import { SYNAPSE_BASE_URL } from "lib/config/env.config";
import { EMBEDDING_DIMENSIONS } from "lib/db/vector";

import type { SynapseProvisioner } from "@omnidotdev/providers/ai";

/** Gateway model id (provider-prefixed; the gateway routes by it) */
const EMBEDDING_MODEL = "openai/text-embedding-3-small";

/** Who an embedding is for: the paying workspace and the acting user */
interface EmbeddingScope {
  /** Organization (workspace) that owns the feedback and is billed */
  organizationId: string;
  /** Acting user's identity-provider id, when the call has one */
  actorId?: string;
}

/** Produces embedding vectors, or `null` when embeddings are unavailable. */
interface EmbeddingProvider {
  embed(text: string, scope: EmbeddingScope): Promise<number[] | null>;
}

/**
 * Cosine similarity of two equal-length vectors, in [-1, 1]. Returns 0 when
 * either vector has no magnitude (no meaningful direction).
 */
export const cosineSimilarity = (a: number[], b: number[]): number => {
  if (a.length !== b.length) {
    throw new Error(
      `Cannot compare vectors of different length (${a.length} vs ${b.length})`,
    );
  }

  let dot = 0;
  let magA = 0;
  let magB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }

  if (magA === 0 || magB === 0) return 0;
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
};

/**
 * Fold a new member vector into a cluster centroid as a running mean.
 * `count` is the number of members already in the centroid (0 for an empty
 * cluster, in which case the member becomes the centroid).
 */
export const foldIntoCentroid = (
  centroid: number[] | null,
  count: number,
  vec: number[],
): number[] => {
  if (!centroid || count <= 0) return [...vec];
  if (centroid.length !== vec.length) {
    throw new Error(
      `Centroid dimension mismatch (${centroid.length} vs ${vec.length})`,
    );
  }

  const next = count + 1;
  return centroid.map((c, i) => (c * count + vec[i]) / next);
};

/**
 * Extract the embedding vector from an OpenAI-compatible `/embeddings` response
 * (`{ data: [{ embedding: number[] }] }`). Throws on a malformed payload.
 */
export const parseEmbeddingResponse = (payload: unknown): number[] => {
  const embedding = (
    payload as { data?: Array<{ embedding?: unknown }> } | null
  )?.data?.[0]?.embedding;

  if (!Array.isArray(embedding) || embedding.length === 0) {
    throw new Error("Malformed embedding response: missing data[0].embedding");
  }
  return embedding as number[];
};

/** Provider used when no embedding service is configured. */
export const noopEmbeddingProvider: EmbeddingProvider = {
  embed: async () => null,
};

/**
 * Build an embedding provider. Without a gateway URL or a provisioner, returns
 * the noop provider (lexical fallback). Otherwise embeds through the gateway on
 * a product-scoped key; every failure degrades to `null` rather than failing
 * the request
 */
export const createEmbeddingProvider = (config: {
  gatewayUrl: string | undefined;
  provisioner: Pick<SynapseProvisioner, "resolveKey"> | null;
  fetchImpl?: typeof fetch;
  log?: { info: (message: string) => void; warn: (message: string) => void };
}): EmbeddingProvider => {
  const { gatewayUrl, provisioner } = config;
  if (!gatewayUrl || !provisioner) return noopEmbeddingProvider;

  const fetchImpl = config.fetchImpl ?? fetch;
  const log = config.log ?? {
    info: (message: string) => console.info(message),
    warn: (message: string) => console.warn(message),
  };
  const url = `${gatewayUrl.replace(/\/+$/, "")}/v1/embeddings`;

  return {
    embed: async (text, scope) => {
      if (!scope.actorId) return null;

      try {
        const apiKey = await provisioner.resolveKey(scope.actorId, undefined, {
          entityType: "organization",
          entityId: scope.organizationId,
        });

        const response = await fetchImpl(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({ model: EMBEDDING_MODEL, input: text }),
        });

        if (response.status === 402) {
          log.info(
            `[Embedding] Included AI allowance used for organization ${scope.organizationId}; degrading to lexical`,
          );
          return null;
        }
        if (!response.ok) {
          log.warn(
            `[Embedding] Gateway returned ${response.status}; degrading to lexical`,
          );
          return null;
        }

        const embedding = parseEmbeddingResponse(await response.json());
        // A vector whose dimension does not match the schema's vector columns
        // would break inserts; degrade rather than corrupt the column
        if (embedding.length !== EMBEDDING_DIMENSIONS) {
          log.warn(
            `[Embedding] Expected ${EMBEDDING_DIMENSIONS} dims, got ${embedding.length}; degrading to lexical`,
          );
          return null;
        }
        return embedding;
      } catch (error) {
        const reason = error instanceof Error ? error.message : "unknown error";
        log.warn(`[Embedding] Unavailable (${reason}); degrading to lexical`);
        return null;
      }
    },
  };
};

/** Process-wide embedding provider, built from the environment */
export const embeddingProvider = createEmbeddingProvider({
  gatewayUrl: SYNAPSE_BASE_URL,
  provisioner: synapseProvisioner,
});
