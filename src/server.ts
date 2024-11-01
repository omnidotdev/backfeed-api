import { createWithPgClient } from "@dataplan/pg/adaptors/pg";
import { useGrafast, useMoreDetailedErrors } from "grafast/envelop";
import { createYoga } from "graphql-yoga";
import { Hono } from "hono";
import { cors } from "hono/cors";

import { schema } from "generated/graphql/schema.executable";
import { app as appConfig } from "lib/config/app";
import { HOST, PORT, isDev, isProd } from "lib/config/env";
import { pgPool } from "lib/db/pool";

// TODO run on Bun runtime instead of Node, track https://github.com/oven-sh/bun/issues/11785

const withPgClient = createWithPgClient({ pool: pgPool });

/**
 * GraphQL Yoga configuration.
 * @see https://the-guild.dev/graphql/yoga-server
 */
const yoga = createYoga({
  schema,
  context: {
    // inject Postgres client into GraphQL context
    withPgClient,
  },
  // only enable web UIs in development
  // NB: can also provide an object of GraphiQL options instead of a boolean
  graphiql: isDev,
  landingPage: isDev,
  plugins: [useMoreDetailedErrors(), useGrafast()],
});

const app = new Hono();

app.use(
  // enable CORS
  cors({
    origin: isProd ? appConfig.url : "http://localhost:3000",
    credentials: true,
    allowMethods: ["POST"],
  }),
);

// mount GraphQL API
app.use("/graphql", async (c) => yoga.handle(c.req.raw, {}));

// GraphQL Yoga suppresses logging the startup message in production environments by default
if (isProd)
  console.log(
    `🚀 ${appConfig.name} GraphQL API running at http://${HOST}:${PORT}`,
  );

export default {
  host: HOST,
  port: PORT,
  fetch: app.fetch,
};
