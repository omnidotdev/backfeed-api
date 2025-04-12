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
      count: 200,
      columns: {
        name: f.companyName({ isUnique: true }),
      },
      with: {
        projects: 50,
      },
    },
    projects: {
      columns: {
        description: f.loremIpsum(),
        name: f.string({
          isUnique: true,
        }),
      },
      with: {
        // TODO: figure out how to seed post statuses correctly
        postStatuses: 5,
        posts: 20,
      },
    },
    posts: {
      columns: {
        title: f.companyName(),
        description: f.loremIpsum(),
        createdAt: f.date({
          minDate: dayjs(new Date()).subtract(7, "day").format("YYYY-MM-DD"),
          maxDate: dayjs(new Date()).format("YYYY-MM-DD"),
        }),
      },
      with: {
        comments: 10,
      },
    },
    users: {
      count: 500,
      with: {
        upvotes: 10,
        downvotes: 10,
      },
    },
    members: {
      count: 100,
    },
    comments: {
      columns: {
        message: f.loremIpsum(),
      },
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
