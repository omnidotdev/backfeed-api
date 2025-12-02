import { relations } from "drizzle-orm";
import { pgEnum, pgTable, text, uniqueIndex } from "drizzle-orm/pg-core";

import { defaultDate, defaultId } from "./constants";
import { invitations } from "./invitation.table";
import { members } from "./member.table";
import { projects } from "./project.table";

import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

/**
 * Subscription tiers defined for organizations.
 */
export const tier = pgEnum("tier", ["free", "basic", "team", "enterprise"]);

/**
 * Organization table. Organizations are used to group projects together and contain a set of users.
 */
export const organizations = pgTable(
  "organization",
  {
    id: defaultId(),
    name: text().unique().notNull(),
    slug: text()
      // TODO https://linear.app/omnidev/issue/69c6f70e-0821-4a3a-a04a-971547f29690
      // .generatedAlwaysAs((): SQL => generateSlug(organizations.name))
      .unique()
      .notNull(),
    tier: tier().notNull().default("free"),
    subscriptionId: text(),
    createdAt: defaultDate(),
    updatedAt: defaultDate(),
  },
  (table) => [uniqueIndex().on(table.id), uniqueIndex().on(table.slug)],
);

/**
 * Organization relations.
 */
export const organizationRelations = relations(organizations, ({ many }) => ({
  members: many(members),
  projects: many(projects),
  invitations: many(invitations),
}));

/**
 * Type helpers related to the organization table.
 */
export type InsertOrganization = InferInsertModel<typeof organizations>;
export type SelectOrganization = InferSelectModel<typeof organizations>;
