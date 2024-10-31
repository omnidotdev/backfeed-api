import { drizzle } from "drizzle-orm/node-postgres";

import { pgClient } from "lib/db/client";
import { pgPool } from "lib/db/pool";
import * as schema from "lib/drizzle/schema";

/**
 * Database connection pool.
 */
export const dbPool = drizzle({
  client: pgPool,
  schema,
  // !!NB: important to match the casing in the config here. Otherwise, scripts will fail
  casing: "snake_case",
});

/**
 * Database connection client.
 */
export const dbClient = drizzle({
  client: pgClient,
  schema,
  // !!NB: important to match the casing in the config here. Otherwise, scripts will fail
  casing: "snake_case",
});
