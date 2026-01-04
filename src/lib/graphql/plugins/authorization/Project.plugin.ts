import { EXPORTABLE } from "graphile-export/helpers";
import { context, sideEffect } from "postgraphile/grafast";
import { wrapPlans } from "postgraphile/utils";

import { FEATURE_KEYS, billingBypassSlugs, isWithinLimit } from "./constants";

import type { InsertProject, SelectWorkspace } from "lib/db/schema";
import type { PlanWrapperFn } from "postgraphile/utils";
import type { MutationScope } from "./types";

const validatePermissions = (propName: string, scope: MutationScope) =>
  EXPORTABLE(
    (
      context,
      sideEffect,
      billingBypassSlugs,
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

          let workspaceId: string;

          if (scope === "create") {
            workspaceId = (input as InsertProject).workspaceId;
          } else {
            const project = await db.query.projects.findFirst({
              where: (table, { eq }) => eq(table.id, input),
            });

            if (!project) throw new Error("Project not found");

            workspaceId = project.workspaceId;
          }

          const workspace = await db.query.workspaces.findFirst({
            where: (table, { eq }) => eq(table.id, workspaceId),
            with: {
              members: {
                where: (table, { eq }) => eq(table.userId, observer.id),
              },
              projects: true,
            },
          });

          if (!workspace) throw new Error("Workspace not found");

          // only allow owners and admins to create, update, and delete projects
          if (
            !workspace.members.length ||
            workspace.members[0].role === "member"
          )
            throw new Error("Insufficient permissions");

          // Check tier limits for create operations
          if (scope === "create") {
            const withinLimit = await isWithinLimit(
              workspace as {
                id: string;
                tier: SelectWorkspace["tier"];
                slug: string;
              },
              FEATURE_KEYS.MAX_PROJECTS,
              workspace.projects.length,
              billingBypassSlugs,
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
      billingBypassSlugs,
      FEATURE_KEYS,
      isWithinLimit,
      propName,
      scope,
    ],
  );

/**
 * Authorization plugin for projects.
 */
const ProjectPlugin = wrapPlans({
  Mutation: {
    createProject: validatePermissions("project", "create"),
    updateProject: validatePermissions("rowId", "update"),
    deleteProject: validatePermissions("rowId", "delete"),
  },
});

export default ProjectPlugin;
