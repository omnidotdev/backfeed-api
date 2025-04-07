ALTER TABLE "member" ADD COLUMN "user_email" text NOT NULL;--> statement-breakpoint
ALTER TABLE "member" ADD CONSTRAINT "member_user_email_user_email_fk" FOREIGN KEY ("user_email") REFERENCES "public"."user"("email") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invitation" ADD CONSTRAINT "invitation_email_unique" UNIQUE("email");--> statement-breakpoint
ALTER TABLE "member" ADD CONSTRAINT "member_userEmail_unique" UNIQUE("user_email");