ALTER TABLE "user" DROP CONSTRAINT "user_walletAddress_unique";--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "hidra_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "username" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "first_name" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "last_name" text;--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "wallet_address";--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_hidraId_unique" UNIQUE("hidra_id");--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_username_unique" UNIQUE("username");