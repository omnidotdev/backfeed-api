import { useParserCache } from "@envelop/parser-cache";
import { useValidationCache } from "@envelop/validation-cache";
import { EnvelopArmor } from "@escape.tech/graphql-armor";
import { eq } from "drizzle-orm";
import { schema } from "generated/graphql/schema.executable";
import { useGrafast, useMoreDetailedErrors } from "grafast/envelop";
import { createYoga } from "graphql-yoga";
import { Hono } from "hono";
import { env } from "hono/adapter";
import { cors } from "hono/cors";
import appConfig from "lib/config/app.config";
import {
  GRAPHQL_COMPLEXITY_MAX_COST,
  HOST,
  isDevEnv,
  isProdEnv,
  PORT,
  STRIPE_PRODUCT_IDS,
} from "lib/config/env.config";
import { dbPool as db } from "lib/db/db";
import { organizations } from "lib/drizzle/schema";
import { createGraphQLContext } from "lib/graphql/context";
import { useAuth } from "lib/plugins/envelop";
import Stripe from "stripe";

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

const webhooks = new Hono();

webhooks.post("/stripe", async (context) => {
  const { STRIPE_API_KEY, STRIPE_WEBHOOK_SECRET } = env(context);

  const stripe = new Stripe(STRIPE_API_KEY as string);
  const signature = context.req.header("stripe-signature");

  if (!signature) {
    return context.text("", 400);
  }

  try {
    const body = await context.req.text();
    const event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      STRIPE_WEBHOOK_SECRET as string,
    );

    switch (event.type) {
      case "customer.subscription.created": {
        const productId = event.data.object.items.data[0].price
          .product as string;

        if (!STRIPE_PRODUCT_IDS.includes(productId)) break;

        const organizationId = event.data.object.metadata.organizationId;
        const subscriptionId = event.data.object.id;
        const tier = event.data.object.items.data[0].price.metadata
          .tier as SelectOrganization["tier"];

        await db
          .update(organizations)
          .set({ tier, subscriptionId })
          .where(eq(organizations.id, organizationId));

        break;
      }
      case "customer.subscription.updated": {
        const productId = event.data.object.items.data[0].price
          .product as string;

        if (!STRIPE_PRODUCT_IDS.includes(productId)) break;

        // TODO: discuss possibly handling status changes for `past_due`, `unpaid`, etc.
        // Need to determine first what triggers `subscription.deleted` below (if it is beyond just a subscription being canceled).
        // Then we need to determine how we should manage other status types. Is the plan to downgrade the organization to `free` tier ASAP? Or are there other means we wish to go about this?
        if (
          event.data.object.status === "active" &&
          event.data.previous_attributes?.items
        ) {
          const organizationId = event.data.object.metadata.organizationId;
          const previousTier =
            event.data.previous_attributes.items.data[0].price.metadata.tier;
          const currentTier =
            event.data.object.items.data[0].price.metadata.tier;

          if (previousTier !== currentTier) {
            await db
              .update(organizations)
              .set({ tier: currentTier as SelectOrganization["tier"] })
              .where(eq(organizations.id, organizationId));
          }
        }

        break;
      }
      case "customer.subscription.deleted": {
        const productId = event.data.object.items.data[0].price
          .product as string;

        if (!STRIPE_PRODUCT_IDS.includes(productId)) break;

        const organizationId = event.data.object.metadata.organizationId;

        await db
          .update(organizations)
          .set({ tier: "free", subscriptionId: null })
          .where(eq(organizations.id, organizationId));

        break;
      }
      default:
        break;
    }

    return context.text("", 200);
  } catch (err) {
    console.error(err);
    return context.text("Something went wrong", 400);
  }
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

app.route("/webhooks", webhooks);

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
