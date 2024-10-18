import { createYoga } from "graphql-yoga";
import { Hono } from "hono";
import { cors } from "hono/cors";

import { createContext } from "graphql/context";
import { schema } from "graphql/schema";
import { HOST, PORT, isDev, isProd } from "lib/config/env";

const yoga = createYoga({
  schema,
  context: createContext,
  // only enable web UIs in development
  // NB: can also provide an object of GraphiQL options instead of a boolean
  graphiql: isDev,
  landingPage: isDev,
});

const app = new Hono();

app.use(
  cors({
    // TODO: get correct prod origin (current one is down)
    origin: isProd ? "https://backfeed.omni.dev" : "http://localhost:3000",
    credentials: true,
    allowMethods: ["POST"],
  })
);

app.use("/graphql", async (c) => yoga.handle(c.req.raw, {}));

export default {
  host: HOST,
  port: PORT,
  fetch: app.fetch,
};
