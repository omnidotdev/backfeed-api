import { existsSync, mkdirSync } from "node:fs";

import { EXPORTABLE, exportSchema } from "graphile-export";
import { getDefaultOrganization } from "lib/auth/organizations";
import {
  AUTHZ_API_URL,
  AUTHZ_ENABLED,
  checkPermission,
  deleteTuples,
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
      "graphile-export": { EXPORTABLE },
      "postgraphile/grafast": { context, sideEffect },
      "lib/authz": {
        AUTHZ_ENABLED,
        AUTHZ_API_URL,
        checkPermission,
        writeTuples,
        deleteTuples,
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

  // Remove invalid globalThis import and use native fetch
  // graphile-export doesn't recognize fetch as a known global
  await replaceInFile({
    files: schemaFilePath,
    from: /import \{ [^}]*\} from "globalThis";\n/g,
    to: "",
  });

  // Replace _fetch with fetch (native global)
  await replaceInFile({
    files: schemaFilePath,
    from: /_fetch/g,
    to: "fetch",
  });
};

await generateGraphqlSchema()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
