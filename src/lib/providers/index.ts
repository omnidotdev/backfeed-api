/**
 * Shared provider instances for Backfeed.
 *
 * Instantiates authorization and billing providers from @omnidotdev/providers
 * with Backfeed-specific configuration from environment variables.
 */

import {
  createAuthzProvider,
  createBillingProvider,
  createEventsProvider,
  createNotificationProvider,
  createStorageProvider,
} from "@omnidotdev/providers";
import {
  AUTHZ_API_URL,
  AUTHZ_SERVICE_KEY,
  BILLING_BASE_URL,
  BILLING_SERVICE_API_KEY,
  HERALD_API_KEY,
  HERALD_API_URL,
  HERALD_DEFAULT_FROM,
  S3_ACCESS_KEY_ID,
  S3_BUCKET,
  S3_ENDPOINT,
  S3_PUBLIC_BASE_URL,
  S3_REGION,
  S3_SECRET_ACCESS_KEY,
  VORTEX_API_KEY,
  VORTEX_API_URL,
  VORTEX_AUTHZ_WEBHOOK_SECRET,
} from "lib/config/env.config";

export const authz = AUTHZ_API_URL
  ? createAuthzProvider({
      apiUrl: AUTHZ_API_URL,
      serviceKey: AUTHZ_SERVICE_KEY,
      vortexUrl: VORTEX_API_URL,
      vortexWebhookSecret: VORTEX_AUTHZ_WEBHOOK_SECRET,
      source: "backfeed",
    })
  : undefined;

export const billing = BILLING_BASE_URL
  ? createBillingProvider({
      provider: "aether",
      baseUrl: BILLING_BASE_URL,
      serviceApiKey: BILLING_SERVICE_API_KEY,
      appId: "backfeed",
    })
  : undefined;

export const events = createEventsProvider(
  VORTEX_API_URL && VORTEX_API_KEY
    ? {
        provider: "http",
        baseUrl: VORTEX_API_URL,
        apiKey: VORTEX_API_KEY,
        source: "omni.backfeed",
      }
    : {},
);

/**
 * Outbound email notifications via Herald. Falls back to the noop provider
 * (sends succeed as no-ops) when Herald is not configured, so the app boots
 * without notification config.
 */
export const notifications = createNotificationProvider(
  HERALD_API_URL && HERALD_API_KEY && HERALD_DEFAULT_FROM
    ? {
        provider: "herald",
        apiUrl: HERALD_API_URL,
        apiKey: HERALD_API_KEY,
        defaultFrom: HERALD_DEFAULT_FROM,
      }
    : {},
);

/**
 * Object storage for feedback attachments.
 *
 * Uses an S3-compatible backend when `S3_BUCKET` is configured, otherwise
 * falls back to the noop provider (uploads succeed but bytes are not
 * persisted) so the app boots without storage configuration.
 */
export const storage = createStorageProvider(
  S3_BUCKET
    ? {
        provider: "s3",
        bucket: S3_BUCKET,
        region: S3_REGION,
        endpoint: S3_ENDPOINT,
        publicBaseUrl: S3_PUBLIC_BASE_URL,
        // Garage (and other S3-compatible stores) require path-style addressing;
        // the default only enables it for localhost, so virtual-host requests to
        // <bucket>.s3.omni.dev fail to resolve and uploads error out.
        forcePathStyle: true,
        credentials:
          S3_ACCESS_KEY_ID && S3_SECRET_ACCESS_KEY
            ? {
                accessKeyId: S3_ACCESS_KEY_ID,
                secretAccessKey: S3_SECRET_ACCESS_KEY,
              }
            : undefined,
      }
    : {},
);
