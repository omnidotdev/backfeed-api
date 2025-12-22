import { relations } from "drizzle-orm";
import {
  index,
  pgEnum,
  pgTable,
  unique,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { defaultDate, defaultId } from "./constants";
import { posts } from "./post.table";
import { users } from "./user.table";

import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

/**
 * Vote type enum for distinguishing upvotes from downvotes.
 */
export const voteType = pgEnum("vote_type", ["up", "down"]);

/**
 * Vote table. Unified table for both upvotes and downvotes on posts.
 */
export const votes = pgTable(
  "vote",
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
    voteType: voteType().notNull(),
    createdAt: defaultDate(),
    updatedAt: defaultDate(),
  },
  (table) => [
    uniqueIndex().on(table.id),
    unique().on(table.postId, table.userId),
    index().on(table.postId),
    index().on(table.userId),
    index().on(table.voteType),
  ],
);

/**
 * Vote relations.
 */
export const voteRelations = relations(votes, ({ one }) => ({
  post: one(posts, {
    fields: [votes.postId],
    references: [posts.id],
  }),
  user: one(users, {
    fields: [votes.userId],
    references: [users.id],
  }),
}));

/**
 * Type helpers related to the vote table.
 */
export type InsertVote = InferInsertModel<typeof votes>;
export type SelectVote = InferSelectModel<typeof votes>;
