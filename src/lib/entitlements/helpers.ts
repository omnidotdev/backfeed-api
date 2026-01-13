/**
 * High-level entitlement check helpers for authorization plugins.
 * Wraps the entitlements client with caching.
 *
 * Entitlements are queried at the ORGANIZATION level, not workspace level.
 * This enables bundle billing where one subscription covers all Omni products.
 */

import { getCached, setCached } from "./cache";
import { getEntitlements } from "./client";

/** Backfeed product ID for entitlements */
const PRODUCT_ID = "backfeed";

/** Cache key prefix */
const CACHE_PREFIX = "organization";

/** Tier type */
type Tier = "free" | "basic" | "team" | "enterprise";

/** Default limits when entitlements service is unavailable or entitlement not found */
const DEFAULT_LIMITS: Record<string, Record<Tier, number>> = {
  max_projects: { free: 1, basic: 3, team: -1, enterprise: -1 },
  max_feedback_users: { free: 15, basic: -1, team: -1, enterprise: -1 },
  max_comments_per_post: { free: 100, basic: -1, team: -1, enterprise: -1 },
  max_members: { free: 3, basic: 10, team: -1, enterprise: -1 },
  max_admins: { free: 1, basic: 3, team: -1, enterprise: -1 },
};

interface CachedEntitlements {
  tier: Tier;
  limits: Record<string, number>;
  version: number;
}

/**
 * Fetch and cache entitlements for an organization.
 * Entitlements are at the org level, enabling bundle billing.
 */
async function fetchOrganizationEntitlements(
  organizationId: string,
): Promise<CachedEntitlements | null> {
  const cacheKey = `${CACHE_PREFIX}:${organizationId}`;

  // Check cache first
  const cached = getCached<CachedEntitlements>(cacheKey);
  if (cached) return cached;

  // Fetch from entitlements service using organization entity type
  const response = await getEntitlements(
    "organization",
    organizationId,
    PRODUCT_ID,
  );

  if (!response) return null;

  // Parse entitlements into a usable format
  const entitlements: CachedEntitlements = {
    tier: "free",
    limits: {},
    version: response.entitlementVersion,
  };

  for (const ent of response.entitlements) {
    // Check product-specific tier first (backfeed:tier), then shared tier
    if (ent.featureKey === `${PRODUCT_ID}:tier` || ent.featureKey === "tier") {
      entitlements.tier = (ent.value as Tier) ?? "free";
    } else if (ent.featureKey.startsWith("max_")) {
      // Handle both product-specific (backfeed:max_projects) and shared (max_projects)
      const key = ent.featureKey.replace(`${PRODUCT_ID}:`, "");
      entitlements.limits[key] =
        typeof ent.value === "number" ? ent.value : Number(ent.value) || -1;
    }
  }

  // Cache the result
  setCached(cacheKey, entitlements, response.entitlementVersion);

  return entitlements;
}

/**
 * Get a specific limit for an organization.
 * Returns -1 for unlimited, or the limit number.
 * Falls back to default limits based on tier if entitlements service unavailable.
 */
async function getOrganizationLimit(
  organizationId: string,
  limitKey: string,
  fallbackTier: Tier = "free",
): Promise<number> {
  const entitlements = await fetchOrganizationEntitlements(organizationId);

  if (entitlements) {
    // Check if we have a specific limit set
    if (limitKey in entitlements.limits) {
      return entitlements.limits[limitKey];
    }

    // Fall back to default for tier
    return DEFAULT_LIMITS[limitKey]?.[entitlements.tier] ?? -1;
  }

  // Entitlements service unavailable - use fallback tier defaults
  return DEFAULT_LIMITS[limitKey]?.[fallbackTier] ?? -1;
}

/**
 * Check if an organization is within its limit for a resource.
 * Returns true if the current count is below the limit.
 * Returns true if the limit is -1 (unlimited).
 */
export async function checkOrganizationLimit(
  organizationId: string,
  limitKey: string,
  currentCount: number,
  fallbackTier: Tier = "free",
): Promise<boolean> {
  const limit = await getOrganizationLimit(
    organizationId,
    limitKey,
    fallbackTier,
  );

  // -1 means unlimited
  if (limit === -1) return true;

  return currentCount < limit;
}

/**
 * Check if a workspace is within its limit.
 * Queries entitlements at the organization level (bundle billing model).
 * This is the primary function for authorization plugins.
 */
export async function isWithinLimit(
  workspace: { id: string; organizationId: string },
  limitKey: string,
  currentCount: number,
  billingBypassOrgIds: string[] = [],
): Promise<boolean> {
  // Bypass check for exempt organizations
  if (billingBypassOrgIds.includes(workspace.organizationId)) {
    return true;
  }

  return checkOrganizationLimit(
    workspace.organizationId,
    limitKey,
    currentCount,
    "free", // Default to free tier if Aether unavailable
  );
}

/**
 * Get the tier for an organization.
 * Useful for displaying tier in UI.
 * @knipignore - exported for UI tier display
 */
export async function getOrganizationTier(
  organizationId: string,
): Promise<Tier> {
  const entitlements = await fetchOrganizationEntitlements(organizationId);
  return entitlements?.tier ?? "free";
}
