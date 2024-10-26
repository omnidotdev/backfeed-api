import { drizzle } from "drizzle-orm/node-postgres";

import { client } from "lib/db/client";
import { pool } from "lib/db/pool";
import * as schema from "lib/drizzle/schema";

// !!NB: important to match the casing in the config here. Otherwise, scripts will fail
export const dbPool = drizzle({ client: pool, schema, casing: "snake_case" });

// !!NB: important to match the casing in the config here. Otherwise, scripts will fail
export const dbClient = drizzle({ client, schema, casing: "snake_case" });
