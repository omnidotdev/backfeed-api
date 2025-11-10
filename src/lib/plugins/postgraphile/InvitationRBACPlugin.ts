import { EXPORTABLE } from "graphile-export/helpers";
import { context, sideEffect } from "postgraphile/grafast";
import { wrapPlans } from "postgraphile/utils";

import type { InsertInvitation } from "lib/drizzle/schema";
import type { PlanWrapperFn } from "postgraphile/utils";
import type { MutationScope } from "./types";

const validateInvitationPermissions = (
  propName: string,
  scope: MutationScope,
) =>
  EXPORTABLE(
    (context, sideEffect, propName, scope): PlanWrapperFn =>
      (plan, _, fieldArgs) => {
        const $input = fieldArgs.getRaw(["input", propName]);
        const $observer = context().get("observer");
        const $db = context().get("db");

        sideEffect([$input, $observer, $db], async ([input, observer, db]) => {
          if (!observer) {
            throw new Error("Unauthorized");
          }

          if (scope === "create") {
            const invitation = input as InsertInvitation;

            const organization = await db.query.organizations.findFirst({
              where: (table, { eq }) => eq(table.id, invitation.organizationId),
              with: {
                members: {
                  where: (table, { eq }) => eq(table.userId, observer.id),
                },
              },
            });

            // Only organization owners or admins can send invitations
            if (
              !organization?.members.length ||
              organization.members[0].role === "member"
            )
              throw new Error(
                "Only organization owners or admins can send invitations",
              );

            // Prevent inviting yourself
            if (observer.email === invitation.email) {
              throw new Error("Self-invites are not allowed");
            }

            // Check for duplicate invite
            const existingInvitation = await db.query.invitations.findFirst({
              where: (table, { and, eq }) =>
                and(
                  eq(table.email, invitation.email),
                  eq(table.organizationId, invitation.organizationId),
                ),
            });

            if (existingInvitation)
              throw new Error(
                "An invitation has already been sent to this email.",
              );

            // If recipient is a user, make sure they're not already a member
            const organizationMembers = await db.query.members.findMany({
              where: (table, { eq }) =>
                eq(table.organizationId, invitation.organizationId),
              with: {
                user: {
                  columns: {
                    email: true,
                  },
                },
              },
            });

            if (
              organizationMembers.find((m) => m.user.email === invitation.email)
            )
              throw new Error("User is already a member of the organization.");
          }

          if (scope === "delete") {
            const invitation = await db.query.invitations.findFirst({
              where: (table, { eq }) => eq(table.id, input),
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
            const isOwner =
              invitation?.organization.members?.[0].role === "owner";
            const isRecipient = observer.email === invitation?.email;

            // Only allow owner or recipient to delete
            if (!isOwner || !isRecipient)
              throw new Error(
                "Only the recipient or owner can delete the invitation",
              );
          }
        });

        return plan();
      },
    [context, sideEffect, propName, scope],
  );

/**
 * Plugin that handles API access for invitation-related mutations.
 */
const InvitationRBACPlugin = wrapPlans({
  Mutation: {
    createInvitation: validateInvitationPermissions("invitation", "create"),
    // TODO: validate updating invitations
    deleteInvitation: validateInvitationPermissions("rowId", "delete"),
  },
});

export default InvitationRBACPlugin;
