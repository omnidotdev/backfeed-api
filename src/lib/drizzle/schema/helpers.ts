import { sql } from "drizzle-orm";

import type { SQL } from "drizzle-orm";
import type { PgColumn } from "drizzle-orm/pg-core";

/**
 * Helper function to generate a slug from a column value
 * @example
 * Input: Omni LLC
 * Ouput: omni-llc
 */
export const generateSlug = (column: PgColumn): SQL =>
  // NB: f_unaccent is a custom fuction that needs to be manually set in the migrations (prior to generated columns being added to tables). it allows for the extension unaccent (see: https://www.postgresql.org/docs/current/unaccent.html) to be treated as IMMUTABLE to allow for proper indexing on generated slugs
  //
  // CREATE EXTENSION IF NOT EXISTS unaccent;--> statement breakpoint
  // CREATE OR REPLACE FUNCTION f_unaccent(text) RETURNS text
  // AS $$
  //  SELECT public.unaccent('public.unaccent', $1);
  // $$ LANGUAGE sql IMMUTABLE PARALLEL SAFE STRICT;--> statement breakpoint
  //
  // From inner replace to outer:
  // replace(f_unaccent(${column}), ' ', '-') <-- unaccent characters and also replace all spaces with dashes
  // regexp_replace('VALUE', '-{2,}', '-', 'g') <-- replace all instances of multiple dashes with a single dash
  // regexp_replace('VALUE', '[^a-zA-Z0-9 -]+', '', 'g') <-- remove all characters that are neither alphanumeric nor dashes
  // lower('VALUE') <-- transform resulting string to lowercase
  sql`lower(regexp_replace(regexp_replace(replace(f_unaccent(${column}), ' ', '-'), '-{2,}', '-', 'g'), '[^a-zA-Z0-9 -]+', '', 'g'))`;
