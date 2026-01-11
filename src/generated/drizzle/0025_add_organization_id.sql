-- Migration: Add organizationId to workspace table
-- This links workspaces to Gatekeeper organizations for multi-tenancy

-- Step 1: Add the organizationId column (nullable initially for backfill)
ALTER TABLE "workspace" ADD COLUMN "organization_id" text;

-- Step 2: Create index for efficient org-scoped queries
CREATE INDEX "workspace_organization_id_idx" ON "workspace" ("organization_id");

-- Step 3: After backfill script runs, make column NOT NULL and update unique constraint
-- Run these manually after backfill:
-- ALTER TABLE "workspace" ALTER COLUMN "organization_id" SET NOT NULL;
-- DROP INDEX "workspace_slug_key";
-- CREATE UNIQUE INDEX "workspace_org_slug_idx" ON "workspace" ("organization_id", "slug");
