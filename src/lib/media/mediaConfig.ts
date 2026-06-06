/**
 * Attachment media configuration (server authoritative).
 *
 * Mirrors the client-side config in backfeed-app's `lib/media/mediaConfig.ts`.
 * Keep the two in sync; this copy is the source of truth for what is actually
 * accepted, since the client checks are advisory.
 */

/** High-level media kind for an attachment */
type MediaKind = "image" | "video";

/** Bytes in a megabyte */
const MB = 1024 * 1024;

/** Per-kind limits and the MIME types they accept */
const ATTACHMENT_LIMITS: Record<
  MediaKind,
  { maxBytes: number; mimeTypes: readonly string[] }
> = {
  image: {
    maxBytes: 20 * MB,
    mimeTypes: [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/avif",
    ],
  },
  video: {
    maxBytes: 50 * MB,
    mimeTypes: ["video/mp4", "video/webm", "video/quicktime"],
  },
} as const;

/** File extension to use for a given MIME type when building a storage key */
const EXTENSION_BY_MIME_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/quicktime": "mov",
};

/** Resolve the media kind for a MIME type, or null if unsupported */
const kindFromMimeType = (mimeType: string): MediaKind | null => {
  if (ATTACHMENT_LIMITS.image.mimeTypes.includes(mimeType)) return "image";
  if (ATTACHMENT_LIMITS.video.mimeTypes.includes(mimeType)) return "video";
  return null;
};

/** File extension (no dot) for a MIME type, falling back to "bin" */
export const extensionForMimeType = (mimeType: string): string =>
  EXTENSION_BY_MIME_TYPE[mimeType] ?? "bin";

/**
 * Validate a candidate upload. Returns the resolved kind on success, or an
 * error message describing why the file is rejected.
 */
export const validateUpload = (
  mimeType: string,
  fileSize: number,
): { kind: MediaKind } | { error: string } => {
  const kind = kindFromMimeType(mimeType);
  if (!kind) return { error: `Unsupported media type: ${mimeType}` };

  const { maxBytes } = ATTACHMENT_LIMITS[kind];
  if (fileSize > maxBytes) {
    return {
      error: `${kind} exceeds the ${Math.round(maxBytes / MB)}MB limit`,
    };
  }

  return { kind };
};
