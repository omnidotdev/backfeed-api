import { describe, expect, test } from "bun:test";

import {
  DEFAULT_SIGNAL_SOURCE,
  DEFAULT_SIGNAL_STATUS,
  SIGNAL_SOURCES,
  SIGNAL_STATUSES,
  SIGNAL_TYPES,
  assertSignalPromotable,
  assertValidSignalInput,
  buildIngestedSignal,
  buildPostFromSignal,
  buildPostProvenanceSignal,
  isReviewSource,
  isSignalSource,
  isSignalStatus,
  isSignalType,
} from "./signal";

import type { SignalSource, SignalStatus, SignalType } from "./signal";

describe("signal source validation", () => {
  test("accepts every known source", () => {
    for (const source of SIGNAL_SOURCES) {
      expect(isSignalSource(source)).toBe(true);
    }
  });

  test("rejects unknown sources and non-strings", () => {
    expect(isSignalSource("carrier_pigeon")).toBe(false);
    expect(isSignalSource("")).toBe(false);
    expect(isSignalSource(undefined)).toBe(false);
    expect(isSignalSource(42)).toBe(false);
  });

  test("default source is a valid source", () => {
    expect(isSignalSource(DEFAULT_SIGNAL_SOURCE)).toBe(true);
    expect(DEFAULT_SIGNAL_SOURCE).toBe("widget");
  });

  test("identifies review-platform sources", () => {
    expect(isReviewSource("app_store")).toBe(true);
    expect(isReviewSource("play_store")).toBe(true);
    expect(isReviewSource("email")).toBe(false);
    expect(isReviewSource("widget")).toBe(false);
    expect(isReviewSource(undefined)).toBe(false);
  });

  test("typed literals are assignable to the exported unions", () => {
    const source: SignalSource = "widget";
    const type: SignalType = "feedback";
    const status: SignalStatus = "pending";
    expect(isSignalSource(source)).toBe(true);
    expect(isSignalType(type)).toBe(true);
    expect(isSignalStatus(status)).toBe(true);
  });
});

describe("signal type validation", () => {
  test("accepts every known type", () => {
    for (const type of SIGNAL_TYPES) {
      expect(isSignalType(type)).toBe(true);
    }
  });

  test("rejects unknown types", () => {
    expect(isSignalType("complaint")).toBe(false);
    expect(isSignalType(null)).toBe(false);
  });
});

describe("signal status validation", () => {
  test("accepts every known status", () => {
    for (const status of SIGNAL_STATUSES) {
      expect(isSignalStatus(status)).toBe(true);
    }
  });

  test("rejects unknown statuses", () => {
    expect(isSignalStatus("archived")).toBe(false);
  });

  test("default status is pending and valid", () => {
    expect(DEFAULT_SIGNAL_STATUS).toBe("pending");
    expect(isSignalStatus(DEFAULT_SIGNAL_STATUS)).toBe(true);
  });
});

describe("assertValidSignalInput", () => {
  test("accepts a fully valid input", () => {
    expect(() =>
      assertValidSignalInput({
        source: "widget",
        type: "feedback",
        status: "pending",
      }),
    ).not.toThrow();
  });

  test("accepts minimal input with only a source", () => {
    expect(() => assertValidSignalInput({ source: "email" })).not.toThrow();
  });

  test("throws when source is missing", () => {
    expect(() => assertValidSignalInput({})).toThrow(/source/i);
  });

  test("throws on an invalid source", () => {
    expect(() => assertValidSignalInput({ source: "carrier_pigeon" })).toThrow(
      /source/i,
    );
  });

  test("throws on an invalid type but allows an absent one", () => {
    expect(() =>
      assertValidSignalInput({ source: "web", type: "complaint" }),
    ).toThrow(/type/i);
    expect(() => assertValidSignalInput({ source: "web" })).not.toThrow();
  });

  test("throws on an invalid status but allows an absent one", () => {
    expect(() =>
      assertValidSignalInput({ source: "web", status: "archived" }),
    ).toThrow(/status/i);
    expect(() => assertValidSignalInput({ source: "web" })).not.toThrow();
  });
});

describe("buildPostProvenanceSignal", () => {
  const base = {
    postId: "post-1",
    projectId: "proj-1",
    organizationId: "org-1",
    userId: "user-1",
    title: "Add dark mode",
    description: "It would be easier on the eyes.",
  };

  test("produces a published widget signal linked to the post", () => {
    const signal = buildPostProvenanceSignal(base);
    expect(signal.source).toBe("widget");
    expect(signal.status).toBe("published");
    expect(signal.postId).toBe("post-1");
    expect(signal.projectId).toBe("proj-1");
    expect(signal.organizationId).toBe("org-1");
    expect(signal.userId).toBe("user-1");
  });

  test("triages the content into type and sentiment", () => {
    const feature = buildPostProvenanceSignal(base);
    expect(feature.type).toBe("feedback");
    expect(feature.sentiment).toBe("neutral");

    const bug = buildPostProvenanceSignal({
      ...base,
      title: "App crashes on save",
      description: "It is broken and I hate it",
    });
    expect(bug.type).toBe("bug");
    expect(bug.sentiment).toBe("negative");
  });

  test("combines title and description into rawContent", () => {
    const signal = buildPostProvenanceSignal(base);
    expect(signal.rawContent).toBe(
      "Add dark mode\n\nIt would be easier on the eyes.",
    );
  });

  test("falls back to just the title when description is absent", () => {
    const signal = buildPostProvenanceSignal({ ...base, description: null });
    expect(signal.rawContent).toBe("Add dark mode");
  });

  test("tolerates a missing user", () => {
    const signal = buildPostProvenanceSignal({ ...base, userId: null });
    expect(signal.userId).toBeNull();
  });
});

describe("buildIngestedSignal", () => {
  const base = {
    organizationId: "org-1",
    source: "email" as const,
    rawContent: "App crashes on save\n\nIt is broken and I hate it",
  };

  test("captures an ingested signal as pending", () => {
    const signal = buildIngestedSignal(base);
    expect(signal.status).toBe("pending");
    expect(signal.source).toBe("email");
    expect(signal.organizationId).toBe("org-1");
    expect(signal.rawContent).toBe(base.rawContent);
  });

  test("triages the raw content into type and sentiment", () => {
    const signal = buildIngestedSignal(base);
    expect(signal.type).toBe("bug");
    expect(signal.sentiment).toBe("negative");
  });

  test("types signals from review sources as review (sentiment from content)", () => {
    const signal = buildIngestedSignal({
      ...base,
      source: "app_store",
    });
    // bug wording, but a store review is a review
    expect(signal.type).toBe("review");
    expect(signal.sentiment).toBe("negative");
  });

  test("forces pending even if a caller tries to pass another status", () => {
    const signal = buildIngestedSignal({
      ...base,
      // @ts-expect-error status is not an accepted input field
      status: "published",
    });
    expect(signal.status).toBe("pending");
  });

  test("carries optional project, user, and source metadata", () => {
    const signal = buildIngestedSignal({
      ...base,
      projectId: "proj-1",
      userId: "user-1",
      sourceMetadata: { externalId: "msg-42", rating: 2 },
    });
    expect(signal.projectId).toBe("proj-1");
    expect(signal.userId).toBe("user-1");
    expect(signal.sourceMetadata).toEqual({ externalId: "msg-42", rating: 2 });
  });

  test("defaults optional fields to null", () => {
    const signal = buildIngestedSignal(base);
    expect(signal.projectId).toBeNull();
    expect(signal.userId).toBeNull();
  });

  test("rejects an invalid source", () => {
    expect(() =>
      buildIngestedSignal({ ...base, source: "carrier_pigeon" }),
    ).toThrow(/source/i);
  });
});

describe("assertSignalPromotable", () => {
  const promotable = {
    status: "pending",
    projectId: "proj-1",
    postId: null,
  };

  test("accepts a pending, routed, unlinked signal", () => {
    expect(() => assertSignalPromotable(promotable)).not.toThrow();
  });

  test("throws when the signal is not pending", () => {
    expect(() =>
      assertSignalPromotable({ ...promotable, status: "published" }),
    ).toThrow(/pending/i);
  });

  test("throws when the signal has no project", () => {
    expect(() =>
      assertSignalPromotable({ ...promotable, projectId: null }),
    ).toThrow(/project/i);
  });

  test("throws when the signal is already linked to a post", () => {
    expect(() =>
      assertSignalPromotable({ ...promotable, postId: "post-1" }),
    ).toThrow(/post/i);
  });
});

describe("buildPostFromSignal", () => {
  const signal = {
    rawContent: "App crashes on save\n\nIt happens every time I hit save.",
    projectId: "proj-1",
    source: "email",
    userId: "author-1",
  };

  test("splits raw content into a title and description", () => {
    const post = buildPostFromSignal(signal, { userId: "author-1" });
    expect(post.title).toBe("App crashes on save");
    expect(post.description).toBe("It happens every time I hit save.");
  });

  test("carries the signal source onto the post", () => {
    const post = buildPostFromSignal(signal, { userId: "author-1" });
    expect(post.source).toBe("email");
    expect(post.projectId).toBe("proj-1");
  });

  test("uses the resolved author for the post", () => {
    const post = buildPostFromSignal(
      { ...signal, userId: null },
      { userId: "promoter-1" },
    );
    expect(post.userId).toBe("promoter-1");
  });

  test("uses a title override and keeps full content as the description", () => {
    const post = buildPostFromSignal(signal, {
      userId: "author-1",
      title: "Crash on save",
    });
    expect(post.title).toBe("Crash on save");
    expect(post.description).toBe(signal.rawContent);
  });

  test("handles single-line content with no description", () => {
    const post = buildPostFromSignal(
      { ...signal, rawContent: "Please add dark mode" },
      { userId: "author-1" },
    );
    expect(post.title).toBe("Please add dark mode");
    expect(post.description).toBeNull();
  });
});
