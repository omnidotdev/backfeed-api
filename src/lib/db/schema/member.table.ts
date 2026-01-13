import { relations } from "drizzle-orm";
import {
  index,
  pgEnum,
  pgTable,
  unique,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { generateDefaultDate, generateDefaultId } from "lib/db/util";

import { users } from "./user.table";
import { workspaces } from "./workspace.table";

import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

/**
 * User roles defined for workspaces.
 */
export const role = pgEnum("role", ["owner", "admin", "member"]);

/**
 * Workspace members table.
 *
 * This table manages workspace-level access control, which is distinct from
 * IDP organization membership. A user must be an IDP org member to access
 * any workspace, but workspace membership controls which specific workspaces
 * within that org the user can access.
 *
 * IDP org membership: "Can this user access this organization's apps?"
 * Workspace membership: "Which workspaces within the org can this user see?"
 */
export const members = pgTable(
  "member",
  {
    id: generateDefaultId(),
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
    createdAt: generateDefaultDate(),
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
