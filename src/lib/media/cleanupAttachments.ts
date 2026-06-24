/**
 * Best-effort deletion of attachment objects from storage. Kept as a
 * module-level function (not an inline plan dependency) so the storage provider
 * instance stays out of the exported executable schema.
 */

import { storage } from "lib/providers";

/** Delete every given object-storage key (orphan cleanup). Never throws. */
export const deleteStorageObjects = async (
  keys: ReadonlyArray<string | null | undefined>,
): Promise<void> => {
  for (const key of keys) {
    if (!key) continue;
    try {
      await storage.delete(key);
    } catch (error) {
      console.warn(`[Media] Failed to delete orphaned ${key}:`, error);
    }
  }
};
