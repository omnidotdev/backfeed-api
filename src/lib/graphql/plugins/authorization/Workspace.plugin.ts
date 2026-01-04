import { EXPORTABLE } from "graphile-export/helpers";
import { context, sideEffect } from "postgraphile/grafast";
import { wrapPlans } from "postgraphile/utils";

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

          if (scope !== "create") {
            const workspace = await db.query.workspaces.findFirst({
              where: (table, { eq }) => eq(table.id, input),
              with: {
                members: {
                  where: (table, { eq }) => eq(table.userId, observer.id),
                },
              },
            });

            if (!workspace?.members?.length) throw new Error("Unauthorized");

            const role = workspace.members[0].role;

            if (role !== "owner") throw new Error("Unauthorized");
          }
        });

        return plan();
      },
    [context, sideEffect, propName, scope],
  );

/**
 * Authorization plugin for workspaces.
 */
const WorkspacePlugin = wrapPlans({
  Mutation: {
    createWorkspace: validatePermissions("workspace", "create"),
    updateWorkspace: validatePermissions("rowId", "update"),
    deleteWorkspace: validatePermissions("rowId", "delete"),
  },
});

export default WorkspacePlugin;
