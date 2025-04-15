import { createWithPgClient } from "@dataplan/pg/adaptors/pg";

import { dbPool } from "lib/db/db";
import { pgPool } from "lib/db/pool";

import type { YogaInitialContext } from "graphql-yoga";
import type { SelectUser } from "lib/drizzle/schema";
import type { WithPgClient } from "postgraphile/@dataplan/pg";
import type {
  NodePostgresPgClient,
  PgSubscriber,
} from "postgraphile/adaptors/pg";

const withPgClient = createWithPgClient({ pool: pgPool });

export enum SubscriptionTier {
  BASIC = "basic",
  TEAM = "team",
  ENTERPRISE = "enterprise",
}

interface CurrentUser extends SelectUser {
  /** Current subscription tier for the user making the request. Injected by the `useAuth` plugin. */
  tier: SubscriptionTier | null;
}

export interface GraphQLContext {
  // TODO: determine if we can customize this to be `observer` rather than `currentUser` during the context injection process
  /** The current user making the request. Injected by the `useAuth` plugin. */
  currentUser: CurrentUser | null;
  db: typeof dbPool;
  request: Request;
  withPgClient: WithPgClient<NodePostgresPgClient>;
  /** The Postgres settings for the current request. Injected by postgraphile.*/
  pgSettings: Record<string, string | undefined> | null;
  /** The Postgres subscription client for the current request. Injected by postgraphile. */
  pgSubscriber: PgSubscriber | null;
}

/**
 * Create a GraphQL context.
 * @see https://graphql.org/learn/execution/#root-fields-and-resolvers
 */
export const createGraphQLContext = async ({
  request,
}: YogaInitialContext): Promise<
  Omit<GraphQLContext, "currentUser" | "tier" | "pgSettings" | "pgSubscriber">
> => ({
  db: dbPool,
  request,
  withPgClient,
});
