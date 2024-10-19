import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import { DATABASE_URL } from "lib/config/env";

const pool = new Pool({
  connectionString: DATABASE_URL,
});

// TODO: add schema
export const db = drizzle(pool);
