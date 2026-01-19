import { relations } from "drizzle-orm";
import {
  index,
  integer,
  pgTable,
  text,
  unique,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { generateDefaultDate, generateDefaultId } from "lib/db/util";

import { posts } from "./post.table";
import { projectLinks } from "./projectLink.table";
import { projectStatusConfigs } from "./projectStatusConfig.table";

import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

/**
 * Project table. Projects contain a collection of feedback.
 *
 * Organization identity (name, slug) is owned by Gatekeeper (IDP).
 * The organizationId references the IDP organization directly.
 * Org name/slug are resolved from JWT claims at runtime, not stored here.
 */
export const projects = pgTable(
  "project",
  {
    id: generateDefaultId(),
    name: text().notNull(),
    image: text(),
    slug: text().notNull(),
    description: text(),
    // Direct reference to IDP organization - validated via JWT claims
    organizationId: text("organization_id").notNull(),
    // Counter for auto-incrementing post numbers within this project
    nextPostNumber: integer("next_post_number").notNull().default(1),
    createdAt: generateDefaultDate(),
    updatedAt: generateDefaultDate(),
  },
  (table) => [
    // Slug must be unique within an organization
    unique("project_org_slug_idx").on(table.slug, table.organizationId),
    uniqueIndex().on(table.id),
    index("project_organization_id_idx").on(table.organizationId),
  ],
);

/**
 * Project relations.
 */
export const projectRelations = relations(projects, ({ many }) => ({
  posts: many(posts),
  links: many(projectLinks),
  statusConfigs: many(projectStatusConfigs),
}));

/**
 * Type helpers related to the project table.
 */
export type InsertProject = InferInsertModel<typeof projects>;
export type SelectProject = InferSelectModel<typeof projects>;
