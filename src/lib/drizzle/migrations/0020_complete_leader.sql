ALTER TABLE "user" RENAME COLUMN "hidra_id" TO "identity_provider_id";--> statement-breakpoint
ALTER TABLE "user" DROP CONSTRAINT "user_hidraId_unique";--> statement-breakpoint
DROP INDEX "user_hidra_id_index";--> statement-breakpoint
CREATE UNIQUE INDEX "user_identity_provider_id_index" ON "user" USING btree ("identity_provider_id");--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_identityProviderId_unique" UNIQUE("identity_provider_id");