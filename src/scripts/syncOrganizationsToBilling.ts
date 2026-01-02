// biome-ignore-all lint/suspicious/noConsole: CLI script with intentional logging
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { DATABASE_URL, ENTITLEMENTS_BASE_URL } from "lib/config/env.config";
import { organizations } from "lib/db/schema";
import { Pool } from "pg";

const BILLING_GRAPHQL_URL = `${ENTITLEMENTS_BASE_URL?.replace(/\/$/, "")}/graphql`;

interface CreateBillingAccountResponse {
  data?: {
    createBillingAccount?: {
      billingAccount: {
        id: string;
      };
    };
  };
  errors?: Array<{ message: string }>;
}

/**
 * Create a billing account for an organization.
 */
const createBillingAccount = async (
  entityType: string,
  entityId: string,
  accountType: "individual" | "team" | "enterprise" = "team",
): Promise<string | null> => {
  const mutation = `
    mutation CreateBillingAccount($input: CreateBillingAccountInput!) {
      createBillingAccount(input: $input) {
        billingAccount {
          id
        }
      }
    }
  `;

  try {
    const response = await fetch(BILLING_GRAPHQL_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: mutation,
        variables: {
          input: {
            billingAccount: {
              entityType,
              entityId,
              accountType,
              provider: "stripe",
            },
          },
        },
      }),
    });

    const result = (await response.json()) as CreateBillingAccountResponse;

    if (result.errors?.length) {
      console.error(
        `  Error creating billing account: ${result.errors[0].message}`,
      );
      return null;
    }

    return result.data?.createBillingAccount?.billingAccount?.id ?? null;
  } catch (err) {
    console.error(`  Network error creating billing account:`, err);
    return null;
  }
};

/**
 * Create default tier entitlements for a billing account.
 */
const createTierEntitlements = async (
  billingAccountId: string,
  tier: "free" | "basic" | "team" | "enterprise",
): Promise<boolean> => {
  const mutation = `
    mutation CreateEntitlement($input: CreateEntitlementInput!) {
      createEntitlement(input: $input) {
        entitlement {
          id
        }
      }
    }
  `;

  try {
    const response = await fetch(BILLING_GRAPHQL_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: mutation,
        variables: {
          input: {
            entitlement: {
              billingAccountId,
              productId: "backfeed",
              featureKey: "tier",
              value: tier,
              source: "MANUAL",
            },
          },
        },
      }),
    });

    const result = await response.json();

    if (result.errors?.length) {
      console.error(
        `  Error creating entitlement: ${result.errors[0].message}`,
      );
      return false;
    }

    return true;
  } catch (err) {
    console.error(`  Network error creating entitlement:`, err);
    return false;
  }
};

/**
 * Sync all organizations to the billing service.
 * Creates billing accounts and sets up initial tier entitlements.
 */
const syncOrganizationsToBilling = async () => {
  if (!DATABASE_URL) {
    console.error("DATABASE_URL not set");
    process.exit(1);
  }

  if (!ENTITLEMENTS_BASE_URL) {
    console.error("ENTITLEMENTS_BASE_URL not set");
    process.exit(1);
  }

  const pool = new Pool({ connectionString: DATABASE_URL });
  const db = drizzle({ client: pool, casing: "snake_case" });

  console.log("Syncing organizations to billing service...");
  console.log(`Billing URL: ${BILLING_GRAPHQL_URL}`);

  // Get all organizations
  const orgs = await db.select().from(organizations);

  console.log(`Found ${orgs.length} organizations`);

  let created = 0;
  let skipped = 0;
  let failed = 0;

  for (const org of orgs) {
    console.log(`\nProcessing organization: ${org.slug} (${org.id})`);

    // Skip if already has billing account
    if (org.billingAccountId) {
      console.log(
        `  Already linked to billing account: ${org.billingAccountId}`,
      );
      skipped++;
      continue;
    }

    // Create billing account
    const billingAccountId = await createBillingAccount(
      "organization",
      org.id,
      "team",
    );

    if (!billingAccountId) {
      console.log(`  Failed to create billing account`);
      failed++;
      continue;
    }

    console.log(`  Created billing account: ${billingAccountId}`);

    // Create tier entitlement based on current tier
    const entitlementCreated = await createTierEntitlements(
      billingAccountId,
      org.tier,
    );

    if (!entitlementCreated) {
      console.log(`  Warning: Failed to create tier entitlement`);
    } else {
      console.log(`  Created tier entitlement: ${org.tier}`);
    }

    // Update organization with billing account ID
    await db
      .update(organizations)
      .set({ billingAccountId })
      .where(eq(organizations.id, org.id));

    console.log(`  Updated organization with billingAccountId`);
    created++;
  }

  console.log("\n--- Summary ---");
  console.log(`Created: ${created}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Failed: ${failed}`);

  await pool.end();
};

await syncOrganizationsToBilling()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
