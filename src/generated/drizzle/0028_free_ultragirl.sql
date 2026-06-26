CREATE TABLE "post_reference" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"source_type" text NOT NULL,
	"source_id" uuid NOT NULL,
	"target_post_id" uuid NOT NULL,
	"ref_kind" text NOT NULL,
	"keyword" text,
	"fired_at" timestamp(6) with time zone,
	"organization_id" text NOT NULL,
	"created_at" timestamp(6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp(6) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "post_reference_edge_unique" UNIQUE("source_type","source_id","target_post_id","keyword")
);
--> statement-breakpoint
ALTER TABLE "status_template" ADD COLUMN "keyword_role" text;--> statement-breakpoint
ALTER TABLE "post_reference" ADD CONSTRAINT "post_reference_target_post_id_post_id_fk" FOREIGN KEY ("target_post_id") REFERENCES "public"."post"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "post_reference_id_index" ON "post_reference" USING btree ("id");--> statement-breakpoint
CREATE INDEX "post_reference_target_idx" ON "post_reference" USING btree ("target_post_id");--> statement-breakpoint
CREATE INDEX "post_reference_source_idx" ON "post_reference" USING btree ("source_type","source_id");--> statement-breakpoint
CREATE INDEX "post_reference_organization_id_idx" ON "post_reference" USING btree ("organization_id");