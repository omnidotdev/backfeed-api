/**
 * Tuple sync helpers for Backfeed.
 *
 * These functions sync Backfeed's domain events to the authorization store.
 * Called from PostGraphile plugins after successful mutations.
 *
 * All sync functions accept config values as parameters and inline all logic
 * to support graphile-export's EXPORTABLE pattern (no external variable references).
 *
 * TODO: Replace direct HTTP calls with Vortex events for durability.
 */

// Re-export for EXPORTABLE compatibility in plugins
export { AUTHZ_ENABLED, AUTHZ_PROVIDER_URL } from "lib/config/env.config";

// Re-export cache functions for use in plugins
export {
  buildPermissionCacheKey,
  getCachedPermission,
  invalidatePermissionCache,
  setCachedPermission,
} from "./cache";

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
 * Circuit breaker for Warden calls.
 * Fails closed (denies access) when circuit is open to prevent security bypass.
 *
 * States:
 * - closed: Normal operation, requests go through
 * - open: Too many failures, requests are blocked (fail-closed)
 * - half-open: Testing recovery after cooldown, one request allowed through
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
        throw new Error("Warden unavailable - circuit open (fail-closed)");
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

// Singleton circuit breaker instance for all authz calls
const circuitBreaker = new CircuitBreaker();

/**
 * Write tuples to the authorization store.
 * Exported for graphile-export EXPORTABLE compatibility.
 */
export async function writeTuples(
  providerUrl: string,
  tuples: Array<{ user: string; relation: string; object: string }>,
): Promise<void> {
  const startTime = Date.now();

  try {
    await circuitBreaker.execute(async () => {
      const response = await fetch(`${providerUrl}/tuples`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tuples }),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
      if (!response.ok) {
        throw new Error(`AuthZ write tuples failed: ${response.status}`);
      }
    });

    logAuthzEvent({
      type: "tuple_write",
      tupleCount: tuples.length,
      durationMs: Date.now() - startTime,
    });
  } catch (error) {
    logAuthzEvent({
      type: "tuple_write",
      tupleCount: tuples.length,
      durationMs: Date.now() - startTime,
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
}

/**
 * Delete tuples from the authorization store.
 * Exported for graphile-export EXPORTABLE compatibility.
 */
export async function deleteTuples(
  providerUrl: string,
  tuples: Array<{ user: string; relation: string; object: string }>,
): Promise<void> {
  const startTime = Date.now();

  try {
    await circuitBreaker.execute(async () => {
      const response = await fetch(`${providerUrl}/tuples`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tuples }),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
      if (!response.ok) {
        throw new Error(`AuthZ delete tuples failed: ${response.status}`);
      }
    });

    logAuthzEvent({
      type: "tuple_delete",
      tupleCount: tuples.length,
      durationMs: Date.now() - startTime,
    });
  } catch (error) {
    logAuthzEvent({
      type: "tuple_delete",
      tupleCount: tuples.length,
      durationMs: Date.now() - startTime,
      error: error instanceof Error ? error.message : String(error),
    });
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
 * Throws error (fail-closed) when Warden is unavailable.
 */
export async function checkPermission(
  authzEnabled: string | undefined,
  authzProviderUrl: string | undefined,
  userId: string,
  resourceType: string,
  resourceId: string,
  permission: string,
  requestCache?: Map<string, boolean>,
): Promise<boolean> {
  // Permissive when disabled
  if (authzEnabled !== "true") return true;
  if (!authzProviderUrl) return true;

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
      const response = await fetch(`${authzProviderUrl}/check`, {
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
    // Fail-closed: deny access when Warden is unavailable
    throw error;
  }
}
