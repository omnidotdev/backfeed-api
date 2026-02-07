/**
 * Shared provider instances for Backfeed.
 *
 * Instantiates authorization and billing providers from @omnidotdev/providers
 * with Backfeed-specific configuration from environment variables.
 */

import {
  createAuthzProvider,
  createBillingProvider,
  resolveProvider,
} from "@omnidotdev/providers";
import {
  AUTHZ_API_URL,
  BILLING_BASE_URL,
  BILLING_SERVICE_API_KEY,
  VORTEX_API_URL,
  VORTEX_AUTHZ_WEBHOOK_SECRET,
} from "lib/config/env.config";

const authzProviderName = resolveProvider(process.env.AUTHZ_PROVIDER, "warden");

const billingProviderName = resolveProvider(
  process.env.BILLING_PROVIDER,
  "aether",
);

export const authz = createAuthzProvider(authzProviderName, {
  apiUrl: AUTHZ_API_URL ?? "",
  vortexUrl: VORTEX_API_URL,
  vortexWebhookSecret: VORTEX_AUTHZ_WEBHOOK_SECRET,
  source: "backfeed",
});

export const billing = createBillingProvider(billingProviderName, {
  baseUrl: BILLING_BASE_URL ?? "",
  serviceApiKey: BILLING_SERVICE_API_KEY,
  appId: "backfeed",
});
