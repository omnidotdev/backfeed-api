import { isEnabled } from "./client";

/** @knipignore */
export const FLAGS = {
  MAINTENANCE: "backfeed-api-maintenance-mode",
} as const;

/**
 * Check if maintenance mode is enabled.
 */
export const isMaintenanceMode = async (): Promise<boolean> => {
  return isEnabled(FLAGS.MAINTENANCE, false);
};
