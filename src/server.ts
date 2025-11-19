import { useParserCache } from "@envelop/parser-cache";
import { useValidationCache } from "@envelop/validation-cache";
import { EnvelopArmor } from "@escape.tech/graphql-armor";
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
} from "lib/config/env.config";
import { createGraphQLContext } from "lib/graphql/context";
import { useAuth } from "lib/plugins/envelop";
import Stripe from "stripe";

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

    // TODO: add actions depending on event type
    console.log(event.data);
  } catch (err) {
    // TODO: make this more robust
    console.error(err);
    return context.text("Something went wrong", 400);
  }
});

// TODO: remove. Kept for reference.
// webhooks.post(
//   "/polar",
//   Webhooks({
//     webhookSecret: POLAR_WEBHOOK_SECRET!,
//     onSubscriptionCreated: async (payload) => {
//       const organizationId = payload.data.metadata.backfeedOrganizationId;
//
//       if (!organizationId) return;
//
//       await db
//         .update(organizations)
//         .set({ subscriptionId: payload.data.id })
//         .where(eq(organizations.id, organizationId as string));
//     },
//     onSubscriptionUpdated: async (payload) => {
//       const organizationId = payload.data.metadata.backfeedOrganizationId;
//
//       if (!organizationId) return;
//
//       if (payload.data.status === "active") {
//         const tier = payload.data.product.metadata
//           .title as SelectOrganization["tier"];
//
//         await db
//           .update(organizations)
//           .set({ tier })
//           .where(eq(organizations.id, organizationId as string));
//       }
//     },
//     onSubscriptionRevoked: async (payload) => {
//       const organizationId = payload.data.metadata.backfeedOrganizationId;
//
//       if (!organizationId) return;
//
//       const organization = await db.query.organizations.findFirst({
//         where: (table, { eq }) => eq(table.id, organizationId as string),
//       });
//
//       if (!organization) return;
//
//       // NB: with the `onSubscriptionCreated` handler, there are cases where we revoke stale subscriptions which will trigger this callback. We only want to update the database tier if the subscription revoked matches the subscriptionId in the database.
//       if (organization.subscriptionId === payload.data.id) {
//         await db
//           .update(organizations)
//           .set({ tier: "free" })
//           .where(eq(organizations.id, organizationId as string));
//       }
//     },
//   }),
// );

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
