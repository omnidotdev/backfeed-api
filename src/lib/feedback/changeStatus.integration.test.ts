import { afterAll, beforeAll, describe, expect, test } from "bun:test";

import { asc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "../db/schema";
import {
  postStatusChanges,
  posts,
  projects,
  statusTemplates,
  users,
} from "../db/schema";
import { changePostStatus, getPostRef } from "./changeStatus";

import type { dbPool } from "../db/db";

const DATABASE_URL = process.env.DATABASE_URL;

describe.skipIf(!DATABASE_URL)("changePostStatus (db integration)", () => {
  const runId = crypto.randomUUID();
  const organizationId = crypto.randomUUID();

  let pool: Pool;
  let db: typeof dbPool;
  let userId: string;
  let projectId: string;
  let openStatusId: string;
  let plannedStatusId: string;
  let postId: string;

  beforeAll(async () => {
    pool = new Pool({ connectionString: DATABASE_URL });
    db = drizzle({ client: pool, schema, casing: "snake_case" });

    const [user] = await db
      .insert(users)
      .values({
        identityProviderId: crypto.randomUUID(),
        name: "Mover",
        email: `change-status-${runId}@example.com`,
      })
      .returning();
    userId = user.id;

    const [project] = await db
      .insert(projects)
      .values({ organizationId, name: "Change", slug: `change-${runId}` })
      .returning();
    projectId = project.id;

    const [open] = await db
      .insert(statusTemplates)
      .values({ organizationId, name: "open", displayName: "Open" })
      .returning();
    openStatusId = open.id;

    const [planned] = await db
      .insert(statusTemplates)
      .values({ organizationId, name: "planned", displayName: "Planned" })
      .returning();
    plannedStatusId = planned.id;

    const [post] = await db
      .insert(posts)
      .values({
        projectId,
        userId,
        title: "Dark mode",
        statusTemplateId: openStatusId,
      })
      .returning();
    postId = post.id;
  });

  afterAll(async () => {
    await db
      .delete(projects)
      .where(eq(projects.organizationId, organizationId));
    await db
      .delete(statusTemplates)
      .where(eq(statusTemplates.organizationId, organizationId));
    await db.delete(users).where(eq(users.id, userId));
    await pool.end();
  });

  test("getPostRef resolves the post's project + organization", async () => {
    const ref = await getPostRef(db, postId);
    expect(ref).toEqual({ id: postId, projectId, organizationId });
    expect(await getPostRef(db, crypto.randomUUID())).toBeNull();
  });

  test("moves the post and records the change with a note", async () => {
    const wrote = await changePostStatus(db, {
      postId,
      statusTemplateId: plannedStatusId,
      userId,
      note: "  shipping next release  ",
    });
    expect(wrote).toBe(true);

    const post = await db.query.posts.findFirst({
      where: eq(posts.id, postId),
      columns: { statusTemplateId: true },
    });
    expect(post?.statusTemplateId).toBe(plannedStatusId);

    const timeline = await db
      .select()
      .from(postStatusChanges)
      .where(eq(postStatusChanges.postId, postId))
      .orderBy(asc(postStatusChanges.createdAt));

    const latest = timeline.at(-1);
    expect(latest?.toStatusTemplateId).toBe(plannedStatusId);
    expect(latest?.changedById).toBe(userId);
    // note is trimmed before storage
    expect(latest?.note).toBe("shipping next release");
  });

  test("a no-op status change writes no timeline row", async () => {
    // already at planned from the previous test
    const wrote = await changePostStatus(db, {
      postId,
      statusTemplateId: plannedStatusId,
      userId,
      note: "redundant",
    });
    expect(wrote).toBe(false);
  });

  test("blank notes are stored as null", async () => {
    const wrote = await changePostStatus(db, {
      postId,
      statusTemplateId: null,
      userId,
      note: "   ",
    });
    expect(wrote).toBe(true);

    const latest = await db.query.postStatusChanges.findFirst({
      where: eq(postStatusChanges.postId, postId),
      orderBy: (row, { desc }) => desc(row.createdAt),
    });
    expect(latest?.toStatusTemplateId).toBeNull();
    expect(latest?.note).toBeNull();
  });
});
