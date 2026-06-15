import { afterAll, beforeAll, describe, expect, test } from "bun:test";

import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "../db/schema";
import { posts, projects, signalClusters, users } from "../db/schema";
import { assignCluster } from "./cluster";
import { findDuplicate } from "./dedupe";

import type { dbPool } from "../db/db";

/**
 * Integration test for the embedding-backed brain (semantic dedupe + clustering).
 * Runs against a real Postgres with pgvector + pg_trgm (skipped when DATABASE_URL
 * is unset). Vectors are 1536-dim to match the schema; unit basis vectors make
 * the cosine relationships easy to reason about (e(i)·e(j) = 0 for i != j).
 */
const DATABASE_URL = process.env.DATABASE_URL;
const DIM = 1536;

/** Unit basis vector with a 1 at index `i`. */
const e = (i: number): number[] => {
  const v = new Array(DIM).fill(0);
  v[i] = 1;
  return v;
};

describe.skipIf(!DATABASE_URL)("feedback brain (db integration)", () => {
  const runId = crypto.randomUUID();
  const organizationId = crypto.randomUUID();

  let pool: Pool;
  let db: typeof dbPool;
  let userId: string;

  const makeProject = async (slug: string): Promise<string> => {
    const [project] = await db
      .insert(projects)
      .values({ organizationId, name: slug, slug: `${slug}-${runId}` })
      .returning();
    return project.id;
  };

  beforeAll(async () => {
    pool = new Pool({ connectionString: DATABASE_URL });
    db = drizzle({ client: pool, schema, casing: "snake_case" });

    const [user] = await db
      .insert(users)
      .values({
        identityProviderId: crypto.randomUUID(),
        name: "Brain Test User",
        email: `brain-${runId}@example.com`,
      })
      .returning();
    userId = user.id;
  });

  afterAll(async () => {
    await db.delete(users).where(eq(users.id, userId));
    await pool.end();
  });

  describe("findDuplicate (semantic)", () => {
    test("matches a near-identical embedding as a merge", async () => {
      const projectId = await makeProject("sem-merge");
      await db.insert(posts).values({
        projectId,
        userId,
        title: "Existing post",
        embedding: e(0),
      });

      const match = await findDuplicate(db, projectId, {
        content: "irrelevant when an embedding is supplied",
        embedding: e(0),
      });

      expect(match).not.toBeNull();
      expect(match?.strategy).toBe("embedding");
      expect(match?.verdict).toBe("merge");
      expect(match?.score).toBeGreaterThan(0.99);
    });

    test("returns null for an orthogonal (novel) embedding", async () => {
      const projectId = await makeProject("sem-novel");
      await db
        .insert(posts)
        .values({ projectId, userId, title: "Existing", embedding: e(0) });

      const match = await findDuplicate(db, projectId, {
        content: "x",
        embedding: e(7),
      });

      expect(match).toBeNull();
    });

    test("ignores posts already marked as duplicates", async () => {
      const projectId = await makeProject("sem-dupe-skip");
      const [canonical] = await db
        .insert(posts)
        .values({ projectId, userId, title: "Canonical", embedding: e(0) })
        .returning();
      await db.insert(posts).values({
        projectId,
        userId,
        title: "Already a dupe",
        embedding: e(0),
        duplicateOfId: canonical.id,
      });

      const match = await findDuplicate(db, projectId, {
        content: "x",
        embedding: e(0),
      });
      // the only eligible match is the canonical post
      expect(match?.postId).toBe(canonical.id);
    });
  });

  describe("findDuplicate (lexical fallback)", () => {
    test("matches similar text via trigram similarity when no embedding", async () => {
      const projectId = await makeProject("lex-merge");
      await db.insert(posts).values({
        projectId,
        userId,
        title: "Add dark mode to the settings page",
      });

      const match = await findDuplicate(db, projectId, {
        content: "Add dark mode to the settings page",
        embedding: null,
      });

      expect(match).not.toBeNull();
      expect(match?.strategy).toBe("lexical");
      expect(match?.verdict).toBe("merge");
    });

    test("returns null for unrelated text", async () => {
      const projectId = await makeProject("lex-novel");
      await db
        .insert(posts)
        .values({ projectId, userId, title: "Add dark mode" });

      const match = await findDuplicate(db, projectId, {
        content: "completely unrelated billing export feature",
        embedding: null,
      });

      expect(match).toBeNull();
    });
  });

  describe("assignCluster", () => {
    test("returns null without an embedding", async () => {
      const projectId = await makeProject("clu-noembed");
      expect(await assignCluster(db, projectId, null)).toBeNull();
    });

    test("seeds a new cluster, then joins near members and splits far ones", async () => {
      const projectId = await makeProject("clu-flow");

      const first = await assignCluster(db, projectId, e(0));
      expect(first).not.toBeNull();

      // identical embedding joins the same cluster
      const second = await assignCluster(db, projectId, e(0));
      expect(second).toBe(first);

      // an orthogonal embedding seeds a different cluster
      const third = await assignCluster(db, projectId, e(900));
      expect(third).not.toBe(first);

      const clusters = await db
        .select()
        .from(signalClusters)
        .where(eq(signalClusters.projectId, projectId));
      expect(clusters).toHaveLength(2);

      const joined = clusters.find((c) => c.id === first);
      expect(joined?.memberCount).toBe(2);
    });
  });
});
