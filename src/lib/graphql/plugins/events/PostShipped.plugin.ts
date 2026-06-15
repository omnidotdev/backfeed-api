/**
 * Post Shipped Plugin
 *
 * Closes the feedback loop: when a post first reaches a shipped status, emit a
 * `backfeed.post.shipped` event carrying the reporters behind the post's signals
 * so a downstream consumer (Runa / notifications) can tell them "you asked, we
 * shipped it". `markPostShipped` stamps the post so this fires exactly once.
 *
 * Errors are logged but never fail mutations (eventual consistency).
 */

import { EXPORTABLE } from "graphile-export";
import { markPostShipped } from "lib/feedback/shipped";
import { events } from "lib/providers";
import { context, sideEffect } from "postgraphile/grafast";
import { wrapPlans } from "postgraphile/utils";

import type { PlanWrapperFn } from "postgraphile/utils";

const emitShippedOnUpdate = (): PlanWrapperFn =>
  EXPORTABLE(
    (context, sideEffect, events, markPostShipped): PlanWrapperFn =>
      (plan, _, fieldArgs) => {
        const $result = plan();
        const $postId = fieldArgs.getRaw(["input", "rowId"]);
        const $db = context().get("db");

        sideEffect([$result, $postId, $db], async ([result, postId, db]) => {
          if (!result) return;

          try {
            const shipped = await markPostShipped(db, postId as string);
            if (!shipped) return;

            await events.emit({
              type: "backfeed.post.shipped",
              data: {
                postId: shipped.postId,
                projectId: shipped.projectId,
                organizationId: shipped.organizationId,
                title: shipped.title,
                reporterUserIds: shipped.reporterUserIds,
              },
              organizationId: shipped.organizationId,
              subject: shipped.postId,
            });
          } catch (error) {
            console.error("[Events] Failed to emit post.shipped:", error);
          }
        });

        return $result;
      },
    [context, sideEffect, events, markPostShipped],
  );

/**
 * Close-the-loop plugin: emits `backfeed.post.shipped` the first time a post
 * reaches a shipped status (via `updatePost`).
 */
const PostShippedPlugin = wrapPlans({
  Mutation: {
    updatePost: emitShippedOnUpdate(),
  },
});

export default PostShippedPlugin;
