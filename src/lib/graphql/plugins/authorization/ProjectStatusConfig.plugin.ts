import { EXPORTABLE } from "graphile-export/helpers";
import { AUTHZ_API_URL, AUTHZ_ENABLED, checkPermission } from "lib/authz";
import { context, sideEffect } from "postgraphile/grafast";
import { wrapPlans } from "postgraphile/utils";

import type { InsertProjectStatusConfig } from "lib/db/schema";
import type { PlanWrapperFn } from "postgraphile/utils";
import type { MutationScope } from "./types";

/**
 * Validate project status config permissions via PDP.
 *
 * - Create: Admin+ on organization
 * - Update: Admin+ on organization
 * - Delete: Admin+ on organization
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
            const projectId = (input as InsertProjectStatusConfig).projectId;

            const project = await db.query.projects.findFirst({
              where: (table, { eq }) => eq(table.id, projectId),
            });

            if (!project) throw new Error("Project not found");

            organizationId = project.organizationId;
          } else {
            const config = await db.query.projectStatusConfigs.findFirst({
              where: (table, { eq }) => eq(table.id, input),
              with: {
                project: true,
              },
            });

            if (!config) throw new Error("Project status config not found");

            organizationId = config.project.organizationId;
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
          if (!allowed) throw new Error("Insufficient permissions");
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
 * Authorization plugin for project status configs.
 *
 * - Create: Admin+ on organization
 * - Update: Admin+ on organization
 * - Delete: Admin+ on organization
 */
const ProjectStatusConfigPlugin = wrapPlans({
  Mutation: {
    createProjectStatusConfig: validatePermissions(
      "projectStatusConfig",
      "create",
    ),
    updateProjectStatusConfig: validatePermissions("rowId", "update"),
    deleteProjectStatusConfig: validatePermissions("rowId", "delete"),
  },
});

export default ProjectStatusConfigPlugin;
