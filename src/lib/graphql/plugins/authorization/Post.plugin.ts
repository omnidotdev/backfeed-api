import { EXPORTABLE } from "graphile-export/helpers";
import { context, sideEffect } from "postgraphile/grafast";
import { wrapPlans } from "postgraphile/utils";

import { FEATURE_KEYS, billingBypassSlugs, isWithinLimit } from "./constants";

import type { InsertPost, SelectWorkspace } from "lib/db/schema";
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
            const post = input as InsertPost;

            const project = await db.query.projects.findFirst({
              where: (table, { eq }) => eq(table.id, post.projectId),
              with: {
                workspace: true,
                posts: {
                  columns: {
                    userId: true,
                  },
                },
              },
            });

            if (!project) throw new Error("Project not found");

            // Check unique feedback users limit
            const uniqueUsers = [
              ...new Set(project.posts.map((p) => p.userId)),
            ];
            const currentUniqueCount = uniqueUsers.includes(observer.id)
              ? uniqueUsers.length
              : uniqueUsers.length + 1;

            const withinLimit = await isWithinLimit(
              project.workspace as {
                id: string;
                tier: SelectWorkspace["tier"];
                slug: string;
              },
              FEATURE_KEYS.MAX_FEEDBACK_USERS,
              currentUniqueCount - 1, // isWithinLimit checks currentCount < limit
              billingBypassSlugs,
            );

            if (!withinLimit && !uniqueUsers.includes(observer.id)) {
              throw new Error(
                "Maximum number of unique users providing feedback has been reached",
              );
            }
          } else {
            const post = await db.query.posts.findFirst({
              where: (table, { eq }) => eq(table.id, input),
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
            });

            if (observer.id !== post?.userId) {
              // allow admins and owners to update and delete posts
              if (
                !post?.project.workspace.members.length ||
                post.project.workspace.members[0].role === "member"
              )
                throw new Error("Insufficient permissions");
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
 * Authorization plugin for posts.
 */
const PostPlugin = wrapPlans({
  Mutation: {
    createPost: validatePermissions("post", "create"),
    updatePost: validatePermissions("rowId", "update"),
    deletePost: validatePermissions("rowId", "delete"),
  },
});

export default PostPlugin;
