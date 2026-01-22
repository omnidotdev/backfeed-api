import { EXPORTABLE } from "graphile-export/helpers";
import { checkPermission } from "lib/authz";
import { context, sideEffect } from "postgraphile/grafast";
import { wrapPlans } from "postgraphile/utils";

import { FEATURE_KEYS, billingBypassOrgIds, isWithinLimit } from "./constants";

import type { InsertProject } from "lib/db/schema";
import type { PlanWrapperFn } from "postgraphile/utils";
import type { MutationScope } from "./types";

/**
 * Validate project permissions via PDP.
 *
 * - Create: Admin+ permission on organization required
 * - Update: Admin+ permission on organization required
 * - Delete: Admin+ permission on organization required
 *
 * Note: Member tuples are synced to PDP by IDP (Gatekeeper), so we rely
 * entirely on PDP checks. No local member table fallback.
 */
const validatePermissions = (propName: string, scope: MutationScope) =>
  EXPORTABLE(
    (
      context,
      sideEffect,
      checkPermission,
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

          let organizationId: string;

          if (scope === "create") {
            organizationId = (input as InsertProject).organizationId;
          } else {
            const project = await db.query.projects.findFirst({
              where: (table, { eq }) => eq(table.id, input),
            });

            if (!project) throw new Error("Project not found");

            organizationId = project.organizationId;
          }

          // Check admin permission via PDP on organization
          const allowed = await checkPermission(
            observer.id,
            "organization",
            organizationId,
            "admin",
          );

          if (!allowed) {
            throw new Error("Insufficient permissions");
          }

          // Check tier limits for create operations
          if (scope === "create") {
            const projectCount = await db.query.projects.findMany({
              where: (table, { eq }) =>
                eq(table.organizationId, organizationId),
            });

            const withinLimit = await isWithinLimit(
              { organizationId },
              FEATURE_KEYS.MAX_PROJECTS,
              projectCount.length,
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
      checkPermission,
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
 * - Create: Admin+ on organization
 * - Update: Admin+ on organization
 * - Delete: Admin+ on organization
 */
const ProjectPlugin = wrapPlans({
  Mutation: {
    createProject: validatePermissions("project", "create"),
    updateProject: validatePermissions("rowId", "update"),
    deleteProject: validatePermissions("rowId", "delete"),
  },
});

export default ProjectPlugin;
