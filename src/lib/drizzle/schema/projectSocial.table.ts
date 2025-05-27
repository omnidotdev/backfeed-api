import { index, pgTable, text, uniqueIndex, uuid } from "drizzle-orm/pg-core";

import { defaultDate, defaultId } from "./constants";

import { projects } from "./project.table";

import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

/**
 * Project socials table.
 */
export const projectSocials = pgTable(
  "project_social",
  {
    id: defaultId(),
    projectId: uuid()
      .notNull()
      .references(() => projects.id, {
        onDelete: "cascade",
      }),
    url: text().notNull(),
    createdAt: defaultDate(),
    updatedAt: defaultDate(),
  },
  (table) => [
    uniqueIndex().on(table.id),
    uniqueIndex().on(table.url, table.projectId),
    index().on(table.projectId),
    index().on(table.url),
  ],
);

/**
 * Type helpers related to the project socials table.
 */
export type InsertProjectSocial = InferInsertModel<typeof projectSocials>;
export type SelectProjectSocial = InferSelectModel<typeof projectSocials>;
