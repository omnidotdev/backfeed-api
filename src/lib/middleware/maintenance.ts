import { Elysia } from "elysia";
import { isMaintenanceMode } from "lib/flags";

/**
 * Maintenance mode middleware.
 * Returns 503 Service Unavailable when maintenance mode is enabled.
 * Health check endpoint is always allowed through.
 */
export const maintenanceMiddleware = new Elysia({ name: "maintenance" }).derive(
  async ({ request, set }) => {
    const url = new URL(request.url);

    // Allow health checks through
    if (url.pathname === "/health") return {};

    if (await isMaintenanceMode()) {
      set.status = 503;
      set.headers["Retry-After"] = "300";
      throw new Error("Service temporarily unavailable for maintenance");
    }

    return {};
  },
);
