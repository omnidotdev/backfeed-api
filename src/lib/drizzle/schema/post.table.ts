import { index, pgTable, text, uniqueIndex, uuid } from "drizzle-orm/pg-core";

import { defaultDate, defaultId } from "./constants";
import { postStatuses } from "./postStatus.table";
import { projects } from "./project.table";
import { users } from "./user.table";

import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

/**
 * Post table. Posts represent feedback item posts.
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
 * Type helpers related to the post table.
 */
export type InsertPost = InferInsertModel<typeof posts>;
export type SelectPost = InferSelectModel<typeof posts>;
