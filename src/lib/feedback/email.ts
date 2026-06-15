/**
 * Inbound email -> signal mapping.
 *
 * Email is the first non-widget source. An inbound mail provider (Herald) posts
 * parsed messages to the email webhook; each project has an opaque inbound key,
 * so a message sent to `<key>@<inbound-domain>` routes to that project. These
 * helpers are the pure parsing/mapping core; the webhook wires them to auth,
 * idempotency, and `ingestSignal`.
 */

/**
 * Extract a project's inbound key from a recipient address of the form
 * `<key>@<domain>`. Tolerates a display name (`Name <key@domain>`) and a
 * plus-tag (`key+tag@domain`). Returns null if the domain does not match or the
 * address is unparseable. The domain is compared case-insensitively.
 */
export const parseInboundKey = (
  recipient: string,
  domain: string,
): string | null => {
  // Pull the address out of an optional `Display Name <addr>` wrapper.
  const angle = recipient.match(/<([^>]+)>/);
  const address = (angle ? angle[1] : recipient).trim();

  const at = address.lastIndexOf("@");
  if (at <= 0) return null;

  const localPart = address.slice(0, at);
  const addrDomain = address.slice(at + 1);

  if (addrDomain.toLowerCase() !== domain.toLowerCase()) return null;

  // Drop a plus-tag suffix; the key is everything before the first '+'.
  const key = localPart.split("+")[0].trim();
  return key.length > 0 ? key : null;
};

/** A parsed inbound email, as delivered by the mail provider webhook. */
export interface InboundEmail {
  from: string;
  subject?: string | null;
  text?: string | null;
  messageId?: string | null;
}

/**
 * Map a parsed inbound email to an `ingestSignal` input for a routed project.
 * The subject and body become the content; the sender and message id are kept in
 * `sourceMetadata`, with `externalId` set to the message id for idempotency.
 */
export const buildEmailSignalInput = (
  email: InboundEmail,
  routing: { projectId: string; organizationId: string },
) => {
  const rawContent = [email.subject, email.text]
    .map((part) => part?.trim())
    .filter(Boolean)
    .join("\n\n");

  return {
    source: "email" as const,
    organizationId: routing.organizationId,
    projectId: routing.projectId,
    rawContent,
    sourceMetadata: {
      from: email.from,
      subject: email.subject ?? null,
      messageId: email.messageId ?? null,
      externalId: email.messageId ?? null,
    },
  };
};
