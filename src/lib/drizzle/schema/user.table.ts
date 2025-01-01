import { relations } from "drizzle-orm";
import { pgTable, text, uuid } from "drizzle-orm/pg-core";

import { defaultDate, defaultId } from "./constants";
import { posts } from "./post.table";
import { usersToOrganizations } from "./userToOrganization.table";

import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

/**
 * User table.
 */
export const users = pgTable("user", {
  id: defaultId(),
  // HIDRA ID mapped to `sub` claim
  hidraId: uuid().notNull().unique(),
  username: text().unique(),
  firstName: text(),
  lastName: text(),
  createdAt: defaultDate(),
  updatedAt: defaultDate(),
});

/**
 * Relations for the user table.
 */
export const userRelations = relations(users, ({ many }) => ({
  organizations: many(usersToOrganizations),
  posts: many(posts),
}));

/**
 * Type helpers related to the user table.
 */
export type InsertUser = InferInsertModel<typeof users>;
export type SelectUser = InferSelectModel<typeof users>;
