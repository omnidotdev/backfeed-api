/**
 * Notification Preference Plugin
 *
 * Exposes the current user's email notification settings: a `myNotificationPreference`
 * query and a `setNotificationPreference` upsert mutation, both scoped to the
 * authenticated observer. The raw notification_preference table is hidden from
 * auto-CRUD (see SmartTag.plugin) so a user can only ever read/write their own.
 *
 * The database logic is the unit-tested core in `lib/notifications/preference`.
 */

import { EXPORTABLE } from "graphile-export";
import { GraphQLError } from "graphql";
import {
  getNotificationPreference,
  setNotificationPreference,
} from "lib/notifications/preference";
import { context, lambda } from "postgraphile/grafast";
import { gql, makeExtendSchemaPlugin } from "postgraphile/utils";

const NotificationPreferencePlugin = makeExtendSchemaPlugin(() => ({
  typeDefs: gql`
    type NotificationPreference {
      "Email me when a post I reported or upvoted changes status."
      postUpdates: Boolean!
    }

    input SetNotificationPreferenceInput {
      postUpdates: Boolean!
    }

    extend type Query {
      "The current user's email notification settings (defaults applied)."
      myNotificationPreference: NotificationPreference
    }

    extend type Mutation {
      "Update the current user's email notification settings."
      setNotificationPreference(
        input: SetNotificationPreferenceInput!
      ): NotificationPreference
    }
  `,
  plans: {
    Query: {
      myNotificationPreference: EXPORTABLE(
        (GraphQLError, context, getNotificationPreference, lambda) =>
          function plan() {
            const $observer = context().get("observer");
            const $db = context().get("db");

            return lambda(
              [$observer, $db],
              // biome-ignore lint/suspicious/noExplicitAny: Grafast lambda values
              async (values: any) => {
                const [observer, db] = values;
                if (!observer) throw new GraphQLError("Unauthorized");
                return getNotificationPreference(db, observer.id);
              },
              false,
            );
          },
        [GraphQLError, context, getNotificationPreference, lambda],
      ),
    },
    Mutation: {
      setNotificationPreference: EXPORTABLE(
        (GraphQLError, context, lambda, setNotificationPreference) =>
          // biome-ignore lint/suspicious/noExplicitAny: Grafast plan signature
          function plan(_$root: any, fieldArgs: any) {
            const $input = fieldArgs.get("input");
            const $observer = context().get("observer");
            const $db = context().get("db");

            return lambda(
              [$input, $observer, $db],
              // biome-ignore lint/suspicious/noExplicitAny: Grafast lambda values
              async (values: any) => {
                const [input, observer, db] = values;
                if (!observer) throw new GraphQLError("Unauthorized");
                return setNotificationPreference(db, observer.id, {
                  postUpdates: input.postUpdates,
                });
              },
              false,
            );
          },
        [GraphQLError, context, lambda, setNotificationPreference],
      ),
    },
  },
}));

export default NotificationPreferencePlugin;
