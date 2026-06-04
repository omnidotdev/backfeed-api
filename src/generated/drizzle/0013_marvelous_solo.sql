CREATE TABLE "signal" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" text NOT NULL,
	"project_id" uuid,
	"user_id" uuid,
	"source" text NOT NULL,
	"type" text,
	"raw_content" text NOT NULL,
	"source_metadata" jsonb,
	"status" text DEFAULT 'pending' NOT NULL,
	"post_id" uuid,
	"sentiment" text,
	"ai_tags" jsonb,
	"created_at" timestamp(6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp(6) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "post" ADD COLUMN "source" text DEFAULT 'widget';--> statement-breakpoint
ALTER TABLE "signal" ADD CONSTRAINT "signal_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "signal" ADD CONSTRAINT "signal_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "signal" ADD CONSTRAINT "signal_post_id_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."post"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "signal_id_index" ON "signal" USING btree ("id");--> statement-breakpoint
CREATE INDEX "signal_organization_id_index" ON "signal" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "signal_project_id_index" ON "signal" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "signal_user_id_index" ON "signal" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "signal_post_id_index" ON "signal" USING btree ("post_id");--> statement-breakpoint
CREATE INDEX "signal_status_index" ON "signal" USING btree ("status");--> statement-breakpoint
CREATE INDEX "signal_source_index" ON "signal" USING btree ("source");