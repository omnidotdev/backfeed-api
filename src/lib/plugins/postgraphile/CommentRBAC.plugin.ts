import { and, count, eq } from "drizzle-orm";
import { EXPORTABLE } from "graphile-export/helpers";
import * as dbSchema from "lib/drizzle/schema";
import { context, sideEffect } from "postgraphile/grafast";
import { wrapPlans } from "postgraphile/utils";

import type { InsertComment } from "lib/drizzle/schema";
import type { PlanWrapperFn } from "postgraphile/utils";

type MutationScope = "create" | "update" | "delete";

const validatePermissions = (propName: string, scope: MutationScope) =>
  EXPORTABLE(
    (
      and,
      count,
      eq,
      dbSchema,
      context,
      sideEffect,
      propName,
      scope,
    ): PlanWrapperFn =>
      (plan, _, fieldArgs) => {
        const $comment = fieldArgs.getRaw(["input", propName]);
        const $currentUser = context().get("observer");
        const $db = context().get("db");

        sideEffect(
          [$comment, $currentUser, $db],
          async ([comment, currentUser, db]) => {
            if (!currentUser) {
              throw new Error("Unauthorized");
            }

            const MAX_FREE_TIER_COMMENTS = 100;

            const { users, members, projects, posts, comments } = dbSchema;

            if (scope === "create") {
              const postId = (comment as InsertComment).postId;

              const [organizationOwner] = await db
                .select({
                  tier: users.tier,
                })
                .from(posts)
                .innerJoin(projects, eq(posts.projectId, projects.id))
                .leftJoin(
                  members,
                  and(
                    eq(members.organizationId, projects.organizationId),
                    eq(members.role, "owner"),
                  ),
                )
                .leftJoin(users, eq(members.userId, users.id))
                .where(eq(posts.id, postId));

              if (
                !organizationOwner.tier ||
                organizationOwner.tier === "free"
              ) {
                const [postComments] = await db
                  .select({
                    totalCount: count(),
                  })
                  .from(comments)
                  .where(eq(comments.postId, postId));

                if (postComments.totalCount >= MAX_FREE_TIER_COMMENTS) {
                  throw new Error(
                    "Maximum number of comments has been reached",
                  );
                }
              }
            } else {
              const [currentComment] = await db
                .select({
                  organizationId: projects.organizationId,
                  userId: comments.userId,
                })
                .from(comments)
                .innerJoin(posts, eq(comments.postId, posts.id))
                .innerJoin(projects, eq(posts.projectId, projects.id))
                .where(eq(comments.id, comment));

              if (currentUser.id !== currentComment.userId) {
                const [userRole] = await db
                  .select({ role: members.role })
                  .from(members)
                  .where(
                    and(
                      eq(members.userId, currentUser.id),
                      eq(members.organizationId, currentComment.organizationId),
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
    [and, count, eq, dbSchema, context, sideEffect, propName, scope],
  );

/**
 * Plugin that handles API access for comment table mutations.
 */
const CommentRBACPlugin = wrapPlans({
  Mutation: {
    createComment: validatePermissions("comment", "create"),
    updateComment: validatePermissions("rowId", "update"),
    deleteComment: validatePermissions("rowId", "delete"),
  },
});

export default CommentRBACPlugin;
