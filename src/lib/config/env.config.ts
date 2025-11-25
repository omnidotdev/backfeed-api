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
  CHECKOUT_SUCCESS_URL,
  AUTH_BASE_URL,
  GRAPHQL_COMPLEXITY_MAX_COST,
} = process.env;

export const isDevEnv = NODE_ENV === "development";
export const isProdEnv = NODE_ENV === "production";
export const protectRoutes = isProdEnv || PROTECT_ROUTES === "true";

// payment processing
export const STRIPE_PRODUCT_IDS =
  process.env.STRIPE_PRODUCT_IDS?.split(",") ?? [];
