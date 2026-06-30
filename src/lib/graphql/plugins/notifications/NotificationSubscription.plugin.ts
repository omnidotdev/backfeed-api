/**
 * Notification Subscription Plugin
 *
 * Exposes `notificationReceived`, a GraphQL subscription that pushes an event
 * whenever the current user gets a new notification. Backed by Postgres
 * LISTEN/NOTIFY: the subscribe plan listens on a per-user channel
 * (`notification:<userId>`) via the grafast `listen` step + the request's
 * `pgSubscriber`; the notification writer publishes with `pg_notify` on insert
 * (see lib/notifications/center). Served over SSE by graphql-yoga.
 */

import { EXPORTABLE } from "graphile-export";
import { jsonParse } from "postgraphile/@dataplan/json";
import { context, lambda, listen } from "postgraphile/grafast";
import { gql, makeExtendSchemaPlugin } from "postgraphile/utils";

import type { SelectUser } from "lib/db/schema";

const NotificationSubscriptionPlugin = makeExtendSchemaPlugin(() => ({
  typeDefs: gql`
    "A lightweight signal that the current user received a notification."
    type NotificationEvent {
      id: UUID
      type: String
    }

    extend type Subscription {
      "Fires when the current user receives a new notification."
      notificationReceived: NotificationEvent
    }
  `,
  plans: {
    Subscription: {
      notificationReceived: {
        subscribePlan: EXPORTABLE(
          (context, lambda, listen, jsonParse) =>
            function subscribePlan() {
              const $pgSubscriber = context().get("pgSubscriber");
              const $observer = context().get("observer");
              // anonymous subscribers listen on a dead channel, never receive
              const $topic = lambda($observer, (observer: SelectUser | null) =>
                observer
                  ? `notification:${observer.id}`
                  : "notification:__none__",
              );
              return listen($pgSubscriber, $topic, jsonParse);
            },
          [context, lambda, listen, jsonParse],
        ),
        plan: EXPORTABLE(
          () =>
            // biome-ignore lint/suspicious/noExplicitAny: Grafast subscription event step
            function plan($event: any) {
              return $event;
            },
          [],
        ),
      },
    },
  },
}));

export default NotificationSubscriptionPlugin;
