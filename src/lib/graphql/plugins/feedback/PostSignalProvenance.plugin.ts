/**
 * Post Signal Provenance Plugin
 *
 * Records a provenance signal whenever a post is created in the app, so the
 * signal table is the unified record of all feedback inputs. Mirrors the
 * organization lookup used by the event-emission plugin.
 *
 * Errors are logged but never fail mutations (eventual consistency).
 */

import { EXPORTABLE } from "graphile-export";
import { signals } from "lib/db/schema";
import { buildPostProvenanceSignal } from "lib/feedback/signal";
import { context, sideEffect } from "postgraphile/grafast";
import { wrapPlans } from "postgraphile/utils";

import type { InsertPost } from "lib/db/schema";
import type { PlanWrapperFn } from "postgraphile/utils";

const createProvenanceSignal = (): PlanWrapperFn =>
  EXPORTABLE(
    (buildPostProvenanceSignal, context, sideEffect, signals): PlanWrapperFn =>
      (plan, _, fieldArgs) => {
        const $result = plan();
        const $input = fieldArgs.getRaw(["input", "post"]);
        const $db = context().get("db");

        sideEffect([$result, $input, $db], async ([result, input, db]) => {
          if (!result) return;

          const postId = (result as { id?: string })?.id;
          if (!postId) return;

          const { projectId, userId, title, description } = input as InsertPost;

          const project = await db.query.projects.findFirst({
            where: (table, { eq }) => eq(table.id, projectId),
            columns: { organizationId: true },
          });
          if (!project) return;

          try {
            await db.insert(signals).values(
              buildPostProvenanceSignal({
                postId,
                projectId,
                organizationId: project.organizationId,
                userId,
                title,
                description,
              }),
            );
          } catch (error) {
            console.error(
              "[Signal Provenance] Failed to record provenance signal:",
              error,
            );
          }
        });

        return $result;
      },
    [buildPostProvenanceSignal, context, sideEffect, signals],
  );

/**
 * Provenance plugin for posts.
 *
 * - Create: records a published "widget" feedback signal linked to the post
 */
const PostSignalProvenancePlugin = wrapPlans({
  Mutation: {
    createPost: createProvenanceSignal(),
  },
});

export default PostSignalProvenancePlugin;
