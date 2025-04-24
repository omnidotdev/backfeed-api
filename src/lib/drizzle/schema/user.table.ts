import { pgEnum, pgTable, text, uniqueIndex, uuid } from "drizzle-orm/pg-core";

import { defaultDate, defaultId } from "./constants";

import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

/**
 * Subscription tiers defined for users.
 */
export const tier = pgEnum("tier", ["basic", "team", "enterprise"]);

/**
 * User table.
 */
export const users = pgTable(
  "user",
  {
    id: defaultId(),
    // HIDRA ID mapped to `sub` claim
    hidraId: uuid().notNull().unique(),
    username: text().unique(),
    tier: tier(),
    firstName: text(),
    lastName: text(),
    email: text().notNull().unique(),
    createdAt: defaultDate(),
    updatedAt: defaultDate(),
  },
  (table) => [uniqueIndex().on(table.id), uniqueIndex().on(table.hidraId)],
);

/**
 * Type helpers related to the user table.
 */
export type InsertUser = InferInsertModel<typeof users>;
export type SelectUser = InferSelectModel<typeof users>;
