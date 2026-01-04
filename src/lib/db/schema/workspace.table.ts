import { relations } from "drizzle-orm";
import { pgEnum, pgTable, text, uniqueIndex } from "drizzle-orm/pg-core";

import { defaultDate, defaultId } from "./constants";
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
    id: defaultId(),
    name: text().unique().notNull(),
    slug: text()
      // TODO https://linear.app/omnidev/issue/69c6f70e-0821-4a3a-a04a-971547f29690
      // .generatedAlwaysAs((): SQL => generateSlug(workspaces.name))
      .unique()
      .notNull(),
    tier: tier().notNull().default("free"),
    subscriptionId: text(),
    billingAccountId: text(),
    createdAt: defaultDate(),
    updatedAt: defaultDate(),
  },
  (table) => [uniqueIndex().on(table.id), uniqueIndex().on(table.slug)],
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
