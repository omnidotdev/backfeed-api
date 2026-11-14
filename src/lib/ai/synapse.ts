import { createSynapseProvisioner } from "@omnidotdev/providers/ai";
import { SYNAPSE_API_URL, SYNAPSE_GATEWAY_SECRET } from "lib/config/env.config";

/**
 * Synapse is the Omni AI gateway: it holds the provider keys and enforces
 * entitlements, the included AI allowance, metering, and billing (via Aether).
 * All of Backfeed's model traffic (embeddings for AI triage) routes through it
 * rather than calling a provider directly.
 *
 * Every call uses a product-scoped managed key: provisioned per acting user
 * under the `backfeed` Aether app and billed to the workspace (organization)
 * that owns the feedback. There is no shared or static key: when provisioning
 * is not configured or fails, AI triage is unavailable and dedupe stays lexical
 */

/** Aether app id the gateway meters and enforces Backfeed's AI allowance under */
const BACKFEED_APP_ID = "backfeed";

/**
 * Product-scoped managed-key provisioner (keys cached per user and billing
 * entity). Null when provisioning is not configured
 */
export const synapseProvisioner =
  SYNAPSE_API_URL && SYNAPSE_GATEWAY_SECRET
    ? createSynapseProvisioner({
        apiUrl: SYNAPSE_API_URL,
        gatewaySecret: SYNAPSE_GATEWAY_SECRET,
        source: "Backfeed",
        appId: BACKFEED_APP_ID,
      })
    : null;
