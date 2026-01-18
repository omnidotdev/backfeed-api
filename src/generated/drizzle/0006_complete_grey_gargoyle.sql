CREATE TABLE "project_link" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"url" text NOT NULL,
	"title" text,
	"order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp(6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp(6) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP TABLE "project_social" CASCADE;--> statement-breakpoint
ALTER TABLE "project_link" ADD CONSTRAINT "project_link_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "project_link_id_index" ON "project_link" USING btree ("id");--> statement-breakpoint
CREATE UNIQUE INDEX "project_link_url_project_id_index" ON "project_link" USING btree ("url","project_id");--> statement-breakpoint
CREATE INDEX "project_link_project_id_index" ON "project_link" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "project_link_url_index" ON "project_link" USING btree ("url");--> statement-breakpoint
ALTER TABLE "project" DROP COLUMN "website";