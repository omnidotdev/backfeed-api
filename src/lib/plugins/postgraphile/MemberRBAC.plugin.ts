import { and, eq } from "drizzle-orm";
import { EXPORTABLE } from "graphile-export/helpers";
import * as dbSchema from "lib/drizzle/schema";
import { context, sideEffect } from "postgraphile/grafast";
import { wrapPlans } from "postgraphile/utils";

import type { InsertMember } from "lib/drizzle/schema";
import type { PlanWrapperFn } from "postgraphile/utils";

type MutationScope = "create" | "update" | "delete";

const validatePermissions = (propName: string, scope: MutationScope) =>
  EXPORTABLE(
    (and, eq, dbSchema, context, sideEffect, propName, scope): PlanWrapperFn =>
      (plan, _, fieldArgs) => {
        const $input = fieldArgs.getRaw(["input", propName]);
        // NB: this is a little hacky, but a "step" can not be undefined, and since `patch` only exists on `update` mutations, we fallback to `input`
        const $patch =
          scope === "update" ? fieldArgs.getRaw(["input", "patch"]) : $input;
        const $observer = context().get("observer");
        const $db = context().get("db");

        sideEffect(
          [$input, $patch, $observer, $db],
          async ([input, patch, observer, db]) => {
            if (!observer) {
              throw new Error("Unauthorized");
            }

            const { members } = dbSchema;

            if (scope === "create") {
              const role = (input as InsertMember).role;
              const userId = (input as InsertMember).userId;
              const organizationId = (input as InsertMember).organizationId;

              const organizationUsers = await db
                .select()
                .from(members)
                .where(eq(members.organizationId, organizationId));

              if (organizationUsers.length) {
                const userRole = organizationUsers.find(
                  (user) => user.userId === observer.id,
                )?.role;

                // Allow users to join an organization as a member
                if (!userRole) {
                  if (userId !== observer.id || role !== "member") {
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
              const [member] = await db
                .select()
                .from(members)
                .where(eq(members.id, input));

              if (observer.id !== member.userId) {
                const [userRole] = await db
                  .select({ role: members.role })
                  .from(members)
                  .where(
                    and(
                      eq(members.userId, observer.id),
                      eq(members.organizationId, member.organizationId),
                    ),
                  );

                // Only allow owners to update roles and/or kick other members from the organization
                if (userRole.role !== "owner") {
                  throw new Error("Insufficient permissions");
                }

                // Disallow updates that include adding an additional owner
                // TODO: remove when add owner / transfer ownership is resolved
                if (patch.role === "owner") {
                  throw new Error("Organizations can only have one owner");
                }
              } else {
                if (scope === "update") {
                  // Restrict current users from updating their own role
                  throw new Error("Insufficient permissions");

                  // TODO: replace above with below when ownership transfers are allowed
                  // if (scope === "update" && member.role !== "owner") {
                  //   throw new Error("Insufficient permissions");
                  // }
                }
              }
            }
          },
        );

        return plan();
      },
    [and, eq, dbSchema, context, sideEffect, propName, scope],
  );

/**
 * Plugin that handles API access for member table mutations.
 */
const membersRBACPlugin = wrapPlans({
  Mutation: {
    createMember: validatePermissions("member", "create"),
    updateMember: validatePermissions("rowId", "update"),
    deleteMember: validatePermissions("rowId", "delete"),
  },
});

export default membersRBACPlugin;
