import { afterAll, beforeAll, describe, expect, test } from "bun:test";

import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "../db/schema";
import { posts, projects, signals, statusTemplates, users } from "../db/schema";
import { markPostShipped } from "./shipped";

import type { dbPool } from "../db/db";

const DATABASE_URL = process.env.DATABASE_URL;

describe.skipIf(!DATABASE_URL)("markPostShipped (db integration)", () => {
  const runId = crypto.randomUUID();
  const organizationId = crypto.randomUUID();

  let pool: Pool;
  let db: typeof dbPool;
  let reporterA: string;
  let reporterB: string;
  let projectId: string;
  let completedStatusId: string;
  let openStatusId: string;

  beforeAll(async () => {
    pool = new Pool({ connectionString: DATABASE_URL });
    db = drizzle({ client: pool, schema, casing: "snake_case" });

    const [a] = await db
      .insert(users)
      .values({
        identityProviderId: crypto.randomUUID(),
        name: "Reporter A",
        email: `ship-a-${runId}@example.com`,
      })
      .returning();
    reporterA = a.id;
    const [b] = await db
      .insert(users)
      .values({
        identityProviderId: crypto.randomUUID(),
        name: "Reporter B",
        email: `ship-b-${runId}@example.com`,
      })
      .returning();
    reporterB = b.id;

    const [project] = await db
      .insert(projects)
      .values({ organizationId, name: "Ship", slug: `ship-${runId}` })
      .returning();
    projectId = project.id;

    const [completed] = await db
      .insert(statusTemplates)
      .values({ organizationId, name: "completed", displayName: "Completed" })
      .returning();
    completedStatusId = completed.id;
    const [open] = await db
      .insert(statusTemplates)
      .values({ organizationId, name: "open", displayName: "Open" })
      .returning();
    openStatusId = open.id;
  });

  afterAll(async () => {
    await db
      .delete(projects)
      .where(eq(projects.organizationId, organizationId));
    await db
      .delete(statusTemplates)
      .where(eq(statusTemplates.organizationId, organizationId));
    await db.delete(users).where(eq(users.id, reporterA));
    await db.delete(users).where(eq(users.id, reporterB));
    await pool.end();
  });

  test("stamps shippedAt and returns distinct reporters, exactly once", async () => {
    const [post] = await db
      .insert(posts)
      .values({
        projectId,
        userId: reporterA,
        title: "Export feature",
        statusTemplateId: completedStatusId,
      })
      .returning();

    // two reporters (one twice) plus an anonymous signal
    await db.insert(signals).values([
      {
        organizationId,
        projectId,
        postId: post.id,
        userId: reporterA,
        source: "widget",
        rawContent: "please add export",
        status: "published",
      },
      {
        organizationId,
        projectId,
        postId: post.id,
        userId: reporterB,
        source: "email",
        rawContent: "we need export",
        status: "merged",
      },
      {
        organizationId,
        projectId,
        postId: post.id,
        userId: null,
        source: "email",
        rawContent: "export pls",
        status: "merged",
      },
    ]);

    const shipped = await markPostShipped(db, post.id);
    expect(shipped).not.toBeNull();
    expect(shipped?.organizationId).toBe(organizationId);
    expect(shipped?.reporterUserIds.sort()).toEqual(
      [reporterA, reporterB].sort(),
    );

    const [row] = await db.select().from(posts).where(eq(posts.id, post.id));
    expect(row.shippedAt).not.toBeNull();

    // second call is a no-op (already shipped) so reporters are not re-notified
    expect(await markPostShipped(db, post.id)).toBeNull();
  });

  test("returns null for a non-shipped status", async () => {
    const [post] = await db
      .insert(posts)
      .values({
        projectId,
        userId: reporterA,
        title: "Still open",
        statusTemplateId: openStatusId,
      })
      .returning();

    expect(await markPostShipped(db, post.id)).toBeNull();
  });
});
