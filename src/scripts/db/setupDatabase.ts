/**
 * @file Set up a database.
 */

import { $ } from "bun";

import { DATABASE_URL } from "lib/config/env.config";

const databaseName = DATABASE_URL?.split("/").pop()?.split("?")[0];

console.log(`Creating ${databaseName} database...`);
await $`createdb -U postgres ${databaseName}`;
console.log("Database created");

// Required extensions. `vector` (pgvector) backs the semantic embedding columns
// and similarity search; `pg_trgm` backs the lexical dedupe fallback used when no
// embedding provider is configured. Both are migration-time prerequisites (the
// vector columns are part of the schema regardless of whether embeddings are on).
console.log("Enabling extensions (vector, pg_trgm)...");
await $`psql -U postgres -d ${databaseName} -c "CREATE EXTENSION IF NOT EXISTS vector; CREATE EXTENSION IF NOT EXISTS pg_trgm;"`;
console.log("Extensions enabled");
