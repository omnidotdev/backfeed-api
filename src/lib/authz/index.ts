/**
 * Authorization module for Backfeed.
 *
 * Provides EXPORTABLE-compatible functions for PostGraphile plugins
 * to check permissions and sync tuples to PDP (OpenFGA).
 */

export * from "./sync";
export * from "./types";
export { default as authzRoutes } from "./routes";
