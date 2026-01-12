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
  GRAPHQL_COMPLEXITY_MAX_COST,
  CORS_ALLOWED_ORIGINS,
  BILLING_BYPASS_ORG_IDS,
  ENTITLEMENTS_BASE_URL,
  ENTITLEMENTS_WEBHOOK_SECRET,
  // AuthZ (PDP)
  AUTHZ_ENABLED,
  AUTHZ_PROVIDER_URL,
} = process.env;

export const isDevEnv = NODE_ENV === "development";
export const isProdEnv = NODE_ENV === "production";
export const protectRoutes = isProdEnv || PROTECT_ROUTES === "true";
