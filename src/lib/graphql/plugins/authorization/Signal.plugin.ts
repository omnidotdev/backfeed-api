import { EXPORTABLE } from "graphile-export/helpers";
import {
  SIGNAL_SOURCES,
  SIGNAL_STATUSES,
  SIGNAL_TYPES,
} from "lib/feedback/signal";
import { sideEffect } from "postgraphile/grafast";
import { wrapPlans } from "postgraphile/utils";

import type { PlanWrapperFn } from "postgraphile/utils";

/**
 * Validate signal input at the mutation boundary.
 *
 * Signal source/type/status are stored as free text (not pgEnum), so the allowed
 * values (sourced from the signal module) are enforced here before a signal is
 * created. The allowed-value lists are passed as EXPORTABLE dependencies so the
 * plan stays serializable by graphile-export (it cannot inline helper functions).
 */
const validateInput = EXPORTABLE(
  (SIGNAL_SOURCES, SIGNAL_STATUSES, SIGNAL_TYPES, sideEffect): PlanWrapperFn =>
    (plan, _, fieldArgs) => {
      const $input = fieldArgs.getRaw(["input", "signal"]);

      sideEffect([$input], async ([input]) => {
        const signal = (input ?? {}) as {
          source?: unknown;
          type?: unknown;
          status?: unknown;
        };

        if (
          typeof signal.source !== "string" ||
          !(SIGNAL_SOURCES as readonly string[]).includes(signal.source)
        ) {
          throw new Error(`Invalid signal source: ${String(signal.source)}`);
        }
        if (
          signal.type != null &&
          (typeof signal.type !== "string" ||
            !(SIGNAL_TYPES as readonly string[]).includes(signal.type))
        ) {
          throw new Error(`Invalid signal type: ${String(signal.type)}`);
        }
        if (
          signal.status != null &&
          (typeof signal.status !== "string" ||
            !(SIGNAL_STATUSES as readonly string[]).includes(signal.status))
        ) {
          throw new Error(`Invalid signal status: ${String(signal.status)}`);
        }
      });

      return plan();
    },
  [SIGNAL_SOURCES, SIGNAL_STATUSES, SIGNAL_TYPES, sideEffect],
);

/**
 * Authorization plugin for signals.
 *
 * - Create: source/type/status validated at the application boundary
 */
const SignalPlugin = wrapPlans({
  Mutation: {
    createSignal: validateInput,
  },
});

export default SignalPlugin;
