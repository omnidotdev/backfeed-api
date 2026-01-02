/**
 * Simple in-memory cache with TTL for entitlements.
 * Invalidated via webhooks from the entitlements servicethe entitlements service.
 */

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
  version: number;
}

const cache = new Map<string, CacheEntry<unknown>>();

/** Default TTL: 60 seconds */
const DEFAULT_TTL_MS = 60_000;

/**
 * Get a cached value if it exists and hasn't expired.
 * Optionally validate against a version number.
 */
export const getCached = <T>(key: string, version?: number): T | null => {
  const entry = cache.get(key);

  if (!entry) return null;

  // Check expiration
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }

  // Check version if provided (stale if version mismatch)
  if (version !== undefined && entry.version !== version) {
    cache.delete(key);
    return null;
  }

  return entry.value as T;
};

/**
 * Set a cached value with TTL and version.
 */
export const setCached = <T>(
  key: string,
  value: T,
  version: number,
  ttlMs: number = DEFAULT_TTL_MS,
): void => {
  cache.set(key, {
    value,
    expiresAt: Date.now() + ttlMs,
    version,
  });
};

/**
 * Invalidate cache entries matching a pattern.
 * Supports simple prefix matching with `*` at end.
 */
export const invalidateCache = (pattern: string): void => {
  if (pattern.endsWith("*")) {
    const prefix = pattern.slice(0, -1);
    for (const key of cache.keys()) {
      if (key.startsWith(prefix)) {
        cache.delete(key);
      }
    }
  } else {
    cache.delete(pattern);
  }
};
