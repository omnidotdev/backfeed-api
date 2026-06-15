/**
 * Signal field validation. The signal table stores `source`, `type`, and
 * `status` as free text (not pgEnum), so the allowed values are enforced at the
 * application boundary. These constants and guards are the single source of
 * truth for that validation.
 */

import { heuristicTriage } from "./triage";

import type { InsertPost, InsertSignal } from "lib/db/schema";

/** Where a signal originated. */
export const SIGNAL_SOURCES = [
  "widget",
  "email",
  "social",
  "app_store",
  "discord",
  "slack",
  "web",
] as const;

/** What kind of input a signal represents (assigned during triage). */
export const SIGNAL_TYPES = [
  "feedback",
  "bug",
  "review",
  "praise",
  "question",
] as const;

/** Lifecycle of a signal as it moves toward (or away from) a post. */
export const SIGNAL_STATUSES = [
  "pending",
  "published",
  "merged",
  "rejected",
] as const;

export type SignalSource = (typeof SIGNAL_SOURCES)[number];
export type SignalType = (typeof SIGNAL_TYPES)[number];
export type SignalStatus = (typeof SIGNAL_STATUSES)[number];

/** Default status for a freshly captured signal. */
export const DEFAULT_SIGNAL_STATUS: SignalStatus = "pending";

/** Default source for posts created directly in the app. */
export const DEFAULT_SIGNAL_SOURCE: SignalSource = "widget";

export const isSignalSource = (value: unknown): value is SignalSource =>
  typeof value === "string" &&
  (SIGNAL_SOURCES as readonly string[]).includes(value);

export const isSignalType = (value: unknown): value is SignalType =>
  typeof value === "string" &&
  (SIGNAL_TYPES as readonly string[]).includes(value);

export const isSignalStatus = (value: unknown): value is SignalStatus =>
  typeof value === "string" &&
  (SIGNAL_STATUSES as readonly string[]).includes(value);

/**
 * Validate the parts of a signal input that carry constrained free-text values
 * (`source`, `type`, `status`). A valid source is required; type and status are
 * optional (the DB defaults status to "pending"), but must be valid when present.
 * Throws a descriptive error on the first invalid field.
 */
export const assertValidSignalInput = (input: {
  source?: unknown;
  type?: unknown;
  status?: unknown;
}): void => {
  if (!isSignalSource(input.source)) {
    throw new Error(`Invalid signal source: ${String(input.source)}`);
  }
  if (input.type != null && !isSignalType(input.type)) {
    throw new Error(`Invalid signal type: ${String(input.type)}`);
  }
  if (input.status != null && !isSignalStatus(input.status)) {
    throw new Error(`Invalid signal status: ${String(input.status)}`);
  }
};

/**
 * Build a provenance signal for a post created directly in the app. Every
 * app-created post is also recorded as a published "widget" feedback signal so
 * the signal table is the unified record of all feedback inputs.
 */
export const buildPostProvenanceSignal = (post: {
  postId: string;
  projectId: string;
  organizationId: string;
  userId?: string | null;
  title?: string | null;
  description?: string | null;
}): InsertSignal => {
  const rawContent = [post.title, post.description]
    .filter(Boolean)
    .join("\n\n");
  const { type, sentiment } = heuristicTriage(rawContent);

  return {
    source: DEFAULT_SIGNAL_SOURCE,
    type,
    status: "published",
    organizationId: post.organizationId,
    projectId: post.projectId,
    userId: post.userId ?? null,
    postId: post.postId,
    rawContent,
    sentiment,
  };
};

/**
 * Build a freshly ingested signal from an external source. Validates the source,
 * triages the content into a type + sentiment, and always lands the signal as
 * `pending`: nothing ingested auto-publishes to a public board (it needs an
 * explicit promotion). `status` is intentionally not an accepted input field.
 */
export const buildIngestedSignal = (input: {
  organizationId: string;
  source: string;
  rawContent: string;
  projectId?: string | null;
  userId?: string | null;
  sourceMetadata?: unknown;
}): InsertSignal => {
  assertValidSignalInput({ source: input.source });
  const { type, sentiment } = heuristicTriage(input.rawContent);

  return {
    source: input.source as SignalSource,
    type,
    status: DEFAULT_SIGNAL_STATUS,
    organizationId: input.organizationId,
    projectId: input.projectId ?? null,
    userId: input.userId ?? null,
    rawContent: input.rawContent,
    sentiment,
    sourceMetadata: input.sourceMetadata ?? null,
  };
};

/**
 * Guard that a signal may be promoted to a public post. A signal is promotable
 * only while it is still `pending`, has been routed to a project, and is not
 * already linked to a post. Throws a descriptive error otherwise.
 */
export const assertSignalPromotable = (signal: {
  status?: string | null;
  projectId?: string | null;
  postId?: string | null;
}): void => {
  if (signal.status !== "pending") {
    throw new Error(
      `Signal must be pending to promote (status: ${String(signal.status)})`,
    );
  }
  if (!signal.projectId) {
    throw new Error("Signal must be routed to a project before promotion");
  }
  if (signal.postId) {
    throw new Error("Signal is already linked to a post");
  }
};

/**
 * Derive the post to create when promoting a signal. Without a title override,
 * the first paragraph of the raw content becomes the title and the remainder the
 * description; with an override, the full raw content is kept as the description.
 * The post is attributed to the resolved author (the signal's user when present,
 * otherwise the promoting admin) and carries the signal's source.
 */
export const buildPostFromSignal = (
  signal: {
    rawContent: string;
    projectId: string;
    source?: string | null;
    userId?: string | null;
  },
  opts: { userId: string; title?: string | null },
): InsertPost => {
  const [firstParagraph, ...rest] = signal.rawContent.split("\n\n");
  const override = opts.title?.trim();
  const title = override || firstParagraph.trim();
  const description = override
    ? signal.rawContent
    : rest.join("\n\n").trim() || null;

  return {
    projectId: signal.projectId,
    userId: opts.userId,
    title,
    description,
    source: signal.source ?? DEFAULT_SIGNAL_SOURCE,
  };
};
