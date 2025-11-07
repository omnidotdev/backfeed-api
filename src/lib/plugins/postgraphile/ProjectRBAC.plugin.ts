import { and, eq } from "drizzle-orm";
import { EXPORTABLE } from "graphile-export/helpers";
import * as dbSchema from "lib/drizzle/schema";
import { context, sideEffect } from "postgraphile/grafast";
import { wrapPlans } from "postgraphile/utils";

import type { InsertProject } from "lib/drizzle/schema";
import type { PlanWrapperFn } from "postgraphile/utils";

type MutationScope = "create" | "update" | "delete";

const validatePermissions = (propName: string, scope: MutationScope) =>
  EXPORTABLE(
    (and, eq, dbSchema, context, sideEffect, propName, scope): PlanWrapperFn =>
      (plan, _, fieldArgs) => {
        const $project = fieldArgs.getRaw(["input", propName]);
        const $currentUser = context().get("observer");
        const $db = context().get("db");

        sideEffect(
          [$project, $currentUser, $db],
          async ([project, currentUser, db]) => {
            // Do not allow users that are not subscribed to create, update, or delete projects
            if (!currentUser?.tier) {
              throw new Error("Unauthorized");
            }

            let organizationId: string;

            const { organizations, users, members, projects } = dbSchema;

            if (scope === "create") {
              organizationId = (project as InsertProject).organizationId;
            } else {
              const [currentProject] = await db
                .select()
                .from(projects)
                .where(eq(projects.id, project as string));

              organizationId = currentProject.organizationId;
            }

            const [userRole] = await db
              .select({ role: members.role })
              .from(members)
              .where(
                and(
                  eq(members.userId, currentUser.id),
                  eq(members.organizationId, organizationId),
                ),
              );

            // Only allow owners and admins to create, update, and delete projects
            if (!userRole || userRole.role === "member") {
              throw new Error("Insufficient permissions");
            }

            // If the current user has a basic subscription, validate the current number of projects for the organization
            if (scope === "create") {
              const [organizationOwner] = await db
                .select({
                  tier: users.tier,
                })
                .from(organizations)
                .leftJoin(
                  members,
                  and(
                    eq(members.organizationId, organizationId),
                    eq(members.role, "owner"),
                  ),
                )
                .leftJoin(users, eq(members.userId, users.id));

              const currentProjects = await db
                .select()
                .from(projects)
                .where(eq(projects.organizationId, organizationId));

              // NB: The following checks make sure that we do not allow users to create a new project if the maximum number of allow projects has been met
              if (!organizationOwner.tier)
                throw new Error("Maximum number of projects reached.");

              if (
                organizationOwner.tier === "free" &&
                !!currentProjects.length
              ) {
                throw new Error("Maximum number of projects reached.");
              }

              if (
                organizationOwner.tier === "basic" &&
                currentProjects.length >= 3
              ) {
                throw new Error("Maximum number of projects reached.");
              }
            }
          },
        );

        return plan();
      },
    [and, eq, dbSchema, context, sideEffect, propName, scope],
  );

/**
 * Plugin that handles API access for project table mutations.
 */
const ProjectRBACPlugin = wrapPlans({
  Mutation: {
    createProject: validatePermissions("project", "create"),
    updateProject: validatePermissions("rowId", "update"),
    deleteProject: validatePermissions("rowId", "delete"),
  },
});

export default ProjectRBACPlugin;
