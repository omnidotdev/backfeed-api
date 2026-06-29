/**
 * Update Post Status Change Plugin
 *
 * Adds `updatePostStatusChange`: edit the note on a single entry in a post's
 * status timeline. The recorded status and timestamp are intentionally left
 * untouched (only the admin's annotation changes); to change the status, use
 * `changePostStatus`. The raw auto-CRUD update stays disabled (see
 * SmartTag.plugin) so edits can only happen through this authorized path.
 *
 * Requires admin on the post's organization (curating history is moderation),
 * matching `deletePostStatusChange`.
 *
 * The database logic is the unit-tested core in `lib/feedback/statusHistory`.
 */

import { EXPORTABLE } from "graphile-export";
import { GraphQLError } from "graphql";
import { checkPermission } from "lib/authz";
import { getPostRef } from "lib/feedback/changeStatus";
import {
  getStatusChangePostId,
  updatePostStatusChangeNote,
} from "lib/feedback/statusHistory";
import { context, lambda } from "postgraphile/grafast";
import { gql, makeExtendSchemaPlugin } from "postgraphile/utils";

const UpdatePostStatusChangePlugin = makeExtendSchemaPlugin(() => ({
  typeDefs: gql`
    input UpdatePostStatusChangeInput {
      rowId: UUID!
      note: String
    }

    type UpdatePostStatusChangePayload {
      id: UUID!
      note: String
    }

    extend type Mutation {
      """
      Edit the note on a single entry in a post's status timeline. Admin-only.
      Does not change the recorded status (use changePostStatus for that). A
      null or empty note clears it.
      """
      updatePostStatusChange(
        input: UpdatePostStatusChangeInput!
      ): UpdatePostStatusChangePayload
    }
  `,
  plans: {
    Mutation: {
      updatePostStatusChange: EXPORTABLE(
        (
          GraphQLError,
          checkPermission,
          context,
          getPostRef,
          getStatusChangePostId,
          lambda,
          updatePostStatusChangeNote,
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

                const note = await updatePostStatusChangeNote(
                  db,
                  input.rowId,
                  input.note ?? null,
                );

                return { id: input.rowId, note: note ?? null };
              },
              false,
            );
          },
        [
          GraphQLError,
          checkPermission,
          context,
          getPostRef,
          getStatusChangePostId,
          lambda,
          updatePostStatusChangeNote,
        ],
      ),
    },
  },
}));

export default UpdatePostStatusChangePlugin;
