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
        const $commentId = fieldArgs.getRaw(["input", propName]);
        const $observer = context<GraphQLContext>().get("observer");
        const $db = context<GraphQLContext>().get("db");

        sideEffect(
          [$commentId, $observer, $db],
          async ([commentId, observer, db]) => {
            if (!observer) {
              throw new Error("Unauthorized");
            }

            const { usersToOrganizations, projects, posts, comments } =
              dbSchema;

            const [comment] = await db
              .select({
                organizationId: projects.organizationId,
                userId: posts.userId,
              })
              .from(comments)
              .innerJoin(posts, eq(comments.postId, posts.id))
              .innerJoin(projects, eq(posts.projectId, projects.id))
              .where(eq(comments.id, commentId));

            if (observer.id !== comment.userId) {
              const [userRole] = await db
                .select({ role: usersToOrganizations.role })
                .from(usersToOrganizations)
                .where(
                  and(
                    eq(usersToOrganizations.userId, observer.id),
                    eq(
                      usersToOrganizations.organizationId,
                      comment.organizationId
                    )
                  )
                );

              // Allow admins and owners to edit and delete comments
              if (!userRole || userRole.role === "member") {
                throw new Error("Insufficient permissions");
              }
            }
          }
        );

        return plan();
      },
    [and, eq, dbSchema, context, sideEffect, propName]
  );

/**
 * Plugin that handles API access for comment table mutations.
 */
const CommentRBACPlugin = makeWrapPlansPlugin({
  Mutation: {
    updateComment: validatePermissions("rowId"),
    deleteComment: validatePermissions("rowId"),
  },
});

export default CommentRBACPlugin;
