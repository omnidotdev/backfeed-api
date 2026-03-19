/**
 * Default Status Templates Plugin
 *
 * Seeds default status templates when the first project is created for an organization.
 * Uses `onConflictDoNothing` targeting the `(organizationId, name)` unique constraint
 * for idempotent inserts — safe against concurrent project creation.
 *
 * Errors are logged but never fail mutations (eventual consistency).
 */

import { EXPORTABLE } from "graphile-export";
import { statusTemplates } from "lib/db/schema";
import { context, sideEffect } from "postgraphile/grafast";
import { wrapPlans } from "postgraphile/utils";

import type { InsertProject, InsertStatusTemplate } from "lib/db/schema";
import type { PlanWrapperFn } from "postgraphile/utils";

const DEFAULT_STATUS_TEMPLATES: Omit<InsertStatusTemplate, "organizationId">[] =
  [
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
  ];

const createDefaultStatusTemplates = (): PlanWrapperFn =>
  EXPORTABLE(
    (
      context,
      sideEffect,
      statusTemplates,
      DEFAULT_STATUS_TEMPLATES,
    ): PlanWrapperFn =>
      (plan, _, fieldArgs) => {
        const $result = plan();
        const $input = fieldArgs.getRaw(["input", "project"]);
        const $db = context().get("db");

        sideEffect([$result, $input, $db], async ([result, input, db]) => {
          if (!result) return;

          const { organizationId } = input as InsertProject;

          if (!organizationId) {
            console.error(
              "[Default Status Templates] Organization ID not found in input",
            );
            return;
          }

          try {
            const values = DEFAULT_STATUS_TEMPLATES.map((template) => ({
              ...template,
              organizationId,
            }));

            await db
              .insert(statusTemplates)
              .values(values)
              .onConflictDoNothing({
                target: [statusTemplates.organizationId, statusTemplates.name],
              });
          } catch (error) {
            console.error(
              "[Default Status Templates] Failed to seed templates:",
              error,
            );
          }
        });

        return $result;
      },
    [context, sideEffect, statusTemplates, DEFAULT_STATUS_TEMPLATES],
  );

const DefaultStatusTemplatesPlugin = wrapPlans({
  Mutation: {
    createProject: createDefaultStatusTemplates(),
  },
});

export default DefaultStatusTemplatesPlugin;
