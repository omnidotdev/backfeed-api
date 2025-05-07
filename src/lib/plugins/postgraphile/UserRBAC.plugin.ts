import { EXPORTABLE } from "graphile-export/helpers";
import { context, sideEffect } from "postgraphile/grafast";
import { makeWrapPlansPlugin } from "postgraphile/utils";

import type { GraphQLContext } from "lib/graphql";
import type { ExecutableStep, FieldArgs } from "postgraphile/grafast";

type MutationScope = "create" | "update" | "delete";

const validatePermissions = (propName: string, scope: MutationScope) =>
  EXPORTABLE(
    (context, sideEffect, propName, scope) =>
      // biome-ignore lint/suspicious/noExplicitAny: SmartFieldPlanResolver is not an exported type
      (plan: any, _: ExecutableStep, fieldArgs: FieldArgs) => {
        const $userId = fieldArgs.getRaw(["input", propName]);
        const $currentUser = context<GraphQLContext>().get("currentUser");

        sideEffect([$userId, $currentUser], async ([userId, currentUser]) => {
          // NB: adding a record to the user table is done with direct access to db through `useAuth` plugin. From an API standpoint, we should never have to create a new user.
          if (!currentUser || scope === "create") {
            throw new Error("Unauthorized");
          }

          // Disallow updating or deleting a user record that is not your own
          // TODO: this is scoped to the `user` table, so it is beyond the scope of RBAC. Discuss how to handle API admin access
          if (userId !== currentUser.id) {
            throw new Error("Insufficient permissions");
          }
        });

        return plan();
      },
    [context, sideEffect, propName, scope],
  );

/**
 * Plugin that handles API access for user table mutations.
 */
const UserRBACPlugin = makeWrapPlansPlugin({
  Mutation: {
    createUser: validatePermissions("user", "create"),
    updateUser: validatePermissions("rowId", "update"),
    deleteUser: validatePermissions("rowId", "delete"),
  },
});

export default UserRBACPlugin;
