import { useParserCache } from "@envelop/parser-cache";
import { useValidationCache } from "@envelop/validation-cache";
import { EnvelopArmor } from "@escape.tech/graphql-armor";
import { Checkout, CustomerPortal, Webhooks } from "@polar-sh/hono";
import { eq } from "drizzle-orm";
import { schema } from "generated/graphql/schema.executable";
import { useGrafast, useMoreDetailedErrors } from "grafast/envelop";
import { createYoga } from "graphql-yoga";
import { Hono } from "hono";
import { cors } from "hono/cors";
import appConfig from "lib/config/app.config";
import {
  CHECKOUT_SUCCESS_URL,
  enablePolarSandbox,
  GRAPHQL_COMPLEXITY_MAX_COST,
  HOST,
  isDevEnv,
  isProdEnv,
  POLAR_ACCESS_TOKEN,
  POLAR_WEBHOOK_SECRET,
  PORT,
} from "lib/config/env.config";
import { dbPool as db } from "lib/db/db";
import { organizations } from "lib/drizzle/schema";
import { createGraphQLContext } from "lib/graphql/context";
import { useAuth } from "lib/plugins/envelop";

import type { SelectOrganization } from "lib/drizzle/schema";

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
    maxCost: +GRAPHQL_COMPLEXITY_MAX_COST!,
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
    ...armorPlugins,
    useAuth(),
    useMoreDetailedErrors(),
    // NB: The below are used to handle caching and validation. Caching the parser results is critical for Grafast. See: https://grafast.org/grafast/servers#envelop
    useParserCache(),
    useValidationCache(),
    useGrafast(),
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

app.get(
  "/checkout",
  Checkout({
    accessToken: POLAR_ACCESS_TOKEN,
    server: enablePolarSandbox ? "sandbox" : "production",
    successUrl: CHECKOUT_SUCCESS_URL,
    // NB: needs to be static similar to `successUrl` above. Although the `CHECKOUT_SUCCESS_URL` naming convention is misleading now, same process should occur. Redirect back to confirmation route, which redirects to the user's profile.
    // If desired, we could rename this env + rename the route in `backfeed-app` for more clarity on the widened scope / use case for said route
    returnUrl: CHECKOUT_SUCCESS_URL,
  }),
);

app.get(
  "/portal",
  CustomerPortal({
    accessToken: POLAR_ACCESS_TOKEN,
    server: enablePolarSandbox ? "sandbox" : "production",
    getCustomerId: async ({ req }) => {
      const { searchParams } = new URL(req.url);
      return searchParams.get("customerId")!;
    },
  }),
);

app.post(
  "/polar/webhooks",
  Webhooks({
    webhookSecret: POLAR_WEBHOOK_SECRET!,
    onSubscriptionCreated: async (payload) => {
      const organizationId = payload.data.metadata.organizationId;

      if (!organizationId) return;

      await db
        .update(organizations)
        .set({ subscriptionId: payload.data.id })
        .where(eq(organizations.id, organizationId as string));
    },
    onSubscriptionUpdated: async (payload) => {
      const organizationId = payload.data.metadata.organizationId;

      if (!organizationId) return;

      if (payload.data.status === "active") {
        const tier = payload.data.product.metadata
          .title as SelectOrganization["tier"];

        await db
          .update(organizations)
          .set({ tier })
          .where(eq(organizations.id, organizationId as string));
      }
    },
    // TODO: handle revoke subscriptions properly. Should set tier on organization back to `free`
    // onSubscriptionRevoked: async (payload) => {
    // },
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
