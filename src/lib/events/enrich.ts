import type { SelectUser } from "lib/db/schema";

/**
 * Build the actor and resource metadata that audit/activity consumers (e.g.
 * Chronicle) need to render "who did what to which thing" records, merged into a
 * Backfeed event's `data` payload.
 *
 * Actor identity is derived from the request observer; system events (no
 * observer) omit the actor fields. `resourceName` is omitted when unavailable so
 * it never serializes as an explicit null.
 */
export const eventMeta = (
  observer: SelectUser | null,
  resourceType: string,
  resourceName?: string | null,
) => ({
  resourceType,
  ...(resourceName != null ? { resourceName } : {}),
  ...(observer
    ? {
        actorId: observer.id,
        actorIdpId: observer.identityProviderId,
        actorName: observer.name,
        actorEmail: observer.email,
      }
    : {}),
});
