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

/**
 * Ensure a required extension exists before migrations run. `IF NOT EXISTS` is a
 * privilege-free no-op once the extension is installed, so a failure here means
 * it is genuinely missing (binary absent or role not permitted). pgvector is not
 * a trusted extension, so the database image must include it (e.g.
 * pgvector/pgvector) and the connecting role must be allowed to create it.
 */
const ensureExtension = async (name: "vector" | "pg_trgm"): Promise<void> => {
  try {
    await pool.query(`CREATE EXTENSION IF NOT EXISTS ${name}`);
  } catch (err) {
    console.error(
      `[Migrate] Could not ensure the "${name}" extension. The database image ` +
        "must include it and the role must be allowed to create it.",
    );
    throw err;
  }
};

try {
  const db = drizzle({ client: pool, casing: "snake_case" });

  // Required by the feedback brain schema (vector columns + lexical fallback).
  console.info("[Migrate] Ensuring required extensions (vector, pg_trgm)...");
  await ensureExtension("pg_trgm");
  await ensureExtension("vector");

  console.info("[Migrate] Applying migrations...");
  await migrate(db, { migrationsFolder: "src/generated/drizzle" });
  console.info("[Migrate] Migrations applied successfully");
} catch (err) {
  console.error("[Migrate] Migration failed:", err);
  process.exit(1);
} finally {
  await pool.end();
}
