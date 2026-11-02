import { DATABASE_URL } from "lib/config/env.config";
import { Pool } from "pg";

/**
 * Postgres database pool.
 * @see https://node-postgres.com/apis/pool
 */
export const pgPool = new Pool({
  connectionString: DATABASE_URL,
  // Fail fast on acquire and free a wedged connection so the pool self-heals, since a per-request auth upsert can otherwise drain the pool
  connectionTimeoutMillis: 5_000,
  query_timeout: 10_000,
  statement_timeout: 10_000,
  idle_in_transaction_session_timeout: 10_000,
  // Send TCP keepalive probes so a network blip that silently severs an idle
  // connection is detected by the OS and the dead socket evicted, instead of
  // being handed to the next request and surfacing as "Connection terminated
  // unexpectedly". Without this a brief pod-to-pod blip lingers for minutes as
  // stale connections are reused before they age out
  keepAlive: true,
  keepAliveInitialDelayMillis: 10_000,
});

// An idle pooled client can still error after checkout (backend restart, network
// partition). node-postgres emits these on the pool itself; with no listener the
// error is thrown and crashes the process. Log and swallow so a transient DB
// connectivity blip degrades gracefully instead of taking the whole API down
pgPool.on("error", (err) => {
  console.warn("pg pool idle client error:", err.message);
});
