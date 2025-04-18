import { Pool } from "pg";

import { DATABASE_URL } from "lib/config/env.config";

/**
 * Postgres database pool.
 * @see https://node-postgres.com/apis/pool
 */
export const pgPool = new Pool({
  connectionString: DATABASE_URL,
});
