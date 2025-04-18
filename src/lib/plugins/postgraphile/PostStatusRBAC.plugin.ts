import { and, eq } from "drizzle-orm";
import { EXPORTABLE } from "graphile-export/helpers";
import { context, sideEffect } from "postgraphile/grafast";
import { makeWrapPlansPlugin } from "postgraphile/utils";

import * as dbSchema from "lib/drizzle/schema";

import type { InsertPostStatus } from "lib/drizzle/schema";
import type { GraphQLContext } from "lib/graphql";
import type { ExecutableStep, FieldArgs } from "postgraphile/grafast";

type MutationScope = "create" | "update" | "delete";

const validatePermissions = (propName: string, scope: MutationScope) =>
  EXPORTABLE(
    (and, eq, dbSchema, context, sideEffect, propName, scope) =>
      // biome-ignore lint/suspicious/noExplicitAny: SmartFieldPlanResolver is not an exported type
      (plan: any, _: ExecutableStep, fieldArgs: FieldArgs) => {
        const $postStatus = fieldArgs.getRaw(["input", propName]);
        const $currentUser = context<GraphQLContext>().get("currentUser");
        const $db = context<GraphQLContext>().get("db");

        sideEffect(
          [$postStatus, $currentUser, $db],
          async ([postStatus, currentUser, db]) => {
            if (!currentUser) {
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
                  eq(members.userId, currentUser.id),
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
const PostStatusRBACPlugin = makeWrapPlansPlugin({
  Mutation: {
    createPostStatus: validatePermissions("postStatus", "create"),
    updatePostStatus: validatePermissions("rowId", "update"),
    deletePostStatus: validatePermissions("rowId", "delete"),
  },
});

export default PostStatusRBACPlugin;
