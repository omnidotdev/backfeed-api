import { and, count, eq } from "drizzle-orm";
import { EXPORTABLE } from "graphile-export/helpers";
import { context, sideEffect } from "postgraphile/grafast";
import { makeWrapPlansPlugin } from "postgraphile/utils";

import * as dbSchema from "lib/drizzle/schema";

import type { InsertPost } from "lib/drizzle/schema";
import type { GraphQLContext } from "lib/graphql";
import type { ExecutableStep, FieldArgs } from "postgraphile/grafast";

type MutationScope = "create" | "update" | "delete";

// TODO: discuss handling field level permissions. For example, a user should not be able to update the `statusId` field for a post even if they are the author. That should be reserved for admins and owners.

const validatePermissions = (propName: string, scope: MutationScope) =>
  EXPORTABLE(
    (and, count, eq, dbSchema, context, sideEffect, propName, scope) =>
      // biome-ignore lint/suspicious/noExplicitAny: SmartFieldPlanResolver is not an exported type
      (plan: any, _: ExecutableStep, fieldArgs: FieldArgs) => {
        const $post = fieldArgs.getRaw(["input", propName]);
        const $currentUser = context<GraphQLContext>().get("currentUser");
        const $db = context<GraphQLContext>().get("db");

        sideEffect(
          [$post, $currentUser, $db],
          async ([post, currentUser, db]) => {
            if (!currentUser) {
              throw new Error("Unauthorized");
            }

            const MAX_FREE_TIER_FEEDBACK_UNIQUE_USERS = 15;

            const { users, members, projects, posts } = dbSchema;

            if (scope === "create") {
              const projectId = (post as InsertPost).projectId;

              const [organizationOwner] = await db
                .select({
                  tier: users.tier,
                })
                .from(projects)
                .leftJoin(
                  members,
                  and(
                    eq(members.organizationId, projects.organizationId),
                    eq(members.role, "owner"),
                  ),
                )
                .leftJoin(users, eq(members.userId, users.id))
                .where(eq(projects.id, projectId));

              if (
                !organizationOwner.tier ||
                organizationOwner.tier === "free"
              ) {
                const [projectFeedback] = await db
                  .select({
                    totalUserCount: count(posts.userId),
                  })
                  .from(posts)
                  .where(eq(posts.projectId, projectId));

                if (
                  projectFeedback.totalUserCount >=
                  MAX_FREE_TIER_FEEDBACK_UNIQUE_USERS
                ) {
                  const [userFeedback] = await db
                    .select({
                      totalCount: count(),
                    })
                    .from(posts)
                    .where(
                      and(
                        eq(posts.projectId, projectId),
                        eq(posts.userId, currentUser.id),
                      ),
                    );

                  if (!userFeedback.totalCount) {
                    throw new Error(
                      "Maximum number of unique users providing feedback has been reached",
                    );
                  }
                }
              }
            } else {
              const [currenPost] = await db
                .select({
                  organizationId: projects.organizationId,
                  userId: posts.userId,
                })
                .from(posts)
                .innerJoin(projects, eq(posts.projectId, projects.id))
                .where(eq(posts.id, post));

              if (currentUser.id !== currenPost.userId) {
                const [userRole] = await db
                  .select({ role: members.role })
                  .from(members)
                  .where(
                    and(
                      eq(members.userId, currentUser.id),
                      eq(members.organizationId, currenPost.organizationId),
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
    [and, count, eq, dbSchema, context, sideEffect, propName, scope],
  );

/**
 * Plugin that handles API access for post table mutations.
 */
const PostRBACPlugin = makeWrapPlansPlugin({
  Mutation: {
    createPost: validatePermissions("post", "create"),
    updatePost: validatePermissions("rowId", "update"),
    deletePost: validatePermissions("rowId", "delete"),
  },
});

export default PostRBACPlugin;
