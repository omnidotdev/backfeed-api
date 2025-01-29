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
        const $postId = fieldArgs.getRaw(["input", propName]);
        const $currentUser = context<GraphQLContext>().get("currentUser");
        const $db = context<GraphQLContext>().get("db");

        sideEffect(
          [$postId, $currentUser, $db],
          async ([postId, currentUser, db]) => {
            if (!currentUser) {
              throw new Error("Unauthorized");
            }

            const { usersToOrganizations, projects, posts } = dbSchema;

            const [post] = await db
              .select({
                organizationId: projects.organizationId,
                userId: posts.userId,
              })
              .from(posts)
              .innerJoin(projects, eq(posts.projectId, projects.id))
              .where(eq(posts.id, postId));

            if (currentUser.id !== post.userId) {
              const [userRole] = await db
                .select({ role: usersToOrganizations.role })
                .from(usersToOrganizations)
                .where(
                  and(
                    eq(usersToOrganizations.userId, currentUser.id),
                    eq(usersToOrganizations.organizationId, post.organizationId)
                  )
                );

              // Allow admins and owners to update and delete posts
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
 * Plugin that handles API access for post table mutations.
 */
const PostRBACPlugin = makeWrapPlansPlugin({
  Mutation: {
    updatePost: validatePermissions("rowId"),
    deletePost: validatePermissions("rowId"),
  },
});

export default PostRBACPlugin;
