import { relations } from "drizzle-orm";
import { pgTable, text, uuid } from "drizzle-orm/pg-core";

import { defaultDate, defaultId } from "./constants";
import { projectTable } from "./project.table";
import { upvoteTable } from "./upvote.table";
import { userTable } from "./user.table";

import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

/**
 * Post table.
 */
export const postTable = pgTable("post", {
  id: defaultId(),
  // TODO: discuss if this should be unique
  title: text().unique(),
  description: text(),
  projectId: uuid()
    .notNull()
    .references(() => projectTable.id, {
      onDelete: "cascade",
    }),
  userId: uuid()
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

/**
 * Type helpers related to the post table.
 */
export type InsertPost = InferInsertModel<typeof postTable>;
export type SelectPost = InferSelectModel<typeof postTable>;
