import {
  index,
  pgEnum,
  pgTable,
  unique,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { defaultDate, defaultId } from "./constants";
import { organizations } from "./organization.table";
import { users } from "./user.table";

import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

/**
 * User roles defined for organizations.
 */
export const role = pgEnum("role", ["owner", "admin", "member"]);

/**
 * Organization members table.
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
    organizationId: uuid()
      .notNull()
      .references(() => organizations.id, {
        onDelete: "cascade",
      }),
    role: role().notNull(),
    createdAt: defaultDate(),
  },
  (table) => [
    unique().on(table.userId, table.organizationId),
    uniqueIndex().on(table.id),
    index().on(table.userId),
    index().on(table.organizationId),
  ],
);

/**
 * Type helpers related to the members table.
 */
export type InsertMember = InferInsertModel<typeof members>;
export type SelectMember = InferSelectModel<typeof members>;
