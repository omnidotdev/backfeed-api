import { relations } from "drizzle-orm";
import { pgTable, text } from "drizzle-orm/pg-core";

import { defaultDate, defaultId } from "./constants";
import { projects } from "./project.table";
import { users } from "./user.table";

import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

/**
 * Organization table. Organizations are used to group projects together and contain a set of users.
 */
export const organizations = pgTable("organization", {
  id: defaultId(),
  name: text().unique(),
  slug: text().unique(),
  createdAt: defaultDate(),
  updatedAt: defaultDate(),
});

/**
 * Relations for the organization table.
 */
export const organizationRelations = relations(organizations, ({ many }) => ({
  projects: many(projects),
  users: many(users),
}));

/**
 * Type helpers related to the organization table.
 */
export type InsertOrganization = InferInsertModel<typeof organizations>;
export type SelectOrganization = InferSelectModel<typeof organizations>;
