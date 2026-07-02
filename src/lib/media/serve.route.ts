/**
 * Public attachment serving route.
 *
 * Streams objects through the API rather than redirecting to the bucket, so
 * serving works regardless of whether the S3 endpoint is reachable from the
 * browser (it is cluster-internal in prod and compose-internal when
 * self-hosting). For images it also supports on-the-fly transforms via
 * `?w=&q=&fm=`, computed with sharp, which powers responsive `srcset`. The
 * stored attachment URL points here, keeping it stable.
 */

import { Elysia } from "elysia";

import { getObject, getObjectBytes, s3 } from "./s3Client";
import {
  TRANSFORMABLE,
  applyTransform,
  guessImageType,
  parseTransform,
} from "./transform";

const attachmentServeRoutes = new Elysia({ prefix: "/api/attachments" }).get(
  "/file/*",
  async ({ params, query, set }) => {
    if (!s3) {
      set.status = 404;
      return { error: "Attachment serving not configured" };
    }

    const key = decodeURIComponent(
      (params as Record<string, string>)["*"] ?? "",
    );
    if (!key) {
      set.status = 400;
      return { error: "Missing key" };
    }

    // Guess content type from the key extension for transform eligibility
    const guessedType = guessImageType(key);

    const transform =
      guessedType && TRANSFORMABLE.has(guessedType)
        ? parseTransform(query as Record<string, string | undefined>)
        : null;

    // No transform: stream the original through the API
    if (!transform) {
      const object = await getObject(key);
      if (!object?.Body) {
        set.status = 404;
        return { error: "Not found" };
      }
      const contentType = object.ContentType ?? "application/octet-stream";
      return new Response(object.Body.transformToWebStream(), {
        headers: {
          "content-type": contentType,
          "cache-control": "private, max-age=31536000, immutable",
        },
      });
    }

    // Transform: read the original and stream a derivative
    const original = await getObjectBytes(key);
    if (!original) {
      set.status = 404;
      return { error: "Not found" };
    }

    try {
      const { bytes, contentType } = await applyTransform(original, transform);
      return new Response(new Uint8Array(bytes), {
        headers: {
          "content-type": contentType,
          "cache-control": "public, max-age=31536000, immutable",
        },
      });
    } catch (error) {
      console.error("[Attachments] Transform failed:", error);
      set.status = 502;
      return { error: "Failed to transform attachment" };
    }
  },
);

export default attachmentServeRoutes;
