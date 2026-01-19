ALTER TABLE "post" ADD COLUMN "number" integer;--> statement-breakpoint
ALTER TABLE "project" ADD COLUMN "next_post_number" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "post" ADD CONSTRAINT "post_project_number_unique" UNIQUE("project_id","number");