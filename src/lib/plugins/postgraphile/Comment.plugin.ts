import { EXPORTABLE } from "graphile-export/helpers";
import { context, sideEffect } from "postgraphile/grafast";
import { wrapPlans } from "postgraphile/utils";

import type { InsertComment } from "lib/drizzle/schema";
import type { PlanWrapperFn } from "postgraphile/utils";
import type { MutationScope } from "./types";

const validatePermissions = (propName: string, scope: MutationScope) =>
  EXPORTABLE(
    (context, sideEffect, propName, scope): PlanWrapperFn =>
      (plan, _, fieldArgs) => {
        const $input = fieldArgs.getRaw(["input", propName]);
        const $observer = context().get("observer");
        const $db = context().get("db");

        sideEffect([$input, $observer, $db], async ([input, observer, db]) => {
          if (!observer) {
            throw new Error("Unauthorized");
          }

          const MAX_FREE_TIER_COMMENTS = 100;

          if (scope === "create") {
            const postId = (input as InsertComment).postId;

            const post = await db.query.posts.findFirst({
              where: (table, { eq }) => eq(table.id, postId),
              with: {
                comments: {
                  columns: {
                    id: true,
                  },
                  limit: MAX_FREE_TIER_COMMENTS,
                },
                project: {
                  with: {
                    organization: true,
                  },
                },
              },
            });

            if (!post) throw new Error("Post does not exist");

            const organizationTier = post.project.organization.tier;

            if (
              organizationTier === "free" &&
              post.comments.length >= MAX_FREE_TIER_COMMENTS
            )
              throw new Error("Maximum number of comments has been reached");
          } else {
            const comment = await db.query.comments.findFirst({
              where: (table, { eq }) => eq(table.id, input),
              with: {
                post: {
                  with: {
                    project: {
                      with: {
                        organization: {
                          with: {
                            members: {
                              where: (table, { eq }) =>
                                eq(table.userId, observer.id),
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            });

            if (!comment?.post.project.organization.members.length)
              throw new Error("Unauthorized");

            if (comment.userId !== observer.id) {
              if (
                comment.post.project.organization.members[0].role === "member"
              )
                throw new Error("Unauthorized");
            }
          }
        });

        return plan();
      },
    [context, sideEffect, propName, scope],
  );

/**
 * Authorization plugin for comments.
 */
const CommentPlugin = wrapPlans({
  Mutation: {
    createComment: validatePermissions("comment", "create"),
    updateComment: validatePermissions("rowId", "update"),
    deleteComment: validatePermissions("rowId", "delete"),
  },
});

export default CommentPlugin;
