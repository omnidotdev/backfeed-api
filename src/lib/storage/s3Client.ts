/**
 * Hardened S3 client factory.
 *
 * The default @aws-sdk/client-s3 request handler pools keep-alive sockets and
 * sets no request timeout that actually aborts. Against s3.omni.dev (Garage
 * reached through a NAT/edge that silently idle-drops long-lived TCP
 * connections without a RST) the pool fills with zombie ESTABLISHED sockets;
 * the SDK keeps reusing them and every reuse blocks until the Fractal gateway
 * gives up (~30s) and returns 503.
 *
 * This surfaced on 2026-09-01 as the halo-api media outage: every media request
 * timed out on a poisoned socket pool, and a pod restart only cleared it until
 * the pool re-poisoned within the hour under normal traffic. The same failure
 * mode applies to any service talking to Garage over the same edge, so this
 * factory is the shared guard against the stale keep-alive socket hang.
 *
 * Two things fix it, and both are load-bearing on Bun (the runtime here):
 *   1. `keepAlive: false` - never reuse a socket, so a dropped connection can
 *      never become a zombie the next request blocks on. Each request opens a
 *      fresh connection to a healthy Garage (measured 23-79ms).
 *   2. `throwOnRequestTimeout: true` alongside `requestTimeout` - a plain
 *      `requestTimeout` on @smithy/node-http-handler v4 only LOGS a warning and
 *      lets the request keep hanging; the flag is what turns the timeout into a
 *      thrown error (verified on Bun 1.4). This is the backstop for a genuinely
 *      stuck fresh connection, letting the SDK retry instead of hanging.
 */

import { Agent as HttpAgent } from "node:http";
import { Agent as HttpsAgent } from "node:https";

import { S3Client } from "@aws-sdk/client-s3";
import { NodeHttpHandler } from "@smithy/node-http-handler";

import type { S3ClientConfig } from "@aws-sdk/client-s3";

/**
 * Fail a stalled connect attempt fast. A healthy connect to Garage completes
 * in a few milliseconds, so anything beyond this is a dead path, not a slow one
 */
export const S3_CONNECTION_TIMEOUT_MS = 3_000;

/**
 * Abort a request whose socket stops responding. This MUST stay below the
 * Fractal gateway's upstream timeout (see {@link GATEWAY_UPSTREAM_TIMEOUT_MS})
 * so a stuck request errors here (and the SDK retries) instead of the gateway
 * 503ing the browser first. Only fires as an error because
 * {@link buildRequestHandler} sets `throwOnRequestTimeout`
 */
export const S3_REQUEST_TIMEOUT_MS = 10_000;

/**
 * The Fractal gateway (Envoy) upstream request timeout observed during the
 * incident. Kept here so the invariant {@link S3_REQUEST_TIMEOUT_MS} `<` this
 * is enforceable in tests, not just asserted in a comment
 */
export const GATEWAY_UPSTREAM_TIMEOUT_MS = 15_000;

interface ResilientS3Overrides {
  /** Override the connect timeout (ms). Tests use a short value. */
  connectionTimeoutMs?: number;
  /** Override the request timeout (ms). Tests use a short value. */
  requestTimeoutMs?: number;
}

/**
 * Timeout options fed to the SDK request handler. Exported so a regression
 * test can assert the client is built with real, throwing timeouts (the
 * default handler leaves the request timeout non-throwing, which is the exact
 * hole the incident fell through)
 */
export const s3RequestHandlerOptions = (
  overrides: ResilientS3Overrides = {},
) => ({
  connectionTimeout: overrides.connectionTimeoutMs ?? S3_CONNECTION_TIMEOUT_MS,
  requestTimeout: overrides.requestTimeoutMs ?? S3_REQUEST_TIMEOUT_MS,
  // Without this, @smithy/node-http-handler v4 only warns on a request timeout
  // and the request keeps hanging. This makes it throw so the SDK can retry
  throwOnRequestTimeout: true,
});

const buildRequestHandler = (
  overrides: ResilientS3Overrides,
): NodeHttpHandler => {
  // keepAlive:false is the core of the fix. A reused socket is the only way a
  // silently-dropped connection turns into an indefinite hang, so we never
  // reuse one. The per-request TLS handshake cost is negligible next to the
  // Cloudflare edge cache that fronts these objects
  const agentOptions = { keepAlive: false };

  return new NodeHttpHandler({
    ...s3RequestHandlerOptions(overrides),
    httpAgent: new HttpAgent(agentOptions),
    httpsAgent: new HttpsAgent(agentOptions),
  });
};

/**
 * Build an S3 client hardened against the stale keep-alive socket hang.
 *
 * Prefer this over `new S3Client(...)` for every S3-backed feature so a dropped
 * connection can never hang the request path.
 *
 * @param config - Standard S3 client config (region, endpoint, credentials).
 * @param overrides - Timeout overrides, primarily for tests.
 */
export const createResilientS3Client = (
  config: S3ClientConfig,
  overrides: ResilientS3Overrides = {},
): S3Client =>
  new S3Client({ ...config, requestHandler: buildRequestHandler(overrides) });
