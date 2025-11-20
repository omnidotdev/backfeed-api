import { isDevEnv, SANDBOX_PRODUCT_IDS } from "lib/config/env.config";

const sandboxProductIds: string[] = SANDBOX_PRODUCT_IDS;

// TODO: add static production product IDs when available.
const productionProductIds: string[] = [];

export const PRODUCT_IDS = isDevEnv ? sandboxProductIds : productionProductIds;
