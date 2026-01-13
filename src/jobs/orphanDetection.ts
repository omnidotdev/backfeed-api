/**
 * Orphan Detection Job
 *
 * Detects workspaces that reference organizations that no longer exist in the IDP.
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

import { isNull } from "drizzle-orm";
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

/** Batch size for processing workspaces */
const BATCH_SIZE = 50;

interface OrphanedWorkspace {
  id: string;
  organizationId: string;
  createdAt: string;
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
 * Detect orphaned workspaces.
 */
async function detectOrphanedWorkspaces(): Promise<OrphanedWorkspace[]> {
  console.log("Starting orphan detection job...");

  // Get all active (non-deleted) workspaces
  const workspaces = await db.query.workspaces.findMany({
    where: isNull(schema.workspaces.deletedAt),
    columns: {
      id: true,
      organizationId: true,
      createdAt: true,
    },
  });

  console.log(`Found ${workspaces.length} active workspaces to check`);

  const orphaned: OrphanedWorkspace[] = [];
  let checked = 0;

  // Process in batches to avoid overwhelming the IDP
  for (let i = 0; i < workspaces.length; i += BATCH_SIZE) {
    const batch = workspaces.slice(i, i + BATCH_SIZE);

    // Check each workspace in the batch concurrently
    const results = await Promise.all(
      batch.map(async (ws) => {
        const exists = await checkOrgExists(ws.organizationId);
        return { workspace: ws, exists };
      }),
    );

    for (const { workspace, exists } of results) {
      if (!exists) {
        orphaned.push({
          id: workspace.id,
          organizationId: workspace.organizationId,
          createdAt: workspace.createdAt,
        });
      }
    }

    checked += batch.length;
    console.log(`Checked ${checked}/${workspaces.length} workspaces`);

    // Small delay between batches to be gentle on the IDP
    if (i + BATCH_SIZE < workspaces.length) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  return orphaned;
}

/**
 * Main entry point.
 */
async function main(): Promise<void> {
  try {
    const orphaned = await detectOrphanedWorkspaces();

    if (orphaned.length === 0) {
      console.log("No orphaned workspaces detected");
      return;
    }

    console.log(`\nDetected ${orphaned.length} orphaned workspace(s):`);
    console.log("-------------------------------------------");

    for (const ws of orphaned) {
      console.log(
        JSON.stringify({
          type: "orphaned_workspace",
          workspaceId: ws.id,
          organizationId: ws.organizationId,
          createdAt: ws.createdAt,
          timestamp: new Date().toISOString(),
        }),
      );
    }

    console.log("-------------------------------------------");
    console.log(
      "\nAction required: Review these workspaces and consider soft-deleting them.",
    );
    console.log(
      "To soft-delete, update the workspace with deletedAt and deletionReason='orphaned'",
    );

    // Exit with non-zero code to indicate orphans were found (useful for alerting)
    process.exit(1);
  } catch (error) {
    console.error("Orphan detection job failed:", error);
    process.exit(2);
  }
}

main();
