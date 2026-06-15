/**
 * Signal ingestion and promotion (the brain -> board bridge).
 *
 * `ingestSignal` captures external input as a triaged, pending signal (with an
 * embedding when one is supplied). `promoteSignalToPost` turns a routed pending
 * signal into a public board post: it first checks for a near-duplicate and
 * either merges into the canonical post or creates a new one (flagging a
 * possible duplicate), carries triage onto the post, and assigns a theme cluster.
 *
 * These are the controlled write paths behind the `ingestSignal` /
 * `promoteSignalToPost` GraphQL mutations; the raw auto-CRUD signal mutations are
 * disabled so triage and the no-auto-publish guardrail cannot be bypassed.
 */

import { eq } from "drizzle-orm";
import { posts, signals } from "lib/db/schema";

import { assignCluster } from "./cluster";
import { findDuplicate } from "./dedupe";
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
    embedding?: number[] | null;
  },
): Promise<SelectSignal> => {
  const [signal] = await db
    .insert(signals)
    .values(buildIngestedSignal(input))
    .returning();
  return signal;
};

/** Result of a promotion: the resulting post, and whether it was an existing one. */
interface PromotionResult {
  post: SelectPost;
  /** True when the signal merged into an existing duplicate rather than creating a post. */
  merged: boolean;
}

/**
 * Promote a pending signal to a public post and link it.
 *
 * Dedupe first: a high-confidence duplicate merges the signal into the existing
 * canonical post (no new post); a medium-confidence match still creates a post
 * but records `duplicateOfId`. Otherwise a novel post is created. The post
 * carries the signal's triage (sentiment/aiTags) and embedding and is assigned a
 * theme cluster. The post is attributed to the signal's original author when
 * present, otherwise to the promoting admin. Throws if the signal is missing or
 * not promotable.
 */
export const promoteSignalToPost = async (
  db: Db,
  {
    signalId,
    userId,
    title,
  }: { signalId: string; userId: string; title?: string | null },
): Promise<PromotionResult> => {
  const [signal] = await db
    .select()
    .from(signals)
    .where(eq(signals.id, signalId));

  if (!signal) throw new Error(`Signal not found: ${signalId}`);

  assertSignalPromotable(signal);
  const projectId = signal.projectId!;

  const duplicate = await findDuplicate(db, projectId, {
    content: signal.rawContent,
    embedding: signal.embedding,
  });

  // High-confidence duplicate: merge into the canonical post, create nothing new.
  if (duplicate?.verdict === "merge") {
    await db
      .update(signals)
      .set({ status: "merged", postId: duplicate.postId })
      .where(eq(signals.id, signalId));

    const [canonical] = await db
      .select()
      .from(posts)
      .where(eq(posts.id, duplicate.postId));
    return { post: canonical, merged: true };
  }

  const clusterId = await assignCluster(db, projectId, signal.embedding);

  const [post] = await db
    .insert(posts)
    .values({
      ...buildPostFromSignal(
        {
          rawContent: signal.rawContent,
          projectId,
          source: signal.source,
          userId: signal.userId,
        },
        { userId: signal.userId ?? userId, title },
      ),
      sentiment: signal.sentiment,
      aiTags: signal.aiTags,
      embedding: signal.embedding,
      // medium-confidence: keep the post but point at the likely canonical
      duplicateOfId: duplicate?.verdict === "flag" ? duplicate.postId : null,
      clusterId,
    })
    .returning();

  await db
    .update(signals)
    .set({ status: "published", postId: post.id, clusterId })
    .where(eq(signals.id, signalId));

  return { post, merged: false };
};
