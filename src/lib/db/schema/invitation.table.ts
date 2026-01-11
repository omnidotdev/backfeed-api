import { relations } from "drizzle-orm";
import {
  index,
  pgTable,
  text,
  unique,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { generateDefaultDate, generateDefaultId } from "lib/db/util";

import { workspaces } from "./workspace.table";

import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

/**
 * Invitation table. Stores invitations sent to users for joining a workspace.
 */
export const invitations = pgTable(
  "invitation",
  {
    id: generateDefaultId(),
    workspaceId: uuid()
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    email: text().notNull(),
    createdAt: generateDefaultDate(),
    updatedAt: generateDefaultDate(),
  },
  (table) => [
    uniqueIndex().on(table.id),
    unique().on(table.workspaceId, table.email),
    index().on(table.workspaceId),
  ],
);

/**
 * Invitation relations.
 */
export const invitationRelations = relations(invitations, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [invitations.workspaceId],
    references: [workspaces.id],
  }),
}));

/**
 * Type helpers related to the invitation table.
 */
export type InsertInvitation = InferInsertModel<typeof invitations>;
export type SelectInvitation = InferSelectModel<typeof invitations>;
