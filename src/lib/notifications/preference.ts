/**
 * Notification preferences.
 *
 * Per-user email settings, stored sparsely (a missing row means all defaults
 * on, so notifications are opt-out). Read returns the effective settings with
 * defaults applied; write upserts the user's row.
 */

import { eq } from "drizzle-orm";
import { notificationPreferences } from "lib/db/schema";

import type { dbPool } from "lib/db/db";

type Db = typeof dbPool;

/** Effective notification settings for a user. */
interface NotificationPreference {
  postUpdates: boolean;
}

/** Defaults applied when a user has no preference row yet (opt-out model). */
const DEFAULTS: NotificationPreference = { postUpdates: true };

/** Read a user's effective notification preferences (defaults applied). */
export const getNotificationPreference = async (
  db: Db,
  userId: string,
): Promise<NotificationPreference> => {
  const row = await db.query.notificationPreferences.findFirst({
    where: eq(notificationPreferences.userId, userId),
    columns: { postUpdates: true },
  });

  return { postUpdates: row?.postUpdates ?? DEFAULTS.postUpdates };
};

/** Upsert a user's notification preferences, returning the new effective settings. */
export const setNotificationPreference = async (
  db: Db,
  userId: string,
  patch: Partial<NotificationPreference>,
): Promise<NotificationPreference> => {
  const postUpdates = patch.postUpdates ?? DEFAULTS.postUpdates;

  const [row] = await db
    .insert(notificationPreferences)
    .values({ userId, postUpdates })
    .onConflictDoUpdate({
      target: notificationPreferences.userId,
      set: { postUpdates },
    })
    .returning({ postUpdates: notificationPreferences.postUpdates });

  return { postUpdates: row?.postUpdates ?? postUpdates };
};
