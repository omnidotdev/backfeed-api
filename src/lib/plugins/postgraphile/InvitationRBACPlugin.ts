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

            const { members, invitations } = dbSchema;

            const [invitation] = await db
              .select({
                organizationId: invitations.organizationId,
                email: invitations.email,
              })
              .from(invitations)
              .where(eq(invitations.id, invitationId));

            if (currentUser.email !== invitation.email) {
              const [userRole] = await db
                .select({ role: members.role })
                .from(members)
                .where(
                  and(
                    eq(members.userId, currentUser.id),
                    eq(members.organizationId, invitation.organizationId)
                  )
                );

              // Only allow owners and admins to create or delete invitations
              if (!userRole || userRole.role === "member") {
                throw new Error(
                  "Insufficient permissions to manage invitations"
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
