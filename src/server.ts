import { useParserCache } from "@envelop/parser-cache";
import { useValidationCache } from "@envelop/validation-cache";
import { EnvelopArmor } from "@escape.tech/graphql-armor";
import { useGrafast, useMoreDetailedErrors } from "grafast/envelop";
import { createYoga } from "graphql-yoga";
import { Hono } from "hono";
import { cors } from "hono/cors";

import { schema } from "generated/graphql/schema.executable";
import appConfig from "lib/config/app.config";
import {
  HOST,
  PORT,
  SKIP_AUTH,
  isDevEnv,
  isProdEnv,
} from "lib/config/env.config";
import { createGraphQLContext } from "lib/graphql/context";
import { useAuth } from "lib/plugins/envelop";

// TODO run on Bun runtime instead of Node, track https://github.com/oven-sh/bun/issues/11785

/**
 * GraphQL Armor security plugin.
 * @see https://github.com/escape-technologies/graphql-armor
 */
const armor = new EnvelopArmor({
  blockFieldSuggestion: {
    enabled: isProdEnv,
  },
  maxDepth: {
    enabled: true,
    n: 10,
  },
  costLimit: {
    enabled: true,
    maxCost: 250,
    objectCost: 2,
    scalarCost: 1,
    depthCostFactor: 1.5,
    ignoreIntrospection: true,
  },
});

const { plugins: armorPlugins } = armor.protect();

/**
 * GraphQL Yoga configuration.
 * @see https://the-guild.dev/graphql/yoga-server
 */
const yoga = createYoga({
  schema,
  context: createGraphQLContext,
  // only enable web UIs in development
  // NB: can also provide an object of GraphiQL options instead of a boolean
  graphiql: isDevEnv,
  landingPage: isDevEnv,
  plugins: [
    SKIP_AUTH !== "true" && useAuth(),
    useMoreDetailedErrors(),
    // NB: The below are used to handle caching and validation. Caching the parser results is critical for Grafast. See: https://grafast.org/grafast/servers#envelop
    useParserCache(),
    useValidationCache(),
    useGrafast(),
    ...armorPlugins,
  ],
});

const app = new Hono();

app.use(
  // enable CORS
  cors({
    origin: isProdEnv ? appConfig.url : "https://localhost:3000",
    credentials: true,
    allowMethods: ["GET", "POST"],
  }),
);

// mount GraphQL API
app.use("/graphql", async (c) => yoga.handle(c.req.raw, {}));

// GraphQL Yoga suppresses logging the startup message in production environments by default
if (isProdEnv)
  console.log(
    `🚀 ${appConfig.name} GraphQL API running at http://${HOST}:${PORT}`,
  );

export default {
  host: HOST,
  port: PORT,
  fetch: app.fetch,
};
