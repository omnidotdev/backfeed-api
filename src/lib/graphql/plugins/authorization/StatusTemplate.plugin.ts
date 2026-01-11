import { EXPORTABLE } from "graphile-export/helpers";
import { AUTHZ_ENABLED, AUTHZ_PROVIDER_URL, checkPermission } from "lib/authz";
import { context, sideEffect } from "postgraphile/grafast";
import { wrapPlans } from "postgraphile/utils";

import type { InsertStatusTemplate } from "lib/db/schema";
import type { PlanWrapperFn } from "postgraphile/utils";
import type { MutationScope } from "./types";

/**
 * Validate status template permissions via Warden.
 *
 * - Create: Admin+ on workspace
 * - Update: Admin+ on workspace
 * - Delete: Admin+ on workspace
 */
const validatePermissions = (propName: string, scope: MutationScope) =>
  EXPORTABLE(
    (
      context,
      sideEffect,
      AUTHZ_ENABLED,
      AUTHZ_PROVIDER_URL,
      checkPermission,
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

          // Check admin permission via Warden
          const allowed = await checkPermission(
            AUTHZ_ENABLED,
            AUTHZ_PROVIDER_URL,
            observer.id,
            "workspace",
            workspaceId,
            "admin",
          );
          if (!allowed) throw new Error("Insufficient permissions");
        });

        return plan();
      },
    [
      context,
      sideEffect,
      AUTHZ_ENABLED,
      AUTHZ_PROVIDER_URL,
      checkPermission,
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
