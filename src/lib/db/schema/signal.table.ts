import { relations } from "drizzle-orm";
import {
  index,
  jsonb,
  pgTable,
  text,
  uniqueIndex,
  uuid,
  vector,
} from "drizzle-orm/pg-core";
import { generateDefaultDate, generateDefaultId } from "lib/db/util";
import { EMBEDDING_DIMENSIONS } from "lib/db/vector";

import { posts } from "./post.table";
import { projects } from "./project.table";
import { signalClusters } from "./signalCluster.table";
import { users } from "./user.table";

import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

/**
 * Signal table. A signal is any inbound piece of user input, regardless of
 * source (in-app widget, email, social, app store, chat, web). A signal that is
 * a feature request or bug becomes (or merges into) a post; the board, votes,
 * and roadmap are unchanged. Source and type are validated at the application
 * boundary rather than via pgEnum.
 */
export const signals = pgTable(
  "signal",
  {
    id: generateDefaultId(),
    // Owning organization (signals are org-scoped even before they are routed to a project)
    organizationId: text("organization_id").notNull(),
    // Nullable until the signal is routed to a project
    projectId: uuid().references(() => projects.id, {
      onDelete: "cascade",
    }),
    // Author, when known (ingested signals may be anonymous)
    userId: uuid().references(() => users.id, {
      onDelete: "set null",
    }),
    // Origin: widget | email | social | app_store | discord | slack | web
    source: text().notNull(),
    // Classification: feedback | bug | review | praise | question (null until triaged)
    type: text(),
    rawContent: text().notNull(),
    // Source-specific context: author handle, URL, rating, externalId, etc.
    sourceMetadata: jsonb(),
    // Lifecycle: pending | published | merged | rejected
    status: text().notNull().default("pending"),
    // Set when the signal is promoted to or merged into a post
    postId: uuid().references(() => posts.id, {
      onDelete: "set null",
    }),
    // AI triage outputs (populated in a later phase; null while triage is disabled)
    sentiment: text(),
    aiTags: jsonb(),
    // Semantic embedding of rawContent (null until an embedding provider is configured)
    embedding: vector({ dimensions: EMBEDDING_DIMENSIONS }),
    // Theme assignment (null until clustering runs, which needs embeddings)
    clusterId: uuid().references(() => signalClusters.id, {
      onDelete: "set null",
    }),
    createdAt: generateDefaultDate(),
    updatedAt: generateDefaultDate(),
  },
  (table) => [
    uniqueIndex().on(table.id),
    index().on(table.organizationId),
    index().on(table.projectId),
    index().on(table.userId),
    index().on(table.postId),
    index().on(table.status),
    index().on(table.source),
    index().on(table.clusterId),
  ],
);

/**
 * Signal relations.
 */
export const signalRelations = relations(signals, ({ one }) => ({
  project: one(projects, {
    fields: [signals.projectId],
    references: [projects.id],
  }),
  user: one(users, {
    fields: [signals.userId],
    references: [users.id],
  }),
  post: one(posts, {
    fields: [signals.postId],
    references: [posts.id],
  }),
  cluster: one(signalClusters, {
    fields: [signals.clusterId],
    references: [signalClusters.id],
  }),
}));

/**
 * Type helpers related to the signal table.
 */
export type InsertSignal = InferInsertModel<typeof signals>;
export type SelectSignal = InferSelectModel<typeof signals>;
