import { createServer } from "node:http";

import { createContext } from "graphql/context";
import { schema } from "graphql/schema";
import { createYoga } from "graphql-yoga";
import { HOST, NODE_ENV, PORT } from "lib/config/env";

const yoga = createYoga({
  schema,
  context: createContext,
  cors: {
    origin:
      NODE_ENV === "production"
        ? "https://backfeed.omni.dev"
        : "http://localhost:4000",
    credentials: true,
    methods: ["POST"],
  },
  // NB: can also provide an object of options instead of a boolean
  graphiql: NODE_ENV === "development",
});

const server = createServer(yoga);

server.listen(PORT, () => {
  console.info(
    `🧘 Backfeed Yoga GraphQL API server running on http://${HOST}:${PORT}/graphql`
  );
});
