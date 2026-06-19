import { relations, sql } from "drizzle-orm";
import {
  index,
  integer,
  pgEnum,
  pgTable,
  unique,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { generateDefaultDate, generateDefaultId } from "lib/db/util";

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
    id: generateDefaultId(),
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
    // signed weight (+1 up / -1 down) so a post's net score is SUM(weight). Lets
    // PgAggregates expose a VOTES_SUM_WEIGHT order-by (the correct "top voted"
    // ranking) instead of VOTES_COUNT, which counts up + down together.
    weight: integer()
      .notNull()
      .generatedAlwaysAs(sql`(case when vote_type = 'up' then 1 else -1 end)`),
    createdAt: generateDefaultDate(),
    updatedAt: generateDefaultDate(),
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
