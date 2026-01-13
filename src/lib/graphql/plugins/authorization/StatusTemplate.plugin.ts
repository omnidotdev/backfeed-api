import { EXPORTABLE } from "graphile-export/helpers";
import { AUTHZ_ENABLED, AUTHZ_PROVIDER_URL, checkPermission } from "lib/authz";
import { context, sideEffect } from "postgraphile/grafast";
import { wrapPlans } from "postgraphile/utils";

import type { InsertStatusTemplate, members } from "lib/db/schema";
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
 * Validate status template permissions via PDP.
 *
 * - Create: Admin+ on workspace
 * - Update: Admin+ on workspace
 * - Delete: Admin+ on workspace
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
            workspaceId = (input as InsertStatusTemplate).workspaceId;
          } else {
            const statusTemplate = await db.query.statusTemplates.findFirst({
              where: (table, { eq }) => eq(table.id, input),
            });

            if (!statusTemplate) throw new Error("Status template not found");

            workspaceId = statusTemplate.workspaceId;
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
      propName,
      scope,
    ],
  );

/**
 * Authorization plugin for status templates.
 *
 * - Create: Admin+ on workspace
 * - Update: Admin+ on workspace
 * - Delete: Admin+ on workspace
 */
const StatusTemplatePlugin = wrapPlans({
  Mutation: {
    createStatusTemplate: validatePermissions("statusTemplate", "create"),
    updateStatusTemplate: validatePermissions("rowId", "update"),
    deleteStatusTemplate: validatePermissions("rowId", "delete"),
  },
});

export default StatusTemplatePlugin;
