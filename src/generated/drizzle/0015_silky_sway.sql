CREATE TABLE "signal_cluster" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"label" text,
	"summary" text,
	"centroid" vector(1536),
	"member_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp(6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp(6) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "post" ADD COLUMN "sentiment" text;--> statement-breakpoint
ALTER TABLE "post" ADD COLUMN "ai_tags" jsonb;--> statement-breakpoint
ALTER TABLE "post" ADD COLUMN "embedding" vector(1536);--> statement-breakpoint
ALTER TABLE "post" ADD COLUMN "duplicate_of_id" uuid;--> statement-breakpoint
ALTER TABLE "post" ADD COLUMN "cluster_id" uuid;--> statement-breakpoint
ALTER TABLE "signal" ADD COLUMN "embedding" vector(1536);--> statement-breakpoint
ALTER TABLE "signal" ADD COLUMN "cluster_id" uuid;--> statement-breakpoint
ALTER TABLE "signal_cluster" ADD CONSTRAINT "signal_cluster_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "signal_cluster_project_id_index" ON "signal_cluster" USING btree ("project_id");--> statement-breakpoint
ALTER TABLE "post" ADD CONSTRAINT "post_duplicate_of_id_post_id_fk" FOREIGN KEY ("duplicate_of_id") REFERENCES "public"."post"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post" ADD CONSTRAINT "post_cluster_id_signal_cluster_id_fk" FOREIGN KEY ("cluster_id") REFERENCES "public"."signal_cluster"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "signal" ADD CONSTRAINT "signal_cluster_id_signal_cluster_id_fk" FOREIGN KEY ("cluster_id") REFERENCES "public"."signal_cluster"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "post_duplicate_of_id_index" ON "post" USING btree ("duplicate_of_id");--> statement-breakpoint
CREATE INDEX "post_cluster_id_index" ON "post" USING btree ("cluster_id");--> statement-breakpoint
CREATE INDEX "signal_cluster_id_index" ON "signal" USING btree ("cluster_id");