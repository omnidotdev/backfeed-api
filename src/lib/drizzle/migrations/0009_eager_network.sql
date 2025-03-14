CREATE TYPE "public"."status" AS ENUM('open', 'planned', 'in_progress', 'closed', 'resolved');--> statement-breakpoint
ALTER TABLE "post" ADD COLUMN "status" "status" DEFAULT 'open' NOT NULL;--> statement-breakpoint
ALTER TABLE "post" ADD COLUMN "status_updated_at" timestamp(6) with time zone DEFAULT now();