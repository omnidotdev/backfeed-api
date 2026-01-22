import {
  BILLING_BASE_URL,
  BILLING_SERVICE_API_KEY,
} from "lib/config/env.config";

interface EntitlementsData {
  billingAccountId: string;
  entityType: string;
  entityId: string;
  entitlementVersion: number;
  entitlements: Array<{
    id: string;
    appId: string;
    featureKey: string;
    value: string | null;
    source: string;
    validFrom: string;
    validUntil: string | null;
  }>;
}

type EntitlementsResult =
  | { status: "success"; data: EntitlementsData }
  | { status: "unavailable"; error: string };

/**
 * Get all entitlements for an entity.
 * Fetches entitlements for a specific app from the billing service (Aether).
 */
export async function getEntitlements(
  entityType: string,
  entityId: string,
  appId: string,
): Promise<EntitlementsResult> {
  if (!BILLING_SERVICE_API_KEY) {
    return {
      status: "unavailable",
      error: "BILLING_SERVICE_API_KEY not configured",
    };
  }

  if (!BILLING_BASE_URL) {
    return { status: "unavailable", error: "BILLING_BASE_URL not configured" };
  }

  try {
    const url = new URL(
      `${BILLING_BASE_URL}/entitlements/${appId}/${entityType}/${entityId}`,
    );

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${BILLING_SERVICE_API_KEY}`,
      },
    });

    if (!res.ok) {
      return {
        status: "unavailable",
        error: `Entitlements service returned ${res.status}`,
      };
    }

    const data = (await res.json()) as EntitlementsData;
    return { status: "success", data };
  } catch (err) {
    return {
      status: "unavailable",
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}
