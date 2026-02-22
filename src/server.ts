import { cors } from "@elysiajs/cors";
import { yoga } from "@elysiajs/graphql-yoga";
import { useOpenTelemetry } from "@envelop/opentelemetry";
import { useParserCache } from "@envelop/parser-cache";
import { useValidationCache } from "@envelop/validation-cache";
import { useDisableIntrospection } from "@graphql-yoga/plugin-disable-introspection";
import { Elysia } from "elysia";
import { rateLimit } from "elysia-rate-limit";
import { schema } from "generated/graphql/schema.executable";
import { useGrafast, useMoreDetailedErrors } from "grafast/envelop";
import authzRoutes from "lib/authz/routes";
import appConfig from "lib/config/app.config";
import {
  AUTHZ_API_URL,
  AUTHZ_ENABLED,
  CORS_ALLOWED_ORIGINS,
  PORT,
  isDevEnv,
  isProdEnv,
} from "lib/config/env.config";
import entitlementsWebhook from "lib/entitlements/webhooks";
import createGraphqlContext from "lib/graphql/createGraphqlContext";
import {
  armorPlugin,
  authenticationPlugin,
  organizationsPlugin,
} from "lib/graphql/plugins";
import idpWebhook from "lib/idp/webhooks";
import { maintenanceMiddleware } from "lib/middleware/maintenance";
import { initializeSearchIndexes, search } from "lib/search";

// TODO run on Bun runtime instead of Node, track https://github.com/oven-sh/bun/issues/11785

/** Health check timeout in milliseconds */
const HEALTH_CHECK_TIMEOUT_MS = 5000;

/**
 * Verify PDP (authorization service) is healthy before starting.
 * Fails startup if authz is enabled but PDP is unavailable.
 */
async function verifyPdpHealth(): Promise<void> {
  if (AUTHZ_ENABLED !== "true" || !AUTHZ_API_URL) {
    console.log("[AuthZ] Disabled or not configured, skipping health check");
    return;
  }

  try {
    const response = await fetch(`${AUTHZ_API_URL}/health`, {
      signal: AbortSignal.timeout(HEALTH_CHECK_TIMEOUT_MS),
    });

    if (!response.ok) {
      throw new Error(`PDP health check failed: ${response.status}`);
    }

    console.log("[AuthZ] PDP health check passed");
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unknown error during health check";
    console.error(`[AuthZ] PDP health check failed: ${message}`);
    throw new Error(`PDP unavailable: ${message}`);
  }
}

/**
 * Start the Elysia server with preflight checks.
 */
async function startServer(): Promise<void> {
  // Preflight: verify external dependencies
  await verifyPdpHealth();

  /**
   * Elysia server.
   */
  const app = new Elysia({
    ...(isDevEnv && {
      serve: {
        // https://elysiajs.com/patterns/configuration#serve-tls
        // https://bun.sh/guides/http/tls
        tls: {
          certFile: "cert.pem",
          keyFile: "key.pem",
        },
      },
    }),
  })
    .onAfterHandle(({ set }) => {
      set.headers["X-Content-Type-Options"] = "nosniff";
      set.headers["X-Frame-Options"] = "DENY";
      set.headers["X-XSS-Protection"] = "1; mode=block";
      set.headers["Referrer-Policy"] = "strict-origin-when-cross-origin";
    })
    .use(maintenanceMiddleware)
    .use(
      rateLimit({
        max: 100,
        duration: 60_000,
      }),
    )
    .use(
      cors({
        origin: CORS_ALLOWED_ORIGINS!.split(","),
        methods: ["GET", "POST", "OPTIONS"],
      }),
    )
    .use(authzRoutes)
    .use(entitlementsWebhook)
    .use(idpWebhook)
    .use(
      yoga({
        schema,
        context: createGraphqlContext,
        // only enable web UIs in development
        graphiql: isDevEnv,
        plugins: [
          ...armorPlugin,
          authenticationPlugin,
          // organizations plugin must run after authentication to access observer
          organizationsPlugin,
          useMoreDetailedErrors(),
          // disable GraphQL schema introspection in production to mitigate reverse engineering
          isProdEnv && useDisableIntrospection(),
          isProdEnv &&
            useOpenTelemetry({
              variables: true,
              result: false, // Disable full result logging to reduce serialization overhead
            }),
          // parser and validation caches recommended for Grafast (https://grafast.org/grafast/servers#envelop)
          useParserCache(),
          useValidationCache(),
          useGrafast(),
        ],
      }),
    )
    .listen(PORT);

  // Initialize search indexes if search is enabled
  if (search) {
    initializeSearchIndexes().catch((err) => {
      console.error("[Search] Failed to initialize indexes:", err);
    });
  }

  console.log(
    `🦊 ${appConfig.name} Elysia server running at ${app.server?.url.toString().slice(0, -1)}`,
  );

  console.log(
    `🧘 ${appConfig.name} GraphQL Yoga API running at ${app.server?.url}graphql`,
  );

  const shutdown = async (signal: string) => {
    console.log(`[Server] Received ${signal}, shutting down...`);
    app.stop();
    process.exit(0);
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}

// Start the server
startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
