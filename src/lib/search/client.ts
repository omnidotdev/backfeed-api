import { OmniSearch, indexes } from "@omnidotdev/search";

import {
  MEILISEARCH_MASTER_KEY,
  MEILISEARCH_URL,
  isSearchEnabled,
} from "lib/config/env.config";

/**
 * Meilisearch client for Backfeed.
 * Only initialized if SEARCH_ENABLED is true and credentials are present.
 */
export const search = isSearchEnabled
  ? new OmniSearch({
      host: MEILISEARCH_URL!,
      masterKey: MEILISEARCH_MASTER_KEY!,
    })
  : null;

/**
 * Backfeed index configurations.
 */
export const backfeedIndexes = indexes.backfeed;

/**
 * Initialize Backfeed search indexes.
 * Should be called during application bootstrap.
 */
export async function initializeSearchIndexes(): Promise<void> {
  if (!search) {
    return;
  }

  try {
    await search.configureIndex(backfeedIndexes.projects);
    await search.configureIndex(backfeedIndexes.submissions);
  } catch (error) {
    console.error("[Search] Failed to initialize indexes:", error);
    // Don't throw - search is non-critical
  }
}
