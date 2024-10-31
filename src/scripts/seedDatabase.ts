import { faker } from "@faker-js/faker";
import { and, eq, TablesRelationalConfig } from "drizzle-orm";
import { NodePgQueryResultHKT } from "drizzle-orm/node-postgres";
import { PgTransaction } from "drizzle-orm/pg-core";

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

/**
 * Seed database users.
 */
const seedUsers = async <
  TFullSchema extends Record<string, unknown>,
  TSchema extends TablesRelationalConfig,
>(
  tx: PgTransaction<NodePgQueryResultHKT, TFullSchema, TSchema>,
) => {
  // users
  await tx.delete(users);

  const newUsers: InsertUser[] = [];
  for (let i = 0; i < 10; i++) {
    newUsers.push({
      // hell yeah
      walletAddress: faker.finance.ethereumAddress(),
    });
  }

  await tx.insert(users).values(newUsers);

  return newUsers;
};

/**
 * Seed database organizations.
 */
const seedOrganizations = async <
  TFullSchema extends Record<string, unknown>,
  TSchema extends TablesRelationalConfig,
>(
  tx: PgTransaction<NodePgQueryResultHKT, TFullSchema, TSchema>,
) => {
  // organizations
  await tx.delete(organizations);

  const newOrganizations: InsertOrganization[] = [];
  for (let i = 0; i < 10; i++) {
    newOrganizations.push({
      name: faker.company.name(),
      slug: faker.lorem.slug(),
    });
  }

  await tx.insert(organizations).values(newOrganizations);

  return newOrganizations;
};

/**
 * Seed database projects.
 */
const seedProjects = async <
  TFullSchema extends Record<string, unknown>,
  TSchema extends TablesRelationalConfig,
>(
  tx: PgTransaction<NodePgQueryResultHKT, TFullSchema, TSchema>,
  { newOrganizations }: { newOrganizations: InsertOrganization[] },
) => {
  // projects
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

  return newProjects;
};

/**
 * Seed database posts.
 */
const seedPosts = async <
  TFullSchema extends Record<string, unknown>,
  TSchema extends TablesRelationalConfig,
>(
  tx: PgTransaction<NodePgQueryResultHKT, TFullSchema, TSchema>,
  {
    newProjects,
    newUsers,
  }: { newProjects: InsertProject[]; newUsers: InsertUser[] },
) => {
  // posts
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
            selectedProject.organizationId,
          ),
        ),
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

  return newPosts;
};

/**
 * Seed database upvotes.
 */
const seedUpvotes = async <
  TFullSchema extends Record<string, unknown>,
  TSchema extends TablesRelationalConfig,
>(
  tx: PgTransaction<NodePgQueryResultHKT, TFullSchema, TSchema>,
  { newPosts, newUsers }: { newPosts: InsertPost[]; newUsers: InsertUser[] },
) => {
  // upvotes
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

  return newUpvotes;
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
    const newUsers = await seedUsers(tx);
    const newOrganizations = await seedOrganizations(tx);
    const newProjects = await seedProjects(tx, { newOrganizations });
    const newPosts = await seedPosts(tx, { newProjects, newUsers });
    await seedUpvotes(tx, { newPosts, newUsers });
  });

  console.log("Database has been seeded successfully!");
};

await seedDatabase()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
