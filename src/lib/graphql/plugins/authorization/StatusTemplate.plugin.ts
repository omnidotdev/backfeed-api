import { EXPORTABLE } from "graphile-export/helpers";
import { context, sideEffect } from "postgraphile/grafast";
import { wrapPlans } from "postgraphile/utils";

import type { InsertStatusTemplate } from "lib/db/schema";
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

          const workspace = await db.query.workspaces.findFirst({
            where: (table, { eq }) => eq(table.id, workspaceId),
            with: {
              members: {
                where: (table, { eq }) => eq(table.userId, observer.id),
              },
            },
          });

          if (!workspace) throw new Error("Workspace not found");

          // allow admins and owners to create, update and delete status templates
          if (
            !workspace.members.length ||
            workspace.members[0].role === "member"
          ) {
            throw new Error("Insufficient permissions");
          }
        });

        return plan();
      },
    [context, sideEffect, propName, scope],
  );

/**
 * Authorization plugin for status templates.
 */
const StatusTemplatePlugin = wrapPlans({
  Mutation: {
    createStatusTemplate: validatePermissions("statusTemplate", "create"),
    updateStatusTemplate: validatePermissions("rowId", "update"),
    deleteStatusTemplate: validatePermissions("rowId", "delete"),
  },
});

export default StatusTemplatePlugin;
