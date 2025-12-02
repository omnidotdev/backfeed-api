import { EXPORTABLE } from "graphile-export/helpers";
import { context, sideEffect } from "postgraphile/grafast";
import { wrapPlans } from "postgraphile/utils";

import type { InsertPostStatus } from "lib/drizzle/schema";
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

          let projectId: string;

          if (scope === "create") {
            projectId = (input as InsertPostStatus).projectId;
          } else {
            const postStatus = await db.query.postStatuses.findFirst({
              where: (table, { eq }) => eq(table.id, input),
            });

            if (!postStatus) throw new Error("Post status not found");

            projectId = postStatus.projectId;
          }

          const project = await db.query.projects.findFirst({
            where: (table, { eq }) => eq(table.id, projectId),
            with: {
              organization: {
                with: {
                  members: {
                    where: (table, { eq }) => eq(table.userId, observer.id),
                  },
                },
              },
            },
          });

          if (!project) throw new Error("Project not found");

          // Allow admins and owners to create, update and delete post statuses
          if (
            !project.organization.members.length ||
            project.organization.members[0].role === "member"
          ) {
            throw new Error("Insufficient permissions");
          }
        });

        return plan();
      },
    [context, sideEffect, propName, scope],
  );

/**
 * Plugin that handles API access for post status table mutations.
 */
const PostStatusRBACPlugin = wrapPlans({
  Mutation: {
    createPostStatus: validatePermissions("postStatus", "create"),
    updatePostStatus: validatePermissions("rowId", "update"),
    deletePostStatus: validatePermissions("rowId", "delete"),
  },
});

export default PostStatusRBACPlugin;
