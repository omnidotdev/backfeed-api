import db from "lib/db";

export interface GraphQLContext {
  /** Prisma database ORM client. */
  db: typeof db;
}

/**
 * GraphQL server context.
 * @returns GraphQL context.
 */
export const createContext = async (): Promise<GraphQLContext> => ({
  db,
});
