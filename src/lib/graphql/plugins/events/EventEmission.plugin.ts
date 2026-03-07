/**
 * Event Emission Plugin
 *
 * Emits Vortex events after successful Backfeed mutations.
 * Calls plan() first to capture the mutation result, then uses sideEffect
 * to emit events only after the mutation completes successfully.
 * Errors are logged but never fail mutations (eventual consistency).
 */

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
    (context, sideEffect, events): PlanWrapperFn =>
      (plan, _, fieldArgs) => {
        const $result = plan();
        const $input = fieldArgs.getRaw(["input", "project"]);

        sideEffect([$result, $input], async ([result, input]) => {
          if (!result) return;

          const { organizationId } = input as InsertProject;
          const projectId = (result as { id?: string })?.id;
          if (!projectId) return;

          try {
            await events.emit({
              type: "backfeed.project.created",
              data: { projectId, organizationId },
              organizationId,
              subject: projectId,
            });
          } catch (error) {
            console.error("[Events] Failed to emit project.created:", error);
          }
        });

        return $result;
      },
    [context, sideEffect, events],
  );

const emitProjectUpdated = (): PlanWrapperFn =>
  EXPORTABLE(
    (context, sideEffect, events): PlanWrapperFn =>
      (plan, _, fieldArgs) => {
        const $result = plan();
        const $projectId = fieldArgs.getRaw(["input", "rowId"]);
        const $db = context().get("db");

        sideEffect(
          [$result, $projectId, $db],
          async ([result, projectId, db]) => {
            if (!result) return;

            const project = await db.query.projects.findFirst({
              where: (table, { eq }) => eq(table.id, projectId as string),
              columns: { organizationId: true },
            });
            if (!project) return;

            try {
              await events.emit({
                type: "backfeed.project.updated",
                data: {
                  projectId: projectId as string,
                  organizationId: project.organizationId,
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
    [context, sideEffect, events],
  );

const emitProjectDeleted = (): PlanWrapperFn =>
  EXPORTABLE(
    (context, sideEffect, events): PlanWrapperFn =>
      (plan, _, fieldArgs) => {
        const $result = plan();
        const $projectId = fieldArgs.getRaw(["input", "rowId"]);
        const $db = context().get("db");

        sideEffect(
          [$result, $projectId, $db],
          async ([result, projectId, db]) => {
            if (!result) return;

            const project = await db.query.projects.findFirst({
              where: (table, { eq }) => eq(table.id, projectId as string),
              columns: { organizationId: true },
            });
            if (!project) return;

            try {
              await events.emit({
                type: "backfeed.project.deleted",
                data: {
                  projectId: projectId as string,
                  organizationId: project.organizationId,
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
    [context, sideEffect, events],
  );

// -- Post events --

const emitPostCreated = (): PlanWrapperFn =>
  EXPORTABLE(
    (context, sideEffect, events): PlanWrapperFn =>
      (plan, _, fieldArgs) => {
        const $result = plan();
        const $input = fieldArgs.getRaw(["input", "post"]);
        const $db = context().get("db");

        sideEffect([$result, $input, $db], async ([result, input, db]) => {
          if (!result) return;

          const { projectId } = input as InsertPost;
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
              },
              organizationId: project.organizationId,
              subject: postId,
            });
          } catch (error) {
            console.error("[Events] Failed to emit post.created:", error);
          }
        });

        return $result;
      },
    [context, sideEffect, events],
  );

const emitPostUpdated = (): PlanWrapperFn =>
  EXPORTABLE(
    (context, sideEffect, events): PlanWrapperFn =>
      (plan, _, fieldArgs) => {
        const $result = plan();
        const $postId = fieldArgs.getRaw(["input", "rowId"]);
        const $db = context().get("db");

        sideEffect([$result, $postId, $db], async ([result, postId, db]) => {
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
              },
              organizationId: post.project.organizationId,
              subject: postId as string,
            });
          } catch (error) {
            console.error("[Events] Failed to emit post.updated:", error);
          }
        });

        return $result;
      },
    [context, sideEffect, events],
  );

const emitPostDeleted = (): PlanWrapperFn =>
  EXPORTABLE(
    (context, sideEffect, events): PlanWrapperFn =>
      (plan, _, fieldArgs) => {
        const $result = plan();
        const $postId = fieldArgs.getRaw(["input", "rowId"]);
        const $db = context().get("db");

        sideEffect([$result, $postId, $db], async ([result, postId, db]) => {
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
              },
              organizationId: post.project.organizationId,
              subject: postId as string,
            });
          } catch (error) {
            console.error("[Events] Failed to emit post.deleted:", error);
          }
        });

        return $result;
      },
    [context, sideEffect, events],
  );

// -- Comment events --

const emitCommentCreated = (): PlanWrapperFn =>
  EXPORTABLE(
    (context, sideEffect, events): PlanWrapperFn =>
      (plan, _, fieldArgs) => {
        const $result = plan();
        const $input = fieldArgs.getRaw(["input", "comment"]);
        const $db = context().get("db");

        sideEffect([$result, $input, $db], async ([result, input, db]) => {
          if (!result) return;

          const { postId } = input as InsertComment;
          const commentId = (result as { id?: string })?.id;
          if (!commentId) return;

          const post = await db.query.posts.findFirst({
            where: (table, { eq }) => eq(table.id, postId),
            with: { project: { columns: { organizationId: true } } },
          });
          if (!post?.project) return;

          try {
            await events.emit({
              type: "backfeed.comment.created",
              data: {
                commentId,
                postId,
                projectId: post.projectId,
                organizationId: post.project.organizationId,
              },
              organizationId: post.project.organizationId,
              subject: commentId,
            });
          } catch (error) {
            console.error("[Events] Failed to emit comment.created:", error);
          }
        });

        return $result;
      },
    [context, sideEffect, events],
  );

const emitCommentUpdated = (): PlanWrapperFn =>
  EXPORTABLE(
    (context, sideEffect, events): PlanWrapperFn =>
      (plan, _, fieldArgs) => {
        const $result = plan();
        const $commentId = fieldArgs.getRaw(["input", "rowId"]);
        const $db = context().get("db");

        sideEffect(
          [$result, $commentId, $db],
          async ([result, commentId, db]) => {
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
    [context, sideEffect, events],
  );

const emitCommentDeleted = (): PlanWrapperFn =>
  EXPORTABLE(
    (context, sideEffect, events): PlanWrapperFn =>
      (plan, _, fieldArgs) => {
        const $result = plan();
        const $commentId = fieldArgs.getRaw(["input", "rowId"]);
        const $db = context().get("db");

        sideEffect(
          [$result, $commentId, $db],
          async ([result, commentId, db]) => {
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
    [context, sideEffect, events],
  );

// -- Vote events --

const emitVoteCreated = (): PlanWrapperFn =>
  EXPORTABLE(
    (context, sideEffect, events): PlanWrapperFn =>
      (plan, _, fieldArgs) => {
        const $result = plan();
        const $input = fieldArgs.getRaw(["input", "vote"]);
        const $db = context().get("db");

        sideEffect([$result, $input, $db], async ([result, input, db]) => {
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
              },
              organizationId: post.project.organizationId,
              subject: voteId,
            });
          } catch (error) {
            console.error("[Events] Failed to emit vote.created:", error);
          }
        });

        return $result;
      },
    [context, sideEffect, events],
  );

const emitVoteUpdated = (): PlanWrapperFn =>
  EXPORTABLE(
    (context, sideEffect, events): PlanWrapperFn =>
      (plan, _, fieldArgs) => {
        const $result = plan();
        const $voteId = fieldArgs.getRaw(["input", "rowId"]);
        const $db = context().get("db");

        sideEffect([$result, $voteId, $db], async ([result, voteId, db]) => {
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
              },
              organizationId: vote.post.project.organizationId,
              subject: voteId as string,
            });
          } catch (error) {
            console.error("[Events] Failed to emit vote.updated:", error);
          }
        });

        return $result;
      },
    [context, sideEffect, events],
  );

const emitVoteDeleted = (): PlanWrapperFn =>
  EXPORTABLE(
    (context, sideEffect, events): PlanWrapperFn =>
      (plan, _, fieldArgs) => {
        const $result = plan();
        const $voteId = fieldArgs.getRaw(["input", "rowId"]);
        const $db = context().get("db");

        sideEffect([$result, $voteId, $db], async ([result, voteId, db]) => {
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
              },
              organizationId: vote.post.project.organizationId,
              subject: voteId as string,
            });
          } catch (error) {
            console.error("[Events] Failed to emit vote.deleted:", error);
          }
        });

        return $result;
      },
    [context, sideEffect, events],
  );

// -- ProjectLink events --

const emitProjectLinkCreated = (): PlanWrapperFn =>
  EXPORTABLE(
    (context, sideEffect, events): PlanWrapperFn =>
      (plan, _, fieldArgs) => {
        const $result = plan();
        const $input = fieldArgs.getRaw(["input", "projectLink"]);
        const $db = context().get("db");

        sideEffect([$result, $input, $db], async ([result, input, db]) => {
          if (!result) return;

          const { projectId } = input as InsertProjectLink;
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
        });

        return $result;
      },
    [context, sideEffect, events],
  );

const emitProjectLinkUpdated = (): PlanWrapperFn =>
  EXPORTABLE(
    (context, sideEffect, events): PlanWrapperFn =>
      (plan, _, fieldArgs) => {
        const $result = plan();
        const $linkId = fieldArgs.getRaw(["input", "rowId"]);
        const $db = context().get("db");

        sideEffect([$result, $linkId, $db], async ([result, linkId, db]) => {
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
        });

        return $result;
      },
    [context, sideEffect, events],
  );

const emitProjectLinkDeleted = (): PlanWrapperFn =>
  EXPORTABLE(
    (context, sideEffect, events): PlanWrapperFn =>
      (plan, _, fieldArgs) => {
        const $result = plan();
        const $linkId = fieldArgs.getRaw(["input", "rowId"]);
        const $db = context().get("db");

        sideEffect([$result, $linkId, $db], async ([result, linkId, db]) => {
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
        });

        return $result;
      },
    [context, sideEffect, events],
  );

// -- ProjectStatusConfig events --

const emitProjectStatusConfigCreated = (): PlanWrapperFn =>
  EXPORTABLE(
    (context, sideEffect, events): PlanWrapperFn =>
      (plan, _, fieldArgs) => {
        const $result = plan();
        const $input = fieldArgs.getRaw(["input", "projectStatusConfig"]);
        const $db = context().get("db");

        sideEffect([$result, $input, $db], async ([result, input, db]) => {
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
        });

        return $result;
      },
    [context, sideEffect, events],
  );

const emitProjectStatusConfigUpdated = (): PlanWrapperFn =>
  EXPORTABLE(
    (context, sideEffect, events): PlanWrapperFn =>
      (plan, _, fieldArgs) => {
        const $result = plan();
        const $configId = fieldArgs.getRaw(["input", "rowId"]);
        const $db = context().get("db");

        sideEffect(
          [$result, $configId, $db],
          async ([result, configId, db]) => {
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
    [context, sideEffect, events],
  );

const emitProjectStatusConfigDeleted = (): PlanWrapperFn =>
  EXPORTABLE(
    (context, sideEffect, events): PlanWrapperFn =>
      (plan, _, fieldArgs) => {
        const $result = plan();
        const $configId = fieldArgs.getRaw(["input", "rowId"]);
        const $db = context().get("db");

        sideEffect(
          [$result, $configId, $db],
          async ([result, configId, db]) => {
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
    [context, sideEffect, events],
  );

// -- StatusTemplate events --

const emitStatusTemplateCreated = (): PlanWrapperFn =>
  EXPORTABLE(
    (_context, sideEffect, events): PlanWrapperFn =>
      (plan, _, fieldArgs) => {
        const $result = plan();
        const $input = fieldArgs.getRaw(["input", "statusTemplate"]);

        sideEffect([$result, $input], async ([result, input]) => {
          if (!result) return;

          const { organizationId } = input as InsertStatusTemplate;
          const templateId = (result as { id?: string })?.id;
          if (!templateId) return;

          try {
            await events.emit({
              type: "backfeed.statusTemplate.created",
              data: { statusTemplateId: templateId, organizationId },
              organizationId,
              subject: templateId,
            });
          } catch (error) {
            console.error(
              "[Events] Failed to emit statusTemplate.created:",
              error,
            );
          }
        });

        return $result;
      },
    [context, sideEffect, events],
  );

const emitStatusTemplateUpdated = (): PlanWrapperFn =>
  EXPORTABLE(
    (context, sideEffect, events): PlanWrapperFn =>
      (plan, _, fieldArgs) => {
        const $result = plan();
        const $templateId = fieldArgs.getRaw(["input", "rowId"]);
        const $db = context().get("db");

        sideEffect(
          [$result, $templateId, $db],
          async ([result, templateId, db]) => {
            if (!result) return;

            const template = await db.query.statusTemplates.findFirst({
              where: (table, { eq }) => eq(table.id, templateId as string),
              columns: { organizationId: true },
            });
            if (!template) return;

            try {
              await events.emit({
                type: "backfeed.statusTemplate.updated",
                data: {
                  statusTemplateId: templateId as string,
                  organizationId: template.organizationId,
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
    [context, sideEffect, events],
  );

const emitStatusTemplateDeleted = (): PlanWrapperFn =>
  EXPORTABLE(
    (context, sideEffect, events): PlanWrapperFn =>
      (plan, _, fieldArgs) => {
        const $result = plan();
        const $templateId = fieldArgs.getRaw(["input", "rowId"]);
        const $db = context().get("db");

        sideEffect(
          [$result, $templateId, $db],
          async ([result, templateId, db]) => {
            if (!result) return;

            const template = await db.query.statusTemplates.findFirst({
              where: (table, { eq }) => eq(table.id, templateId as string),
              columns: { organizationId: true },
            });
            if (!template) return;

            try {
              await events.emit({
                type: "backfeed.statusTemplate.deleted",
                data: {
                  statusTemplateId: templateId as string,
                  organizationId: template.organizationId,
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
    [context, sideEffect, events],
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
