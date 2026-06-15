/**
 * Online theme clustering for feedback signals.
 *
 * Each embedded signal joins the nearest project cluster whose centroid is within
 * a cosine-similarity threshold, updating that centroid as a running mean; if none
 * is close enough, it seeds a new cluster. Clustering is dormant (returns null)
 * until an embedding provider is configured, since centroids need embeddings.
 *
 * AI-written cluster labels/summaries come later (they need the LLM router).
 */

import { eq, sql } from "drizzle-orm";
import { signalClusters } from "lib/db/schema";

import { foldIntoCentroid } from "./embedding";

import type { dbPool } from "lib/db/db";

type Db = typeof dbPool;

/** Minimum cosine similarity to a centroid for a signal to join that cluster. */
const CLUSTER_JOIN_THRESHOLD = 0.85;

/**
 * Assign an embedded signal to a theme cluster within its project, returning the
 * cluster id. Joins the nearest cluster within `CLUSTER_JOIN_THRESHOLD` (updating
 * its centroid) or creates a new one. Returns null when no embedding is given.
 */
export const assignCluster = async (
  db: Db,
  projectId: string,
  embedding: number[] | null | undefined,
): Promise<string | null> => {
  if (!embedding || embedding.length === 0) return null;

  const vec = `[${embedding.join(",")}]`;

  const nearest = await db.execute(sql`
    SELECT id, 1 - (centroid <=> ${vec}::vector) AS score
    FROM ${signalClusters}
    WHERE project_id = ${projectId} AND centroid IS NOT NULL
    ORDER BY centroid <=> ${vec}::vector ASC
    LIMIT 1
  `);

  const candidate = nearest.rows[0];
  if (candidate && Number(candidate.score) >= CLUSTER_JOIN_THRESHOLD) {
    const [cluster] = await db
      .select()
      .from(signalClusters)
      .where(eq(signalClusters.id, candidate.id as string));

    const updated = foldIntoCentroid(
      cluster.centroid,
      cluster.memberCount,
      embedding,
    );

    await db
      .update(signalClusters)
      .set({
        centroid: updated,
        memberCount: cluster.memberCount + 1,
        updatedAt: sql`now()`,
      })
      .where(eq(signalClusters.id, cluster.id));

    return cluster.id;
  }

  const [created] = await db
    .insert(signalClusters)
    .values({ projectId, centroid: embedding, memberCount: 1 })
    .returning();

  return created.id;
};
