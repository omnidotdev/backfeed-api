import { relations } from "drizzle-orm";
import { integer, pgTable } from "drizzle-orm/pg-core";

import { defaultDate } from "./constants";
import { postTable } from "./post.table";

export const userTable = pgTable("user", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  createdAt: defaultDate(),
  updatedAt: defaultDate(),
});

export const userRelations = relations(userTable, ({ many }) => ({
  posts: many(postTable),
}));
