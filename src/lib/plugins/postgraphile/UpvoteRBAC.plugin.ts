import { eq } from "drizzle-orm";
import { EXPORTABLE } from "graphile-export/helpers";
import * as dbSchema from "lib/drizzle/schema";
import { context, sideEffect } from "postgraphile/grafast";
import { wrapPlans } from "postgraphile/utils";

import type { PlanWrapperFn } from "postgraphile/utils";

const validatePermissions = (propName: string) =>
  EXPORTABLE(
    (eq, dbSchema, context, sideEffect, propName): PlanWrapperFn =>
      (plan, _, fieldArgs) => {
        const $upvoteId = fieldArgs.getRaw(["input", propName]);
        const $observer = context().get("observer");
        const $db = context().get("db");

        sideEffect(
          [$upvoteId, $observer, $db],
          async ([upvoteId, observer, db]) => {
            if (!observer) {
              throw new Error("Unauthorized");
            }

            const { upvotes } = dbSchema;

            const [upvote] = await db
              .select()
              .from(upvotes)
              .where(eq(upvotes.id, upvoteId as string));

            // Only allow the user who upvoted to update or delete their own upvote
            if (observer.id !== upvote.userId) {
              throw new Error("Insufficient permissions");
            }
          },
        );

        return plan();
      },
    [eq, dbSchema, context, sideEffect, propName],
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
