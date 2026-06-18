import { describe, expect, test } from "bun:test";

import { heuristicTriage } from "./triage";

describe("heuristicTriage type classification", () => {
  test("classifies crashes and errors as bugs", () => {
    expect(heuristicTriage("The app crashes when I click save").type).toBe(
      "bug",
    );
    expect(heuristicTriage("Export is broken and throws an error").type).toBe(
      "bug",
    );
  });

  test("classifies appreciation as praise", () => {
    expect(heuristicTriage("I love the new dashboard, great work!").type).toBe(
      "praise",
    );
  });

  test("classifies interrogatives as questions", () => {
    expect(heuristicTriage("How do I export my data?").type).toBe("question");
  });

  test("defaults to feedback when nothing else matches", () => {
    expect(heuristicTriage("Please add a dark mode toggle").type).toBe(
      "feedback",
    );
  });

  test("prioritises bug over other signals", () => {
    expect(heuristicTriage("Why does it crash every time?").type).toBe("bug");
  });

  test("types review-platform content as review regardless of wording", () => {
    expect(
      heuristicTriage("The app crashes on launch", { isReview: true }).type,
    ).toBe("review");
    expect(
      heuristicTriage("Love this app, five stars!", { isReview: true }).type,
    ).toBe("review");
    expect(heuristicTriage("How do I log in?", { isReview: true }).type).toBe(
      "review",
    );
  });

  test("still classifies review sentiment from the words", () => {
    expect(
      heuristicTriage("The app crashes on launch", { isReview: true })
        .sentiment,
    ).toBe("negative");
    expect(
      heuristicTriage("Love this app, five stars!", { isReview: true })
        .sentiment,
    ).toBe("positive");
  });
});

describe("heuristicTriage sentiment", () => {
  test("detects negative sentiment", () => {
    expect(heuristicTriage("This is broken and I hate it").sentiment).toBe(
      "negative",
    );
  });

  test("detects positive sentiment", () => {
    expect(heuristicTriage("Love it, this is awesome").sentiment).toBe(
      "positive",
    );
  });

  test("falls back to neutral", () => {
    expect(heuristicTriage("Please add dark mode").sentiment).toBe("neutral");
  });

  test("tolerates empty content", () => {
    const result = heuristicTriage("");
    expect(result.type).toBe("feedback");
    expect(result.sentiment).toBe("neutral");
  });
});
