import { relations } from "drizzle-orm";
import {
  index,
  integer,
  pgTable,
  text,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { generateDefaultDate, generateDefaultId } from "lib/db/util";

import { projects } from "./project.table";

import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

/**
 * Project links table. Unified table for all project links (website, socials, etc.).
 */
export const projectLinks = pgTable(
  "project_link",
  {
    id: generateDefaultId(),
    projectId: uuid()
      .notNull()
      .references(() => projects.id, {
        onDelete: "cascade",
      }),
    url: text().notNull(),
    title: text(),
    order: integer().notNull().default(0),
    createdAt: generateDefaultDate(),
    updatedAt: generateDefaultDate(),
  },
  (table) => [
    uniqueIndex().on(table.id),
    uniqueIndex().on(table.url, table.projectId),
    index().on(table.projectId),
    index().on(table.url),
  ],
);

/**
 * Project Link relations.
 */
export const projectLinkRelations = relations(projectLinks, ({ one }) => ({
  project: one(projects, {
    fields: [projectLinks.projectId],
    references: [projects.id],
  }),
}));

/**
 * Type helpers related to the project links table.
 */
export type InsertProjectLink = InferInsertModel<typeof projectLinks>;
export type SelectProjectLink = InferSelectModel<typeof projectLinks>;
