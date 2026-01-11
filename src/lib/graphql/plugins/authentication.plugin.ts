import { useGenericAuth } from "@envelop/generic-auth";
import { QueryClient } from "@tanstack/query-core";
import { AUTH_BASE_URL, protectRoutes } from "lib/config/env.config";
import { users } from "lib/db/schema";
import ms from "ms";

import type { ResolveUserFn } from "@envelop/generic-auth";
import type { InsertUser, SelectUser } from "lib/db/schema";
import type { GraphQLContext } from "lib/graphql/createGraphqlContext";

/** Claim key for organization claims in JWT. */
const OMNI_CLAIMS_ORGANIZATIONS =
  "https://manifold.omni.dev/@omni/claims/organizations";

interface OrganizationClaim {
  id: string;
  slug: string;
  type: "personal" | "team";
  roles: string[];
  teams: Array<{ id: string; name: string }>;
}

interface UserInfoClaims {
  sub: string;
  iss?: string;
  aud?: string | string[];
  exp?: number;
  iat?: number;
  preferred_username?: string;
  given_name?: string;
  family_name?: string;
  email?: string;
  [OMNI_CLAIMS_ORGANIZATIONS]?: OrganizationClaim[];
}

class AuthenticationError extends Error {
  readonly code: string;

  constructor(message: string, code: string) {
    super(message);
    this.name = "AuthenticationError";
    this.code = code;
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: ms("2m"),
    },
  },
});

/** Extract organization claims from cached userinfo for a given access token. */
export function getOrganizationClaimsFromCache(
  accessToken: string,
): OrganizationClaim[] {
  const cached = queryClient.getQueryData<UserInfoClaims>([
    "UserInfo",
    { accessToken },
  ]);
  return cached?.[OMNI_CLAIMS_ORGANIZATIONS] ?? [];
}

/**
 * Validate token claims.
 */
const validateClaims = (claims: UserInfoClaims): void => {
  const now = Math.floor(Date.now() / 1000);

  // validate `exp`
  if (claims.exp !== undefined && claims.exp < now)
    throw new AuthenticationError("Token has expired", "TOKEN_EXPIRED");

  // validate `iat` (reject tokens issued in the future with clock skew allowance)
  if (claims.iat !== undefined && claims.iat > now + ms("1m"))
    throw new AuthenticationError(
      "Token issued in the future",
      "INVALID_TOKEN_IAT",
    );

  // validate issuer
  if (AUTH_BASE_URL && claims.iss !== undefined && claims.iss !== AUTH_BASE_URL)
    throw new AuthenticationError(
      "Token issuer mismatch",
      "INVALID_TOKEN_ISSUER",
    );
};

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

      throw new AuthenticationError(
        "Invalid or missing access token",
        "MISSING_TOKEN",
      );
    }

    const claims = await queryClient.ensureQueryData({
      queryKey: ["UserInfo", { accessToken }],
      queryFn: async () => {
        const response = await fetch(`${AUTH_BASE_URL}/oauth2/userinfo`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new AuthenticationError(
            "Invalid access token or request failed",
            "USERINFO_FAILED",
          );
        }

        const userInfoClaims: UserInfoClaims = await response.json();

        return userInfoClaims;
      },
    });

    if (!claims) {
      if (!protectRoutes) return null;

      throw new AuthenticationError(
        "Invalid access token or request failed",
        "INVALID_CLAIMS",
      );
    }

    validateClaims(claims);

    if (!claims.sub)
      throw new AuthenticationError(
        "Missing required 'sub' claim",
        "MISSING_SUB_CLAIM",
      );

    if (!claims.email)
      throw new AuthenticationError(
        "Missing required 'email' claim",
        "MISSING_EMAIL_CLAIM",
      );

    // TODO: Add JWKS signature verification when Better Auth supports it
    // https://www.better-auth.com/docs/plugins/oidc-provider#jwks-endpoint-not-fully-implemented
    // https://linear.app/omnidev/issue/OMNI-302/validate-id-token-with-jwks

    const insertedUser: InsertUser = {
      identityProviderId: claims.sub,
      username: claims.preferred_username ?? claims.email,
      firstName: claims.given_name ?? "",
      lastName: claims.family_name ?? "",
      email: claims.email,
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
    if (err instanceof AuthenticationError) {
      console.error(`[Auth] ${err.code}: ${err.message}`);
    } else {
      console.error("[Auth] Unexpected error:", err);
    }

    return null;
  }
};

/**
 * Authentication plugin.
 *
 * Uses "resolve-only" mode to allow unauthenticated queries (public board access).
 * Mutations are protected by authorization plugins that check for observer.
 *
 * @see https://the-guild.dev/graphql/envelop/plugins/use-generic-auth
 */
const authenticationPlugin = useGenericAuth({
  contextFieldName: "observer",
  resolveUserFn: resolveUser,
  mode: "resolve-only",
});

export default authenticationPlugin;
