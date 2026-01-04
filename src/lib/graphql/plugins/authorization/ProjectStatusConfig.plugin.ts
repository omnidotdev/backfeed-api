import { EXPORTABLE } from "graphile-export/helpers";
import { context, sideEffect } from "postgraphile/grafast";
import { wrapPlans } from "postgraphile/utils";

import type { InsertProjectStatusConfig } from "lib/db/schema";
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
            projectId = (input as InsertProjectStatusConfig).projectId;
          } else {
            const config = await db.query.projectStatusConfigs.findFirst({
              where: (table, { eq }) => eq(table.id, input),
            });

            if (!config) throw new Error("Project status config not found");

            projectId = config.projectId;
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

          if (!project) throw new Error("Project not found");

          // allow admins and owners to create, update and delete project status configs
          if (
            !project.workspace.members.length ||
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
 * Authorization plugin for project status configs.
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
