import {
  index,
  pgTable,
  text,
  unique,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { defaultDate, defaultId } from "./constants";
import { generateSlug } from "./helpers";
import { organizations } from "./organization.table";

import type { InferInsertModel, InferSelectModel, SQL } from "drizzle-orm";

/**
 * Project table. Projects contain a collection of feedback items and are nested under organizations.
 */
export const projects = pgTable(
  "project",
  {
    id: defaultId(),
    name: text().notNull(),
    image: text(),
    slug: text()
      .generatedAlwaysAs((): SQL => generateSlug(projects.name))
      .notNull(),
    description: text(),
    organizationId: uuid()
      .notNull()
      .references(() => organizations.id, {
        onDelete: "cascade",
      }),
    createdAt: defaultDate(),
    updatedAt: defaultDate(),
  },
  (table) => [
    unique().on(table.slug, table.organizationId),
    uniqueIndex().on(table.id),
    index().on(table.organizationId),
  ]
);

/**
 * Type helpers related to the project table.
 */
export type InsertProject = InferInsertModel<typeof projects>;
export type SelectProject = InferSelectModel<typeof projects>;
