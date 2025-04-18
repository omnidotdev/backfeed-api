import { useParserCache } from "@envelop/parser-cache";
import { useValidationCache } from "@envelop/validation-cache";
import { EnvelopArmor } from "@escape.tech/graphql-armor";
import { Checkout, CustomerPortal, Webhooks } from "@polar-sh/hono";
import { useGrafast, useMoreDetailedErrors } from "grafast/envelop";
import { createYoga } from "graphql-yoga";
import { Hono } from "hono";
import { cors } from "hono/cors";

import { eq } from "drizzle-orm";
import { schema } from "generated/graphql/schema.executable";
import { app as appConfig } from "lib/config/app";
import {
  CHECKOUT_SUCCESS_URL,
  HOST,
  POLAR_ACCESS_TOKEN,
  POLAR_WEBHOOK_SECRET,
  PORT,
  isDevEnv,
  isProdEnv,
} from "lib/config/env";
import { dbPool as db } from "lib/db/db";
import { users } from "lib/drizzle/schema";
import { createGraphQLContext } from "lib/graphql/context";
import { useAuth } from "lib/plugins/envelop";

import type { SelectUser } from "lib/drizzle/schema";

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
    useAuth(),
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
  })
);

app.get(
  "/checkout",
  Checkout({
    accessToken: POLAR_ACCESS_TOKEN,
    successUrl: CHECKOUT_SUCCESS_URL,
    server: isDevEnv ? "sandbox" : "production",
  })
);

app.get(
  "/portal",
  CustomerPortal({
    accessToken: POLAR_ACCESS_TOKEN,
    getCustomerId: async ({ req }) => {
      const { searchParams } = new URL(req.url);
      const customerId = searchParams.get("customerId")!;

      return customerId;
    },
    server: isDevEnv ? "sandbox" : "production",
  })
);

// TODO: discuss / verify how to scope this to strictly be looking at `Backfeed` products if we are going to be offering subscriptions for other products within the same polar organization
app.post(
  "/polar/webhooks",
  Webhooks({
    webhookSecret: POLAR_WEBHOOK_SECRET!,
    onSubscriptionCreated: async (payload) => {
      const tier = payload.data.product.metadata.title as SelectUser["tier"];
      const hidraId = payload.data.customer.externalId;

      if (hidraId && tier) {
        await db.update(users).set({ tier }).where(eq(users.hidraId, hidraId));

        console.log(
          `${tier.toUpperCase()} Subscription Tier set for User: ${hidraId}`
        );
      }
    },
    onSubscriptionUpdated: async (payload) => {
      // NB: important to check that this is handled only on `active` status. When a sub is canceled this event is triggered, but we want to wait until it is revoked to handle the tier being set to NULL.
      if (payload.data.status === "active") {
        const tier = payload.data.product.metadata.title as SelectUser["tier"];
        const hidraId = payload.data.customer.externalId;

        if (hidraId && tier) {
          await db
            .update(users)
            .set({ tier })
            .where(eq(users.hidraId, hidraId));

          console.log(
            `${tier.toUpperCase()} Subscription Tier set for User: ${hidraId}`
          );
        }
      }
    },
    onSubscriptionRevoked: async (payload) => {
      const hidraId = payload.data.customer.externalId;

      if (hidraId) {
        await db
          .update(users)
          .set({ tier: null })
          .where(eq(users.hidraId, hidraId));

        console.log(`Subscription Tier revoked for User: ${hidraId}`);
      }
    },
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
