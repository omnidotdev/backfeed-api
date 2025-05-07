import { eq } from "drizzle-orm";
import { EXPORTABLE } from "graphile-export/helpers";
import { context, sideEffect } from "postgraphile/grafast";
import { makeWrapPlansPlugin } from "postgraphile/utils";

import * as dbSchema from "lib/drizzle/schema";

import type { GraphQLContext } from "lib/graphql";
import type { ExecutableStep, FieldArgs } from "postgraphile/grafast";

type MutationScope = "create" | "update" | "delete";

const validatePermissions = (propName: string, scope: MutationScope) =>
  EXPORTABLE(
    (eq, dbSchema, context, sideEffect, propName, scope) =>
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

            if (scope !== "create") {
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
          },
        );

        return plan();
      },
    [eq, dbSchema, context, sideEffect, propName, scope],
  );

/**
 * Plugin that handles API access for upvote table mutations.
 */
const UpvoteRBACPlugin = makeWrapPlansPlugin({
  Mutation: {
    createUpvote: validatePermissions("upvote", "create"),
    updateUpvote: validatePermissions("rowId", "update"),
    deleteUpvote: validatePermissions("rowId", "delete"),
  },
});

export default UpvoteRBACPlugin;
