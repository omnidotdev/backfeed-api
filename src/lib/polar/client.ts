import { Polar } from "@polar-sh/sdk";
import { enablePolarSandbox } from "lib/config/env.config";

/**
 * Polar SDK client.
 */
const polar = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN!,
  server: enablePolarSandbox ? "sandbox" : "production",
});

export default polar;
