import { useGrafast, useMoreDetailedErrors } from "grafast/envelop";
import { createYoga } from "graphql-yoga";
import { Hono } from "hono";
import { cors } from "hono/cors";

import { schema } from "generated/graphql/schema.executable";
import { app as appConfig } from "lib/config/app";
import { HOST, PORT, isDevEnv, isProdEnv } from "lib/config/env";
import { createGraphQLContext } from "lib/graphql/context";
import { useGenericAuth } from "lib/plugins";

// TODO run on Bun runtime instead of Node, track https://github.com/oven-sh/bun/issues/11785

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
  plugins: [useGenericAuth(), useMoreDetailedErrors(), useGrafast()],
});

const app = new Hono();

app.use(
  // enable CORS
  cors({
    origin: isProdEnv ? appConfig.url : "http://localhost:3000",
    credentials: true,
    allowMethods: ["GET", "POST"],
  })
);

// mount GraphQL API
app.use("/graphql", async (c) => yoga.handle(c.req.raw, {}));

// GraphQL Yoga suppresses logging the startup message in production environments by default
if (isProdEnv)
  console.log(
    `🚀 ${appConfig.name} GraphQL API running at http://${HOST}:${PORT}`
  );

export default {
  host: HOST,
  port: PORT,
  fetch: app.fetch,
};
