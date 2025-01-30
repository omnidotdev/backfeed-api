ALTER TABLE "user" ADD COLUMN "customer_id" uuid;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "product_id" uuid;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_customerId_unique" UNIQUE("customer_id");