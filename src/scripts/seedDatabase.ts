import { faker } from "@faker-js/faker";
import {
  type TableConfig,
  type TablesRelationalConfig,
  and,
  eq,
} from "drizzle-orm";
import type { NodePgQueryResultHKT } from "drizzle-orm/node-postgres";
import type { PgTable, PgTransaction } from "drizzle-orm/pg-core";

import { DATABASE_URL, isDev } from "lib/config/env";
import { dbPool } from "lib/db/db";
import {
  organizations,
  posts,
  projects,
  upvotes,
  users,
  usersToOrganizations,
} from "lib/drizzle/schema";

/**
 * Seed a database entity with sample data.
 */
const seedEntity = async <
  TFullSchema extends Record<string, unknown>,
  TSchema extends TablesRelationalConfig,
>(
  /** Transaction to run the seed in. */
  tx: PgTransaction<NodePgQueryResultHKT, TFullSchema, TSchema>,
  /*** Database entity to seed. */
  entity: PgTable<TableConfig>,
  /** Custom seed logic. */
  seedFn: (
    tx: PgTransaction<NodePgQueryResultHKT, TFullSchema, TSchema>
    // TODO type properly
    // biome-ignore lint/suspicious/noExplicitAny: tricky to type
  ) => any[] | Promise<any[]>
) => {
  // delete all entities
  await tx.delete(entity);

  const newEntities = await seedFn(tx);

  // insert new entities
  await tx.insert(entity).values(newEntities);

  return newEntities;
};

/**
 * Seed the database with sample data.
 * ! NB: only run this script in development
 */
const seedDatabase = async () => {
  if (!isDev || !DATABASE_URL?.includes("localhost")) {
    console.error("This script can only be run in development.");
    process.exit(1);
  }

  console.log("Seeding database...");

  await dbPool.transaction(async (tx) => {
    const newUsers = await seedEntity(tx, users, () =>
      Array.from({ length: 10 }, () => ({
        // hell yeah
        walletAddress: faker.finance.ethereumAddress(),
      }))
    );

    const newOrganizations = await seedEntity(tx, organizations, () =>
      Array.from({ length: 10 }, () => ({
        name: faker.company.name(),
        slug: faker.lorem.slug(),
      }))
    );

    const newProjects = await seedEntity(tx, projects, async () => {
      const randomOrganization =
        newOrganizations[Math.floor(Math.random() * newOrganizations.length)];

      const [selectedOrganization] = await tx
        .select()
        .from(organizations)
        .where(eq(organizations.name, randomOrganization.name!));

      return Array.from({ length: 10 }, (_, idx) => ({
        // NB: using the index due to the unique constraint in the projects table
        name: `${faker.company.buzzVerb()}-${idx}`,
        description: faker.lorem.paragraph(),
        slug: faker.lorem.slug(),
        image: faker.image.avatar(),
        organizationId: selectedOrganization.id,
      }));
    });

    const newPosts = await seedEntity(tx, posts, async () => {
      const randomProject =
        newProjects[Math.floor(Math.random() * newProjects.length)];

      const randomUser = newUsers[Math.floor(Math.random() * newUsers.length)];

      const [selectedProject] = await tx
        .select()
        .from(projects)
        .where(eq(projects.name, randomProject.name!));

      const [selectedUser] = await tx
        .select()
        .from(users)
        .where(eq(users.walletAddress, randomUser.walletAddress!));

      const [userOrganization] = await tx
        .select()
        .from(usersToOrganizations)
        .where(
          and(
            eq(usersToOrganizations.userId, selectedUser.id),
            eq(
              usersToOrganizations.organizationId,
              selectedProject.organizationId
            )
          )
        );

      if (!userOrganization) {
        await tx.insert(usersToOrganizations).values({
          userId: selectedUser.id,
          organizationId: selectedProject.organizationId,
        });
      }

      return Array.from({ length: 10 }, () => ({
        title: `${faker.commerce.productAdjective()} ${faker.commerce.product()}`,
        description: faker.lorem.paragraph(),
        projectId: selectedProject.id,
        userId: selectedUser.id,
      }));
    });

    await seedEntity(tx, upvotes, () =>
      Array.from({ length: 10 }, async (_, idx) => {
        // NB: not randomizing the user here due to the unique constraint in the upvotes table
        const user = newUsers[idx];

        const randomPost =
          newPosts[Math.floor(Math.random() * newUsers.length)];

        const [selectedUser] = await tx
          .select()
          .from(users)
          .where(eq(users.walletAddress, user.walletAddress!));

        const [selectedPost] = await tx
          .select()
          .from(posts)
          .where(eq(posts.title, randomPost.title!));

        return {
          postId: selectedPost.id,
          userId: selectedUser.id,
        };
      })
    );
  });

  console.log("Database has been seeded successfully!");
};

await seedDatabase()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
