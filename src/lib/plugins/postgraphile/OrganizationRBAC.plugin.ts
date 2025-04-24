import { and, eq } from "drizzle-orm";
import { EXPORTABLE } from "graphile-export/helpers";
import { context, sideEffect } from "postgraphile/grafast";
import { makeWrapPlansPlugin } from "postgraphile/utils";

import * as dbSchema from "lib/drizzle/schema";

import type { GraphQLContext } from "lib/graphql";
import type { ExecutableStep, FieldArgs } from "postgraphile/grafast";

type MutationScope = "create" | "update" | "delete";

const validatePermissions = (propName: string, scope: MutationScope) =>
  EXPORTABLE(
    (and, eq, dbSchema, context, sideEffect, propName, scope) =>
      // biome-ignore lint/suspicious/noExplicitAny: SmartFieldPlanResolver is not an exported type
      (plan: any, _: ExecutableStep, fieldArgs: FieldArgs) => {
        const $organization = fieldArgs.getRaw(["input", propName]);
        const $currentUser = context<GraphQLContext>().get("currentUser");
        const $db = context<GraphQLContext>().get("db");

        sideEffect(
          [$organization, $currentUser, $db],
          async ([organization, currentUser, db]) => {
            // Do not allow users that are not subscribed to create, update, or delete organizations
            if (!currentUser?.tier) {
              throw new Error("Unauthorized");
            }

            const { members } = dbSchema;

            if (scope === "create") {
              if (currentUser.tier === "basic") {
                // TODO: discuss validation. This checks how many organizations the user is *an owner* of, not strictly *a member* of.
                const userMemberships = await db
                  .select()
                  .from(members)
                  .where(
                    and(
                      eq(members.userId, currentUser.id),
                      eq(members.role, "owner"),
                    ),
                  );

                // If a user has a basic subscription, only allow for 1 organization to be created
                if (userMemberships.length > 0) {
                  throw new Error("Maximum number of organizations reached.");
                }
              }
            } else {
              const [userRole] = await db
                .select({ role: members.role })
                .from(members)
                .where(
                  and(
                    eq(members.userId, currentUser.id),
                    eq(members.organizationId, organization as string),
                  ),
                );

              // Only allow owners to delete organizations
              if (scope === "delete" && userRole.role !== "owner") {
                throw new Error("Insufficient permissions");
              }

              // Only allow admins and owners to update organizations
              if (
                scope === "update" &&
                (!userRole || userRole.role === "member")
              ) {
                throw new Error("Insufficient permissions");
              }
            }
          },
        );

        return plan();
      },
    [and, eq, dbSchema, context, sideEffect, propName, scope],
  );

/**
 * Plugin that handles API access for organization table mutations.
 */
const OrganizationRBACPlugin = makeWrapPlansPlugin({
  Mutation: {
    createOrganization: validatePermissions("organization", "create"),
    updateOrganization: validatePermissions("rowId", "update"),
    deleteOrganization: validatePermissions("rowId", "delete"),
  },
});

export default OrganizationRBACPlugin;
