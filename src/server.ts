import { createServer } from "node:http";

import { createContext } from "graphql/context";
import { schema } from "graphql/schema";
import { createYoga } from "graphql-yoga";
import { HOST, PORT } from "lib/config/env";

const yoga = createYoga({ schema, context: createContext });

const server = createServer(yoga);

server.listen(PORT, () => {
  console.info(
    `🧘 Backfeed Yoga GraphQL API server running on http://${HOST}:${PORT}/graphql`
  );
});
