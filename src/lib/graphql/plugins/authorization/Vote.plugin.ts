import { EXPORTABLE } from "graphile-export/helpers";
import { context, sideEffect } from "postgraphile/grafast";
import { wrapPlans } from "postgraphile/utils";

import type { PlanWrapperFn } from "postgraphile/utils";

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

          // only allow the user who voted to update or delete their own vote
          if (observer.id !== vote?.userId) {
            throw new Error("Unauthorized");
          }
        });

        return plan();
      },
    [context, sideEffect, propName],
  );

/**
 * Authorization plugin for votes.
 */
const VotePlugin = wrapPlans({
  Mutation: {
    updateVote: validatePermissions("rowId"),
    deleteVote: validatePermissions("rowId"),
  },
});

export default VotePlugin;
