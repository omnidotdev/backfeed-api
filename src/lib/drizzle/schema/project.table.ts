import { relations } from "drizzle-orm";
import { integer, pgTable, text, unique } from "drizzle-orm/pg-core";

import { defaultDate } from "./constants";
import { organizationTable } from "./organization.table";
import { postTable } from "./post.table";

export const projectTable = pgTable(
  "project",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: text().unique(),
    image: text(),
    slug: text(),
    description: text(),
    organizationId: integer()
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

export const projectRelations = relations(projectTable, ({ one, many }) => ({
  organization: one(organizationTable, {
    fields: [projectTable.organizationId],
    references: [organizationTable.id],
  }),
  posts: many(postTable),
}));
