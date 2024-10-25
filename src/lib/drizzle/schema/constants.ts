import { createId } from "@paralleldrive/cuid2";
import { text, timestamp } from "drizzle-orm/pg-core";

/**
 * Utility function to create a default date column.
 */
export const defaultDate = () =>
  timestamp({
    precision: 6,
    mode: "string",
    withTimezone: true,
  }).defaultNow();

/**
 * Utility function to create a CUID column (Note: this value does not affect the drizzle-kit behavior, it is only used at runtime in drizzle-orm).
 */
export const defaultId = () =>
  text()
    .primaryKey()
    .$defaultFn(() => createId());
