/**
 * Raw S3 client for attachment serving.
 *
 * The shared storage provider (`lib/providers#storage`) handles uploads (PUT),
 * but serving needs to read objects back: streaming originals to the browser and
 * reading bytes for on-the-fly image transforms. Attachments are streamed
 * through the API (not served via presigned redirect) so serving works
 * regardless of whether the S3 endpoint is reachable from the browser (it is
 * cluster-internal in prod and compose-internal when self-hosting).
 */

import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import {
  S3_ACCESS_KEY_ID,
  S3_BUCKET,
  S3_ENDPOINT,
  S3_REGION,
  S3_SECRET_ACCESS_KEY,
} from "lib/config/env.config";

import type { GetObjectCommandOutput } from "@aws-sdk/client-s3";

export const s3 =
  S3_BUCKET && S3_ACCESS_KEY_ID && S3_SECRET_ACCESS_KEY
    ? new S3Client({
        endpoint: S3_ENDPOINT,
        region: S3_REGION ?? "us-east-1",
        // Garage and MinIO require path-style addressing
        forcePathStyle: true,
        credentials: {
          accessKeyId: S3_ACCESS_KEY_ID,
          secretAccessKey: S3_SECRET_ACCESS_KEY,
        },
      })
    : null;

/** Fetch an object (with its body stream + content metadata), or null if missing */
export const getObject = async (
  key: string,
): Promise<GetObjectCommandOutput | null> => {
  if (!s3 || !S3_BUCKET) return null;
  try {
    const response = await s3.send(
      new GetObjectCommand({ Bucket: S3_BUCKET, Key: key }),
    );
    return response.Body ? response : null;
  } catch {
    return null;
  }
};

/** Read an object's full bytes, or null if missing / storage is off */
export const getObjectBytes = async (key: string): Promise<Buffer | null> => {
  const response = await getObject(key);
  if (!response?.Body) return null;
  const bytes = await response.Body.transformToByteArray();
  return Buffer.from(bytes);
};
