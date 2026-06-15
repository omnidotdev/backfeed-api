/**
 * Embedding provider for the feedback brain.
 *
 * Semantic dedupe and clustering need vector embeddings of feedback text. There
 * is no embedding service in the stack yet (Synapse, the AI router, is
 * unlaunched), so this is a thin swappable interface:
 *
 * - Default (no config): the noop provider returns `null`, and callers fall back
 *   to lexical (pg_trgm) dedupe; clustering stays dormant.
 * - Configured: an OpenAI-compatible `/embeddings` endpoint (env-driven), later
 *   swappable for Synapse without touching callers.
 *
 * Mirrors `triage.ts` (dependency-free default, swap to the router later) and the
 * startup-warnings rule (boots with zero config, optional integration degrades).
 */

import {
  EMBEDDING_API_KEY,
  EMBEDDING_API_URL,
  EMBEDDING_MODEL,
} from "lib/config/env.config";
import { EMBEDDING_DIMENSIONS } from "lib/db/vector";

/** Produces embedding vectors, or `null` when embeddings are unavailable. */
interface EmbeddingProvider {
  embed(text: string): Promise<number[] | null>;
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
 * Build an embedding provider from config. With no `apiUrl`, returns the noop
 * provider (lexical fallback). Otherwise returns an OpenAI-compatible HTTP
 * provider; embedding errors degrade to `null` rather than failing the request.
 */
export const createEmbeddingProvider = (config: {
  apiUrl?: string;
  apiKey?: string;
  model?: string;
}): EmbeddingProvider => {
  if (!config.apiUrl) return noopEmbeddingProvider;

  const { apiUrl, apiKey, model = "text-embedding-3-small" } = config;

  return {
    embed: async (text: string) => {
      try {
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
          },
          body: JSON.stringify({ model, input: text }),
        });

        if (!response.ok) {
          console.error(
            `[Embedding] Provider returned ${response.status}; degrading to lexical`,
          );
          return null;
        }

        const embedding = parseEmbeddingResponse(await response.json());
        // A provider whose dimension does not match the schema's vector columns
        // would break inserts; degrade rather than corrupt the column.
        if (embedding.length !== EMBEDDING_DIMENSIONS) {
          console.error(
            `[Embedding] Expected ${EMBEDDING_DIMENSIONS} dims, got ${embedding.length}; degrading to lexical`,
          );
          return null;
        }
        return embedding;
      } catch (error) {
        console.error(
          "[Embedding] Request failed; degrading to lexical:",
          error,
        );
        return null;
      }
    },
  };
};

/** Process-wide embedding provider, built from the environment. */
export const embeddingProvider = createEmbeddingProvider({
  apiUrl: EMBEDDING_API_URL,
  apiKey: EMBEDDING_API_KEY,
  model: EMBEDDING_MODEL,
});
