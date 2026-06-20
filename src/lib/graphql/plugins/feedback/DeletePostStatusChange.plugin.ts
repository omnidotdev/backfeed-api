/**
 * Delete Post Status Change Plugin
 *
 * Adds `deletePostStatusChange`: remove a single entry from a post's status
 * timeline. This is the admin counterpart to the append-only history written by
 * ChangePostStatus/PostStatusHistory; the raw auto-CRUD delete stays disabled
 * (see SmartTag.plugin) so removal can only happen through this authorized path.
 *
 * Requires admin on the post's organization (curating history is moderation).
 * The post's current status (`posts.statusTemplateId`) is intentionally NOT
 * changed: removing a log entry only removes the entry, mirroring comment
 * deletion. To change the status, use `changePostStatus`.
 *
 * The database logic is the unit-tested core in `lib/feedback/statusHistory`.
 */

import { EXPORTABLE } from "graphile-export";
import { GraphQLError } from "graphql";
import { checkPermission } from "lib/authz";
import { getPostRef } from "lib/feedback/changeStatus";
import {
  deletePostStatusChange,
  getStatusChangePostId,
} from "lib/feedback/statusHistory";
import { context, lambda } from "postgraphile/grafast";
import { gql, makeExtendSchemaPlugin } from "postgraphile/utils";

const DeletePostStatusChangePlugin = makeExtendSchemaPlugin(() => ({
  typeDefs: gql`
    input DeletePostStatusChangeInput {
      rowId: UUID!
    }

    type DeletePostStatusChangePayload {
      id: UUID!
    }

    extend type Mutation {
      """
      Remove a single entry from a post's status timeline. Admin-only. Does not
      change the post's current status (use changePostStatus for that).
      """
      deletePostStatusChange(
        input: DeletePostStatusChangeInput!
      ): DeletePostStatusChangePayload
    }
  `,
  plans: {
    Mutation: {
      deletePostStatusChange: EXPORTABLE(
        (
          GraphQLError,
          checkPermission,
          context,
          deletePostStatusChange,
          getPostRef,
          getStatusChangePostId,
          lambda,
        ) =>
          // biome-ignore lint/suspicious/noExplicitAny: Grafast plan signature
          function plan(_$root: any, fieldArgs: any) {
            const $input = fieldArgs.getRaw("input");
            const $observer = context().get("observer");
            const $db = context().get("db");

            return lambda(
              [$input, $observer, $db],
              // biome-ignore lint/suspicious/noExplicitAny: Grafast lambda values
              async (values: any) => {
                const [input, observer, db] = values;

                if (!observer) throw new GraphQLError("Unauthorized");

                const postId = await getStatusChangePostId(db, input.rowId);
                if (!postId) {
                  throw new GraphQLError("Status update not found");
                }

                const postRef = await getPostRef(db, postId);
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

                await deletePostStatusChange(db, input.rowId);

                return { id: input.rowId };
              },
              false,
            );
          },
        [
          GraphQLError,
          checkPermission,
          context,
          deletePostStatusChange,
          getPostRef,
          getStatusChangePostId,
          lambda,
        ],
      ),
    },
  },
}));

export default DeletePostStatusChangePlugin;
