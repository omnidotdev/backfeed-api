import { afterAll, beforeAll, describe, expect, test } from "bun:test";

import { drizzle } from "drizzle-orm/node-postgres";
import { parse } from "graphql";
import { Pool } from "pg";
import { makeSchema } from "postgraphile";
import { execute, hookArgs } from "postgraphile/grafast";

import * as schema from "../db/schema";
import { posts, projects, statusTemplates, users } from "../db/schema";

import type { GraphQLSchema } from "graphql";
import type { dbPool } from "../db/db";

const DATABASE_URL = process.env.DATABASE_URL;

/**
 * Authorship and internal-table exposure over GraphQL.
 *
 * createVote had no authorization and createComment/createPost trusted the
 * input's `userId`, so any caller could vote, comment or post as any user. The
 * warden_sync_queue CRUD (replayed verbatim into Warden) was reachable without
 * a token. This builds the real preset against the test database and executes
 * as a signed-in user
 */
describe.skipIf(!DATABASE_URL)("GraphQL authorship (db integration)", () => {
  const runId = crypto.randomUUID();
  const organizationId = crypto.randomUUID();

  let pool: Pool;
  let db: typeof dbPool;
  let gqlSchema: GraphQLSchema;
  let resolvedPreset: unknown;
  let caller: typeof users.$inferSelect;
  let victim: typeof users.$inferSelect;
  let postId: string;

  const run = async (query: string, variables: Record<string, unknown>) => {
    const args = {
      schema: gqlSchema,
      document: parse(query),
      variableValues: variables,
      contextValue: { observer: caller, db },
    };
    await hookArgs(args as never, resolvedPreset as never, {} as never);
    return (await execute(args as never)) as {
      data?: Record<string, unknown> | null;
      errors?: unknown[];
    };
  };

  beforeAll(async () => {
    pool = new Pool({ connectionString: DATABASE_URL });
    db = drizzle({ client: pool, schema, casing: "snake_case" });

    const { default: preset } = await import("lib/config/graphile.config");
    const built = await makeSchema(preset);
    gqlSchema = built.schema;
    resolvedPreset = built.resolvedPreset;

    [caller] = await db
      .insert(users)
      .values({
        identityProviderId: crypto.randomUUID(),
        name: "Caller",
        email: `caller-${runId}@example.com`,
      })
      .returning();
    [victim] = await db
      .insert(users)
      .values({
        identityProviderId: crypto.randomUUID(),
        name: "Victim",
        email: `victim-${runId}@example.com`,
      })
      .returning();

    const [project] = await db
      .insert(projects)
      .values({ organizationId, name: "Board", slug: `board-${runId}` })
      .returning();
    const [open] = await db
      .insert(statusTemplates)
      .values({ organizationId, name: "open", displayName: "Open" })
      .returning();
    const [post] = await db
      .insert(posts)
      .values({
        projectId: project.id,
        userId: caller.id,
        title: "Dark mode",
        statusTemplateId: open.id,
      })
      .returning();
    postId = post.id;
  });

  afterAll(async () => {
    await pool.end();
  });

  const CREATE_VOTE = /* GraphQL */ `
    mutation ($input: CreateVoteInput!) {
      createVote(input: $input) { vote { rowId } }
    }
  `;

  test("a vote cast as another user is refused", async () => {
    const result = await run(CREATE_VOTE, {
      input: { vote: { postId, userId: victim.id, voteType: "up" } },
    });

    expect(result.errors).toBeDefined();
    const rows = await db.query.votes.findMany({
      where: (table, { eq }) => eq(table.userId, victim.id),
    });
    expect(rows).toEqual([]);
  });

  test("a vote cast as the caller is allowed", async () => {
    const result = await run(CREATE_VOTE, {
      input: { vote: { postId, userId: caller.id, voteType: "up" } },
    });

    expect(result.errors).toBeUndefined();
    const rows = await db.query.votes.findMany({
      where: (table, { eq }) => eq(table.userId, caller.id),
    });
    expect(rows).toHaveLength(1);
  });

  test("a comment authored as another user is refused", async () => {
    const result = await run(
      /* GraphQL */ `
        mutation ($input: CreateCommentInput!) {
          createComment(input: $input) { comment { rowId } }
        }
      `,
      { input: { comment: { postId, userId: victim.id, message: "hi" } } },
    );

    expect(result.errors).toBeDefined();
    const rows = await db.query.comments.findMany({
      where: (table, { eq }) => eq(table.userId, victim.id),
    });
    expect(rows).toEqual([]);
  });

  test("the warden sync queue and author re-attribution are not in the schema", () => {
    const mutations = Object.keys(
      gqlSchema.getMutationType()?.getFields() ?? {},
    );
    expect(
      mutations.filter((name) => name.includes("WardenSyncQueue")),
    ).toEqual([]);
    expect(mutations).not.toContain("updatePostTag");

    for (const patch of [
      "PostPatch",
      "CommentPatch",
      "VotePatch",
      "ReactionPatch",
    ]) {
      const type = gqlSchema.getType(patch) as
        | { getFields: () => Record<string, unknown> }
        | undefined;
      expect(Object.keys(type?.getFields() ?? {})).not.toContain("userId");
    }
  });
});
