import { EXPORTABLE } from "graphile-export/helpers";
import { AUTHZ_ENABLED, AUTHZ_PROVIDER_URL, checkPermission } from "lib/authz";
import { context, sideEffect } from "postgraphile/grafast";
import { wrapPlans } from "postgraphile/utils";

import type { InsertProjectSocial } from "lib/db/schema";
import type { PlanWrapperFn } from "postgraphile/utils";
import type { MutationScope } from "./types";

/**
 * Validate project social permissions via PDP.
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

          let organizationId: string;

          if (scope === "create") {
            const projectId = (input as InsertProjectSocial).projectId;

            const project = await db.query.projects.findFirst({
              where: (table, { eq }) => eq(table.id, projectId),
            });

            if (!project) throw new Error("Project not found");

            organizationId = project.organizationId;
          } else {
            const social = await db.query.projectSocials.findFirst({
              where: (table, { eq }) => eq(table.id, input),
              with: {
                project: true,
              },
            });

            if (!social) throw new Error("Project social not found");

            organizationId = social.project.organizationId;
          }

          // Check admin permission via PDP on organization
          const allowed = await checkPermission(
            AUTHZ_ENABLED,
            AUTHZ_PROVIDER_URL,
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
      AUTHZ_PROVIDER_URL,
      checkPermission,
      propName,
      scope,
    ],
  );

/**
 * Authorization plugin for project socials.
 *
 * - Create: Admin+ on organization
 * - Update: Admin+ on organization
 * - Delete: Admin+ on organization
 */
const ProjectSocialPlugin = wrapPlans({
  Mutation: {
    createProjectSocial: validatePermissions("projectSocial", "create"),
    updateProjectSocial: validatePermissions("rowId", "update"),
    deleteProjectSocial: validatePermissions("rowId", "delete"),
  },
});

export default ProjectSocialPlugin;
