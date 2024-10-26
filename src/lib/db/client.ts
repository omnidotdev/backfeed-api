import { Client } from "pg";

import { DATABASE_URL } from "lib/config/env";

export const client = new Client({
  connectionString: DATABASE_URL,
});
