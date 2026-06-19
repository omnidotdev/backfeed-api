CREATE TABLE "reaction" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"post_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"emoji" text NOT NULL,
	"created_at" timestamp(6) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "reaction_post_user_emoji_unique" UNIQUE("post_id","user_id","emoji")
);
--> statement-breakpoint
ALTER TABLE "reaction" ADD CONSTRAINT "reaction_post_id_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."post"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reaction" ADD CONSTRAINT "reaction_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "reaction_id_index" ON "reaction" USING btree ("id");--> statement-breakpoint
CREATE INDEX "reaction_post_id_index" ON "reaction" USING btree ("post_id");--> statement-breakpoint
CREATE INDEX "reaction_user_id_index" ON "reaction" USING btree ("user_id");