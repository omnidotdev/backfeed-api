/**
 * Change Post Status Plugin
 *
 * Adds `changePostStatus`: move a post to a new status (or no status) with an
 * optional admin note, recorded atomically on the timeline. This is the
 * note-carrying counterpart to a plain `updatePost` status change; it keeps the
 * close-the-loop `backfeed.post.shipped` emission so switching the client onto
 * it loses no behavior.
 *
 * Requires admin on the post's organization (changing status is moderation).
 * The database write logic is the unit-tested core in `lib/feedback/changeStatus`.
 */

import { EXPORTABLE } from "graphile-export";
import { GraphQLError } from "graphql";
import { checkPermission } from "lib/authz";
import { changePostStatus, getPostRef } from "lib/feedback/changeStatus";
import { markPostShipped } from "lib/feedback/shipped";
import { events } from "lib/providers";
import { context, lambda } from "postgraphile/grafast";
import { gql, makeExtendSchemaPlugin } from "postgraphile/utils";

const ChangePostStatusPlugin = makeExtendSchemaPlugin(() => ({
  typeDefs: gql`
    input ChangePostStatusInput {
      postId: UUID!
      statusTemplateId: UUID
      note: String
    }

    type ChangePostStatusPayload {
      id: UUID!
      statusTemplateId: UUID
    }

    extend type Mutation {
      """
      Move a post to a status (or clear it) with an optional note, recorded on
      the status timeline. Admin-only.
      """
      changePostStatus(
        input: ChangePostStatusInput!
      ): ChangePostStatusPayload
    }
  `,
  plans: {
    Mutation: {
      changePostStatus: EXPORTABLE(
        (
          GraphQLError,
          changePostStatus,
          checkPermission,
          context,
          events,
          getPostRef,
          lambda,
          markPostShipped,
        ) =>
          // biome-ignore lint/suspicious/noExplicitAny: Grafast plan signature
          function plan(_$root: any, fieldArgs: any) {
            const $input = fieldArgs.get("input");
            const $observer = context().get("observer");
            const $db = context().get("db");

            return lambda(
              [$input, $observer, $db],
              // biome-ignore lint/suspicious/noExplicitAny: Grafast lambda values
              async (values: any) => {
                const [input, observer, db] = values;

                if (!observer) throw new GraphQLError("Unauthorized");

                const postRef = await getPostRef(db, input.postId);
                if (!postRef) throw new GraphQLError("Post not found");

                const allowed = await checkPermission(
                  observer.identityProviderId,
                  "organization",
                  postRef.organizationId,
                  "admin",
                );
                if (!allowed) {
                  throw new GraphQLError("Insufficient permissions");
                }

                await changePostStatus(db, {
                  postId: input.postId,
                  statusTemplateId: input.statusTemplateId ?? null,
                  userId: observer.id,
                  note: input.note,
                });

                // close-the-loop: emit exactly once when the post first ships.
                // Best-effort, never fatal (mirrors PostShipped on updatePost).
                try {
                  const shipped = await markPostShipped(db, input.postId);
                  if (shipped) {
                    await events.emit({
                      type: "backfeed.post.shipped",
                      data: {
                        postId: shipped.postId,
                        projectId: shipped.projectId,
                        organizationId: shipped.organizationId,
                        title: shipped.title,
                        reporterUserIds: shipped.reporterUserIds,
                      },
                      organizationId: shipped.organizationId,
                      subject: shipped.postId,
                    });
                  }
                } catch (error) {
                  console.error(
                    "[ChangePostStatus] Failed to emit post.shipped:",
                    error,
                  );
                }

                return {
                  id: input.postId,
                  statusTemplateId: input.statusTemplateId ?? null,
                };
              },
              false,
            );
          },
        [
          GraphQLError,
          changePostStatus,
          checkPermission,
          context,
          events,
          getPostRef,
          lambda,
          markPostShipped,
        ],
      ),
    },
  },
}));

export default ChangePostStatusPlugin;
