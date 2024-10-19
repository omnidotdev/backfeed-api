import { timestamp } from "drizzle-orm/pg-core";

export const defaultDate = () =>
  timestamp({
    precision: 6,
    mode: "string",
    withTimezone: true,
  }).defaultNow();
