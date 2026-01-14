/**
 * Orphan Detection Job
 *
 * Detects projects that reference organizations that no longer exist in the IDP.
 * Run this job periodically (e.g., daily via cron) to identify data inconsistencies.
 *
 * Usage:
 *   bun run src/jobs/orphanDetection.ts
 *
 * Environment:
 *   DATABASE_URL - Database connection string
 *   AUTH_BASE_URL - IDP base URL
 *
 * @knipignore - standalone job script, not imported by main app
 */

import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "lib/db/schema";

const DATABASE_URL = process.env.DATABASE_URL;
const AUTH_BASE_URL = process.env.AUTH_BASE_URL;

if (!DATABASE_URL) {
  console.error("DATABASE_URL is required");
  process.exit(1);
}

if (!AUTH_BASE_URL) {
  console.error("AUTH_BASE_URL is required");
  process.exit(1);
}

const db = drizzle(DATABASE_URL, { schema });

/** Request timeout in milliseconds */
const REQUEST_TIMEOUT_MS = 5000;

/** Batch size for processing */
const BATCH_SIZE = 50;

interface OrphanedProject {
  id: string;
  name: string;
  organizationId: string;
  createdAt: Date;
}

/**
 * Check if an organization exists in the IDP.
 */
async function checkOrgExists(organizationId: string): Promise<boolean> {
  try {
    const response = await fetch(
      `${AUTH_BASE_URL}/api/organization/${organizationId}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      },
    );

    return response.ok;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`Failed to check org ${organizationId}: ${message}`);
    // On error, assume org exists to avoid false positives
    return true;
  }
}

/**
 * Detect orphaned projects (projects with non-existent organizations).
 */
async function detectOrphanedProjects(): Promise<OrphanedProject[]> {
  console.log("Starting orphan detection job...");

  // Get all projects
  const projects = await db.query.projects.findMany({
    columns: {
      id: true,
      name: true,
      organizationId: true,
      createdAt: true,
    },
  });

  // Get unique organization IDs
  const orgIds = [...new Set(projects.map((p) => p.organizationId))];
  console.log(
    `Found ${projects.length} projects across ${orgIds.length} organizations`,
  );

  // Check which orgs exist
  const orphanedOrgIds = new Set<string>();
  let checked = 0;

  for (let i = 0; i < orgIds.length; i += BATCH_SIZE) {
    const batch = orgIds.slice(i, i + BATCH_SIZE);

    const results = await Promise.all(
      batch.map(async (orgId) => {
        const exists = await checkOrgExists(orgId);
        return { orgId, exists };
      }),
    );

    for (const { orgId, exists } of results) {
      if (!exists) {
        orphanedOrgIds.add(orgId);
      }
    }

    checked += batch.length;
    console.log(`Checked ${checked}/${orgIds.length} organizations`);

    // Small delay between batches to be gentle on the IDP
    if (i + BATCH_SIZE < orgIds.length) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  // Return projects belonging to orphaned orgs
  return projects
    .filter((p) => orphanedOrgIds.has(p.organizationId))
    .map((p) => ({
      id: p.id,
      name: p.name,
      organizationId: p.organizationId,
      createdAt: new Date(p.createdAt),
    }));
}

/**
 * Main entry point.
 */
async function main(): Promise<void> {
  try {
    const orphaned = await detectOrphanedProjects();

    if (orphaned.length === 0) {
      console.log("No orphaned projects detected");
      return;
    }

    console.log(`\nDetected ${orphaned.length} orphaned project(s):`);
    console.log("-------------------------------------------");

    for (const project of orphaned) {
      console.log(
        JSON.stringify({
          type: "orphaned_project",
          projectId: project.id,
          projectName: project.name,
          organizationId: project.organizationId,
          createdAt: project.createdAt,
          timestamp: new Date().toISOString(),
        }),
      );
    }

    console.log("-------------------------------------------");
    console.log(
      "\nAction required: Review these projects and consider deleting them.",
    );
    console.log(
      "The IDP webhook should have handled deletion, so these may indicate missed events.",
    );

    // Exit with non-zero code to indicate orphans were found (useful for alerting)
    process.exit(1);
  } catch (error) {
    console.error("Orphan detection job failed:", error);
    process.exit(2);
  }
}

main();
