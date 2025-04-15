import { Polar } from "@polar-sh/sdk";

import { POLAR_ACCESS_TOKEN, isDevEnv } from "lib/config/env";

/**
 * Polar SDK client.
 */
const polar = new Polar({
  accessToken: POLAR_ACCESS_TOKEN!,
  server: isDevEnv ? "sandbox" : "production",
});

export default polar;
