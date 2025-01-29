import { and, eq } from "drizzle-orm";
import { EXPORTABLE } from "graphile-export/helpers";
import { context, sideEffect } from "postgraphile/grafast";
import { makeWrapPlansPlugin } from "postgraphile/utils";

import * as dbSchema from "lib/drizzle/schema";

import type { InsertProject } from "lib/drizzle/schema";
import type { GraphQLContext } from "lib/graphql";
import type { ExecutableStep, FieldArgs } from "postgraphile/grafast";

const validatePermissions = (propName: string) =>
  EXPORTABLE(
    (and, eq, dbSchema, context, sideEffect, propName: string) =>
      // biome-ignore lint/suspicious/noExplicitAny: SmartFieldPlanResolver is not an exported type
      (plan: any, _: ExecutableStep, fieldArgs: FieldArgs) => {
        const $project = fieldArgs.getRaw(["input", propName]);
        const $currentUser = context<GraphQLContext>().get("currentUser");
        const $db = context<GraphQLContext>().get("db");

        sideEffect(
          [$project, $currentUser, $db],
          async ([project, currentUser, db]) => {
            const organizationId = (project as InsertProject).organizationId;

            if (!currentUser) {
              throw new Error("Unauthorized");
            }

            const [userRole] = await db
              .select({ role: dbSchema.usersToOrganizations.role })
              .from(dbSchema.usersToOrganizations)
              .where(
                and(
                  eq(dbSchema.usersToOrganizations.userId, currentUser.id),
                  eq(
                    dbSchema.usersToOrganizations.organizationId,
                    organizationId
                  )
                )
              );

            if (!userRole || userRole.role === "member") {
              throw new Error("Unauthorized");
            }
          }
        );

        return plan();
      },
    [and, eq, dbSchema, context, sideEffect, propName]
  );

const ProjectRBACPlugin = makeWrapPlansPlugin({
  Mutation: {
    createProject: validatePermissions("project"),
    updateProject: validatePermissions("patch"),
    // deleteProject: validatePermissions("rowId"),
  },
});

export default ProjectRBACPlugin;
