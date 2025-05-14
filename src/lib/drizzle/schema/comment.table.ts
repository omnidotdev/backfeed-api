import { index, pgTable, text, uniqueIndex, uuid } from "drizzle-orm/pg-core";

import { defaultDate, defaultId } from "./constants";
import { posts } from "./post.table";
import { users } from "./user.table";

import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import type { AnyPgColumn } from "drizzle-orm/pg-core";

/**
 * Comment table. Comments serve as units of feedback discourse.
 */
export const comments = pgTable(
  "comment",
  {
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
    parentId: uuid().references((): AnyPgColumn => comments.id, {
      onDelete: "cascade",
    }),
    createdAt: defaultDate(),
    updatedAt: defaultDate(),
  },
  (table) => [
    uniqueIndex().on(table.id),
    index().on(table.postId),
    index().on(table.userId),
  ],
);

/**
 * Type helpers related to the comment table.
 */
export type InsertComment = InferInsertModel<typeof comments>;
export type SelectComment = InferSelectModel<typeof comments>;
