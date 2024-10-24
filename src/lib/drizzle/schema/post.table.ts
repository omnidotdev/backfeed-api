import { relations } from "drizzle-orm";
import { integer, pgTable, text } from "drizzle-orm/pg-core";

import { defaultDate } from "./constants";
import { projectTable } from "./project.table";
import { upvoteTable } from "./upvote.table";
import { userTable } from "./user.table";

/**
 * Post table.
 */
export const postTable = pgTable("post", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  // TODO: discuss if this should be unique
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

/**
 * Relations for the post table.
 */
export const postRelations = relations(postTable, ({ one, many }) => ({
  project: one(projectTable, {
    fields: [postTable.projectId],
    references: [projectTable.id],
  }),
  user: one(userTable, {
    fields: [postTable.userId],
    references: [userTable.id],
  }),
  upvotes: many(upvoteTable),
}));
