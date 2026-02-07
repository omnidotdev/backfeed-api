/**
 * Organization claim types - re-exported from @omnidotdev/providers.
 */

export type { OrganizationClaim } from "@omnidotdev/providers";

/**
 * Get the default organization for a user.
 * Priority: personal org first, then oldest team org.
 */
export function getDefaultOrganization(
  organizations: import("@omnidotdev/providers").OrganizationClaim[],
): import("@omnidotdev/providers").OrganizationClaim | null {
  if (organizations.length === 0) return null;

  // Personal org always takes priority
  const personalOrg = organizations.find((org) => org.type === "personal");
  if (personalOrg) return personalOrg;

  // Fallback to first org (shouldn't happen since personal org always exists)
  return organizations[0];
}
