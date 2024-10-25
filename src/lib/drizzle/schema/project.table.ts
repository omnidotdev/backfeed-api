import { relations } from "drizzle-orm";
import { pgTable, text, unique, uuid } from "drizzle-orm/pg-core";

import { defaultDate, defaultId } from "./constants";
import { organizationTable } from "./organization.table";
import { postTable } from "./post.table";

/**
 * Project table.
 */
export const projectTable = pgTable(
  "project",
  {
    id: defaultId(),
    name: text().unique(),
    image: text(),
    slug: text(),
    description: text(),
    organizationId: uuid()
      .notNull()
      .references(() => organizationTable.id, {
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
export const projectRelations = relations(projectTable, ({ one, many }) => ({
  organization: one(organizationTable, {
    fields: [projectTable.organizationId],
    references: [organizationTable.id],
  }),
  posts: many(postTable),
}));
