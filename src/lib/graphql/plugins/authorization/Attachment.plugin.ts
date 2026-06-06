import { EXPORTABLE } from "graphile-export/helpers";
import { checkPermission } from "lib/authz";
import { context, sideEffect } from "postgraphile/grafast";
import { wrapPlans } from "postgraphile/utils";

import type { InsertAttachment } from "lib/db/schema";
import type { PlanWrapperFn } from "postgraphile/utils";
import type { MutationScope } from "./types";

/**
 * Validate attachment permissions via PDP.
 *
 * - Create: Post author or admin+ on the organization
 * - Update: Uploader or admin+ on the organization
 * - Delete: Uploader or admin+ on the organization
 */
const validatePermissions = (propName: string, scope: MutationScope) =>
  EXPORTABLE(
    (context, sideEffect, checkPermission, propName, scope): PlanWrapperFn =>
      (plan, _, fieldArgs) => {
        const $input = fieldArgs.getRaw(["input", propName]);
        const $observer = context().get("observer");
        const $db = context().get("db");

        sideEffect([$input, $observer, $db], async ([input, observer, db]) => {
          if (!observer) throw new Error("Unauthorized");

          if (scope === "create") {
            const postId = (input as InsertAttachment).postId;

            const post = await db.query.posts.findFirst({
              where: (table, { eq }) => eq(table.id, postId),
              with: {
                project: true,
              },
            });

            if (!post) throw new Error("Post does not exist");

            // Post author can attach to their own post
            if (post.userId !== observer.id) {
              const allowed = await checkPermission(
                observer.identityProviderId,
                "organization",
                post.project.organizationId,
                "admin",
              );
              if (!allowed) throw new Error("Unauthorized");
            }
          } else {
            const attachment = await db.query.attachments.findFirst({
              where: (table, { eq }) => eq(table.id, input),
              with: {
                post: {
                  with: {
                    project: true,
                  },
                },
              },
            });

            if (!attachment) throw new Error("Attachment not found");

            // Uploader can always modify their own attachments
            if (attachment.userId !== observer.id) {
              const allowed = await checkPermission(
                observer.identityProviderId,
                "organization",
                attachment.post.project.organizationId,
                "admin",
              );
              if (!allowed) throw new Error("Unauthorized");
            }
          }
        });

        return plan();
      },
    [context, sideEffect, checkPermission, propName, scope],
  );

/**
 * Authorization plugin for attachments.
 *
 * - Create: Post author or admin+
 * - Update: Uploader or admin+
 * - Delete: Uploader or admin+
 */
const AttachmentPlugin = wrapPlans({
  Mutation: {
    createAttachment: validatePermissions("attachment", "create"),
    updateAttachment: validatePermissions("rowId", "update"),
    deleteAttachment: validatePermissions("rowId", "delete"),
  },
});

export default AttachmentPlugin;
