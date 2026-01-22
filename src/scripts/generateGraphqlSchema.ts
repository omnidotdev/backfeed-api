import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";

import { EXPORTABLE, exportSchema } from "graphile-export";
import { printSchema } from "graphql";
import { getDefaultOrganization } from "lib/auth/organizations";
import {
  checkPermission,
  deleteTuples,
  isAuthzEnabled,
  writeTuples,
} from "lib/authz";
import preset from "lib/config/graphile.config";
import { checkOrganizationLimit, isWithinLimit } from "lib/entitlements";
import {
  FEATURE_KEYS,
  billingBypassOrgIds,
} from "lib/graphql/plugins/authorization/constants";
import { validateOrgExists } from "lib/idp/validateOrg";
import { makeSchema } from "postgraphile";
import { context, sideEffect } from "postgraphile/grafast";
import { replaceInFile } from "replace-in-file";

const SRC_DIR = `${__dirname}/..`;
const CACHE_DIR = `${__dirname}/../../.cache`;
const HASH_FILE = `${CACHE_DIR}/schema-hash`;

/**
 * Directories and files that affect the generated GraphQL schema.
 * Changes to any of these should trigger schema regeneration.
 *
 * Note: We don't track lib/authz, lib/entitlements, etc. because those
 * are just function references imported by the generated schema. Their
 * internal implementation doesn't affect the generated output - only
 * the plugin code that calls them matters.
 */
const SCHEMA_DEPENDENCIES = {
  directories: [
    // Database schema definitions → GraphQL types
    "lib/db/schema",
    // GraphQL plugins (EXPORTABLE code gets serialized into output)
    "lib/graphql/plugins",
  ],
  files: [
    // Graphile configuration (plugins list, schema settings)
    "lib/config/graphile.config.ts",
  ],
};

/**
 * Get all TypeScript files from a directory recursively.
 */
const getFilesFromDirectory = (dir: string): string[] => {
  const fullPath = join(SRC_DIR, dir);
  if (!existsSync(fullPath)) return [];

  return readdirSync(fullPath, { recursive: true })
    .filter((f): f is string => typeof f === "string" && f.endsWith(".ts"))
    .map((f) => join(dir, f))
    .sort();
};

/**
 * Compute hash of all files that affect schema generation.
 */
const computeSchemaHash = (): string => {
  const hash = createHash("sha256");

  // Collect all files from tracked directories
  const allFiles: string[] = [];

  for (const dir of SCHEMA_DEPENDENCIES.directories) {
    allFiles.push(...getFilesFromDirectory(dir));
  }

  // Add individual tracked files
  for (const file of SCHEMA_DEPENDENCIES.files) {
    if (existsSync(join(SRC_DIR, file))) {
      allFiles.push(file);
    }
  }

  // Sort for deterministic ordering
  allFiles.sort();

  // Hash each file's path and content
  for (const file of allFiles) {
    const fullPath = join(SRC_DIR, file);
    const content = readFileSync(fullPath);
    hash.update(file);
    hash.update(content);
  }

  return hash.digest("hex");
};

/**
 * Check if schema dependencies have changed since last generation.
 */
const hasSchemaChanged = (): boolean => {
  if (!existsSync(HASH_FILE)) return true;

  const currentHash = computeSchemaHash();
  const storedHash = readFileSync(HASH_FILE, "utf-8").trim();

  return currentHash !== storedHash;
};

/**
 * Generate a GraphQL schema from the database.
 * @see https://postgraphile.org/postgraphile/next/exporting-schema
 */
const generateGraphqlSchema = async () => {
  // skip if schema unchanged
  if (!hasSchemaChanged()) {
    console.info("[graphql:generate] Schema unchanged, skipping generation");
    return;
  }

  const { schema } = await makeSchema(preset);

  const generatedDirectory = `${__dirname}/../generated/graphql`;
  const schemaFilePath = `${generatedDirectory}/schema.executable.ts`;

  // create artifacts directory if it doesn't exist
  if (!existsSync(generatedDirectory))
    mkdirSync(generatedDirectory, { recursive: true });

  await exportSchema(schema, schemaFilePath, {
    mode: "typeDefs",
    modules: {
      "graphile-export": { EXPORTABLE },
      "postgraphile/grafast": { context, sideEffect },
      "lib/authz": {
        checkPermission,
        deleteTuples,
        isAuthzEnabled,
        writeTuples,
      },
      "lib/entitlements": { isWithinLimit, checkOrganizationLimit },
      "lib/graphql/plugins/authorization/constants": {
        FEATURE_KEYS,
        billingBypassOrgIds,
      },
      "lib/auth/organizations": { getDefaultOrganization },
      "lib/idp/validateOrg": { validateOrgExists },
    },
  });

  await replaceInFile({
    files: schemaFilePath,
    from: /\/\* eslint-disable graphile-export[^*]+\*\//g,
    to: "// @ts-nocheck",
  });

  // emit SDL
  writeFileSync(`${generatedDirectory}/schema.graphql`, printSchema(schema));

  // save hash
  if (!existsSync(CACHE_DIR)) mkdirSync(CACHE_DIR, { recursive: true });
  writeFileSync(HASH_FILE, computeSchemaHash());

  console.info("[graphql:generate] Schema generated successfully");
};

await generateGraphqlSchema()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
