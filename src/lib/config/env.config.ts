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
  GRAPHQL_MAX_COMPLEXITY_COST,
  CORS_ALLOWED_ORIGINS,
  BILLING_BYPASS_ORG_IDS,
  BILLING_BASE_URL,
  BILLING_SERVICE_API_KEY,
  BILLING_WEBHOOK_SECRET,
  // AuthZ (PDP)

  AUTHZ_API_URL,
  AUTHZ_SERVICE_KEY,
  // Vortex (durable event sync)
  VORTEX_API_URL,
  VORTEX_AUTHZ_WEBHOOK_SECRET,
  /** Vortex event streaming API key */
  VORTEX_API_KEY,
  // Auth webhook
  AUTH_WEBHOOK_SECRET,
  // Feature flags
  FLAGS_API_HOST,
  FLAGS_CLIENT_KEY,
  // Meilisearch (unified search)
  MEILISEARCH_URL,
  MEILISEARCH_MASTER_KEY,
  // Object storage (feedback attachments)
  S3_BUCKET,
  S3_REGION,
  S3_ENDPOINT,
  S3_ACCESS_KEY_ID,
  S3_SECRET_ACCESS_KEY,
  /** Override base URL for public object URLs (e.g. a CDN in front of the bucket) */
  S3_PUBLIC_BASE_URL,
  // Embeddings (semantic dedupe + clustering). OpenAI-compatible /embeddings API;
  // when unset, the brain falls back to lexical (pg_trgm) dedupe and clustering is off.
  EMBEDDING_API_URL,
  EMBEDDING_API_KEY,
  EMBEDDING_MODEL,
  // Inbound email ingestion (Herald -> webhook). Messages to <project-key>@<domain>
  // become signals; disabled when either is unset.
  HERALD_WEBHOOK_SECRET,
  INBOUND_EMAIL_DOMAIN,
  // Content moderation (Say Less). When unset, moderation is a noop (content
  // always allowed).
  SAY_LESS_URL,
  // Public base URL of this API (e.g. https://api.backfeed.omni.dev). Used to
  // build absolute attachment URLs served through the media proxy route.
  PUBLIC_API_URL,
} = process.env;

export const isDevEnv = NODE_ENV === "development";
export const isProdEnv = NODE_ENV === "production";
export const protectRoutes = isProdEnv || PROTECT_ROUTES === "true";
export const hasBilling = !!BILLING_BASE_URL;

/** Whether search indexing is enabled */
export const isSearchEnabled = !!MEILISEARCH_URL && !!MEILISEARCH_MASTER_KEY;

/** Whether object storage (real attachment uploads) is configured */
export const isStorageEnabled = !!S3_BUCKET;

/** Whether a semantic embedding provider is configured (else lexical fallback) */
export const isEmbeddingEnabled = !!EMBEDDING_API_URL;

/** Whether inbound email ingestion is configured */
export const isEmailIngestionEnabled =
  !!HERALD_WEBHOOK_SECRET && !!INBOUND_EMAIL_DOMAIN;

/** Whether content moderation (Say Less) is configured */
export const isModerationEnabled = !!SAY_LESS_URL;

// Startup warnings for optional integrations
if (!BILLING_BASE_URL)
  console.warn("BILLING_BASE_URL not set, billing disabled");
if (!AUTHZ_API_URL)
  console.warn("AUTHZ_API_URL not set, authorization disabled");
if (!VORTEX_API_URL)
  console.warn("VORTEX_API_URL not set, event streaming disabled");
if (!FLAGS_API_HOST)
  console.warn("FLAGS_API_HOST not set, feature flags disabled");
if (!MEILISEARCH_URL) console.warn("MEILISEARCH_URL not set, search disabled");
if (!S3_BUCKET)
  console.warn(
    "S3_BUCKET not set, attachment uploads use the noop storage provider (files are not persisted)",
  );
if (!EMBEDDING_API_URL)
  console.warn(
    "EMBEDDING_API_URL not set, semantic dedupe/clustering disabled (lexical fallback)",
  );
if (!isEmailIngestionEnabled)
  console.warn(
    "HERALD_WEBHOOK_SECRET / INBOUND_EMAIL_DOMAIN not set, inbound email ingestion disabled",
  );
if (!SAY_LESS_URL)
  console.warn("SAY_LESS_URL not set, content moderation disabled");
