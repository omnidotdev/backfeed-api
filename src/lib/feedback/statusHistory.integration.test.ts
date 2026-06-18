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
import { recordPostStatusChange } from "./statusHistory";

import type { dbPool } from "../db/db";

const DATABASE_URL = process.env.DATABASE_URL;

describe.skipIf(!DATABASE_URL)(
  "recordPostStatusChange (db integration)",
  () => {
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
          email: `status-${runId}@example.com`,
        })
        .returning();
      userId = user.id;

      const [project] = await db
        .insert(projects)
        .values({ organizationId, name: "Status", slug: `status-${runId}` })
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
      // deleting the project cascades its posts + their status-change rows
      await db
        .delete(projects)
        .where(eq(projects.organizationId, organizationId));
      await db
        .delete(statusTemplates)
        .where(eq(statusTemplates.organizationId, organizationId));
      await db.delete(users).where(eq(users.id, userId));
      await pool.end();
    });

    test("records transitions and dedupes against the latest entry", async () => {
      // first record: the post sits at "open"
      expect(await recordPostStatusChange(db, postId, userId)).toBe(true);

      // no status change since the last record -> deduped, no row written
      expect(await recordPostStatusChange(db, postId, userId)).toBe(false);

      // move the post to "planned", then record again
      await db
        .update(posts)
        .set({ statusTemplateId: plannedStatusId })
        .where(eq(posts.id, postId));
      expect(await recordPostStatusChange(db, postId, userId)).toBe(true);

      // the timeline is the ordered sequence open -> planned
      const timeline = await db
        .select()
        .from(postStatusChanges)
        .where(eq(postStatusChanges.postId, postId))
        .orderBy(asc(postStatusChanges.createdAt));

      expect(timeline).toHaveLength(2);
      expect(timeline[0].toStatusTemplateId).toBe(openStatusId);
      expect(timeline[1].toStatusTemplateId).toBe(plannedStatusId);
      expect(timeline[1].changedById).toBe(userId);
    });
  },
);
