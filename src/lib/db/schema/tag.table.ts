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

import { postTags } from "./postTag.table";
import { projects } from "./project.table";

import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

/**
 * Tag table. Per-project labels (GitHub-issue-style) used to categorize posts.
 */
export const tags = pgTable(
  "tag",
  {
    id: generateDefaultId(),
    projectId: uuid()
      .notNull()
      .references(() => projects.id, {
        onDelete: "cascade",
      }),
    name: text().notNull(),
    // Display color, typically a hex string (e.g. "#22c55e")
    color: text(),
    createdAt: generateDefaultDate(),
    updatedAt: generateDefaultDate(),
  },
  (table) => [
    uniqueIndex().on(table.id),
    unique("tag_project_name_unique").on(table.projectId, table.name),
    index().on(table.projectId),
  ],
);

/**
 * Tag relations.
 */
export const tagRelations = relations(tags, ({ one, many }) => ({
  project: one(projects, {
    fields: [tags.projectId],
    references: [projects.id],
  }),
  postTags: many(postTags),
}));

/**
 * Type helpers related to the tag table.
 */
export type InsertTag = InferInsertModel<typeof tags>;
export type SelectTag = InferSelectModel<typeof tags>;
