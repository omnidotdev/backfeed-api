/**
 * Inbound email webhook.
 *
 * Receives parsed inbound messages from the mail provider (Herald) and turns them
 * into pending email signals. Messages are routed to a project by the recipient's
 * inbound key (`<key>@<INBOUND_EMAIL_DOMAIN>`). Requests are authenticated with an
 * HMAC-SHA256 signature over the raw body, mirroring the IDP webhook.
 *
 * Expected JSON body (provider contract): `{ to, from, subject, text, messageId }`
 * where `to` is the recipient address (string or array).
 */

import { createHmac, timingSafeEqual } from "node:crypto";

import { Elysia, t } from "elysia";
import {
  HERALD_WEBHOOK_SECRET,
  INBOUND_EMAIL_DOMAIN,
  isEmailIngestionEnabled,
} from "lib/config/env.config";
import { dbPool } from "lib/db/db";
import { ingestEmail } from "lib/feedback/emailIngest";

/** Verify an HMAC-SHA256 hex signature over the raw payload. */
const verifySignature = (
  payload: string,
  signature: string,
  secret: string,
): boolean => {
  try {
    const expected = createHmac("sha256", secret).update(payload).digest("hex");
    const sigBuf = Buffer.from(signature, "hex");
    const expBuf = Buffer.from(expected, "hex");
    if (sigBuf.length !== expBuf.length) return false;
    return timingSafeEqual(sigBuf, expBuf);
  } catch {
    return false;
  }
};

interface InboundEmailPayload {
  to: string | string[];
  from: string;
  subject?: string | null;
  text?: string | null;
  messageId?: string | null;
}

/** Pick the recipient whose domain matches the inbound domain (else the first). */
const pickRecipient = (to: string | string[], domain: string): string => {
  const candidates = (Array.isArray(to) ? to : [to]).filter(
    (r): r is string => typeof r === "string",
  );
  const match = candidates.find((r) =>
    r.toLowerCase().includes(`@${domain.toLowerCase()}`),
  );
  return match ?? candidates[0] ?? "";
};

const emailWebhook = new Elysia({ prefix: "/webhooks" }).post(
  "/email",
  async ({ request, headers, set }) => {
    if (!isEmailIngestionEnabled || !INBOUND_EMAIL_DOMAIN) {
      set.status = 503;
      return { error: "Email ingestion not configured" };
    }

    try {
      const rawBody = await request.text();

      const signature = headers["x-herald-signature"];
      if (!signature) {
        set.status = 401;
        return { error: "Missing signature" };
      }
      if (
        !verifySignature(rawBody, signature, HERALD_WEBHOOK_SECRET as string)
      ) {
        set.status = 401;
        return { error: "Invalid signature" };
      }

      const body = JSON.parse(rawBody) as InboundEmailPayload;
      const recipient = pickRecipient(body.to, INBOUND_EMAIL_DOMAIN);

      const result = await ingestEmail(dbPool, {
        recipient,
        domain: INBOUND_EMAIL_DOMAIN,
        email: {
          from: body.from,
          subject: body.subject,
          text: body.text,
          messageId: body.messageId,
        },
      });

      // Unroutable/duplicate are not failures: ack so the provider stops retrying.
      set.status = 200;
      return { received: true, ...result };
    } catch (error) {
      console.error("[Email Webhook] Failed to process inbound email:", error);
      set.status = 500;
      return { error: "Internal Server Error" };
    }
  },
  {
    headers: t.Object({
      "x-herald-signature": t.Optional(t.String()),
    }),
  },
);

export default emailWebhook;
