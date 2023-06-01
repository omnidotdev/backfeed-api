import { PrismaClient } from "@prisma/client";

/**
 * Prisma database client.
 */
const db = new PrismaClient();

export default db;
