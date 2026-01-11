-- Migration: Change workspace slug from org-scoped to globally unique
-- This simplifies URL resolution (no session state needed for slug lookup)

-- Drop existing slug constraints/indexes (handle both dev and prod states)
DROP INDEX IF EXISTS "workspace_org_slug_idx";
DROP INDEX IF EXISTS "workspace_slug_index";
ALTER TABLE "workspace" DROP CONSTRAINT IF EXISTS "workspace_slug_unique";

-- Ensure organization_id is NOT NULL (should already be from backfill)
ALTER TABLE "workspace" ALTER COLUMN "organization_id" SET NOT NULL;

-- Create new globally unique slug index
CREATE UNIQUE INDEX "workspace_slug_idx" ON "workspace" USING btree ("slug");
