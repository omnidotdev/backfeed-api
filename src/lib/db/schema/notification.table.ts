import { relations } from "drizzle-orm";
import {
  index,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { generateDefaultDate, generateDefaultId } from "lib/db/util";

import { comments } from "./comment.table";
import { posts } from "./post.table";
import { users } from "./user.table";

import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

/**
 * Notification table. Per-user in-app notification records powering the
 * notification center: one row per delivered notification (being @-mentioned,
 * replied to, reacted to, or a post the user follows changing status). `readAt`
 * null means unread. The table is hidden from auto-CRUD (see SmartTag.plugin);
 * it is read and written only through the observer-scoped notification-center
 * plugin so one user can never see another's notifications.
 */
export const notifications = pgTable(
  "notification",
  {
    id: generateDefaultId(),
    // recipient
    userId: uuid()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    // kind, validated app-side: 'mention' | 'reply' | 'reaction' | 'status_change'
    type: text().notNull(),
    // user whose action triggered the notification (null for system events)
    actorId: uuid().references(() => users.id, { onDelete: "cascade" }),
    // deep-link targets (post is set for every kind; comment for comment-scoped kinds)
    postId: uuid().references(() => posts.id, { onDelete: "cascade" }),
    commentId: uuid().references(() => comments.id, { onDelete: "cascade" }),
    // denormalized render bits not derivable from the related rows at read time
    emoji: text(),
    statusName: text(),
    // null until the recipient reads it
    readAt: timestamp({ precision: 6, mode: "string", withTimezone: true }),
    createdAt: generateDefaultDate(),
  },
  (table) => [
    uniqueIndex().on(table.id),
    // newest-first listing for a recipient, and unread-count scans
    index().on(table.userId, table.createdAt),
    index().on(table.userId, table.readAt),
  ],
);

/**
 * Notification relations. Two relations point at `user` (the recipient and the
 * actor), disambiguated by `relationName`.
 */
export const notificationRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
    relationName: "notificationRecipient",
  }),
  actor: one(users, {
    fields: [notifications.actorId],
    references: [users.id],
    relationName: "notificationActor",
  }),
  post: one(posts, {
    fields: [notifications.postId],
    references: [posts.id],
  }),
  comment: one(comments, {
    fields: [notifications.commentId],
    references: [comments.id],
  }),
}));

/**
 * Type helpers related to the notification table.
 */
export type InsertNotification = InferInsertModel<typeof notifications>;
export type SelectNotification = InferSelectModel<typeof notifications>;
