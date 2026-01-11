/**
 * Organization claim structure matching the IDP's JWT claims.
 */
export interface OrganizationClaim {
  id: string;
  slug: string;
  type: "personal" | "team";
  roles: string[];
  teams: Array<{ id: string; name: string }>;
}

/**
 * Get the default organization for a user.
 * Priority: personal org first, then oldest team org.
 */
export function getDefaultOrganization(
  organizations: OrganizationClaim[],
): OrganizationClaim | null {
  if (organizations.length === 0) return null;

  // Personal org always takes priority
  const personalOrg = organizations.find((org) => org.type === "personal");
  if (personalOrg) return personalOrg;

  // Fallback to first org (shouldn't happen since personal org always exists)
  return organizations[0];
}
