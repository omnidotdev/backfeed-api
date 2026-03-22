/**
 * Warden sync queue.
 *
 * Enqueues failed authz tuple writes/deletes for durable retry
 * with exponential backoff. Prevents silent loss of ownership tuples.
 */

import { and, lte, sql } from "drizzle-orm";
import { dbPool } from "lib/db/db";
import { wardenSyncQueue } from "lib/db/schema";
import { authz } from "lib/providers";

import { isAuthzEnabled } from ".";

import type { TupleKey } from "./types";

/** Base delay between retries in milliseconds */
const BASE_RETRY_DELAY_MS = 5_000;

/** Maximum retry attempts before a record is considered dead */
const MAX_ATTEMPTS = 10;

/** How often the poller checks for pending retries */
const POLL_INTERVAL_MS = 30_000;

/** Batch size per poll cycle */
const POLL_BATCH_SIZE = 50;

let pollTimer: ReturnType<typeof setInterval> | null = null;

/**
 * Calculate next retry timestamp using exponential backoff.
 * delay = BASE_RETRY_DELAY_MS * 2^attempts (capped at ~25 minutes)
 */
function nextRetryTimestamp(attempts: number): Date {
  const delay = Math.min(BASE_RETRY_DELAY_MS * 2 ** attempts, 25 * 60 * 1_000);

  return new Date(Date.now() + delay);
}

/**
 * Enqueue a failed tuple operation for retry.
 * @param operation - "write" or "delete"
 * @param tuples - Tuple payload that failed
 * @param error - Error from the failed attempt
 */
export async function enqueueWardenSync(
  operation: "write" | "delete",
  tuples: TupleKey[],
  error: unknown,
): Promise<void> {
  const errorMessage = error instanceof Error ? error.message : "Unknown error";

  try {
    await dbPool.insert(wardenSyncQueue).values({
      operation,
      payload: tuples,
      attempts: 1,
      maxAttempts: MAX_ATTEMPTS,
      lastError: errorMessage,
      nextRetryAt: nextRetryTimestamp(1).toISOString(),
    });
  } catch (insertError) {
    // Last resort: log if even the queue insert fails
    console.error("[Warden Sync Queue] Failed to enqueue:", insertError);
  }
}

/**
 * Process a single queued record by retrying the tuple operation.
 */
async function processQueueRecord(
  record: typeof wardenSyncQueue.$inferSelect,
): Promise<void> {
  const tuples = record.payload as TupleKey[];

  try {
    if (record.operation === "write") {
      await authz.writeTuples?.(tuples);
    } else {
      await authz.deleteTuples?.(tuples);
    }

    // Success: remove from queue
    await dbPool
      .delete(wardenSyncQueue)
      .where(sql`${wardenSyncQueue.id} = ${record.id}`);
  } catch (error) {
    const nextAttempts = record.attempts + 1;
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    if (nextAttempts >= record.maxAttempts) {
      console.error(
        `[Warden Sync Queue] Record ${record.id} exhausted ${record.maxAttempts} attempts, marking dead:`,
        errorMessage,
      );

      // Mark dead by setting nextRetryAt far in the future
      await dbPool
        .update(wardenSyncQueue)
        .set({
          attempts: nextAttempts,
          lastError: errorMessage,
          nextRetryAt: new Date(
            Date.now() + 365 * 24 * 60 * 60 * 1_000,
          ).toISOString(),
        })
        .where(sql`${wardenSyncQueue.id} = ${record.id}`);

      return;
    }

    await dbPool
      .update(wardenSyncQueue)
      .set({
        attempts: nextAttempts,
        lastError: errorMessage,
        nextRetryAt: nextRetryTimestamp(nextAttempts).toISOString(),
      })
      .where(sql`${wardenSyncQueue.id} = ${record.id}`);
  }
}

/**
 * Poll the queue for records ready to retry.
 */
async function pollQueue(): Promise<void> {
  if (!isAuthzEnabled()) return;

  try {
    const now = new Date().toISOString();

    const pending = await dbPool
      .select()
      .from(wardenSyncQueue)
      .where(
        and(
          lte(wardenSyncQueue.nextRetryAt, now),
          lte(wardenSyncQueue.attempts, wardenSyncQueue.maxAttempts),
        ),
      )
      .limit(POLL_BATCH_SIZE);

    for (const record of pending) {
      await processQueueRecord(record);
    }

    if (pending.length > 0) {
      console.log(
        `[Warden Sync Queue] Processed ${pending.length} pending record(s)`,
      );
    }
  } catch (error) {
    console.error("[Warden Sync Queue] Poll error:", error);
  }
}

/**
 * Start the sync queue poller.
 * Safe to call multiple times; only one poller runs at a time.
 */
export function startWardenSyncPoller(): void {
  if (pollTimer) return;

  pollTimer = setInterval(pollQueue, POLL_INTERVAL_MS);

  // Run an initial poll immediately
  pollQueue();

  console.log(
    `[Warden Sync Queue] Poller started (interval: ${POLL_INTERVAL_MS}ms)`,
  );
}

/**
 * Stop the sync queue poller.
 */
export function stopWardenSyncPoller(): void {
  if (!pollTimer) return;

  clearInterval(pollTimer);
  pollTimer = null;

  console.log("[Warden Sync Queue] Poller stopped");
}
