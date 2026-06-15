import { describe, expect, test } from "bun:test";

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
    expect(await noopEmbeddingProvider.embed("anything")).toBeNull();
  });
});

describe("createEmbeddingProvider", () => {
  test("returns the noop provider when no api url is configured", async () => {
    const provider = createEmbeddingProvider({});
    expect(await provider.embed("hello")).toBeNull();
  });

  test("returns a real provider when configured", () => {
    const provider = createEmbeddingProvider({
      apiUrl: "https://example.com/v1/embeddings",
      apiKey: "sk-test",
      model: "text-embedding-3-small",
    });
    // a configured provider exposes an embed function (network call not exercised here)
    expect(typeof provider.embed).toBe("function");
    expect(provider).not.toBe(noopEmbeddingProvider);
  });
});
