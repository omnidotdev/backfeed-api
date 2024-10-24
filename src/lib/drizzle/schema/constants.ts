import { timestamp } from "drizzle-orm/pg-core";

/**
 * Utility function to create a default date column.
 */
export const defaultDate = () =>
  timestamp({
    precision: 6,
    mode: "string",
    withTimezone: true,
  }).defaultNow();
