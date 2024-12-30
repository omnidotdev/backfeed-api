import dayjs from "dayjs";
import { drizzle } from "drizzle-orm/node-postgres";
import { reset, seed } from "drizzle-seed";

import { DATABASE_URL, isDevEnv } from "lib/config/env";
import * as schema from "lib/drizzle/schema";

/**
 * Seed a database entity with sample data.
 */
const seedDatabase = async () => {
  // ! NB: only run this script in development
  if (!isDevEnv || !DATABASE_URL?.includes("localhost")) {
    console.log("This script can only be run in development");
    process.exit(1);
  }

  const db = drizzle(DATABASE_URL, { casing: "snake_case" });
  await reset(db, schema);

  console.log("Seeding database...");

  await seed(db, schema).refine((f) => ({
    organizations: {
      count: 400,
      columns: {
        name: f.companyName(),
      },
    },
    projects: {
      count: 2000,
      columns: {
        description: f.loremIpsum(),
        slug: f.string({
          isUnique: true,
        }),
      },
    },
    posts: {
      count: 10000,
      columns: {
        title: f.companyName(),
        description: f.loremIpsum(),
        createdAt: f.date({
          minDate: dayjs(new Date()).subtract(7, "day").format("YYYY-MM-DD"),
          maxDate: dayjs(new Date()).format("YYYY-MM-DD"),
        }),
      },
    },
    users: {
      count: 500,
    },
    usersToOrganizations: {
      count: 50,
    },
    upvotes: {
      count: 1000,
    },
  }));

  console.log("Database has been seeded successfully!");
};

await seedDatabase()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
