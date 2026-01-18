ALTER TABLE "workspace" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "workspace" CASCADE;--> statement-breakpoint
ALTER TABLE "project_social" RENAME TO "project_link";--> statement-breakpoint
ALTER TABLE "project" RENAME COLUMN "workspace_id" TO "organization_id";--> statement-breakpoint
ALTER TABLE "status_template" RENAME COLUMN "workspace_id" TO "organization_id";--> statement-breakpoint
ALTER TABLE "project" DROP CONSTRAINT "project_slug_workspaceId_unique";--> statement-breakpoint
ALTER TABLE "status_template" DROP CONSTRAINT "status_template_workspaceId_name_unique";--> statement-breakpoint
ALTER TABLE "project" DROP CONSTRAINT "project_workspace_id_workspace_id_fk";
--> statement-breakpoint
ALTER TABLE "project_link" DROP CONSTRAINT "project_social_project_id_project_id_fk";
--> statement-breakpoint
ALTER TABLE "status_template" DROP CONSTRAINT "status_template_workspace_id_workspace_id_fk";
--> statement-breakpoint
DROP INDEX "project_workspace_id_index";--> statement-breakpoint
DROP INDEX "project_social_id_index";--> statement-breakpoint
DROP INDEX "project_social_url_project_id_index";--> statement-breakpoint
DROP INDEX "project_social_project_id_index";--> statement-breakpoint
DROP INDEX "project_social_url_index";--> statement-breakpoint
DROP INDEX "status_template_workspace_id_index";--> statement-breakpoint
ALTER TABLE "project_link" ADD COLUMN "title" text;--> statement-breakpoint
ALTER TABLE "project_link" ADD COLUMN "order" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "project_link" ADD CONSTRAINT "project_link_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "project_organization_id_idx" ON "project" USING btree ("organization_id");--> statement-breakpoint
CREATE UNIQUE INDEX "project_link_id_index" ON "project_link" USING btree ("id");--> statement-breakpoint
CREATE UNIQUE INDEX "project_link_url_project_id_index" ON "project_link" USING btree ("url","project_id");--> statement-breakpoint
CREATE INDEX "project_link_project_id_index" ON "project_link" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "project_link_url_index" ON "project_link" USING btree ("url");--> statement-breakpoint
CREATE INDEX "status_template_organization_id_idx" ON "status_template" USING btree ("organization_id");--> statement-breakpoint
ALTER TABLE "project" DROP COLUMN "website";--> statement-breakpoint
ALTER TABLE "project" ADD CONSTRAINT "project_org_slug_idx" UNIQUE("slug","organization_id");--> statement-breakpoint
ALTER TABLE "status_template" ADD CONSTRAINT "status_template_org_name_idx" UNIQUE("organization_id","name");