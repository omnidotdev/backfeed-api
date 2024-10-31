import { relations } from "drizzle-orm";
import { pgTable, text } from "drizzle-orm/pg-core";

import { defaultDate, defaultId } from "./constants";
import { posts } from "./post.table";
import { upvotes } from "./upvote.table";

import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

/**
 * User table.
 */
export const users = pgTable("user", {
  id: defaultId(),
  // TODO refactor to HIDRA ID, currently here for testing
  walletAddress: text().unique(),
  createdAt: defaultDate(),
  updatedAt: defaultDate(),
});

/**
 * Relations for the user table.
 */
export const userRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  upvotes: many(upvotes),
}));

/**
 * Type helpers related to the user table.
 */
export type InsertUser = InferInsertModel<typeof users>;
export type SelectUser = InferSelectModel<typeof users>;
