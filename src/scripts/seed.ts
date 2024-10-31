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
  InsertOrganization,
  InsertPost,
  InsertProject,
  InsertUpvote,
  InsertUser,
} from "lib/drizzle/schema";

const seedData = async () => {
  // !!NB: only run this script in development
  if (!isDev || !DATABASE_URL?.includes("localhost")) {
    console.log("This script can only be run in development");
    process.exit(1);
  }

  console.log("Seeding database...");

  await dbPool.transaction(async (tx) => {
    // Users
    await tx.delete(users);

    const newUsers: InsertUser[] = [];
    for (let i = 0; i < 10; i++) {
      newUsers.push({
        // hell yeah
        walletAddress: faker.finance.ethereumAddress(),
      });
    }

    await tx.insert(users).values(newUsers);

    // Organizations
    await tx.delete(organizations);

    const newOrganizations: InsertOrganization[] = [];
    for (let i = 0; i < 10; i++) {
      newOrganizations.push({
        name: faker.company.name(),
        slug: faker.lorem.slug(),
      });
    }

    await tx.insert(organizations).values(newOrganizations);

    // Projects
    await tx.delete(projects);

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

    await tx.insert(projects).values(newProjects);

    // Posts
    await tx.delete(posts);

    const newPosts: InsertPost[] = [];

    for (let i = 0; i < 10; i++) {
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

      newPosts.push({
        title: `${faker.commerce.productAdjective()} ${faker.commerce.product()}`,
        description: faker.lorem.paragraph(),
        projectId: selectedProject.id,
        userId: selectedUser.id,
      });
    }

    await tx.insert(posts).values(newPosts);

    // Upvotes
    await tx.delete(upvotes);

    const newUpvotes: InsertUpvote[] = [];
    for (let i = 0; i < 10; i++) {
      // NB: not randomizing the user here due to the unique constraint in the upvotes table
      const user = newUsers[i];
      const randomPost = newPosts[Math.floor(Math.random() * newUsers.length)];

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

    await tx.insert(upvotes).values(newUpvotes);
  });

  console.log("Database has been seeded successfully!");
};

await seedData()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
