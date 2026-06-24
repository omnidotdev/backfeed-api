import { EXPORTABLE } from "graphile-export";
import { deleteStorageObjects } from "lib/media/cleanupAttachments";
import { context, sideEffect } from "postgraphile/grafast";
import { wrapPlans } from "postgraphile/utils";

import type { PlanWrapperFn } from "postgraphile/utils";

/**
 * Delete object-storage attachments orphaned by a deletion.
 *
 * Attachment bytes live in the bucket while only `attachment.storageKey`
 * references them, so a delete that removes the rows must also remove the
 * objects or they orphan. Two deletion paths reach those rows:
 * `deleteAttachment` (one row) and `deletePost` (cascade-deletes every
 * attachment of the post).
 *
 * Both follow the same two-phase shape. Side-effect steps run in creation
 * order, so the pre-mutation step gathers the storage keys (carried forward as
 * a step value, not a closure, so it stays exportable) while the rows are still
 * present, and the post-mutation step, gated on the mutation result, deletes
 * them only after the delete commits. An unauthorized or failed delete removes
 * nothing. Deletes are best-effort and never throw, so cleanup can't fail the
 * mutation.
 */
const cleanupOnAttachmentDelete = (): PlanWrapperFn =>
  EXPORTABLE(
    (context, sideEffect, deleteStorageObjects): PlanWrapperFn =>
      (plan, _, fieldArgs) => {
        const $rowId = fieldArgs.getRaw(["input", "rowId"]);
        const $db = context().get("db");

        const $keys = sideEffect([$rowId, $db], async ([rowId, db]) => {
          if (!rowId) return [] as string[];
          const row = await db.query.attachments.findFirst({
            // biome-ignore lint/suspicious/noExplicitAny: drizzle where callback
            where: (fields: any, operators: any) =>
              operators.eq(fields.id, rowId as string),
            columns: { storageKey: true },
          });
          return row?.storageKey ? [row.storageKey] : [];
        });

        const $result = plan();

        sideEffect([$result, $keys], async ([result, keys]) => {
          if (!result) return;
          await deleteStorageObjects(keys as string[]);
        });

        return $result;
      },
    [context, sideEffect, deleteStorageObjects],
  );

const cleanupOnPostDelete = (): PlanWrapperFn =>
  EXPORTABLE(
    (context, sideEffect, deleteStorageObjects): PlanWrapperFn =>
      (plan, _, fieldArgs) => {
        const $rowId = fieldArgs.getRaw(["input", "rowId"]);
        const $db = context().get("db");

        const $keys = sideEffect([$rowId, $db], async ([postId, db]) => {
          if (!postId) return [] as string[];
          const rows = await db.query.attachments.findMany({
            // biome-ignore lint/suspicious/noExplicitAny: drizzle where callback
            where: (fields: any, operators: any) =>
              operators.eq(fields.postId, postId as string),
            columns: { storageKey: true },
          });
          // biome-ignore lint/suspicious/noExplicitAny: drizzle row shape
          return rows.map((row: any) => row.storageKey).filter(Boolean);
        });

        const $result = plan();

        sideEffect([$result, $keys], async ([result, keys]) => {
          if (!result) return;
          await deleteStorageObjects(keys as string[]);
        });

        return $result;
      },
    [context, sideEffect, deleteStorageObjects],
  );

/**
 * Media cleanup plugin: removes orphaned attachment objects when an attachment
 * is deleted directly or its post (and thus its attachments) is deleted.
 */
const AttachmentCleanupPlugin = wrapPlans({
  Mutation: {
    deleteAttachment: cleanupOnAttachmentDelete(),
    deletePost: cleanupOnPostDelete(),
  },
});

export default AttachmentCleanupPlugin;
