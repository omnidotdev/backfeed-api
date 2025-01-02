import { relations } from "drizzle-orm";
import { pgTable, unique, uuid } from "drizzle-orm/pg-core";

import { defaultDate, defaultId } from "./constants";
import { posts } from "./post.table";
import { users } from "./user.table";

import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

/**
 * Downvote table. Downvotes are used to represent negative sentiment on posts.
 */
export const downvotes = pgTable(
  "downvote",
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
 * Relations for the downvote table.
 */
export const downvoteRelations = relations(downvotes, ({ one }) => ({
  post: one(posts, {
    fields: [downvotes.postId],
    references: [posts.id],
  }),
  user: one(users, {
    fields: [downvotes.userId],
    references: [users.id],
  }),
}));

/**
 * Type helpers related to the downvote table.
 */
export type InsertDownvote = InferInsertModel<typeof downvotes>;
export type SelectDownvote = InferSelectModel<typeof downvotes>;
