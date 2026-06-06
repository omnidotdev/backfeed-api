import { relations } from "drizzle-orm";
import {
  index,
  integer,
  pgTable,
  text,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { generateDefaultDate, generateDefaultId } from "lib/db/util";

import { posts } from "./post.table";
import { users } from "./user.table";

import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

/**
 * Attachment table. Media (images and videos) attached to feedback posts.
 *
 * Bytes live in object storage (via the shared storage provider); rows here
 * hold the public URL plus metadata. `storageKey` is retained so the object
 * can be removed from the bucket when the attachment is deleted.
 */
export const attachments = pgTable(
  "attachment",
  {
    id: generateDefaultId(),
    postId: uuid()
      .notNull()
      .references(() => posts.id, {
        onDelete: "cascade",
      }),
    userId: uuid()
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),
    // Public URL to the stored object
    url: text().notNull(),
    // Storage key (path within the bucket), used for deletion
    storageKey: text().notNull(),
    // MIME type (e.g. "image/png", "video/mp4")
    mimeType: text().notNull(),
    // File size in bytes
    fileSize: integer(),
    // High-level media kind: "image" or "video" (validated at the app layer)
    kind: text().notNull(),
    // Intrinsic dimensions, when known
    width: integer(),
    height: integer(),
    createdAt: generateDefaultDate(),
  },
  (table) => [
    uniqueIndex().on(table.id),
    index().on(table.postId),
    index().on(table.userId),
  ],
);

/**
 * Attachment relations.
 */
export const attachmentRelations = relations(attachments, ({ one }) => ({
  post: one(posts, {
    fields: [attachments.postId],
    references: [posts.id],
  }),
  user: one(users, {
    fields: [attachments.userId],
    references: [users.id],
  }),
}));

/**
 * Type helpers related to the attachment table.
 */
export type InsertAttachment = InferInsertModel<typeof attachments>;
export type SelectAttachment = InferSelectModel<typeof attachments>;
