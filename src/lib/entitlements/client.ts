import { ENTITLEMENTS_BASE_URL } from "lib/config/env.config";

interface EntitlementsResponse {
  billingAccountId: string;
  entityType: string;
  entityId: string;
  entitlementVersion: number;
  entitlements: Array<{
    id: string;
    productId: string;
    featureKey: string;
    value: string | null;
    source: string;
    validFrom: string;
    validUntil: string | null;
  }>;
}

/**
 * Get all entitlements for an entity.
 * Optionally filter by product.
 */
export async function getEntitlements(
  entityType: string,
  entityId: string,
  productId?: string,
): Promise<EntitlementsResponse | null> {
  if (!ENTITLEMENTS_BASE_URL) {
    return null;
  }

  try {
    const url = new URL(
      `${ENTITLEMENTS_BASE_URL}/entitlements/${entityType}/${entityId}`,
    );
    if (productId) {
      url.searchParams.set("productId", productId);
    }

    const res = await fetch(url);

    if (!res.ok) {
      return null;
    }

    return res.json();
  } catch {
    return null;
  }
}
