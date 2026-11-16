import { EXPORTABLE } from "graphile-export/helpers";
import { context, sideEffect } from "postgraphile/grafast";
import { wrapPlans } from "postgraphile/utils";

import type { PlanWrapperFn } from "postgraphile/utils";

/**
 * Validate vote permissions.
 *
 * Votes are user-owned: only the author can update/delete their own vote.
 */
const validatePermissions = (propName: string) =>
  EXPORTABLE(
    (context, sideEffect, propName): PlanWrapperFn =>
      (plan, _, fieldArgs) => {
        const $input = fieldArgs.getRaw(["input", propName]);
        const $observer = context().get("observer");
        const $db = context().get("db");

        sideEffect([$input, $observer, $db], async ([input, observer, db]) => {
          if (!observer) throw new Error("Unauthorized");

          const vote = await db.query.votes.findFirst({
            where: (table, { eq }) => eq(table.id, input),
          });

          // Only allow the user who voted to update or delete their own vote
          if (observer.id !== vote?.userId) {
            throw new Error("Unauthorized");
          }
        });

        return plan();
      },
    [context, sideEffect, propName],
  );

/**
 * Validate a vote's author on create. The generated createVote took `userId`
 * from the input with no check, so any caller could cast votes as any user
 * (an update cannot change `userId`; see SmartTag.plugin)
 */
const validateAuthor = (propName: "vote") =>
  EXPORTABLE(
    (context, sideEffect, propName): PlanWrapperFn =>
      (plan, _, fieldArgs) => {
        const $input = fieldArgs.getRaw(["input", propName]);
        const $observer = context().get("observer");

        sideEffect([$input, $observer], async ([input, observer]) => {
          if (!observer) throw new Error("Unauthorized");

          const userId = (input as { userId?: string } | null)?.userId;
          if (userId !== observer.id) {
            throw new Error("Unauthorized");
          }
        });

        return plan();
      },
    [context, sideEffect, propName],
  );

/**
 * Authorization plugin for votes.
 *
 * - Create: the caller, voting as themselves
 * - Update: Author only
 * - Delete: Author only
 */
const VotePlugin = wrapPlans({
  Mutation: {
    createVote: validateAuthor("vote"),
    updateVote: validatePermissions("rowId"),
    deleteVote: validatePermissions("rowId"),
  },
});

export default VotePlugin;
