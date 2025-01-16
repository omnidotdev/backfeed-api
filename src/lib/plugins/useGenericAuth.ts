import { useGenericAuth as useEnvelopGenericAuth } from "@envelop/generic-auth";
import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";

import { AUTH_JWKS_URL } from "lib/config/env";
import { users } from "lib/drizzle/schema";

import type { ResolveUserFn } from "@envelop/generic-auth";
import type { JwtHeader, SigningKeyCallback } from "jsonwebtoken";
import type { SelectUser } from "lib/drizzle/schema";
import type { GraphQLContext } from "lib/graphql";

type Maybe<T> = T | null;

const resolveUser: ResolveUserFn<SelectUser, GraphQLContext> = async (
  context
) => {
  try {
    let user: Maybe<SelectUser> = null;

    const sessionToken = context.request.headers
      .get("authorization")
      ?.split("Bearer ")[1];

    if (!sessionToken) throw new Error("Invalid or missing session token");

    const jwks = jwksClient({
      jwksUri: AUTH_JWKS_URL!,
    });

    const getKey = (header: JwtHeader, callback: SigningKeyCallback) => {
      jwks.getSigningKey(header.kid, (err, key) => {
        // @ts-ignore
        const signingKey = key?.getPublicKey();
        // TODO: figure out why this is coming back as undefined
        console.log(signingKey);
        callback(null, signingKey);
      });
    };

    jwt.verify(
      sessionToken,
      getKey,
      { algorithms: ["RS256"] },
      async (err, decoded) => {
        if (err) {
          // TODO: remove
          console.error(err);
          throw new Error("Failed to verify session token");
        }

        const decodedToken = decoded as jwt.JwtPayload;

        // upsert user into database
        const [upsertedUser] = await context.db
          .insert(users)
          .values({
            hidraId: decodedToken.sub!,
            username: decodedToken.preferred_username,
            firstName: decodedToken.given_name,
            lastName: decodedToken.family_name,
          })
          .onConflictDoUpdate({
            target: users.hidraId,
            set: {
              username: decodedToken.preferred_username,
              firstName: decodedToken.given_name,
              lastName: decodedToken.family_name,
              updatedAt: new Date().toISOString(),
            },
          })
          .returning();

        user = upsertedUser;
      }
    );

    return user;
  } catch (e) {
    console.error("Failed to validate token");

    return null;
  }
};

const useGenericAuth = () =>
  useEnvelopGenericAuth({
    resolveUserFn: resolveUser,
    mode: "protect-all",
  });

export default useGenericAuth;
