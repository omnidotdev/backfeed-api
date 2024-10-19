import { relations } from "drizzle-orm";
import { integer, pgTable, text } from "drizzle-orm/pg-core";

import { defaultDate } from "./constants";
import organizationTable from "./organization.table";

const projectTable = pgTable("project", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text().unique(),
  slug: text(),
  description: text(),
  organizationId: integer()
    .notNull()
    .references(() => organizationTable.id, {
      onDelete: "cascade",
    }),
  createdAt: defaultDate(),
  updatedAt: defaultDate(),
});

export const projectRelations = relations(projectTable, ({ one }) => ({
  organization: one(organizationTable, {
    fields: [projectTable.organizationId],
    references: [organizationTable.id],
  }),
}));

export default projectTable;
