import { relations } from "drizzle-orm";
import { pgTable, text, uuid } from "drizzle-orm/pg-core";

import { defaultDate, defaultId } from "./constants";
import { posts } from "./post.table";
import { users } from "./user.table";

import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

/**
 * Comment table. Comments serve as units of feedback item discourse.
 */
export const comments = pgTable("comment", {
  id: defaultId(),
  message: text(),
  postId: uuid()
    .notNull()
    .references(() => posts.id, {
      onDelete: "cascade",
    }),
  userId: uuid()
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
    }),
  createdAt: defaultDate(),
  updatedAt: defaultDate(),
});

/**
 * Relations for the comment table.
 */
export const commentRelations = relations(comments, ({ one }) => ({
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.id],
  }),
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
}));

/**
 * Type helpers related to the comment table.
 */
export type InsertComment = InferInsertModel<typeof comments>;
export type SelectComment = InferSelectModel<typeof comments>;
