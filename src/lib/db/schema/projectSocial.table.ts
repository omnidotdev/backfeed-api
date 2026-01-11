import { relations } from "drizzle-orm";
import { index, pgTable, text, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { generateDefaultDate, generateDefaultId } from "lib/db/util";

import { projects } from "./project.table";

import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

/**
 * Project socials table.
 */
export const projectSocials = pgTable(
  "project_social",
  {
    id: generateDefaultId(),
    projectId: uuid()
      .notNull()
      .references(() => projects.id, {
        onDelete: "cascade",
      }),
    url: text().notNull(),
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
 * Project Social relations.
 */
export const projectSocialRelations = relations(projectSocials, ({ one }) => ({
  project: one(projects, {
    fields: [projectSocials.projectId],
    references: [projects.id],
  }),
}));

/**
 * Type helpers related to the project socials table.
 */
export type InsertProjectSocial = InferInsertModel<typeof projectSocials>;
export type SelectProjectSocial = InferSelectModel<typeof projectSocials>;
