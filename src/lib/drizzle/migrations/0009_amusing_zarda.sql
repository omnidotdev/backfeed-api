CREATE TABLE "post_status" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"status" text DEFAULT 'open' NOT NULL,
	"description" text,
	"project_id" uuid NOT NULL,
	"created_at" timestamp(6) with time zone DEFAULT now(),
	"updated_at" timestamp(6) with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "post" ADD COLUMN "status_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "post_status" ADD CONSTRAINT "post_status_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "post_status_unique_id_index" ON "post_status" USING btree ("id");--> statement-breakpoint
CREATE INDEX "post_status_project_id_index" ON "post_status" USING btree ("project_id");--> statement-breakpoint
ALTER TABLE "post" ADD CONSTRAINT "post_status_id_post_status_id_fk" FOREIGN KEY ("status_id") REFERENCES "public"."post_status"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "post_status_id_index" ON "post" USING btree ("status_id");