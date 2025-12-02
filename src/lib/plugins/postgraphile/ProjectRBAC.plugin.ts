import { EXPORTABLE } from "graphile-export/helpers";
import { context, sideEffect } from "postgraphile/grafast";
import { wrapPlans } from "postgraphile/utils";

import type { InsertProject } from "lib/drizzle/schema";
import type { PlanWrapperFn } from "postgraphile/utils";
import type { MutationScope } from "./types";

const validatePermissions = (propName: string, scope: MutationScope) =>
  EXPORTABLE(
    (context, sideEffect, propName, scope): PlanWrapperFn =>
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

          const organization = await db.query.organizations.findFirst({
            where: (table, { eq }) => eq(table.id, organizationId),
            with: {
              members: {
                where: (table, { eq }) => eq(table.userId, observer.id),
              },
              projects: {
                limit: 3,
              },
            },
          });

          if (!organization) throw new Error("Organization not found");

          // Only allow owners and admins to create, update, and delete projects
          if (
            !organization.members.length ||
            organization.members[0].role === "member"
          ) {
            throw new Error("Insufficient permissions");
          }

          if (scope === "create") {
            // NB: The following checks make sure that we do not allow users to create a new project if the maximum number of allowed projects has been met
            if (
              organization.tier === "free" &&
              !!organization.projects.length
            ) {
              throw new Error("Maximum number of projects reached.");
            }

            if (
              organization.tier === "basic" &&
              organization.projects.length >= 3
            ) {
              throw new Error("Maximum number of projects reached.");
            }
          }
        });

        return plan();
      },
    [context, sideEffect, propName, scope],
  );

/**
 * Plugin that handles API access for project table mutations.
 */
const ProjectRBACPlugin = wrapPlans({
  Mutation: {
    createProject: validatePermissions("project", "create"),
    updateProject: validatePermissions("rowId", "update"),
    deleteProject: validatePermissions("rowId", "delete"),
  },
});

export default ProjectRBACPlugin;
