import { afterEach, beforeEach, expect, it, mock } from "bun:test";
import { createHmac } from "node:crypto";

import { eq, inArray } from "drizzle-orm";
import { dbPool } from "lib/db/db";
import { projects } from "lib/db/schema";

// Scoping test for the organization.deleted handler: it hard-deletes the deleted
// org's projects (and status templates), and must never touch another org's
// data. The receiver now fails closed without a configured secret (see
// webhooks.security.test.ts), so this test configures one and signs every post.
const TARGET = "aaaaaaaa-0000-4000-8000-0000000000a1";
const CONTROL = "aaaaaaaa-0000-4000-8000-0000000000a2";

const SECRET = "test-idp-secret";
const realEnvConfig = await import("lib/config/env.config");
mock.module("lib/config/env.config", () => ({
  ...realEnvConfig,
  AUTH_WEBHOOK_SECRET: SECRET,
}));

const { default: idpWebhook } = await import("./webhooks");

const sign = (body: string) =>
  createHmac("sha256", SECRET).update(body).digest("hex");

const post = (organizationId: string) => {
  const body = JSON.stringify({
    eventType: "organization.deleted",
    organizationId,
    deletedAt: "2026-08-18T00:00:00.000Z",
    timestamp: "2026-08-18T00:00:00.000Z",
  });

  return idpWebhook.handle(
    new Request("http://localhost/webhooks/idp", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-idp-signature": sign(body),
        "x-idp-event": "organization.deleted",
      },
      body,
    }),
  );
};

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
