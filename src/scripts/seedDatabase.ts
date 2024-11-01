import { faker } from "@faker-js/faker";
import { and, eq } from "drizzle-orm";

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

import type {
  PgInsertValue,
  PgTable,
  PgTableWithColumns,
  TableConfig,
} from "drizzle-orm/pg-core";
import type {
  InsertPost,
  InsertProject,
  InsertUpvote,
} from "lib/drizzle/schema";

/**
 * Seed a database entity with sample data.
 */
const seedDatabase = async () => {
  // ! NB: only run this script in development
  if (!isDev || !DATABASE_URL?.includes("localhost")) {
    console.log("This script can only be run in development");
    process.exit(1);
  }

  console.log("Seeding database...");

  await dbPool.transaction(async (tx) => {
    const performTx = async <T extends TableConfig>(
      entity: PgTableWithColumns<T>,
      seedFn: () => Promise<PgInsertValue<PgTable<T>>[]>
    ) => {
      await tx.delete(entity);

      const newEntities = await seedFn();

      // @ts-ignore TODO fix
      await tx.insert(entity).values(newEntities);

      return newEntities;
    };

    const newUsers = await performTx(users, async () => {
      return Array.from({ length: 10 }, () => ({
        // hell yeah
        walletAddress: faker.finance.ethereumAddress(),
      }));
    });

    const newOrganizations = await performTx(organizations, async () => {
      return Array.from({ length: 10 }, () => ({
        name: faker.company.name(),
        slug: faker.lorem.slug(),
      }));
    });

    const newProjects = await performTx(projects, async () => {
      const newProjects: InsertProject[] = [];

      for (let i = 0; i < 10; i++) {
        const randomOrganization =
          newOrganizations[Math.floor(Math.random() * newOrganizations.length)];

        const [selectedOrganization] = await tx
          .select()
          .from(organizations)
          .where(eq(organizations.name, randomOrganization.name!));

        newProjects.push({
          // NB: using the index due to the unique constraint in the projects table
          name: `${faker.company.buzzVerb()}-${i}`,
          description: faker.lorem.paragraph(),
          slug: faker.lorem.slug(),
          image: faker.image.avatar(),
          organizationId: selectedOrganization.id,
        });
      }

      return newProjects;
    });

    const newPosts = await performTx(posts, async () => {
      const newPosts: InsertPost[] = [];

      for (let i = 0; i < 10; i++) {
        const randomProject =
          newProjects[Math.floor(Math.random() * newProjects.length)];
        const randomUser =
          newUsers[Math.floor(Math.random() * newUsers.length)];

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

        newPosts.push({
          title: `${faker.commerce.productAdjective()} ${faker.commerce.product()}`,
          description: faker.lorem.paragraph(),
          projectId: selectedProject.id,
          userId: selectedUser.id,
        });
      }

      return newPosts;
    });

    await performTx(upvotes, async () => {
      const newUpvotes: InsertUpvote[] = [];

      for (let i = 0; i < 10; i++) {
        // NB: not randomizing the user here due to the unique constraint in the upvotes table
        const user = newUsers[i];
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

        newUpvotes.push({
          postId: selectedPost.id,
          userId: selectedUser.id,
        });
      }

      return newUpvotes;
    });
  });

  console.log("Database has been seeded successfully!");
};

await seedDatabase()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
