import { EXPORTABLE } from "graphile-export/helpers";
import { context, sideEffect } from "postgraphile/grafast";
import { wrapPlans } from "postgraphile/utils";

import type { InsertInvitation } from "lib/db/schema";
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

            const workspace = await db.query.workspaces.findFirst({
              where: (table, { eq }) => eq(table.id, invitation.workspaceId),
              with: {
                members: {
                  where: (table, { eq }) => eq(table.userId, observer.id),
                },
              },
            });

            // Only workspace owners or admins can send invitations
            if (
              !workspace?.members.length ||
              workspace.members[0].role === "member"
            )
              throw new Error(
                "Only workspace owners or admins can send invitations",
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
                  eq(table.workspaceId, invitation.workspaceId),
                ),
            });

            if (existingInvitation)
              throw new Error(
                "An invitation has already been sent to this email.",
              );

            // If recipient is a user, make sure they're not already a member
            const workspaceMembers = await db.query.members.findMany({
              where: (table, { eq }) =>
                eq(table.workspaceId, invitation.workspaceId),
              with: {
                user: {
                  columns: {
                    email: true,
                  },
                },
              },
            });

            if (workspaceMembers.find((m) => m.user.email === invitation.email))
              throw new Error("User is already a member of the workspace.");
          }

          if (scope === "delete") {
            const invitation = await db.query.invitations.findFirst({
              where: (table, { eq }) => eq(table.id, input),
              with: {
                workspace: {
                  with: {
                    members: {
                      where: (table, { eq }) => eq(table.userId, observer.id),
                    },
                  },
                },
              },
            });
            const isOwner = invitation?.workspace.members?.[0].role === "owner";
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
 * Authorization plugin for invitations.
 */
const InvitationPlugin = wrapPlans({
  Mutation: {
    createInvitation: validateInvitationPermissions("invitation", "create"),
    // NB: updating invitations is disabled. See `SmartTags.plugin.ts`
    deleteInvitation: validateInvitationPermissions("rowId", "delete"),
  },
});

export default InvitationPlugin;
