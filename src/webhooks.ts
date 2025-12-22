import { and, eq } from "drizzle-orm";
import { Elysia, t } from "elysia";
import app from "lib/config/app.config";
import { STRIPE_WEBHOOK_SECRET } from "lib/config/env.config";
import { dbPool as db } from "lib/db/db";
import { organizations } from "lib/db/schema";
import payments from "lib/payments";

import type { SelectOrganization } from "lib/db/schema";

/**
 * Webhooks Elysia instance (effectively used as a plugin).
 * @see https://hookdeck.com/webhooks/guides/what-are-webhooks-how-they-work
 */
const webhooks = new Elysia({ prefix: "/webhooks" }).post(
  "/stripe",
  async ({ request, headers, status }) => {
    const productName = app.name.toLowerCase();
    const signature = headers["stripe-signature"];

    if (!signature) return status(400, "Missing signature");

    try {
      const body = await request.text();

      const event = await payments.webhooks.constructEventAsync(
        body,
        signature,
        STRIPE_WEBHOOK_SECRET as string,
      );

      switch (event.type) {
        case "customer.subscription.created": {
          // TODO less vendor-specific for self-hosting fam
          if (event.data.object.metadata.omniProduct !== productName) break;

          const subscription = await payments.subscriptions.retrieve(
            event.data.object.id,
          );

          const price = subscription.items.data[0].price;

          const organizationId = subscription.metadata.organizationId;

          const tier = price.metadata.tier as SelectOrganization["tier"];

          if (subscription.status === "active")
            await db
              .update(organizations)
              .set({ tier, subscriptionId: subscription.id })
              .where(eq(organizations.id, organizationId));

          break;
        }
        case "customer.subscription.updated": {
          if (event.data.object.metadata.omniProduct !== productName) break;

          const subscription = await payments.subscriptions.retrieve(
            event.data.object.id,
          );

          const price = subscription.items.data[0].price;

          const organizationId = subscription.metadata.organizationId;

          const tier = price.metadata.tier as SelectOrganization["tier"];

          if (subscription.status === "active")
            await db
              .update(organizations)
              .set({ tier })
              .where(
                and(
                  eq(organizations.id, organizationId),
                  eq(organizations.subscriptionId, subscription.id),
                ),
              );

          // NB: If the status of the subscription is deemed `unpaid`, we eagerly set the tier to `free` but keep the current subscription ID attached to the organization.
          if (subscription.status === "unpaid")
            await db
              .update(organizations)
              .set({ tier: "free" })
              .where(
                and(
                  eq(organizations.id, organizationId),
                  eq(organizations.subscriptionId, subscription.id),
                ),
              );

          break;
        }
        case "customer.subscription.deleted": {
          if (event.data.object.metadata.omniProduct !== productName) break;

          const subscription = await payments.subscriptions.retrieve(
            event.data.object.id,
          );

          const organizationId = subscription.metadata.organizationId;

          if (subscription.status === "canceled")
            await db
              .update(organizations)
              .set({ tier: "free", subscriptionId: null })
              .where(
                and(
                  eq(organizations.id, organizationId),
                  eq(organizations.subscriptionId, subscription.id),
                ),
              );

          break;
        }
        default:
          break;
      }

      return status(200, "Webhook event consumed");
    } catch (err) {
      console.error(err);
      return status(500, "Internal Server Error");
    }
  },
  {
    headers: t.Object({
      "stripe-signature": t.String(),
    }),
  },
);

export default webhooks;
