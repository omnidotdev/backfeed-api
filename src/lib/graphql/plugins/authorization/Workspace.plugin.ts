import { EXPORTABLE } from "graphile-export/helpers";
import { getDefaultOrganization } from "lib/auth/organizations";
import { AUTHZ_ENABLED, AUTHZ_PROVIDER_URL, checkPermission } from "lib/authz";
import { validateOrgExists } from "lib/idp/validateOrg";
import { context, sideEffect } from "postgraphile/grafast";
import { wrapPlans } from "postgraphile/utils";

import type { OrganizationClaim } from "lib/auth/organizations";
import type { PlanWrapperFn } from "postgraphile/utils";
import type { MutationScope } from "./types";

/**
 * Validate that user belongs to the specified organization.
 */
const validateOrgMembership = (
  organizations: OrganizationClaim[],
  organizationId: string,
): boolean => {
  return organizations.some((org) => org.id === organizationId);
};

/**
 * Validate workspace permissions via PDP.
 *
 * - Create: User must belong to the specified organization
 * - Update: Owner permission required
 * - Delete: Owner permission required
 */
const validatePermissions = (propName: string, scope: MutationScope) =>
  EXPORTABLE(
    (
      context,
      sideEffect,
      AUTHZ_ENABLED,
      AUTHZ_PROVIDER_URL,
      checkPermission,
      getDefaultOrganization,
      validateOrgMembership,
      validateOrgExists,
      propName,
      scope,
    ): PlanWrapperFn =>
      (plan, _, fieldArgs) => {
        const $input = fieldArgs.getRaw(["input", propName]);
        const $observer = context().get("observer");
        const $organizations = context().get("organizations");

        sideEffect(
          [$input, $observer, $organizations],
          async ([input, observer, organizations]) => {
            if (!observer) throw new Error("Unauthorized");

            if (scope === "create") {
              // For create, validate org membership
              const workspaceInput = input as {
                organizationId?: string;
              };

              // If organizationId provided, validate membership
              // If not provided, use default org (will be set by mutation)
              const targetOrgId =
                workspaceInput.organizationId ??
                getDefaultOrganization(organizations)?.id;

              if (!targetOrgId) {
                throw new Error("No organization available");
              }

              if (!validateOrgMembership(organizations, targetOrgId)) {
                throw new Error(
                  "Unauthorized: You are not a member of this organization",
                );
              }

              // Validate org exists in IDP (fail-open if IDP unavailable)
              const orgExists = await validateOrgExists(targetOrgId);
              if (!orgExists) {
                throw new Error("Organization not found in identity provider");
              }
            } else {
              // For update/delete, check PDP permissions
              const allowed = await checkPermission(
                AUTHZ_ENABLED,
                AUTHZ_PROVIDER_URL,
                observer.id,
                "workspace",
                input as string,
                "owner",
              );
              if (!allowed) throw new Error("Unauthorized");
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
      getDefaultOrganization,
      validateOrgMembership,
      validateOrgExists,
      propName,
      scope,
    ],
  );

/**
 * Authorization plugin for workspaces.
 *
 * - Create: Any authenticated user
 * - Update: Owner only
 * - Delete: Owner only
 */
const WorkspacePlugin = wrapPlans({
  Mutation: {
    createWorkspace: validatePermissions("workspace", "create"),
    updateWorkspace: validatePermissions("rowId", "update"),
    deleteWorkspace: validatePermissions("rowId", "delete"),
  },
});

export default WorkspacePlugin;
