/**
 * TTL-based permission cache for authZ checks.
 * Mirrors the pattern from entitlements/cache.ts.
 *
 * Caches permission check results with a 5-minute TTL to reduce
 * redundant Warden calls across GraphQL requests.
 */

interface CacheEntry {
  allowed: boolean;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry>();

/** Default TTL: 5 minutes */
const DEFAULT_TTL_MS = 300_000;

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
 * Get a cached permission result.
 * Returns null if not cached or expired.
 */
export function getCachedPermission(key: string): boolean | null {
  const entry = cache.get(key);
  if (!entry) return null;

  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }

  return entry.allowed;
}

/**
 * Cache a permission result with TTL.
 */
export function setCachedPermission(
  key: string,
  allowed: boolean,
  ttlMs: number = DEFAULT_TTL_MS,
): void {
  cache.set(key, {
    allowed,
    expiresAt: Date.now() + ttlMs,
  });
}

/**
 * Invalidate cached permissions matching a pattern.
 * Used when membership changes to clear stale permissions.
 *
 * Pattern examples:
 * - `user123:workspace:` - All workspace permissions for user
 * - `user123:` - All permissions for user
 * - `:workspace:ws456:` - All permissions for workspace
 */
export function invalidatePermissionCache(pattern: string): void {
  for (const key of cache.keys()) {
    if (key.includes(pattern)) {
      cache.delete(key);
    }
  }
}

/**
 * Clear all cached permissions.
 * Useful for testing or emergency cache flush.
 */
export function clearPermissionCache(): void {
  cache.clear();
}
