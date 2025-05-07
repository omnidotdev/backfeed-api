import { and, eq } from "drizzle-orm";
import { EXPORTABLE } from "graphile-export/helpers";
import { context, sideEffect } from "postgraphile/grafast";
import { makeWrapPlansPlugin } from "postgraphile/utils";

import * as dbSchema from "lib/drizzle/schema";

import type { GraphQLContext } from "lib/graphql";
import type { ExecutableStep, FieldArgs } from "postgraphile/grafast";

type MutationScope = "create" | "update" | "delete";

// TODO: discuss handling field level permissions. For example, a user should not be able to update the `statusId` field for a post even if they are the author. That should be reserved for admins and owners.

const validatePermissions = (propName: string, scope: MutationScope) =>
  EXPORTABLE(
    (and, eq, dbSchema, context, sideEffect, propName, scope) =>
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

            if (scope !== "create") {
              const { members, projects, posts } = dbSchema;

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
                  .select({ role: members.role })
                  .from(members)
                  .where(
                    and(
                      eq(members.userId, currentUser.id),
                      eq(members.organizationId, post.organizationId),
                    ),
                  );

                // Allow admins and owners to update and delete posts
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
 * Plugin that handles API access for post table mutations.
 */
const PostRBACPlugin = makeWrapPlansPlugin({
  Mutation: {
    createPost: validatePermissions("post", "create"),
    updatePost: validatePermissions("rowId", "update"),
    deletePost: validatePermissions("rowId", "update"),
  },
});

export default PostRBACPlugin;
