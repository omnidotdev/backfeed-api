/**
 * @file Run database migrations with error visibility.
 * Wraps drizzle-orm's migrate so failures surface the actual error
 * instead of a silent exit code 1 from drizzle-kit CLI.
 */

import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("[Migrate] DATABASE_URL is not set");
  process.exit(1);
}

const pool = new Pool({ connectionString: DATABASE_URL });

try {
  const db = drizzle({ client: pool, casing: "snake_case" });

  // biome-ignore lint/suspicious/noConsole: migration status logging
  console.info("[Migrate] Applying migrations...");
  await migrate(db, { migrationsFolder: "src/generated/drizzle" });
  // biome-ignore lint/suspicious/noConsole: migration status logging
  console.info("[Migrate] Migrations applied successfully");
} catch (err) {
  console.error("[Migrate] Migration failed:", err);
  process.exit(1);
} finally {
  await pool.end();
}
