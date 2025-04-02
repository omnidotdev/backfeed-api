import { pgTable, text, uniqueIndex, uuid } from "drizzle-orm/pg-core";

import { defaultDate, defaultId } from "./constants";
import { organizations } from "./organization.table";

import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

/**
 * Invitation table. Stores invitations sent to users for joining an organization.
 */
export const invitations = pgTable(
  "invitation",
  {
    id: defaultId(),
    organizationId: uuid()
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    email: text().notNull(),
    createdAt: defaultDate(),
    updatedAt: defaultDate(),
  },
  (table) => [uniqueIndex().on(table.id)]
);

/**
 * Type helpers related to the invitation table.
 */
export type InsertInvitation = InferInsertModel<typeof invitations>;
export type SelectInvitation = InferSelectModel<typeof invitations>;
