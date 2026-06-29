/**
 * In-app notification center.
 *
 * Write helpers fan a domain event (a comment, reaction, or status change) out
 * into per-recipient `notification` rows; read helpers serve the observer's own
 * notifications and unread count. All recipient resolution lives here so the
 * GraphQL plugins stay thin. A user is never notified about their own action.
 */

import { and, desc, eq, inArray, isNull, sql } from "drizzle-orm";
import {
  notifications,
  posts,
  projects,
  signals,
  users,
  votes,
} from "lib/db/schema";
import { extractMentionUserIds } from "lib/feedback/references";

import type { dbPool } from "lib/db/db";
import type { InsertNotification } from "lib/db/schema";

type Db = typeof dbPool;

/** A notification shaped for the GraphQL `Notification` type. */
interface NotificationView {
  id: string;
  type: string;
  emoji: string | null;
  statusName: string | null;
  isRead: boolean;
  createdAt: string;
  actor: { username: string | null; image: string | null } | null;
  postId: string | null;
  commentId: string | null;
  postNumber: number | null;
  postTitle: string | null;
  projectSlug: string | null;
  organizationId: string | null;
}

/** Insert notification rows, skipping an empty batch. */
const createNotifications = async (
  db: Db,
  rows: InsertNotification[],
): Promise<void> => {
  if (!rows.length) return;
  await db.insert(notifications).values(rows);
};

/**
 * Distinct user ids with a stake in a post (its upvoters and signal reporters),
 * minus the actor. Unlike the email recipients, this ignores the email opt-out
 * preference: an in-app notification is lightweight and not gated by it.
 */
const getPostFollowerIds = async (
  db: Db,
  postId: string,
  actorId: string | null,
): Promise<string[]> => {
  const [upvoters, reporters] = await Promise.all([
    db
      .select({ userId: votes.userId })
      .from(votes)
      .where(and(eq(votes.postId, postId), eq(votes.voteType, "up"))),
    db
      .select({ userId: signals.userId })
      .from(signals)
      .where(eq(signals.postId, postId)),
  ]);

  const ids = new Set<string>();
  for (const { userId } of upvoters) ids.add(userId);
  for (const { userId } of reporters) if (userId) ids.add(userId);
  if (actorId) ids.delete(actorId);

  return [...ids];
};

/**
 * Fan a created comment out into notifications: the parent comment's author is
 * notified of the reply, and every @-mentioned user of a mention. A user who is
 * both replied to and mentioned gets a single (reply) notification.
 */
export const notifyOnComment = async (
  db: Db,
  params: {
    postId: string;
    commentId: string;
    message: string | null;
    authorId: string;
    parentId: string | null;
  },
): Promise<void> => {
  const { postId, commentId, message, authorId, parentId } = params;
  const rows: InsertNotification[] = [];
  const notified = new Set<string>([authorId]);

  if (parentId) {
    const parent = await db.query.comments.findFirst({
      where: (table, { eq }) => eq(table.id, parentId),
      columns: { userId: true },
    });
    if (parent && !notified.has(parent.userId)) {
      notified.add(parent.userId);
      rows.push({
        userId: parent.userId,
        type: "reply",
        actorId: authorId,
        postId,
        commentId,
      });
    }
  }

  for (const mentionedUserId of extractMentionUserIds(
    message ?? "",
    authorId,
  )) {
    if (notified.has(mentionedUserId)) continue;
    notified.add(mentionedUserId);
    rows.push({
      userId: mentionedUserId,
      type: "mention",
      actorId: authorId,
      postId,
      commentId,
    });
  }

  await createNotifications(db, rows);
};

/** Notify the @-mentioned users in a newly created post's description. */
export const notifyOnPostCreated = async (
  db: Db,
  params: { postId: string; description: string | null; authorId: string },
): Promise<void> => {
  const { postId, description, authorId } = params;
  const mentionedUserIds = extractMentionUserIds(description ?? "", authorId);
  await createNotifications(
    db,
    mentionedUserIds.map((userId) => ({
      userId,
      type: "mention",
      actorId: authorId,
      postId,
    })),
  );
};

/** Notify a post's or comment's author that someone reacted to it. */
export const notifyOnReaction = async (
  db: Db,
  params: {
    postId: string | null;
    commentId: string | null;
    emoji: string;
    reactorId: string;
  },
): Promise<void> => {
  const { commentId, emoji, reactorId } = params;
  let targetUserId: string | undefined;
  let linkPostId: string | null = null;

  if (commentId) {
    const comment = await db.query.comments.findFirst({
      where: (table, { eq }) => eq(table.id, commentId),
      columns: { userId: true, postId: true },
    });
    if (!comment) return;
    targetUserId = comment.userId;
    linkPostId = comment.postId;
  } else if (params.postId) {
    const postId = params.postId;
    const post = await db.query.posts.findFirst({
      where: (table, { eq }) => eq(table.id, postId),
      columns: { userId: true },
    });
    if (!post) return;
    targetUserId = post.userId;
    linkPostId = postId;
  }

  if (!targetUserId || targetUserId === reactorId) return;

  await createNotifications(db, [
    {
      userId: targetUserId,
      type: "reaction",
      actorId: reactorId,
      postId: linkPostId,
      commentId,
      emoji,
    },
  ]);
};

/**
 * Notify a post's followers (upvoters + reporters, minus the actor) that its
 * status changed. The post's current status name is denormalized onto the row
 * so the feed reads correctly even after a later transition.
 */
export const notifyStatusChangeInApp = async (
  db: Db,
  postId: string,
  actorId: string | null,
): Promise<void> => {
  const followerIds = await getPostFollowerIds(db, postId, actorId);
  if (!followerIds.length) return;

  const post = await db.query.posts.findFirst({
    where: (table, { eq }) => eq(table.id, postId),
    with: { statusTemplate: { columns: { displayName: true } } },
  });
  const statusName = post?.statusTemplate?.displayName ?? null;

  await createNotifications(
    db,
    followerIds.map((userId) => ({
      userId,
      type: "status_change",
      actorId,
      postId,
      statusName,
    })),
  );
};

/** The observer's most recent notifications, newest first. */
export const getNotifications = async (
  db: Db,
  userId: string,
  limit = 30,
): Promise<NotificationView[]> => {
  const rows = await db
    .select({
      id: notifications.id,
      type: notifications.type,
      emoji: notifications.emoji,
      statusName: notifications.statusName,
      readAt: notifications.readAt,
      createdAt: notifications.createdAt,
      commentId: notifications.commentId,
      actorUsername: users.username,
      actorImage: users.avatarUrl,
      postId: posts.id,
      postNumber: posts.number,
      postTitle: posts.title,
      projectSlug: projects.slug,
      organizationId: projects.organizationId,
    })
    .from(notifications)
    .leftJoin(users, eq(users.id, notifications.actorId))
    .leftJoin(posts, eq(posts.id, notifications.postId))
    .leftJoin(projects, eq(projects.id, posts.projectId))
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt))
    .limit(Math.min(Math.max(limit, 1), 100));

  return rows.map((row) => ({
    id: row.id,
    type: row.type,
    emoji: row.emoji,
    statusName: row.statusName,
    isRead: row.readAt != null,
    createdAt: row.createdAt,
    actor: row.actorUsername
      ? { username: row.actorUsername, image: row.actorImage }
      : null,
    postId: row.postId,
    commentId: row.commentId,
    postNumber: row.postNumber,
    postTitle: row.postTitle,
    projectSlug: row.projectSlug,
    organizationId: row.organizationId,
  }));
};

/** Count of the observer's unread notifications. */
export const getUnreadNotificationCount = async (
  db: Db,
  userId: string,
): Promise<number> => {
  const [row] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(notifications)
    .where(and(eq(notifications.userId, userId), isNull(notifications.readAt)));
  return row?.count ?? 0;
};

/** Mark the observer's given notifications read; returns the number updated. */
export const markNotificationsRead = async (
  db: Db,
  userId: string,
  ids: string[],
): Promise<number> => {
  if (!ids.length) return 0;
  const updated = await db
    .update(notifications)
    .set({ readAt: sql`now()` })
    .where(
      and(
        eq(notifications.userId, userId),
        inArray(notifications.id, ids),
        isNull(notifications.readAt),
      ),
    )
    .returning({ id: notifications.id });
  return updated.length;
};

/** Mark all the observer's notifications read; returns the number updated. */
export const markAllNotificationsRead = async (
  db: Db,
  userId: string,
): Promise<number> => {
  const updated = await db
    .update(notifications)
    .set({ readAt: sql`now()` })
    .where(and(eq(notifications.userId, userId), isNull(notifications.readAt)))
    .returning({ id: notifications.id });
  return updated.length;
};
