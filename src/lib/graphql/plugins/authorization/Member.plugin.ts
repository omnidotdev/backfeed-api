import { EXPORTABLE } from "graphile-export/helpers";
import { AUTHZ_ENABLED, AUTHZ_PROVIDER_URL, checkPermission } from "lib/authz";
import { context, sideEffect } from "postgraphile/grafast";
import { wrapPlans } from "postgraphile/utils";

import type { InsertMember } from "lib/db/schema";
import type { PlanWrapperFn } from "postgraphile/utils";
import type { MutationScope } from "./types";

/**
 * Validate member permissions via PDP.
 *
 * - Create: Admin+ can invite, or users can self-join as member
 * - Update: Owner only can change roles
 * - Delete: Owner can remove anyone, users can remove themselves
 */
const validatePermissions = (propName: string, scope: MutationScope) =>
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
        const $patch =
          scope === "update" ? fieldArgs.getRaw(["input", "patch"]) : $input;
        const $observer = context().get("observer");
        const $db = context().get("db");

        sideEffect(
          [$input, $patch, $observer, $db],
          async ([input, patch, observer, db]) => {
            if (!observer) throw new Error("Unauthorized");

            if (scope === "create") {
              const member = input as InsertMember;

              const existingMembers = await db.query.members.findMany({
                where: (table, { eq }) =>
                  eq(table.workspaceId, member.workspaceId),
              });

              if (existingMembers.length) {
                const isSelfJoin =
                  member.userId === observer.id && member.role === "member";

                if (!isSelfJoin) {
                  // Check admin permission via PDP for inviting others
                  const allowed = await checkPermission(
                    AUTHZ_ENABLED,
                    AUTHZ_PROVIDER_URL,
                    observer.id,
                    "workspace",
                    member.workspaceId,
                    "admin",
                  );
                  if (!allowed) throw new Error("Insufficient permissions");
                }
              }
            } else {
              const member = await db.query.members.findFirst({
                where: (table, { eq }) => eq(table.id, input),
              });

              if (!member) throw new Error("Member not found");

              const isSelf = observer.id === member.userId;

              if (!isSelf) {
                // Check owner permission via PDP to modify others
                const allowed = await checkPermission(
                  AUTHZ_ENABLED,
                  AUTHZ_PROVIDER_URL,
                  observer.id,
                  "workspace",
                  member.workspaceId,
                  "owner",
                );
                if (!allowed) throw new Error("Insufficient permissions");

                // Disallow adding additional owners
                if (scope === "update" && patch.role === "owner") {
                  throw new Error("Workspaces can only have one owner");
                }
              } else {
                // Users cannot update their own role
                if (scope === "update") {
                  throw new Error("Insufficient permissions");
                }
                // Users can delete themselves (leave workspace)
              }
            }
          },
        );

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
 * Authorization plugin for members.
 *
 * - Create: Admin+ can invite, users can self-join as member
 * - Update: Owner only
 * - Delete: Owner or self
 */
const MemberPlugin = wrapPlans({
  Mutation: {
    createMember: validatePermissions("member", "create"),
    updateMember: validatePermissions("rowId", "update"),
    deleteMember: validatePermissions("rowId", "delete"),
  },
});

export default MemberPlugin;
