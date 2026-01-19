import { EXPORTABLE } from "graphile-export/helpers";
import { AUTHZ_API_URL, AUTHZ_ENABLED, checkPermission } from "lib/authz";
import { context, sideEffect } from "postgraphile/grafast";
import { wrapPlans } from "postgraphile/utils";

import { FEATURE_KEYS, billingBypassOrgIds, isWithinLimit } from "./constants";

import type { InsertComment } from "lib/db/schema";
import type { PlanWrapperFn } from "postgraphile/utils";
import type { MutationScope } from "./types";

/**
 * Validate comment permissions via PDP.
 *
 * - Create: Any authenticated user (with tier limits)
 * - Update: Author or admin+ on organization
 * - Delete: Author or admin+ on organization
 */
const validatePermissions = (propName: string, scope: MutationScope) =>
  EXPORTABLE(
    (
      context,
      sideEffect,
      AUTHZ_ENABLED,
      AUTHZ_API_URL,
      checkPermission,
      billingBypassOrgIds,
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
                project: true,
              },
            });

            if (!post) throw new Error("Post does not exist");

            // Get comment count for this post
            const comments = await db.query.comments.findMany({
              where: (table, { eq }) => eq(table.postId, postId),
              columns: { id: true },
            });

            // Check comments per post limit
            const withinLimit = await isWithinLimit(
              { organizationId: post.project.organizationId },
              FEATURE_KEYS.MAX_COMMENTS_PER_POST,
              comments.length,
              billingBypassOrgIds,
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
                    project: true,
                  },
                },
              },
            });

            if (!comment) throw new Error("Comment not found");

            // Author can always modify their own comments
            if (comment.userId !== observer.id) {
              // Check admin permission via PDP on organization
              const allowed = await checkPermission(
                AUTHZ_ENABLED,
                AUTHZ_API_URL,
                observer.id,
                "organization",
                comment.post.project.organizationId,
                "admin",
              );
              if (!allowed) throw new Error("Unauthorized");
            }
          }
        });

        return plan();
      },
    [
      context,
      sideEffect,
      AUTHZ_ENABLED,
      AUTHZ_API_URL,
      checkPermission,
      billingBypassOrgIds,
      FEATURE_KEYS,
      isWithinLimit,
      propName,
      scope,
    ],
  );

/**
 * Authorization plugin for comments.
 *
 * - Create: Any authenticated user (with tier limits)
 * - Update: Author or admin+
 * - Delete: Author or admin+
 */
const CommentPlugin = wrapPlans({
  Mutation: {
    createComment: validatePermissions("comment", "create"),
    updateComment: validatePermissions("rowId", "update"),
    deleteComment: validatePermissions("rowId", "delete"),
  },
});

export default CommentPlugin;
