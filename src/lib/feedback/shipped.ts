/**
 * Close-the-loop "shipped" detection.
 *
 * When a post first reaches a shipped status, the loop closes: the people who
 * asked for it (the reporters behind its signals) should hear "you asked, we
 * shipped it". `markPostShipped` stamps `shippedAt` exactly once and returns the
 * reporters so the caller can emit a `backfeed.post.shipped` event; a downstream
 * consumer (Runa / notifications) does the actual notifying.
 */

import { and, eq, isNotNull, sql } from "drizzle-orm";
import { posts, signals, statusTemplates } from "lib/db/schema";

import type { dbPool } from "lib/db/db";

type Db = typeof dbPool;

/**
 * Status template names treated as "shipped" (the work landed). Matches the
 * seeded default "completed"; orgs that rename it would extend this set.
 */
export const SHIPPED_STATUS_NAMES = ["completed"] as const;

/** Whether a status template name represents a shipped (delivered) status. */
export const isShippedStatus = (name: string | null | undefined): boolean =>
  typeof name === "string" &&
  (SHIPPED_STATUS_NAMES as readonly string[]).includes(name.toLowerCase());

/** A post that just shipped, with the reporters to notify. */
interface ShippedPost {
  postId: string;
  projectId: string;
  organizationId: string;
  title: string | null;
  /** Distinct user ids behind the post's signals (the people who asked). */
  reporterUserIds: string[];
}

/**
 * If the post is now in a shipped status and has not been marked shipped before,
 * stamp `shippedAt` and return the close-the-loop payload. Returns null otherwise
 * (not shipped, or already marked), so the caller emits exactly once.
 */
export const markPostShipped = async (
  db: Db,
  postId: string,
): Promise<ShippedPost | null> => {
  const [post] = await db
    .select({
      id: posts.id,
      projectId: posts.projectId,
      title: posts.title,
      shippedAt: posts.shippedAt,
      organizationId: statusTemplates.organizationId,
      statusName: statusTemplates.name,
    })
    .from(posts)
    .leftJoin(statusTemplates, eq(posts.statusTemplateId, statusTemplates.id))
    .where(eq(posts.id, postId));

  if (!post || post.shippedAt || !isShippedStatus(post.statusName)) return null;

  // Guard against a concurrent double-mark: only the update that flips a still-null
  // shippedAt proceeds. organizationId comes from the post's project, not the
  // (nullable) status template org.
  const stamped = await db
    .update(posts)
    .set({ shippedAt: sql`now()` })
    .where(and(eq(posts.id, postId), sql`${posts.shippedAt} IS NULL`))
    .returning({ id: posts.id });
  if (stamped.length === 0) return null;

  const project = await db.query.projects.findFirst({
    where: (table, { eq: eqFn }) => eqFn(table.id, post.projectId),
    columns: { organizationId: true },
  });
  if (!project) return null;

  const reporters = await db
    .selectDistinct({ userId: signals.userId })
    .from(signals)
    .where(and(eq(signals.postId, postId), isNotNull(signals.userId)));

  return {
    postId: post.id,
    projectId: post.projectId,
    organizationId: project.organizationId,
    title: post.title,
    reporterUserIds: reporters
      .map((r) => r.userId)
      .filter((id): id is string => id !== null),
  };
};
