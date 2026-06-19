import { describe, expect, test } from "bun:test";

import { buildStatusChangeEmail } from "./notify";

describe("buildStatusChangeEmail", () => {
  test("subject carries the key, status, and title", () => {
    const { subject } = buildStatusChangeEmail({
      key: "API-42",
      title: "Dark mode",
      statusName: "Planned",
      note: null,
    });
    expect(subject).toBe("API-42 is now Planned: Dark mode");
  });

  test("body includes the note when present", () => {
    const { body } = buildStatusChangeEmail({
      key: "API-42",
      title: "Dark mode",
      statusName: "Shipped",
      note: "Out in v2.1",
    });
    expect(body).toContain('"Dark mode" (API-42) moved to Shipped.');
    expect(body).toContain("Out in v2.1");
    expect(body).toContain("reported or upvoted");
  });

  test("body omits the note line when there is none", () => {
    const withNote = buildStatusChangeEmail({
      key: "#7",
      title: "Bug",
      statusName: "Closed",
      note: "details",
    }).body;
    const withoutNote = buildStatusChangeEmail({
      key: "#7",
      title: "Bug",
      statusName: "Closed",
      note: null,
    }).body;

    expect(withoutNote.split("\n").length).toBeLessThan(
      withNote.split("\n").length,
    );
  });
});
