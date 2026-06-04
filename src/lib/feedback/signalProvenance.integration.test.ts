import { afterAll, beforeAll, describe, expect, test } from "bun:test";

import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import { posts, projects, signals, users } from "../db/schema";
import { buildPostProvenanceSignal } from "./signal";

/**
 * Integration test for the signal provenance write path. Runs against a real
 * Postgres (skipped when DATABASE_URL is unset, e.g. local `bun test` without a
 * database). CI provides a Postgres service and runs migrations first.
 */
const DATABASE_URL = process.env.DATABASE_URL;

describe.skipIf(!DATABASE_URL)("signal provenance (db integration)", () => {
  const runId = crypto.randomUUID();
  // Organization ids are uuids (from Gatekeeper); the project column is uuid in the db
  const organizationId = crypto.randomUUID();

  let pool: Pool;
  let db: ReturnType<typeof drizzle>;
  let userId: string;
  let projectId: string;

  beforeAll(async () => {
    pool = new Pool({ connectionString: DATABASE_URL });
    db = drizzle({ client: pool, casing: "snake_case" });

    const [user] = await db
      .insert(users)
      .values({
        identityProviderId: crypto.randomUUID(),
        name: "Integration Test User",
        email: `itest-${runId}@example.com`,
      })
      .returning();
    userId = user.id;

    const [project] = await db
      .insert(projects)
      .values({
        organizationId,
        name: "Integration Test Project",
        slug: `itest-${runId}`,
      })
      .returning();
    projectId = project.id;
  });

  afterAll(async () => {
    // Deleting the project cascades to its posts and signals
    await db.delete(projects).where(eq(projects.id, projectId));
    await db.delete(users).where(eq(users.id, userId));
    await pool.end();
  });

  test("persists a triaged provenance signal linked to the post", async () => {
    const [post] = await db
      .insert(posts)
      .values({
        projectId,
        userId,
        title: "App crashes on save",
        description: "It is broken and I hate it",
      })
      .returning();

    await db.insert(signals).values(
      buildPostProvenanceSignal({
        postId: post.id,
        projectId,
        organizationId,
        userId,
        title: post.title,
        description: post.description,
      }),
    );

    const [signal] = await db
      .select()
      .from(signals)
      .where(eq(signals.postId, post.id));

    expect(signal).toBeDefined();
    expect(signal.source).toBe("widget");
    expect(signal.status).toBe("published");
    expect(signal.organizationId).toBe(organizationId);
    // triaged from the post content
    expect(signal.type).toBe("bug");
    expect(signal.sentiment).toBe("negative");
  });
});
