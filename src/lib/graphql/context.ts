import { createWithPgClient } from "@dataplan/pg/adaptors/pg";

import { dbPool } from "lib/db/db";
import { pgPool } from "lib/db/pool";

import type { YogaInitialContext } from "graphql-yoga";
import type { WithPgClient } from "postgraphile/@dataplan/pg";
import type { NodePostgresPgClient } from "postgraphile/adaptors/pg";

const withPgClient = createWithPgClient({ pool: pgPool });

export interface GraphQLContext {
  db: typeof dbPool;
  request: Request;
  withPgClient: WithPgClient<NodePostgresPgClient>;
}

export const createGraphQLContext = async ({
  request,
}: YogaInitialContext): Promise<GraphQLContext> => ({
  db: dbPool,
  request,
  withPgClient,
});
