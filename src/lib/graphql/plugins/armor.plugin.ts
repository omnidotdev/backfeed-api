import { EnvelopArmor } from "@escape.tech/graphql-armor";

import { GRAPHQL_COMPLEXITY_MAX_COST, isProdEnv } from "lib/config/env.config";

/**
 * GraphQL Armor security plugin.
 * @see https://github.com/escape-technologies/graphql-armor
 */
const armor = new EnvelopArmor({
  // https://escape.tech/graphql-armor/docs/plugins/block-field-suggestions
  blockFieldSuggestion: {
    enabled: isProdEnv,
  },
  // https://escape.tech/graphql-armor/docs/plugins/max-depth
  maxDepth: {
    enabled: true,
    n: 10,
  },
  // https://escape.tech/graphql-armor/docs/plugins/cost-limit
  costLimit: {
    enabled: true,
    maxCost: +GRAPHQL_COMPLEXITY_MAX_COST!,
    objectCost: 2,
    scalarCost: 1,
    depthCostFactor: 1.5,
    ignoreIntrospection: true,
  },
});

const { plugins: armorPlugin } = armor.protect();

export default armorPlugin;
