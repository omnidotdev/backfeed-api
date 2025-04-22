ALTER TABLE "invitation" DROP CONSTRAINT "invitation_email_unique";--> statement-breakpoint
DROP INDEX "invitation_email_index";--> statement-breakpoint
ALTER TABLE "invitation" ADD CONSTRAINT "invitation_organizationId_email_unique" UNIQUE("organization_id","email");