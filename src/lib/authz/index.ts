/**
 * Authorization module for Backfeed.
 *
 * Thin wrapper around @omnidotdev/providers AuthzProvider.
 * Maintains the same API surface for PostGraphile EXPORTABLE compatibility.
 */

import { AUTHZ_API_URL } from "lib/config/env.config";
import { authz } from "lib/providers";

import { enqueueWardenSync } from "./syncQueue";

import type {
  PermissionCheck,
  PermissionCheckResult,
} from "@omnidotdev/providers";

export { default as authzRoutes } from "./routes";
export {
  enqueueWardenSync,
  startWardenSyncPoller,
  stopWardenSyncPoller,
} from "./syncQueue";
export * from "./types";

/**
 * Check if AuthZ is enabled and configured.
 * Exported as a function (not a value) so graphile-export handles it correctly.
 */
export function isAuthzEnabled(): boolean {
  return !!AUTHZ_API_URL;
}

/**
 * Check if a user has permission on a resource.
 * Exported for graphile-export EXPORTABLE compatibility.
 */
export async function checkPermission(
  userId: string,
  resourceType: string,
  resourceId: string,
  permission: string,
  requestCache?: Map<string, boolean>,
): Promise<boolean> {
  if (!isAuthzEnabled()) return true;

  return authz!.checkPermission(
    userId,
    resourceType,
    resourceId,
    permission,
    requestCache,
  );
}

/**
 * Batch check multiple permissions in a single API call.
 */
export async function checkPermissionsBatch(
  checks: PermissionCheck[],
  requestCache?: Map<string, boolean>,
): Promise<PermissionCheckResult[]> {
  if (!isAuthzEnabled()) {
    return checks.map((check) => ({ ...check, allowed: true }));
  }

  if (!authz!.checkPermissionsBatch) {
    const results: PermissionCheckResult[] = [];
    for (const check of checks) {
      const allowed = await authz!.checkPermission(
        check.userId,
        check.resourceType,
        check.resourceId,
        check.permission,
        requestCache,
      );
      results.push({ ...check, allowed });
    }
    return results;
  }

  return authz!.checkPermissionsBatch(checks, requestCache);
}

/**
 * Write tuples to the authorization store.
 * Enqueues for retry on failure to prevent silent tuple loss.
 * Exported for graphile-export EXPORTABLE compatibility.
 */
export async function writeTuples(
  tuples: Array<{ user: string; relation: string; object: string }>,
): Promise<void> {
  if (!isAuthzEnabled()) return;
  if (!authz!.writeTuples) return;

  try {
    await authz!.writeTuples(tuples);
  } catch (error) {
    console.error("[AuthZ] Tuple write failed, enqueuing for retry:", error);
    await enqueueWardenSync("write", tuples, error);
  }
}

/**
 * Delete tuples from the authorization store.
 * Enqueues for retry on failure to prevent silent tuple loss.
 * Exported for graphile-export EXPORTABLE compatibility.
 */
export async function deleteTuples(
  tuples: Array<{ user: string; relation: string; object: string }>,
): Promise<void> {
  if (!isAuthzEnabled()) return;
  if (!authz!.deleteTuples) return;

  try {
    await authz!.deleteTuples(tuples);
  } catch (error) {
    console.error("[AuthZ] Tuple delete failed, enqueuing for retry:", error);
    await enqueueWardenSync("delete", tuples, error);
  }
}

/**
 * Build a cache key for a permission check.
 */
export function buildPermissionCacheKey(
  userId: string,
  resourceType: string,
  resourceId: string,
  permission: string,
): string {
  return `${userId}:${resourceType}:${resourceId}:${permission}`;
}

/**
 * Invalidate cached permissions matching a pattern.
 */
export function invalidatePermissionCache(pattern: string): void {
  authz?.invalidateCache?.(pattern);
}

/**
 * Clear all cached permissions.
 */
export function clearPermissionCache(): void {
  authz?.clearCache?.();
}
