import { EXPORTABLE } from "graphile-export/helpers";
import { checkPermission } from "lib/authz";
import { context, sideEffect } from "postgraphile/grafast";
import { wrapPlans } from "postgraphile/utils";

import type { InsertProjectLink } from "lib/db/schema";
import type { PlanWrapperFn } from "postgraphile/utils";
import type { MutationScope } from "./types";

/**
 * Validate project link permissions via PDP.
 *
 * - Create: Admin+ on organization
 * - Update: Admin+ on organization
 * - Delete: Admin+ on organization
 */
const validatePermissions = (propName: string, scope: MutationScope) =>
  EXPORTABLE(
    (context, sideEffect, checkPermission, propName, scope): PlanWrapperFn =>
      (plan, _, fieldArgs) => {
        const $input = fieldArgs.getRaw(["input", propName]);
        const $observer = context().get("observer");
        const $db = context().get("db");

        sideEffect([$input, $observer, $db], async ([input, observer, db]) => {
          if (!observer) throw new Error("Unauthorized");

          let organizationId: string;

          if (scope === "create") {
            const projectId = (input as InsertProjectLink).projectId;

            const project = await db.query.projects.findFirst({
              where: (table, { eq }) => eq(table.id, projectId),
            });

            if (!project) throw new Error("Project not found");

            organizationId = project.organizationId;
          } else {
            const link = await db.query.projectLinks.findFirst({
              where: (table, { eq }) => eq(table.id, input),
              with: {
                project: true,
              },
            });

            if (!link) throw new Error("Project link not found");

            organizationId = link.project.organizationId;
          }

          // Check admin permission via PDP on organization
          const allowed = await checkPermission(
            observer.id,
            "organization",
            organizationId,
            "admin",
          );
          if (!allowed) throw new Error("Insufficient permissions");
        });

        return plan();
      },
    [context, sideEffect, checkPermission, propName, scope],
  );

/**
 * Authorization plugin for project links.
 *
 * - Create: Admin+ on organization
 * - Update: Admin+ on organization
 * - Delete: Admin+ on organization
 */
const ProjectLinkPlugin = wrapPlans({
  Mutation: {
    createProjectLink: validatePermissions("projectLink", "create"),
    updateProjectLink: validatePermissions("rowId", "update"),
    deleteProjectLink: validatePermissions("rowId", "delete"),
  },
});

export default ProjectLinkPlugin;
