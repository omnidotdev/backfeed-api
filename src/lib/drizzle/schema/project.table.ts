import { relations } from "drizzle-orm";
import { pgTable, text, unique, uuid } from "drizzle-orm/pg-core";

import { defaultDate, defaultId } from "./constants";
import { organizations } from "./organization.table";
import { posts } from "./post.table";

import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

/**
 * Project table.
 */
export const projects = pgTable(
  "project",
  {
    id: defaultId(),
    name: text().unique(),
    image: text(),
    slug: text(),
    description: text(),
    organizationId: uuid()
      .notNull()
      .references(() => organizations.id, {
        onDelete: "cascade",
      }),
    createdAt: defaultDate(),
    updatedAt: defaultDate(),
  },
  (table) => ({
    uniqueSlug: unique().on(table.slug, table.organizationId),
  })
);

/**
 * Relations for the project table.
 */
export const projectRelations = relations(projects, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [projects.organizationId],
    references: [organizations.id],
  }),
  posts: many(posts),
}));

/**
 * Type helpers related to the project table.
 */
export type InsertProject = InferInsertModel<typeof projects>;
export type SelectProject = InferSelectModel<typeof projects>;
