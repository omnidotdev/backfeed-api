import { EXPORTABLE } from "graphile-export/helpers";
import { context, lambda } from "postgraphile/grafast";
import { extendSchema, gql } from "postgraphile/utils";

import type { SelectUser } from "lib/db/schema";

/**
 * Plugin that adds an `observer` query to return the current authenticated user.
 *
 * The user is already upserted by the authentication plugin during context building,
 * so this query returns the observer data from context.
 *
 * @see https://postgraphile.org/postgraphile/5/extend-schema/
 */
const ObserverPlugin = extendSchema({
  typeDefs: gql`
    """
    The currently authenticated user.
    """
    type Observer {
      rowId: UUID!
      identityProviderId: UUID!
      username: String
      name: String!
      email: String!
    }

    extend type Query {
      """
      Returns the currently authenticated user (observer).
      Returns null if not authenticated.
      """
      observer: Observer
    }
  `,
  plans: {
    Query: {
      observer: EXPORTABLE(
        (context, lambda) =>
          function observer() {
            const $observer = context().get("observer");
            // Use lambda to transform the observer into a plain object (or null)
            // Note: Drizzle uses `id` but PostGraphile exposes it as `rowId`
            return lambda($observer, (observer: SelectUser | null) => {
              if (!observer) return null;
              return {
                rowId: observer.id,
                identityProviderId: observer.identityProviderId,
                username: observer.username,
                name: observer.name,
                email: observer.email,
              };
            });
          },
        [context, lambda],
      ),
    },
  },
});

export default ObserverPlugin;
