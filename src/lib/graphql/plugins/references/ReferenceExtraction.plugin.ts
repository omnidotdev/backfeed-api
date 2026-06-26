/**
 * Reference Extraction Plugin
 *
 * Wraps post/comment create and update mutations to keep `post_reference` edges
 * in sync with the #N references in a post description or comment body, and to
 * emit a `backfeed.post.mention` event per @-mentioned user on post creation
 * (comment mentions are emitted by EventEmission). Both run in `sideEffect`
 * after the mutation succeeds; all work is wrapped in try/catch and logged but
 * never fails the mutation (eventual consistency, like EventEmission).
 *
 * Magic-word transitions (closes/fixes/resolves #N) are gated on the actor
 * being an org admin, resolved from the request observer.
 */

import { eventMeta } from "@omnidotdev/providers/events";
import { EXPORTABLE } from "graphile-export";
import { isOrganizationAdmin } from "lib/authz";
import { extractMentionUserIds } from "lib/feedback/references";
import { syncReferences } from "lib/feedback/syncReferences";
import { events } from "lib/providers";
import { context, sideEffect } from "postgraphile/grafast";
import { wrapPlans } from "postgraphile/utils";

import type { InsertComment, InsertPost } from "lib/db/schema";
import type { PlanWrapperFn } from "postgraphile/utils";

// -- Post references --

const extractPostCreate = (): PlanWrapperFn =>
  EXPORTABLE(
    (
      context,
      sideEffect,
      events,
      eventMeta,
      extractMentionUserIds,
      isOrganizationAdmin,
      syncReferences,
    ): PlanWrapperFn =>
      (plan, _, fieldArgs) => {
        const $result = plan();
        const $input = fieldArgs.getRaw(["input", "post"]);
        const $db = context().get("db");
        const $observer = context().get("observer");

        sideEffect(
          [$result, $input, $db, $observer],
          async ([result, input, db, observer]) => {
            if (!result) return;

            const {
              projectId,
              description,
              userId: mentionedByUserId,
            } = input as InsertPost;
            const postId = (result as { id?: string })?.id;
            if (!postId) return;

            const project = await db.query.projects.findFirst({
              where: (table, { eq }) => eq(table.id, projectId),
              columns: { organizationId: true },
            });
            if (!project) return;

            const organizationId = project.organizationId;

            // emit a mention event per @-mentioned user (rich-text posts link
            // mentions to /profile/<userId>); skip the author mentioning themself
            const mentionedUserIds = extractMentionUserIds(
              description ?? "",
              mentionedByUserId ?? "",
            );

            for (const mentionedUserId of mentionedUserIds) {
              try {
                await events.emit({
                  type: "backfeed.post.mention",
                  data: {
                    postId,
                    projectId,
                    organizationId,
                    mentionedUserId,
                    mentionedByUserId,
                    ...eventMeta(observer, "post"),
                  },
                  organizationId,
                  subject: mentionedUserId,
                });
              } catch (error) {
                console.error(
                  "[References] Failed to emit post.mention:",
                  error,
                );
              }
            }

            try {
              const isAdmin = observer
                ? await isOrganizationAdmin(
                    observer.identityProviderId,
                    organizationId,
                  )
                : false;

              await syncReferences({
                db,
                sourceType: "post",
                sourceId: postId,
                projectId,
                organizationId,
                text: description ?? "",
                authorUserId: mentionedByUserId ?? "",
                isAdmin,
                selfPostId: postId,
              });
            } catch (error) {
              console.error(
                "[References] Failed to sync post references:",
                error,
              );
            }
          },
        );

        return $result;
      },
    [
      context,
      sideEffect,
      events,
      eventMeta,
      extractMentionUserIds,
      isOrganizationAdmin,
      syncReferences,
    ],
  );

const extractPostUpdate = (): PlanWrapperFn =>
  EXPORTABLE(
    (context, sideEffect, isOrganizationAdmin, syncReferences): PlanWrapperFn =>
      (plan, _, fieldArgs) => {
        const $result = plan();
        const $postId = fieldArgs.getRaw(["input", "rowId"]);
        const $db = context().get("db");
        const $observer = context().get("observer");

        sideEffect(
          [$result, $postId, $db, $observer],
          async ([result, postId, db, observer]) => {
            if (!result) return;

            try {
              // reload the post after the update so we sync against the new
              // description; mentions are not re-emitted on update
              const post = await db.query.posts.findFirst({
                where: (table, { eq }) => eq(table.id, postId as string),
                columns: {
                  id: true,
                  projectId: true,
                  description: true,
                  userId: true,
                },
                with: { project: { columns: { organizationId: true } } },
              });
              if (!post?.project) return;

              const organizationId = post.project.organizationId;
              const isAdmin = observer
                ? await isOrganizationAdmin(
                    observer.identityProviderId,
                    organizationId,
                  )
                : false;

              await syncReferences({
                db,
                sourceType: "post",
                sourceId: post.id,
                projectId: post.projectId,
                organizationId,
                text: post.description ?? "",
                authorUserId: post.userId ?? "",
                isAdmin,
                selfPostId: post.id,
              });
            } catch (error) {
              console.error(
                "[References] Failed to sync post references:",
                error,
              );
            }
          },
        );

        return $result;
      },
    [context, sideEffect, isOrganizationAdmin, syncReferences],
  );

// -- Comment references --

const extractCommentCreate = (): PlanWrapperFn =>
  EXPORTABLE(
    (context, sideEffect, isOrganizationAdmin, syncReferences): PlanWrapperFn =>
      (plan, _, fieldArgs) => {
        const $result = plan();
        const $input = fieldArgs.getRaw(["input", "comment"]);
        const $db = context().get("db");
        const $observer = context().get("observer");

        sideEffect(
          [$result, $input, $db, $observer],
          async ([result, input, db, observer]) => {
            if (!result) return;

            const { postId, message, userId } = input as InsertComment;
            const commentId = (result as { id?: string })?.id;
            if (!commentId) return;

            try {
              const post = await db.query.posts.findFirst({
                where: (table, { eq }) => eq(table.id, postId),
                columns: { id: true, projectId: true },
                with: { project: { columns: { organizationId: true } } },
              });
              if (!post?.project) return;

              const organizationId = post.project.organizationId;
              const isAdmin = observer
                ? await isOrganizationAdmin(
                    observer.identityProviderId,
                    organizationId,
                  )
                : false;

              await syncReferences({
                db,
                sourceType: "comment",
                sourceId: commentId,
                projectId: post.projectId,
                organizationId,
                text: message ?? "",
                authorUserId: userId ?? "",
                isAdmin,
                selfPostId: post.id,
              });
            } catch (error) {
              console.error(
                "[References] Failed to sync comment references:",
                error,
              );
            }
          },
        );

        return $result;
      },
    [context, sideEffect, isOrganizationAdmin, syncReferences],
  );

const extractCommentUpdate = (): PlanWrapperFn =>
  EXPORTABLE(
    (context, sideEffect, isOrganizationAdmin, syncReferences): PlanWrapperFn =>
      (plan, _, fieldArgs) => {
        const $result = plan();
        const $commentId = fieldArgs.getRaw(["input", "rowId"]);
        const $db = context().get("db");
        const $observer = context().get("observer");

        sideEffect(
          [$result, $commentId, $db, $observer],
          async ([result, commentId, db, observer]) => {
            if (!result) return;

            try {
              const comment = await db.query.comments.findFirst({
                where: (table, { eq }) => eq(table.id, commentId as string),
                columns: { id: true, message: true, userId: true },
                with: {
                  post: {
                    columns: { id: true, projectId: true },
                    with: { project: { columns: { organizationId: true } } },
                  },
                },
              });
              if (!comment?.post?.project) return;

              const organizationId = comment.post.project.organizationId;
              const isAdmin = observer
                ? await isOrganizationAdmin(
                    observer.identityProviderId,
                    organizationId,
                  )
                : false;

              await syncReferences({
                db,
                sourceType: "comment",
                sourceId: comment.id,
                projectId: comment.post.projectId,
                organizationId,
                text: comment.message ?? "",
                authorUserId: comment.userId ?? "",
                isAdmin,
                selfPostId: comment.post.id,
              });
            } catch (error) {
              console.error(
                "[References] Failed to sync comment references:",
                error,
              );
            }
          },
        );

        return $result;
      },
    [context, sideEffect, isOrganizationAdmin, syncReferences],
  );

/**
 * Reference extraction plugin for post/comment mutations.
 *
 * Syncs `post_reference` edges and emits `backfeed.post.mention` on post
 * creation. Composes with EventEmissionPlugin (two wrapPlans on the same
 * mutation run in sequence).
 */
const ReferenceExtractionPlugin = wrapPlans({
  Mutation: {
    createPost: extractPostCreate(),
    updatePost: extractPostUpdate(),
    createComment: extractCommentCreate(),
    updateComment: extractCommentUpdate(),
  },
});

export default ReferenceExtractionPlugin;
