/**
 * Entitlements module for Backfeed.
 *
 * Thin wrapper around @omnidotdev/providers BillingProvider.
 * Maintains the same API surface for PostGraphile EXPORTABLE compatibility.
 *
 * Entitlements are queried at the ORGANIZATION level for bundle billing.
 */

import { isWithinLimit as checkLimit } from "@omnidotdev/providers";
import { billing } from "lib/providers";

import type { EntitlementsResponse } from "@omnidotdev/providers";

/** Backfeed app ID for entitlements */
const APP_ID = "backfeed";

/** Tier type */
type Tier = "free" | "basic" | "team" | "enterprise";

/** Default limits by feature key and tier */
const DEFAULT_LIMITS: Record<string, Record<string, number>> = {
  max_projects: { free: 1, basic: 3, team: -1, enterprise: -1 },
  max_feedback_users: { free: 15, basic: -1, team: -1, enterprise: -1 },
  max_comments_per_post: { free: 100, basic: -1, team: -1, enterprise: -1 },
  max_members: { free: 3, basic: 10, team: -1, enterprise: -1 },
  max_admins: { free: 1, basic: 3, team: -1, enterprise: -1 },
};

/**
 * Fetch entitlements for an organization from the billing provider.
 */
async function getOrganizationEntitlements(
  organizationId: string,
): Promise<EntitlementsResponse | null> {
  return billing.getEntitlements("organization", organizationId, APP_ID);
}

/**
 * Check if an organization is within its limit for a resource.
 * This is the primary function for authorization plugins.
 *
 * @param entity - Object with organizationId
 * @param limitKey - The limit key to check (e.g., "max_projects")
 * @param currentCount - Current count of resources
 * @param billingBypassOrgIds - Organization IDs exempt from billing limits
 */
export async function isWithinLimit(
  entity: { organizationId: string },
  limitKey: string,
  currentCount: number,
  billingBypassOrgIds: string[] = [],
): Promise<boolean> {
  // Bypass check for exempt organizations
  if (billingBypassOrgIds.includes(entity.organizationId)) {
    return true;
  }

  const entitlements = await getOrganizationEntitlements(entity.organizationId);

  return checkLimit(entitlements, limitKey, currentCount, DEFAULT_LIMITS);
}

/**
 * Check if an organization is within its limit.
 * Lower-level function without bypass logic.
 */
export async function checkOrganizationLimit(
  organizationId: string,
  limitKey: string,
  currentCount: number,
): Promise<boolean> {
  const entitlements = await getOrganizationEntitlements(organizationId);

  return checkLimit(entitlements, limitKey, currentCount, DEFAULT_LIMITS);
}

/**
 * Get the tier for an organization.
 * Returns "free" if org not found (no billing account yet).
 * @knipignore Used by scripts
 */
export async function getOrganizationTier(
  organizationId: string,
): Promise<Tier> {
  const entitlements = await getOrganizationEntitlements(organizationId);

  if (!entitlements) return "free";

  const tierEntitlement = entitlements.entitlements.find(
    (e) => e.featureKey === `${APP_ID}:tier` || e.featureKey === "tier",
  );

  return (tierEntitlement?.value as Tier) ?? "free";
}

/**
 * Invalidate cached entitlements for an organization.
 * Called from webhook handlers when entitlements change.
 */
export function invalidateCache(pattern: string): void {
  const parts = pattern.replace(/:\*$/, "").split(":");
  if (parts.length >= 2) {
    billing.invalidateCache?.(parts[0], parts[1]);
  } else {
    billing.clearCache?.();
  }
}
