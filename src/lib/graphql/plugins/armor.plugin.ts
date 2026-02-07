import { createArmorPlugins } from "@omnidotdev/providers/graphql";

import { GRAPHQL_MAX_COMPLEXITY_COST, isProdEnv } from "lib/config/env.config";

/**
 * GraphQL Armor security plugins.
 * @see https://github.com/escape-technologies/graphql-armor
 */
const armorPlugin = createArmorPlugins({
  maxCost: +GRAPHQL_MAX_COMPLEXITY_COST!,
  blockFieldSuggestions: isProdEnv,
});

export default armorPlugin;
