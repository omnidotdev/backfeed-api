import { afterAll, beforeAll, describe, expect, test } from "bun:test";

import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "../db/schema";
import { projects, signals, users } from "../db/schema";
import { ingestEmail } from "./emailIngest";

import type { dbPool } from "../db/db";

/**
 * Integration test for inbound email ingestion. Runs against a real Postgres
 * (skipped when DATABASE_URL is unset).
 */
const DATABASE_URL = process.env.DATABASE_URL;
const DOMAIN = "inbound.backfeed.omni.dev";

describe.skipIf(!DATABASE_URL)("email ingestion (db integration)", () => {
  const runId = crypto.randomUUID();
  const organizationId = crypto.randomUUID();

  let pool: Pool;
  let db: typeof dbPool;
  let userId: string;
  let projectId: string;
  let inboundKey: string;

  beforeAll(async () => {
    pool = new Pool({ connectionString: DATABASE_URL });
    db = drizzle({ client: pool, schema, casing: "snake_case" });

    const [user] = await db
      .insert(users)
      .values({
        identityProviderId: crypto.randomUUID(),
        name: "Email Test User",
        email: `email-${runId}@example.com`,
      })
      .returning();
    userId = user.id;

    const [project] = await db
      .insert(projects)
      .values({ organizationId, name: "Email", slug: `email-${runId}` })
      .returning();
    projectId = project.id;
    inboundKey = project.inboundEmailKey;
  });

  afterAll(async () => {
    await db
      .delete(projects)
      .where(eq(projects.organizationId, organizationId));
    await db.delete(users).where(eq(users.id, userId));
    await pool.end();
  });

  const email = (messageId: string) => ({
    from: "reporter@example.com",
    subject: "The export button does nothing",
    text: "Clicking export just spins forever.",
    messageId,
  });

  test("routes an email to its project via the inbound key", async () => {
    const result = await ingestEmail(db, {
      recipient: `${inboundKey}@${DOMAIN}`,
      domain: DOMAIN,
      email: email("<m1@example.com>"),
    });

    expect(result.status).toBe("ingested");
    if (result.status !== "ingested") return;

    const [signal] = await db
      .select()
      .from(signals)
      .where(eq(signals.id, result.signalId));
    expect(signal.source).toBe("email");
    expect(signal.status).toBe("pending");
    expect(signal.projectId).toBe(projectId);
    expect(signal.organizationId).toBe(organizationId);
    expect((signal.sourceMetadata as { externalId: string }).externalId).toBe(
      "<m1@example.com>",
    );
  });

  test("drops a duplicate message id", async () => {
    const first = await ingestEmail(db, {
      recipient: `${inboundKey}@${DOMAIN}`,
      domain: DOMAIN,
      email: email("<dupe@example.com>"),
    });
    expect(first.status).toBe("ingested");

    const second = await ingestEmail(db, {
      recipient: `${inboundKey}@${DOMAIN}`,
      domain: DOMAIN,
      email: email("<dupe@example.com>"),
    });
    expect(second.status).toBe("duplicate");
  });

  test("reports unroutable for an unknown key", async () => {
    const result = await ingestEmail(db, {
      recipient: `no-such-key@${DOMAIN}`,
      domain: DOMAIN,
      email: email("<m2@example.com>"),
    });
    expect(result.status).toBe("unroutable");
  });

  test("reports unroutable for a wrong domain", async () => {
    const result = await ingestEmail(db, {
      recipient: `${inboundKey}@evil.example.com`,
      domain: DOMAIN,
      email: email("<m3@example.com>"),
    });
    expect(result.status).toBe("unroutable");
  });
});
