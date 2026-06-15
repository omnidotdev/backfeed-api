import { describe, expect, test } from "bun:test";

import { DEDUPE_THRESHOLDS, classifyDuplicate } from "./dedupe";

describe("classifyDuplicate", () => {
  test("embedding: high cosine similarity is a merge", () => {
    expect(classifyDuplicate(0.95, "embedding")).toBe("merge");
    expect(
      classifyDuplicate(DEDUPE_THRESHOLDS.embedding.merge, "embedding"),
    ).toBe("merge");
  });

  test("embedding: medium similarity is a flag", () => {
    expect(classifyDuplicate(0.85, "embedding")).toBe("flag");
  });

  test("embedding: low similarity is novel", () => {
    expect(classifyDuplicate(0.5, "embedding")).toBe("novel");
  });

  test("lexical thresholds are lower than embedding thresholds", () => {
    // a trigram score that is a merge lexically would be merely novel for embeddings
    expect(classifyDuplicate(0.72, "lexical")).toBe("merge");
    expect(classifyDuplicate(0.72, "embedding")).toBe("novel");
  });

  test("lexical: low similarity is novel", () => {
    expect(classifyDuplicate(0.1, "lexical")).toBe("novel");
  });
});
