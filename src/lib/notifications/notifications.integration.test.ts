import { afterAll, beforeAll, describe, expect, test } from "bun:test";

import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "../db/schema";
import {
  posts,
  projects,
  signals,
  statusTemplates,
  users,
  votes,
} from "../db/schema";
import { notifyStatusChange } from "./notify";
import {
  getNotificationPreference,
  setNotificationPreference,
} from "./preference";
import { getStatusChangeRecipients } from "./recipients";

import type { EmailParams, NotificationProvider } from "@omnidotdev/providers";
import type { dbPool } from "../db/db";

const DATABASE_URL = process.env.DATABASE_URL;

/** Collects every email it is asked to send, for assertions. */
const makeFakeNotifications = () => {
  const sent: EmailParams[] = [];
  const provider: NotificationProvider = {
    sendEmail: async (params) => {
      sent.push(params);
      return { success: true, messageId: "test" };
    },
  };
  return { provider, sent };
};

describe.skipIf(!DATABASE_URL)("notifications (db integration)", () => {
  const runId = crypto.randomUUID();
  const organizationId = crypto.randomUUID();

  let pool: Pool;
  let db: typeof dbPool;
  let actorId: string;
  let upvoterId: string;
  let reporterId: string;
  let optedOutId: string;
  let projectId: string;
  let plannedStatusId: string;
  let postId: string;

  const mkUser = (label: string) =>
    db
      .insert(users)
      .values({
        identityProviderId: crypto.randomUUID(),
        name: label,
        email: `${label}-${runId}@example.com`,
      })
      .returning()
      .then((rows) => rows[0].id);

  beforeAll(async () => {
    pool = new Pool({ connectionString: DATABASE_URL });
    db = drizzle({ client: pool, schema, casing: "snake_case" });

    actorId = await mkUser("actor");
    upvoterId = await mkUser("upvoter");
    reporterId = await mkUser("reporter");
    optedOutId = await mkUser("optedout");

    const [project] = await db
      .insert(projects)
      .values({
        organizationId,
        name: "Notify",
        slug: `notify-${runId}`,
        prefix: "NTF",
      })
      .returning();
    projectId = project.id;

    const [planned] = await db
      .insert(statusTemplates)
      .values({ organizationId, name: "planned", displayName: "Planned" })
      .returning();
    plannedStatusId = planned.id;

    const [post] = await db
      .insert(posts)
      .values({
        projectId,
        userId: actorId,
        title: "Dark mode",
        statusTemplateId: plannedStatusId,
      })
      .returning();
    postId = post.id;

    // upvoter + opted-out user upvoted; reporter filed a signal; actor downvoted
    await db.insert(votes).values([
      { postId, userId: upvoterId, voteType: "up" },
      { postId, userId: optedOutId, voteType: "up" },
      { postId, userId: actorId, voteType: "up" },
    ]);
    await db.insert(signals).values({
      organizationId,
      postId,
      userId: reporterId,
      source: "widget",
      rawContent: "Please add dark mode",
    });

    // opted-out user disabled post-update emails
    await setNotificationPreference(db, optedOutId, { postUpdates: false });
  });

  afterAll(async () => {
    await db
      .delete(projects)
      .where(eq(projects.organizationId, organizationId));
    await db
      .delete(statusTemplates)
      .where(eq(statusTemplates.organizationId, organizationId));
    for (const id of [actorId, upvoterId, reporterId, optedOutId]) {
      await db.delete(users).where(eq(users.id, id));
    }
    await pool.end();
  });

  test("recipients are upvoters + reporters, minus the actor and opted-out", async () => {
    const recipients = await getStatusChangeRecipients(db, postId, actorId);
    const ids = recipients.map((r) => r.id).sort();
    expect(ids).toEqual([upvoterId, reporterId].sort());
  });

  test("preference read returns defaults then the saved value", async () => {
    expect(await getNotificationPreference(db, upvoterId)).toEqual({
      postUpdates: true,
    });
    expect(await getNotificationPreference(db, optedOutId)).toEqual({
      postUpdates: false,
    });
  });

  test("notify sends one email per opted-in recipient", async () => {
    const { provider, sent } = makeFakeNotifications();
    const count = await notifyStatusChange(db, provider, postId, actorId);

    expect(count).toBe(2);
    expect(sent).toHaveLength(2);
    expect(sent[0].subject).toContain("NTF-");
    expect(sent[0].subject).toContain("Planned");
    // the opted-out user is never emailed
    expect(
      sent.some((email) => email.to === `optedout-${runId}@example.com`),
    ).toBe(false);
  });
});
