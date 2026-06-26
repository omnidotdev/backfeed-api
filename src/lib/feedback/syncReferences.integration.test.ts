import { afterAll, beforeAll, describe, expect, test } from "bun:test";

import { and, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "../db/schema";
import {
  postReferences,
  postStatusChanges,
  posts,
  projects,
  statusTemplates,
  users,
} from "../db/schema";
import { syncReferences } from "./syncReferences";

import type { dbPool } from "../db/db";

const DATABASE_URL = process.env.DATABASE_URL;

describe.skipIf(!DATABASE_URL)("syncReferences (db integration)", () => {
  const runId = crypto.randomUUID();
  const organizationId = crypto.randomUUID();

  let pool: Pool;
  let db: typeof dbPool;
  let userId: string;
  let projectId: string;
  let openStatusId: string;
  let completedStatusId: string;

  // target posts referenced by sources
  let target1Id: string;
  let target1Number: number;
  let target2Id: string;
  let target2Number: number;
  let target3Id: string;
  let target3Number: number;

  // sources
  let sourceAId: string; // plain reference -> target1, then pruned
  let sourceBId: string; // admin magicword -> target2
  let sourceCId: string; // non-admin magicword -> target3
  let sourceDId: string; // re-run plain reference (no duplicate)
  let sourceSId: string; // self-reference
  let sourceSNumber: number;

  /** Insert a post and return the trigger-assigned id + number. */
  const insertPost = async (title: string) => {
    const [post] = await db
      .insert(posts)
      .values({ projectId, userId, title, statusTemplateId: openStatusId })
      .returning();
    return { id: post.id, number: post.number as number };
  };

  beforeAll(async () => {
    pool = new Pool({ connectionString: DATABASE_URL });
    db = drizzle({ client: pool, schema, casing: "snake_case" });

    const [user] = await db
      .insert(users)
      .values({
        identityProviderId: crypto.randomUUID(),
        name: "Referencer",
        email: `sync-references-${runId}@example.com`,
      })
      .returning();
    userId = user.id;

    const [project] = await db
      .insert(projects)
      .values({ organizationId, name: "Refs", slug: `refs-${runId}` })
      .returning();
    projectId = project.id;

    const [open] = await db
      .insert(statusTemplates)
      .values({ organizationId, name: "open", displayName: "Open" })
      .returning();
    openStatusId = open.id;

    const [completed] = await db
      .insert(statusTemplates)
      .values({ organizationId, name: "completed", displayName: "Completed" })
      .returning();
    completedStatusId = completed.id;

    const t1 = await insertPost("Target one");
    target1Id = t1.id;
    target1Number = t1.number;

    const t2 = await insertPost("Target two");
    target2Id = t2.id;
    target2Number = t2.number;

    const t3 = await insertPost("Target three");
    target3Id = t3.id;
    target3Number = t3.number;

    const a = await insertPost("Source A");
    sourceAId = a.id;

    const b = await insertPost("Source B");
    sourceBId = b.id;

    const c = await insertPost("Source C");
    sourceCId = c.id;

    const d = await insertPost("Source D");
    sourceDId = d.id;

    const s = await insertPost("Source S");
    sourceSId = s.id;
    sourceSNumber = s.number;
  });

  afterAll(async () => {
    await db
      .delete(postReferences)
      .where(eq(postReferences.organizationId, organizationId));
    // posts (and their status changes) cascade from project deletion
    await db
      .delete(projects)
      .where(eq(projects.organizationId, organizationId));
    await db
      .delete(statusTemplates)
      .where(eq(statusTemplates.organizationId, organizationId));
    await db.delete(users).where(eq(users.id, userId));
    await pool.end();
  });

  const edgesFor = (sourceId: string) =>
    db
      .select()
      .from(postReferences)
      .where(
        and(
          eq(postReferences.sourceType, "post"),
          eq(postReferences.sourceId, sourceId),
        ),
      );

  const statusOf = async (postId: string) => {
    const row = await db.query.posts.findFirst({
      where: eq(posts.id, postId),
      columns: { statusTemplateId: true },
    });
    return row?.statusTemplateId ?? null;
  };

  test("plain reference by a non-admin records an edge, status unchanged", async () => {
    await syncReferences({
      db,
      sourceType: "post",
      sourceId: sourceAId,
      projectId,
      organizationId,
      text: `see #${target1Number}`,
      authorUserId: userId,
      isAdmin: false,
      selfPostId: sourceAId,
    });

    const edges = await edgesFor(sourceAId);
    expect(edges).toHaveLength(1);
    expect(edges[0].refKind).toBe("reference");
    expect(edges[0].keyword).toBeNull();
    expect(edges[0].targetPostId).toBe(target1Id);
    expect(edges[0].firedAt).toBeNull();

    expect(await statusOf(target1Id)).toBe(openStatusId);
  });

  test("magic word by an admin fires the transition once", async () => {
    await syncReferences({
      db,
      sourceType: "post",
      sourceId: sourceBId,
      projectId,
      organizationId,
      text: `fixes #${target2Number}`,
      authorUserId: userId,
      isAdmin: true,
      selfPostId: sourceBId,
    });

    const edges = await edgesFor(sourceBId);
    expect(edges).toHaveLength(1);
    expect(edges[0].refKind).toBe("magicword");
    expect(edges[0].keyword).toBe("fix");
    expect(edges[0].firedAt).not.toBeNull();

    expect(await statusOf(target2Id)).toBe(completedStatusId);

    const timeline = await db
      .select()
      .from(postStatusChanges)
      .where(eq(postStatusChanges.postId, target2Id));
    expect(timeline).toHaveLength(1);
    expect(timeline[0].toStatusTemplateId).toBe(completedStatusId);
    expect(timeline[0].note).toBe(`via "fix #${target2Number}"`);
  });

  test("magic word by a non-admin records the edge but does not fire", async () => {
    await syncReferences({
      db,
      sourceType: "post",
      sourceId: sourceCId,
      projectId,
      organizationId,
      text: `fixes #${target3Number}`,
      authorUserId: userId,
      isAdmin: false,
      selfPostId: sourceCId,
    });

    const edges = await edgesFor(sourceCId);
    expect(edges).toHaveLength(1);
    expect(edges[0].refKind).toBe("magicword");
    expect(edges[0].keyword).toBe("fix");
    expect(edges[0].firedAt).toBeNull();

    expect(await statusOf(target3Id)).toBe(openStatusId);

    const timeline = await db
      .select()
      .from(postStatusChanges)
      .where(eq(postStatusChanges.postId, target3Id));
    expect(timeline).toHaveLength(0);
  });

  test("re-running an admin magic word does not fire a second transition", async () => {
    await syncReferences({
      db,
      sourceType: "post",
      sourceId: sourceBId,
      projectId,
      organizationId,
      text: `fixes #${target2Number}`,
      authorUserId: userId,
      isAdmin: true,
      selfPostId: sourceBId,
    });

    const edges = await edgesFor(sourceBId);
    expect(edges).toHaveLength(1);

    const timeline = await db
      .select()
      .from(postStatusChanges)
      .where(eq(postStatusChanges.postId, target2Id));
    expect(timeline).toHaveLength(1);
  });

  test("editing the source to drop the reference prunes the edge", async () => {
    await syncReferences({
      db,
      sourceType: "post",
      sourceId: sourceAId,
      projectId,
      organizationId,
      text: "no more references here",
      authorUserId: userId,
      isAdmin: false,
      selfPostId: sourceAId,
    });

    const edges = await edgesFor(sourceAId);
    expect(edges).toHaveLength(0);
  });

  test("re-running a plain reference does not duplicate the edge", async () => {
    const text = `see #${target1Number}`;
    for (let i = 0; i < 3; i++) {
      await syncReferences({
        db,
        sourceType: "post",
        sourceId: sourceDId,
        projectId,
        organizationId,
        text,
        authorUserId: userId,
        isAdmin: false,
        selfPostId: sourceDId,
      });
    }

    const edges = await edgesFor(sourceDId);
    expect(edges).toHaveLength(1);
    expect(edges[0].refKind).toBe("reference");
    expect(edges[0].targetPostId).toBe(target1Id);
  });

  test("a self-reference is skipped", async () => {
    await syncReferences({
      db,
      sourceType: "post",
      sourceId: sourceSId,
      projectId,
      organizationId,
      text: `see #${sourceSNumber}`,
      authorUserId: userId,
      isAdmin: true,
      selfPostId: sourceSId,
    });

    const edges = await edgesFor(sourceSId);
    expect(edges).toHaveLength(0);

    expect(await statusOf(sourceSId)).toBe(openStatusId);
  });
});
