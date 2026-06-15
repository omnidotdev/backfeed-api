import { describe, expect, test } from "bun:test";

import { SHIPPED_STATUS_NAMES, isShippedStatus } from "./shipped";

describe("isShippedStatus", () => {
  test("the seeded 'completed' status is shipped", () => {
    expect(isShippedStatus("completed")).toBe(true);
  });

  test("every configured shipped name is recognized", () => {
    for (const name of SHIPPED_STATUS_NAMES) {
      expect(isShippedStatus(name)).toBe(true);
    }
  });

  test("non-shipped statuses are not shipped", () => {
    for (const name of [
      "open",
      "under_review",
      "planned",
      "in_progress",
      "closed",
    ]) {
      expect(isShippedStatus(name)).toBe(false);
    }
  });

  test("matches case-insensitively", () => {
    expect(isShippedStatus("Completed")).toBe(true);
  });

  test("null/undefined are not shipped", () => {
    expect(isShippedStatus(null)).toBe(false);
    expect(isShippedStatus(undefined)).toBe(false);
  });
});
