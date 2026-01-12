ALTER TABLE "user" ADD COLUMN "name" text;--> statement-breakpoint
UPDATE "user" SET "name" = COALESCE(NULLIF(TRIM(COALESCE("first_name", '') || ' ' || COALESCE("last_name", '')), ''), "username", "email");--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "avatar_url" text;--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "first_name";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "last_name";
