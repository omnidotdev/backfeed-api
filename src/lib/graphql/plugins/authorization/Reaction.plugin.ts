import { EXPORTABLE } from "graphile-export/helpers";
import { context, sideEffect } from "postgraphile/grafast";
import { wrapPlans } from "postgraphile/utils";

import type { InsertReaction } from "lib/db/schema";
import type { PlanWrapperFn } from "postgraphile/utils";

/** A reaction may only be created as the authenticated user. */
const validateCreate = (): PlanWrapperFn =>
  EXPORTABLE(
    (context, sideEffect): PlanWrapperFn =>
      (plan, _, fieldArgs) => {
        const $input = fieldArgs.getRaw(["input", "reaction"]);
        const $observer = context().get("observer");

        sideEffect([$input, $observer], async ([input, observer]) => {
          if (!observer) throw new Error("Unauthorized");
          if (observer.id !== (input as InsertReaction).userId) {
            throw new Error("Unauthorized");
          }
        });

        return plan();
      },
    [context, sideEffect],
  );

/** Only the reaction's author may update or delete it. */
const validateOwner = (propName: string): PlanWrapperFn =>
  EXPORTABLE(
    (context, sideEffect, propName): PlanWrapperFn =>
      (plan, _, fieldArgs) => {
        const $input = fieldArgs.getRaw(["input", propName]);
        const $observer = context().get("observer");
        const $db = context().get("db");

        sideEffect([$input, $observer, $db], async ([input, observer, db]) => {
          if (!observer) throw new Error("Unauthorized");

          const reaction = await db.query.reactions.findFirst({
            where: (table, { eq }) => eq(table.id, input),
          });

          if (observer.id !== reaction?.userId) {
            throw new Error("Unauthorized");
          }
        });

        return plan();
      },
    [context, sideEffect, propName],
  );

/**
 * Authorization plugin for reactions.
 *
 * - Create: as the authenticated user only
 * - Update/Delete: author only
 */
const ReactionPlugin = wrapPlans({
  Mutation: {
    createReaction: validateCreate(),
    updateReaction: validateOwner("rowId"),
    deleteReaction: validateOwner("rowId"),
  },
});

export default ReactionPlugin;
