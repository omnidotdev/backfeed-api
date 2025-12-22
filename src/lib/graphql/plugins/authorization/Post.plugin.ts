import { EXPORTABLE } from "graphile-export/helpers";
import { context, sideEffect } from "postgraphile/grafast";
import { wrapPlans } from "postgraphile/utils";

import type { InsertPost } from "lib/db/schema";
import type { PlanWrapperFn } from "postgraphile/utils";
import type { MutationScope } from "./types";

// TODO: discuss handling field level permissions. For example, a user should not be able to update the `statusId` field for a post even if they are the author. That should be reserved for admins and owners.

const validatePermissions = (propName: string, scope: MutationScope) =>
  EXPORTABLE(
    (context, sideEffect, propName, scope): PlanWrapperFn =>
      (plan, _, fieldArgs) => {
        const $input = fieldArgs.getRaw(["input", propName]);
        const $observer = context().get("observer");
        const $db = context().get("db");

        sideEffect([$input, $observer, $db], async ([input, observer, db]) => {
          if (!observer) throw new Error("Unauthorized");

          const MAX_FREE_TIER_FEEDBACK_UNIQUE_USERS = 15;

          if (scope === "create") {
            const post = input as InsertPost;

            const project = await db.query.projects.findFirst({
              where: (table, { eq }) => eq(table.id, post.projectId),
              with: {
                organization: true,
                posts: {
                  columns: {
                    userId: true,
                  },
                },
              },
            });

            if (!project) throw new Error("Project not found");

            // enforce tier limits for free organizations
            if (project.organization.tier === "free") {
              const uniqueUsers = [
                ...new Set(project.posts.map((p) => p.userId)),
              ];

              if (
                uniqueUsers.length >= MAX_FREE_TIER_FEEDBACK_UNIQUE_USERS &&
                !uniqueUsers.includes(observer.id)
              )
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
            });

            if (observer.id !== post?.userId) {
              // allow admins and owners to update and delete posts
              if (
                !post?.project.organization.members.length ||
                post.project.organization.members[0].role === "member"
              )
                throw new Error("Insufficient permissions");
            }
          }
        });

        return plan();
      },
    [context, sideEffect, propName, scope],
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
