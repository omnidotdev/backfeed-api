/**
 * Compute and persist the schema dependency hash.
 *
 * Run during Docker build so that the startup `graphql:generate` step
 * can skip the expensive PostGraphile DB introspection when the schema
 * source files haven't changed.
 */

import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";

const SRC_DIR = `${__dirname}/..`;
const CACHE_DIR = `${__dirname}/../../.cache`;
const HASH_FILE = `${CACHE_DIR}/schema-hash`;

const SCHEMA_DEPENDENCIES = {
  directories: ["lib/db/schema", "lib/graphql/plugins"],
  files: ["lib/config/graphile.config.ts"],
};

const getFilesFromDirectory = (dir: string): string[] => {
  const fullPath = join(SRC_DIR, dir);
  if (!existsSync(fullPath)) return [];

  return readdirSync(fullPath, { recursive: true })
    .filter((f): f is string => typeof f === "string" && f.endsWith(".ts"))
    .map((f) => join(dir, f))
    .sort();
};

const computeSchemaHash = (): string => {
  const hash = createHash("sha256");

  const allFiles: string[] = [];

  for (const dir of SCHEMA_DEPENDENCIES.directories) {
    allFiles.push(...getFilesFromDirectory(dir));
  }

  for (const file of SCHEMA_DEPENDENCIES.files) {
    if (existsSync(join(SRC_DIR, file))) {
      allFiles.push(file);
    }
  }

  allFiles.sort();

  for (const file of allFiles) {
    const fullPath = join(SRC_DIR, file);
    const content = readFileSync(fullPath);
    hash.update(file);
    hash.update(content);
  }

  return hash.digest("hex");
};

if (!existsSync(CACHE_DIR)) mkdirSync(CACHE_DIR, { recursive: true });

const schemaHash = computeSchemaHash();
writeFileSync(HASH_FILE, schemaHash);

console.info(`[cacheSchemaHash] Cached schema hash: ${schemaHash}`);
