/**
 * OpenTelemetry instrumentation for HyperDX.
 *
 * This file MUST be loaded before any other imports to properly instrument
 * the application. It's loaded via the `--import` flag in the start script.
 *
 * @see https://docs.hyperdx.io/install/opentelemetry
 */

import { DiagConsoleLogger, DiagLogLevel, diag } from "@opentelemetry/api";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { resourceFromAttributes } from "@opentelemetry/resources";
import {
  BatchLogRecordProcessor,
  LoggerProvider,
} from "@opentelemetry/sdk-logs";
import { NodeSDK } from "@opentelemetry/sdk-node";
import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
} from "@opentelemetry/semantic-conventions";

const {
  OTEL_EXPORTER_OTLP_ENDPOINT,
  OTEL_EXPORTER_OTLP_HEADERS,
  OTEL_SERVICE_NAME = "backfeed-api",
  OTEL_SERVICE_VERSION = "1.0.0",
  NODE_ENV,
} = process.env;

const isProduction = NODE_ENV === "production";

// Enable diagnostic logging in development
if (!isProduction) {
  diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);
}

// Only initialize if endpoint is configured
if (OTEL_EXPORTER_OTLP_ENDPOINT) {
  const resource = resourceFromAttributes({
    [ATTR_SERVICE_NAME]: OTEL_SERVICE_NAME,
    [ATTR_SERVICE_VERSION]: OTEL_SERVICE_VERSION,
    "deployment.environment": NODE_ENV ?? "development",
  });

  // Parse headers from environment (format: "key1=value1,key2=value2")
  const headers: Record<string, string> = {};
  if (OTEL_EXPORTER_OTLP_HEADERS) {
    for (const pair of OTEL_EXPORTER_OTLP_HEADERS.split(",")) {
      const [key, value] = pair.split("=");
      if (key && value) {
        headers[key.trim()] = value.trim();
      }
    }
  }

  // Configure trace exporter
  const traceExporter = new OTLPTraceExporter({
    url: `${OTEL_EXPORTER_OTLP_ENDPOINT}/v1/traces`,
    headers,
  });

  // Configure log exporter
  const logExporter = new OTLPLogExporter({
    url: `${OTEL_EXPORTER_OTLP_ENDPOINT}/v1/logs`,
    headers,
  });

  // Set up logger provider for logs with processors in config
  const loggerProvider = new LoggerProvider({
    resource,
    processors: [new BatchLogRecordProcessor(logExporter)],
  });

  // Initialize OpenTelemetry SDK
  const sdk = new NodeSDK({
    resource,
    traceExporter,
    instrumentations: [
      getNodeAutoInstrumentations({
        // Disable fs instrumentation to reduce noise
        "@opentelemetry/instrumentation-fs": { enabled: false },
        // Configure HTTP instrumentation
        "@opentelemetry/instrumentation-http": {
          ignoreIncomingRequestHook: (request) => {
            // Ignore health checks
            const url = request.url ?? "";
            return url === "/health" || url === "/ready";
          },
        },
      }),
    ],
  });

  sdk.start();

  console.log(
    `[OpenTelemetry] Initialized - sending traces to ${OTEL_EXPORTER_OTLP_ENDPOINT}`,
  );

  // Graceful shutdown
  const shutdown = async () => {
    try {
      await sdk.shutdown();
      await loggerProvider.shutdown();
      console.log("[OpenTelemetry] Shutdown complete");
    } catch (err) {
      console.error("[OpenTelemetry] Shutdown error:", err);
    }
  };

  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
} else if (isProduction) {
  console.warn(
    "[OpenTelemetry] OTEL_EXPORTER_OTLP_ENDPOINT not set - tracing disabled",
  );
}
