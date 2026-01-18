-- Migration: Unify website and project_social into project_link
-- This migration:
-- 1. Renames project_social to project_link
-- 2. Adds title and order columns
-- 3. Migrates website data from project table to project_link
-- 4. Removes website column from project table

-- Step 1: Rename table and add new columns
ALTER TABLE "project_social" RENAME TO "project_link";

-- Step 2: Add new columns
ALTER TABLE "project_link" ADD COLUMN "title" text;
ALTER TABLE "project_link" ADD COLUMN "order" integer NOT NULL DEFAULT 0;

-- Step 3: Migrate website data from project to project_link
-- Insert website as first link (order 0) for each project that has one
INSERT INTO "project_link" ("id", "project_id", "url", "title", "order", "created_at", "updated_at")
SELECT
  gen_random_uuid(),
  "id",
  "website",
  NULL,
  0,
  NOW(),
  NOW()
FROM "project"
WHERE "website" IS NOT NULL AND "website" != '';

-- Step 4: Update order for existing socials (shift by 1 to account for website being first)
UPDATE "project_link"
SET "order" = subquery.new_order
FROM (
  SELECT
    pl."id",
    ROW_NUMBER() OVER (PARTITION BY pl."project_id" ORDER BY pl."created_at") AS new_order
  FROM "project_link" pl
  WHERE pl."title" IS NULL AND pl."order" = 0
) AS subquery
WHERE "project_link"."id" = subquery."id";

-- Step 5: Remove website column from project table
ALTER TABLE "project" DROP COLUMN "website";

-- Step 6: Update index names (optional, for consistency)
ALTER INDEX IF EXISTS "project_social_id_index" RENAME TO "project_link_id_index";
ALTER INDEX IF EXISTS "project_social_url_project_id_index" RENAME TO "project_link_url_project_id_index";
ALTER INDEX IF EXISTS "project_social_project_id_index" RENAME TO "project_link_project_id_index";
ALTER INDEX IF EXISTS "project_social_url_index" RENAME TO "project_link_url_index";
