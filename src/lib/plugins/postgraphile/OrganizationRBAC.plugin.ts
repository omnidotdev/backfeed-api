import { and, eq } from "drizzle-orm";
import { EXPORTABLE } from "graphile-export/helpers";
import * as dbSchema from "lib/drizzle/schema";
import { context, sideEffect } from "postgraphile/grafast";
import { wrapPlans } from "postgraphile/utils";

import type { PlanWrapperFn } from "postgraphile/utils";

type MutationScope = "create" | "update" | "delete";

const validatePermissions = (propName: string, scope: MutationScope) =>
  EXPORTABLE(
    (and, eq, dbSchema, context, sideEffect, propName, scope): PlanWrapperFn =>
      (plan, _, fieldArgs) => {
        const $organization = fieldArgs.getRaw(["input", propName]);
        const $currentUser = context().get("observer");
        const $db = context().get("db");

        sideEffect(
          [$organization, $currentUser, $db],
          async ([organization, currentUser, db]) => {
            // Do not allow users that are not subscribed to create, update, or delete organizations
            if (!currentUser?.tier) {
              throw new Error("Unauthorized");
            }

            const { members } = dbSchema;

            if (scope === "create") {
              if (currentUser.tier === "basic" || currentUser.tier === "free") {
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
const OrganizationRBACPlugin = wrapPlans({
  Mutation: {
    createOrganization: validatePermissions("organization", "create"),
    updateOrganization: validatePermissions("rowId", "update"),
    deleteOrganization: validatePermissions("rowId", "delete"),
  },
});

export default OrganizationRBACPlugin;
