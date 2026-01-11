import { relations } from "drizzle-orm";
import {
  index,
  integer,
  pgTable,
  text,
  unique,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { generateDefaultDate, generateDefaultId } from "lib/db/util";

import { workspaces } from "./workspace.table";

import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

/**
 * Status template table. Workspace-level status definitions shared across projects.
 */
export const statusTemplates = pgTable(
  "status_template",
  {
    id: generateDefaultId(),
    workspaceId: uuid()
      .notNull()
      .references(() => workspaces.id, {
        onDelete: "cascade",
      }),
    name: text().notNull(),
    displayName: text().notNull(),
    color: text(),
    description: text(),
    sortOrder: integer().default(0),
    createdAt: generateDefaultDate(),
    updatedAt: generateDefaultDate(),
  },
  (table) => [
    uniqueIndex().on(table.id),
    unique().on(table.workspaceId, table.name),
    index().on(table.workspaceId),
  ],
);

/**
 * Status template relations.
 */
export const statusTemplateRelations = relations(
  statusTemplates,
  ({ one }) => ({
    workspace: one(workspaces, {
      fields: [statusTemplates.workspaceId],
      references: [workspaces.id],
    }),
  }),
);

/**
 * Type helpers related to the status template table.
 */
export type InsertStatusTemplate = InferInsertModel<typeof statusTemplates>;
export type SelectStatusTemplate = InferSelectModel<typeof statusTemplates>;
