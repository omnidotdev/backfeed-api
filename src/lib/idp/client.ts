/**
 * IDP client utilities.
 *
 * These functions sync membership to the IDP (identity provider).
 * All functions accept config values as parameters to support
 * graphile-export's EXPORTABLE pattern (no external variable references).
 */

// Re-export for EXPORTABLE compatibility in plugins
export { AUTH_BASE_URL } from "lib/config/env.config";

interface AddOrgMemberParams {
  organizationId: string;
  userId: string;
  role?: "owner" | "admin" | "member";
}

interface AddOrgMemberResult {
  success: boolean;
  error?: string;
}

/**
 * Add a user to an IDP organization.
 *
 * This is called when a user accepts a workspace invitation to ensure
 * they are also a member of the corresponding IDP organization.
 *
 * Uses globalThis.fetch for EXPORTABLE compatibility with graphile-export.
 *
 * @param authBaseUrl - The IDP base URL (passed for EXPORTABLE compatibility)
 * @param params - The member details
 */
export async function addOrgMember(
  authBaseUrl: string,
  params: AddOrgMemberParams,
): Promise<AddOrgMemberResult> {
  try {
    const response = await globalThis.fetch(
      `${authBaseUrl}/api/organization/add-member`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organizationId: params.organizationId,
          userId: params.userId,
          role: params.role ?? "member",
        }),
      },
    );

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message ?? "Failed to add org member",
      };
    }

    return { success: true };
  } catch (err) {
    console.error("IDP add-member error:", err);
    return { success: false, error: "IDP unavailable" };
  }
}
