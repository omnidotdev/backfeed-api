import { EXPORTABLE } from "graphile-export/helpers";
import { context, sideEffect } from "postgraphile/grafast";
import { wrapPlans } from "postgraphile/utils";

import type { InsertMember } from "lib/drizzle/schema";
import type { PlanWrapperFn } from "postgraphile/utils";
import type { MutationScope } from "./types";

const validatePermissions = (propName: string, scope: MutationScope) =>
  EXPORTABLE(
    (context, sideEffect, propName, scope): PlanWrapperFn =>
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

            if (scope === "create") {
              const member = input as InsertMember;

              const existingMembers = await db.query.members.findMany({
                where: (table, { eq }) =>
                  eq(table.organizationId, member.organizationId),
              });

              if (existingMembers.length) {
                const userRole = existingMembers.find(
                  (user) => user.userId === observer.id,
                )?.role;

                // Allow users to join an organization as a member
                if (!userRole) {
                  if (
                    member.userId !== observer.id ||
                    member.role !== "member"
                  ) {
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
              const member = await db.query.members.findFirst({
                where: (table, { eq }) => eq(table.id, input),
                // A bit recursive, but allows us to get details about the member the mutation is for as well as the observer's membership
                with: {
                  organization: {
                    with: {
                      members: {
                        where: (table, { eq }) => eq(table.userId, observer.id),
                      },
                    },
                  },
                },
              });

              if (observer.id !== member?.userId) {
                // Only allow owners to update roles and/or kick other members from the organization
                if (member?.organization.members[0].role !== "owner") {
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
                  // if (scope === "update" && member?.organization.members[0].role !== "owner") {
                  //   throw new Error("Insufficient permissions");
                  // }
                }
              }
            }
          },
        );

        return plan();
      },
    [context, sideEffect, propName, scope],
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
