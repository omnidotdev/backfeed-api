import { relations } from "drizzle-orm";
import {
  index,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { generateDefaultDate, generateDefaultId } from "lib/db/util";

import { invitations } from "./invitation.table";
import { members } from "./member.table";
import { projects } from "./project.table";
import { statusTemplates } from "./statusTemplate.table";

import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

/**
 * Workspace table.
 *
 * Organization identity (name, slug) is owned by Gatekeeper (IDP).
 * Apps resolve org name/slug from JWT claims, not DB.
 * This table stores only app-specific settings.
 *
 * BILLING: Entitlements (tier, limits) are owned by Aether at the
 * organization level. Query Aether with entityType="organization".
 */
export const workspaces = pgTable(
  "workspace",
  {
    id: generateDefaultId(),
    // FK to IDP organization - multiple workspaces per org supported
    // Org name/slug resolved from JWT claims at runtime
    organizationId: text("organization_id").notNull(),
    name: text().notNull(),
    slug: text().notNull(),
    // Cached from Aether, synced via webhook (for display purposes only)
    subscriptionId: text(),
    billingAccountId: text(),
    createdAt: generateDefaultDate(),
    updatedAt: generateDefaultDate(),
    // Soft delete fields - set when IDP organization is deleted
    deletedAt: timestamp("deleted_at"),
    deletionReason: text("deletion_reason"),
  },
  (table) => [
    uniqueIndex().on(table.id),
    // Slug must be unique within an organization
    uniqueIndex("workspace_org_slug_idx").on(table.organizationId, table.slug),
    index("workspace_organization_id_idx").on(table.organizationId),
  ],
);

/**
 * Workspace relations.
 */
export const workspaceRelations = relations(workspaces, ({ many }) => ({
  members: many(members),
  projects: many(projects),
  invitations: many(invitations),
  statusTemplates: many(statusTemplates),
}));

/**
 * Type helpers related to the workspace table.
 */
export type InsertWorkspace = InferInsertModel<typeof workspaces>;
export type SelectWorkspace = InferSelectModel<typeof workspaces>;
