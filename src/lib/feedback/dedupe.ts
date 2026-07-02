/**
 * Near-duplicate detection for incoming feedback.
 *
 * Two strategies behind one entry point:
 * - semantic (pgvector cosine) when an embedding is available
 * - lexical (pg_trgm trigram similarity) as the zero-config fallback
 *
 * The two score scales differ, so each has its own thresholds. `findDuplicate`
 * returns the best actionable match (merge or flag) within a project, or `null`
 * when the nearest candidate is merely novel.
 */

import { sql } from "drizzle-orm";
import { posts, statusTemplates } from "lib/db/schema";

import type { dbPool } from "lib/db/db";

type Db = typeof dbPool;

/** Similarity strategy used to score a candidate. */
type DedupeStrategy = "embedding" | "lexical";

/** Outcome for a scored candidate. */
type DuplicateVerdict = "merge" | "flag" | "novel";

/**
 * Score thresholds per strategy. Embedding cosine similarity is far stricter
 * than trigram similarity, so the cutoffs differ. `merge` auto-links a duplicate;
 * `flag` records a possible duplicate for a human; below `flag` is novel.
 */
export const DEDUPE_THRESHOLDS = {
  embedding: { merge: 0.92, flag: 0.82 },
  lexical: { merge: 0.7, flag: 0.45 },
} as const;

interface DuplicateMatch {
  postId: string;
  score: number;
  strategy: DedupeStrategy;
  verdict: Exclude<DuplicateVerdict, "novel">;
}

/** Classify a similarity score against a strategy's thresholds. */
export const classifyDuplicate = (
  score: number,
  strategy: DedupeStrategy,
): DuplicateVerdict => {
  const thresholds = DEDUPE_THRESHOLDS[strategy];
  if (score >= thresholds.merge) return "merge";
  if (score >= thresholds.flag) return "flag";
  return "novel";
};

const toMatch = (
  // biome-ignore lint/suspicious/noExplicitAny: raw pg result rows
  rows: any[],
  strategy: DedupeStrategy,
): DuplicateMatch | null => {
  const row = rows[0];
  if (!row?.id || row.score == null) return null;

  const score = Number(row.score);
  const verdict = classifyDuplicate(score, strategy);
  if (verdict === "novel") return null;

  return { postId: row.id as string, score, strategy, verdict };
};

/**
 * Find the best near-duplicate post for incoming content within a project.
 * Uses semantic cosine similarity when an embedding is supplied, otherwise
 * lexical trigram similarity. Canonical (non-duplicate) posts only.
 */
export const findDuplicate = async (
  db: Db,
  projectId: string,
  input: { content: string; embedding?: number[] | null },
): Promise<DuplicateMatch | null> => {
  if (input.embedding && input.embedding.length > 0) {
    const vec = `[${input.embedding.join(",")}]`;
    const result = await db.execute(sql`
      SELECT id, 1 - (embedding <=> ${vec}::vector) AS score
      FROM ${posts}
      WHERE project_id = ${projectId}
        AND embedding IS NOT NULL
        AND duplicate_of_id IS NULL
      ORDER BY embedding <=> ${vec}::vector ASC
      LIMIT 1
    `);
    return toMatch(result.rows, "embedding");
  }

  const result = await db.execute(sql`
    SELECT id,
      similarity(
        coalesce(title, '') || ' ' || coalesce(description, ''),
        ${input.content}
      ) AS score
    FROM ${posts}
    WHERE project_id = ${projectId}
      AND duplicate_of_id IS NULL
    ORDER BY score DESC
    LIMIT 1
  `);
  return toMatch(result.rows, "lexical");
};

interface SimilarPost {
  id: string;
  number: number | null;
  title: string | null;
  score: number;
  // current status of the candidate, so the UI can show whether a match is
  // already completed/closed rather than open. null when the post has no status
  status: { displayName: string; color: string | null } | null;
}

/** Minimum similarity to surface a post as a possible duplicate to the user. */
const SIMILAR_POST_THRESHOLD = 0.15;

/**
 * Find posts similar to a draft, to surface possible duplicates at submit time
 * ("is this a duplicate of #12?"). Lexical (pg_trgm) similarity over title +
 * description; returns the top matches above a low "show" threshold, looser than
 * the auto-merge/flag thresholds (this is advisory, not an action).
 */
export const findSimilarPosts = async (
  db: Db,
  projectId: string,
  content: string,
  limit = 5,
): Promise<SimilarPost[]> => {
  if (!content.trim()) return [];

  const result = await db.execute(sql`
    SELECT p.id, p.number, p.title,
      st.display_name AS status_display_name,
      st.color AS status_color,
      similarity(
        coalesce(p.title, '') || ' ' || coalesce(p.description, ''),
        ${content}
      ) AS score
    FROM ${posts} p
    LEFT JOIN ${statusTemplates} st ON st.id = p.status_template_id
    WHERE p.project_id = ${projectId}
      AND p.duplicate_of_id IS NULL
    ORDER BY score DESC
    LIMIT ${limit}
  `);

  return (
    result.rows
      // biome-ignore lint/suspicious/noExplicitAny: raw pg rows
      .map((row: any) => ({
        id: row.id as string,
        number: row.number as number | null,
        title: row.title as string | null,
        score: Number(row.score),
        status: row.status_display_name
          ? {
              displayName: row.status_display_name as string,
              color: (row.status_color as string | null) ?? null,
            }
          : null,
      }))
      .filter((post) => post.score >= SIMILAR_POST_THRESHOLD)
  );
};
