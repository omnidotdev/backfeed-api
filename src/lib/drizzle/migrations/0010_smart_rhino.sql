CREATE EXTENSION IF NOT EXISTS unaccent;--> statement breakpoint
CREATE OR REPLACE FUNCTION f_unaccent(text) RETURNS text
AS $$
  SELECT public.unaccent('public.unaccent', $1);
$$ LANGUAGE sql IMMUTABLE PARALLEL SAFE STRICT;--> statement breakpoint
ALTER TABLE "project" DROP CONSTRAINT "project_name_unique";--> statement-breakpoint
ALTER TABLE "organization" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "organization" drop column "slug";--> statement-breakpoint
ALTER TABLE "organization" ADD COLUMN "slug" text GENERATED ALWAYS AS (lower(regexp_replace(regexp_replace(replace(f_unaccent("organization"."name"), ' ', '-'), '-{2,}', '-', 'g'), '[^a-zA-Z0-9 -]+', '', 'g'))) STORED NOT NULL;--> statement-breakpoint
ALTER TABLE "project" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "project" drop column "slug";--> statement-breakpoint
ALTER TABLE "project" ADD COLUMN "slug" text GENERATED ALWAYS AS (lower(regexp_replace(regexp_replace(replace(f_unaccent("project"."name"), ' ', '-'), '-{2,}', '-', 'g'), '[^a-zA-Z0-9 -]+', '', 'g'))) STORED NOT NULL;
