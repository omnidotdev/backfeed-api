import { useGenericAuth } from "@envelop/generic-auth";
import * as jose from "jose";

// import { AUTH_JWKS_URL } from "lib/config/env";
import { users } from "lib/drizzle/schema";

import type { ResolveUserFn } from "@envelop/generic-auth";
import type { InsertUser, SelectUser } from "lib/drizzle/schema";
import type { GraphQLContext } from "lib/graphql";

/**
 * Validate user session and resolve user if successful.
 * @see https://the-guild.dev/graphql/envelop/plugins/use-generic-auth#getting-started
 */
const resolveUser: ResolveUserFn<SelectUser, GraphQLContext> = async (
  context,
) => {
  try {
    const sessionToken = context.request.headers
      .get("authorization")
      ?.split("Bearer ")[1];

    if (!sessionToken) throw new Error("Invalid or missing session token");

    // TODO verify best practices for this
    const userInfo = await fetch(
      // TODO env var
      "https://localhost:8000/api/auth/oauth2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      },
    );

    const idToken: jose.JWTPayload = await userInfo.json();

    // TODO validate token, currently major security flaw
    // const jwks = jose.createRemoteJWKSet(new URL(AUTH_JWKS_URL!));
    // const { payload } = await jose.jwtVerify(sessionToken, jwks);
    // if (!payload) throw new Error("Invalid or missing session token");

    const insertedUser: InsertUser = {
      hidraId: idToken.sub!,
      username: idToken.preferred_username as string,
      firstName: idToken.given_name as string,
      lastName: idToken.family_name as string,
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
