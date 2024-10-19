import { existsSync, mkdirSync } from "node:fs";
import { exportSchema } from "graphile-export";
import { makeSchema } from "postgraphile";
import { replaceInFile } from "replace-in-file";

import preset from "../../graphile.config";

const main = async () => {
  const { schema } = await makeSchema(preset);

  const generatedDirectory = `${__dirname}/../graphql/generated`;
  const schemaFilePath = `${generatedDirectory}/schema.executable.ts`;

  if (!existsSync(generatedDirectory)) {
    mkdirSync(generatedDirectory);
  }

  await exportSchema(schema, schemaFilePath, {
    mode: "typeDefs",
  });

  await replaceInFile({
    files: schemaFilePath,
    from: /\/\* eslint-disable graphile-export\/export-instances, graphile-export\/export-methods, graphile-export\/exhaustive-deps \*\//g,
    to: "// @ts-nocheck",
  });
};

await main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
