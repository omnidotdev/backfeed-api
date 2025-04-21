ALTER TABLE "invitation" DROP CONSTRAINT "invitation_email_unique";--> statement-breakpoint
DROP INDEX "invitation_email_index";--> statement-breakpoint
CREATE UNIQUE INDEX "invitation_organization_id_email_index" ON "invitation" USING btree ("organization_id","email");