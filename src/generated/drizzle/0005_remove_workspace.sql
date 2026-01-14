-- Migration: Remove workspace table, migrate to direct organization_id references
-- Step 1: Drop foreign key constraints first (before dropping workspace table)
ALTER TABLE "project" DROP CONSTRAINT IF EXISTS "project_workspace_id_workspace_id_fk";--> statement-breakpoint
ALTER TABLE "status_template" DROP CONSTRAINT IF EXISTS "status_template_workspace_id_workspace_id_fk";--> statement-breakpoint

-- Step 2: Drop unique constraints that reference workspace_id
ALTER TABLE "project" DROP CONSTRAINT IF EXISTS "project_slug_workspaceId_unique";--> statement-breakpoint
ALTER TABLE "status_template" DROP CONSTRAINT IF EXISTS "status_template_workspaceId_name_unique";--> statement-breakpoint

-- Step 3: Drop old indexes
DROP INDEX IF EXISTS "project_workspace_id_index";--> statement-breakpoint
DROP INDEX IF EXISTS "status_template_workspace_id_index";--> statement-breakpoint

-- Step 4: Rename columns from workspace_id to organization_id
ALTER TABLE "project" RENAME COLUMN "workspace_id" TO "organization_id";--> statement-breakpoint
ALTER TABLE "status_template" RENAME COLUMN "workspace_id" TO "organization_id";--> statement-breakpoint

-- Step 5: Create new indexes for organization_id
CREATE INDEX "project_organization_id_idx" ON "project" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "status_template_organization_id_idx" ON "status_template" USING btree ("organization_id");--> statement-breakpoint

-- Step 6: Create new unique constraints
ALTER TABLE "project" ADD CONSTRAINT "project_org_slug_idx" UNIQUE("slug","organization_id");--> statement-breakpoint
ALTER TABLE "status_template" ADD CONSTRAINT "status_template_org_name_idx" UNIQUE("organization_id","name");--> statement-breakpoint

-- Step 7: Drop the workspace table
ALTER TABLE "workspace" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "workspace" CASCADE;
