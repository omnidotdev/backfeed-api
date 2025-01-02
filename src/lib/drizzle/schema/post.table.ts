import { relations } from "drizzle-orm";
import { pgTable, text, uuid } from "drizzle-orm/pg-core";

import { comments } from "./comment.table";
import { defaultDate, defaultId } from "./constants";
import { downvotes } from "./downvote.table";
import { projects } from "./project.table";
import { upvotes } from "./upvote.table";
import { users } from "./user.table";

import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

/**
 * Post table. Posts reperesent feedback item posts.
 */
export const posts = pgTable("post", {
  id: defaultId(),
  title: text(),
  description: text(),
  projectId: uuid()
    .notNull()
    .references(() => projects.id, {
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
 * Relations for the post table.
 */
export const postRelations = relations(posts, ({ one, many }) => ({
  project: one(projects, {
    fields: [posts.projectId],
    references: [projects.id],
  }),
  user: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
  comments: many(comments),
  upvotes: many(upvotes),
  downvotes: many(downvotes),
}));

/**
 * Type helpers related to the post table.
 */
export type InsertPost = InferInsertModel<typeof posts>;
export type SelectPost = InferSelectModel<typeof posts>;
