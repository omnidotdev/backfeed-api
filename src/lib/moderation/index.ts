/**
 * Content moderation via Say Less.
 *
 * Thin, swappable provider (mirrors the embedding provider): with no
 * `SAY_LESS_URL`, moderation is a noop that allows everything; when configured,
 * content is checked against the Say Less `/check` endpoint and flagged content
 * is rejected. Failures fail OPEN (allow) so an outage never blocks legitimate
 * input.
 */

import { SAY_LESS_URL } from "lib/config/env.config";

interface ModerationResult {
  flagged: boolean;
}

/** Parse the Say Less `/check` response (`{ result: { flagged } }`). */
const parseModerationResponse = (payload: unknown): ModerationResult => ({
  flagged: Boolean(
    (payload as { result?: { flagged?: unknown } } | null)?.result?.flagged,
  ),
});

/**
 * Check text against the moderation provider. Returns `{ flagged: false }` when
 * moderation is disabled or the provider errors (fail open).
 */
export const moderateText = async (text: string): Promise<ModerationResult> => {
  if (!SAY_LESS_URL || !text.trim()) return { flagged: false };

  try {
    const response = await fetch(`${SAY_LESS_URL}/check`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    if (!response.ok) {
      console.error(
        `[Moderation] Say Less returned ${response.status}; allowing`,
      );
      return { flagged: false };
    }
    return parseModerationResponse(await response.json());
  } catch (error) {
    console.error("[Moderation] Check failed; allowing:", error);
    return { flagged: false };
  }
};
