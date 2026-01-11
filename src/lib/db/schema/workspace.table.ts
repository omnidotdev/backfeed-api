import { relations } from "drizzle-orm";
import { index, pgEnum, pgTable, text, uniqueIndex } from "drizzle-orm/pg-core";
import { generateDefaultDate, generateDefaultId } from "lib/db/util";

import { invitations } from "./invitation.table";
import { members } from "./member.table";
import { projects } from "./project.table";
import { statusTemplates } from "./statusTemplate.table";

import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

/**
 * Subscription tiers defined for workspaces.
 */
export const tier = pgEnum("tier", ["free", "basic", "team", "enterprise"]);

/**
 * Workspace table. Workspaces are used to group projects together and contain a set of users.
 */
export const workspaces = pgTable(
  "workspace",
  {
    id: generateDefaultId(),
    // FK to IDP organization - workspaces belong to orgs
    organizationId: text("organization_id").notNull(),
    name: text().unique().notNull(),
    slug: text()
      // TODO https://linear.app/omnidev/issue/69c6f70e-0821-4a3a-a04a-971547f29690
      // .generatedAlwaysAs((): SQL => generateSlug(workspaces.name))
      .notNull(),
    tier: tier().notNull().default("free"),
    subscriptionId: text(),
    billingAccountId: text(),
    createdAt: generateDefaultDate(),
    updatedAt: generateDefaultDate(),
  },
  (table) => [
    uniqueIndex().on(table.id),
    uniqueIndex("workspace_slug_idx").on(table.slug),
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
