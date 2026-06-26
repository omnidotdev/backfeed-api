import { describe, expect, test } from "bun:test";

import {
  extractIssueRefs,
  extractMentionUserIds,
  resolveResolutionTemplateId,
} from "./references";

describe("extractMentionUserIds", () => {
  const uuid = "11111111-1111-1111-1111-111111111111";
  const other = "22222222-2222-2222-2222-222222222222";

  test("extracts profile-link UUIDs, deduped, author skipped", () => {
    const html = `<a href="/profile/${uuid}/account">@a</a> hi <a href="/profile/${other}/account">@b</a> <a href="/profile/${uuid}/account">@a</a>`;
    expect(extractMentionUserIds(html, other).sort()).toEqual([uuid]);
  });

  test("no mentions -> empty", () => {
    expect(extractMentionUserIds("<p>plain</p>", uuid)).toEqual([]);
  });
});

describe("extractIssueRefs", () => {
  test("plain reference has null keyword", () => {
    expect(extractIssueRefs("see #42 please")).toEqual([
      { number: 42, keyword: null },
    ]);
  });

  test("magic keyword captured, case-insensitive, canonicalized", () => {
    expect(extractIssueRefs("This Fixes #7")).toEqual([
      { number: 7, keyword: "fix" },
    ]);
    expect(extractIssueRefs("closed #9")).toEqual([
      { number: 9, keyword: "close" },
    ]);
    expect(extractIssueRefs("resolves #3")).toEqual([
      { number: 3, keyword: "resolve" },
    ]);
  });

  test("word-boundary: hex colors and embedded ids are ignored", () => {
    expect(extractIssueRefs("color #fff and abc#12")).toEqual([]);
  });

  test("dedupes by number, a magic keyword wins over a bare ref", () => {
    expect(extractIssueRefs("#5 and later fixes #5")).toEqual([
      { number: 5, keyword: "fix" },
    ]);
  });

  test("a keyword not adjacent to the # is not magic", () => {
    expect(extractIssueRefs("fixes the bug, see #5")).toEqual([
      { number: 5, keyword: null },
    ]);
  });

  test("extracts multiple distinct references, mixing plain and magic", () => {
    expect(
      extractIssueRefs("dup of #3, also see #7, and this closes #9"),
    ).toEqual([
      { number: 3, keyword: null },
      { number: 7, keyword: null },
      { number: 9, keyword: "close" },
    ]);
  });

  test("an uppercase keyword is still recognized and canonicalized", () => {
    expect(extractIssueRefs("This CLOSES #4")).toEqual([
      { number: 4, keyword: "close" },
    ]);
  });

  test("empty or reference-free text yields no refs", () => {
    expect(extractIssueRefs("")).toEqual([]);
    expect(extractIssueRefs("nothing to see here")).toEqual([]);
  });
});

describe("resolveResolutionTemplateId", () => {
  const t = (id: string, name: string, keywordRole: string | null = null) => ({
    id,
    name,
    keywordRole,
  });

  test("prefers an explicit keywordRole=resolved template", () => {
    const templates = [t("a", "done", "resolved"), t("b", "completed")];
    expect(resolveResolutionTemplateId(templates)).toBe("a");
  });

  test("falls back to name 'completed', then 'closed'", () => {
    expect(
      resolveResolutionTemplateId([t("x", "closed"), t("y", "completed")]),
    ).toBe("y");
    expect(resolveResolutionTemplateId([t("x", "closed")])).toBe("x");
  });

  test("returns null when nothing matches", () => {
    expect(resolveResolutionTemplateId([t("x", "open")])).toBeNull();
  });
});
