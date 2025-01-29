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
        const $downvoteId = fieldArgs.getRaw(["input", propName]);
        const $currentUser = context<GraphQLContext>().get("currentUser");
        const $db = context<GraphQLContext>().get("db");

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

            if (currentUser.id !== downvote.userId) {
              throw new Error("Insufficient permissions");
            }
          }
        );

        return plan();
      },
    [and, eq, dbSchema, context, sideEffect, propName]
  );

const DownvoteRBACPlugin = makeWrapPlansPlugin({
  Mutation: {
    updateDownvote: validatePermissions("rowId"),
    deleteDownvote: validatePermissions("rowId"),
  },
});

export default DownvoteRBACPlugin;
