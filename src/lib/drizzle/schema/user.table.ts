import { integer, pgTable, timestamp } from "drizzle-orm/pg-core";

export const userTable = pgTable("user", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  createdAt: timestamp({
    precision: 6,
    mode: "string",
    withTimezone: true,
  }).defaultNow(),
  updatedAt: timestamp({
    precision: 6,
    mode: "string",
    withTimezone: true,
  }).defaultNow(),
});
