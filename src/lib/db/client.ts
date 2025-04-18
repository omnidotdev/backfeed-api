import { Client } from "pg";

import { DATABASE_URL } from "lib/config/env.config";

/**
 * Postgres database client.
 * @see https://node-postgres.com/apis/client
 */
export const pgClient = new Client({
  connectionString: DATABASE_URL,
});
