/**
 * Signal field validation. The signal table stores `source`, `type`, and
 * `status` as free text (not pgEnum), so the allowed values are enforced at the
 * application boundary. These constants and guards are the single source of
 * truth for that validation.
 */

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
