// TODO https://github.com/prisma/prisma/issues/5030
// import type { Config } from "prisma-generator-pothos-codegen";

/**
 * *Prisma Generator Pothos Codegen* configuration.
 */
/** @type {import('prisma-generator-pothos-codegen').Config} */
// const config: Config = {
module.exports = {
  inputs: {
    outputFilePath: "./src/graphql/generated/inputs.ts",
    prismaImporter: 'import type { Prisma } from "@prisma/client";',
  },
  crud: {
    outputDir: "./src/graphql/generated/",
    prismaCaller: "_context.db",
  },
  global: {
    builderImporter: `import { builder } from "graphql/schema";`,
    // NB: `// @ts-nocheck` is already prepended to some generated artifacts, but not others. This is an upstream issue, but is harmless (worst case, there are duplicate directives in a file).
    // @ts-ignore
    replacer: (generated, _position) => {
      // prefix files with `@ts-nocheck` to prevent type checking
      return `// @ts-nocheck\n${generated}`;
    },
  },
};

// export default config;
