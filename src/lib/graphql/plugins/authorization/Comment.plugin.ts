import { EXPORTABLE } from "graphile-export/helpers";
import { context, sideEffect } from "postgraphile/grafast";
import { wrapPlans } from "postgraphile/utils";

import { FEATURE_KEYS, billingBypassSlugs, isWithinLimit } from "./constants";

import type { InsertComment, SelectWorkspace } from "lib/db/schema";
import type { PlanWrapperFn } from "postgraphile/utils";
import type { MutationScope } from "./types";

const validatePermissions = (propName: string, scope: MutationScope) =>
  EXPORTABLE(
    (
      context,
      sideEffect,
      billingBypassSlugs,
      FEATURE_KEYS,
      isWithinLimit,
      propName,
      scope,
    ): PlanWrapperFn =>
      (plan, _, fieldArgs) => {
        const $input = fieldArgs.getRaw(["input", propName]);
        const $observer = context().get("observer");
        const $db = context().get("db");

        sideEffect([$input, $observer, $db], async ([input, observer, db]) => {
          if (!observer) throw new Error("Unauthorized");

          if (scope === "create") {
            const postId = (input as InsertComment).postId;

            const post = await db.query.posts.findFirst({
              where: (table, { eq }) => eq(table.id, postId),
              with: {
                comments: {
                  columns: {
                    id: true,
                  },
                },
                project: {
                  with: {
                    workspace: true,
                  },
                },
              },
            });

            if (!post) throw new Error("Post does not exist");

            // Check comments per post limit
            const withinLimit = await isWithinLimit(
              post.project.workspace as {
                id: string;
                tier: SelectWorkspace["tier"];
                slug: string;
              },
              FEATURE_KEYS.MAX_COMMENTS_PER_POST,
              post.comments.length,
              billingBypassSlugs,
            );

            if (!withinLimit) {
              throw new Error("Maximum number of comments has been reached");
            }
          } else {
            const comment = await db.query.comments.findFirst({
              where: (table, { eq }) => eq(table.id, input),
              with: {
                post: {
                  with: {
                    project: {
                      with: {
                        workspace: {
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

            if (!comment?.post.project.workspace.members.length)
              throw new Error("Unauthorized");

            if (comment.userId !== observer.id) {
              if (comment.post.project.workspace.members[0].role === "member")
                throw new Error("Unauthorized");
            }
          }
        });

        return plan();
      },
    [
      context,
      sideEffect,
      billingBypassSlugs,
      FEATURE_KEYS,
      isWithinLimit,
      propName,
      scope,
    ],
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
