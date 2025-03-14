import {
  index,
  pgEnum,
  pgTable,
  text,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { defaultDate, defaultId } from "./constants";
import { projects } from "./project.table";
import { users } from "./user.table";

import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

/**
 * Statuses for posts.
 */
export const status = pgEnum("status", [
  "open",
  "planned",
  "in_progress",
  "closed",
  "resolved",
]);

/**
 * Post table. Posts reperesent feedback item posts.
 */
export const posts = pgTable(
  "post",
  {
    id: defaultId(),
    title: text(),
    description: text(),
    status: status().notNull().default("open"),
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
    createdAt: defaultDate(),
    updatedAt: defaultDate(),
    statusUpdatedAt: defaultDate(),
  },
  (table) => [
    uniqueIndex().on(table.id),
    index().on(table.projectId),
    index().on(table.userId),
  ]
);

/**
 * Type helpers related to the post table.
 */
export type InsertPost = InferInsertModel<typeof posts>;
export type SelectPost = InferSelectModel<typeof posts>;
