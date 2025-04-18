import { defineConfig } from "drizzle-kit";

import { DATABASE_URL } from "./src/lib/config/env.config";

export default defineConfig({
  out: "./src/lib/drizzle/migrations",
  schema: "./src/lib/drizzle/schema/index.ts",
  dialect: "postgresql",
  casing: "snake_case",
  dbCredentials: {
    url: DATABASE_URL!,
  },
});
