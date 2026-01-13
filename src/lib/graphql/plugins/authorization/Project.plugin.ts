import { EXPORTABLE } from "graphile-export/helpers";
import { AUTHZ_ENABLED, AUTHZ_PROVIDER_URL, checkPermission } from "lib/authz";
import { context, sideEffect } from "postgraphile/grafast";
import { wrapPlans } from "postgraphile/utils";

import { FEATURE_KEYS, billingBypassOrgIds, isWithinLimit } from "./constants";

import type { InsertProject, SelectWorkspace, members } from "lib/db/schema";
import type { PlanWrapperFn } from "postgraphile/utils";
import type { MutationScope } from "./types";

/**
 * Check member table for admin+ permission as fallback.
 * Used when OpenFGA tuples haven't synced yet (race condition).
 */
const checkMemberTablePermission = async (
  // biome-ignore lint/suspicious/noExplicitAny: db type from postgraphile context
  db: any,
  userId: string,
  workspaceId: string,
): Promise<boolean> => {
  const membership = await db.query.members.findFirst({
    // biome-ignore lint/suspicious/noExplicitAny: drizzle query builder callback
    where: (table: typeof members, { and, eq }: any) =>
      and(eq(table.userId, userId), eq(table.workspaceId, workspaceId)),
  });
  return membership?.role === "owner" || membership?.role === "admin";
};

/**
 * Validate project permissions via PDP.
 *
 * - Create: Admin+ permission on workspace required
 * - Update: Admin+ permission on workspace required
 * - Delete: Admin+ permission on workspace required
 *
 * Falls back to member table check when OpenFGA denies (handles race condition
 * where tuples haven't synced yet after workspace/member creation).
 */
const validatePermissions = (propName: string, scope: MutationScope) =>
  EXPORTABLE(
    (
      context,
      sideEffect,
      AUTHZ_ENABLED,
      AUTHZ_PROVIDER_URL,
      checkPermission,
      checkMemberTablePermission,
      billingBypassOrgIds,
      FEATURE_KEYS,
      isWithinLimit,
      propName,
      scope,
    ): PlanWrapperFn =>
      (plan, _, fieldArgs) => {
        const $input = fieldArgs.getRaw(["input", propName]);
        const $observer = context().get("observer");
        const $db = context().get("db");

        sideEffect([$input, $observer, $db], async ([input, observer, db]) => {
          if (!observer) throw new Error("Unauthorized");

          let workspaceId: string;

          if (scope === "create") {
            workspaceId = (input as InsertProject).workspaceId;
          } else {
            const project = await db.query.projects.findFirst({
              where: (table, { eq }) => eq(table.id, input),
            });

            if (!project) throw new Error("Project not found");

            workspaceId = project.workspaceId;
          }

          // Check admin permission via PDP
          const allowed = await checkPermission(
            AUTHZ_ENABLED,
            AUTHZ_PROVIDER_URL,
            observer.id,
            "workspace",
            workspaceId,
            "admin",
          );

          if (!allowed) {
            // Fallback: Check member table directly (handles tuple sync race condition)
            const hasPermission = await checkMemberTablePermission(
              db,
              observer.id,
              workspaceId,
            );
            if (!hasPermission) {
              throw new Error("Insufficient permissions");
            }
          }

          // Check tier limits for create operations
          if (scope === "create") {
            const workspace = await db.query.workspaces.findFirst({
              where: (table, { eq }) => eq(table.id, workspaceId),
              with: {
                projects: true,
              },
            });

            if (!workspace) throw new Error("Workspace not found");

            const withinLimit = await isWithinLimit(
              workspace as {
                id: string;
                tier: SelectWorkspace["tier"];
                organizationId: string;
              },
              FEATURE_KEYS.MAX_PROJECTS,
              workspace.projects.length,
              billingBypassOrgIds,
            );

            if (!withinLimit) {
              throw new Error("Maximum number of projects reached.");
            }
          }
        });

        return plan();
      },
    [
      context,
      sideEffect,
      AUTHZ_ENABLED,
      AUTHZ_PROVIDER_URL,
      checkPermission,
      checkMemberTablePermission,
      billingBypassOrgIds,
      FEATURE_KEYS,
      isWithinLimit,
      propName,
      scope,
    ],
  );

/**
 * Authorization plugin for projects.
 *
 * - Create: Admin+ on workspace
 * - Update: Admin+ on workspace
 * - Delete: Admin+ on workspace
 */
const ProjectPlugin = wrapPlans({
  Mutation: {
    createProject: validatePermissions("project", "create"),
    updateProject: validatePermissions("rowId", "update"),
    deleteProject: validatePermissions("rowId", "delete"),
  },
});

export default ProjectPlugin;
