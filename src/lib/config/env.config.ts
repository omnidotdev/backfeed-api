/**
 * Environment variables.
 */
export const {
  NODE_ENV,
  PORT = 4000,
  // https://stackoverflow.com/a/68578294
  HOST = "0.0.0.0",
  DATABASE_URL,
  PROTECT_ROUTES,
  CHECKOUT_SUCCESS_URL,
  AUTH_BASE_URL,
  GRAPHQL_MAX_COMPLEXITY_COST,
  CORS_ALLOWED_ORIGINS,
  BILLING_BYPASS_ORG_IDS,
  BILLING_BASE_URL,
  BILLING_SERVICE_API_KEY,
  BILLING_WEBHOOK_SECRET,
  SELF_HOSTED,
  // AuthZ (PDP)
  AUTHZ_ENABLED,
  AUTHZ_API_URL,
  // Vortex (durable event sync)
  VORTEX_API_URL,
  VORTEX_AUTHZ_WEBHOOK_SECRET,
  // Auth webhook
  AUTH_WEBHOOK_SECRET,
  // Feature flags
  FLAGS_API_HOST,
  FLAGS_CLIENT_KEY,
} = process.env;

export const isDevEnv = NODE_ENV === "development";
export const isProdEnv = NODE_ENV === "production";
export const protectRoutes = isProdEnv || PROTECT_ROUTES === "true";
export const isSelfHosted = SELF_HOSTED === "true";
