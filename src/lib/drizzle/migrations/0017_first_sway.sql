ALTER TABLE "organization" ADD COLUMN "tier" "tier" DEFAULT 'free' NOT NULL;--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "tier";