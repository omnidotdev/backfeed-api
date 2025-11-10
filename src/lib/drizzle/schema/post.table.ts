import { relations } from "drizzle-orm";
import { index, pgTable, text, uniqueIndex, uuid } from "drizzle-orm/pg-core";

import { comments } from "./comment.table";
import { defaultDate, defaultId } from "./constants";
import { postStatuses } from "./postStatus.table";
import { projects } from "./project.table";
import { users } from "./user.table";

import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

/**
 * Post table. Posts represent feedback posts.
 */
export const posts = pgTable(
  "post",
  {
    id: defaultId(),
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
    statusId: uuid().references(() => postStatuses.id, {
      onDelete: "set null",
    }),
    statusUpdatedAt: defaultDate(),
    createdAt: defaultDate(),
    updatedAt: defaultDate(),
  },
  (table) => [
    uniqueIndex().on(table.id),
    index().on(table.projectId),
    index().on(table.userId),
    index().on(table.statusId),
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
  status: one(postStatuses, {
    fields: [posts.statusId],
    references: [postStatuses.id],
  }),
  comments: many(comments),
}));

/**
 * Type helpers related to the post table.
 */
export type InsertPost = InferInsertModel<typeof posts>;
export type SelectPost = InferSelectModel<typeof posts>;
