ALTER TABLE "post" DROP CONSTRAINT "post_status_id_post_status_id_fk";
--> statement-breakpoint
ALTER TABLE "post" ALTER COLUMN "status_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "post_status" ALTER COLUMN "status" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "post" ADD CONSTRAINT "post_status_id_post_status_id_fk" FOREIGN KEY ("status_id") REFERENCES "public"."post_status"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_status" DROP COLUMN "deleted_at";