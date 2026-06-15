import { dbPool } from "lib/db/db";

import { backfeedIndexes, search } from "./client";

/**
 * How often to reconcile the search index in the background (self-heal).
 */
export const SEARCH_RECONCILE_INTERVAL_MS = 6 * 60 * 60 * 1000;

/**
 * Reconcile (self-heal) the search indexes by re-indexing every project and post
 * from the database.
 *
 * Per-mutation indexing is best-effort: a transient Meilisearch failure is logged
 * and dropped, which would otherwise leave that document missing from search
 * forever. Periodically converging the index to the database restores anything
 * that was missed (e.g. created while search was down). Best-effort: failures are
 * logged, never thrown.
 */
export async function reconcileSearchIndex(): Promise<void> {
  if (!search) return;

  try {
    const projects = await dbPool.query.projects.findMany({
      columns: {
        id: true,
        organizationId: true,
        name: true,
        description: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (projects.length > 0) {
      await search.addDocuments(
        backfeedIndexes.projects.name,
        projects.map((project) => ({
          id: project.id,
          organization_id: project.organizationId,
          name: project.name,
          description: project.description,
          created_at: project.createdAt,
          updated_at: project.updatedAt,
        })),
      );
    }

    const posts = await dbPool.query.posts.findMany({
      columns: {
        id: true,
        projectId: true,
        title: true,
        description: true,
        createdAt: true,
        updatedAt: true,
      },
      with: { project: { columns: { organizationId: true } } },
    });
    if (posts.length > 0) {
      await search.addDocuments(
        backfeedIndexes.submissions.name,
        posts.map((post) => ({
          id: post.id,
          organization_id: post.project.organizationId,
          project_id: post.projectId,
          title: post.title,
          content: post.description,
          created_at: post.createdAt,
          updated_at: post.updatedAt,
        })),
      );
    }

    console.info(
      `[Search] Reconciled index: ${projects.length} projects, ${posts.length} posts`,
    );
  } catch (error) {
    console.error("[Search] Index reconcile failed:", error);
  }
}
