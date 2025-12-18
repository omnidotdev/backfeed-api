import { useGenericAuth } from "@envelop/generic-auth";
import { AUTH_BASE_URL, protectRoutes } from "lib/config/env.config";
import { users } from "lib/drizzle/schema";

import type { ResolveUserFn } from "@envelop/generic-auth";
import type * as jose from "jose";
import type { InsertUser, SelectUser } from "lib/drizzle/schema";
import type { GraphQLContext } from "lib/graphql";

// TODO research best practices for all of this file (token validation, caching, etc.). Validate access token (introspection endpoint)? Cache userinfo output? etc. (https://linear.app/omnidev/issue/OMNI-302/increase-security-of-useauth-plugin)

/**
 * Validate user session and resolve user if successful.
 * @see https://the-guild.dev/graphql/envelop/plugins/use-generic-auth#getting-started
 */
const resolveUser: ResolveUserFn<SelectUser, GraphQLContext> = async (
  context,
) => {
  try {
    const accessToken = context.request.headers
      .get("authorization")
      ?.split("Bearer ")[1];

    if (!accessToken) {
      if (!protectRoutes) return null;

      throw new Error("Invalid or missing access token");
    }

    // TODO validate access token (introspection endpoint?) here?

    // TODO cache so this doesn't occur on every request. Research best practices
    const userInfo = await fetch(`${AUTH_BASE_URL}/oauth2/userinfo`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!userInfo.ok) {
      if (!protectRoutes) return null;

      throw new Error("Invalid `userinfo` claims payload or request failed");
    }

    const idToken: jose.JWTPayload = await userInfo.json();

    // TODO validate token, currently major security flaw (pending BA OIDC JWKS support: https://www.better-auth.com/docs/plugins/oidc-provider#jwks-endpoint-not-fully-implemented) (https://linear.app/omnidev/issue/OMNI-302/validate-id-token-with-jwks)
    // const jwks = jose.createRemoteJWKSet(new URL(`${AUTH_BASE_URL}/jwks`));
    // const { payload } = await jose.jwtVerify(JSON.stringify(idToken), jwks);
    // if (!payload) throw new Error("Failed to verify token");

    if (!idToken) {
      if (!protectRoutes) return null;

      throw new Error("Invalid ID token or request failed");
    }

    const insertedUser: InsertUser = {
      identityProviderId: idToken.sub!,
      username: idToken.preferred_username as string,
      firstName: idToken.given_name as string,
      lastName: idToken.family_name as string,
      email: idToken.email as string,
    };

    const { identityProviderId, ...rest } = insertedUser;

    const [user] = await context.db
      .insert(users)
      .values(insertedUser)
      .onConflictDoUpdate({
        target: users.identityProviderId,
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
    contextFieldName: "observer",
    resolveUserFn: resolveUser,
    mode: protectRoutes ? "protect-all" : "resolve-only",
  });

export default useAuth;
