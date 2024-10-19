import { integer, pgTable } from "drizzle-orm/pg-core";
import { defaultDate } from "./constants";

export const userTable = pgTable("user", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  createdAt: defaultDate(),
  updatedAt: defaultDate(),
});
