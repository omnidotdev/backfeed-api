import { relations } from "drizzle-orm";
import { pgTable, text, uniqueIndex, uuid } from "drizzle-orm/pg-core";

import { comments } from "./comment.table";
import { defaultDate, defaultId } from "./constants";
import { members } from "./member.table";
import { posts } from "./post.table";
import { votes } from "./vote.table";

import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

/**
 * User table.
 */
export const users = pgTable(
  "user",
  {
    id: defaultId(),
    // identity provider ID mapped to `sub` claim from ID token
    identityProviderId: uuid().notNull().unique(),
    username: text().unique(),
    firstName: text(),
    lastName: text(),
    email: text().notNull().unique(),
    createdAt: defaultDate(),
    updatedAt: defaultDate(),
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
  memberships: many(members),
  comments: many(comments),
  votes: many(votes),
  posts: many(posts),
}));

/**
 * Type helpers related to the user table.
 */
export type InsertUser = InferInsertModel<typeof users>;
export type SelectUser = InferSelectModel<typeof users>;
