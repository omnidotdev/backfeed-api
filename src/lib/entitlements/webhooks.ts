import { createHmac, timingSafeEqual } from "node:crypto";

import { Elysia, t } from "elysia";
import { BILLING_WEBHOOK_SECRET, isSelfHosted } from "lib/config/env.config";
import { invalidateCache } from "lib/entitlements";

interface EntitlementWebhookPayload {
  eventType: string;
  entityType: string;
  entityId: string;
  appId: string;
  featureKey?: string;
  value?: unknown;
  version: number;
  timestamp: string;
}

/**
 * Verify HMAC-SHA256 signature from the entitlements service.
 */
const verifySignature = (
  payload: string,
  signature: string,
  secret: string,
): boolean => {
  try {
    const expectedSignature = createHmac("sha256", secret)
      .update(payload)
      .digest("hex");

    const signatureBuffer = Buffer.from(signature, "hex");
    const expectedBuffer = Buffer.from(expectedSignature, "hex");

    if (signatureBuffer.length !== expectedBuffer.length) {
      return false;
    }

    return timingSafeEqual(signatureBuffer, expectedBuffer);
  } catch {
    return false;
  }
};

/**
 * Entitlements webhook receiver.
 * Receives entitlement change events from the billing service (Aether).
 * Entitlements are at the organization level - no local caching needed.
 */
const entitlementsWebhook = new Elysia({ prefix: "/webhooks" }).post(
  "/entitlements",
  async ({ request, headers, set }) => {
    // Early return for self-hosted mode - no external billing service
    if (isSelfHosted) {
      set.status = 204;
      return { received: true, selfHosted: true };
    }

    const signature = headers["x-billing-signature"];

    if (!BILLING_WEBHOOK_SECRET) {
      // In development, allow without signature
      console.warn(
        "BILLING_WEBHOOK_SECRET not set - skipping signature verification",
      );
    }

    try {
      const rawBody = await request.text();

      // Verify signature if secret is configured
      if (BILLING_WEBHOOK_SECRET && signature) {
        const isValid = verifySignature(
          rawBody,
          signature,
          BILLING_WEBHOOK_SECRET,
        );

        if (!isValid) {
          set.status = 401;
          return { error: "Invalid signature" };
        }
      } else if (BILLING_WEBHOOK_SECRET && !signature) {
        set.status = 401;
        return { error: "Missing signature" };
      }

      const body = JSON.parse(rawBody) as EntitlementWebhookPayload;

      console.log(
        `Entitlement event received: ${body.eventType} for ${body.entityType}/${body.entityId}`,
      );

      // Handle events - invalidate local entitlements cache
      switch (body.eventType) {
        case "entitlement.created":
        case "entitlement.updated":
        case "entitlement.deleted":
          // Invalidate cached entitlements for this organization
          invalidateCache(`organization:${body.entityId}:*`);
          invalidateCache(`organization:${body.entityId}`);

          console.log(`Cache invalidated for organization ${body.entityId}`);
          break;
        default:
          break;
      }

      set.status = 200;
      return { received: true };
    } catch (err) {
      console.error("Error processing entitlements webhook:", err);
      set.status = 500;
      return { error: "Internal Server Error" };
    }
  },
  {
    headers: t.Object({
      "x-billing-signature": t.Optional(t.String()),
    }),
  },
);

export default entitlementsWebhook;
