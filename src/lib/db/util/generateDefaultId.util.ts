import { uuid } from "drizzle-orm/pg-core";

/**
 * Generate a default ID database column.
 */
const generateDefaultId = () => uuid().primaryKey().defaultRandom();

export default generateDefaultId;
