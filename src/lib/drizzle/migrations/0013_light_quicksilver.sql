CREATE TYPE "public"."tier" AS ENUM('basic', 'team', 'enterprise');--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "tier" "tier";