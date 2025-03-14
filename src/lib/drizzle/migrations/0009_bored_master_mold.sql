CREATE TYPE "public"."status" AS ENUM('new', 'closed', 'planned', 'in_progress', 'completed');--> statement-breakpoint
ALTER TABLE "post" ADD COLUMN "status" "status" DEFAULT 'new' NOT NULL;--> statement-breakpoint
ALTER TABLE "post" ADD COLUMN "status_updated_at" timestamp(6) with time zone DEFAULT now();