import { relations } from "drizzle-orm";
import {
  index,
  pgEnum,
  pgTable,
  unique,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { defaultDate, defaultId } from "./constants";
import { workspaces } from "./workspace.table";
import { users } from "./user.table";

import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

/**
 * User roles defined for workspaces.
 */
export const role = pgEnum("role", ["owner", "admin", "member"]);

/**
 * Workspace members table.
 */
export const members = pgTable(
  "member",
  {
    id: defaultId(),
    userId: uuid()
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),
    workspaceId: uuid()
      .notNull()
      .references(() => workspaces.id, {
        onDelete: "cascade",
      }),
    role: role().notNull(),
    createdAt: defaultDate(),
  },
  (table) => [
    unique().on(table.userId, table.workspaceId),
    uniqueIndex().on(table.id),
    index().on(table.userId),
    index().on(table.workspaceId),
  ],
);

/**
 * Member relations.
 */
export const memberRelations = relations(members, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [members.workspaceId],
    references: [workspaces.id],
  }),
  user: one(users, {
    fields: [members.userId],
    references: [users.id],
  }),
}));

/**
 * Type helpers related to the members table.
 */
export type InsertMember = InferInsertModel<typeof members>;
export type SelectMember = InferSelectModel<typeof members>;
