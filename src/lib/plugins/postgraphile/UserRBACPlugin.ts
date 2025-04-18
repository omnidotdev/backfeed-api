import { EXPORTABLE } from "graphile-export/helpers";
import { context, sideEffect } from "postgraphile/grafast";
import { makeWrapPlansPlugin } from "postgraphile/utils";

import type { GraphQLContext } from "lib/graphql";
import type { ExecutableStep, FieldArgs } from "postgraphile/grafast";

const validatePermissions = (propName: string) =>
  EXPORTABLE(
    (context, sideEffect, propName) =>
      // biome-ignore lint/suspicious/noExplicitAny: SmartFieldPlanResolver is not an exported type
      (plan: any, _: ExecutableStep, fieldArgs: FieldArgs) => {
        const $userId = fieldArgs.getRaw(["input", propName]);
        const $currentUser = context<GraphQLContext>().get("currentUser");

        sideEffect([$userId, $currentUser], async ([userId, currentUser]) => {
          if (!currentUser) {
            throw new Error("Unauthorized");
          }

          // TODO: restrict updating tier through API access. Handled through webhooks with a direct db connection

          // Disallow updating or deleting a user record that is not your own
          // TODO: this is scoped to the `user` table, so it is beyond the scope of RBAC. Discuss how to handle API admin access
          if (userId !== currentUser.id) {
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
const UserRBACPlugin = makeWrapPlansPlugin({
  Mutation: {
    updateUser: validatePermissions("rowId"),
    deleteUser: validatePermissions("rowId"),
  },
});

export default UserRBACPlugin;
