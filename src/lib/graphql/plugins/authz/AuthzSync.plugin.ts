/**
 * AuthZ Sync Plugin
 *
 * Syncs Backfeed resource mutations to the authorization store (PDP/OpenFGA).
 * Uses sideEffect to run sync logic after mutations complete.
 *
 * Uses Vortex for durable delivery when configured, falls back to direct Warden API.
 *
 * Note: Organization membership is managed by IDP (Gatekeeper), which syncs
 * member tuples directly to the AuthZ store. This plugin only handles
 * Backfeed-specific resources (projects).
 */

import { EXPORTABLE } from "graphile-export";
import {
  AUTHZ_API_URL,
  AUTHZ_ENABLED,
  VORTEX_API_URL,
  VORTEX_AUTHZ_WEBHOOK_SECRET,
  deleteTuples,
  writeTuples,
} from "lib/authz";
import { context, sideEffect } from "postgraphile/grafast";
import { wrapPlans } from "postgraphile/utils";

import type { InsertProject } from "lib/db/schema";
import type { PlanWrapperFn } from "postgraphile/utils";

/**
 * Sync project creation to authz store.
 * Links project directly to organization.
 */
const syncCreateProject = (): PlanWrapperFn =>
  EXPORTABLE(
    (
      _context,
      sideEffect,
      AUTHZ_ENABLED,
      AUTHZ_API_URL,
      VORTEX_API_URL,
      VORTEX_AUTHZ_WEBHOOK_SECRET,
      writeTuples,
    ): PlanWrapperFn =>
      (plan, _, fieldArgs) => {
        const $result = plan();
        const $input = fieldArgs.getRaw(["input", "project"]);

        sideEffect([$result, $input], async ([result, input]) => {
          if (!result) return;

          const { organizationId } = input as InsertProject;
          const projectId = (result as { id?: string })?.id;

          if (!projectId) {
            console.error("[AuthZ Sync] Project ID not found in result");
            return;
          }

          try {
            await writeTuples(
              AUTHZ_API_URL,
              [
                {
                  user: `organization:${organizationId}`,
                  relation: "organization",
                  object: `project:${projectId}`,
                },
              ],
              VORTEX_API_URL,
              VORTEX_AUTHZ_WEBHOOK_SECRET,
              AUTHZ_ENABLED,
            );
          } catch (error) {
            console.error(
              "[AuthZ Sync] Failed to sync project creation:",
              error,
            );
          }
        });

        return $result;
      },
    [
      context,
      sideEffect,
      AUTHZ_ENABLED,
      AUTHZ_API_URL,
      VORTEX_API_URL,
      VORTEX_AUTHZ_WEBHOOK_SECRET,
      writeTuples,
    ],
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
      AUTHZ_API_URL,
      VORTEX_API_URL,
      VORTEX_AUTHZ_WEBHOOK_SECRET,
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

            // Get the organization ID before deletion
            const project = await db.query.projects.findFirst({
              where: (table, { eq }) => eq(table.id, projectId as string),
            });

            if (!project) return;

            try {
              await deleteTuples(
                AUTHZ_API_URL,
                [
                  {
                    user: `organization:${project.organizationId}`,
                    relation: "organization",
                    object: `project:${projectId}`,
                  },
                ],
                VORTEX_API_URL,
                VORTEX_AUTHZ_WEBHOOK_SECRET,
                AUTHZ_ENABLED,
              );
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
    [
      context,
      sideEffect,
      AUTHZ_ENABLED,
      AUTHZ_API_URL,
      VORTEX_API_URL,
      VORTEX_AUTHZ_WEBHOOK_SECRET,
      deleteTuples,
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
    createProject: syncCreateProject(),
    deleteProject: syncDeleteProject(),
  },
});

export default AuthzSyncPlugin;
