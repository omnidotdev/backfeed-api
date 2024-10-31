import { createWithPgClient } from "@dataplan/pg/adaptors/pg";
import { useGrafast, useMoreDetailedErrors } from "grafast/envelop";
import { createYoga } from "graphql-yoga";
import { Hono } from "hono";
import { cors } from "hono/cors";

import { schema } from "graphql/generated/schema.executable";
import { app as appConfig } from "lib/config/app";
import { HOST, PORT, isDev, isProd } from "lib/config/env";
import { pool } from "lib/db/pool";

const withPgClient = createWithPgClient({ pool });

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
  cors({
    origin: isProd ? appConfig.appUrl : "http://localhost:3000",
    credentials: true,
    allowMethods: ["POST"],
  }),
);

app.use("/graphql", async (c) => yoga.handle(c.req.raw, {}));

export default {
  host: HOST,
  port: PORT,
  fetch: app.fetch,
};
