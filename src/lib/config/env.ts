/**
 * Environment variables.
 */
export const {
  NODE_ENV,
  PORT = 4000,
  // https://stackoverflow.com/a/68578294
  HOST = "0.0.0.0",
  DATABASE_URL,
  AUTH_JWKS_URL,
} = process.env;

export const isDevEnv = NODE_ENV === "development";
export const isProdEnv = NODE_ENV === "production";
