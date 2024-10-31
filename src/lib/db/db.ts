import { drizzle } from "drizzle-orm/node-postgres";

import { pgClient } from "lib/db/client";
import { pgPool } from "lib/db/pool";
import * as schema from "lib/drizzle/schema";
import { Client as PostgresClient, Pool as PostgresPool } from "pg";

/**
 * Factory to build a database connection client.
 */
const createDbClient = (client: PostgresClient | PostgresPool) =>
  drizzle({
    client,
    schema,
    // ! NB: scripts will fail if the casing is mismatched from this config
    casing: "snake_case",
  });

/**
 * Database connection pool.
 */
export const dbPool = createDbClient(pgPool);

/**
 * Database connection client.
 */
export const dbClient = createDbClient(pgClient);
