import { eq } from "drizzle-orm";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import * as jose from "jose";

import { AUTH_JWKS_URL } from "lib/config/env";
import { dbPool as db } from "lib/db/db";
import * as dbSchema from "lib/drizzle/schema";

/**
 * Hono middleware used to validate IDP authentication.
 */
const authMiddleware = createMiddleware(async (c, next) => {
  const sessionToken = c.req.header("Authorization")?.split("Bearer ")[1];

  if (!sessionToken) {
    throw new HTTPException(401, {
      message: "Invalid or missing session token",
    });
  }

  const jwks = jose.createRemoteJWKSet(new URL(AUTH_JWKS_URL!));

  const { payload } = await jose.jwtVerify(sessionToken, jwks);

  if (!payload) {
    throw new HTTPException(401, {
      message: "Invalid or missing session token",
    });
  }

  const [user] = await db
    .select({ customerId: dbSchema.users.customerId })
    .from(dbSchema.users)
    .where(eq(dbSchema.users.hidraId, payload.sub!));

  if (!user) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }

  c.set("customerId", user.customerId);

  await next();
});

export default authMiddleware;
