/**
 * IDP (Identity Provider) webhook handler.
 *
 * Receives organization lifecycle events from the IDP.
 * Handles soft-deletion of workspaces when organizations are deleted.
 */

import { createHmac, timingSafeEqual } from "node:crypto";

import { eq } from "drizzle-orm";
import { Elysia, t } from "elysia";
import { GATEKEEPER_WEBHOOK_SECRET } from "lib/config/env.config";
import { dbPool } from "lib/db/db";
import { workspaces } from "lib/db/schema";

interface OrganizationDeletedPayload {
  eventType: "organization.deleted";
  organizationId: string;
  deletedAt: string;
  timestamp: string;
}

type IdpWebhookPayload = OrganizationDeletedPayload;

/**
 * Verify HMAC-SHA256 signature from IDP.
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
 * IDP webhook receiver.
 * Receives organization lifecycle events from the identity provider.
 */
const idpWebhook = new Elysia({ prefix: "/webhooks" }).post(
  "/idp",
  async ({ request, headers, set }) => {
    const signature = headers["x-idp-signature"];
    const eventType = headers["x-idp-event"];

    if (!GATEKEEPER_WEBHOOK_SECRET) {
      console.warn(
        "GATEKEEPER_WEBHOOK_SECRET not set - skipping signature verification",
      );
    }

    try {
      const rawBody = await request.text();

      // Verify signature if secret is configured
      if (GATEKEEPER_WEBHOOK_SECRET && signature) {
        const isValid = verifySignature(
          rawBody,
          signature,
          GATEKEEPER_WEBHOOK_SECRET,
        );

        if (!isValid) {
          set.status = 401;
          return { error: "Invalid signature" };
        }
      } else if (GATEKEEPER_WEBHOOK_SECRET && !signature) {
        set.status = 401;
        return { error: "Missing signature" };
      }

      const body = JSON.parse(rawBody) as IdpWebhookPayload;

      console.log(
        `IDP event received: ${body.eventType} for org ${body.organizationId}`,
      );

      switch (body.eventType) {
        case "organization.deleted":
          await handleOrganizationDeleted(body);
          break;
        default:
          console.warn(`Unknown IDP event type: ${eventType}`);
      }

      set.status = 200;
      return { received: true };
    } catch (err) {
      console.error("Error processing IDP webhook:", err);
      set.status = 500;
      return { error: "Internal Server Error" };
    }
  },
  {
    headers: t.Object({
      "x-idp-signature": t.Optional(t.String()),
      "x-idp-event": t.Optional(t.String()),
    }),
  },
);

/**
 * Handle organization deleted event.
 * Soft-deletes the associated workspace.
 */
async function handleOrganizationDeleted(
  payload: OrganizationDeletedPayload,
): Promise<void> {
  const { organizationId, deletedAt } = payload;

  try {
    const result = await dbPool
      .update(workspaces)
      .set({
        deletedAt: new Date(deletedAt),
        deletionReason: "organization_deleted",
      })
      .where(eq(workspaces.organizationId, organizationId))
      .returning({ id: workspaces.id });

    if (result.length > 0) {
      console.log(
        `Soft-deleted workspace ${result[0].id} (org ${organizationId} deleted)`,
      );
    } else {
      console.log(
        `No workspace found for deleted org ${organizationId} (may not exist in this app)`,
      );
    }
  } catch (err) {
    console.error(
      `Failed to soft-delete workspace for org ${organizationId}:`,
      err,
    );
    throw err;
  }
}

export default idpWebhook;
