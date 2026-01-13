/**
 * IDP organization validation.
 *
 * Validates that an organization exists in the IDP before creating workspaces.
 * Uses caching and fail-open circuit breaker for resilience.
 */

import { AUTH_BASE_URL } from "lib/config/env.config";

/** Cache TTL for positive results (org exists) in milliseconds */
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

/** Request timeout in milliseconds */
const REQUEST_TIMEOUT_MS = 3000;

/** Cache for organization existence checks */
const orgExistsCache = new Map<
  string,
  { exists: boolean; expiresAt: number }
>();

/**
 * Check if an organization exists in the IDP.
 *
 * - Caches positive results for 5 minutes
 * - Does NOT cache negative results (org might be in propagation delay)
 * - Fails open if IDP is unavailable (logs warning, returns true)
 *
 * @param organizationId - The organization ID to validate
 * @returns true if org exists or IDP unavailable, false if org confirmed not to exist
 */
export async function validateOrgExists(
  organizationId: string,
): Promise<boolean> {
  if (!AUTH_BASE_URL) {
    console.warn("[IDP] AUTH_BASE_URL not configured, skipping org validation");
    return true; // Fail open
  }

  // Check cache first
  const cached = orgExistsCache.get(organizationId);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.exists;
  }

  try {
    // Query IDP for organization existence
    // Using the Better Auth organization API endpoint
    const response = await fetch(
      `${AUTH_BASE_URL}/api/organization/${organizationId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      },
    );

    if (response.ok) {
      // Cache positive result
      orgExistsCache.set(organizationId, {
        exists: true,
        expiresAt: Date.now() + CACHE_TTL_MS,
      });
      return true;
    }

    if (response.status === 404) {
      // Org confirmed not to exist - don't cache (might be propagation delay)
      console.warn(`[IDP] Organization ${organizationId} not found in IDP`);
      return false;
    }

    // Other error status - fail open
    console.warn(
      `[IDP] Unexpected response checking org ${organizationId}: ${response.status}`,
    );
    return true;
  } catch (error) {
    // Network error or timeout - fail open
    const message = error instanceof Error ? error.message : String(error);
    console.warn(
      `[IDP] Failed to validate org ${organizationId}, failing open: ${message}`,
    );
    return true;
  }
}

/**
 * Clear the organization cache (useful for testing).
 * @knipignore - exported for testing
 */
export function clearOrgCache(): void {
  orgExistsCache.clear();
}
