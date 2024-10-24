import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import { DATABASE_URL } from "lib/config/env";
import * as schema from "lib/drizzle/schema";

const pool = new Pool({
  connectionString: DATABASE_URL,
});

// NB: this is just for a ref if needed. Since drizzle and postgraphile v5 depend on connection strings, there is no (current) need for an explicit pool. Good for scripting though.
export const db = drizzle(pool, { schema });
