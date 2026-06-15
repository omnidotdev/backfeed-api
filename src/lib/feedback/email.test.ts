import { describe, expect, test } from "bun:test";

import { buildEmailSignalInput, parseInboundKey } from "./email";

const DOMAIN = "inbound.backfeed.omni.dev";

describe("parseInboundKey", () => {
  test("extracts the key from a bare address", () => {
    expect(parseInboundKey(`abc-123@${DOMAIN}`, DOMAIN)).toBe("abc-123");
  });

  test("strips a display name", () => {
    expect(parseInboundKey(`Feedback <abc-123@${DOMAIN}>`, DOMAIN)).toBe(
      "abc-123",
    );
  });

  test("ignores a plus-tag suffix", () => {
    expect(parseInboundKey(`abc-123+spam@${DOMAIN}`, DOMAIN)).toBe("abc-123");
  });

  test("matches the domain case-insensitively", () => {
    expect(parseInboundKey(`abc-123@INBOUND.Backfeed.Omni.dev`, DOMAIN)).toBe(
      "abc-123",
    );
  });

  test("returns null for a different domain", () => {
    expect(parseInboundKey("abc-123@example.com", DOMAIN)).toBeNull();
  });

  test("returns null for garbage input", () => {
    expect(parseInboundKey("not-an-address", DOMAIN)).toBeNull();
    expect(parseInboundKey("", DOMAIN)).toBeNull();
  });
});

describe("buildEmailSignalInput", () => {
  const base = {
    from: "user@example.com",
    subject: "Dark mode please",
    text: "It would be easier on the eyes.",
    messageId: "<msg-42@example.com>",
  };
  const routing = { projectId: "proj-1", organizationId: "org-1" };

  test("maps an email to an email-source signal input", () => {
    const input = buildEmailSignalInput(base, routing);
    expect(input.source).toBe("email");
    expect(input.projectId).toBe("proj-1");
    expect(input.organizationId).toBe("org-1");
  });

  test("combines subject and body into rawContent", () => {
    const input = buildEmailSignalInput(base, routing);
    expect(input.rawContent).toBe(
      "Dark mode please\n\nIt would be easier on the eyes.",
    );
  });

  test("records sender + message id in sourceMetadata, with externalId for idempotency", () => {
    const input = buildEmailSignalInput(base, routing);
    expect(input.sourceMetadata).toMatchObject({
      from: "user@example.com",
      subject: "Dark mode please",
      messageId: "<msg-42@example.com>",
      externalId: "<msg-42@example.com>",
    });
  });

  test("falls back to the subject when the body is empty", () => {
    const input = buildEmailSignalInput({ ...base, text: "" }, routing);
    expect(input.rawContent).toBe("Dark mode please");
  });
});
