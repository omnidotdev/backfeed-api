/**
 * Status change with an optional note.
 *
 * `changePostStatus` moves a post to a new status (or to no status) and appends
 * the transition to the timeline with an optional admin note, in one call, so
 * the note is captured atomically with the change (no race against the
 * `updatePost` side-effect path). Shipped-event emission stays in the calling
 * plugin, mirroring `promoteSignalToPost`.
 */

import { eq } from "drizzle-orm";
import { posts, projects } from "lib/db/schema";
import { recordPostStatusChange } from "lib/feedback/statusHistory";

import type { dbPool } from "lib/db/db";

type Db = typeof dbPool;

interface ChangePostStatusParams {
  postId: string;
  /** Target status template, or null to clear the status. */
  statusTemplateId: string | null;
  /** Acting user, recorded as `changedBy` on the timeline entry. */
  userId: string | null;
  /** Optional note shown alongside the change in the timeline. */
  note?: string | null;
}

/** The post a status change resolved against, for authz + downstream effects. */
interface PostRef {
  id: string;
  projectId: string;
  organizationId: string;
}

/**
 * Resolve a post's project + organization (organization is owned by the IDP and
 * lives on the project). Returns null when the post does not exist.
 */
export const getPostRef = async (
  db: Db,
  postId: string,
): Promise<PostRef | null> => {
  const [row] = await db
    .select({
      id: posts.id,
      projectId: posts.projectId,
      organizationId: projects.organizationId,
    })
    .from(posts)
    .innerJoin(projects, eq(posts.projectId, projects.id))
    .where(eq(posts.id, postId));

  return row ?? null;
};

/**
 * Set a post's status and append the transition (with note) to its timeline.
 * Returns true if a timeline row was written (i.e. the status actually changed).
 */
export const changePostStatus = async (
  db: Db,
  { postId, statusTemplateId, userId, note }: ChangePostStatusParams,
): Promise<boolean> => {
  await db.update(posts).set({ statusTemplateId }).where(eq(posts.id, postId));

  return recordPostStatusChange(db, postId, userId, note);
};
