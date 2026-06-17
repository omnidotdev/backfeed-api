ALTER TABLE "reaction" ALTER COLUMN "post_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "reaction" ADD COLUMN "comment_id" uuid;--> statement-breakpoint
ALTER TABLE "reaction" ADD CONSTRAINT "reaction_comment_id_comment_id_fk" FOREIGN KEY ("comment_id") REFERENCES "public"."comment"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "reaction_comment_id_index" ON "reaction" USING btree ("comment_id");--> statement-breakpoint
ALTER TABLE "reaction" ADD CONSTRAINT "reaction_comment_user_emoji_unique" UNIQUE("comment_id","user_id","emoji");--> statement-breakpoint
ALTER TABLE "reaction" ADD CONSTRAINT "reaction_target_check" CHECK (("reaction"."post_id" IS NOT NULL)::int + ("reaction"."comment_id" IS NOT NULL)::int = 1);