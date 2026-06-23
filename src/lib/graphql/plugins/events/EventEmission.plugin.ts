/**
 * Event Emission Plugin
 *
 * Emits Vortex events after successful Backfeed mutations.
 * Calls plan() first to capture the mutation result, then uses sideEffect
 * to emit events only after the mutation completes successfully.
 * Errors are logged but never fail mutations (eventual consistency).
 *
 * Each event's data payload is enriched via `eventMeta` with the acting user
 * (from the request observer) and the resource type/name, so downstream audit
 * and activity-feed consumers (e.g. Chronicle) can render "who did what to
 * which thing" without extra lookups.
 */

import { eventMeta } from "@omnidotdev/providers/events";
import { EXPORTABLE } from "graphile-export";
import { events } from "lib/providers";
import { context, sideEffect } from "postgraphile/grafast";
import { wrapPlans } from "postgraphile/utils";

import type {
  InsertComment,
  InsertPost,
  InsertProject,
  InsertProjectLink,
  InsertProjectStatusConfig,
  InsertStatusTemplate,
  InsertVote,
} from "lib/db/schema";
import type { PlanWrapperFn } from "postgraphile/utils";

// -- Project events --

const emitProjectCreated = (): PlanWrapperFn =>
  EXPORTABLE(
    (context, sideEffect, events, eventMeta): PlanWrapperFn =>
      (plan, _, fieldArgs) => {
        const $result = plan();
        const $input = fieldArgs.getRaw(["input", "project"]);
        const $observer = context().get("observer");

        sideEffect(
          [$result, $input, $observer],
          async ([result, input, observer]) => {
            if (!result) return;

            const { organizationId, name } = input as InsertProject;
            const projectId = (result as { id?: string })?.id;
            if (!projectId) return;

            try {
              await events.emit({
                type: "backfeed.project.created",
                data: {
                  projectId,
                  organizationId,
                  ...eventMeta(observer, "project", name),
                },
                organizationId,
                subject: projectId,
              });
            } catch (error) {
              console.error("[Events] Failed to emit project.created:", error);
            }
          },
        );

        return $result;
      },
    [context, sideEffect, events, eventMeta],
  );

const emitProjectUpdated = (): PlanWrapperFn =>
  EXPORTABLE(
    (context, sideEffect, events, eventMeta): PlanWrapperFn =>
      (plan, _, fieldArgs) => {
        const $result = plan();
        const $projectId = fieldArgs.getRaw(["input", "rowId"]);
        const $db = context().get("db");
        const $observer = context().get("observer");

        sideEffect(
          [$result, $projectId, $db, $observer],
          async ([result, projectId, db, observer]) => {
            if (!result) return;

            const project = await db.query.projects.findFirst({
              where: (table, { eq }) => eq(table.id, projectId as string),
              columns: { organizationId: true, name: true },
            });
            if (!project) return;

            try {
              await events.emit({
                type: "backfeed.project.updated",
                data: {
                  projectId: projectId as string,
                  organizationId: project.organizationId,
                  ...eventMeta(observer, "project", project.name),
                },
                organizationId: project.organizationId,
                subject: projectId as string,
              });
            } catch (error) {
              console.error("[Events] Failed to emit project.updated:", error);
            }
          },
        );

        return $result;
      },
    [context, sideEffect, events, eventMeta],
  );

const emitProjectDeleted = (): PlanWrapperFn =>
  EXPORTABLE(
    (context, sideEffect, events, eventMeta): PlanWrapperFn =>
      (plan, _, fieldArgs) => {
        const $result = plan();
        const $projectId = fieldArgs.getRaw(["input", "rowId"]);
        const $db = context().get("db");
        const $observer = context().get("observer");

        sideEffect(
          [$result, $projectId, $db, $observer],
          async ([result, projectId, db, observer]) => {
            if (!result) return;

            const project = await db.query.projects.findFirst({
              where: (table, { eq }) => eq(table.id, projectId as string),
              columns: { organizationId: true, name: true },
            });
            if (!project) return;

            try {
              await events.emit({
                type: "backfeed.project.deleted",
                data: {
                  projectId: projectId as string,
                  organizationId: project.organizationId,
                  ...eventMeta(observer, "project", project.name),
                },
                organizationId: project.organizationId,
                subject: projectId as string,
              });
            } catch (error) {
              console.error("[Events] Failed to emit project.deleted:", error);
            }
          },
        );

        return $result;
      },
    [context, sideEffect, events, eventMeta],
  );

// -- Post events --

const emitPostCreated = (): PlanWrapperFn =>
  EXPORTABLE(
    (context, sideEffect, events, eventMeta): PlanWrapperFn =>
      (plan, _, fieldArgs) => {
        const $result = plan();
        const $input = fieldArgs.getRaw(["input", "post"]);
        const $db = context().get("db");
        const $observer = context().get("observer");

        sideEffect(
          [$result, $input, $db, $observer],
          async ([result, input, db, observer]) => {
            if (!result) return;

            const { projectId, title } = input as InsertPost;
            const postId = (result as { id?: string })?.id;
            if (!postId) return;

            const project = await db.query.projects.findFirst({
              where: (table, { eq }) => eq(table.id, projectId),
              columns: { organizationId: true },
            });
            if (!project) return;

            try {
              await events.emit({
                type: "backfeed.post.created",
                data: {
                  postId,
                  projectId,
                  organizationId: project.organizationId,
                  ...eventMeta(observer, "post", title),
                },
                organizationId: project.organizationId,
                subject: postId,
              });
            } catch (error) {
              console.error("[Events] Failed to emit post.created:", error);
            }
          },
        );

        return $result;
      },
    [context, sideEffect, events, eventMeta],
  );

const emitPostUpdated = (): PlanWrapperFn =>
  EXPORTABLE(
    (context, sideEffect, events, eventMeta): PlanWrapperFn =>
      (plan, _, fieldArgs) => {
        const $result = plan();
        const $postId = fieldArgs.getRaw(["input", "rowId"]);
        const $db = context().get("db");
        const $observer = context().get("observer");

        sideEffect(
          [$result, $postId, $db, $observer],
          async ([result, postId, db, observer]) => {
            if (!result) return;

            const post = await db.query.posts.findFirst({
              where: (table, { eq }) => eq(table.id, postId as string),
              with: { project: { columns: { organizationId: true } } },
            });
            if (!post?.project) return;

            try {
              await events.emit({
                type: "backfeed.post.updated",
                data: {
                  postId: postId as string,
                  projectId: post.projectId,
                  organizationId: post.project.organizationId,
                  ...eventMeta(observer, "post", post.title),
                },
                organizationId: post.project.organizationId,
                subject: postId as string,
              });
            } catch (error) {
              console.error("[Events] Failed to emit post.updated:", error);
            }
          },
        );

        return $result;
      },
    [context, sideEffect, events, eventMeta],
  );

const emitPostDeleted = (): PlanWrapperFn =>
  EXPORTABLE(
    (context, sideEffect, events, eventMeta): PlanWrapperFn =>
      (plan, _, fieldArgs) => {
        const $result = plan();
        const $postId = fieldArgs.getRaw(["input", "rowId"]);
        const $db = context().get("db");
        const $observer = context().get("observer");

        sideEffect(
          [$result, $postId, $db, $observer],
          async ([result, postId, db, observer]) => {
            if (!result) return;

            const post = await db.query.posts.findFirst({
              where: (table, { eq }) => eq(table.id, postId as string),
              with: { project: { columns: { organizationId: true } } },
            });
            if (!post?.project) return;

            try {
              await events.emit({
                type: "backfeed.post.deleted",
                data: {
                  postId: postId as string,
                  projectId: post.projectId,
                  organizationId: post.project.organizationId,
                  ...eventMeta(observer, "post", post.title),
                },
                organizationId: post.project.organizationId,
                subject: postId as string,
              });
            } catch (error) {
              console.error("[Events] Failed to emit post.deleted:", error);
            }
          },
        );

        return $result;
      },
    [context, sideEffect, events, eventMeta],
  );

// -- Comment events --

const emitCommentCreated = (): PlanWrapperFn =>
  EXPORTABLE(
    (context, sideEffect, events, eventMeta): PlanWrapperFn =>
      (plan, _, fieldArgs) => {
        const $result = plan();
        const $input = fieldArgs.getRaw(["input", "comment"]);
        const $db = context().get("db");
        const $observer = context().get("observer");

        sideEffect(
          [$result, $input, $db, $observer],
          async ([result, input, db, observer]) => {
            if (!result) return;

            const {
              postId,
              message,
              userId: mentionedByUserId,
            } = input as InsertComment;
            const commentId = (result as { id?: string })?.id;
            if (!commentId) return;

            const post = await db.query.posts.findFirst({
              where: (table, { eq }) => eq(table.id, postId),
              with: { project: { columns: { organizationId: true } } },
            });
            if (!post?.project) return;

            const organizationId = post.project.organizationId;

            try {
              await events.emit({
                type: "backfeed.comment.created",
                data: {
                  commentId,
                  postId,
                  projectId: post.projectId,
                  organizationId,
                  ...eventMeta(observer, "comment"),
                },
                organizationId,
                subject: commentId,
              });
            } catch (error) {
              console.error("[Events] Failed to emit comment.created:", error);
            }

            // emit a mention event per @-mentioned user (rich-text comments link
            // mentions to /profile/<userId>); skip the author mentioning themself
            const mentionedUserIds = new Set<string>();
            const mentionPattern = /\/profile\/([0-9a-fA-F-]{36})/g;
            let match = mentionPattern.exec(message ?? "");
            while (match !== null) {
              if (match[1] !== mentionedByUserId)
                mentionedUserIds.add(match[1]);
              match = mentionPattern.exec(message ?? "");
            }

            for (const mentionedUserId of mentionedUserIds) {
              try {
                await events.emit({
                  type: "backfeed.comment.mention",
                  data: {
                    commentId,
                    postId,
                    projectId: post.projectId,
                    organizationId,
                    mentionedUserId,
                    mentionedByUserId,
                    ...eventMeta(observer, "comment"),
                  },
                  organizationId,
                  subject: mentionedUserId,
                });
              } catch (error) {
                console.error(
                  "[Events] Failed to emit comment.mention:",
                  error,
                );
              }
            }
          },
        );

        return $result;
      },
    [context, sideEffect, events, eventMeta],
  );

const emitCommentUpdated = (): PlanWrapperFn =>
  EXPORTABLE(
    (context, sideEffect, events, eventMeta): PlanWrapperFn =>
      (plan, _, fieldArgs) => {
        const $result = plan();
        const $commentId = fieldArgs.getRaw(["input", "rowId"]);
        const $db = context().get("db");
        const $observer = context().get("observer");

        sideEffect(
          [$result, $commentId, $db, $observer],
          async ([result, commentId, db, observer]) => {
            if (!result) return;

            const comment = await db.query.comments.findFirst({
              where: (table, { eq }) => eq(table.id, commentId as string),
              with: {
                post: {
                  with: { project: { columns: { organizationId: true } } },
                },
              },
            });
            if (!comment?.post?.project) return;

            try {
              await events.emit({
                type: "backfeed.comment.updated",
                data: {
                  commentId: commentId as string,
                  postId: comment.postId,
                  projectId: comment.post.projectId,
                  organizationId: comment.post.project.organizationId,
                  ...eventMeta(observer, "comment"),
                },
                organizationId: comment.post.project.organizationId,
                subject: commentId as string,
              });
            } catch (error) {
              console.error("[Events] Failed to emit comment.updated:", error);
            }
          },
        );

        return $result;
      },
    [context, sideEffect, events, eventMeta],
  );

const emitCommentDeleted = (): PlanWrapperFn =>
  EXPORTABLE(
    (context, sideEffect, events, eventMeta): PlanWrapperFn =>
      (plan, _, fieldArgs) => {
        const $result = plan();
        const $commentId = fieldArgs.getRaw(["input", "rowId"]);
        const $db = context().get("db");
        const $observer = context().get("observer");

        sideEffect(
          [$result, $commentId, $db, $observer],
          async ([result, commentId, db, observer]) => {
            if (!result) return;

            const comment = await db.query.comments.findFirst({
              where: (table, { eq }) => eq(table.id, commentId as string),
              with: {
                post: {
                  with: { project: { columns: { organizationId: true } } },
                },
              },
            });
            if (!comment?.post?.project) return;

            try {
              await events.emit({
                type: "backfeed.comment.deleted",
                data: {
                  commentId: commentId as string,
                  postId: comment.postId,
                  projectId: comment.post.projectId,
                  organizationId: comment.post.project.organizationId,
                  ...eventMeta(observer, "comment"),
                },
                organizationId: comment.post.project.organizationId,
                subject: commentId as string,
              });
            } catch (error) {
              console.error("[Events] Failed to emit comment.deleted:", error);
            }
          },
        );

        return $result;
      },
    [context, sideEffect, events, eventMeta],
  );

// -- Vote events --

const emitVoteCreated = (): PlanWrapperFn =>
  EXPORTABLE(
    (context, sideEffect, events, eventMeta): PlanWrapperFn =>
      (plan, _, fieldArgs) => {
        const $result = plan();
        const $input = fieldArgs.getRaw(["input", "vote"]);
        const $db = context().get("db");
        const $observer = context().get("observer");

        sideEffect(
          [$result, $input, $db, $observer],
          async ([result, input, db, observer]) => {
            if (!result) return;

            const { postId } = input as InsertVote;
            const voteId = (result as { id?: string })?.id;
            if (!voteId) return;

            const post = await db.query.posts.findFirst({
              where: (table, { eq }) => eq(table.id, postId),
              with: { project: { columns: { organizationId: true } } },
            });
            if (!post?.project) return;

            try {
              await events.emit({
                type: "backfeed.vote.created",
                data: {
                  voteId,
                  postId,
                  projectId: post.projectId,
                  organizationId: post.project.organizationId,
                  ...eventMeta(observer, "vote"),
                },
                organizationId: post.project.organizationId,
                subject: voteId,
              });
            } catch (error) {
              console.error("[Events] Failed to emit vote.created:", error);
            }
          },
        );

        return $result;
      },
    [context, sideEffect, events, eventMeta],
  );

const emitVoteUpdated = (): PlanWrapperFn =>
  EXPORTABLE(
    (context, sideEffect, events, eventMeta): PlanWrapperFn =>
      (plan, _, fieldArgs) => {
        const $result = plan();
        const $voteId = fieldArgs.getRaw(["input", "rowId"]);
        const $db = context().get("db");
        const $observer = context().get("observer");

        sideEffect(
          [$result, $voteId, $db, $observer],
          async ([result, voteId, db, observer]) => {
            if (!result) return;

            const vote = await db.query.votes.findFirst({
              where: (table, { eq }) => eq(table.id, voteId as string),
              with: {
                post: {
                  with: { project: { columns: { organizationId: true } } },
                },
              },
            });
            if (!vote?.post?.project) return;

            try {
              await events.emit({
                type: "backfeed.vote.updated",
                data: {
                  voteId: voteId as string,
                  postId: vote.postId,
                  projectId: vote.post.projectId,
                  organizationId: vote.post.project.organizationId,
                  ...eventMeta(observer, "vote"),
                },
                organizationId: vote.post.project.organizationId,
                subject: voteId as string,
              });
            } catch (error) {
              console.error("[Events] Failed to emit vote.updated:", error);
            }
          },
        );

        return $result;
      },
    [context, sideEffect, events, eventMeta],
  );

const emitVoteDeleted = (): PlanWrapperFn =>
  EXPORTABLE(
    (context, sideEffect, events, eventMeta): PlanWrapperFn =>
      (plan, _, fieldArgs) => {
        const $result = plan();
        const $voteId = fieldArgs.getRaw(["input", "rowId"]);
        const $db = context().get("db");
        const $observer = context().get("observer");

        sideEffect(
          [$result, $voteId, $db, $observer],
          async ([result, voteId, db, observer]) => {
            if (!result) return;

            const vote = await db.query.votes.findFirst({
              where: (table, { eq }) => eq(table.id, voteId as string),
              with: {
                post: {
                  with: { project: { columns: { organizationId: true } } },
                },
              },
            });
            if (!vote?.post?.project) return;

            try {
              await events.emit({
                type: "backfeed.vote.deleted",
                data: {
                  voteId: voteId as string,
                  postId: vote.postId,
                  projectId: vote.post.projectId,
                  organizationId: vote.post.project.organizationId,
                  ...eventMeta(observer, "vote"),
                },
                organizationId: vote.post.project.organizationId,
                subject: voteId as string,
              });
            } catch (error) {
              console.error("[Events] Failed to emit vote.deleted:", error);
            }
          },
        );

        return $result;
      },
    [context, sideEffect, events, eventMeta],
  );

// -- ProjectLink events --

const emitProjectLinkCreated = (): PlanWrapperFn =>
  EXPORTABLE(
    (context, sideEffect, events, eventMeta): PlanWrapperFn =>
      (plan, _, fieldArgs) => {
        const $result = plan();
        const $input = fieldArgs.getRaw(["input", "projectLink"]);
        const $db = context().get("db");
        const $observer = context().get("observer");

        sideEffect(
          [$result, $input, $db, $observer],
          async ([result, input, db, observer]) => {
            if (!result) return;

            const { projectId, title } = input as InsertProjectLink;
            const linkId = (result as { id?: string })?.id;
            if (!linkId) return;

            const project = await db.query.projects.findFirst({
              where: (table, { eq }) => eq(table.id, projectId),
              columns: { organizationId: true },
            });
            if (!project) return;

            try {
              await events.emit({
                type: "backfeed.projectLink.created",
                data: {
                  projectLinkId: linkId,
                  projectId,
                  organizationId: project.organizationId,
                  ...eventMeta(observer, "projectLink", title),
                },
                organizationId: project.organizationId,
                subject: linkId,
              });
            } catch (error) {
              console.error(
                "[Events] Failed to emit projectLink.created:",
                error,
              );
            }
          },
        );

        return $result;
      },
    [context, sideEffect, events, eventMeta],
  );

const emitProjectLinkUpdated = (): PlanWrapperFn =>
  EXPORTABLE(
    (context, sideEffect, events, eventMeta): PlanWrapperFn =>
      (plan, _, fieldArgs) => {
        const $result = plan();
        const $linkId = fieldArgs.getRaw(["input", "rowId"]);
        const $db = context().get("db");
        const $observer = context().get("observer");

        sideEffect(
          [$result, $linkId, $db, $observer],
          async ([result, linkId, db, observer]) => {
            if (!result) return;

            const link = await db.query.projectLinks.findFirst({
              where: (table, { eq }) => eq(table.id, linkId as string),
              with: { project: { columns: { organizationId: true } } },
            });
            if (!link?.project) return;

            try {
              await events.emit({
                type: "backfeed.projectLink.updated",
                data: {
                  projectLinkId: linkId as string,
                  projectId: link.projectId,
                  organizationId: link.project.organizationId,
                  ...eventMeta(observer, "projectLink", link.title),
                },
                organizationId: link.project.organizationId,
                subject: linkId as string,
              });
            } catch (error) {
              console.error(
                "[Events] Failed to emit projectLink.updated:",
                error,
              );
            }
          },
        );

        return $result;
      },
    [context, sideEffect, events, eventMeta],
  );

const emitProjectLinkDeleted = (): PlanWrapperFn =>
  EXPORTABLE(
    (context, sideEffect, events, eventMeta): PlanWrapperFn =>
      (plan, _, fieldArgs) => {
        const $result = plan();
        const $linkId = fieldArgs.getRaw(["input", "rowId"]);
        const $db = context().get("db");
        const $observer = context().get("observer");

        sideEffect(
          [$result, $linkId, $db, $observer],
          async ([result, linkId, db, observer]) => {
            if (!result) return;

            const link = await db.query.projectLinks.findFirst({
              where: (table, { eq }) => eq(table.id, linkId as string),
              with: { project: { columns: { organizationId: true } } },
            });
            if (!link?.project) return;

            try {
              await events.emit({
                type: "backfeed.projectLink.deleted",
                data: {
                  projectLinkId: linkId as string,
                  projectId: link.projectId,
                  organizationId: link.project.organizationId,
                  ...eventMeta(observer, "projectLink", link.title),
                },
                organizationId: link.project.organizationId,
                subject: linkId as string,
              });
            } catch (error) {
              console.error(
                "[Events] Failed to emit projectLink.deleted:",
                error,
              );
            }
          },
        );

        return $result;
      },
    [context, sideEffect, events, eventMeta],
  );

// -- ProjectStatusConfig events --

const emitProjectStatusConfigCreated = (): PlanWrapperFn =>
  EXPORTABLE(
    (context, sideEffect, events, eventMeta): PlanWrapperFn =>
      (plan, _, fieldArgs) => {
        const $result = plan();
        const $input = fieldArgs.getRaw(["input", "projectStatusConfig"]);
        const $db = context().get("db");
        const $observer = context().get("observer");

        sideEffect(
          [$result, $input, $db, $observer],
          async ([result, input, db, observer]) => {
            if (!result) return;

            const { projectId } = input as InsertProjectStatusConfig;
            const configId = (result as { id?: string })?.id;
            if (!configId) return;

            const project = await db.query.projects.findFirst({
              where: (table, { eq }) => eq(table.id, projectId),
              columns: { organizationId: true },
            });
            if (!project) return;

            try {
              await events.emit({
                type: "backfeed.projectStatusConfig.created",
                data: {
                  projectStatusConfigId: configId,
                  projectId,
                  organizationId: project.organizationId,
                  ...eventMeta(observer, "projectStatusConfig"),
                },
                organizationId: project.organizationId,
                subject: configId,
              });
            } catch (error) {
              console.error(
                "[Events] Failed to emit projectStatusConfig.created:",
                error,
              );
            }
          },
        );

        return $result;
      },
    [context, sideEffect, events, eventMeta],
  );

const emitProjectStatusConfigUpdated = (): PlanWrapperFn =>
  EXPORTABLE(
    (context, sideEffect, events, eventMeta): PlanWrapperFn =>
      (plan, _, fieldArgs) => {
        const $result = plan();
        const $configId = fieldArgs.getRaw(["input", "rowId"]);
        const $db = context().get("db");
        const $observer = context().get("observer");

        sideEffect(
          [$result, $configId, $db, $observer],
          async ([result, configId, db, observer]) => {
            if (!result) return;

            const config = await db.query.projectStatusConfigs.findFirst({
              where: (table, { eq }) => eq(table.id, configId as string),
              with: { project: { columns: { organizationId: true } } },
            });
            if (!config?.project) return;

            try {
              await events.emit({
                type: "backfeed.projectStatusConfig.updated",
                data: {
                  projectStatusConfigId: configId as string,
                  projectId: config.projectId,
                  organizationId: config.project.organizationId,
                  ...eventMeta(observer, "projectStatusConfig"),
                },
                organizationId: config.project.organizationId,
                subject: configId as string,
              });
            } catch (error) {
              console.error(
                "[Events] Failed to emit projectStatusConfig.updated:",
                error,
              );
            }
          },
        );

        return $result;
      },
    [context, sideEffect, events, eventMeta],
  );

const emitProjectStatusConfigDeleted = (): PlanWrapperFn =>
  EXPORTABLE(
    (context, sideEffect, events, eventMeta): PlanWrapperFn =>
      (plan, _, fieldArgs) => {
        const $result = plan();
        const $configId = fieldArgs.getRaw(["input", "rowId"]);
        const $db = context().get("db");
        const $observer = context().get("observer");

        sideEffect(
          [$result, $configId, $db, $observer],
          async ([result, configId, db, observer]) => {
            if (!result) return;

            const config = await db.query.projectStatusConfigs.findFirst({
              where: (table, { eq }) => eq(table.id, configId as string),
              with: { project: { columns: { organizationId: true } } },
            });
            if (!config?.project) return;

            try {
              await events.emit({
                type: "backfeed.projectStatusConfig.deleted",
                data: {
                  projectStatusConfigId: configId as string,
                  projectId: config.projectId,
                  organizationId: config.project.organizationId,
                  ...eventMeta(observer, "projectStatusConfig"),
                },
                organizationId: config.project.organizationId,
                subject: configId as string,
              });
            } catch (error) {
              console.error(
                "[Events] Failed to emit projectStatusConfig.deleted:",
                error,
              );
            }
          },
        );

        return $result;
      },
    [context, sideEffect, events, eventMeta],
  );

// -- StatusTemplate events --

const emitStatusTemplateCreated = (): PlanWrapperFn =>
  EXPORTABLE(
    (context, sideEffect, events, eventMeta): PlanWrapperFn =>
      (plan, _, fieldArgs) => {
        const $result = plan();
        const $input = fieldArgs.getRaw(["input", "statusTemplate"]);
        const $observer = context().get("observer");

        sideEffect(
          [$result, $input, $observer],
          async ([result, input, observer]) => {
            if (!result) return;

            const { organizationId, name } = input as InsertStatusTemplate;
            const templateId = (result as { id?: string })?.id;
            if (!templateId) return;

            try {
              await events.emit({
                type: "backfeed.statusTemplate.created",
                data: {
                  statusTemplateId: templateId,
                  organizationId,
                  ...eventMeta(observer, "statusTemplate", name),
                },
                organizationId,
                subject: templateId,
              });
            } catch (error) {
              console.error(
                "[Events] Failed to emit statusTemplate.created:",
                error,
              );
            }
          },
        );

        return $result;
      },
    [context, sideEffect, events, eventMeta],
  );

const emitStatusTemplateUpdated = (): PlanWrapperFn =>
  EXPORTABLE(
    (context, sideEffect, events, eventMeta): PlanWrapperFn =>
      (plan, _, fieldArgs) => {
        const $result = plan();
        const $templateId = fieldArgs.getRaw(["input", "rowId"]);
        const $db = context().get("db");
        const $observer = context().get("observer");

        sideEffect(
          [$result, $templateId, $db, $observer],
          async ([result, templateId, db, observer]) => {
            if (!result) return;

            const template = await db.query.statusTemplates.findFirst({
              where: (table, { eq }) => eq(table.id, templateId as string),
              columns: { organizationId: true, name: true },
            });
            if (!template) return;

            try {
              await events.emit({
                type: "backfeed.statusTemplate.updated",
                data: {
                  statusTemplateId: templateId as string,
                  organizationId: template.organizationId,
                  ...eventMeta(observer, "statusTemplate", template.name),
                },
                organizationId: template.organizationId,
                subject: templateId as string,
              });
            } catch (error) {
              console.error(
                "[Events] Failed to emit statusTemplate.updated:",
                error,
              );
            }
          },
        );

        return $result;
      },
    [context, sideEffect, events, eventMeta],
  );

const emitStatusTemplateDeleted = (): PlanWrapperFn =>
  EXPORTABLE(
    (context, sideEffect, events, eventMeta): PlanWrapperFn =>
      (plan, _, fieldArgs) => {
        const $result = plan();
        const $templateId = fieldArgs.getRaw(["input", "rowId"]);
        const $db = context().get("db");
        const $observer = context().get("observer");

        sideEffect(
          [$result, $templateId, $db, $observer],
          async ([result, templateId, db, observer]) => {
            if (!result) return;

            const template = await db.query.statusTemplates.findFirst({
              where: (table, { eq }) => eq(table.id, templateId as string),
              columns: { organizationId: true, name: true },
            });
            if (!template) return;

            try {
              await events.emit({
                type: "backfeed.statusTemplate.deleted",
                data: {
                  statusTemplateId: templateId as string,
                  organizationId: template.organizationId,
                  ...eventMeta(observer, "statusTemplate", template.name),
                },
                organizationId: template.organizationId,
                subject: templateId as string,
              });
            } catch (error) {
              console.error(
                "[Events] Failed to emit statusTemplate.deleted:",
                error,
              );
            }
          },
        );

        return $result;
      },
    [context, sideEffect, events, eventMeta],
  );

/**
 * Event emission plugin for all Backfeed mutations.
 *
 * Emits CloudEvents-style events to Vortex after each successful mutation.
 * Errors are logged but never fail mutations (eventual consistency).
 */
const EventEmissionPlugin = wrapPlans({
  Mutation: {
    // Projects
    createProject: emitProjectCreated(),
    updateProject: emitProjectUpdated(),
    deleteProject: emitProjectDeleted(),
    // Posts
    createPost: emitPostCreated(),
    updatePost: emitPostUpdated(),
    deletePost: emitPostDeleted(),
    // Comments
    createComment: emitCommentCreated(),
    updateComment: emitCommentUpdated(),
    deleteComment: emitCommentDeleted(),
    // Votes
    createVote: emitVoteCreated(),
    updateVote: emitVoteUpdated(),
    deleteVote: emitVoteDeleted(),
    // Project links
    createProjectLink: emitProjectLinkCreated(),
    updateProjectLink: emitProjectLinkUpdated(),
    deleteProjectLink: emitProjectLinkDeleted(),
    // Project status configs
    createProjectStatusConfig: emitProjectStatusConfigCreated(),
    updateProjectStatusConfig: emitProjectStatusConfigUpdated(),
    deleteProjectStatusConfig: emitProjectStatusConfigDeleted(),
    // Status templates
    createStatusTemplate: emitStatusTemplateCreated(),
    updateStatusTemplate: emitStatusTemplateUpdated(),
    deleteStatusTemplate: emitStatusTemplateDeleted(),
  },
});

export default EventEmissionPlugin;
