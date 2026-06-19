CREATE TABLE "post_status_change" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"post_id" uuid NOT NULL,
	"to_status_template_id" uuid,
	"changed_by_id" uuid,
	"created_at" timestamp(6) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "post_status_change" ADD CONSTRAINT "post_status_change_post_id_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."post"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_status_change" ADD CONSTRAINT "post_status_change_to_status_template_id_status_template_id_fk" FOREIGN KEY ("to_status_template_id") REFERENCES "public"."status_template"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_status_change" ADD CONSTRAINT "post_status_change_changed_by_id_user_id_fk" FOREIGN KEY ("changed_by_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "post_status_change_post_id_index" ON "post_status_change" USING btree ("post_id");