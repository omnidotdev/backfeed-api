import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import { DATABASE_URL } from "lib/config/env";
import * as schema from "lib/drizzle/schema";

const pool = new Pool({
  connectionString: DATABASE_URL,
});

// !!NB: important to match the casing in the config here. Otherwise, scripts will fail
export const db = drizzle({ client: pool, schema, casing: "snake_case" });
