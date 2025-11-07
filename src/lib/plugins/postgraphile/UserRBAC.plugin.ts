import { EXPORTABLE } from "graphile-export/helpers";
import { context, sideEffect } from "postgraphile/grafast";
import { wrapPlans } from "postgraphile/utils";

import type { PlanWrapperFn } from "postgraphile/utils";

const validatePermissions = (propName: string) =>
  EXPORTABLE(
    (context, sideEffect, propName): PlanWrapperFn =>
      (plan, _, fieldArgs) => {
        const $userId = fieldArgs.getRaw(["input", propName]);
        const $observer = context().get("observer");

        sideEffect([$userId, $observer], async ([userId, observer]) => {
          if (!observer) {
            throw new Error("Unauthorized");
          }

          // Disallow updating or deleting a user record that is not your own
          // TODO: this is scoped to the `user` table, so it is beyond the scope of RBAC. Discuss how to handle API admin access
          if (userId !== observer.id) {
            throw new Error("Insufficient permissions");
          }
        });

        return plan();
      },
    [context, sideEffect, propName],
  );

/**
 * Plugin that handles API access for user table mutations.
 */
const UserRBACPlugin = wrapPlans({
  Mutation: {
    updateUser: validatePermissions("rowId"),
    deleteUser: validatePermissions("rowId"),
  },
});

export default UserRBACPlugin;
