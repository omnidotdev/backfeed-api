ALTER TABLE "member" DROP CONSTRAINT "member_userEmail_unique";--> statement-breakpoint
ALTER TABLE "member" DROP CONSTRAINT "member_user_email_user_email_fk";
--> statement-breakpoint
ALTER TABLE "member" DROP COLUMN "user_email";