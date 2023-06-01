import { generateAllCrud } from "graphql/generated/autocrud";
import { builder } from "graphql/schema";

// NB: below are shims for Pothos Prisma codegen to work properly
builder.queryType({});
builder.mutationType({});
// builder.subscriptionType({});

// generate CRUD resolvers and types based on Prisma schema
generateAllCrud();

/**
 * GraphQL schema.
 */
const schema = builder.toSchema({
  // disable schema sorting (e.g. maintain enum ordering)
  sortSchema: false,
});

export default schema;
