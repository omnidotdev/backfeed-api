import { EXPORTABLE } from "graphile-export/helpers";
import { context, sideEffect } from "postgraphile/grafast";
import { wrapPlans } from "postgraphile/utils";

import type { InsertProjectSocial } from "lib/db/schema";
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
          if (!observer) {
            throw new Error("Unauthorized");
          }

          let projectId: string;

          if (scope === "create") {
            projectId = (input as InsertProjectSocial).projectId;
          } else {
            const social = await db.query.projectSocials.findFirst({
              where: (table, { eq }) => eq(table.id, input),
            });

            if (!social) throw new Error("Project social not found");

            projectId = social.projectId;
          }
          const project = await db.query.projects.findFirst({
            where: (table, { eq }) => eq(table.id, projectId),
            with: {
              workspace: {
                with: {
                  members: {
                    where: (table, { eq }) => eq(table.userId, observer.id),
                  },
                },
              },
            },
          });

          // Only allow owners and admins to create, update, and delete project socials
          if (
            !project?.workspace.members.length ||
            project.workspace.members[0].role === "member"
          ) {
            throw new Error("Insufficient permissions");
          }
        });

        return plan();
      },
    [context, sideEffect, propName, scope],
  );

/**
 * Authorization plugin for project socials.
 */
const ProjectSocialPlugin = wrapPlans({
  Mutation: {
    createProjectSocial: validatePermissions("projectSocial", "create"),
    updateProjectSocial: validatePermissions("rowId", "update"),
    deleteProjectSocial: validatePermissions("rowId", "delete"),
  },
});

export default ProjectSocialPlugin;
