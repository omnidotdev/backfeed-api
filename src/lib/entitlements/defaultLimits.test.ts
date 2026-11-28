/**
 * Free-tier fallback limit tests.
 *
 * With no billing provider configured (the test env), entitlements resolve to
 * null and every check falls back to DEFAULT_LIMITS. These values must mirror
 * the product catalog SSOT (omni-api planConfigs, backfeed free tier); the
 * fallbacks previously drifted to 1 project and 100 comments per post
 */

import { describe, expect, it, mock } from "bun:test";

const realProviders = await import("lib/providers");
mock.module("lib/providers", () => ({ ...realProviders, billing: null }));

const { isWithinLimit } = await import("./index");

const entity = { organizationId: "org-unprovisioned" };

describe("free-tier fallback limits mirror the catalog", () => {
  it("allows 2 projects (catalog max_projects: 2)", async () => {
    expect(await isWithinLimit(entity, "max_projects", 1)).toBe(true);
    expect(await isWithinLimit(entity, "max_projects", 2)).toBe(false);
  });

  it("allows 50 comments per post (catalog max_comments_per_post: 50)", async () => {
    expect(await isWithinLimit(entity, "max_comments_per_post", 49)).toBe(true);
    expect(await isWithinLimit(entity, "max_comments_per_post", 50)).toBe(
      false,
    );
  });

  it("never caps feedback users (catalog max_feedback_users: -1)", async () => {
    expect(await isWithinLimit(entity, "max_feedback_users", 100_000)).toBe(
      true,
    );
  });

  it("never caps members or admins (catalog max_members, max_admins: -1)", async () => {
    expect(await isWithinLimit(entity, "max_members", 100_000)).toBe(true);
    expect(await isWithinLimit(entity, "max_admins", 100_000)).toBe(true);
  });
});
