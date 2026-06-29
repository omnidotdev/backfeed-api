/**
 * Notification Write Plugin
 *
 * Fans successful comment, reaction, and post mutations out into per-recipient
 * `notification` rows (the in-app notification center). Runs in a sideEffect
 * after the mutation succeeds; errors are logged but never fail the mutation
 * (best-effort, like event emission). Recipient resolution lives in
 * `lib/notifications/center`.
 */

import { EXPORTABLE } from "graphile-export";
import {
  notifyOnComment,
  notifyOnPostCreated,
  notifyOnReaction,
} from "lib/notifications/center";
import { context, sideEffect } from "postgraphile/grafast";
import { wrapPlans } from "postgraphile/utils";

import type { InsertComment, InsertPost, InsertReaction } from "lib/db/schema";
import type { PlanWrapperFn } from "postgraphile/utils";

const onCommentCreated = (): PlanWrapperFn =>
  EXPORTABLE(
    (context, sideEffect, notifyOnComment): PlanWrapperFn =>
      (plan, _, fieldArgs) => {
        const $result = plan();
        const $input = fieldArgs.getRaw(["input", "comment"]);
        const $db = context().get("db");

        sideEffect([$result, $input, $db], async ([result, input, db]) => {
          if (!result) return;

          const { postId, message, userId, parentId } = input as InsertComment;
          const commentId = (result as { id?: string })?.id;
          if (!commentId) return;

          try {
            await notifyOnComment(db, {
              postId,
              commentId,
              message: message ?? null,
              authorId: userId,
              parentId: parentId ?? null,
            });
          } catch (error) {
            console.error("[Notifications] comment fan-out failed:", error);
          }
        });

        return $result;
      },
    [context, sideEffect, notifyOnComment],
  );

const onReactionCreated = (): PlanWrapperFn =>
  EXPORTABLE(
    (context, sideEffect, notifyOnReaction): PlanWrapperFn =>
      (plan, _, fieldArgs) => {
        const $result = plan();
        const $input = fieldArgs.getRaw(["input", "reaction"]);
        const $db = context().get("db");

        sideEffect([$result, $input, $db], async ([result, input, db]) => {
          if (!result) return;

          const { postId, commentId, emoji, userId } = input as InsertReaction;

          try {
            await notifyOnReaction(db, {
              postId: postId ?? null,
              commentId: commentId ?? null,
              emoji,
              reactorId: userId,
            });
          } catch (error) {
            console.error("[Notifications] reaction fan-out failed:", error);
          }
        });

        return $result;
      },
    [context, sideEffect, notifyOnReaction],
  );

const onPostCreated = (): PlanWrapperFn =>
  EXPORTABLE(
    (context, sideEffect, notifyOnPostCreated): PlanWrapperFn =>
      (plan, _, fieldArgs) => {
        const $result = plan();
        const $input = fieldArgs.getRaw(["input", "post"]);
        const $db = context().get("db");

        sideEffect([$result, $input, $db], async ([result, input, db]) => {
          if (!result) return;

          const { description, userId } = input as InsertPost;
          const postId = (result as { id?: string })?.id;
          if (!postId) return;

          try {
            await notifyOnPostCreated(db, {
              postId,
              description: description ?? null,
              authorId: userId,
            });
          } catch (error) {
            console.error("[Notifications] post fan-out failed:", error);
          }
        });

        return $result;
      },
    [context, sideEffect, notifyOnPostCreated],
  );

/**
 * Writes in-app notification rows on comment, reaction, and post creation.
 */
const NotificationWritePlugin = wrapPlans({
  Mutation: {
    createComment: onCommentCreated(),
    createReaction: onReactionCreated(),
    createPost: onPostCreated(),
  },
});

export default NotificationWritePlugin;
