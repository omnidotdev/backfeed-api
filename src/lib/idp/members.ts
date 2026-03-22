/**
 * IDP organization member queries.
 *
 * Fetch member and admin counts from the IDP (Gatekeeper).
 * Uses the Better Auth organization members API endpoint.
 */

import { AUTH_BASE_URL } from "lib/config/env.config";

/** Request timeout in milliseconds */
const REQUEST_TIMEOUT_MS = 3000;

/** Member record from the IDP API */
interface IdpMember {
  id: string;
  role: string;
}

/**
 * Fetch member counts for an organization from the IDP.
 *
 * Fails open (returns null) if the IDP is unavailable.
 */
async function getOrgMemberCounts(
  organizationId: string,
): Promise<{ totalMembers: number; totalAdmins: number } | null> {
  if (!AUTH_BASE_URL) {
    console.warn(
      "[IDP] AUTH_BASE_URL not configured, skipping member count fetch",
    );
    return null;
  }

  try {
    const url = `${AUTH_BASE_URL}/api/organization/${organizationId}/members`;
    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    if (!response.ok) {
      console.warn(
        `[IDP] Failed to fetch members for org ${organizationId}: ${response.status}`,
      );
      return null;
    }

    const data = (await response.json()) as { members: IdpMember[] };
    const members = data.members ?? [];

    return {
      totalMembers: members.length,
      totalAdmins: members.filter(
        (m) => m.role === "admin" || m.role === "owner",
      ).length,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(
      `[IDP] Failed to fetch member counts for org ${organizationId}, failing open: ${message}`,
    );
    return null;
  }
}

export { getOrgMemberCounts };
