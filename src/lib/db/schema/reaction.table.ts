import { relations, sql } from "drizzle-orm";
import {
  check,
  index,
  pgTable,
  text,
  unique,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { generateDefaultDate, generateDefaultId } from "lib/db/util";

import { comments } from "./comment.table";
import { posts } from "./post.table";
import { users } from "./user.table";

import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

/**
 * Reaction table. Emoji reactions on a post or a comment (one row per user per
 * emoji per target), the GitHub-issue reaction pattern. The target is
 * polymorphic: exactly one of `postId`/`commentId` is set (enforced by a CHECK
 * constraint). The emoji is plain text validated app-side.
 */
export const reactions = pgTable(
  "reaction",
  {
    id: generateDefaultId(),
    postId: uuid().references(() => posts.id, {
      onDelete: "cascade",
    }),
    commentId: uuid().references(() => comments.id, {
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
    unique("reaction_comment_user_emoji_unique").on(
      table.commentId,
      table.userId,
      table.emoji,
    ),
    // exactly one target (post xor comment) must be set
    check(
      "reaction_target_check",
      sql`(${table.postId} IS NOT NULL)::int + (${table.commentId} IS NOT NULL)::int = 1`,
    ),
    index().on(table.postId),
    index().on(table.commentId),
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
  comment: one(comments, {
    fields: [reactions.commentId],
    references: [comments.id],
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
