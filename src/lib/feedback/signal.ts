/**
 * Signal field validation. The signal table stores `source`, `type`, and
 * `status` as free text (not pgEnum), so the allowed values are enforced at the
 * application boundary. These constants and guards are the single source of
 * truth for that validation.
 */

import type { InsertSignal } from "lib/db/schema";

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
}): InsertSignal => ({
  source: DEFAULT_SIGNAL_SOURCE,
  type: "feedback",
  status: "published",
  organizationId: post.organizationId,
  projectId: post.projectId,
  userId: post.userId ?? null,
  postId: post.postId,
  rawContent: [post.title, post.description].filter(Boolean).join("\n\n"),
});
