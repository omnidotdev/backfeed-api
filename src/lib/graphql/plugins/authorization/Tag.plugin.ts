import { EXPORTABLE } from "graphile-export/helpers";
import { checkPermission } from "lib/authz";
import { context, sideEffect } from "postgraphile/grafast";
import { wrapPlans } from "postgraphile/utils";

import type { InsertTag } from "lib/db/schema";
import type { PlanWrapperFn } from "postgraphile/utils";
import type { MutationScope } from "./types";

/**
 * Validate tag permissions via PDP.
 *
 * - Create: Admin+ on organization
 * - Update: Admin+ on organization
 * - Delete: Admin+ on organization
 */
const validateTagPermissions = (propName: string, scope: MutationScope) =>
  EXPORTABLE(
    (context, sideEffect, checkPermission, propName, scope): PlanWrapperFn =>
      (plan, _, fieldArgs) => {
        const $input = fieldArgs.getRaw(["input", propName]);
        const $observer = context().get("observer");
        const $db = context().get("db");

        sideEffect([$input, $observer, $db], async ([input, observer, db]) => {
          if (!observer) throw new Error("Unauthorized");

          let organizationId: string;

          if (scope === "create") {
            const projectId = (input as InsertTag).projectId;

            const project = await db.query.projects.findFirst({
              where: (table, { eq }) => eq(table.id, projectId),
            });

            if (!project) throw new Error("Project not found");

            organizationId = project.organizationId;
          } else {
            const tag = await db.query.tags.findFirst({
              where: (table, { eq }) => eq(table.id, input),
              with: {
                project: true,
              },
            });

            if (!tag) throw new Error("Tag not found");

            organizationId = tag.project.organizationId;
          }

          // Check admin permission via PDP on organization
          const allowed = await checkPermission(
            observer.identityProviderId,
            "organization",
            organizationId,
            "admin",
          );
          if (!allowed) throw new Error("Insufficient permissions");
        });

        return plan();
      },
    [context, sideEffect, checkPermission, propName, scope],
  );

/**
 * Validate post tag assignment permissions.
 *
 * Assigning or unassigning a tag is allowed for any authenticated user.
 * The tag and post must belong to the same project.
 */
const validatePostTagPermissions = (propName: string, scope: MutationScope) =>
  EXPORTABLE(
    (context, sideEffect, propName, scope): PlanWrapperFn =>
      (plan, _, fieldArgs) => {
        const $input = fieldArgs.getRaw(["input", propName]);
        const $observer = context().get("observer");
        const $db = context().get("db");

        sideEffect([$input, $observer, $db], async ([input, observer, db]) => {
          if (!observer) throw new Error("Unauthorized");

          if (scope === "create") {
            const { postId, tagId } = input as {
              postId: string;
              tagId: string;
            };

            const post = await db.query.posts.findFirst({
              where: (table, { eq }) => eq(table.id, postId),
            });
            if (!post) throw new Error("Post not found");

            const tag = await db.query.tags.findFirst({
              where: (table, { eq }) => eq(table.id, tagId),
            });
            if (!tag) throw new Error("Tag not found");

            // Tag and post must belong to the same project
            if (tag.projectId !== post.projectId) {
              throw new Error("Tag does not belong to the post's project");
            }
          } else {
            const postTag = await db.query.postTags.findFirst({
              where: (table, { eq }) => eq(table.id, input),
            });
            if (!postTag) throw new Error("Post tag not found");
          }
        });

        return plan();
      },
    [context, sideEffect, propName, scope],
  );

/**
 * Authorization plugin for tags and post tag assignments.
 *
 * Tag management (create/update/delete) requires org admin.
 * Tag assignment (createPostTag/deletePostTag) is open to any authenticated user.
 */
const TagPlugin = wrapPlans({
  Mutation: {
    createTag: validateTagPermissions("tag", "create"),
    updateTag: validateTagPermissions("rowId", "update"),
    deleteTag: validateTagPermissions("rowId", "delete"),
    createPostTag: validatePostTagPermissions("postTag", "create"),
    deletePostTag: validatePostTagPermissions("rowId", "delete"),
  },
});

export default TagPlugin;
