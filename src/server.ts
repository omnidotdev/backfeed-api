import { cors } from "@elysiajs/cors";
import { yoga } from "@elysiajs/graphql-yoga";
import { useParserCache } from "@envelop/parser-cache";
import { useValidationCache } from "@envelop/validation-cache";
import { Elysia } from "elysia";
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
    .use(maintenanceMiddleware)
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
          // parser and validation caches recommended for Grafast (https://grafast.org/grafast/servers#envelop)
          useParserCache(),
          useValidationCache(),
          useGrafast(),
        ],
      }),
    )
    .listen(PORT);

  console.log(
    `🦊 ${appConfig.name} Elysia server running at ${app.server?.url.toString().slice(0, -1)}`,
  );

  console.log(
    `🧘 ${appConfig.name} GraphQL Yoga API running at ${app.server?.url}graphql`,
  );
}

// Start the server
startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
