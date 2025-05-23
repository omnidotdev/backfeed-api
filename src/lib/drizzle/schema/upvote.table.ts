import { index, pgTable, unique, uniqueIndex, uuid } from "drizzle-orm/pg-core";

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
  (table) => [
    unique().on(table.postId, table.userId),
    uniqueIndex().on(table.id),
    index().on(table.postId),
    index().on(table.userId),
  ],
);

/**
 * Type helpers related to the upvote table.
 */
export type InsertUpvote = InferInsertModel<typeof upvotes>;
export type SelectUpvote = InferSelectModel<typeof upvotes>;
