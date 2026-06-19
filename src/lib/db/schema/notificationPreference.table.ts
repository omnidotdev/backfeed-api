import { relations } from "drizzle-orm";
import { boolean, pgTable, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { generateDefaultDate, generateDefaultId } from "lib/db/util";

import { users } from "./user.table";

import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

/**
 * Notification preference table. Per-user email notification settings. A missing
 * row means "all defaults on" (notifications are opt-out), so writes only happen
 * when a user changes a setting.
 */
export const notificationPreferences = pgTable(
  "notification_preference",
  {
    id: generateDefaultId(),
    userId: uuid()
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),
    // email the user when a post they reported or voted on changes status
    postUpdates: boolean().notNull().default(true),
    createdAt: generateDefaultDate(),
    updatedAt: generateDefaultDate(),
  },
  (table) => [uniqueIndex().on(table.userId)],
);

/**
 * Notification preference relations.
 */
export const notificationPreferenceRelations = relations(
  notificationPreferences,
  ({ one }) => ({
    user: one(users, {
      fields: [notificationPreferences.userId],
      references: [users.id],
    }),
  }),
);

/**
 * Type helpers related to the notification preference table.
 */
export type InsertNotificationPreference = InferInsertModel<
  typeof notificationPreferences
>;
export type SelectNotificationPreference = InferSelectModel<
  typeof notificationPreferences
>;
