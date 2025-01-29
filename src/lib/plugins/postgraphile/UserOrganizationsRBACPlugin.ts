import { and, eq } from "drizzle-orm";
import { EXPORTABLE } from "graphile-export/helpers";
import { context, sideEffect } from "postgraphile/grafast";
import { makeWrapPlansPlugin } from "postgraphile/utils";

import * as dbSchema from "lib/drizzle/schema";

import type { InsertUserToOrganization } from "lib/drizzle/schema";
import type { GraphQLContext } from "lib/graphql";
import type { ExecutableStep, FieldArgs } from "postgraphile/grafast";

type MutationScope = "create" | "update" | "delete";

const validatePermissions = (propName: string, scope: MutationScope) =>
  EXPORTABLE(
    (and, eq, dbSchema, context, sideEffect, propName, scope) =>
      // biome-ignore lint/suspicious/noExplicitAny: SmartFieldPlanResolver is not an exported type
      (plan: any, _: ExecutableStep, fieldArgs: FieldArgs) => {
        const $input = fieldArgs.getRaw(["input", propName]);
        const $currentUser = context<GraphQLContext>().get("currentUser");
        const $db = context<GraphQLContext>().get("db");

        sideEffect(
          [$input, $currentUser, $db],
          async ([input, currentUser, db]) => {
            if (!currentUser) {
              throw new Error("Unauthorized");
            }

            const { usersToOrganizations } = dbSchema;

            if (scope === "create") {
              const role = (input as InsertUserToOrganization).role;
              const userId = (input as InsertUserToOrganization).userId;
              const organizationId = (input as InsertUserToOrganization)
                .organizationId;

              const organizationUsers = await db
                .select()
                .from(usersToOrganizations)
                .where(eq(usersToOrganizations.organizationId, organizationId));

              if (organizationUsers.length) {
                const userRole = organizationUsers.find(
                  (user) => user.userId === currentUser.id
                )?.role;

                // Allow users to join an organization as a member
                if (!userRole) {
                  if (userId !== currentUser.id || role !== "member") {
                    throw new Error("Insufficient permissions");
                  }
                } else {
                  // If the user is already a member, they must be an owner to invite a new member to the organization
                  if (userRole !== "owner") {
                    throw new Error("Insufficient permissions");
                  }
                }
              }
            } else {
              const [userOrganization] = await db
                .select()
                .from(usersToOrganizations)
                .where(eq(usersToOrganizations.id, input));

              if (currentUser.id !== userOrganization.userId) {
                const [userRole] = await db
                  .select({ role: usersToOrganizations.role })
                  .from(usersToOrganizations)
                  .where(
                    and(
                      eq(usersToOrganizations.userId, currentUser.id),
                      eq(
                        usersToOrganizations.organizationId,
                        userOrganization.organizationId
                      )
                    )
                  );

                // Only allow owners to update roles and/or kick other members from the organization
                if (userRole.role !== "owner") {
                  throw new Error("Insufficient permissions");
                }
              } else {
                // Restrict current users from updating their own role unless they are an owner
                if (scope === "update" && userOrganization.role !== "owner") {
                  throw new Error("Insufficient permissions");
                }
              }
            }
          }
        );

        return plan();
      },
    [and, eq, dbSchema, context, sideEffect, propName, scope]
  );

/**
 * Plugin that handles API access for userOrganization table mutations.
 */
const UserOrganizationsRBACPlugin = makeWrapPlansPlugin({
  Mutation: {
    createUserOrganization: validatePermissions("userOrganization", "create"),
    updateUserOrganization: validatePermissions("rowId", "update"),
    deleteUserOrganization: validatePermissions("rowId", "delete"),
  },
});

export default UserOrganizationsRBACPlugin;
