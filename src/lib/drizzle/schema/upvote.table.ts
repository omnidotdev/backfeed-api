import { relations } from "drizzle-orm";
import { pgTable, unique, uuid } from "drizzle-orm/pg-core";

import { defaultDate, defaultId } from "./constants";
import { postTable } from "./post.table";
import { userTable } from "./user.table";

/**
 * Upvote table.
 */
export const upvoteTable = pgTable(
  "upvote",
  {
    id: defaultId(),
    postId: uuid()
      .notNull()
      .references(() => postTable.id, {
        onDelete: "cascade",
      }),
    userId: uuid()
      .notNull()
      .references(() => userTable.id, {
        onDelete: "cascade",
      }),
    createdAt: defaultDate(),
    updatedAt: defaultDate(),
  },
  (table) => ({
    uniqueUpvote: unique().on(table.postId, table.userId),
  })
);

/**
 * Relations for the upvote table.
 */
export const upvoteRelations = relations(upvoteTable, ({ one }) => ({
  post: one(postTable, {
    fields: [upvoteTable.postId],
    references: [postTable.id],
  }),
  user: one(userTable, {
    fields: [upvoteTable.userId],
    references: [userTable.id],
  }),
}));
