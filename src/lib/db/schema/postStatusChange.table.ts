import { relations } from "drizzle-orm";
import { index, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { generateDefaultDate, generateDefaultId } from "lib/db/util";

import { posts } from "./post.table";
import { statusTemplates } from "./statusTemplate.table";
import { users } from "./user.table";

import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

/**
 * Post status change table. An append-only log of a post's status transitions,
 * one row per change, forming a GitHub-issue-style status timeline. Each row
 * records the status the post moved to (the previous row's `toStatusTemplateId`
 * is the implicit "from"); `toStatusTemplateId` is null when the post was moved
 * back to no status. Written app-side on `updatePost` (see PostStatusHistory
 * plugin), deduped against the latest entry.
 */
export const postStatusChanges = pgTable(
  "post_status_change",
  {
    id: generateDefaultId(),
    postId: uuid()
      .notNull()
      .references(() => posts.id, {
        onDelete: "cascade",
      }),
    toStatusTemplateId: uuid().references(() => statusTemplates.id, {
      onDelete: "set null",
    }),
    changedById: uuid().references(() => users.id, {
      onDelete: "set null",
    }),
    // optional admin note explaining the change, shown alongside it in the
    // timeline (e.g. "shipping next release", "merged into #42")
    note: text(),
    createdAt: generateDefaultDate(),
  },
  (table) => [index().on(table.postId)],
);

/**
 * Post status change relations.
 */
export const postStatusChangeRelations = relations(
  postStatusChanges,
  ({ one }) => ({
    post: one(posts, {
      fields: [postStatusChanges.postId],
      references: [posts.id],
    }),
    toStatusTemplate: one(statusTemplates, {
      fields: [postStatusChanges.toStatusTemplateId],
      references: [statusTemplates.id],
    }),
    changedBy: one(users, {
      fields: [postStatusChanges.changedById],
      references: [users.id],
    }),
  }),
);

/**
 * Type helpers related to the post status change table.
 */
export type InsertPostStatusChange = InferInsertModel<typeof postStatusChanges>;
export type SelectPostStatusChange = InferSelectModel<typeof postStatusChanges>;
