import { relations } from "drizzle-orm";
import {
  index,
  pgTable,
  text,
  unique,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { defaultDate, defaultId } from "./constants";
import { posts } from "./post.table";
import { projectSocials } from "./projectSocial.table";
import { projectStatusConfigs } from "./projectStatusConfig.table";
// import { generateSlug } from "./helpers";
import { workspaces } from "./workspace.table";

import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

/**
 * Project table. Projects contain a collection of feedback and are nested under workspaces.
 */
export const projects = pgTable(
  "project",
  {
    id: defaultId(),
    name: text().notNull(),
    image: text(),
    slug: text()
      // TODO https://linear.app/omnidev/issue/69c6f70e-0821-4a3a-a04a-971547f29690
      // .generatedAlwaysAs((): SQL => generateSlug(workspaces.name))
      .notNull(),
    description: text(),
    website: text(),
    workspaceId: uuid()
      .notNull()
      .references(() => workspaces.id, {
        onDelete: "cascade",
      }),
    createdAt: defaultDate(),
    updatedAt: defaultDate(),
  },
  (table) => [
    unique().on(table.slug, table.workspaceId),
    uniqueIndex().on(table.id),
    index().on(table.workspaceId),
  ],
);

/**
 * Project relations.
 */
export const projectRelations = relations(projects, ({ many, one }) => ({
  workspace: one(workspaces, {
    fields: [projects.workspaceId],
    references: [workspaces.id],
  }),
  posts: many(posts),
  socials: many(projectSocials),
  statusConfigs: many(projectStatusConfigs),
}));

/**
 * Type helpers related to the project table.
 */
export type InsertProject = InferInsertModel<typeof projects>;
export type SelectProject = InferSelectModel<typeof projects>;
