/**
 * Environment variables.
 */
export const {
  NODE_ENV,
  PORT = 4000,
  // https://stackoverflow.com/a/68578294
  HOST = "0.0.0.0",
  DATABASE_URL,
  SKIP_AUTH,
  POLAR_ACCESS_TOKEN,
  POLAR_WEBHOOK_SECRET,
  CHECKOUT_SUCCESS_URL,
  AUTH_BASE_URL,
  SANDBOX,
} = process.env;

export const isDevEnv = NODE_ENV === "development";
export const isProdEnv = NODE_ENV === "production";
export const isSandbox = SANDBOX === "true";
