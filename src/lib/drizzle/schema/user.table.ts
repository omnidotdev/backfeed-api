import { relations } from "drizzle-orm";
import { integer, pgTable, text } from "drizzle-orm/pg-core";

import { defaultDate } from "./constants";
import { postTable } from "./post.table";
import { upvoteTable } from "./upvote.table";

export const userTable = pgTable("user", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  walletAddress: text().unique(),
  createdAt: defaultDate(),
  updatedAt: defaultDate(),
});

export const userRelations = relations(userTable, ({ many }) => ({
  posts: many(postTable),
  upvotes: many(upvoteTable),
}));
