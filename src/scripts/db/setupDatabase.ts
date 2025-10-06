/**
 * @file Set up a database.
 */

import { $ } from "bun";

import { DATABASE_NAME } from "lib/config/env.config";

// biome-ignore lint/suspicious/noConsoleLog: script logging
console.log(`Creating ${DATABASE_NAME} database...`);
await $`createdb -U postgres ${DATABASE_NAME}`;
// biome-ignore lint/suspicious/noConsoleLog: script logging
console.log("Database created");
