import type { KnipConfig } from "knip";

/**
 * Knip configuration.
 * @see https://knip.dev/overview/configuration
 */
const knipConfig: KnipConfig = {
  ignore: [
    "**/generated/**",
    "src/lib/config/drizzle.config.ts",
    "src/scripts/**",
    "src/jobs/**",
    "src/lib/db/db.ts",
    "src/lib/config/env.config.ts",
    "src/lib/authz/**",
    // Provider instances consumed at runtime by server and routes
    "src/lib/providers/**",
    // Instrumentation loaded via --import flag at runtime
    "src/instrumentation.ts",
  ],
  ignoreDependencies: [
    // OpenTelemetry deps used by instrumentation.ts (loaded via --import)
    "@opentelemetry/auto-instrumentations-node",
    "@opentelemetry/exporter-logs-otlp-http",
    "@opentelemetry/exporter-trace-otlp-http",
    "@opentelemetry/resources",
    "@opentelemetry/sdk-logs",
    "@opentelemetry/sdk-node",
    "@opentelemetry/semantic-conventions",
  ],
  tags: ["-knipignore"],
};

export default knipConfig;
