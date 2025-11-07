import { and, eq } from "drizzle-orm";
import { EXPORTABLE } from "graphile-export/helpers";
import * as dbSchema from "lib/drizzle/schema";
import { context, sideEffect } from "postgraphile/grafast";
import { wrapPlans } from "postgraphile/utils";

import type { PlanWrapperFn } from "postgraphile/utils";

type MutationScope = "create" | "delete";

const validateInvitationPermissions = (
  propName: string,
  scope: MutationScope,
) =>
  EXPORTABLE(
    (and, eq, dbSchema, context, sideEffect, propName, scope): PlanWrapperFn =>
      (plan, _, fieldArgs) => {
        const $invitationId = fieldArgs.getRaw(["input", propName]);
        const $observer = context().get("observer");
        const $db = context().get("db");

        sideEffect(
          [$invitationId, $observer, $db],
          async ([invitationId, observer, db]) => {
            if (!observer) {
              throw new Error("Unauthorized");
            }

            const { users, members, invitations } = dbSchema;

            const [invitation] = await db
              .select({
                organizationId: invitations.organizationId,
                email: invitations.email,
              })
              .from(invitations)
              .where(eq(invitations.id, invitationId));

            if (!invitation) {
              throw new Error("Invitation not found");
            }

            const [userRole] = await db
              .select({ role: members.role })
              .from(members)
              .where(
                and(
                  eq(members.userId, observer.id),
                  eq(members.organizationId, invitation.organizationId),
                ),
              );

            if (scope === "create") {
              // Only organization owners or admins can send invitations
              if (
                !userRole ||
                (userRole.role !== "owner" && userRole.role !== "admin")
              ) {
                throw new Error(
                  "Only organization owners or admins can send invitations",
                );
              }

              // Prevent inviting yourself
              if (observer.email === invitation.email) {
                throw new Error("Self-invites are not allowed");
              }

              // Check for duplicate invite
              const [existingInvitation] = await db
                .select()
                .from(invitations)
                .where(
                  and(
                    eq(invitations.email, invitation.email),
                    eq(invitations.organizationId, invitation.organizationId),
                  ),
                );

              if (existingInvitation) {
                throw new Error(
                  "An invitation has already been sent to this email.",
                );
              }

              // If recipient is a user, make sure they're not already a member
              const [existingUser] = await db
                .select({ id: users.id })
                .from(users)
                .where(eq(users.email, invitation.email));

              if (existingUser) {
                const [existingMember] = await db
                  .select()
                  .from(members)
                  .where(
                    and(
                      eq(members.userId, existingUser.id),
                      eq(members.organizationId, invitation.organizationId),
                    ),
                  );

                if (existingMember) {
                  throw new Error(
                    "User is already a member of the organization.",
                  );
                }
              }
            }

            if (scope === "delete") {
              const isOwner = userRole?.role === "owner";
              const isRecipient = observer.email === invitation.email;

              // Only allow owner or recipient to delete
              if (!isOwner || !isRecipient) {
                throw new Error(
                  "Only the recipient or owner can delete the invitation",
                );
              }
            }
          },
        );

        return plan();
      },
    [and, eq, dbSchema, context, sideEffect, propName, scope],
  );

/**
 * Plugin that handles API access for invitation-related mutations.
 */
const InvitationRBACPlugin = wrapPlans({
  Mutation: {
    createInvitation: validateInvitationPermissions("invitation", "create"),
    deleteInvitation: validateInvitationPermissions("rowId", "delete"),
  },
});

export default InvitationRBACPlugin;
