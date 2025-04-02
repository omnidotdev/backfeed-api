DROP INDEX "invitation_hidra_id_index";--> statement-breakpoint
DROP INDEX "invitation_resend_id_index";--> statement-breakpoint
ALTER TABLE "invitation" DROP COLUMN "hidra_id";--> statement-breakpoint
ALTER TABLE "invitation" DROP COLUMN "resend_id";