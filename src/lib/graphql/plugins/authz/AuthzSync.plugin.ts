/**
 * AuthZ Sync Plugin
 *
 * Syncs Backfeed mutations to the authorization store (PDP/OpenFGA).
 * Uses sideEffect to run sync logic after mutations complete.
 *
 * TODO: Replace with Vortex event-driven sync for durability.
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

import type { Role } from "lib/authz";
import type { InsertMember, InsertProject } from "lib/db/schema";
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
 * Sync member creation to authz store.
 */
const syncCreateMember = (): PlanWrapperFn =>
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
        const $input = fieldArgs.getRaw(["input", "member"]);

        // Run sync after mutation succeeds
        sideEffect([$result, $input], async ([result, input]) => {
          if (!result) return; // Mutation failed
          if (AUTHZ_ENABLED !== "true") return;
          if (!AUTHZ_PROVIDER_URL) return;

          const { userId, workspaceId, role } = input as InsertMember;

          try {
            await writeTuples(AUTHZ_PROVIDER_URL, [
              {
                user: `user:${userId}`,
                relation: role as string,
                object: `workspace:${workspaceId}`,
              },
            ]);
          } catch (error) {
            // Log but don't fail the mutation - sync can be retried
            console.error("[AuthZ Sync] Failed to sync member:", error);
          }
        });

        return $result;
      },
    [context, sideEffect, AUTHZ_ENABLED, AUTHZ_PROVIDER_URL, writeTuples],
  );

/**
 * Sync member update to authz store.
 */
const syncUpdateMember = (): PlanWrapperFn =>
  EXPORTABLE(
    (
      context,
      sideEffect,
      AUTHZ_ENABLED,
      AUTHZ_PROVIDER_URL,
      writeTuples,
      deleteTuples,
    ): PlanWrapperFn =>
      (plan, _, fieldArgs) => {
        const $result = plan();
        const $input = fieldArgs.getRaw(["input", "patch"]);
        const $db = context().get("db");

        sideEffect([$result, $input, $db], async ([result, input, db]) => {
          if (!result) return;
          if (AUTHZ_ENABLED !== "true") return;
          if (!AUTHZ_PROVIDER_URL) return;

          const { userId, workspaceId, role: newRole } = input as InsertMember;

          // Get the previous role to properly update tuples
          const membership = await db.query.members.findFirst({
            where: (table, { and, eq }) =>
              and(eq(table.userId, userId), eq(table.workspaceId, workspaceId)),
          });

          const previousRole = membership?.role as Role | undefined;

          try {
            // Delete previous role tuple if exists
            if (previousRole) {
              await deleteTuples(AUTHZ_PROVIDER_URL, [
                {
                  user: `user:${userId}`,
                  relation: previousRole,
                  object: `workspace:${workspaceId}`,
                },
              ]);
            }

            // Write new role tuple
            if (newRole) {
              await writeTuples(AUTHZ_PROVIDER_URL, [
                {
                  user: `user:${userId}`,
                  relation: newRole as string,
                  object: `workspace:${workspaceId}`,
                },
              ]);
            }
          } catch (error) {
            console.error("[AuthZ Sync] Failed to sync member update:", error);
          }
        });

        return $result;
      },
    [
      context,
      sideEffect,
      AUTHZ_ENABLED,
      AUTHZ_PROVIDER_URL,
      writeTuples,
      deleteTuples,
    ],
  );

/**
 * Sync member deletion to authz store.
 */
const syncDeleteMember = (): PlanWrapperFn =>
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
        const $userId = fieldArgs.getRaw(["input", "userId"]);
        const $workspaceId = fieldArgs.getRaw(["input", "workspaceId"]);
        const $db = context().get("db");

        sideEffect(
          [$result, $userId, $workspaceId, $db],
          async ([result, userId, workspaceId, db]) => {
            if (!result) return;
            if (AUTHZ_ENABLED !== "true") return;
            if (!AUTHZ_PROVIDER_URL) return;

            // Get the role before deletion for proper tuple cleanup
            const membership = await db.query.members.findFirst({
              where: (table, { and, eq }) =>
                and(
                  eq(table.userId, userId as string),
                  eq(table.workspaceId, workspaceId as string),
                ),
            });

            const previousRole = membership?.role as Role | undefined;

            try {
              if (previousRole) {
                await deleteTuples(AUTHZ_PROVIDER_URL, [
                  {
                    user: `user:${userId}`,
                    relation: previousRole,
                    object: `workspace:${workspaceId}`,
                  },
                ]);
              }
            } catch (error) {
              console.error(
                "[AuthZ Sync] Failed to sync member deletion:",
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
 * Sync workspace creation - adds organization→workspace tuple, owner tuple,
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
        const $observer = context().get("observer");
        const $withPgClient = context().get("withPgClient");

        sideEffect(
          [$result, $input, $observer, $withPgClient],
          async ([result, input, observer, withPgClient]) => {
            if (!result || !observer) return;

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
                const tuples = [
                  // The workspace creator becomes the owner
                  {
                    user: `user:${observer.id}`,
                    relation: "owner",
                    object: `workspace:${workspaceId}`,
                  },
                ];

                // Link workspace to organization for permission inheritance
                if (organizationId) {
                  tuples.push({
                    user: `organization:${organizationId}`,
                    relation: "organization",
                    object: `workspace:${workspaceId}`,
                  });
                }

                await writeTuples(AUTHZ_PROVIDER_URL, tuples);
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
 * Syncs mutations to the authorization store.
 * Errors are logged but don't fail mutations - eventual consistency.
 */
const AuthzSyncPlugin = wrapPlans({
  Mutation: {
    // Workspace membership
    createMember: syncCreateMember(),
    updateMember: syncUpdateMember(),
    deleteMember: syncDeleteMember(),

    // Workspaces
    createWorkspace: syncCreateWorkspace(),

    // Projects
    createProject: syncCreateProject(),
    deleteProject: syncDeleteProject(),
  },
});

export default AuthzSyncPlugin;
