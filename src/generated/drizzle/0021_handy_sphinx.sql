-- 1. Create vote_type enum
CREATE TYPE "public"."vote_type" AS ENUM('up', 'down');

--> statement-breakpoint
-- 2. Create status_template table
CREATE TABLE "status_template" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"name" text NOT NULL,
	"display_name" text NOT NULL,
	"color" text,
	"description" text,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp(6) with time zone DEFAULT now(),
	"updated_at" timestamp(6) with time zone DEFAULT now(),
	CONSTRAINT "status_template_organizationId_name_unique" UNIQUE("organization_id","name")
);

--> statement-breakpoint
-- 3. Create project_status_config table
CREATE TABLE "project_status_config" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"status_template_id" uuid NOT NULL,
	"custom_color" text,
	"custom_description" text,
	"is_enabled" boolean DEFAULT true,
	"is_default" boolean DEFAULT false,
	"sort_order" integer,
	"created_at" timestamp(6) with time zone DEFAULT now(),
	CONSTRAINT "project_status_config_projectId_statusTemplateId_unique" UNIQUE("project_id","status_template_id")
);

--> statement-breakpoint
-- 4. Create new vote table
CREATE TABLE "vote" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"post_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"vote_type" "vote_type" NOT NULL,
	"created_at" timestamp(6) with time zone DEFAULT now(),
	"updated_at" timestamp(6) with time zone DEFAULT now()
);

--> statement-breakpoint
-- 5. Migrate post_status to status_template (deduplicate by org + status name)
INSERT INTO "status_template" ("id", "organization_id", "name", "display_name", "color", "description", "created_at", "updated_at")
SELECT DISTINCT ON (p.organization_id, lower(replace(ps.status, ' ', '_')))
  ps.id,
  p.organization_id,
  lower(replace(ps.status, ' ', '_')),
  ps.status,
  ps.color,
  ps.description,
  ps.created_at,
  ps.updated_at
FROM "post_status" ps
JOIN "project" p ON ps.project_id = p.id
ORDER BY p.organization_id, lower(replace(ps.status, ' ', '_')), ps.created_at;

--> statement-breakpoint
-- 6. Create project_status_config entries for each project's statuses
INSERT INTO "project_status_config" ("project_id", "status_template_id", "is_default", "sort_order", "created_at")
SELECT
  ps.project_id,
  st.id,
  ps.is_default,
  ROW_NUMBER() OVER (PARTITION BY ps.project_id ORDER BY ps.created_at)::integer,
  ps.created_at
FROM "post_status" ps
JOIN "project" p ON ps.project_id = p.id
JOIN "status_template" st ON st.organization_id = p.organization_id
  AND st.name = lower(replace(ps.status, ' ', '_'));

--> statement-breakpoint
-- 7. Update post.status_id to point to the new status_template IDs
UPDATE "post" po
SET "status_id" = st.id
FROM "post_status" ps
JOIN "project" p ON ps.project_id = p.id
JOIN "status_template" st ON st.organization_id = p.organization_id
  AND st.name = lower(replace(ps.status, ' ', '_'))
WHERE po.status_id = ps.id;

--> statement-breakpoint
-- 8. Migrate downvotes to unified vote table
INSERT INTO "vote" ("id", "post_id", "user_id", "vote_type", "created_at", "updated_at")
SELECT "id", "post_id", "user_id", 'down'::"vote_type", "created_at", "updated_at"
FROM "downvote";

--> statement-breakpoint
-- 9. Migrate upvotes (skip conflicts where user already has a downvote on same post)
INSERT INTO "vote" ("id", "post_id", "user_id", "vote_type", "created_at", "updated_at")
SELECT "id", "post_id", "user_id", 'up'::"vote_type", "created_at", "updated_at"
FROM "upvote"
ON CONFLICT ("id") DO NOTHING;

--> statement-breakpoint
-- 10. Drop old tables (disable RLS first)
ALTER TABLE "post_status" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "upvote" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "downvote" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "post" DROP CONSTRAINT "post_status_id_post_status_id_fk";--> statement-breakpoint
DROP INDEX "post_status_id_index";--> statement-breakpoint
ALTER TABLE "post" RENAME COLUMN "status_id" TO "status_template_id";--> statement-breakpoint
DROP TABLE "post_status" CASCADE;--> statement-breakpoint
DROP TABLE "upvote" CASCADE;--> statement-breakpoint
DROP TABLE "downvote" CASCADE;

--> statement-breakpoint
-- 11. Add foreign key constraints
ALTER TABLE "project_status_config" ADD CONSTRAINT "project_status_config_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_status_config" ADD CONSTRAINT "project_status_config_status_template_id_status_template_id_fk" FOREIGN KEY ("status_template_id") REFERENCES "public"."status_template"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "status_template" ADD CONSTRAINT "status_template_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vote" ADD CONSTRAINT "vote_post_id_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."post"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vote" ADD CONSTRAINT "vote_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post" ADD CONSTRAINT "post_status_template_id_status_template_id_fk" FOREIGN KEY ("status_template_id") REFERENCES "public"."status_template"("id") ON DELETE set null ON UPDATE no action;

--> statement-breakpoint
-- 12. Create indexes
CREATE UNIQUE INDEX "project_status_config_id_index" ON "project_status_config" USING btree ("id");--> statement-breakpoint
CREATE INDEX "project_status_config_project_id_index" ON "project_status_config" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "project_status_config_status_template_id_index" ON "project_status_config" USING btree ("status_template_id");--> statement-breakpoint
CREATE UNIQUE INDEX "status_template_id_index" ON "status_template" USING btree ("id");--> statement-breakpoint
CREATE INDEX "status_template_organization_id_index" ON "status_template" USING btree ("organization_id");--> statement-breakpoint
CREATE UNIQUE INDEX "vote_id_index" ON "vote" USING btree ("id");--> statement-breakpoint
CREATE INDEX "vote_post_id_index" ON "vote" USING btree ("post_id");--> statement-breakpoint
CREATE INDEX "vote_user_id_index" ON "vote" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "vote_vote_type_index" ON "vote" USING btree ("vote_type");--> statement-breakpoint
CREATE INDEX "post_status_template_id_index" ON "post" USING btree ("status_template_id");--> statement-breakpoint
ALTER TABLE "vote" ADD CONSTRAINT "vote_postId_userId_unique" UNIQUE("post_id","user_id");
