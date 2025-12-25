import { EXPORTABLE } from "graphile-export/helpers";
import { context, sideEffect } from "postgraphile/grafast";
import { wrapPlans } from "postgraphile/utils";

import type { PlanWrapperFn } from "postgraphile/utils";
import type { MutationScope } from "./types";

const validatePermissions = (propName: string, scope: MutationScope) =>
  EXPORTABLE(
    (context, sideEffect, propName, scope): PlanWrapperFn =>
      (plan, _, fieldArgs) => {
        const $userId = fieldArgs.getRaw(["input", propName]);
        const $observer = context().get("observer");

        sideEffect([$userId, $observer], async ([userId, observer]) => {
          if (!observer) throw new Error("Unauthorized");

          // Disallow updating or deleting a user record that is not your own
          if (scope !== "create" && userId !== observer.id) {
            throw new Error("Insufficient permissions");
          }
        });

        return plan();
      },
    [context, sideEffect, propName, scope],
  );

/**
 * Authorization plugin for users.
 */
const UserPlugin = wrapPlans({
  Mutation: {
    createUser: validatePermissions("user", "create"),
    updateUser: validatePermissions("rowId", "update"),
    deleteUser: validatePermissions("rowId", "delete"),
  },
});

export default UserPlugin;
