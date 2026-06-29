import { jsonPgSmartTags } from "postgraphile/utils";

/**
 * Smart tag plugin, which controls Postgraphile API surface emission.
 * @see https://postgraphile.org/postgraphile/5/pg-smart-tags
 */
const SmartTagPlugin = jsonPgSmartTags({
  version: 1,
  config: {
    class: {
      post: {
        attribute: {
          // `number` is a per-project sequential identifier assigned by the
          // `assign_post_number` BEFORE INSERT trigger, so it must not be part
          // of the create/update input (the column is NOT NULL with no default,
          // which would otherwise make Postgraphile require it on `createPost`).
          number: {
            tags: { behavior: "-attribute:insert -attribute:update" },
          },
        },
      },
      signal: {
        // Signals are written only through the controlled `ingestSignal` /
        // `promoteSignalToPost` mutations (see SignalIngestion.plugin), which run
        // triage and enforce the no-auto-publish guardrail. The raw auto-CRUD
        // mutations are disabled so those cannot be bypassed; the read/query
        // surface is unaffected.
        tags: { behavior: "-insert -update -delete" },
      },
      post_status_change: {
        // The status timeline is append-only and written server-side by the
        // PostStatusHistory plugin on `updatePost`. Disable the raw auto-CRUD
        // mutations so clients cannot forge or tamper with history; the
        // read/query surface (the timeline) is unaffected.
        tags: { behavior: "-insert -update -delete" },
      },
      notification_preference: {
        // Per-user settings, accessed only through the observer-scoped
        // `myNotificationPreference` query + `setNotificationPreference` mutation
        // (see NotificationPreference.plugin). Hide the raw table entirely so one
        // user can never read or write another's preferences.
        tags: { behavior: "-*" },
      },
      notification: {
        // Per-user notification records, accessed only through the observer-scoped
        // `myNotifications` / `unreadNotificationCount` queries + mark-read
        // mutations (see NotificationCenter.plugin). Hide the raw table entirely
        // so one user can never read or write another's notifications.
        tags: { behavior: "-*" },
      },
      project: {
        attribute: {
          // The inbound email key is server-generated (DB default) and unique;
          // expose it read-only so clients can show the address but cannot set or
          // collide on it. Regeneration is a future dedicated mutation.
          inbound_email_key: {
            tags: { behavior: "-attribute:insert -attribute:update" },
          },
        },
      },
    },
  },
});

export default SmartTagPlugin;
