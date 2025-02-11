import { and, eq } from "drizzle-orm";
import { EXPORTABLE } from "graphile-export/helpers";
import { context, sideEffect } from "postgraphile/grafast";
import { makeWrapPlansPlugin } from "postgraphile/utils";

import * as dbSchema from "lib/drizzle/schema";

import type { GraphQLContext } from "lib/graphql";
import type { ExecutableStep, FieldArgs } from "postgraphile/grafast";

const validatePermissions = (propName: string) =>
  EXPORTABLE(
    (and, eq, dbSchema, context, sideEffect, propName) =>
      // biome-ignore lint/suspicious/noExplicitAny: SmartFieldPlanResolver is not an exported type
      (plan: any, _: ExecutableStep, fieldArgs: FieldArgs) => {
        const $upvoteId = fieldArgs.getRaw(["input", propName]);
        const $currentUser = context<GraphQLContext>().get("currentUser");
        const $db = context<GraphQLContext>().get("db");

        sideEffect(
          [$upvoteId, $currentUser, $db],
          async ([upvoteId, currentUser, db]) => {
            if (!currentUser) {
              throw new Error("Unauthorized");
            }

            const { upvotes } = dbSchema;

            const [upvote] = await db
              .select()
              .from(upvotes)
              .where(eq(upvotes.id, upvoteId as string));

            // Only allow the user who upvoted to update or delete their own upvote
            if (currentUser.id !== upvote.userId) {
              throw new Error("Insufficient permissions");
            }
          }
        );

        return plan();
      },
    [and, eq, dbSchema, context, sideEffect, propName]
  );

/**
 * Plugin that handles API access for upvote table mutations.
 */
const UpvoteRBACPlugin = makeWrapPlansPlugin({
  Mutation: {
    updateUpvote: validatePermissions("rowId"),
    deleteUpvote: validatePermissions("rowId"),
  },
});

export default UpvoteRBACPlugin;
