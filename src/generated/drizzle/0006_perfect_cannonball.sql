CREATE UNIQUE INDEX "comment_id_index" ON "comment" USING btree ("id");--> statement-breakpoint
CREATE INDEX "comment_post_id_index" ON "comment" USING btree ("post_id");--> statement-breakpoint
CREATE INDEX "comment_user_id_index" ON "comment" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "downvote_id_index" ON "downvote" USING btree ("id");--> statement-breakpoint
CREATE INDEX "downvote_post_id_index" ON "downvote" USING btree ("post_id");--> statement-breakpoint
CREATE INDEX "downvote_user_id_index" ON "downvote" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "organization_id_index" ON "organization" USING btree ("id");--> statement-breakpoint
CREATE UNIQUE INDEX "organization_slug_index" ON "organization" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "post_id_index" ON "post" USING btree ("id");--> statement-breakpoint
CREATE INDEX "post_project_id_index" ON "post" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "post_user_id_index" ON "post" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "project_id_index" ON "project" USING btree ("id");--> statement-breakpoint
CREATE INDEX "project_organization_id_index" ON "project" USING btree ("organization_id");--> statement-breakpoint
CREATE UNIQUE INDEX "upvote_id_index" ON "upvote" USING btree ("id");--> statement-breakpoint
CREATE INDEX "upvote_post_id_index" ON "upvote" USING btree ("post_id");--> statement-breakpoint
CREATE INDEX "upvote_user_id_index" ON "upvote" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "user_id_index" ON "user" USING btree ("id");--> statement-breakpoint
CREATE UNIQUE INDEX "user_hidra_id_index" ON "user" USING btree ("hidra_id");--> statement-breakpoint
CREATE INDEX "user_organization_user_id_index" ON "user_organization" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_organization_organization_id_index" ON "user_organization" USING btree ("organization_id");