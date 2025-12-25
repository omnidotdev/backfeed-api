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

import { defaultDate, defaultId } from "./constants";
import { organizations } from "./organization.table";

import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

/**
 * Status template table. Organization-level status definitions shared across projects.
 */
export const statusTemplates = pgTable(
  "status_template",
  {
    id: defaultId(),
    organizationId: uuid()
      .notNull()
      .references(() => organizations.id, {
        onDelete: "cascade",
      }),
    name: text().notNull(),
    displayName: text().notNull(),
    color: text(),
    description: text(),
    sortOrder: integer().default(0),
    createdAt: defaultDate(),
    updatedAt: defaultDate(),
  },
  (table) => [
    uniqueIndex().on(table.id),
    unique().on(table.organizationId, table.name),
    index().on(table.organizationId),
  ],
);

/**
 * Status template relations.
 */
export const statusTemplateRelations = relations(
  statusTemplates,
  ({ one }) => ({
    organization: one(organizations, {
      fields: [statusTemplates.organizationId],
      references: [organizations.id],
    }),
  }),
);

/**
 * Type helpers related to the status template table.
 */
export type InsertStatusTemplate = InferInsertModel<typeof statusTemplates>;
export type SelectStatusTemplate = InferSelectModel<typeof statusTemplates>;
