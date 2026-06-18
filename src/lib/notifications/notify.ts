/**
 * Status-change email notifications.
 *
 * When a post's status changes, email the people with a stake in it (reporters
 * and upvoters) so the feedback loop closes. Best-effort: failures are logged,
 * never thrown, and the whole thing no-ops when notifications are unconfigured
 * (the provider is the noop sender).
 */

import { desc, eq } from "drizzle-orm";
import { postStatusChanges, posts } from "lib/db/schema";
import { getStatusChangeRecipients } from "lib/notifications/recipients";

import type { NotificationProvider } from "@omnidotdev/providers";
import type { dbPool } from "lib/db/db";

type Db = typeof dbPool;

interface StatusChangeEmail {
  /** Post key (e.g. `API-42`) or `#42` when the project has no prefix. */
  key: string;
  title: string;
  statusName: string;
  note: string | null;
}

/** Build the subject + plain-text body for a status-change email. */
export const buildStatusChangeEmail = ({
  key,
  title,
  statusName,
  note,
}: StatusChangeEmail): { subject: string; body: string } => {
  const subject = `${key} is now ${statusName}: ${title}`;
  const lines = [
    `"${title}" (${key}) moved to ${statusName}.`,
    ...(note ? ["", note] : []),
    "",
    "You're getting this because you reported or upvoted this feedback.",
  ];
  return { subject, body: lines.join("\n") };
};

/**
 * Notify a post's stakeholders that its status changed. Resolves recipients,
 * builds the email from the post's current status + latest note, and sends one
 * message per recipient. Returns how many were sent (0 when nothing to do).
 */
export const notifyStatusChange = async (
  db: Db,
  notifications: NotificationProvider,
  postId: string,
  actorId: string | null,
): Promise<number> => {
  const post = await db.query.posts.findFirst({
    where: eq(posts.id, postId),
    columns: { title: true, number: true },
    with: {
      project: { columns: { prefix: true } },
      statusTemplate: { columns: { displayName: true } },
    },
  });

  // nothing to announce without a title + a status to announce
  if (!post?.title || !post.statusTemplate?.displayName) return 0;

  const recipients = await getStatusChangeRecipients(db, postId, actorId);
  if (recipients.length === 0) return 0;

  const lastChange = await db.query.postStatusChanges.findFirst({
    where: eq(postStatusChanges.postId, postId),
    orderBy: desc(postStatusChanges.createdAt),
    columns: { note: true },
  });

  const key = post.project?.prefix
    ? `${post.project.prefix}-${post.number}`
    : `#${post.number}`;

  const { subject, body } = buildStatusChangeEmail({
    key,
    title: post.title,
    statusName: post.statusTemplate.displayName,
    note: lastChange?.note ?? null,
  });

  const results = await Promise.allSettled(
    recipients.map((recipient) =>
      notifications.sendEmail({
        to: recipient.email,
        subject,
        body,
        html: false,
      }),
    ),
  );

  return results.filter(
    (result) => result.status === "fulfilled" && result.value.success,
  ).length;
};
