/**
 * Reference parsing for feedback posts and comments.
 *
 * Pure, DB-free helpers shared by the reference-extraction plugin: detect
 * @-mentions (profile links), #N post references, and GitHub-style magic
 * close-keywords. Keeping these pure makes the regex and keyword rules unit
 * testable in isolation from Postgraphile and the database.
 */

/** Canonical magic keywords. Each maps its inflections to a single canonical form. */
const MAGIC_KEYWORDS: Record<string, "close" | "fix" | "resolve"> = {
  close: "close",
  closes: "close",
  closed: "close",
  fix: "fix",
  fixes: "fix",
  fixed: "fix",
  resolve: "resolve",
  resolves: "resolve",
  resolved: "resolve",
};

const PROFILE_LINK = /\/profile\/([0-9a-fA-F-]{36})/g;

// optional magic keyword immediately before #N; (?<!\w) keeps #42 out of abc#42
// and hex colors (#fff has no digits-only run captured as a number anyway)
const ISSUE_REF =
  /(?:\b(close[ds]?|fix(?:e[ds])?|resolve[ds]?)\s+)?(?<!\w)#(\d+)\b/gi;

interface IssueRef {
  number: number;
  /** Canonical magic keyword (close|fix|resolve) or null for a plain reference. */
  keyword: "close" | "fix" | "resolve" | null;
}

interface ResolvableTemplate {
  id: string;
  name: string;
  keywordRole: string | null;
}

/** Profile-link UUIDs in `html`, deduped, excluding `authorUserId` (no self-mention). */
export const extractMentionUserIds = (
  html: string,
  authorUserId: string,
): string[] => {
  const ids = new Set<string>();
  let match = PROFILE_LINK.exec(html ?? "");
  while (match !== null) {
    if (match[1] !== authorUserId) ids.add(match[1]);
    match = PROFILE_LINK.exec(html ?? "");
  }
  PROFILE_LINK.lastIndex = 0;
  return [...ids];
};

/**
 * #N references in `text`, deduped by number. When the same number appears both
 * bare and with a magic keyword, the keyword wins (so editing in `fixes #5`
 * upgrades a prior plain `#5`).
 */
export const extractIssueRefs = (text: string): IssueRef[] => {
  const byNumber = new Map<number, IssueRef>();
  let match = ISSUE_REF.exec(text ?? "");
  while (match !== null) {
    const number = Number(match[2]);
    const keyword = match[1] ? MAGIC_KEYWORDS[match[1].toLowerCase()] : null;
    const existing = byNumber.get(number);
    if (!existing || (keyword && !existing.keyword)) {
      byNumber.set(number, { number, keyword: keyword ?? null });
    }
    match = ISSUE_REF.exec(text ?? "");
  }
  ISSUE_REF.lastIndex = 0;
  return [...byNumber.values()];
};

/**
 * The status template a magic keyword resolves a post to: an explicit
 * `keywordRole = 'resolved'` template, else the seeded `completed` name, else
 * `closed`. Returns null when none is configured.
 */
export const resolveResolutionTemplateId = (
  templates: ResolvableTemplate[],
): string | null => {
  const byRole = templates.find((t) => t.keywordRole === "resolved");
  if (byRole) return byRole.id;
  const byCompleted = templates.find((t) => t.name === "completed");
  if (byCompleted) return byCompleted.id;
  const byClosed = templates.find((t) => t.name === "closed");
  return byClosed?.id ?? null;
};
