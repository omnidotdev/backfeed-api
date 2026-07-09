import { describe, expect, test } from "bun:test";

import { expectedTuplesFromProjects, missingTuples } from "./reconciler";

describe("expectedTuplesFromProjects", () => {
  test("builds one org->project tuple per project", () => {
    const projects = [
      { id: "p1", organizationId: "o1" },
      { id: "p2", organizationId: "o1" },
      { id: "p3", organizationId: "o2" },
    ];

    const tuples = expectedTuplesFromProjects(projects);

    expect(tuples).toHaveLength(3);
    expect(tuples).toEqual([
      {
        user: "organization:o1",
        relation: "organization",
        object: "project:p1",
      },
      {
        user: "organization:o1",
        relation: "organization",
        object: "project:p2",
      },
      {
        user: "organization:o2",
        relation: "organization",
        object: "project:p3",
      },
    ]);
  });

  test("returns an empty set for no projects", () => {
    expect(expectedTuplesFromProjects([])).toEqual([]);
  });
});

describe("missingTuples", () => {
  test("returns only expected tuples absent from the actual set", () => {
    const expected = expectedTuplesFromProjects([
      { id: "p1", organizationId: "o1" },
      { id: "p2", organizationId: "o1" },
    ]);

    const actual = [
      {
        user: "organization:o1",
        relation: "organization",
        object: "project:p1",
      },
    ];

    expect(missingTuples(expected, actual)).toEqual([
      {
        user: "organization:o1",
        relation: "organization",
        object: "project:p2",
      },
    ]);
  });

  test("returns nothing when the PDP already has every expected tuple", () => {
    const expected = expectedTuplesFromProjects([
      { id: "p1", organizationId: "o1" },
    ]);

    expect(missingTuples(expected, expected)).toEqual([]);
  });

  test("ignores extra actual tuples not in the expected set", () => {
    const expected = expectedTuplesFromProjects([
      { id: "p1", organizationId: "o1" },
    ]);

    const actual = [
      ...expected,
      {
        user: "organization:o9",
        relation: "organization",
        object: "project:p9",
      },
    ];

    expect(missingTuples(expected, actual)).toEqual([]);
  });
});
