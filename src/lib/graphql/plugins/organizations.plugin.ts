import { getOrganizationClaimsFromCache } from "./authentication.plugin";

import type { Plugin } from "@envelop/types";
import type { OrganizationClaim } from "lib/auth/organizations";
import type { GraphQLContext } from "lib/graphql/createGraphqlContext";

/**
 * Plugin that extracts organization claims from the cached userinfo response.
 * Must run after the authentication plugin that fetches userinfo.
 *
 * Adds `organizations` to the context for use in authorization checks.
 */
const organizationsPlugin: Plugin<GraphQLContext> = {
  onContextBuilding({ extendContext, context }) {
    // Extract access token from request
    const accessToken = context.request.headers
      .get("authorization")
      ?.split("Bearer ")[1];

    if (!accessToken) {
      extendContext({ organizations: [] as OrganizationClaim[] });
      return;
    }

    // Get organizations from cached userinfo (populated by authentication plugin)
    const organizations = getOrganizationClaimsFromCache(accessToken);
    extendContext({ organizations });
  },
};

export default organizationsPlugin;
