/**
 * High-level entitlement check helpers for authorization plugins.
 * Wraps the entitlements client with caching.
 */

import { getCached, setCached } from "./cache";
import { getEntitlements } from "./client";

import type { SelectWorkspace } from "lib/db/schema";

/** Backfeed product ID for entitlements */
const PRODUCT_ID = "backfeed";

/** Cache key prefix */
const CACHE_PREFIX = "workspace";

/** Tier type matching workspace schema */
type Tier = SelectWorkspace["tier"];

/** Default limits when entitlements service is unavailable or entitlement not found */
const DEFAULT_LIMITS: Record<string, Record<Tier, number>> = {
  max_projects: { free: 1, basic: 3, team: -1, enterprise: -1 },
  max_feedback_users: { free: 15, basic: -1, team: -1, enterprise: -1 },
  max_comments_per_post: { free: 100, basic: -1, team: -1, enterprise: -1 },
};

interface CachedEntitlements {
  tier: Tier;
  limits: Record<string, number>;
  version: number;
}

/**
 * Fetch and cache entitlements for a workspace.
 */
async function fetchWorkspaceEntitlements(
  workspaceId: string,
): Promise<CachedEntitlements | null> {
  const cacheKey = `${CACHE_PREFIX}:${workspaceId}`;

  // Check cache first
  const cached = getCached<CachedEntitlements>(cacheKey);
  if (cached) return cached;

  // Fetch from entitlements service
  const response = await getEntitlements("workspace", workspaceId, PRODUCT_ID);

  if (!response) return null;

  // Parse entitlements into a usable format
  const entitlements: CachedEntitlements = {
    tier: "free",
    limits: {},
    version: response.entitlementVersion,
  };

  for (const ent of response.entitlements) {
    if (ent.featureKey === "tier") {
      entitlements.tier = (ent.value as Tier) ?? "free";
    } else if (ent.featureKey.startsWith("max_")) {
      entitlements.limits[ent.featureKey] =
        typeof ent.value === "number" ? ent.value : Number(ent.value) || -1;
    }
  }

  // Cache the result
  setCached(cacheKey, entitlements, response.entitlementVersion);

  return entitlements;
}

/**
 * Get a specific limit for a workspace.
 * Returns -1 for unlimited, or the limit number.
 * Falls back to default limits based on tier if entitlements service unavailable.
 */
async function getWorkspaceLimit(
  workspaceId: string,
  limitKey: string,
  fallbackTier: Tier = "free",
): Promise<number> {
  const entitlements = await fetchWorkspaceEntitlements(workspaceId);

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
 * Check if a workspace is within its limit for a resource.
 * Returns true if the current count is below the limit.
 * Returns true if the limit is -1 (unlimited).
 */
export async function checkWorkspaceLimit(
  workspaceId: string,
  limitKey: string,
  currentCount: number,
  fallbackTier: Tier = "free",
): Promise<boolean> {
  const limit = await getWorkspaceLimit(workspaceId, limitKey, fallbackTier);

  // -1 means unlimited
  if (limit === -1) return true;

  return currentCount < limit;
}

/**
 * Check if a workspace is within its limit, using workspace object for fallback.
 * This is the primary function for authorization plugins.
 */
export async function isWithinLimit(
  workspace: { id: string; tier: Tier; organizationId: string },
  limitKey: string,
  currentCount: number,
  billingBypassOrgIds: string[] = [],
): Promise<boolean> {
  // Bypass check for exempt organizations
  if (billingBypassOrgIds.includes(workspace.organizationId)) {
    return true;
  }

  return checkWorkspaceLimit(
    workspace.id,
    limitKey,
    currentCount,
    workspace.tier,
  );
}
