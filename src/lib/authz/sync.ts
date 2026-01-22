/**
 * Tuple sync helpers for Backfeed.
 *
 * These functions sync Backfeed's domain events to the authorization store.
 * Called from PostGraphile plugins after successful mutations.
 *
 * All functions read configuration from environment at runtime rather than
 * accepting them as parameters. This allows graphile-export to serialize
 * function references without inlining env values at generation time.
 *
 * Uses Vortex for durable delivery when configured, falls back to direct Warden API.
 */

import {
  AUTHZ_API_URL,
  AUTHZ_ENABLED,
  VORTEX_API_URL,
  VORTEX_AUTHZ_WEBHOOK_SECRET,
} from "lib/config/env.config";

/** @knipignore - re-exported for plugin compatibility */
export {
  buildPermissionCacheKey,
  getCachedPermission,
  invalidatePermissionCache,
  setCachedPermission,
} from "./cache";

/**
 * Check if AuthZ is enabled and configured.
 * Exported as a function (not a value) so graphile-export handles it correctly.
 * Use this in plugins for early-exit checks before doing expensive work.
 */
export function isAuthzEnabled(): boolean {
  return AUTHZ_ENABLED === "true" && !!AUTHZ_API_URL;
}

/** Request timeout in milliseconds */
const REQUEST_TIMEOUT_MS = 5000;

/** Circuit breaker failure threshold before opening */
const CIRCUIT_BREAKER_THRESHOLD = 5;

/** Circuit breaker cooldown in milliseconds before half-open */
const CIRCUIT_BREAKER_COOLDOWN_MS = 30000;

type AuthzEventType =
  | "permission_check"
  | "tuple_write"
  | "tuple_delete"
  | "tuple_skipped"
  | "circuit_open"
  | "circuit_half_open"
  | "circuit_closed";

interface AuthzEvent {
  type: AuthzEventType;
  userId?: string;
  resourceType?: string;
  resourceId?: string;
  permission?: string;
  allowed?: boolean;
  durationMs?: number;
  error?: string;
  tupleCount?: number;
  viaVortex?: boolean;
}

/**
 * Log authz events as structured JSON for observability.
 */
function logAuthzEvent(event: AuthzEvent): void {
  console.log(
    JSON.stringify({ ...event, timestamp: new Date().toISOString() }),
  );
}

/**
 * Circuit breaker for PDP calls.
 * Fails closed (denies access) when circuit is open to prevent security bypass.
 */
class CircuitBreaker {
  private failures = 0;
  private state: "closed" | "open" | "half-open" = "closed";
  private lastFailure = 0;

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === "open") {
      if (Date.now() - this.lastFailure > CIRCUIT_BREAKER_COOLDOWN_MS) {
        this.state = "half-open";
        logAuthzEvent({ type: "circuit_half_open" });
      } else {
        throw new Error("PDP unavailable - circuit open (fail-closed)");
      }
    }

    try {
      const result = await fn();
      this.reset();
      return result;
    } catch (error) {
      this.recordFailure();
      throw error;
    }
  }

  private reset(): void {
    if (this.failures > 0 || this.state !== "closed") {
      logAuthzEvent({ type: "circuit_closed" });
    }
    this.failures = 0;
    this.state = "closed";
  }

  private recordFailure(): void {
    this.failures++;
    this.lastFailure = Date.now();

    if (this.failures >= CIRCUIT_BREAKER_THRESHOLD) {
      this.state = "open";
      logAuthzEvent({
        type: "circuit_open",
        error: `Circuit opened after ${this.failures} consecutive failures`,
      });
    }
  }
}

// Singleton circuit breaker instance for permission checks
const circuitBreaker = new CircuitBreaker();

/**
 * Write tuples to the authorization store.
 * Uses Vortex for durable delivery, falls back to direct Warden API.
 * Exported for graphile-export EXPORTABLE compatibility.
 *
 * Reads AUTHZ_ENABLED, AUTHZ_API_URL, VORTEX_API_URL, and VORTEX_AUTHZ_WEBHOOK_SECRET
 * from environment at runtime.
 *
 * @param tuples - The tuples to write
 */
export async function writeTuples(
  tuples: Array<{ user: string; relation: string; object: string }>,
): Promise<void> {
  // Skip if authz is disabled
  if (AUTHZ_ENABLED !== "true") return;
  if (tuples.length === 0) return;

  const startTime = Date.now();

  // Try Vortex first for durable delivery
  if (VORTEX_API_URL && VORTEX_AUTHZ_WEBHOOK_SECRET) {
    try {
      const response = await fetch(
        `${VORTEX_API_URL}/webhooks/authz/${VORTEX_AUTHZ_WEBHOOK_SECRET}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Event-Type": "authz.tuples.write",
          },
          body: JSON.stringify({
            tuples,
            source: "backfeed",
            timestamp: new Date().toISOString(),
          }),
          signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        },
      );

      if (response.ok) {
        logAuthzEvent({
          type: "tuple_write",
          tupleCount: tuples.length,
          durationMs: Date.now() - startTime,
          viaVortex: true,
        });
        return;
      }
      // Fall through to direct API on Vortex failure
      logAuthzEvent({
        type: "tuple_write",
        tupleCount: tuples.length,
        error: `Vortex returned ${response.status}, falling back to direct API`,
        viaVortex: true,
      });
    } catch (error) {
      logAuthzEvent({
        type: "tuple_write",
        tupleCount: tuples.length,
        error: `Vortex failed: ${error instanceof Error ? error.message : String(error)}, falling back to direct API`,
        viaVortex: true,
      });
    }
  }

  // Fallback: Direct Warden API
  if (!AUTHZ_API_URL) {
    logAuthzEvent({
      type: "tuple_skipped",
      tupleCount: tuples.length,
      error: "Neither Vortex nor Warden API configured",
    });
    return;
  }

  try {
    const response = await fetch(`${AUTHZ_API_URL}/tuples`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tuples }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    if (!response.ok) {
      throw new Error(`Warden write failed: ${response.status}`);
    }

    logAuthzEvent({
      type: "tuple_write",
      tupleCount: tuples.length,
      durationMs: Date.now() - startTime,
      viaVortex: false,
    });
  } catch (error) {
    logAuthzEvent({
      type: "tuple_write",
      tupleCount: tuples.length,
      durationMs: Date.now() - startTime,
      error: error instanceof Error ? error.message : String(error),
      viaVortex: false,
    });
  }
}

/**
 * Delete tuples from the authorization store.
 * Uses Vortex for durable delivery, falls back to direct Warden API.
 * Exported for graphile-export EXPORTABLE compatibility.
 *
 * Reads AUTHZ_ENABLED, AUTHZ_API_URL, VORTEX_API_URL, and VORTEX_AUTHZ_WEBHOOK_SECRET
 * from environment at runtime.
 *
 * @param tuples - The tuples to delete
 */
export async function deleteTuples(
  tuples: Array<{ user: string; relation: string; object: string }>,
): Promise<void> {
  // Skip if authz is disabled
  if (AUTHZ_ENABLED !== "true") return;
  if (tuples.length === 0) return;

  const startTime = Date.now();

  // Try Vortex first for durable delivery
  if (VORTEX_API_URL && VORTEX_AUTHZ_WEBHOOK_SECRET) {
    try {
      const response = await fetch(
        `${VORTEX_API_URL}/webhooks/authz/${VORTEX_AUTHZ_WEBHOOK_SECRET}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Event-Type": "authz.tuples.delete",
          },
          body: JSON.stringify({
            tuples,
            source: "backfeed",
            timestamp: new Date().toISOString(),
          }),
          signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        },
      );

      if (response.ok) {
        logAuthzEvent({
          type: "tuple_delete",
          tupleCount: tuples.length,
          durationMs: Date.now() - startTime,
          viaVortex: true,
        });
        return;
      }
      // Fall through to direct API on Vortex failure
      logAuthzEvent({
        type: "tuple_delete",
        tupleCount: tuples.length,
        error: `Vortex returned ${response.status}, falling back to direct API`,
        viaVortex: true,
      });
    } catch (error) {
      logAuthzEvent({
        type: "tuple_delete",
        tupleCount: tuples.length,
        error: `Vortex failed: ${error instanceof Error ? error.message : String(error)}, falling back to direct API`,
        viaVortex: true,
      });
    }
  }

  // Fallback: Direct Warden API
  if (!AUTHZ_API_URL) {
    logAuthzEvent({
      type: "tuple_skipped",
      tupleCount: tuples.length,
      error: "Neither Vortex nor Warden API configured",
    });
    return;
  }

  try {
    const response = await fetch(`${AUTHZ_API_URL}/tuples`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tuples }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    if (!response.ok) {
      throw new Error(`Warden delete failed: ${response.status}`);
    }

    logAuthzEvent({
      type: "tuple_delete",
      tupleCount: tuples.length,
      durationMs: Date.now() - startTime,
      viaVortex: false,
    });
  } catch (error) {
    logAuthzEvent({
      type: "tuple_delete",
      tupleCount: tuples.length,
      durationMs: Date.now() - startTime,
      error: error instanceof Error ? error.message : String(error),
      viaVortex: false,
    });
  }
}

interface PermissionCheck {
  userId: string;
  resourceType: string;
  resourceId: string;
  permission: string;
}

interface PermissionCheckResult {
  userId: string;
  resourceType: string;
  resourceId: string;
  permission: string;
  allowed: boolean;
}

/**
 * Batch check multiple permissions in a single API call.
 * Reduces N+1 queries when checking permissions on multiple resources.
 *
 * Uses two-layer caching:
 * 1. Request-scoped cache (passed as parameter) - avoids duplicate calls within same request
 * 2. TTL cache (module-level) - avoids duplicate calls across requests
 *
 * Checks cache first for each permission, then batches remaining checks.
 * Returns true (permissive) when authz is disabled.
 * Throws error (fail-closed) when PDP is unavailable.
 *
 * Reads AUTHZ_ENABLED and AUTHZ_API_URL from environment at runtime.
 */
export async function checkPermissionsBatch(
  checks: PermissionCheck[],
  requestCache?: Map<string, boolean>,
): Promise<PermissionCheckResult[]> {
  // Permissive when disabled
  if (AUTHZ_ENABLED !== "true" || !AUTHZ_API_URL) {
    return checks.map((check) => ({ ...check, allowed: true }));
  }

  // Import cache functions inline to avoid circular dependencies
  const { buildPermissionCacheKey, getCachedPermission, setCachedPermission } =
    await import("./cache");

  const results: PermissionCheckResult[] = [];
  const uncachedChecks: Array<{ index: number; check: PermissionCheck }> = [];

  // Check caches first
  for (let i = 0; i < checks.length; i++) {
    const check = checks[i];
    const cacheKey = buildPermissionCacheKey(
      check.userId,
      check.resourceType,
      check.resourceId,
      check.permission,
    );

    // Layer 1: Check request-scoped cache
    if (requestCache?.has(cacheKey)) {
      results[i] = { ...check, allowed: requestCache.get(cacheKey)! };
      continue;
    }

    // Layer 2: Check TTL cache
    const cachedResult = getCachedPermission(cacheKey);
    if (cachedResult !== null) {
      requestCache?.set(cacheKey, cachedResult);
      results[i] = { ...check, allowed: cachedResult };
      continue;
    }

    // Need to fetch from PDP
    uncachedChecks.push({ index: i, check });
  }

  // If all checks were cached, return early
  if (uncachedChecks.length === 0) {
    logAuthzEvent({
      type: "permission_check",
      durationMs: 0,
    });
    return results;
  }

  const startTime = Date.now();

  try {
    const batchResults = await circuitBreaker.execute(async () => {
      const response = await fetch(`${AUTHZ_API_URL}/check/batch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          checks: uncachedChecks.map(({ check }) => ({
            user: `user:${check.userId}`,
            relation: check.permission,
            object: `${check.resourceType}:${check.resourceId}`,
          })),
        }),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });

      if (!response.ok) {
        throw new Error(`AuthZ batch check failed: ${response.status}`);
      }

      const result = (await response.json()) as {
        results: Array<{ allowed: boolean }>;
      };
      return result.results;
    });

    // Process results and populate caches
    for (let i = 0; i < uncachedChecks.length; i++) {
      const { index, check } = uncachedChecks[i];
      const allowed = batchResults[i].allowed;
      const cacheKey = buildPermissionCacheKey(
        check.userId,
        check.resourceType,
        check.resourceId,
        check.permission,
      );

      // Store in both caches
      requestCache?.set(cacheKey, allowed);
      setCachedPermission(cacheKey, allowed);

      results[index] = { ...check, allowed };
    }

    logAuthzEvent({
      type: "permission_check",
      durationMs: Date.now() - startTime,
    });

    return results;
  } catch (error) {
    logAuthzEvent({
      type: "permission_check",
      durationMs: Date.now() - startTime,
      error: error instanceof Error ? error.message : String(error),
    });
    // Fail-closed: deny access when PDP is unavailable
    throw error;
  }
}

/**
 * Check if a user has permission on a resource.
 * Exported for graphile-export EXPORTABLE compatibility.
 *
 * Uses two-layer caching:
 * 1. Request-scoped cache (passed as parameter) - avoids duplicate calls within same request
 * 2. TTL cache (module-level) - avoids duplicate calls across requests
 *
 * Returns true if authorized, false otherwise.
 * Returns true (permissive) when authz is disabled.
 * Throws error (fail-closed) when PDP is unavailable.
 *
 * Reads AUTHZ_ENABLED and AUTHZ_API_URL from environment at runtime.
 */
export async function checkPermission(
  userId: string,
  resourceType: string,
  resourceId: string,
  permission: string,
  requestCache?: Map<string, boolean>,
): Promise<boolean> {
  // Permissive when disabled
  if (AUTHZ_ENABLED !== "true") return true;
  if (!AUTHZ_API_URL) return true;

  // Import cache functions inline to avoid circular dependencies
  const { buildPermissionCacheKey, getCachedPermission, setCachedPermission } =
    await import("./cache");

  const cacheKey = buildPermissionCacheKey(
    userId,
    resourceType,
    resourceId,
    permission,
  );

  // Layer 1: Check request-scoped cache first
  if (requestCache?.has(cacheKey)) {
    return requestCache.get(cacheKey)!;
  }

  // Layer 2: Check TTL cache
  const cachedResult = getCachedPermission(cacheKey);
  if (cachedResult !== null) {
    // Also populate request cache for subsequent checks
    requestCache?.set(cacheKey, cachedResult);
    return cachedResult;
  }

  const startTime = Date.now();

  try {
    const allowed = await circuitBreaker.execute(async () => {
      const response = await fetch(`${AUTHZ_API_URL}/check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: `user:${userId}`,
          relation: permission,
          object: `${resourceType}:${resourceId}`,
        }),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });

      if (!response.ok) {
        throw new Error(`AuthZ check failed: ${response.status}`);
      }

      const result = (await response.json()) as { allowed: boolean };
      return result.allowed;
    });

    // Store in both caches
    requestCache?.set(cacheKey, allowed);
    setCachedPermission(cacheKey, allowed);

    logAuthzEvent({
      type: "permission_check",
      userId,
      resourceType,
      resourceId,
      permission,
      allowed,
      durationMs: Date.now() - startTime,
    });

    return allowed;
  } catch (error) {
    logAuthzEvent({
      type: "permission_check",
      userId,
      resourceType,
      resourceId,
      permission,
      durationMs: Date.now() - startTime,
      error: error instanceof Error ? error.message : String(error),
    });
    // Fail-closed: deny access when PDP is unavailable
    throw error;
  }
}
