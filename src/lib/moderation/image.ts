/**
 * Image moderation via See Less.
 *
 * Thin, swappable provider: with no `SEE_LESS_API_URL`, image moderation is a
 * noop that allows everything; when configured, image bytes are screened against
 * the See Less `/v1/moderate/image` endpoint and a verdict is returned. Failures
 * fail OPEN (allow) so an outage never blocks legitimate uploads.
 */

import { SEE_LESS_API_KEY, SEE_LESS_API_URL } from "lib/config/env.config";

/** See Less verdict: allow outright, block hard, or allow-but-queue for review. */
type ImageVerdict = "allow" | "block" | "review";

interface ImageModerationResult {
  verdict: ImageVerdict;
  categories?: { category: string; score: number }[];
  caseId?: string;
}

/** Parse the See Less `/v1/moderate/image` response, defaulting to allow. */
const parseImageResponse = (payload: unknown): ImageModerationResult => {
  const data = payload as {
    verdict?: unknown;
    categories?: { category: string; score: number }[];
    case_id?: unknown;
  } | null;
  const verdict =
    data?.verdict === "block" || data?.verdict === "review"
      ? data.verdict
      : "allow";
  return {
    verdict,
    categories: data?.categories,
    caseId: typeof data?.case_id === "string" ? data.case_id : undefined,
  };
};

/**
 * Screen image bytes against the moderation provider. Returns
 * `{ verdict: "allow" }` when image moderation is disabled or the provider
 * errors (fail open).
 */
export const moderateImage = async (
  buffer: Buffer,
  mimeType: string,
): Promise<ImageModerationResult> => {
  if (!SEE_LESS_API_URL) return { verdict: "allow" };

  try {
    const form = new FormData();
    form.append(
      "file",
      new Blob([Uint8Array.from(buffer)], {
        type: mimeType || "application/octet-stream",
      }),
    );

    const response = await fetch(`${SEE_LESS_API_URL}/v1/moderate/image`, {
      method: "POST",
      headers: SEE_LESS_API_KEY ? { "x-api-key": SEE_LESS_API_KEY } : {},
      body: form,
    });
    if (!response.ok) {
      console.error(
        `[ImageModeration] See Less returned ${response.status}; allowing`,
      );
      return { verdict: "allow" };
    }
    return parseImageResponse(await response.json());
  } catch (error) {
    console.error("[ImageModeration] Check failed; allowing:", error);
    return { verdict: "allow" };
  }
};
