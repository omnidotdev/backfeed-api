CREATE TABLE "project_social" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"url" text NOT NULL,
	"created_at" timestamp(6) with time zone DEFAULT now(),
	"updated_at" timestamp(6) with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "project" ADD COLUMN "website" text;--> statement-breakpoint
ALTER TABLE "project_social" ADD CONSTRAINT "project_social_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "project_social_id_index" ON "project_social" USING btree ("id");--> statement-breakpoint
CREATE UNIQUE INDEX "project_social_url_project_id_index" ON "project_social" USING btree ("url","project_id");--> statement-breakpoint
CREATE INDEX "project_social_project_id_index" ON "project_social" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "project_social_url_index" ON "project_social" USING btree ("url");