import { Pool } from "pg";

import { DATABASE_URL } from "lib/config/env";

export const pool = new Pool({
  connectionString: DATABASE_URL,
});
