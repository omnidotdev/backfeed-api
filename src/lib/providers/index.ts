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
  createFlagProvider,
} from "@omnidotdev/providers";
import {
  AUTHZ_API_URL,
  AUTHZ_SERVICE_KEY,
  BILLING_BASE_URL,
  BILLING_SERVICE_API_KEY,
  FLAGS_API_HOST,
  FLAGS_CLIENT_KEY,
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

export const flags = createFlagProvider(
  FLAGS_API_HOST
    ? {
        provider: "unleash",
        url: FLAGS_API_HOST,
        apiKey: FLAGS_CLIENT_KEY!,
        appName: "backfeed-api",
      }
    : {},
);
