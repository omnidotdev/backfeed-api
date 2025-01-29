import { and, eq } from "drizzle-orm";
import { EXPORTABLE } from "graphile-export/helpers";
import { context, sideEffect } from "postgraphile/grafast";
import { makeWrapPlansPlugin } from "postgraphile/utils";

import * as dbSchema from "lib/drizzle/schema";

import type { GraphQLContext } from "lib/graphql";
import type { ExecutableStep, FieldArgs } from "postgraphile/grafast";

type MutationScope = "update" | "delete";

const validatePermissions = (propName: string, scope: MutationScope) =>
  EXPORTABLE(
    (and, eq, dbSchema, context, sideEffect, propName, scope) =>
      // biome-ignore lint/suspicious/noExplicitAny: SmartFieldPlanResolver is not an exported type
      (plan: any, _: ExecutableStep, fieldArgs: FieldArgs) => {
        const $organizationId = fieldArgs.getRaw(["input", propName]);
        const $currentUser = context<GraphQLContext>().get("currentUser");
        const $db = context<GraphQLContext>().get("db");

        sideEffect(
          [$organizationId, $currentUser, $db],
          async ([organizationId, currentUser, db]) => {
            if (!currentUser) {
              throw new Error("Unauthorized");
            }

            const { usersToOrganizations } = dbSchema;

            const [userRole] = await db
              .select({ role: usersToOrganizations.role })
              .from(usersToOrganizations)
              .where(
                and(
                  eq(usersToOrganizations.userId, currentUser.id),
                  eq(
                    usersToOrganizations.organizationId,
                    organizationId as string
                  )
                )
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
        );

        return plan();
      },
    [and, eq, dbSchema, context, sideEffect, propName, scope]
  );

/**
 * Plugin that handles API access for organization table mutations.
 */
const OrganizationRBACPlugin = makeWrapPlansPlugin({
  Mutation: {
    updateOrganization: validatePermissions("rowId", "update"),
    deleteOrganization: validatePermissions("rowId", "delete"),
  },
});

export default OrganizationRBACPlugin;
