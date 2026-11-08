/**
 * @file Run database migrations on boot via the shared resilient runner.
 *
 * Uses `@omnidotdev/providers/db` `runMigrations`, which sets a 10s
 * `lock_timeout` (so a blocked migration fails fast instead of wedging reads)
 * and self-heals migration tracker drift (reconciles already-applied
 * migrations instead of hard-failing on a re-applied non-idempotent statement
 * such as `CREATE POLICY ... already exists`).
 */

import { runMigrations } from "@omnidotdev/providers/db";

try {
  await runMigrations();
} catch (err) {
  console.error("[Migrate] Migration failed:", err);
  process.exit(1);
}
