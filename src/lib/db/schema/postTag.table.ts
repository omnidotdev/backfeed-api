import { relations } from "drizzle-orm";
import { index, pgTable, unique, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { generateDefaultDate, generateDefaultId } from "lib/db/util";

import { posts } from "./post.table";
import { tags } from "./tag.table";

import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

/**
 * Post tag join table. Assigns tags to posts (many-to-many).
 */
export const postTags = pgTable(
  "post_tag",
  {
    id: generateDefaultId(),
    postId: uuid()
      .notNull()
      .references(() => posts.id, {
        onDelete: "cascade",
      }),
    tagId: uuid()
      .notNull()
      .references(() => tags.id, {
        onDelete: "cascade",
      }),
    createdAt: generateDefaultDate(),
  },
  (table) => [
    uniqueIndex().on(table.id),
    unique("post_tag_post_tag_unique").on(table.postId, table.tagId),
    index().on(table.postId),
    index().on(table.tagId),
  ],
);

/**
 * Post tag relations.
 */
export const postTagRelations = relations(postTags, ({ one }) => ({
  post: one(posts, {
    fields: [postTags.postId],
    references: [posts.id],
  }),
  tag: one(tags, {
    fields: [postTags.tagId],
    references: [tags.id],
  }),
}));

/**
 * Type helpers related to the post tag table.
 */
export type InsertPostTag = InferInsertModel<typeof postTags>;
export type SelectPostTag = InferSelectModel<typeof postTags>;
