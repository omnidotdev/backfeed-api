CREATE TABLE "attachment" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"post_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"url" text NOT NULL,
	"storage_key" text NOT NULL,
	"mime_type" text NOT NULL,
	"file_size" integer,
	"kind" text NOT NULL,
	"width" integer,
	"height" integer,
	"created_at" timestamp(6) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "attachment" ADD CONSTRAINT "attachment_post_id_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."post"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attachment" ADD CONSTRAINT "attachment_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "attachment_id_index" ON "attachment" USING btree ("id");--> statement-breakpoint
CREATE INDEX "attachment_post_id_index" ON "attachment" USING btree ("post_id");--> statement-breakpoint
CREATE INDEX "attachment_user_id_index" ON "attachment" USING btree ("user_id");