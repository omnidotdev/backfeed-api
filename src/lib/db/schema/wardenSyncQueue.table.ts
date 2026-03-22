/**
 * Warden sync queue table. Stores failed authz tuple writes/deletes
 * for retry with exponential backoff.
 */

import { index, integer, jsonb, pgTable, text } from "drizzle-orm/pg-core";
import { generateDefaultDate, generateDefaultId } from "lib/db/util";

import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

/**
 * Warden sync queue table. Queues failed authz tuple operations for retry.
 */
export const wardenSyncQueue = pgTable(
  "warden_sync_queue",
  {
    id: generateDefaultId(),
    /** "write" or "delete" */
    operation: text().notNull(),
    /** Serialized tuple payload */
    payload: jsonb().notNull(),
    /** Number of retry attempts so far */
    attempts: integer().notNull().default(0),
    /** Max retry attempts before marking dead */
    maxAttempts: integer("max_attempts").notNull().default(10),
    /** Last error message from a failed attempt */
    lastError: text("last_error"),
    /** When the next retry should be attempted */
    nextRetryAt: generateDefaultDate(),
    createdAt: generateDefaultDate(),
  },
  (table) => [index("warden_sync_queue_next_retry_idx").on(table.nextRetryAt)],
);

/**
 * Type helpers related to the warden sync queue table.
 */
export type InsertWardenSyncQueue = InferInsertModel<typeof wardenSyncQueue>;
export type SelectWardenSyncQueue = InferSelectModel<typeof wardenSyncQueue>;
