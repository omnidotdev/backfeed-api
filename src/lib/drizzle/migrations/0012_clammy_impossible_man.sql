ALTER TABLE "project" DROP CONSTRAINT "project_name_unique";--> statement-breakpoint
ALTER TABLE "organization" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "project" ALTER COLUMN "name" SET NOT NULL;