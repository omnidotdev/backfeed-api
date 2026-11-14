import { describe, expect, test } from "bun:test";

import { EMBEDDING_DIMENSIONS } from "lib/db/vector";

import {
  cosineSimilarity,
  createEmbeddingProvider,
  foldIntoCentroid,
  noopEmbeddingProvider,
  parseEmbeddingResponse,
} from "./embedding";

describe("cosineSimilarity", () => {
  test("identical vectors have similarity 1", () => {
    expect(cosineSimilarity([1, 2, 3], [1, 2, 3])).toBeCloseTo(1, 6);
  });

  test("orthogonal vectors have similarity 0", () => {
    expect(cosineSimilarity([1, 0], [0, 1])).toBeCloseTo(0, 6);
  });

  test("opposite vectors have similarity -1", () => {
    expect(cosineSimilarity([1, 0], [-1, 0])).toBeCloseTo(-1, 6);
  });

  test("throws on length mismatch", () => {
    expect(() => cosineSimilarity([1, 2], [1, 2, 3])).toThrow(/length/i);
  });

  test("returns 0 for a zero vector (no direction)", () => {
    expect(cosineSimilarity([0, 0], [1, 1])).toBe(0);
  });
});

describe("foldIntoCentroid", () => {
  test("an empty cluster takes the first vector as its centroid", () => {
    expect(foldIntoCentroid(null, 0, [2, 4])).toEqual([2, 4]);
  });

  test("folds a new member in as a running mean", () => {
    expect(foldIntoCentroid([2, 4], 1, [4, 8])).toEqual([3, 6]);
  });

  test("a member equal to the centroid leaves it unchanged", () => {
    expect(foldIntoCentroid([3, 6], 2, [3, 6])).toEqual([3, 6]);
  });

  test("throws on dimension mismatch", () => {
    expect(() => foldIntoCentroid([1, 2], 1, [1, 2, 3])).toThrow(/dimension/i);
  });
});

describe("parseEmbeddingResponse", () => {
  test("extracts the embedding from an OpenAI-compatible response", () => {
    expect(
      parseEmbeddingResponse({ data: [{ embedding: [0.1, 0.2, 0.3] }] }),
    ).toEqual([0.1, 0.2, 0.3]);
  });

  test("throws on a malformed response", () => {
    expect(() => parseEmbeddingResponse({ data: [] })).toThrow();
    expect(() => parseEmbeddingResponse({})).toThrow();
  });
});

describe("noopEmbeddingProvider", () => {
  test("returns null (signals the lexical fallback)", async () => {
    expect(
      await noopEmbeddingProvider.embed("anything", {
        organizationId: "org",
        actorId: "user",
      }),
    ).toBeNull();
  });
});

describe("createEmbeddingProvider", () => {
  const ORG = "0b9a7e4e-6a55-4d6f-9d55-3c7e2f8b1a01";
  const ACTOR = "5f1c2d3e-4b5a-4c6d-8e7f-9a0b1c2d3e4f";
  const vector = Array.from({ length: EMBEDDING_DIMENSIONS }, () => 0.01);

  /** Fake provisioner recording each resolveKey call */
  const fakeProvisioner = (result: string | Error = "synapse_scoped") => {
    const calls: unknown[][] = [];
    return {
      calls,
      resolveKey: async (...args: unknown[]) => {
        calls.push(args);
        if (result instanceof Error) throw result;
        return result;
      },
    };
  };

  /** Fake gateway fetch recording each request */
  const fakeFetch = (
    status = 200,
    body: unknown = { data: [{ embedding: vector }] },
  ) => {
    const requests: { url: string; init: RequestInit }[] = [];
    const impl = (async (url: string, init: RequestInit) => {
      requests.push({ url, init });
      return new Response(JSON.stringify(body), { status });
    }) as unknown as typeof fetch;
    return { requests, impl };
  };

  const quietLog = { info: () => {}, warn: () => {} };

  test("returns the noop provider when the gateway is not configured", async () => {
    const provider = createEmbeddingProvider({
      gatewayUrl: undefined,
      provisioner: fakeProvisioner(),
    });
    expect(provider).toBe(noopEmbeddingProvider);
    expect(
      createEmbeddingProvider({ gatewayUrl: "https://gw", provisioner: null }),
    ).toBe(noopEmbeddingProvider);
  });

  test("embeds through the gateway on a key scoped to backfeed and billed to the workspace", async () => {
    const provisioner = fakeProvisioner("synapse_scoped");
    const gateway = fakeFetch();
    const provider = createEmbeddingProvider({
      gatewayUrl: "https://gw.example/",
      provisioner,
      fetchImpl: gateway.impl,
      log: quietLog,
    });

    const result = await provider.embed("slow export", {
      organizationId: ORG,
      actorId: ACTOR,
    });

    expect(result).toEqual(vector);
    expect(provisioner.calls).toEqual([
      [ACTOR, undefined, { entityType: "organization", entityId: ORG }],
    ]);
    expect(gateway.requests).toHaveLength(1);
    const [request] = gateway.requests;
    expect(request?.url).toBe("https://gw.example/v1/embeddings");
    expect(
      (request?.init.headers as Record<string, string>).Authorization,
    ).toBe("Bearer synapse_scoped");
    expect(JSON.parse(String(request?.init.body))).toEqual({
      model: "openai/text-embedding-3-small",
      input: "slow export",
    });
  });

  test("background work with no acting user stays lexical (no key holder to bill under)", async () => {
    const provisioner = fakeProvisioner();
    const gateway = fakeFetch();
    const provider = createEmbeddingProvider({
      gatewayUrl: "https://gw",
      provisioner,
      fetchImpl: gateway.impl,
      log: quietLog,
    });

    expect(await provider.embed("hi", { organizationId: ORG })).toBeNull();
    expect(provisioner.calls).toHaveLength(0);
    expect(gateway.requests).toHaveLength(0);
  });

  test("an exhausted AI allowance (402) degrades to lexical and is never retried", async () => {
    const gateway = fakeFetch(402, {
      error: { type: "allowance_exhausted_error" },
    });
    const provider = createEmbeddingProvider({
      gatewayUrl: "https://gw",
      provisioner: fakeProvisioner(),
      fetchImpl: gateway.impl,
      log: quietLog,
    });

    expect(
      await provider.embed("hi", { organizationId: ORG, actorId: ACTOR }),
    ).toBeNull();
    expect(gateway.requests).toHaveLength(1);
  });

  test("a refused tier (403) or an unavailable gateway (503) degrades to lexical", async () => {
    for (const status of [403, 503]) {
      const provider = createEmbeddingProvider({
        gatewayUrl: "https://gw",
        provisioner: fakeProvisioner(),
        fetchImpl: fakeFetch(status, {}).impl,
        log: quietLog,
      });
      expect(
        await provider.embed("hi", { organizationId: ORG, actorId: ACTOR }),
      ).toBeNull();
    }
  });

  test("a provisioning failure degrades to lexical and never calls the gateway", async () => {
    const gateway = fakeFetch();
    const provider = createEmbeddingProvider({
      gatewayUrl: "https://gw",
      provisioner: fakeProvisioner(new Error("provision failed")),
      fetchImpl: gateway.impl,
      log: quietLog,
    });

    expect(
      await provider.embed("hi", { organizationId: ORG, actorId: ACTOR }),
    ).toBeNull();
    expect(gateway.requests).toHaveLength(0);
  });

  test("a vector of the wrong dimension degrades rather than corrupting the column", async () => {
    const provider = createEmbeddingProvider({
      gatewayUrl: "https://gw",
      provisioner: fakeProvisioner(),
      fetchImpl: fakeFetch(200, { data: [{ embedding: [0.1, 0.2] }] }).impl,
      log: quietLog,
    });

    expect(
      await provider.embed("hi", { organizationId: ORG, actorId: ACTOR }),
    ).toBeNull();
  });
});
