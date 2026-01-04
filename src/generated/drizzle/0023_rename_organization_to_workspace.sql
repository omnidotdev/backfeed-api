-- Rename organization table to workspace
ALTER TABLE "organization" RENAME TO "workspace";--> statement-breakpoint

-- Rename organization_id columns to workspace_id
ALTER TABLE "member" RENAME COLUMN "organization_id" TO "workspace_id";--> statement-breakpoint
ALTER TABLE "project" RENAME COLUMN "organization_id" TO "workspace_id";--> statement-breakpoint
ALTER TABLE "invitation" RENAME COLUMN "organization_id" TO "workspace_id";--> statement-breakpoint
ALTER TABLE "status_template" RENAME COLUMN "organization_id" TO "workspace_id";--> statement-breakpoint

-- Rename indexes (drop and recreate with new names)
DROP INDEX IF EXISTS "organization_id_index";--> statement-breakpoint
DROP INDEX IF EXISTS "organization_slug_index";--> statement-breakpoint
CREATE UNIQUE INDEX "workspace_id_index" ON "workspace" USING btree ("id");--> statement-breakpoint
CREATE UNIQUE INDEX "workspace_slug_index" ON "workspace" USING btree ("slug");--> statement-breakpoint

-- Rename constraints
ALTER TABLE "workspace" RENAME CONSTRAINT "organization_name_unique" TO "workspace_name_unique";--> statement-breakpoint
ALTER TABLE "workspace" RENAME CONSTRAINT "organization_slug_unique" TO "workspace_slug_unique";--> statement-breakpoint

-- Rename member table indexes and constraints
DROP INDEX IF EXISTS "member_organization_id_index";--> statement-breakpoint
CREATE INDEX "member_workspace_id_index" ON "member" USING btree ("workspace_id");--> statement-breakpoint
ALTER TABLE "member" RENAME CONSTRAINT "member_user_id_organization_id_unique" TO "member_user_id_workspace_id_unique";--> statement-breakpoint

-- Rename project table indexes and constraints
DROP INDEX IF EXISTS "project_organization_id_index";--> statement-breakpoint
CREATE INDEX "project_workspace_id_index" ON "project" USING btree ("workspace_id");--> statement-breakpoint
ALTER TABLE "project" RENAME CONSTRAINT "project_slug_organization_id_unique" TO "project_slug_workspace_id_unique";--> statement-breakpoint

-- Rename invitation table indexes and constraints
DROP INDEX IF EXISTS "invitation_organization_id_index";--> statement-breakpoint
CREATE INDEX "invitation_workspace_id_index" ON "invitation" USING btree ("workspace_id");--> statement-breakpoint
ALTER TABLE "invitation" RENAME CONSTRAINT "invitation_organization_id_email_unique" TO "invitation_workspace_id_email_unique";--> statement-breakpoint

-- Rename status_template table indexes and constraints
DROP INDEX IF EXISTS "status_template_organization_id_index";--> statement-breakpoint
CREATE INDEX "status_template_workspace_id_index" ON "status_template" USING btree ("workspace_id");--> statement-breakpoint
ALTER TABLE "status_template" RENAME CONSTRAINT "status_template_organization_id_name_unique" TO "status_template_workspace_id_name_unique";--> statement-breakpoint

-- Rename foreign key constraints
ALTER TABLE "member" RENAME CONSTRAINT "member_organization_id_organization_id_fk" TO "member_workspace_id_workspace_id_fk";--> statement-breakpoint
ALTER TABLE "project" RENAME CONSTRAINT "project_organization_id_organization_id_fk" TO "project_workspace_id_workspace_id_fk";--> statement-breakpoint
ALTER TABLE "invitation" RENAME CONSTRAINT "invitation_organization_id_organization_id_fk" TO "invitation_workspace_id_workspace_id_fk";--> statement-breakpoint
ALTER TABLE "status_template" RENAME CONSTRAINT "status_template_organization_id_organization_id_fk" TO "status_template_workspace_id_workspace_id_fk";
