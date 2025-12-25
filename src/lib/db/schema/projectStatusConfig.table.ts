import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  unique,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { defaultDate, defaultId } from "./constants";
import { projects } from "./project.table";
import { statusTemplates } from "./statusTemplate.table";

import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

/**
 * Project status config table. Per-project customizations for status templates.
 */
export const projectStatusConfigs = pgTable(
  "project_status_config",
  {
    id: defaultId(),
    projectId: uuid()
      .notNull()
      .references(() => projects.id, {
        onDelete: "cascade",
      }),
    statusTemplateId: uuid()
      .notNull()
      .references(() => statusTemplates.id, {
        onDelete: "cascade",
      }),
    customColor: text(),
    customDescription: text(),
    isEnabled: boolean().default(true),
    isDefault: boolean().default(false),
    sortOrder: integer(),
    createdAt: defaultDate(),
  },
  (table) => [
    uniqueIndex().on(table.id),
    unique().on(table.projectId, table.statusTemplateId),
    index().on(table.projectId),
    index().on(table.statusTemplateId),
  ],
);

/**
 * Project status config relations.
 */
export const projectStatusConfigRelations = relations(
  projectStatusConfigs,
  ({ one }) => ({
    project: one(projects, {
      fields: [projectStatusConfigs.projectId],
      references: [projects.id],
    }),
    statusTemplate: one(statusTemplates, {
      fields: [projectStatusConfigs.statusTemplateId],
      references: [statusTemplates.id],
    }),
  }),
);

/**
 * Type helpers related to the project status config table.
 */
export type InsertProjectStatusConfig = InferInsertModel<
  typeof projectStatusConfigs
>;
export type SelectProjectStatusConfig = InferSelectModel<
  typeof projectStatusConfigs
>;
