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
        const $downvoteId = fieldArgs.getRaw(["input", propName]);
        const $currentUser = context().get("observer");
        const $db = context().get("db");

        sideEffect(
          [$downvoteId, $currentUser, $db],
          async ([downvoteId, currentUser, db]) => {
            if (!currentUser) {
              throw new Error("Unauthorized");
            }

            const { downvotes } = dbSchema;

            const [downvote] = await db
              .select()
              .from(downvotes)
              .where(eq(downvotes.id, downvoteId as string));

            // Only allow the user who downvoted to update or delete their own downvote
            if (currentUser.id !== downvote.userId) {
              throw new Error("Insufficient permissions");
            }
          },
        );

        return plan();
      },
    [eq, dbSchema, context, sideEffect, propName],
  );

/**
 * Plugin that handles API access for downvote table mutations.
 */
const DownvoteRBACPlugin = wrapPlans({
  Mutation: {
    updateDownvote: validatePermissions("rowId"),
    deleteDownvote: validatePermissions("rowId"),
  },
});

export default DownvoteRBACPlugin;
