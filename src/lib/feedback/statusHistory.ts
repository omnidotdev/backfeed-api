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

/**
 * Resolve the post a status-timeline entry belongs to, used to authorize
 * removal against the post's organization. Returns null when the entry does not
 * exist.
 */
export const getStatusChangePostId = async (
  db: Db,
  id: string,
): Promise<string | null> => {
  const row = await db.query.postStatusChanges.findFirst({
    where: eq(postStatusChanges.id, id),
    columns: { postId: true },
  });

  return row?.postId ?? null;
};

/**
 * Edit the note on a single status-timeline entry, leaving the recorded status
 * and timestamp untouched (only the admin's annotation changes). The note is
 * trimmed like the append path; an empty note clears it. Returns the stored
 * note (which may be null), or undefined if no row matched.
 */
export const updatePostStatusChangeNote = async (
  db: Db,
  id: string,
  note: string | null,
): Promise<string | null | undefined> => {
  const [updated] = await db
    .update(postStatusChanges)
    .set({ note: note?.trim() || null })
    .where(eq(postStatusChanges.id, id))
    .returning({ note: postStatusChanges.note });

  return updated?.note;
};

/**
 * Remove a single entry from a post's status timeline. The post's current
 * status (`posts.statusTemplateId`) is intentionally left untouched, mirroring
 * how deleting a comment removes only that comment. Returns true if a row was
 * deleted.
 */
export const deletePostStatusChange = async (
  db: Db,
  id: string,
): Promise<boolean> => {
  const deleted = await db
    .delete(postStatusChanges)
    .where(eq(postStatusChanges.id, id))
    .returning({ id: postStatusChanges.id });

  return deleted.length > 0;
};
