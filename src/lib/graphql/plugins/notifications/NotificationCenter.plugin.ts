/**
 * Notification Center Plugin
 *
 * Exposes the observer-scoped notification center: a list of the current user's
 * recent notifications, their unread count, and mark-read mutations. The
 * `notification` table is hidden from auto-CRUD (see SmartTag.plugin), so these
 * fields are the only way in, and every one filters by the observer's id.
 */

import { EXPORTABLE } from "graphile-export";
import { GraphQLError } from "graphql";
import {
  getNotifications,
  getUnreadNotificationCount,
  markAllNotificationsRead,
  markNotificationsRead,
} from "lib/notifications/center";
import { context, lambda } from "postgraphile/grafast";
import { gql, makeExtendSchemaPlugin } from "postgraphile/utils";

const NotificationCenterPlugin = makeExtendSchemaPlugin(() => ({
  typeDefs: gql`
    "The user who triggered a notification."
    type NotificationActor {
      username: String
      image: String
    }

    "An in-app notification for the current user."
    type Notification {
      id: UUID!
      "One of: mention, reply, reaction, status_change."
      type: String!
      "Reaction emoji (reaction notifications only)."
      emoji: String
      "New status display name (status_change notifications only)."
      statusName: String
      isRead: Boolean!
      createdAt: Datetime!
      actor: NotificationActor
      postId: UUID
      commentId: UUID
      postNumber: Int
      postTitle: String
      projectSlug: String
      organizationId: String
    }

    extend type Query {
      "The current user's most recent notifications, newest first."
      myNotifications(limit: Int): [Notification!]!
      "Count of the current user's unread notifications."
      unreadNotificationCount: Int!
    }

    extend type Mutation {
      "Mark the given notifications (the current user's) read. Returns the number updated."
      markNotificationsRead(ids: [UUID!]!): Int!
      "Mark all the current user's notifications read. Returns the number updated."
      markAllNotificationsRead: Int!
    }
  `,
  plans: {
    Query: {
      myNotifications: EXPORTABLE(
        (GraphQLError, context, getNotifications, lambda) =>
          // biome-ignore lint/suspicious/noExplicitAny: Grafast plan signature
          function plan(_$root: any, fieldArgs: any) {
            const $limit = fieldArgs.getRaw("limit");
            const $observer = context().get("observer");
            const $db = context().get("db");

            return lambda(
              [$limit, $observer, $db],
              // biome-ignore lint/suspicious/noExplicitAny: Grafast lambda values
              async (values: any) => {
                const [limit, observer, db] = values;
                if (!observer) throw new GraphQLError("Unauthorized");
                return getNotifications(db, observer.id, limit ?? undefined);
              },
              false,
            );
          },
        [GraphQLError, context, getNotifications, lambda],
      ),
      unreadNotificationCount: EXPORTABLE(
        (GraphQLError, context, getUnreadNotificationCount, lambda) =>
          function plan() {
            const $observer = context().get("observer");
            const $db = context().get("db");

            return lambda(
              [$observer, $db],
              // biome-ignore lint/suspicious/noExplicitAny: Grafast lambda values
              async (values: any) => {
                const [observer, db] = values;
                if (!observer) throw new GraphQLError("Unauthorized");
                return getUnreadNotificationCount(db, observer.id);
              },
              false,
            );
          },
        [GraphQLError, context, getUnreadNotificationCount, lambda],
      ),
    },
    Mutation: {
      markNotificationsRead: EXPORTABLE(
        (GraphQLError, context, lambda, markNotificationsRead) =>
          // biome-ignore lint/suspicious/noExplicitAny: Grafast plan signature
          function plan(_$root: any, fieldArgs: any) {
            const $ids = fieldArgs.getRaw("ids");
            const $observer = context().get("observer");
            const $db = context().get("db");

            return lambda(
              [$ids, $observer, $db],
              // biome-ignore lint/suspicious/noExplicitAny: Grafast lambda values
              async (values: any) => {
                const [ids, observer, db] = values;
                if (!observer) throw new GraphQLError("Unauthorized");
                return markNotificationsRead(db, observer.id, ids ?? []);
              },
              false,
            );
          },
        [GraphQLError, context, lambda, markNotificationsRead],
      ),
      markAllNotificationsRead: EXPORTABLE(
        (GraphQLError, context, lambda, markAllNotificationsRead) =>
          function plan() {
            const $observer = context().get("observer");
            const $db = context().get("db");

            return lambda(
              [$observer, $db],
              // biome-ignore lint/suspicious/noExplicitAny: Grafast lambda values
              async (values: any) => {
                const [observer, db] = values;
                if (!observer) throw new GraphQLError("Unauthorized");
                return markAllNotificationsRead(db, observer.id);
              },
              false,
            );
          },
        [GraphQLError, context, lambda, markAllNotificationsRead],
      ),
    },
  },
}));

export default NotificationCenterPlugin;
