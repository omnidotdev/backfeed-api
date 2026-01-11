ALTER TABLE "workspace" ADD COLUMN "organization_id" text;--> statement-breakpoint
CREATE INDEX "workspace_organization_id_idx" ON "workspace" USING btree ("organization_id");