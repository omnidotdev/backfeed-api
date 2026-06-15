import { afterAll, beforeAll, describe, expect, test } from "bun:test";

import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "../db/schema";
import { projects, signals, users } from "../db/schema";
import { ingestSignal, promoteSignalToPost } from "./promote";

import type { dbPool } from "../db/db";

/**
 * Integration test for the ingest -> promote write path. Runs against a real
 * Postgres (skipped when DATABASE_URL is unset, e.g. local `bun test` without a
 * database). CI provides a Postgres service and runs migrations first.
 */
const DATABASE_URL = process.env.DATABASE_URL;

describe.skipIf(!DATABASE_URL)("signal promotion (db integration)", () => {
  const runId = crypto.randomUUID();
  const organizationId = crypto.randomUUID();

  let pool: Pool;
  let db: typeof dbPool;
  let userId: string;
  let projectId: string;

  beforeAll(async () => {
    pool = new Pool({ connectionString: DATABASE_URL });
    db = drizzle({ client: pool, schema, casing: "snake_case" });

    const [user] = await db
      .insert(users)
      .values({
        identityProviderId: crypto.randomUUID(),
        name: "Promote Test User",
        email: `promote-${runId}@example.com`,
      })
      .returning();
    userId = user.id;

    const [project] = await db
      .insert(projects)
      .values({
        organizationId,
        name: "Promote Test Project",
        slug: `promote-${runId}`,
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

  test("ingestSignal captures a triaged, pending signal", async () => {
    const signal = await ingestSignal(db, {
      organizationId,
      projectId,
      source: "email",
      rawContent: "App crashes on save\n\nIt is broken and I hate it",
    });

    expect(signal.id).toBeDefined();
    expect(signal.status).toBe("pending");
    expect(signal.source).toBe("email");
    expect(signal.type).toBe("bug");
    expect(signal.sentiment).toBe("negative");
    expect(signal.postId).toBeNull();
  });

  test("promoteSignalToPost creates a linked, published post", async () => {
    const signal = await ingestSignal(db, {
      organizationId,
      projectId,
      source: "email",
      rawContent: "Please add dark mode\n\nIt would be easier on the eyes.",
    });

    const post = await promoteSignalToPost(db, {
      signalId: signal.id,
      userId,
    });

    expect(post.id).toBeDefined();
    expect(post.title).toBe("Please add dark mode");
    expect(post.description).toBe("It would be easier on the eyes.");
    expect(post.source).toBe("email");
    expect(post.projectId).toBe(projectId);

    const [linked] = await db
      .select()
      .from(signals)
      .where(eq(signals.id, signal.id));
    expect(linked.status).toBe("published");
    expect(linked.postId).toBe(post.id);
  });

  test("promoteSignalToPost refuses a signal that is already promoted", async () => {
    const signal = await ingestSignal(db, {
      organizationId,
      projectId,
      source: "web",
      rawContent: "Double promote guard",
    });
    await promoteSignalToPost(db, { signalId: signal.id, userId });

    await expect(
      promoteSignalToPost(db, { signalId: signal.id, userId }),
    ).rejects.toThrow(/pending|already/i);
  });

  test("promoteSignalToPost refuses a signal with no project", async () => {
    const signal = await ingestSignal(db, {
      organizationId,
      source: "web",
      rawContent: "Unrouted signal",
    });

    await expect(
      promoteSignalToPost(db, { signalId: signal.id, userId }),
    ).rejects.toThrow(/project/i);
  });

  test("a promoted post is attributed to the original signal author", async () => {
    const signal = await ingestSignal(db, {
      organizationId,
      projectId,
      userId,
      source: "widget",
      rawContent: "Authored signal",
    });

    const post = await promoteSignalToPost(db, {
      signalId: signal.id,
      userId: crypto.randomUUID(),
    });

    // signal already carried an author, so the promoter id is not used
    expect(post.userId).toBe(userId);
  });
});
