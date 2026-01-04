import { existsSync, mkdirSync } from "node:fs";

import { exportSchema } from "graphile-export";
import { EXPORTABLE } from "graphile-export/helpers";
import preset from "lib/config/graphile.config";
import { checkWorkspaceLimit, isWithinLimit } from "lib/entitlements";
import {
  FEATURE_KEYS,
  billingBypassSlugs,
} from "lib/graphql/plugins/authorization/constants";
import { makeSchema } from "postgraphile";
import { context, sideEffect } from "postgraphile/grafast";
import { replaceInFile } from "replace-in-file";

/**
 * Generate a GraphQL schema from the database.
 * @see https://postgraphile.org/postgraphile/next/exporting-schema
 */
const generateGraphqlSchema = async () => {
  const { schema } = await makeSchema(preset);

  const generatedDirectory = `${__dirname}/../generated/graphql`;
  const schemaFilePath = `${generatedDirectory}/schema.executable.ts`;

  // create artifacts directory if it doesn't exist
  if (!existsSync(generatedDirectory))
    mkdirSync(generatedDirectory, {
      recursive: true,
    });

  await exportSchema(schema, schemaFilePath, {
    mode: "typeDefs",
    modules: {
      "graphile-export/helpers": { EXPORTABLE },
      "postgraphile/grafast": { context, sideEffect },
      "lib/entitlements": { isWithinLimit, checkWorkspaceLimit },
      "lib/graphql/plugins/authorization/constants": {
        FEATURE_KEYS,
        billingBypassSlugs,
      },
    },
  });

  await replaceInFile({
    files: schemaFilePath,
    from: /\/\* eslint-disable graphile-export\/export-instances, graphile-export\/export-methods, graphile-export\/exhaustive-deps \*\//g,
    to: "// @ts-nocheck",
  });
};

await generateGraphqlSchema()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
