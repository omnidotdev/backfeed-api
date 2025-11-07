import { and, eq } from "drizzle-orm";
import { EXPORTABLE } from "graphile-export/helpers";
import * as dbSchema from "lib/drizzle/schema";
import { context, sideEffect } from "postgraphile/grafast";
import { wrapPlans } from "postgraphile/utils";

import type { InsertPostStatus } from "lib/drizzle/schema";
import type { PlanWrapperFn } from "postgraphile/utils";

type MutationScope = "create" | "update" | "delete";

const validatePermissions = (propName: string, scope: MutationScope) =>
  EXPORTABLE(
    (and, eq, dbSchema, context, sideEffect, propName, scope): PlanWrapperFn =>
      (plan, _, fieldArgs) => {
        const $postStatus = fieldArgs.getRaw(["input", propName]);
        const $observer = context().get("observer");
        const $db = context().get("db");

        sideEffect(
          [$postStatus, $observer, $db],
          async ([postStatus, observer, db]) => {
            if (!observer) {
              throw new Error("Unauthorized");
            }

            const { members, projects, postStatuses } = dbSchema;

            let projectId: string;

            if (scope === "create") {
              projectId = (postStatus as InsertPostStatus).projectId;
            } else {
              const [currentPostStatus] = await db
                .select()
                .from(postStatuses)
                .where(eq(postStatuses.id, postStatus as string));

              projectId = currentPostStatus.projectId;
            }

            const [project] = await db
              .select({
                organizationId: projects.organizationId,
              })
              .from(projects)
              .where(eq(projects.id, projectId));

            const [userRole] = await db
              .select({ role: members.role })
              .from(members)
              .where(
                and(
                  eq(members.userId, observer.id),
                  eq(members.organizationId, project.organizationId),
                ),
              );

            // Allow admins and owners to create, update and delete post statuses
            if (!userRole || userRole.role === "member") {
              throw new Error("Insufficient permissions");
            }
          },
        );

        return plan();
      },
    [and, eq, dbSchema, context, sideEffect, propName, scope],
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
