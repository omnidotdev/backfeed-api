import { EXPORTABLE } from "graphile-export";
import { events } from "lib/providers";
import { context, sideEffect } from "postgraphile/grafast";
import { wrapPlans } from "postgraphile/utils";

import type { PlanWrapperFn } from "postgraphile/utils";

/**
 * Emit a domain event after a mutation succeeds.
 * Uses the $record (mutation return value) to extract entity data.
 */
const emitOnMutate = (
  entity: string,
  action: "created" | "updated" | "deleted",
): PlanWrapperFn =>
  EXPORTABLE(
    (context, sideEffect, events, entity, action): PlanWrapperFn =>
      (plan, $record) => {
        const $observer = context().get("observer");

        sideEffect([$record, $observer], ([record, observer]) => {
          if (!record?.id) return;

          void events.emit({
            type: `backfeed.${entity}.${action}`,
            data: { id: record.id, actorId: observer?.id },
            subject: record.id,
          });
        });

        return plan();
      },
    [context, sideEffect, events, entity, action],
  );

/**
 * Event emission plugin for Backfeed mutations.
 *
 * Emits CloudEvents to Vortex for post, project, comment, and vote lifecycle.
 */
const EventEmissionPlugin = wrapPlans({
  Mutation: {
    createPost: emitOnMutate("post", "created"),
    updatePost: emitOnMutate("post", "updated"),
    deletePost: emitOnMutate("post", "deleted"),
    createProject: emitOnMutate("project", "created"),
    updateProject: emitOnMutate("project", "updated"),
    deleteProject: emitOnMutate("project", "deleted"),
    createComment: emitOnMutate("comment", "created"),
    updateComment: emitOnMutate("comment", "updated"),
    deleteComment: emitOnMutate("comment", "deleted"),
    createVote: emitOnMutate("vote", "created"),
    deleteVote: emitOnMutate("vote", "deleted"),
  },
});

export default EventEmissionPlugin;
