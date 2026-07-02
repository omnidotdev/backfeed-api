/**
 * Image transform helpers shared by attachment serving and upload.
 *
 * Kept as small, focused functions (pure logic plus sharp) so the serve route's
 * on-the-fly `?w=&q=&fm=` derivatives and the upload route's blur-up placeholder
 * can be exercised in isolation.
 */

import sharp from "sharp";

/** Widths a transform request snaps to, to bound the derivative cache */
export const ALLOWED_WIDTHS = [320, 640, 960, 1280, 1600, 1920] as const;

/** Output formats a transform request may ask for */
const ALLOWED_FORMATS = new Set(["webp", "jpeg", "png"]);

/** Content types eligible for on-the-fly transformation */
export const TRANSFORMABLE = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

/** Blur-up placeholder width in pixels */
const LQIP_WIDTH = 16;

type Transform = { width?: number; quality: number; format?: string };

/** Snap a requested width up to the nearest allowed width */
export const snapWidth = (raw: number): number =>
  ALLOWED_WIDTHS.find((w) => w >= raw) ??
  ALLOWED_WIDTHS[ALLOWED_WIDTHS.length - 1];

/**
 * Guess an image content type from a storage key's extension, for deciding
 * transform eligibility. Returns undefined for unknown/non-image extensions.
 */
export const guessImageType = (key: string): string | undefined => {
  const ext = key.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "png":
      return "image/png";
    case "webp":
      return "image/webp";
    case "avif":
      return "image/avif";
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    default:
      return undefined;
  }
};

/** Parse transform params, or null when none/invalid are requested */
export const parseTransform = (
  query: Record<string, string | undefined>,
): Transform | null => {
  const w = query.w ? Number.parseInt(query.w, 10) : undefined;
  const q = query.q ? Number.parseInt(query.q, 10) : undefined;
  const fm = query.fm;

  const hasWidth = w !== undefined && Number.isFinite(w) && w > 0;
  const hasFormat = fm !== undefined && ALLOWED_FORMATS.has(fm);
  if (!hasWidth && !hasFormat) return null;

  return {
    width: hasWidth ? snapWidth(w) : undefined,
    quality: q !== undefined && q >= 1 && q <= 100 ? q : 80,
    format: hasFormat ? fm : undefined,
  };
};

/** Apply a sharp transform, returning the bytes and resulting content type */
export const applyTransform = async (
  input: Buffer,
  transform: Transform,
): Promise<{ bytes: Buffer; contentType: string }> => {
  let pipeline = sharp(input);
  if (transform.width) {
    pipeline = pipeline.resize(transform.width, null, {
      withoutEnlargement: true,
    });
  }

  const format = transform.format ?? "webp";
  if (format === "jpeg")
    pipeline = pipeline.jpeg({ quality: transform.quality });
  else if (format === "png") pipeline = pipeline.png();
  else pipeline = pipeline.webp({ quality: transform.quality });

  return {
    bytes: await pipeline.toBuffer(),
    contentType: `image/${format}`,
  };
};

/**
 * Generate an inline base64 blur-up placeholder (LQIP) from an image buffer: a
 * tiny blurred webp derivative, rendered behind the image until it decodes.
 */
export const generateLqip = async (input: Buffer): Promise<string> => {
  const buffer = await sharp(input)
    .resize(LQIP_WIDTH)
    .webp({ quality: 30 })
    .toBuffer();
  return `data:image/webp;base64,${buffer.toString("base64")}`;
};
