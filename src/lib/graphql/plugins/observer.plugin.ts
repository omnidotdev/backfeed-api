import { createObserverPlugin } from "@omnidotdev/providers/graphql";

/**
 * Plugin that adds an `observer` query to return the current authenticated user.
 * @see https://postgraphile.org/postgraphile/5/extend-schema/
 */
const ObserverPlugin = createObserverPlugin({
  extraFields: [{ name: "username", type: "String" }],
});

export default ObserverPlugin;
