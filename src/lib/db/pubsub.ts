import { pgPool } from "lib/db/pool";
import { PgSubscriber } from "postgraphile/adaptors/pg";

/**
 * Postgres LISTEN/NOTIFY subscriber backing GraphQL subscriptions. Holds one
 * pooled connection open for LISTEN and fans Postgres notifications out to the
 * grafast `listen` step by channel. Wired into the Postgraphile preset's
 * pgService so Postgraphile injects it into the GraphQL context as
 * `pgSubscriber`. Publish with `pg_notify(<topic>, <json>)`.
 */
export const pgSubscriber = new PgSubscriber(pgPool);
