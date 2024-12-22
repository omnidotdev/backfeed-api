import { relations } from "drizzle-orm";
import { pgTable, unique, uuid } from "drizzle-orm/pg-core";

import { defaultDate, defaultId } from "./constants";
import { posts } from "./post.table";
import { users } from "./user.table";

import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

/**
 * Upvote table. Upvotes are used to represent positive sentiment on posts.
 */
export const upvotes = pgTable(
  "upvote",
  {
    id: defaultId(),
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
  },
  (table) => [unique().on(table.postId, table.userId)]
);

/**
 * Relations for the upvote table.
 */
export const upvoteRelations = relations(upvotes, ({ one }) => ({
  post: one(posts, {
    fields: [upvotes.postId],
    references: [posts.id],
  }),
  user: one(users, {
    fields: [upvotes.userId],
    references: [users.id],
  }),
}));

/**
 * Type helpers related to the upvote table.
 */
export type InsertUpvote = InferInsertModel<typeof upvotes>;
export type SelectUpvote = InferSelectModel<typeof upvotes>;
