/**
 * Post status timeline.
 *
 * Appends a post's status transitions to `post_status_change`, one row per
 * change, forming a GitHub-issue-style timeline. Each row records the status the
 * post moved to (the previous row's status is the implicit "from"). Writes are
 * deduped against the latest entry so no-op updates are ignored.
 */

import { desc, eq } from "drizzle-orm";
import { postStatusChanges, posts } from "lib/db/schema";

import type { dbPool } from "lib/db/db";

type Db = typeof dbPool;

/**
 * Record a post's current status as a new timeline entry, unless it already
 * matches the most recent recorded status. Returns true if a row was written.
 */
export const recordPostStatusChange = async (
  db: Db,
  postId: string,
  changedById: string | null,
  note?: string | null,
): Promise<boolean> => {
  const post = await db.query.posts.findFirst({
    where: eq(posts.id, postId),
    columns: { statusTemplateId: true },
  });
  const toStatusTemplateId = post?.statusTemplateId ?? null;

  const last = await db.query.postStatusChanges.findFirst({
    where: eq(postStatusChanges.postId, postId),
    orderBy: desc(postStatusChanges.createdAt),
    columns: { toStatusTemplateId: true },
  });

  if ((last?.toStatusTemplateId ?? null) === toStatusTemplateId) return false;

  await db.insert(postStatusChanges).values({
    postId,
    toStatusTemplateId,
    changedById,
    note: note?.trim() || null,
  });

  return true;
};
