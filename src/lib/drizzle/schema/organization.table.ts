import { relations } from "drizzle-orm";
import { pgTable, text } from "drizzle-orm/pg-core";

import { defaultDate, defaultId } from "./constants";
import { projectTable } from "./project.table";

import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

/**
 * Organization table.
 */
export const organizationTable = pgTable("organization", {
  id: defaultId(),
  name: text().unique(),
  slug: text().unique(),
  createdAt: defaultDate(),
  updatedAt: defaultDate(),
});

/**
 * Relations for the organization table.
 */
export const organizationRelations = relations(
  organizationTable,
  ({ many }) => ({
    projects: many(projectTable),
  })
);

/**
 * Type helpers related to the organization table.
 */
export type InsertOrganization = InferInsertModel<typeof organizationTable>;
export type SelectOrganization = InferSelectModel<typeof organizationTable>;
