import { relations } from "drizzle-orm";
import {
  index,
  integer,
  jsonb,
  pgTable,
  text,
  unique,
  uniqueIndex,
  uuid,
  vector,
} from "drizzle-orm/pg-core";
import { generateDefaultDate, generateDefaultId } from "lib/db/util";
import { EMBEDDING_DIMENSIONS } from "lib/db/vector";

import { attachments } from "./attachment.table";
import { comments } from "./comment.table";
import { projects } from "./project.table";
import { signals } from "./signal.table";
import { signalClusters } from "./signalCluster.table";
import { statusTemplates } from "./statusTemplate.table";
import { users } from "./user.table";
import { votes } from "./vote.table";

import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import type { AnyPgColumn } from "drizzle-orm/pg-core";

/**
 * Post table. Posts represent feedback posts.
 */
export const posts = pgTable(
  "post",
  {
    id: generateDefaultId(),
    // Persistent post number within project (auto-assigned by trigger, immutable)
    number: integer(),
    title: text(),
    description: text(),
    projectId: uuid()
      .notNull()
      .references(() => projects.id, {
        onDelete: "cascade",
      }),
    userId: uuid()
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),
    statusTemplateId: uuid().references(() => statusTemplates.id, {
      onDelete: "set null",
    }),
    // Origin of the post: "widget" (typed into the app) or an ingested signal source
    source: text().default("widget"),
    // AI triage outputs carried over from the originating signal (null when disabled)
    sentiment: text(),
    aiTags: jsonb(),
    // Semantic embedding of title + description (null until a provider is configured)
    embedding: vector({ dimensions: EMBEDDING_DIMENSIONS }),
    // Canonical post this one duplicates; votes/attention belong on the canonical
    duplicateOfId: uuid().references((): AnyPgColumn => posts.id, {
      onDelete: "set null",
    }),
    // Theme assignment (null until clustering runs, which needs embeddings)
    clusterId: uuid().references(() => signalClusters.id, {
      onDelete: "set null",
    }),
    statusUpdatedAt: generateDefaultDate(),
    createdAt: generateDefaultDate(),
    updatedAt: generateDefaultDate(),
  },
  (table) => [
    uniqueIndex().on(table.id),
    index().on(table.projectId),
    index().on(table.userId),
    index().on(table.statusTemplateId),
    index().on(table.duplicateOfId),
    index().on(table.clusterId),
    unique("post_project_number_unique").on(table.projectId, table.number),
  ],
);

/**
 * Post relations.
 */
export const postRelations = relations(posts, ({ many, one }) => ({
  project: one(projects, {
    fields: [posts.projectId],
    references: [projects.id],
  }),
  user: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
  statusTemplate: one(statusTemplates, {
    fields: [posts.statusTemplateId],
    references: [statusTemplates.id],
  }),
  duplicateOf: one(posts, {
    fields: [posts.duplicateOfId],
    references: [posts.id],
    relationName: "post_duplicate",
  }),
  cluster: one(signalClusters, {
    fields: [posts.clusterId],
    references: [signalClusters.id],
  }),
  comments: many(comments),
  votes: many(votes),
  signals: many(signals),
  attachments: many(attachments),
}));

/**
 * Type helpers related to the post table.
 */
export type InsertPost = InferInsertModel<typeof posts>;
export type SelectPost = InferSelectModel<typeof posts>;
