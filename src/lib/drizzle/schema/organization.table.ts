import { relations } from "drizzle-orm";
import { pgTable, text } from "drizzle-orm/pg-core";

import { defaultDate, defaultId } from "./constants";
import { projectTable } from "./project.table";

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
