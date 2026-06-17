import { relations } from "drizzle-orm";
import {
  index,
  pgTable,
  text,
  unique,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { generateDefaultDate, generateDefaultId } from "lib/db/util";

import { posts } from "./post.table";
import { users } from "./user.table";

import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

/**
 * Reaction table. Emoji reactions on posts (one row per user per emoji), the
 * GitHub-issue reaction pattern. The emoji is plain text validated app-side.
 */
export const reactions = pgTable(
  "reaction",
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
    emoji: text().notNull(),
    createdAt: generateDefaultDate(),
  },
  (table) => [
    uniqueIndex().on(table.id),
    unique("reaction_post_user_emoji_unique").on(
      table.postId,
      table.userId,
      table.emoji,
    ),
    index().on(table.postId),
    index().on(table.userId),
  ],
);

/**
 * Reaction relations.
 */
export const reactionRelations = relations(reactions, ({ one }) => ({
  post: one(posts, {
    fields: [reactions.postId],
    references: [posts.id],
  }),
  user: one(users, {
    fields: [reactions.userId],
    references: [users.id],
  }),
}));

/**
 * Type helpers related to the reaction table.
 */
export type InsertReaction = InferInsertModel<typeof reactions>;
export type SelectReaction = InferSelectModel<typeof reactions>;
