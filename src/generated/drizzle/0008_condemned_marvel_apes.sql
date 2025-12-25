ALTER TABLE "user_organization" RENAME TO "member";--> statement-breakpoint
ALTER TABLE "member" DROP CONSTRAINT "user_organization_userId_organizationId_unique";--> statement-breakpoint
ALTER TABLE "member" DROP CONSTRAINT "user_organization_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "member" DROP CONSTRAINT "user_organization_organization_id_organization_id_fk";
--> statement-breakpoint
DROP INDEX "user_organization_id_index";--> statement-breakpoint
DROP INDEX "user_organization_user_id_index";--> statement-breakpoint
DROP INDEX "user_organization_organization_id_index";--> statement-breakpoint
ALTER TABLE "member" ADD CONSTRAINT "member_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member" ADD CONSTRAINT "member_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "member_id_index" ON "member" USING btree ("id");--> statement-breakpoint
CREATE INDEX "member_user_id_index" ON "member" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "member_organization_id_index" ON "member" USING btree ("organization_id");--> statement-breakpoint
ALTER TABLE "member" ADD CONSTRAINT "member_userId_organizationId_unique" UNIQUE("user_id","organization_id");