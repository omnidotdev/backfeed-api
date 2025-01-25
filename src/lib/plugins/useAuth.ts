import { useGenericAuth } from "@envelop/generic-auth";
import * as jose from "jose";

import { AUTH_JWKS_URL } from "lib/config/env";
import { users } from "lib/drizzle/schema";

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

    return user;
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
