import { createOrganizationsPlugin } from "@omnidotdev/providers/graphql";

import { getOrganizationClaimsFromCache } from "./authentication.plugin";

/**
 * Plugin that extracts organization claims from the cached userinfo response.
 * Must run after the authentication plugin that fetches userinfo.
 */
const organizationsPlugin = createOrganizationsPlugin({
  getOrganizationClaimsFromCache,
});

export default organizationsPlugin;
