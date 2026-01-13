/**
 * AuthZ Sync Plugin
 *
 * Syncs Backfeed resource mutations to the authorization store (PDP/OpenFGA).
 * Uses sideEffect to run sync logic after mutations complete.
 *
 * Note: Organization membership is managed by IDP (Gatekeeper), which syncs
 * member tuples directly to the AuthZ store. This plugin only handles
 * Backfeed-specific resources (workspaces, projects).
 */

import { EXPORTABLE } from "graphile-export";
import {
  AUTHZ_ENABLED,
  AUTHZ_PROVIDER_URL,
  deleteTuples,
  writeTuples,
} from "lib/authz";
import { context, sideEffect } from "postgraphile/grafast";
import { wrapPlans } from "postgraphile/utils";

import type { InsertProject } from "lib/db/schema";
import type { PlanWrapperFn } from "postgraphile/utils";

/**
 * Default status templates for new workspaces.
 * Defined as a constant array of plain objects for graphile-export compatibility.
 */
const DEFAULT_STATUS_TEMPLATES = [
  {
    name: "open",
    displayName: "Open",
    color: "#3b82f6",
    description: "New and awaiting review",
    sortOrder: 0,
  },
  {
    name: "under_review",
    displayName: "Under Review",
    color: "#f59e0b",
    description: "Being evaluated by the team",
    sortOrder: 1,
  },
  {
    name: "planned",
    displayName: "Planned",
    color: "#8b5cf6",
    description: "Scheduled for implementation",
    sortOrder: 2,
  },
  {
    name: "in_progress",
    displayName: "In Progress",
    color: "#10b981",
    description: "Currently being worked on",
    sortOrder: 3,
  },
  {
    name: "completed",
    displayName: "Completed",
    color: "#22c55e",
    description: "Done",
    sortOrder: 4,
  },
  {
    name: "closed",
    displayName: "Closed",
    color: "#6b7280",
    description: "Will not be implemented",
    sortOrder: 5,
  },
] as const;

/**
 * Sync project creation to authz store.
 */
const syncCreateProject = (): PlanWrapperFn =>
  EXPORTABLE(
    (
      _context,
      sideEffect,
      AUTHZ_ENABLED,
      AUTHZ_PROVIDER_URL,
      writeTuples,
    ): PlanWrapperFn =>
      (plan, _, fieldArgs) => {
        const $result = plan();
        const $input = fieldArgs.getRaw(["input", "project"]);

        sideEffect([$result, $input], async ([result, input]) => {
          if (!result) return;
          if (AUTHZ_ENABLED !== "true") return;
          if (!AUTHZ_PROVIDER_URL) return;

          const { workspaceId } = input as InsertProject;
          // The result should contain the created project's ID
          const projectId = (result as { id?: string })?.id;

          if (!projectId) {
            console.error("[AuthZ Sync] Project ID not found in result");
            return;
          }

          try {
            await writeTuples(AUTHZ_PROVIDER_URL, [
              {
                user: `workspace:${workspaceId}`,
                relation: "workspace",
                object: `project:${projectId}`,
              },
            ]);
          } catch (error) {
            console.error(
              "[AuthZ Sync] Failed to sync project creation:",
              error,
            );
          }
        });

        return $result;
      },
    [context, sideEffect, AUTHZ_ENABLED, AUTHZ_PROVIDER_URL, writeTuples],
  );

/**
 * Sync project deletion to authz store.
 */
const syncDeleteProject = (): PlanWrapperFn =>
  EXPORTABLE(
    (
      context,
      sideEffect,
      AUTHZ_ENABLED,
      AUTHZ_PROVIDER_URL,
      deleteTuples,
    ): PlanWrapperFn =>
      (plan, _, fieldArgs) => {
        const $result = plan();
        const $projectId = fieldArgs.getRaw(["input", "rowId"]);
        const $db = context().get("db");

        sideEffect(
          [$result, $projectId, $db],
          async ([result, projectId, db]) => {
            if (!result) return;
            if (AUTHZ_ENABLED !== "true") return;
            if (!AUTHZ_PROVIDER_URL) return;

            // Get the workspace ID before deletion
            const project = await db.query.projects.findFirst({
              where: (table, { eq }) => eq(table.id, projectId as string),
            });

            if (!project) return;

            try {
              await deleteTuples(AUTHZ_PROVIDER_URL, [
                {
                  user: `workspace:${project.workspaceId}`,
                  relation: "workspace",
                  object: `project:${projectId}`,
                },
              ]);
            } catch (error) {
              console.error(
                "[AuthZ Sync] Failed to sync project deletion:",
                error,
              );
            }
          },
        );

        return $result;
      },
    [context, sideEffect, AUTHZ_ENABLED, AUTHZ_PROVIDER_URL, deleteTuples],
  );

/**
 * Sync workspace creation - adds organization→workspace tuple
 * and seeds default status templates.
 */
const syncCreateWorkspace = (): PlanWrapperFn =>
  EXPORTABLE(
    (
      context,
      sideEffect,
      AUTHZ_ENABLED,
      AUTHZ_PROVIDER_URL,
      writeTuples,
      DEFAULT_STATUS_TEMPLATES,
    ): PlanWrapperFn =>
      (plan, _, fieldArgs) => {
        const $result = plan();
        const $input = fieldArgs.getRaw(["input", "workspace"]);
        const $withPgClient = context().get("withPgClient");

        sideEffect(
          [$result, $input, $withPgClient],
          async ([result, input, withPgClient]) => {
            if (!result) return;

            const workspaceId = (result as { id?: string })?.id;
            const organizationId = (input as { organizationId?: string })
              ?.organizationId;

            if (!workspaceId) {
              console.error("[AuthZ Sync] Workspace ID not found in result");
              return;
            }

            // Seed default status templates for the new workspace
            try {
              await withPgClient(null, async (client) => {
                const values = DEFAULT_STATUS_TEMPLATES.map(
                  (t, i) =>
                    `(gen_random_uuid(), $${i * 5 + 1}, $${i * 5 + 2}, $${i * 5 + 3}, $${i * 5 + 4}, ${t.sortOrder}, $${DEFAULT_STATUS_TEMPLATES.length * 5 + 1}, now(), now())`,
                ).join(", ");

                const params: string[] = DEFAULT_STATUS_TEMPLATES.flatMap(
                  (t) => [t.name, t.displayName, t.color, t.description],
                );
                params.push(workspaceId);

                await client.query({
                  text: `INSERT INTO status_templates (id, name, display_name, color, description, sort_order, workspace_id, created_at, updated_at)
                   VALUES ${values}`,
                  values: params,
                });
              });
            } catch (error) {
              console.error(
                "[Workspace Init] Failed to seed default status templates:",
                error,
              );
            }

            // Sync to AuthZ store if enabled
            if (AUTHZ_ENABLED === "true" && AUTHZ_PROVIDER_URL) {
              try {
                const tuples = [];

                // Link workspace to organization for permission inheritance
                if (organizationId) {
                  tuples.push({
                    user: `organization:${organizationId}`,
                    relation: "organization",
                    object: `workspace:${workspaceId}`,
                  });
                }

                if (tuples.length > 0) {
                  await writeTuples(AUTHZ_PROVIDER_URL, tuples);
                }
              } catch (error) {
                console.error(
                  "[AuthZ Sync] Failed to sync workspace creation:",
                  error,
                );
              }
            }
          },
        );

        return $result;
      },
    [
      context,
      sideEffect,
      AUTHZ_ENABLED,
      AUTHZ_PROVIDER_URL,
      writeTuples,
      DEFAULT_STATUS_TEMPLATES,
    ],
  );

/**
 * AuthZ Sync Plugin
 *
 * Syncs resource mutations to the authorization store.
 * Errors are logged but don't fail mutations - eventual consistency.
 *
 * Note: Member tuples (user→organization relationships) are synced by IDP,
 * not by this plugin. This plugin only handles resource relationships.
 */
const AuthzSyncPlugin = wrapPlans({
  Mutation: {
    // Workspaces
    createWorkspace: syncCreateWorkspace(),

    // Projects
    createProject: syncCreateProject(),
    deleteProject: syncDeleteProject(),
  },
});

export default AuthzSyncPlugin;
