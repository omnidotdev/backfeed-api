import { useGenericAuth } from "@envelop/generic-auth";
import { eq } from "drizzle-orm";
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

    const [user] = await context.db
      .select()
      .from(users)
      .where(eq(users.hidraId, payload.sub!));

    if (!user) throw new Error("No user found with the given HIDRA ID");

    return user;
  } catch (e) {
    // TODO: generalize error message?
    console.error(e);

    return null;
  }
};

const useAuth = () =>
  useGenericAuth({
    resolveUserFn: resolveUser,
    mode: "protect-all",
  });

export default useAuth;
