/**
 * Project reconciler - self-healing safety net for authz drift.
 *
 * Backfeed's `project` table is the source of truth for the org->project
 * tuples in Warden (the PDP). Every project change syncs a tuple to Warden,
 * but a sync can be missed (transient failure, a code path that skips the
 * hook, a row created before sync existed). Because product APIs rely
 * entirely on Warden tuples for access decisions, a missed tuple silently
 * locks a project out with no error anywhere.
 *
 * This reconciler periodically diffs the `project` table against the
 * org->project tuples in Warden and writes any that are missing. It is
 * add-only: it never deletes tuples (live delete paths own removals), so it
 * can only ever restore access, never revoke it. That makes it safe to run
 * unattended.
 */

import {
  AUTHZ_API_URL,
  AUTHZ_SERVICE_KEY,
  DATABASE_URL,
} from "lib/config/env.config";
import { dbPool } from "lib/db/db";
import { projects } from "lib/db/schema";

import { isAuthzEnabled, writeTuples } from ".";

/** How often to reconcile project tuples */
const RECONCILE_INTERVAL_MS = 15 * 60 * 1000;

/** Delay before the first reconcile so it does not race boot/migrations */
const INITIAL_DELAY_MS = 60_000;

/** Request timeout for PDP reads */
const REQUEST_TIMEOUT_MS = 10_000;

/** Max tuples per page when reading from the PDP (OpenFGA caps this at 100) */
const PDP_PAGE_SIZE = 100;

/** Max tuples per write transaction (OpenFGA caps this at 100) */
const BATCH_SIZE = 100;

interface Tuple {
  user: string;
  relation: string;
  object: string;
}

let reconcileTimer: ReturnType<typeof setInterval> | null = null;
/** Guard against overlapping runs if one reconcile outlasts the interval */
let running = false;

const tupleKey = (t: Tuple) => `${t.user}|${t.relation}|${t.object}`;

/**
 * Build the org->project tuples a set of projects expects, one tuple per
 * project. Pure and testable.
 */
export function expectedTuplesFromProjects(
  projectRows: { id: string; organizationId: string }[],
): Tuple[] {
  return projectRows.map((project) => ({
    user: `organization:${project.organizationId}`,
    relation: "organization",
    object: `project:${project.id}`,
  }));
}

/**
 * Return the expected tuples that are absent from the actual set. Pure and
 * testable.
 */
export function missingTuples(expected: Tuple[], actual: Tuple[]): Tuple[] {
  const actualKeys = new Set(actual.map(tupleKey));
  return expected.filter((t) => !actualKeys.has(tupleKey(t)));
}

/**
 * Build the set of org->project tuples the project table expects.
 */
async function buildExpectedTuples(): Promise<Tuple[]> {
  const rows = await dbPool
    .select({
      id: projects.id,
      organizationId: projects.organizationId,
    })
    .from(projects);

  return expectedTuplesFromProjects(rows);
}

/**
 * Fetch all Backfeed-managed org->project tuples currently in the PDP.
 */
async function fetchActualTuples(): Promise<Tuple[]> {
  const tuples: Tuple[] = [];
  let continuationToken: string | undefined;

  do {
    const params = new URLSearchParams({ pageSize: String(PDP_PAGE_SIZE) });
    if (continuationToken) params.set("continuationToken", continuationToken);

    const response = await fetch(
      `${AUTHZ_API_URL}/tuples?${params.toString()}`,
      {
        headers: {
          ...(AUTHZ_SERVICE_KEY && { "X-Service-Key": AUTHZ_SERVICE_KEY }),
        },
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch tuples: ${response.status}`);
    }

    const data = (await response.json()) as {
      tuples: Tuple[];
      continuationToken?: string;
    };

    // Keep only Backfeed-managed tuples: org->project
    for (const tuple of data.tuples) {
      if (
        tuple.object.startsWith("project:") &&
        tuple.relation === "organization"
      ) {
        tuples.push(tuple);
      }
    }

    continuationToken = data.continuationToken;
  } while (continuationToken);

  return tuples;
}

/**
 * Run a single reconcile pass: write any expected project tuples missing from
 * the PDP. Returns a summary for observability.
 * @knipignore Exported for testability and manual-reconcile parity
 */
export async function reconcileProjectTuples(): Promise<{
  expected: number;
  actual: number;
  repaired: number;
}> {
  const expected = await buildExpectedTuples();
  const actual = await fetchActualTuples();

  const missing = missingTuples(expected, actual);

  if (missing.length > 0) {
    // Chunk writes: OpenFGA caps a write transaction at 100 tuples and the
    // provider POSTs a batch as one request, so a large drift event would be
    // rejected wholesale. writeTuples is void and self-enqueues on failure, so
    // a failed batch is durably retried by the sync-queue poller
    for (let i = 0; i < missing.length; i += BATCH_SIZE) {
      const batch = missing.slice(i, i + BATCH_SIZE);
      await writeTuples(batch);
    }

    console.warn(
      JSON.stringify({
        type: "warden_backfeed_reconcile",
        expected: expected.length,
        actual: actual.length,
        repaired: missing.length,
        repairedTuples: missing.map(
          (t) => `${t.user}#${t.relation}@${t.object}`,
        ),
        timestamp: new Date().toISOString(),
      }),
    );
  } else {
    // Heartbeat: always log a clean pass so "ran, 0 drift" is observable and
    // never confused with "never ran" (silent success hid the original bug)
    console.info(
      JSON.stringify({
        type: "warden_backfeed_reconcile",
        expected: expected.length,
        actual: actual.length,
        repaired: 0,
        timestamp: new Date().toISOString(),
      }),
    );
  }

  return {
    expected: expected.length,
    actual: actual.length,
    repaired: missing.length,
  };
}

async function reconcile(): Promise<void> {
  if (!AUTHZ_API_URL || !DATABASE_URL) return;
  if (!isAuthzEnabled()) return;
  if (running) return;

  running = true;
  try {
    await reconcileProjectTuples();
  } catch (error) {
    console.error(
      "[warden-reconcile] Reconcile error:",
      error instanceof Error ? error.message : String(error),
    );
  } finally {
    running = false;
  }
}

/**
 * Start the background project reconciler.
 * Safe to call multiple times; only one reconciler runs at a time.
 */
export function startWardenReconciler(): void {
  if (reconcileTimer) return;
  if (!isAuthzEnabled()) return;

  // .unref() so the interval does not keep the process alive during shutdown
  reconcileTimer = setInterval(reconcile, RECONCILE_INTERVAL_MS).unref();

  // Delay the first pass so it does not race boot/migrations
  setTimeout(reconcile, INITIAL_DELAY_MS).unref();

  console.info(
    `[warden-reconcile] Reconciler started (interval: ${RECONCILE_INTERVAL_MS}ms)`,
  );
}

/**
 * Stop the background project reconciler.
 */
export function stopWardenReconciler(): void {
  if (!reconcileTimer) return;

  clearInterval(reconcileTimer);
  reconcileTimer = null;

  console.info("[warden-reconcile] Reconciler stopped");
}
