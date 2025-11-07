/**
 * Environment variables.
 */
export const {
  NODE_ENV,
  PORT = 4000,
  // https://stackoverflow.com/a/68578294
  HOST = "0.0.0.0",
  DATABASE_NAME,
  DATABASE_URL,
  PROTECT_ROUTES,
  POLAR_ACCESS_TOKEN,
  POLAR_WEBHOOK_SECRET,
  CHECKOUT_SUCCESS_URL,
  AUTH_BASE_URL,
  ENABLE_POLAR_SANDBOX,
  GRAPHQL_COMPLEXITY_MAX_COST,
} = process.env;

export const isDevEnv = NODE_ENV === "development";
export const isProdEnv = NODE_ENV === "production";
export const enablePolarSandbox = ENABLE_POLAR_SANDBOX === "true";
export const protectRoutes = isProdEnv || PROTECT_ROUTES === "true";
