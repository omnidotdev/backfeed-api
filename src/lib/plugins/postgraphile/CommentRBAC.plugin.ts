import { and, eq } from "drizzle-orm";
import { EXPORTABLE } from "graphile-export/helpers";
import { context, sideEffect } from "postgraphile/grafast";
import { makeWrapPlansPlugin } from "postgraphile/utils";

import * as dbSchema from "lib/drizzle/schema";

import type { GraphQLContext } from "lib/graphql";
import type { ExecutableStep, FieldArgs } from "postgraphile/grafast";

type MutationScope = "create" | "update" | "delete";

const validatePermissions = (propName: string, scope: MutationScope) =>
  EXPORTABLE(
    (and, eq, dbSchema, context, sideEffect, propName, scope) =>
      // biome-ignore lint/suspicious/noExplicitAny: SmartFieldPlanResolver is not an exported type
      (plan: any, _: ExecutableStep, fieldArgs: FieldArgs) => {
        const $commentId = fieldArgs.getRaw(["input", propName]);
        const $currentUser = context<GraphQLContext>().get("currentUser");
        const $db = context<GraphQLContext>().get("db");

        sideEffect(
          [$commentId, $currentUser, $db],
          async ([commentId, currentUser, db]) => {
            if (!currentUser) {
              throw new Error("Unauthorized");
            }

            if (scope !== "create") {
              const { members, projects, posts, comments } = dbSchema;

              const [comment] = await db
                .select({
                  organizationId: projects.organizationId,
                  userId: posts.userId,
                })
                .from(comments)
                .innerJoin(posts, eq(comments.postId, posts.id))
                .innerJoin(projects, eq(posts.projectId, projects.id))
                .where(eq(comments.id, commentId));

              if (currentUser.id !== comment.userId) {
                const [userRole] = await db
                  .select({ role: members.role })
                  .from(members)
                  .where(
                    and(
                      eq(members.userId, currentUser.id),
                      eq(members.organizationId, comment.organizationId),
                    ),
                  );

                // Allow admins and owners to edit and delete comments
                if (!userRole || userRole.role === "member") {
                  throw new Error("Insufficient permissions");
                }
              }
            }
          },
        );

        return plan();
      },
    [and, eq, dbSchema, context, sideEffect, propName, scope],
  );

/**
 * Plugin that handles API access for comment table mutations.
 */
const CommentRBACPlugin = makeWrapPlansPlugin({
  Mutation: {
    createComment: validatePermissions("comment", "create"),
    updateComment: validatePermissions("rowId", "update"),
    deleteComment: validatePermissions("rowId", "delete"),
  },
});

export default CommentRBACPlugin;
