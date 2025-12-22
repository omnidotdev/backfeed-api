CREATE TYPE "public"."role" AS ENUM('owner', 'admin', 'member');--> statement-breakpoint
ALTER TABLE "user_organization" ADD COLUMN "role" "role" NOT NULL;