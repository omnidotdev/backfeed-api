import { relations } from "drizzle-orm";
import { pgTable, text } from "drizzle-orm/pg-core";

import { defaultDate, defaultId } from "./constants";
import { postTable } from "./post.table";
import { upvoteTable } from "./upvote.table";

/**
 * User table.
 */
export const userTable = pgTable("user", {
  id: defaultId(),
  walletAddress: text().unique(),
  createdAt: defaultDate(),
  updatedAt: defaultDate(),
});

/**
 * Relations for the user table.
 */
export const userRelations = relations(userTable, ({ many }) => ({
  posts: many(postTable),
  upvotes: many(upvoteTable),
}));
