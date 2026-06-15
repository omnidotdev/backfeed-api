/**
 * Inbound email ingestion orchestration.
 *
 * Resolves the target project from the recipient's inbound key, drops duplicates
 * (same Message-ID), embeds the content when a provider is configured, and
 * creates a pending email signal. The webhook handler is a thin auth wrapper over
 * this; the pure parsing/mapping lives in `email.ts`.
 */

import { eq, sql } from "drizzle-orm";
import { projects, signals } from "lib/db/schema";

import { buildEmailSignalInput, parseInboundKey } from "./email";
import { embeddingProvider } from "./embedding";
import { ingestSignal } from "./promote";

import type { dbPool } from "lib/db/db";
import type { InboundEmail } from "./email";

type Db = typeof dbPool;

/** Outcome of an inbound-email ingestion attempt. */
type EmailIngestResult =
  | { status: "ingested"; signalId: string }
  | { status: "unroutable" }
  | { status: "duplicate" };

/**
 * Ingest a parsed inbound email. Routes via `<key>@<domain>` to a project,
 * skips messages whose Message-ID was already seen, and lands a pending signal.
 */
export const ingestEmail = async (
  db: Db,
  params: { recipient: string; domain: string; email: InboundEmail },
): Promise<EmailIngestResult> => {
  const key = parseInboundKey(params.recipient, params.domain);
  if (!key) return { status: "unroutable" };

  const [project] = await db
    .select({ id: projects.id, organizationId: projects.organizationId })
    .from(projects)
    .where(eq(projects.inboundEmailKey, key));
  if (!project) return { status: "unroutable" };

  const externalId = params.email.messageId;
  if (externalId) {
    const dup = await db.execute(sql`
      SELECT 1 FROM ${signals}
      WHERE source_metadata->>'externalId' = ${externalId}
      LIMIT 1
    `);
    if (dup.rows.length > 0) return { status: "duplicate" };
  }

  const input = buildEmailSignalInput(params.email, {
    projectId: project.id,
    organizationId: project.organizationId,
  });
  const embedding = await embeddingProvider.embed(input.rawContent);

  const signal = await ingestSignal(db, { ...input, embedding });
  return { status: "ingested", signalId: signal.id };
};
