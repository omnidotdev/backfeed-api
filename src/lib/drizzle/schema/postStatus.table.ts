import {
  boolean,
  index,
  pgTable,
  text,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { defaultDate, defaultId } from "./constants";

import { projects } from "./project.table";

import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

/**
 * Post status table. Statuses represent feedback item statuses.
 */
export const postStatuses = pgTable(
  "post_status",
  {
    id: defaultId(),
    status: text().notNull().default("open"),
    description: text(),
    color: text(),
    projectId: uuid()
      .notNull()
      .references(() => projects.id, {
        onDelete: "cascade",
      }),
    isDefault: boolean().notNull().default(false),
    createdAt: defaultDate(),
    updatedAt: defaultDate(),
  },
  (table) => [
    // NB: indexes must be unique across all tables. The index for `statusId` in `posts` generates `post_status_id_index` which would cause a conflict with the below.
    uniqueIndex("post_status_unique_id_index").on(table.id),
    uniqueIndex().on(table.status, table.projectId),
    index().on(table.projectId),
  ]
);

/**
 * Type helpers related to the post status table.
 */
export type InsertPostStatus = InferInsertModel<typeof postStatuses>;
export type SelectPostStatus = InferSelectModel<typeof postStatuses>;
