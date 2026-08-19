import { afterEach, beforeEach, expect, it } from "bun:test";

import { eq, inArray } from "drizzle-orm";
import { dbPool } from "lib/db/db";
import { projects } from "lib/db/schema";

import idpWebhook from "./webhooks";

// Scoping test for the organization.deleted handler: it hard-deletes the deleted
// org's projects (and status templates), and must never touch another org's
// data. AUTH_WEBHOOK_SECRET is unset in tests, so the receiver accepts the
// unsigned post.
const TARGET = "aaaaaaaa-0000-4000-8000-0000000000a1";
const CONTROL = "aaaaaaaa-0000-4000-8000-0000000000a2";

const post = (organizationId: string) =>
  idpWebhook.handle(
    new Request("http://localhost/webhooks/idp", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        eventType: "organization.deleted",
        organizationId,
        deletedAt: "2026-08-18T00:00:00.000Z",
        timestamp: "2026-08-18T00:00:00.000Z",
      }),
    }),
  );

const cleanup = () =>
  dbPool
    .delete(projects)
    .where(inArray(projects.organizationId, [TARGET, CONTROL]));

beforeEach(async () => {
  await cleanup();
  await dbPool.insert(projects).values([
    { name: "Target", slug: "target", organizationId: TARGET },
    { name: "Control", slug: "control", organizationId: CONTROL },
  ]);
});

afterEach(cleanup);

const projectCount = async (organizationId: string) =>
  (
    await dbPool
      .select({ id: projects.id })
      .from(projects)
      .where(eq(projects.organizationId, organizationId))
  ).length;

it("deletes the target org's projects and leaves other orgs untouched", async () => {
  const res = await post(TARGET);
  expect(res.status).toBe(200);

  expect(await projectCount(TARGET)).toBe(0);
  // The other org's project must survive
  expect(await projectCount(CONTROL)).toBe(1);
});

it("no-ops (200) for an org with no local data", async () => {
  const res = await post("aaaaaaaa-0000-4000-8000-0000000000a3");
  expect(res.status).toBe(200);
  expect(await projectCount(CONTROL)).toBe(1);
});
