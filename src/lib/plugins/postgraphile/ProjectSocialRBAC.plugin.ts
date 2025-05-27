import { and, eq } from "drizzle-orm";
import { EXPORTABLE } from "graphile-export/helpers";
import { context, sideEffect } from "postgraphile/grafast";
import { makeWrapPlansPlugin } from "postgraphile/utils";

import * as dbSchema from "lib/drizzle/schema";

import type { InsertProjectSocial } from "lib/drizzle/schema";
import type { GraphQLContext } from "lib/graphql";
import type { ExecutableStep, FieldArgs } from "postgraphile/grafast";

type MutationScope = "create" | "update" | "delete";

const validatePermissions = (propName: string, scope: MutationScope) =>
  EXPORTABLE(
    (and, eq, dbSchema, context, sideEffect, propName, scope) =>
      // biome-ignore lint/suspicious/noExplicitAny: SmartFieldPlanResolver is not an exported type
      (plan: any, _: ExecutableStep, fieldArgs: FieldArgs) => {
        const $projectSocial = fieldArgs.getRaw(["input", propName]);
        const $currentUser = context<GraphQLContext>().get("currentUser");
        const $db = context<GraphQLContext>().get("db");

        sideEffect(
          [$projectSocial, $currentUser, $db],
          async ([projectSocial, currentUser, db]) => {
            if (!currentUser) {
              throw new Error("Unauthorized");
            }

            let projectId: string;

            const { members, projects, projectSocials } = dbSchema;

            if (scope === "create") {
              projectId = (projectSocial as InsertProjectSocial).projectId;
            } else {
              const [currentProjectSocial] = await db
                .select()
                .from(projectSocials)
                .where(eq(projectSocials.id, projectSocial as string));

              projectId = currentProjectSocial.projectId;
            }

            const [project] = await db
              .select({
                organizationId: projects.organizationId,
              })
              .from(projects)
              .where(eq(projects.id, projectId));

            const [userRole] = await db
              .select({ role: members.role })
              .from(members)
              .where(
                and(
                  eq(members.userId, currentUser.id),
                  eq(members.organizationId, project.organizationId),
                ),
              );

            // Only allow owners and admins to create, update, and delete project socials
            if (!userRole || userRole.role === "member") {
              throw new Error("Insufficient permissions");
            }
          },
        );

        return plan();
      },
    [and, eq, dbSchema, context, sideEffect, propName, scope],
  );

/**
 * Plugin that handles API access for project social table mutations.
 */
const ProjectSocialRBACPlugin = makeWrapPlansPlugin({
  Mutation: {
    createProjectSocial: validatePermissions("projectSocial", "create"),
    updateProjectSocial: validatePermissions("rowId", "update"),
    deleteProjectSocial: validatePermissions("rowId", "delete"),
  },
});

export default ProjectSocialRBACPlugin;
