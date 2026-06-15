import { relations } from "drizzle-orm";
import {
  index,
  integer,
  pgTable,
  text,
  uuid,
  vector,
} from "drizzle-orm/pg-core";
import { generateDefaultDate, generateDefaultId } from "lib/db/util";
import { EMBEDDING_DIMENSIONS } from "lib/db/vector";

import { projects } from "./project.table";

import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

/**
 * Signal cluster. A theme that groups semantically related signals/posts within
 * a project. The centroid is the running mean of member embeddings; new members
 * join the nearest cluster within a threshold or seed a new one. Clustering is
 * dormant until an embedding provider is configured (no centroid, no members).
 */
export const signalClusters = pgTable(
  "signal_cluster",
  {
    id: generateDefaultId(),
    projectId: uuid()
      .notNull()
      .references(() => projects.id, {
        onDelete: "cascade",
      }),
    // Short human-readable label (AI-written summaries come later)
    label: text(),
    summary: text(),
    // Running mean of member embeddings
    centroid: vector({ dimensions: EMBEDDING_DIMENSIONS }),
    // Number of members folded into the centroid (for the running-mean update)
    memberCount: integer().notNull().default(0),
    createdAt: generateDefaultDate(),
    updatedAt: generateDefaultDate(),
  },
  (table) => [index().on(table.projectId)],
);

/**
 * Signal cluster relations.
 */
export const signalClusterRelations = relations(signalClusters, ({ one }) => ({
  project: one(projects, {
    fields: [signalClusters.projectId],
    references: [projects.id],
  }),
}));

/**
 * Type helpers related to the signal cluster table.
 */
export type InsertSignalCluster = InferInsertModel<typeof signalClusters>;
export type SelectSignalCluster = InferSelectModel<typeof signalClusters>;
