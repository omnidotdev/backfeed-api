/**
 * Reference sync for a post description or comment body.
 *
 * Parses #N references out of `text`, resolves them to target posts within the
 * same project, and reconciles `post_reference` edges for this source: plain
 * references are rebuilt from scratch each run (deleted then reinserted, so an
 * edit can neither leave stale edges nor accumulate duplicates), while
 * magic-word edges are append-once and fire their status transition exactly
 * once per edge (guarded by `firedAt`). Status changes reuse the unit-tested
 * `changePostStatus` core so the timeline, note, and dedupe behavior are shared
 * with the manual mutation.
 */

import { and, eq, inArray } from "drizzle-orm";
import { postReferences, posts, statusTemplates } from "lib/db/schema";
import { changePostStatus } from "lib/feedback/changeStatus";
import {
  extractIssueRefs,
  resolveResolutionTemplateId,
} from "lib/feedback/references";

import type { dbPool } from "lib/db/db";

type Db = typeof dbPool;

interface SyncParams {
  db: Db;
  sourceType: "post" | "comment";
  sourceId: string;
  projectId: string;
  organizationId: string;
  text: string;
  authorUserId: string;
  /** Whether the author may move post status (org admin). */
  isAdmin: boolean;
  /** Post id the source belongs to, to guard against self-reference. */
  selfPostId: string;
}

export const syncReferences = async ({
  db,
  sourceType,
  sourceId,
  projectId,
  organizationId,
  text,
  authorUserId,
  isAdmin,
  selfPostId,
}: SyncParams): Promise<void> => {
  const refs = extractIssueRefs(text);

  // resolve #N -> target post id within the project
  const numbers = refs.map((r) => r.number);
  const targets = numbers.length
    ? await db
        .select({ id: posts.id, number: posts.number })
        .from(posts)
        .where(
          and(eq(posts.projectId, projectId), inArray(posts.number, numbers)),
        )
    : [];
  const idByNumber = new Map(targets.map((t) => [t.number, t.id]));

  // rebuild plain reference edges from scratch: a NULL keyword is not deduped by
  // the unique index, so re-running on edit would otherwise accumulate duplicate
  // rows. Magic-word edges are left untouched (append-once for fire-once + audit)
  await db
    .delete(postReferences)
    .where(
      and(
        eq(postReferences.sourceType, sourceType),
        eq(postReferences.sourceId, sourceId),
        eq(postReferences.refKind, "reference"),
      ),
    );

  let resolutionTemplateId: string | null | undefined;

  for (const ref of refs) {
    const targetPostId = idByNumber.get(ref.number);
    if (!targetPostId || targetPostId === selfPostId) continue;

    const refKind = ref.keyword ? "magicword" : "reference";

    const [edge] = await db
      .insert(postReferences)
      .values({
        sourceType,
        sourceId,
        targetPostId,
        refKind,
        keyword: ref.keyword,
        organizationId,
      })
      .onConflictDoNothing({
        target: [
          postReferences.sourceType,
          postReferences.sourceId,
          postReferences.targetPostId,
          postReferences.keyword,
        ],
      })
      .returning();

    if (!ref.keyword || !isAdmin) continue;

    // fire once: only when the edge is new (just inserted) and not yet fired
    if (!edge || edge.firedAt) continue;

    if (resolutionTemplateId === undefined) {
      const templates = await db
        .select({
          id: statusTemplates.id,
          name: statusTemplates.name,
          keywordRole: statusTemplates.keywordRole,
        })
        .from(statusTemplates)
        .where(eq(statusTemplates.organizationId, organizationId));
      resolutionTemplateId = resolveResolutionTemplateId(templates);
    }
    if (!resolutionTemplateId) continue;

    await changePostStatus(db, {
      postId: targetPostId,
      statusTemplateId: resolutionTemplateId,
      userId: authorUserId,
      note: `via "${ref.keyword} #${ref.number}"`,
    });
    await db
      .update(postReferences)
      .set({ firedAt: new Date().toISOString() })
      .where(eq(postReferences.id, edge.id));
  }
};
