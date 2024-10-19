/**
 * Environment variables.
 */
export const {
  NODE_ENV,
  PORT = 4000,
  // https://stackoverflow.com/a/68578294
  HOST = "0.0.0.0",
  DATABASE_URL,
} = process.env;

export const isDev = NODE_ENV === "development";
export const isProd = NODE_ENV === "production";
