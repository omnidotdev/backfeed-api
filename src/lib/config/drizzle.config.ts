import { defineConfig } from "drizzle-kit";

import { DATABASE_URL } from "./env.config";

export default defineConfig({
  out: "./src/generated/drizzle",
  schema: "./src/lib/db/schema/index.ts",
  dialect: "postgresql",
  casing: "snake_case",
  dbCredentials: {
    url: DATABASE_URL!,
  },
});
