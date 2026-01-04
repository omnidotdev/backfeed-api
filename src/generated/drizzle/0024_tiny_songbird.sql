ALTER TABLE "organization" RENAME TO "workspace";--> statement-breakpoint
ALTER TABLE "invitation" RENAME COLUMN "organization_id" TO "workspace_id";--> statement-breakpoint
ALTER TABLE "member" RENAME COLUMN "organization_id" TO "workspace_id";--> statement-breakpoint
ALTER TABLE "project" RENAME COLUMN "organization_id" TO "workspace_id";--> statement-breakpoint
ALTER TABLE "status_template" RENAME COLUMN "organization_id" TO "workspace_id";--> statement-breakpoint
ALTER TABLE "invitation" DROP CONSTRAINT "invitation_organizationId_email_unique";--> statement-breakpoint
ALTER TABLE "member" DROP CONSTRAINT "member_userId_organizationId_unique";--> statement-breakpoint
ALTER TABLE "workspace" DROP CONSTRAINT "organization_name_unique";--> statement-breakpoint
ALTER TABLE "workspace" DROP CONSTRAINT "organization_slug_unique";--> statement-breakpoint
ALTER TABLE "project" DROP CONSTRAINT "project_slug_organizationId_unique";--> statement-breakpoint
ALTER TABLE "status_template" DROP CONSTRAINT "status_template_organizationId_name_unique";--> statement-breakpoint
ALTER TABLE "invitation" DROP CONSTRAINT "invitation_organization_id_organization_id_fk";
--> statement-breakpoint
ALTER TABLE "member" DROP CONSTRAINT "member_organization_id_organization_id_fk";
--> statement-breakpoint
ALTER TABLE "project" DROP CONSTRAINT "project_organization_id_organization_id_fk";
--> statement-breakpoint
ALTER TABLE "status_template" DROP CONSTRAINT "status_template_organization_id_organization_id_fk";
--> statement-breakpoint
DROP INDEX "invitation_organization_id_index";--> statement-breakpoint
DROP INDEX "member_organization_id_index";--> statement-breakpoint
DROP INDEX "organization_id_index";--> statement-breakpoint
DROP INDEX "organization_slug_index";--> statement-breakpoint
DROP INDEX "project_organization_id_index";--> statement-breakpoint
DROP INDEX "status_template_organization_id_index";--> statement-breakpoint
ALTER TABLE "invitation" ADD CONSTRAINT "invitation_workspace_id_workspace_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspace"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member" ADD CONSTRAINT "member_workspace_id_workspace_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspace"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project" ADD CONSTRAINT "project_workspace_id_workspace_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspace"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "status_template" ADD CONSTRAINT "status_template_workspace_id_workspace_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspace"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "invitation_workspace_id_index" ON "invitation" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX "member_workspace_id_index" ON "member" USING btree ("workspace_id");--> statement-breakpoint
CREATE UNIQUE INDEX "workspace_id_index" ON "workspace" USING btree ("id");--> statement-breakpoint
CREATE UNIQUE INDEX "workspace_slug_index" ON "workspace" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "project_workspace_id_index" ON "project" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX "status_template_workspace_id_index" ON "status_template" USING btree ("workspace_id");--> statement-breakpoint
ALTER TABLE "invitation" ADD CONSTRAINT "invitation_workspaceId_email_unique" UNIQUE("workspace_id","email");--> statement-breakpoint
ALTER TABLE "member" ADD CONSTRAINT "member_userId_workspaceId_unique" UNIQUE("user_id","workspace_id");--> statement-breakpoint
ALTER TABLE "workspace" ADD CONSTRAINT "workspace_name_unique" UNIQUE("name");--> statement-breakpoint
ALTER TABLE "workspace" ADD CONSTRAINT "workspace_slug_unique" UNIQUE("slug");--> statement-breakpoint
ALTER TABLE "project" ADD CONSTRAINT "project_slug_workspaceId_unique" UNIQUE("slug","workspace_id");--> statement-breakpoint
ALTER TABLE "status_template" ADD CONSTRAINT "status_template_workspaceId_name_unique" UNIQUE("workspace_id","name");