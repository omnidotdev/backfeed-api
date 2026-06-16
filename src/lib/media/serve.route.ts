/**
 * Public attachment serving route.
 *
 * Garage (the S3 backend) does not support anonymous reads, so attachments can't
 * be served directly from a public bucket URL. Instead this route presigns a
 * short-lived GET URL for the object and redirects the browser to it, so an
 * `<img src>` (which carries no auth) can load the file. The stored attachment
 * URL points here, keeping it stable while the underlying presigned URL rotates.
 */

import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Elysia } from "elysia";
import {
  S3_ACCESS_KEY_ID,
  S3_BUCKET,
  S3_ENDPOINT,
  S3_REGION,
  S3_SECRET_ACCESS_KEY,
} from "lib/config/env.config";

/** One hour; long enough for a page's images, short enough to limit URL sharing. */
const PRESIGN_EXPIRY_SECONDS = 60 * 60;

const s3 =
  S3_BUCKET && S3_ACCESS_KEY_ID && S3_SECRET_ACCESS_KEY
    ? new S3Client({
        endpoint: S3_ENDPOINT,
        region: S3_REGION ?? "us-east-1",
        // Garage requires path-style addressing
        forcePathStyle: true,
        credentials: {
          accessKeyId: S3_ACCESS_KEY_ID,
          secretAccessKey: S3_SECRET_ACCESS_KEY,
        },
      })
    : null;

const attachmentServeRoutes = new Elysia({ prefix: "/api/attachments" }).get(
  "/file/*",
  async ({ params, set }) => {
    if (!s3 || !S3_BUCKET) {
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

    try {
      const url = await getSignedUrl(
        s3,
        new GetObjectCommand({ Bucket: S3_BUCKET, Key: key }),
        { expiresIn: PRESIGN_EXPIRY_SECONDS },
      );
      set.status = 302;
      set.headers.Location = url;
      return;
    } catch (error) {
      console.error("[Attachments] Failed to serve object:", error);
      set.status = 502;
      return { error: "Failed to serve attachment" };
    }
  },
);

export default attachmentServeRoutes;
