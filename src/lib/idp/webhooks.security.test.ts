/**
 * IDP webhook signature verification tests.
 *
 * Covers the fail-closed fix: a missing AUTH_WEBHOOK_SECRET must reject every
 * request (503) rather than fall open and process an unverified webhook, and
 * a configured secret must still reject a wrong signature (401). Both
 * requests are rejected before the handler reaches the database, so no
 * dbPool mocking is needed; these tests only assert the auth boundary.
 */

import { describe, expect, it, mock } from "bun:test";
import { createHmac } from "node:crypto";

const payload = JSON.stringify({
  eventType: "organization.deleted",
  organizationId: "org-1",
  deletedAt: new Date().toISOString(),
  timestamp: new Date().toISOString(),
});

describe("POST /webhooks/idp signature verification", () => {
  it("rejects with 503 when AUTH_WEBHOOK_SECRET is unset, even with a valid-looking signature", async () => {
    const realEnvConfig = await import("lib/config/env.config");
    mock.module("lib/config/env.config", () => ({
      ...realEnvConfig,
      AUTH_WEBHOOK_SECRET: undefined,
    }));

    const { default: idpWebhook } = await import("./webhooks");

    // A signature computed with a secret the attacker guessed still must not
    // be accepted: with no secret configured there is nothing to verify against
    const forgedSignature = createHmac("sha256", "guessed-secret")
      .update(payload)
      .digest("hex");

    const response = await idpWebhook.handle(
      new Request("http://localhost/webhooks/idp", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-idp-signature": forgedSignature,
          "x-idp-event": "organization.deleted",
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
      AUTH_WEBHOOK_SECRET: "correct-secret",
    }));

    const { default: idpWebhook } = await import("./webhooks");

    const wrongSignature = createHmac("sha256", "wrong-secret")
      .update(payload)
      .digest("hex");

    const response = await idpWebhook.handle(
      new Request("http://localhost/webhooks/idp", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-idp-signature": wrongSignature,
          "x-idp-event": "organization.deleted",
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
      AUTH_WEBHOOK_SECRET: "correct-secret",
    }));

    const { default: idpWebhook } = await import("./webhooks");

    const response = await idpWebhook.handle(
      new Request("http://localhost/webhooks/idp", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-idp-event": "organization.deleted",
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
