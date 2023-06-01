import SchemaBuilder from "@pothos/core";
import PrismaPlugin from "@pothos/plugin-prisma";
import db from "lib/db";

import type PrismaTypes from "@pothos/plugin-prisma/generated";
import type { Prisma } from "@prisma/client";
import type { GraphQLContext } from "graphql/context";
import type { Scalars } from "prisma-generator-pothos-codegen";

interface Builder {
  /** GraphQL context. */
  Context: GraphQLContext;
  PrismaTypes: PrismaTypes;
  Scalars: Scalars<
    Prisma.Decimal,
    Prisma.InputJsonValue | null,
    Prisma.InputJsonValue
  >;
}

/**
 * GraphQL schema builder. Used in intermediate step to create the schema.
 */
const schemaBuilder = new SchemaBuilder<Builder>({
  plugins: [PrismaPlugin],
  // ! NB: Prisma client in context *may* result in slower type-checking, hindering DX. See https://pothos-graphql.dev/docs/plugins/prisma#set-up-the-builder
  prisma: {
    client: db,
    // use `where` clause from `prismaRelatedConnection` for `totalCount` (will be true by default in next major Pothos Prisma plugin version)
    filterConnectionTotalCount: true,
  },
});

export default schemaBuilder;
