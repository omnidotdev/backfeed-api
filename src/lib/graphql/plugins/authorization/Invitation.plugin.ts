import { EXPORTABLE } from "graphile-export/helpers";
import { AUTHZ_ENABLED, AUTHZ_PROVIDER_URL, checkPermission } from "lib/authz";
import { context, sideEffect } from "postgraphile/grafast";
import { wrapPlans } from "postgraphile/utils";

import type { InsertInvitation } from "lib/db/schema";
import type { PlanWrapperFn } from "postgraphile/utils";
import type { MutationScope } from "./types";

/**
 * Validate invitation permissions via Warden.
 *
 * - Create: Admin+ can send invitations
 * - Delete: Owner or recipient can delete
 */
const validateInvitationPermissions = (
  propName: string,
  scope: MutationScope,
) =>
  EXPORTABLE(
    (
      context,
      sideEffect,
      AUTHZ_ENABLED,
      AUTHZ_PROVIDER_URL,
      checkPermission,
      propName,
      scope,
    ): PlanWrapperFn =>
      (plan, _, fieldArgs) => {
        const $input = fieldArgs.getRaw(["input", propName]);
        const $observer = context().get("observer");
        const $db = context().get("db");

        sideEffect([$input, $observer, $db], async ([input, observer, db]) => {
          if (!observer) throw new Error("Unauthorized");

          if (scope === "create") {
            const invitation = input as InsertInvitation;

            // Check admin permission via Warden
            const allowed = await checkPermission(
              AUTHZ_ENABLED,
              AUTHZ_PROVIDER_URL,
              observer.id,
              "workspace",
              invitation.workspaceId,
              "admin",
            );
            if (!allowed)
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
            });

            if (!invitation) throw new Error("Invitation not found");

            const isRecipient = observer.email === invitation.email;

            // Recipient can always delete their own invitation
            if (!isRecipient) {
              // Check owner permission via Warden
              const allowed = await checkPermission(
                AUTHZ_ENABLED,
                AUTHZ_PROVIDER_URL,
                observer.id,
                "workspace",
                invitation.workspaceId,
                "owner",
              );
              if (!allowed)
                throw new Error(
                  "Only the recipient or owner can delete the invitation",
                );
            }
          }
        });

        return plan();
      },
    [
      context,
      sideEffect,
      AUTHZ_ENABLED,
      AUTHZ_PROVIDER_URL,
      checkPermission,
      propName,
      scope,
    ],
  );

/**
 * Authorization plugin for invitations.
 *
 * - Create: Admin+ can invite
 * - Delete: Owner or recipient
 */
const InvitationPlugin = wrapPlans({
  Mutation: {
    createInvitation: validateInvitationPermissions("invitation", "create"),
    deleteInvitation: validateInvitationPermissions("rowId", "delete"),
  },
});

export default InvitationPlugin;
