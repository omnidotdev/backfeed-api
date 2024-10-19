import { relations } from "drizzle-orm";
import { integer, pgTable, text } from "drizzle-orm/pg-core";

import { defaultDate } from "./constants";
import { projectTable } from "./project.table";
import { userTable } from "./user.table";

export const postTable = pgTable("post", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: text().unique(),
  description: text(),
  projectId: integer()
    .notNull()
    .references(() => projectTable.id, {
      onDelete: "cascade",
    }),
  userId: integer()
    .notNull()
    .references(() => userTable.id, {
      onDelete: "cascade",
    }),
  createdAt: defaultDate(),
  updatedAt: defaultDate(),
});

export const postRelations = relations(postTable, ({ one }) => ({
  project: one(projectTable, {
    fields: [postTable.projectId],
    references: [projectTable.id],
  }),
  user: one(userTable, {
    fields: [postTable.userId],
    references: [userTable.id],
  }),
}));
