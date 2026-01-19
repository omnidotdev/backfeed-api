/**
 * IDP (Identity Provider) webhook handler.
 *
 * Receives organization lifecycle events from the IDP.
 * Handles cleanup of app data when organizations are deleted.
 */

import { createHmac, timingSafeEqual } from "node:crypto";

import { eq } from "drizzle-orm";
import { Elysia, t } from "elysia";
import { AUTH_WEBHOOK_SECRET } from "lib/config/env.config";
import { dbPool } from "lib/db/db";
import { projects, statusTemplates, users } from "lib/db/schema";

interface OrganizationDeletedPayload {
  eventType: "organization.deleted";
  organizationId: string;
  deletedAt: string;
  timestamp: string;
}

interface UserDeletedPayload {
  eventType: "user.deleted";
  userId: string;
  deletedAt: string;
  timestamp: string;
}

type IdpWebhookPayload = OrganizationDeletedPayload | UserDeletedPayload;

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

    if (!AUTH_WEBHOOK_SECRET) {
      console.warn(
        "AUTH_WEBHOOK_SECRET not set - skipping signature verification",
      );
    }

    try {
      const rawBody = await request.text();

      // Verify signature if secret is configured
      if (AUTH_WEBHOOK_SECRET && signature) {
        const isValid = verifySignature(
          rawBody,
          signature,
          AUTH_WEBHOOK_SECRET,
        );

        if (!isValid) {
          set.status = 401;
          return { error: "Invalid signature" };
        }
      } else if (AUTH_WEBHOOK_SECRET && !signature) {
        set.status = 401;
        return { error: "Missing signature" };
      }

      const body = JSON.parse(rawBody) as IdpWebhookPayload;

      console.log(
        `IDP event received: ${body.eventType}${
          "organizationId" in body ? ` for org ${body.organizationId}` : ""
        }${body.eventType === "user.deleted" ? ` for user ${body.userId}` : ""}`,
      );

      switch (body.eventType) {
        case "organization.deleted":
          await handleOrganizationDeleted(body);
          break;
        case "user.deleted":
          await handleUserDeleted(body);
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
 * Deletes all projects and status templates for the organization.
 * Cascading deletes will clean up posts, comments, etc.
 */
async function handleOrganizationDeleted(
  payload: OrganizationDeletedPayload,
): Promise<void> {
  const { organizationId } = payload;

  try {
    // Delete status templates for the organization
    const deletedTemplates = await dbPool
      .delete(statusTemplates)
      .where(eq(statusTemplates.organizationId, organizationId))
      .returning({ id: statusTemplates.id });

    // Delete projects for the organization (cascades to posts, comments, etc.)
    const deletedProjects = await dbPool
      .delete(projects)
      .where(eq(projects.organizationId, organizationId))
      .returning({ id: projects.id });

    console.log(
      `Deleted ${deletedProjects.length} projects and ${deletedTemplates.length} status templates for org ${organizationId}`,
    );
  } catch (err) {
    console.error(`Failed to delete data for org ${organizationId}:`, err);
    throw err;
  }
}

/**
 * Handle user deleted event.
 * Deletes the local user record.
 * Cascading deletes will clean up posts, comments, votes created by this user.
 */
async function handleUserDeleted(payload: UserDeletedPayload): Promise<void> {
  const { userId } = payload;

  try {
    // Delete the user record (cascades to posts, comments, votes via FKs)
    const result = await dbPool
      .delete(users)
      .where(eq(users.identityProviderId, userId))
      .returning({ id: users.id });

    if (result.length > 0) {
      console.log(
        `Deleted user ${result[0].id} (IDP user ${userId} was deleted)`,
      );
    } else {
      console.log(
        `No local user found for IDP user ${userId} (may not exist in this app)`,
      );
    }
  } catch (err) {
    console.error(`Failed to delete user for IDP user ${userId}:`, err);
    throw err;
  }
}

export default idpWebhook;
