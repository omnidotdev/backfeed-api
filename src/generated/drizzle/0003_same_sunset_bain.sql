ALTER TABLE "workspace" DROP CONSTRAINT "workspace_organization_id_unique";--> statement-breakpoint
ALTER TABLE "workspace" ADD COLUMN "name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "workspace" ADD COLUMN "slug" text NOT NULL;--> statement-breakpoint
ALTER TABLE "workspace" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "workspace" ADD COLUMN "deletion_reason" text;--> statement-breakpoint
CREATE UNIQUE INDEX "workspace_org_slug_idx" ON "workspace" USING btree ("organization_id","slug");--> statement-breakpoint
ALTER TABLE "workspace" DROP COLUMN "tier";--> statement-breakpoint
DROP TYPE "public"."tier";