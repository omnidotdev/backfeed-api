import { BILLING_BYPASS_SLUGS } from "lib/config/env.config";
import { isWithinLimit } from "lib/entitlements";

/**
 * Workspace slugs that bypass all billing/tier limits.
 * Configured via BILLING_BYPASS_SLUGS env var (comma-separated).
 *
 * NOTE: Exported as array for use in EXPORTABLE functions.
 * Use `billingBypassSlugs.includes(slug)` inline within EXPORTABLE blocks.
 */
export const billingBypassSlugs: string[] =
  BILLING_BYPASS_SLUGS?.split(",")
    .map((s) => s.trim())
    .filter(Boolean) ?? [];

/**
 * Feature keys for entitlement queries.
 */
export const FEATURE_KEYS = {
  TIER: "tier",
  MAX_PROJECTS: "max_projects",
  MAX_FEEDBACK_USERS: "max_feedback_users",
  MAX_COMMENTS_PER_POST: "max_comments_per_post",
} as const;

/**
 * Check if workspace is within limit for a resource.
 * Exported for use in EXPORTABLE functions.
 */
export { isWithinLimit };
