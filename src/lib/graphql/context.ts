import { createWithPgClient } from "@dataplan/pg/adaptors/pg";

import { dbClient } from "lib/db/db";
import { pgPool } from "lib/db/pool";

import type { YogaInitialContext } from "graphql-yoga";
import type { WithPgClient } from "postgraphile/@dataplan/pg";
import type { NodePostgresPgClient } from "postgraphile/adaptors/pg";

const withPgClient = createWithPgClient({ pool: pgPool });

export interface GraphQLContext {
  db: typeof dbClient;
  request: Request;
  withPgClient: WithPgClient<NodePostgresPgClient>;
}

export const createGraphQLContext = async ({
  request,
}: YogaInitialContext): Promise<GraphQLContext> => ({
  db: dbClient,
  request,
  withPgClient,
});
