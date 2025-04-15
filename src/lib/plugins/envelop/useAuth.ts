import { useGenericAuth } from "@envelop/generic-auth";
import * as jose from "jose";
import { match } from "ts-pattern";

import { AUTH_JWKS_URL } from "lib/config/env";
import { users } from "lib/drizzle/schema";
import { SubscriptionTier } from "lib/graphql";
import { polar } from "lib/polar";

import type { ResolveUserFn } from "@envelop/generic-auth";
import type { InsertUser, SelectUser } from "lib/drizzle/schema";
import type { GraphQLContext } from "lib/graphql";

/**
 * Validate user session and resolve user if successful.
 * @see https://the-guild.dev/graphql/envelop/plugins/use-generic-auth#getting-started
 */
const resolveUser: ResolveUserFn<SelectUser, GraphQLContext> = async (
  context
) => {
  let tier: SubscriptionTier | null = null;

  try {
    const sessionToken = context.request.headers
      .get("authorization")
      ?.split("Bearer ")[1];

    if (!sessionToken) throw new Error("Invalid or missing session token");

    const jwks = jose.createRemoteJWKSet(new URL(AUTH_JWKS_URL!));

    const { payload } = await jose.jwtVerify(sessionToken, jwks);

    if (!payload) throw new Error("Invalid or missing session token");

    const insertedUser: InsertUser = {
      hidraId: payload.sub!,
      username: payload.preferred_username as string,
      firstName: payload.given_name as string,
      lastName: payload.family_name as string,
      email: payload.email as string,
    };

    const { hidraId, ...rest } = insertedUser;

    const [user] = await context.db
      .insert(users)
      .values(insertedUser)
      .onConflictDoUpdate({
        target: users.hidraId,
        set: {
          ...rest,
          updatedAt: new Date().toISOString(),
        },
      })
      .returning();

    const [customerResponse] = await Promise.allSettled([
      polar.customers.getStateExternal({
        externalId: user.hidraId,
      }),
    ]);

    if (customerResponse.status === "fulfilled") {
      const customer = customerResponse.value;

      if (customer.activeSubscriptions.length) {
        const productId = customer.activeSubscriptions[0].productId;

        const product = await polar.products.get({
          id: productId,
        });

        tier = match(product.metadata?.title as SubscriptionTier)
          .with(SubscriptionTier.BASIC, () => SubscriptionTier.BASIC)
          .with(SubscriptionTier.TEAM, () => SubscriptionTier.TEAM)
          .with(SubscriptionTier.ENTERPRISE, () => SubscriptionTier.ENTERPRISE)
          .otherwise(() => null);
      }
    }

    return { ...user, tier };
  } catch (err) {
    console.error(err);

    return null;
  }
};

const useAuth = () =>
  useGenericAuth({
    resolveUserFn: resolveUser,
    mode: "protect-all",
  });

export default useAuth;
