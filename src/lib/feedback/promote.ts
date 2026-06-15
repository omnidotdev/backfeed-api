/**
 * Signal ingestion and promotion (the brain -> board bridge).
 *
 * `ingestSignal` captures external input as a triaged, pending signal.
 * `promoteSignalToPost` turns a routed pending signal into a public board post
 * and links the signal to it. These are the controlled write paths behind the
 * `ingestSignal`/`promoteSignalToPost` GraphQL mutations; the raw auto-CRUD
 * signal mutations are disabled so triage and the no-auto-publish guardrail
 * cannot be bypassed.
 */

import { eq } from "drizzle-orm";
import { posts, signals } from "lib/db/schema";

import {
  assertSignalPromotable,
  buildIngestedSignal,
  buildPostFromSignal,
} from "./signal";

import type { dbPool } from "lib/db/db";
import type { SelectPost, SelectSignal } from "lib/db/schema";

/** The application's drizzle database (pool- or client-backed). */
type Db = typeof dbPool;

/** Capture an external signal as a triaged, pending record. */
export const ingestSignal = async (
  db: Db,
  input: {
    organizationId: string;
    source: string;
    rawContent: string;
    projectId?: string | null;
    userId?: string | null;
    sourceMetadata?: unknown;
  },
): Promise<SelectSignal> => {
  const [signal] = await db
    .insert(signals)
    .values(buildIngestedSignal(input))
    .returning();
  return signal;
};

/**
 * Promote a pending signal to a public post and link it. The post is attributed
 * to the signal's original author when present, otherwise to the promoting
 * admin. Throws if the signal is missing or not promotable.
 */
export const promoteSignalToPost = async (
  db: Db,
  {
    signalId,
    userId,
    title,
  }: { signalId: string; userId: string; title?: string | null },
): Promise<SelectPost> => {
  const [signal] = await db
    .select()
    .from(signals)
    .where(eq(signals.id, signalId));

  if (!signal) throw new Error(`Signal not found: ${signalId}`);

  assertSignalPromotable(signal);

  const [post] = await db
    .insert(posts)
    .values(
      buildPostFromSignal(
        {
          rawContent: signal.rawContent,
          projectId: signal.projectId!,
          source: signal.source,
          userId: signal.userId,
        },
        { userId: signal.userId ?? userId, title },
      ),
    )
    .returning();

  await db
    .update(signals)
    .set({ status: "published", postId: post.id })
    .where(eq(signals.id, signalId));

  return post;
};
