import { relations } from "drizzle-orm";
import {
  index,
  pgTable,
  text,
  timestamp,
  unique,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { generateDefaultDate, generateDefaultId } from "lib/db/util";

import { posts } from "./post.table";

import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

/**
 * Post reference table. One edge per #N reference found in a post description or
 * comment body: a directed link from a source (post or comment) to a target
 * post. `refKind` distinguishes a plain cross-reference from a magic-word
 * keyword; `firedAt` marks a magic-word edge whose status transition has already
 * fired, so edits never re-fire (GitHub's fire-once-on-merge analog).
 */
export const postReferences = pgTable(
  "post_reference",
  {
    id: generateDefaultId(),
    // "post" | "comment" (app-validated, not pgEnum per house rules)
    sourceType: text().notNull(),
    sourceId: uuid().notNull(),
    targetPostId: uuid()
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    // "reference" | "magicword"
    refKind: text().notNull(),
    // canonical magic keyword (close|fix|resolve) when refKind = "magicword"
    keyword: text(),
    // set when a magicword transition has fired; null = not yet fired
    firedAt: timestamp({ precision: 6, mode: "string", withTimezone: true }),
    organizationId: text().notNull(),
    createdAt: generateDefaultDate(),
    updatedAt: generateDefaultDate(),
  },
  (table) => [
    uniqueIndex().on(table.id),
    unique("post_reference_edge_unique").on(
      table.sourceType,
      table.sourceId,
      table.targetPostId,
      table.keyword,
    ),
    index("post_reference_target_idx").on(table.targetPostId),
    index("post_reference_source_idx").on(table.sourceType, table.sourceId),
    index("post_reference_organization_id_idx").on(table.organizationId),
  ],
);

export const postReferenceRelations = relations(postReferences, ({ one }) => ({
  targetPost: one(posts, {
    fields: [postReferences.targetPostId],
    references: [posts.id],
  }),
}));

export type InsertPostReference = InferInsertModel<typeof postReferences>;
export type SelectPostReference = InferSelectModel<typeof postReferences>;
