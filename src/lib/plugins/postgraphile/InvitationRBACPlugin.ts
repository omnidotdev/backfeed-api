import { and, eq } from "drizzle-orm";
import { EXPORTABLE } from "graphile-export/helpers";
import { context, sideEffect } from "postgraphile/grafast";
import { makeWrapPlansPlugin } from "postgraphile/utils";

import * as dbSchema from "lib/drizzle/schema";

import type { GraphQLContext } from "lib/graphql";
import type { ExecutableStep, FieldArgs } from "postgraphile/grafast";

type MutationScope = "create" | "delete";

const validateInvitationPermissions = (
  propName: string,
  scope: MutationScope
) =>
  EXPORTABLE(
    (and, eq, dbSchema, context, sideEffect, propName, scope) =>
      // biome-ignore lint/suspicious/noExplicitAny: SmartFieldPlanResolver is not an exported type
      (plan: any, _: ExecutableStep, fieldArgs: FieldArgs) => {
        const $invitationId = fieldArgs.getRaw(["input", propName]);
        const $currentUser = context<GraphQLContext>().get("currentUser");
        const $db = context<GraphQLContext>().get("db");

        sideEffect(
          [$invitationId, $currentUser, $db],
          async ([invitationId, currentUser, db]) => {
            if (!currentUser) {
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

            // Prevent inviting yourself to an organization you are the owner of.
            if (currentUser.email === invitation.email && scope === "create") {
              throw new Error("Self invites are not allowed");
            }

            const [existingInvitation] = await db
              .select()
              .from(invitations)
              .where(
                and(
                  eq(invitations.email, invitation.email),
                  eq(invitations.organizationId, invitation.organizationId)
                )
              );

            if (existingInvitation) {
              throw new Error(
                "An invitation has already been sent to this email."
              );
            }

            // Look up user by email
            const [existingUser] = await db
              .select({ id: users.id })
              .from(users)
              .where(eq(users.email, invitation.email));

            if (existingUser) {
              // Check if user is already a member of the organization
              const [existingMember] = await db
                .select()
                .from(members)
                .where(
                  and(
                    eq(members.userId, existingUser.id),
                    eq(members.organizationId, invitation.organizationId)
                  )
                );

              if (existingMember) {
                throw new Error(
                  "User is already a member of the organization."
                );
              }
            }
          }
        );

        return plan();
      },
    [and, eq, dbSchema, context, sideEffect, propName, scope]
  );

/**
 * Plugin that handles API access for invitation-related mutations.
 */
const InvitationRBACPlugin = makeWrapPlansPlugin({
  Mutation: {
    createInvitation: validateInvitationPermissions("invitation", "create"),
    deleteInvitation: validateInvitationPermissions("rowId", "delete"),
  },
});

export default InvitationRBACPlugin;
