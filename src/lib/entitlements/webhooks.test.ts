/**
 * Entitlements webhook signature verification tests.
 *
 * Covers the fail-closed fix: a missing BILLING_WEBHOOK_SECRET must reject
 * every request (503) rather than fall open and process an unverified
 * webhook, and a configured secret must still reject a wrong signature
 * (401). Both requests are rejected before the handler reaches the cache
 * invalidation path, so no mocking of lib/entitlements is needed; these
 * tests only assert the auth boundary. hasBilling is forced true (it
 * defaults to false in the test env, which would otherwise short-circuit to
 * 204 before the secret is ever checked).
 */

import { describe, expect, it, mock } from "bun:test";
import { createHmac } from "node:crypto";

const payload = JSON.stringify({
  eventType: "entitlement.updated",
  entityType: "organization",
  entityId: "org-1",
  appId: "backfeed",
  featureKey: "max_members",
  version: 1,
  timestamp: new Date().toISOString(),
});

describe("POST /webhooks/entitlements signature verification", () => {
  it("rejects with 503 when BILLING_WEBHOOK_SECRET is unset, even with a valid-looking signature", async () => {
    const realEnvConfig = await import("lib/config/env.config");
    mock.module("lib/config/env.config", () => ({
      ...realEnvConfig,
      hasBilling: true,
      BILLING_WEBHOOK_SECRET: undefined,
    }));

    const { default: entitlementsWebhook } = await import("./webhooks");

    // A signature computed with a secret the attacker guessed still must not
    // be accepted: with no secret configured there is nothing to verify against
    const forgedSignature = createHmac("sha256", "guessed-secret")
      .update(payload)
      .digest("hex");

    const response = await entitlementsWebhook.handle(
      new Request("http://localhost/webhooks/entitlements", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-billing-signature": forgedSignature,
        },
        body: payload,
      }),
    );

    expect(response.status).toBe(503);
    const body = await response.json();
    expect(body.error).toBe("Webhook secret not configured");

    mock.restore();
  });

  it("rejects with 401 when the secret is configured but the signature is wrong", async () => {
    const realEnvConfig = await import("lib/config/env.config");
    mock.module("lib/config/env.config", () => ({
      ...realEnvConfig,
      hasBilling: true,
      BILLING_WEBHOOK_SECRET: "correct-secret",
    }));

    const { default: entitlementsWebhook } = await import("./webhooks");

    const wrongSignature = createHmac("sha256", "wrong-secret")
      .update(payload)
      .digest("hex");

    const response = await entitlementsWebhook.handle(
      new Request("http://localhost/webhooks/entitlements", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-billing-signature": wrongSignature,
        },
        body: payload,
      }),
    );

    expect(response.status).toBe(401);
    const body = await response.json();
    expect(body.error).toBe("Invalid signature");

    mock.restore();
  });

  it("rejects with 401 when the secret is configured but no signature header is sent", async () => {
    const realEnvConfig = await import("lib/config/env.config");
    mock.module("lib/config/env.config", () => ({
      ...realEnvConfig,
      hasBilling: true,
      BILLING_WEBHOOK_SECRET: "correct-secret",
    }));

    const { default: entitlementsWebhook } = await import("./webhooks");

    const response = await entitlementsWebhook.handle(
      new Request("http://localhost/webhooks/entitlements", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: payload,
      }),
    );

    expect(response.status).toBe(401);
    const body = await response.json();
    expect(body.error).toBe("Missing signature");

    mock.restore();
  });
});
