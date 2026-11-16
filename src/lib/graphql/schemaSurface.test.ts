import { describe, test } from "bun:test";
import { join } from "node:path";

import {
  assertSchemaSurface,
  loadSchema,
} from "@omnidotdev/providers/graphql-surface";

import type { SchemaSurfacePolicy } from "@omnidotdev/providers/graphql-surface";

/**
 * Reviewed GraphQL surface (shared guard from @omnidotdev/providers).
 *
 * Every root field is listed with what authorizes it. Board content (projects,
 * posts, comments, votes, statuses) is public by design; generated writes are
 * validated by the per-entity authorization plugins; internal tables
 * (warden_sync_queue, notifications) are not in the schema. A new field fails
 * here until it is reviewed
 */
const POLICY: SchemaSurfacePolicy = {
  Query: {
    id: "custom field (AuthzSync.plugin)",
    node: "public feedback board read",
    postTag: "custom field (Tag.plugin)",
    postTagByPostIdAndTagId: "public feedback board read",
    postStatusChange: "public feedback board read",
    reaction: "custom field (Reaction.plugin)",
    reactionByCommentIdAndUserIdAndEmoji: "public feedback board read",
    reactionByPostIdAndUserIdAndEmoji: "public feedback board read",
    tag: "custom field (Tag.plugin)",
    tagByProjectIdAndName: "public feedback board read",
    comment: "custom field (ReferenceExtraction.plugin)",
    user: "custom field (observer.plugin)",
    userByEmail: "public feedback board read",
    userByIdentityProviderId: "public feedback board read",
    userByUsername: "public feedback board read",
    projectStatusConfig: "custom field (ProjectStatusConfig.plugin)",
    projectStatusConfigByProjectIdAndStatusTemplateId:
      "public feedback board read",
    projectLink: "custom field (ProjectLink.plugin)",
    vote: "custom field (Vote.plugin)",
    voteByPostIdAndUserId: "public feedback board read",
    postReference: "public feedback board read",
    postReferenceBySourceTypeAndSourceIdAndTargetPostIdAndKeyword:
      "public feedback board read",
    signalCluster: "public feedback board read",
    attachment: "custom field (AttachmentCleanup.plugin)",
    statusTemplate: "custom field (StatusTemplate.plugin)",
    statusTemplateByOrganizationIdAndName: "public feedback board read",
    signal: "custom field (PgVector.plugin)",
    project: "custom field (AuthzSync.plugin)",
    projectByInboundEmailKey: "public feedback board read",
    projectBySlugAndOrganizationId: "public feedback board read",
    post: "custom field (PgVector.plugin)",
    postByProjectIdAndNumber: "public feedback board read",
    postTags: "custom field (Tag.plugin)",
    postStatusChanges: "public feedback board read",
    reactions: "custom field (Reaction.plugin)",
    tags: "custom field (Tag.plugin)",
    comments: "custom field (ReferenceExtraction.plugin)",
    users: "custom field (authentication.plugin)",
    projectStatusConfigs: "custom field (ProjectStatusConfig.plugin)",
    projectLinks: "custom field (ProjectLink.plugin)",
    votes: "custom field (Vote.plugin)",
    postReferences: "public feedback board read",
    signalClusters: "public feedback board read",
    attachments: "custom field (AttachmentCleanup.plugin)",
    statusTemplates: "custom field (StatusTemplate.plugin)",
    signals: "custom field (PostSignalProvenance.plugin)",
    projects: "custom field (AuthzSync.plugin)",
    posts: "custom field (PostSearch.plugin)",
    observer: "custom field (observer.plugin)",
    similarPosts: "custom field (SignalIngestion.plugin)",
    myNotificationPreference: "custom field (NotificationPreference.plugin)",
    myNotifications: "custom field (NotificationCenter.plugin)",
    unreadNotificationCount: "custom field (NotificationCenter.plugin)",
  },
  Mutation: {
    createPostTag: "Tag authorization plugin (wrapPlans)",
    createReaction: "Reaction authorization plugin (wrapPlans)",
    createTag: "Tag authorization plugin (wrapPlans)",
    createComment: "Comment authorization plugin (wrapPlans)",
    createUser: "User authorization plugin (wrapPlans)",
    createProjectStatusConfig:
      "ProjectStatusConfig authorization plugin (wrapPlans)",
    createProjectLink: "ProjectLink authorization plugin (wrapPlans)",
    createVote: "Vote authorization plugin (wrapPlans)",
    createAttachment: "Attachment authorization plugin (wrapPlans)",
    createStatusTemplate: "StatusTemplate authorization plugin (wrapPlans)",
    createProject: "Project authorization plugin (wrapPlans)",
    createPost: "Post authorization plugin (wrapPlans)",
    updateReaction: "Reaction authorization plugin (wrapPlans)",
    updateTag: "Tag authorization plugin (wrapPlans)",
    updateComment: "Comment authorization plugin (wrapPlans)",
    updateUser: "User authorization plugin (wrapPlans)",
    updateProjectStatusConfig:
      "ProjectStatusConfig authorization plugin (wrapPlans)",
    updateProjectLink: "ProjectLink authorization plugin (wrapPlans)",
    updateVote: "Vote authorization plugin (wrapPlans)",
    updateAttachment: "Attachment authorization plugin (wrapPlans)",
    updateStatusTemplate: "StatusTemplate authorization plugin (wrapPlans)",
    updateProject: "Project authorization plugin (wrapPlans)",
    updatePost: "Post authorization plugin (wrapPlans)",
    deletePostTag: "Tag authorization plugin (wrapPlans)",
    deleteReaction: "Reaction authorization plugin (wrapPlans)",
    deleteTag: "Tag authorization plugin (wrapPlans)",
    deleteComment: "Comment authorization plugin (wrapPlans)",
    deleteUser: "User authorization plugin (wrapPlans)",
    deleteProjectStatusConfig:
      "ProjectStatusConfig authorization plugin (wrapPlans)",
    deleteProjectLink: "ProjectLink authorization plugin (wrapPlans)",
    deleteVote: "Vote authorization plugin (wrapPlans)",
    deleteAttachment: "Attachment authorization plugin (wrapPlans)",
    deleteStatusTemplate: "StatusTemplate authorization plugin (wrapPlans)",
    deleteProject: "Project authorization plugin (wrapPlans)",
    deletePost: "Post authorization plugin (wrapPlans)",
    ingestSignal: "custom field (SmartTag.plugin)",
    promoteSignalToPost: "custom field (SmartTag.plugin)",
    changePostStatus: "custom field (DeletePostStatusChange.plugin)",
    deletePostStatusChange: "custom field (DeletePostStatusChange.plugin)",
    updatePostStatusChange: "custom field (UpdatePostStatusChange.plugin)",
    setNotificationPreference: "custom field (SmartTag.plugin)",
    markNotificationsRead: "custom field (NotificationCenter.plugin)",
    markAllNotificationsRead: "custom field (NotificationCenter.plugin)",
  },
  Subscription: {
    notificationReceived: "custom field (NotificationSubscription.plugin)",
  },
};

const schema = loadSchema(
  join(import.meta.dir, "../../generated/graphql/schema.graphql"),
);

describe("GraphQL schema surface", () => {
  test("matches the reviewed policy", () => {
    assertSchemaSurface(schema, POLICY);
  });
});
