import { EXPORTABLE } from "graphile-export";
import { context, sideEffect } from "postgraphile/grafast";
import { wrapPlans } from "postgraphile/utils";

import {
  deleteProjectFromIndex,
  indexProject,
  isSearchEnabled,
} from "lib/search";

import type { Step } from "postgraphile/grafast";
import type { PlanWrapperFn } from "postgraphile/utils";

/**
 * Index project after successful creation.
 */
const indexOnCreate = (): PlanWrapperFn =>
  EXPORTABLE(
    (context, sideEffect, indexProject, isSearchEnabled): PlanWrapperFn =>
      (plan, $record) => {
        if (!isSearchEnabled) return plan();

        const $db = context().get("db");

        sideEffect([$record, $db], async ([record, db]) => {
          if (!record?.id) return;

          const project = await db.query.projects.findFirst({
            // biome-ignore lint/suspicious/noExplicitAny: drizzle callback types
            where: (table: any, { eq }: any) => eq(table.id, record.id),
          });

          if (project) {
            await indexProject(project);
          }
        });

        return plan();
      },
    [context, sideEffect, indexProject, isSearchEnabled],
  );

/**
 * Re-index project after update.
 */
const indexOnUpdate = (): PlanWrapperFn =>
  EXPORTABLE(
    (context, sideEffect, indexProject, isSearchEnabled): PlanWrapperFn =>
      (plan, $record) => {
        if (!isSearchEnabled) return plan();

        const $db = context().get("db");

        sideEffect([$record, $db], async ([record, db]) => {
          if (!record?.id) return;

          const project = await db.query.projects.findFirst({
            // biome-ignore lint/suspicious/noExplicitAny: drizzle callback types
            where: (table: any, { eq }: any) => eq(table.id, record.id),
          });

          if (project) {
            await indexProject(project);
          }
        });

        return plan();
      },
    [context, sideEffect, indexProject, isSearchEnabled],
  );

/**
 * Remove project from index on delete.
 */
const removeOnDelete = (): PlanWrapperFn =>
  EXPORTABLE(
    (
      _context,
      sideEffect,
      deleteProjectFromIndex,
      isSearchEnabled,
    ): PlanWrapperFn =>
      (plan, _, fieldArgs) => {
        if (!isSearchEnabled) return plan();

        const $input = fieldArgs.getRaw([
          "input",
          "rowId",
        ]) as unknown as Step<string>;

        sideEffect([$input], async ([projectId]) => {
          if (projectId) {
            await deleteProjectFromIndex(projectId);
          }
        });

        return plan();
      },
    [context, sideEffect, deleteProjectFromIndex, isSearchEnabled],
  );

/**
 * Search indexing plugin for projects.
 * Indexes projects in Meilisearch after create/update mutations.
 * Removes projects from index on delete.
 */
const ProjectSearchPlugin = wrapPlans({
  Mutation: {
    createProject: indexOnCreate(),
    updateProject: indexOnUpdate(),
    deleteProject: removeOnDelete(),
  },
});

export default ProjectSearchPlugin;
