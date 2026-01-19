import { EXPORTABLE } from "graphile-export/helpers";
import { AUTHZ_ENABLED, AUTHZ_API_URL, checkPermission } from "lib/authz";
import { context, sideEffect } from "postgraphile/grafast";
import { wrapPlans } from "postgraphile/utils";

import type { InsertStatusTemplate } from "lib/db/schema";
import type { PlanWrapperFn } from "postgraphile/utils";
import type { MutationScope } from "./types";

/**
 * Validate status template permissions via PDP.
 *
 * - Create: Admin+ on organization
 * - Update: Admin+ on organization
 * - Delete: Admin+ on organization
 *
 * Note: Member tuples are synced to PDP by IDP (Gatekeeper), so we rely
 * entirely on PDP checks. No local member table fallback.
 */
const validatePermissions = (propName: string, scope: MutationScope) =>
  EXPORTABLE(
    (
      context,
      sideEffect,
      AUTHZ_ENABLED,
      AUTHZ_API_URL,
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

          let organizationId: string;

          if (scope === "create") {
            organizationId = (input as InsertStatusTemplate).organizationId;
          } else {
            const statusTemplate = await db.query.statusTemplates.findFirst({
              where: (table, { eq }) => eq(table.id, input),
            });

            if (!statusTemplate) throw new Error("Status template not found");

            organizationId = statusTemplate.organizationId;
          }

          // Check admin permission via PDP on organization
          const allowed = await checkPermission(
            AUTHZ_ENABLED,
            AUTHZ_API_URL,
            observer.id,
            "organization",
            organizationId,
            "admin",
          );

          if (!allowed) {
            throw new Error("Insufficient permissions");
          }
        });

        return plan();
      },
    [
      context,
      sideEffect,
      AUTHZ_ENABLED,
      AUTHZ_API_URL,
      checkPermission,
      propName,
      scope,
    ],
  );

/**
 * Authorization plugin for status templates.
 *
 * - Create: Admin+ on organization
 * - Update: Admin+ on organization
 * - Delete: Admin+ on organization
 */
const StatusTemplatePlugin = wrapPlans({
  Mutation: {
    createStatusTemplate: validatePermissions("statusTemplate", "create"),
    updateStatusTemplate: validatePermissions("rowId", "update"),
    deleteStatusTemplate: validatePermissions("rowId", "delete"),
  },
});

export default StatusTemplatePlugin;
