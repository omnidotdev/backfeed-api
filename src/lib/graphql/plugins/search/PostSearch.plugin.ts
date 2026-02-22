import { EXPORTABLE } from "graphile-export";
import { deletePostFromIndex, indexPost, isSearchEnabled } from "lib/search";
import { context, sideEffect } from "postgraphile/grafast";
import { wrapPlans } from "postgraphile/utils";

import type { Step } from "postgraphile/grafast";
import type { PlanWrapperFn } from "postgraphile/utils";

/**
 * Index post after successful creation.
 */
const indexOnCreate = (): PlanWrapperFn =>
  EXPORTABLE(
    (context, sideEffect, indexPost, isSearchEnabled): PlanWrapperFn =>
      (plan, $record) => {
        if (!isSearchEnabled) return plan();

        const $db = context().get("db");

        sideEffect([$record, $db], async ([record, db]) => {
          if (!record?.id) return;

          const post = await db.query.posts.findFirst({
            // biome-ignore lint/suspicious/noExplicitAny: drizzle callback types
            where: (table: any, { eq }: any) => eq(table.id, record.id),
            with: { project: true },
          });

          if (post?.project) {
            await indexPost(post, post.project.organizationId);
          }
        });

        return plan();
      },
    [context, sideEffect, indexPost, isSearchEnabled],
  );

/**
 * Re-index post after update.
 */
const indexOnUpdate = (): PlanWrapperFn =>
  EXPORTABLE(
    (context, sideEffect, indexPost, isSearchEnabled): PlanWrapperFn =>
      (plan, $record) => {
        if (!isSearchEnabled) return plan();

        const $db = context().get("db");

        sideEffect([$record, $db], async ([record, db]) => {
          if (!record?.id) return;

          const post = await db.query.posts.findFirst({
            // biome-ignore lint/suspicious/noExplicitAny: drizzle callback types
            where: (table: any, { eq }: any) => eq(table.id, record.id),
            with: { project: true },
          });

          if (post?.project) {
            await indexPost(post, post.project.organizationId);
          }
        });

        return plan();
      },
    [context, sideEffect, indexPost, isSearchEnabled],
  );

/**
 * Remove post from index on delete.
 */
const removeOnDelete = (): PlanWrapperFn =>
  EXPORTABLE(
    (
      _context,
      sideEffect,
      deletePostFromIndex,
      isSearchEnabled,
    ): PlanWrapperFn =>
      (plan, _, fieldArgs) => {
        if (!isSearchEnabled) return plan();

        const $input = fieldArgs.getRaw([
          "input",
          "rowId",
        ]) as unknown as Step<string>;

        sideEffect([$input], async ([postId]) => {
          if (postId) {
            await deletePostFromIndex(postId);
          }
        });

        return plan();
      },
    [context, sideEffect, deletePostFromIndex, isSearchEnabled],
  );

/**
 * Search indexing plugin for posts (submissions).
 * Indexes posts in Meilisearch after create/update mutations.
 * Removes posts from index on delete.
 */
const PostSearchPlugin = wrapPlans({
  Mutation: {
    createPost: indexOnCreate(),
    updatePost: indexOnUpdate(),
    deletePost: removeOnDelete(),
  },
});

export default PostSearchPlugin;
