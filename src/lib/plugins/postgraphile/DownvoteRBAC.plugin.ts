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
        const $downvoteId = fieldArgs.getRaw(["input", propName]);
        const $currentUser = context<GraphQLContext>().get("currentUser");
        const $db = context<GraphQLContext>().get("db");

        sideEffect(
          [$downvoteId, $currentUser, $db],
          async ([downvoteId, currentUser, db]) => {
            if (!currentUser) {
              throw new Error("Unauthorized");
            }

            if (scope !== "create") {
              const { downvotes } = dbSchema;

              const [downvote] = await db
                .select()
                .from(downvotes)
                .where(eq(downvotes.id, downvoteId as string));

              // Only allow the user who downvoted to update or delete their own downvote
              if (currentUser.id !== downvote.userId) {
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
 * Plugin that handles API access for downvote table mutations.
 */
const DownvoteRBACPlugin = makeWrapPlansPlugin({
  Mutation: {
    createDownvote: validatePermissions("downvote", "create"),
    updateDownvote: validatePermissions("rowId", "update"),
    deleteDownvote: validatePermissions("rowId", "delete"),
  },
});

export default DownvoteRBACPlugin;
