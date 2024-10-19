import { integer, pgTable, text } from "drizzle-orm/pg-core";
import { defaultDate } from "./constants";

const organizationTable = pgTable("organization", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text().unique(),
  slug: text().unique(),
  createdAt: defaultDate(),
  updatedAt: defaultDate(),
});

export default organizationTable;
