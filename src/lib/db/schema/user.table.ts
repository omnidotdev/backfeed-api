import { relations } from "drizzle-orm";
import { pgTable, text, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { generateDefaultDate, generateDefaultId } from "lib/db/util";

import { comments } from "./comment.table";
import { posts } from "./post.table";
import { votes } from "./vote.table";

import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

/**
 * User table.
 */
export const users = pgTable(
  "user",
  {
    id: generateDefaultId(),
    // identity provider ID mapped to `sub` claim from ID token
    identityProviderId: uuid().notNull().unique(),
    // full name from OIDC `name` claim
    name: text().notNull(),
    // username from OIDC `preferred_username` claim
    username: text().unique(),
    // avatar URL from OIDC `picture` claim
    avatarUrl: text(),
    email: text().notNull().unique(),
    createdAt: generateDefaultDate(),
    updatedAt: generateDefaultDate(),
  },
  (table) => [
    uniqueIndex().on(table.id),
    uniqueIndex().on(table.identityProviderId),
  ],
);

/**
 * User relations.
 */
export const userRelations = relations(users, ({ many }) => ({
  comments: many(comments),
  votes: many(votes),
  posts: many(posts),
}));

/**
 * Type helpers related to the user table.
 */
export type InsertUser = InferInsertModel<typeof users>;
export type SelectUser = InferSelectModel<typeof users>;
