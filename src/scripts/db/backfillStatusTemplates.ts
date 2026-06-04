/**
 * @file Backfill default status templates for organizations that have projects
 * but no status templates.
 *
 * Default status templates are normally seeded on `createProject`
 * (DefaultStatusTemplatesPlugin). Organizations whose projects predate that
 * plugin, or where the seed side-effect silently failed, end up with no
 * templates, which blocks feedback reporting in the app. This script is
 * idempotent (ON CONFLICT DO NOTHING) and safe to run against any environment.
 *
 * Usage: bun --env-file .env.local src/scripts/db/backfillStatusTemplates.ts
 */

import { drizzle } from "drizzle-orm/node-postgres";
import { projects, statusTemplates } from "lib/db/schema";
import { DEFAULT_STATUS_TEMPLATES } from "lib/graphql/plugins/defaults/DefaultStatusTemplates.plugin";
import { Pool } from "pg";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("[Backfill] DATABASE_URL is not set");
  process.exit(1);
}

const pool = new Pool({ connectionString: DATABASE_URL });

try {
  const db = drizzle({ client: pool, casing: "snake_case" });

  const projectOrgs = await db
    .selectDistinct({ organizationId: projects.organizationId })
    .from(projects);
  const templateOrgs = await db
    .selectDistinct({ organizationId: statusTemplates.organizationId })
    .from(statusTemplates);

  const seeded = new Set(templateOrgs.map((row) => row.organizationId));
  const missing = projectOrgs
    .map((row) => row.organizationId)
    .filter((organizationId) => !seeded.has(organizationId));

  if (missing.length === 0) {
    console.info("[Backfill] All project organizations already have templates");
  } else {
    for (const organizationId of missing) {
      await db
        .insert(statusTemplates)
        .values(
          DEFAULT_STATUS_TEMPLATES.map((template) => ({
            ...template,
            organizationId,
          })),
        )
        .onConflictDoNothing({
          target: [statusTemplates.organizationId, statusTemplates.name],
        });
    }
    console.info(
      `[Backfill] Seeded default status templates for ${missing.length} organization(s)`,
    );
  }
} catch (err) {
  console.error("[Backfill] Failed:", err);
  process.exit(1);
} finally {
  await pool.end();
}
