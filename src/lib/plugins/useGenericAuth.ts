import { useGenericAuth as useEnvelopGenericAuth } from "@envelop/generic-auth";
import * as jose from "jose";

import { AUTH_JWKS_URL } from "lib/config/env";
import { users } from "lib/drizzle/schema";

import type { ResolveUserFn } from "@envelop/generic-auth";
import type { SelectUser } from "lib/drizzle/schema";
import type { GraphQLContext } from "lib/graphql";

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

    const [upsertedUser] = await context.db
      .insert(users)
      .values({
        // @ts-ignore TODO: figure out why there is a type error here
        hidraId: payload.sub!,
        username: payload.preferred_username,
        firstName: payload.given_name,
        lastName: payload.family_name,
      })
      .onConflictDoUpdate({
        target: users.hidraId,
        set: {
          username: payload.preferred_username as string,
          firstName: payload.given_name as string,
          lastName: payload.family_name as string,
          updatedAt: new Date().toISOString(),
        },
      })
      .returning();

    return upsertedUser;
  } catch (e) {
    // TODO: generalize error message?
    console.error(e);

    return null;
  }
};

const useGenericAuth = () =>
  useEnvelopGenericAuth({
    resolveUserFn: resolveUser,
    mode: "protect-all",
  });

export default useGenericAuth;
