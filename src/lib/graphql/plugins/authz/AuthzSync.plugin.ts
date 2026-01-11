/**
 * AuthZ Sync Plugin
 *
 * Syncs Backfeed mutations to the authorization store (Warden/OpenFGA).
 * Uses sideEffect to run sync logic after mutations complete.
 *
 * This is a Pattern A implementation - sync happens alongside mutations.
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
 * Sync workspace creation - adds owner tuple.
 */
const syncCreateWorkspace = (): PlanWrapperFn =>
  EXPORTABLE(
    (
      context,
      sideEffect,
      AUTHZ_ENABLED,
      AUTHZ_PROVIDER_URL,
      writeTuples,
    ): PlanWrapperFn =>
      (plan, _, _fieldArgs) => {
        const $result = plan();
        const $observer = context().get("observer");

        sideEffect([$result, $observer], async ([result, observer]) => {
          if (!result || !observer) return;
          if (AUTHZ_ENABLED !== "true") return;
          if (!AUTHZ_PROVIDER_URL) return;

          const workspaceId = (result as { id?: string })?.id;

          if (!workspaceId) {
            console.error("[AuthZ Sync] Workspace ID not found in result");
            return;
          }

          try {
            // The workspace creator becomes the owner
            await writeTuples(AUTHZ_PROVIDER_URL, [
              {
                user: `user:${observer.id}`,
                relation: "owner",
                object: `workspace:${workspaceId}`,
              },
            ]);
          } catch (error) {
            console.error(
              "[AuthZ Sync] Failed to sync workspace creation:",
              error,
            );
          }
        });

        return $result;
      },
    [context, sideEffect, AUTHZ_ENABLED, AUTHZ_PROVIDER_URL, writeTuples],
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
