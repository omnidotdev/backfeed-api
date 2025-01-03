import { pgTable, text, uuid } from "drizzle-orm/pg-core";

import { defaultDate, defaultId } from "./constants";
import { projects } from "./project.table";
import { users } from "./user.table";

import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

/**
 * Post table. Posts reperesent feedback item posts.
 */
export const posts = pgTable("post", {
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
  createdAt: defaultDate(),
  updatedAt: defaultDate(),
});


/**
 * Type helpers related to the post table.
 */
export type InsertPost = InferInsertModel<typeof posts>;
export type SelectPost = InferSelectModel<typeof posts>;
