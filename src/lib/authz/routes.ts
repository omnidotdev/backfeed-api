import { Elysia } from "elysia";
import { dbPool } from "lib/db/db";
import { projects } from "lib/db/schema";

interface TupleKey {
  user: string;
  relation: string;
  object: string;
}

/**
 * Export all authorization tuples from Backfeed's source of truth.
 * Used by warden-api to rebuild OpenFGA tuples.
 *
 * Note: Member tuples (user→organization relationships) are NOT exported here.
 * Those are managed by IDP (Gatekeeper), which is the source of truth for
 * organization membership. This endpoint only exports Backfeed-specific resource
 * relationships (organization→project).
 *
 * Authorization model:
 * - organization:X has 'organization' relation on project:Y
 * - No intermediate workspace - projects belong directly to organizations
 */
async function exportAllTuples(): Promise<TupleKey[]> {
  const tuples: TupleKey[] = [];

  // Project-organization relationships (project table)
  // organization:X has 'organization' relation on project:Y
  const allProjects = await dbPool.select().from(projects);
  for (const p of allProjects) {
    tuples.push({
      user: `organization:${p.organizationId}`,
      relation: "organization",
      object: `project:${p.id}`,
    });
  }

  return tuples;
}

/**
 * Authorization routes for tuple export.
 * Called by warden-api during tuple rebuilds.
 */
const authzRoutes = new Elysia({ prefix: "/authz" }).get(
  "/tuples",
  async () => {
    const tuples = await exportAllTuples();

    return {
      tuples,
      count: tuples.length,
      exportedAt: new Date().toISOString(),
    };
  },
);

export default authzRoutes;
