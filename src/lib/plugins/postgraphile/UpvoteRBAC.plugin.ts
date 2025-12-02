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

          const upvote = await db.query.upvotes.findFirst({
            where: (table, { eq }) => eq(table.id, input),
          });

          // Only allow the user who upvoted to update or delete their own downvote
          if (observer.id !== upvote?.userId) {
            throw new Error("Unauthorized");
          }
        });

        return plan();
      },
    [context, sideEffect, propName],
  );

/**
 * Plugin that handles API access for upvote table mutations.
 */
const UpvoteRBACPlugin = wrapPlans({
  Mutation: {
    updateUpvote: validatePermissions("rowId"),
    deleteUpvote: validatePermissions("rowId"),
  },
});

export default UpvoteRBACPlugin;
