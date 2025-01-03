ALTER TABLE "comment" RENAME COLUMN "user_hidra_id" TO "user_id";--> statement-breakpoint
ALTER TABLE "downvote" RENAME COLUMN "user_hidra_id" TO "user_id";--> statement-breakpoint
ALTER TABLE "post" RENAME COLUMN "user_hidra_id" TO "user_id";--> statement-breakpoint
ALTER TABLE "upvote" RENAME COLUMN "user_hidra_id" TO "user_id";--> statement-breakpoint
ALTER TABLE "user_organization" RENAME COLUMN "user_hidra_id" TO "user_id";--> statement-breakpoint
ALTER TABLE "downvote" DROP CONSTRAINT "downvote_postId_userHidraId_unique";--> statement-breakpoint
ALTER TABLE "upvote" DROP CONSTRAINT "upvote_postId_userHidraId_unique";--> statement-breakpoint
ALTER TABLE "user_organization" DROP CONSTRAINT "user_organization_userHidraId_organizationId_unique";--> statement-breakpoint
ALTER TABLE "comment" DROP CONSTRAINT "comment_user_hidra_id_user_hidra_id_fk";
--> statement-breakpoint
ALTER TABLE "downvote" DROP CONSTRAINT "downvote_user_hidra_id_user_hidra_id_fk";
--> statement-breakpoint
ALTER TABLE "post" DROP CONSTRAINT "post_user_hidra_id_user_hidra_id_fk";
--> statement-breakpoint
ALTER TABLE "upvote" DROP CONSTRAINT "upvote_user_hidra_id_user_hidra_id_fk";
--> statement-breakpoint
ALTER TABLE "user_organization" DROP CONSTRAINT "user_organization_user_hidra_id_user_hidra_id_fk";
--> statement-breakpoint
ALTER TABLE "comment" ADD CONSTRAINT "comment_user_id_user_hidra_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("hidra_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "downvote" ADD CONSTRAINT "downvote_user_id_user_hidra_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("hidra_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post" ADD CONSTRAINT "post_user_id_user_hidra_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("hidra_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "upvote" ADD CONSTRAINT "upvote_user_id_user_hidra_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("hidra_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_organization" ADD CONSTRAINT "user_organization_user_id_user_hidra_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("hidra_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "downvote" ADD CONSTRAINT "downvote_postId_userId_unique" UNIQUE("post_id","user_id");--> statement-breakpoint
ALTER TABLE "upvote" ADD CONSTRAINT "upvote_postId_userId_unique" UNIQUE("post_id","user_id");--> statement-breakpoint
ALTER TABLE "user_organization" ADD CONSTRAINT "user_organization_userId_organizationId_unique" UNIQUE("user_id","organization_id");