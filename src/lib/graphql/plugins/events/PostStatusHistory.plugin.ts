/**
 * Post Status History Plugin
 *
 * Records a post's status transitions into `post_status_change`, forming a
 * GitHub-issue-style timeline. On `updatePost`, when the mutation carries a
 * status change, it appends a row with the new status + the acting user
 * (deduped against the latest entry by `recordPostStatusChange`). The previous
 * row's status is the implicit "from".
 *
 * Errors are logged but never fail the mutation (the timeline is best-effort).
 */

import { EXPORTABLE } from "graphile-export";
import { recordPostStatusChange } from "lib/feedback/statusHistory";
import { notifyStatusChange } from "lib/notifications/notify";
import { notifications } from "lib/providers";
import { context, sideEffect } from "postgraphile/grafast";
import { wrapPlans } from "postgraphile/utils";

import type { PlanWrapperFn } from "postgraphile/utils";

const recordStatusChange = (): PlanWrapperFn =>
  EXPORTABLE(
    (
      context,
      notifications,
      notifyStatusChange,
      recordPostStatusChange,
      sideEffect,
    ): PlanWrapperFn =>
      (plan, _, fieldArgs) => {
        const $result = plan();
        const $postId = fieldArgs.getRaw(["input", "rowId"]);
        const $patch = fieldArgs.getRaw(["input", "patch"]);
        const $observer = context().get("observer");
        const $db = context().get("db");

        sideEffect(
          [$result, $postId, $patch, $observer, $db],
          async ([result, postId, patch, observer, db]) => {
            if (!result) return;

            // only record when this mutation actually set the status
            const statusInPatch =
              patch != null &&
              "statusTemplateId" in (patch as Record<string, unknown>);
            if (!statusInPatch) return;

            try {
              const recorded = await recordPostStatusChange(
                db,
                postId as string,
                observer?.id ?? null,
              );

              // notify stakeholders only when the status actually changed,
              // detached so a slow send never blocks the mutation (best-effort)
              if (recorded) {
                void notifyStatusChange(
                  db,
                  notifications,
                  postId as string,
                  observer?.id ?? null,
                ).catch((error) =>
                  console.error(
                    "[StatusHistory] Failed to send notifications:",
                    error,
                  ),
                );
              }
            } catch (error) {
              console.error(
                "[StatusHistory] Failed to record status change:",
                error,
              );
            }
          },
        );

        return $result;
      },
    [
      context,
      notifications,
      notifyStatusChange,
      recordPostStatusChange,
      sideEffect,
    ],
  );

/**
 * Records post status transitions on `updatePost` into the status timeline.
 */
const PostStatusHistoryPlugin = wrapPlans({
  Mutation: {
    updatePost: recordStatusChange(),
  },
});

export default PostStatusHistoryPlugin;
