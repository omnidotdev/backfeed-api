import { backfeedIndexes, search } from "./client";

import type { SelectPost } from "lib/db/schema/post.table";
import type { SelectProject } from "lib/db/schema/project.table";

/**
 * Document structure for project search index.
 */
interface ProjectDocument {
  id: string;
  organization_id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Document structure for submission (post) search index.
 */
interface SubmissionDocument {
  id: string;
  organization_id: string;
  project_id: string;
  title: string | null;
  content: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Index a project document.
 */
export async function indexProject(project: SelectProject): Promise<void> {
  if (!search) return;

  const document: ProjectDocument = {
    id: project.id,
    organization_id: project.organizationId,
    name: project.name,
    description: project.description,
    created_at: project.createdAt,
    updated_at: project.updatedAt,
  };

  try {
    await search.addDocuments(backfeedIndexes.projects.name, [document]);
  } catch (error) {
    console.error(`[Search] Failed to index project ${project.id}:`, error);
  }
}

/**
 * Remove a project from the search index.
 */
export async function deleteProjectFromIndex(
  projectId: string,
): Promise<void> {
  if (!search) return;

  try {
    await search.deleteDocuments(backfeedIndexes.projects.name, [projectId]);
  } catch (error) {
    console.error(`[Search] Failed to delete project ${projectId}:`, error);
  }
}

/**
 * Index a post (submission) document.
 * Requires the project to resolve organization_id.
 */
export async function indexPost(
  post: SelectPost,
  organizationId: string,
): Promise<void> {
  if (!search) return;

  const document: SubmissionDocument = {
    id: post.id,
    organization_id: organizationId,
    project_id: post.projectId,
    title: post.title,
    content: post.description,
    created_at: post.createdAt,
    updated_at: post.updatedAt,
  };

  try {
    await search.addDocuments(backfeedIndexes.submissions.name, [document]);
  } catch (error) {
    console.error(`[Search] Failed to index post ${post.id}:`, error);
  }
}

/**
 * Remove a post from the search index.
 */
export async function deletePostFromIndex(postId: string): Promise<void> {
  if (!search) return;

  try {
    await search.deleteDocuments(backfeedIndexes.submissions.name, [postId]);
  } catch (error) {
    console.error(`[Search] Failed to delete post ${postId}:`, error);
  }
}
