/**
 * Feedback attachment upload route.
 *
 * Accepts a single multipart file, validates it against the attachment limits,
 * and writes the bytes to object storage via the shared storage provider. The
 * persisted `attachment` row is created separately through the GraphQL
 * `createAttachment` mutation (so it flows through the authorization plugins),
 * using the metadata returned here.
 */

import { randomUUID } from "node:crypto";

import { extractBearerToken } from "@omnidotdev/providers/graphql";
import { Elysia, t } from "elysia";
import {
  AUTH_BASE_URL,
  PUBLIC_API_URL,
  protectRoutes,
} from "lib/config/env.config";
import { moderateImage } from "lib/moderation/image";
import { storage } from "lib/providers";

import { extensionForMimeType, validateUpload } from "./mediaConfig";
import { generateLqip } from "./transform";

/** One year, in seconds, for immutable content-hashed-ish object caching */
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

/**
 * Resolve the uploader's subject (IDP id) from a bearer token via the
 * userinfo endpoint. Returns null when the token is missing or invalid.
 */
const resolveSubject = async (
  authorization: string | null,
): Promise<string | null> => {
  const token = extractBearerToken(authorization);
  if (!token || !AUTH_BASE_URL) return null;

  try {
    const response = await fetch(`${AUTH_BASE_URL}/oauth2/userinfo`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) return null;

    const claims = (await response.json()) as { sub?: string };
    return claims.sub ?? null;
  } catch {
    return null;
  }
};

/**
 * Attachment upload routes.
 */
const attachmentUploadRoutes = new Elysia({ prefix: "/api/attachments" }).post(
  "/upload",
  async ({ request, body, set }) => {
    const subject = await resolveSubject(request.headers.get("authorization"));

    if (!subject && protectRoutes) {
      set.status = 401;
      return { error: "Unauthorized" };
    }

    const { file } = body;
    if (!file) {
      set.status = 400;
      return { error: "No file provided" };
    }

    const validation = validateUpload(file.type, file.size);
    if ("error" in validation) {
      // 415 for type, 413 for size; both surface the same message to the client
      set.status = file.size > 0 ? 415 : 400;
      return { error: validation.error };
    }

    const extension = extensionForMimeType(file.type);
    const storageKey = `feedback/${subject ?? "anonymous"}/${randomUUID()}.${extension}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    // Screen images through See Less before storing. A hard "block" verdict
    // rejects the upload; lesser verdicts are allowed through. Fails open
    if (validation.kind === "image") {
      const { verdict } = await moderateImage(buffer, file.type);
      if (verdict === "block") {
        set.status = 422;
        return { error: "Image rejected by content moderation" };
      }
    }

    // Derive a blur-up placeholder for images: a tiny blurred derivative,
    // inlined as base64 and rendered behind the image until its bytes decode.
    // Best-effort; a failure here just means no placeholder, never a rejection.
    let lqip: string | undefined;
    if (validation.kind === "image") {
      try {
        lqip = await generateLqip(buffer);
      } catch (error) {
        console.warn("[Attachments] LQIP generation failed:", error);
      }
    }

    try {
      await storage.upload({
        key: storageKey,
        body: buffer,
        contentType: file.type,
        cacheControl: `public, max-age=${ONE_YEAR_SECONDS}, immutable`,
      });

      // Serve through the API route (which streams the bytes and can emit
      // resized/blur-up derivatives); the stored URL stays stable.
      const base = (PUBLIC_API_URL ?? "").replace(/\/$/, "");
      const url = `${base}/api/attachments/file/${encodeURIComponent(storageKey)}`;

      return {
        url,
        storageKey,
        mimeType: file.type,
        fileSize: file.size,
        kind: validation.kind,
        ...(lqip ? { lqip } : {}),
      };
    } catch (error) {
      console.error("[Attachments] Upload failed:", error);
      set.status = 502;
      return { error: "Failed to store attachment" };
    }
  },
  {
    body: t.Object({
      file: t.File(),
    }),
  },
);

export default attachmentUploadRoutes;
