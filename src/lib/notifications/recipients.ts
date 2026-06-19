/**
 * Status-change notification recipients.
 *
 * The people to notify when a post's status changes are those with a stake in
 * it: the reporters behind its signals and everyone who upvoted it. Recipients
 * who turned off post-update emails (notification_preference.postUpdates =
 * false) and the actor who made the change are excluded.
 */

import { and, eq, inArray, isNotNull } from "drizzle-orm";
import { notificationPreferences, signals, users, votes } from "lib/db/schema";

import type { dbPool } from "lib/db/db";

type Db = typeof dbPool;

/** A person to email about a status change. */
interface Recipient {
  id: string;
  email: string;
}

/**
 * Resolve the distinct, opted-in recipients for a post's status change: its
 * upvoters and signal reporters, minus the actor and anyone who opted out.
 */
export const getStatusChangeRecipients = async (
  db: Db,
  postId: string,
  actorId: string | null,
): Promise<Recipient[]> => {
  const [upvoters, reporters] = await Promise.all([
    db
      .select({ userId: votes.userId })
      .from(votes)
      .where(and(eq(votes.postId, postId), eq(votes.voteType, "up"))),
    db
      .select({ userId: signals.userId })
      .from(signals)
      .where(and(eq(signals.postId, postId), isNotNull(signals.userId))),
  ]);

  const userIds = new Set<string>();
  for (const { userId } of upvoters) userIds.add(userId);
  for (const { userId } of reporters) if (userId) userIds.add(userId);
  if (actorId) userIds.delete(actorId);

  if (userIds.size === 0) return [];

  // join the (sparse) preference rows; a missing row means defaults-on
  const rows = await db
    .select({
      id: users.id,
      email: users.email,
      postUpdates: notificationPreferences.postUpdates,
    })
    .from(users)
    .leftJoin(
      notificationPreferences,
      eq(notificationPreferences.userId, users.id),
    )
    .where(inArray(users.id, [...userIds]));

  return rows
    .filter((row) => row.postUpdates !== false && !!row.email)
    .map((row) => ({ id: row.id, email: row.email }));
};
