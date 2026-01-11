import { relations } from "drizzle-orm";
import { index, pgTable, text, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { generateDefaultDate, generateDefaultId } from "lib/db/util";

import { comments } from "./comment.table";
import { projects } from "./project.table";
import { statusTemplates } from "./statusTemplate.table";
import { users } from "./user.table";
import { votes } from "./vote.table";

import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

/**
 * Post table. Posts represent feedback posts.
 */
export const posts = pgTable(
  "post",
  {
    id: generateDefaultId(),
    title: text(),
    description: text(),
    projectId: uuid()
      .notNull()
      .references(() => projects.id, {
        onDelete: "cascade",
      }),
    userId: uuid()
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),
    statusTemplateId: uuid().references(() => statusTemplates.id, {
      onDelete: "set null",
    }),
    statusUpdatedAt: generateDefaultDate(),
    createdAt: generateDefaultDate(),
    updatedAt: generateDefaultDate(),
  },
  (table) => [
    uniqueIndex().on(table.id),
    index().on(table.projectId),
    index().on(table.userId),
    index().on(table.statusTemplateId),
  ],
);

/**
 * Post relations.
 */
export const postRelations = relations(posts, ({ many, one }) => ({
  project: one(projects, {
    fields: [posts.projectId],
    references: [projects.id],
  }),
  user: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
  statusTemplate: one(statusTemplates, {
    fields: [posts.statusTemplateId],
    references: [statusTemplates.id],
  }),
  comments: many(comments),
  votes: many(votes),
}));

/**
 * Type helpers related to the post table.
 */
export type InsertPost = InferInsertModel<typeof posts>;
export type SelectPost = InferSelectModel<typeof posts>;
