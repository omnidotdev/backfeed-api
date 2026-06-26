import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  unique,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { generateDefaultDate, generateDefaultId } from "lib/db/util";

import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

/**
 * Status template table. Organization-level status definitions shared across projects.
 *
 * Organization identity is owned by Gatekeeper (IDP).
 * The organizationId references the IDP organization directly.
 */
export const statusTemplates = pgTable(
  "status_template",
  {
    id: generateDefaultId(),
    // Direct reference to IDP organization - validated via JWT claims
    organizationId: text("organization_id").notNull(),
    name: text().notNull(),
    displayName: text().notNull(),
    color: text(),
    description: text(),
    sortOrder: integer().default(0),
    // null = fall back to the default roadmap heuristic; true/false = explicit
    // admin choice for whether this status appears on the public roadmap
    showOnRoadmap: boolean(),
    // Marks this template as the target a magic-word keyword (closes/fixes/
    // resolves) transitions a post to. null = not a keyword target; the parser
    // falls back to the seeded `completed`/`closed` names. At most one per org
    // should carry "resolved".
    keywordRole: text(),
    createdAt: generateDefaultDate(),
    updatedAt: generateDefaultDate(),
  },
  (table) => [
    uniqueIndex().on(table.id),
    unique("status_template_org_name_idx").on(table.organizationId, table.name),
    index("status_template_organization_id_idx").on(table.organizationId),
  ],
);

/**
 * Type helpers related to the status template table.
 */
export type InsertStatusTemplate = InferInsertModel<typeof statusTemplates>;
export type SelectStatusTemplate = InferSelectModel<typeof statusTemplates>;
