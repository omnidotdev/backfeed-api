import { eq } from "drizzle-orm";
import { createMiddleware } from "hono/factory";
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
    return c.json({ error: "Invalid or missing session token" }, 401);
  }

  const jwks = jose.createRemoteJWKSet(new URL(AUTH_JWKS_URL!));

  const { payload } = await jose.jwtVerify(sessionToken, jwks);

  if (!payload) {
    return c.json({ error: "Invalid or missing session token" }, 401);
  }

  const [user] = await db
    .select({ customerId: dbSchema.users.customerId })
    .from(dbSchema.users)
    .where(eq(dbSchema.users.hidraId, payload.sub!));

  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  c.set("customerId", user.customerId);

  await next();
});

export default authMiddleware;
