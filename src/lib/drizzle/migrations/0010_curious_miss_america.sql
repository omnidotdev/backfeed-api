CREATE TABLE "invitation" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"hidra_id" uuid,
	"organization_id" uuid NOT NULL,
	"email" text NOT NULL,
	"resend_id" text,
	"created_at" timestamp(6) with time zone DEFAULT now(),
	"updated_at" timestamp(6) with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "invitation" ADD CONSTRAINT "invitation_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "invitation_id_index" ON "invitation" USING btree ("id");--> statement-breakpoint
CREATE UNIQUE INDEX "invitation_resend_id_index" ON "invitation" USING btree ("resend_id");