/**
 * Signal Ingestion Plugin
 *
 * Adds the two controlled write paths for signals:
 *
 * - `ingestSignal`: capture external input as a triaged, pending signal. Nothing
 *   ingested auto-publishes to a public board; it lands `pending` and needs an
 *   explicit promotion.
 * - `promoteSignalToPost`: turn a routed pending signal into a public board post
 *   and link the signal to it, then index the post and emit `backfeed.post.created`.
 *
 * Both require admin on the organization: ingestion is an operator action and
 * promotion is moderation. The raw auto-CRUD signal mutations are disabled (see
 * SmartTag.plugin) so triage and the no-auto-publish guardrail cannot be bypassed.
 *
 * The mutation orchestration (authz + side effects) lives here; the database
 * write logic is the unit-tested core in `lib/feedback/promote`.
 */

import { eq } from "drizzle-orm";
import { EXPORTABLE } from "graphile-export";
import { GraphQLError } from "graphql";
import { checkPermission } from "lib/authz";
import { signals } from "lib/db/schema";
import { findSimilarPosts } from "lib/feedback/dedupe";
import { embeddingProvider } from "lib/feedback/embedding";
import {
  ingestSignal as ingestSignalRecord,
  promoteSignalToPost as promoteSignalRecord,
} from "lib/feedback/promote";
import { events } from "lib/providers";
import { indexPost, isSearchEnabled } from "lib/search";
import { context, lambda } from "postgraphile/grafast";
import { gql, makeExtendSchemaPlugin } from "postgraphile/utils";

const SignalIngestionPlugin = makeExtendSchemaPlugin(() => ({
  typeDefs: gql`
    input IngestSignalInput {
      organizationId: UUID!
      source: String!
      rawContent: String!
      projectId: UUID
      sourceMetadata: JSON
    }

    type IngestSignalPayload {
      id: UUID!
      source: String!
      type: String
      status: String!
      sentiment: String
      projectId: UUID
    }

    input PromoteSignalToPostInput {
      signalId: UUID!
      title: String
    }

    type PromoteSignalToPostPayload {
      id: UUID!
      title: String
      description: String
      source: String
      projectId: UUID!
    }

    type SimilarPost {
      id: UUID!
      number: Int
      title: String
      score: Float!
    }

    extend type Mutation {
      ingestSignal(input: IngestSignalInput!): IngestSignalPayload
      promoteSignalToPost(
        input: PromoteSignalToPostInput!
      ): PromoteSignalToPostPayload
    }

    extend type Query {
      """
      Posts similar to a draft, to surface possible duplicates at submit time.
      """
      similarPosts(projectId: UUID!, content: String!): [SimilarPost!]!
    }
  `,
  plans: {
    Query: {
      similarPosts: EXPORTABLE(
        (context, findSimilarPosts, lambda) =>
          // biome-ignore lint/suspicious/noExplicitAny: Grafast plan signature
          function plan(_$root: any, fieldArgs: any) {
            const $projectId = fieldArgs.getRaw("projectId");
            const $content = fieldArgs.getRaw("content");
            const $db = context().get("db");

            return lambda(
              [$projectId, $content, $db],
              // biome-ignore lint/suspicious/noExplicitAny: Grafast lambda values
              async (values: any) => {
                const [projectId, content, db] = values;
                return findSimilarPosts(db, projectId, content);
              },
              false,
            );
          },
        [context, findSimilarPosts, lambda],
      ),
    },
    Mutation: {
      ingestSignal: EXPORTABLE(
        (
          GraphQLError,
          checkPermission,
          context,
          embeddingProvider,
          ingestSignalRecord,
          lambda,
        ) =>
          // biome-ignore lint/suspicious/noExplicitAny: Grafast plan signature
          function plan(_$root: any, fieldArgs: any) {
            const $input = fieldArgs.getRaw("input");
            const $observer = context().get("observer");
            const $db = context().get("db");

            return lambda(
              [$input, $observer, $db],
              // biome-ignore lint/suspicious/noExplicitAny: Grafast lambda values
              async (values: any) => {
                const [input, observer, db] = values;

                if (!observer) throw new GraphQLError("Unauthorized");

                const allowed = await checkPermission(
                  observer.identityProviderId,
                  "organization",
                  input.organizationId,
                  "admin",
                );
                if (!allowed) {
                  throw new GraphQLError("Insufficient permissions");
                }

                // Embed when a provider is configured (null -> lexical fallback)
                const embedding = await embeddingProvider.embed(
                  input.rawContent,
                );
                return ingestSignalRecord(db, { ...input, embedding });
              },
              false,
            );
          },
        [
          GraphQLError,
          checkPermission,
          context,
          embeddingProvider,
          ingestSignalRecord,
          lambda,
        ],
      ),

      promoteSignalToPost: EXPORTABLE(
        (
          GraphQLError,
          checkPermission,
          context,
          eq,
          events,
          indexPost,
          isSearchEnabled,
          lambda,
          promoteSignalRecord,
          signals,
        ) =>
          // biome-ignore lint/suspicious/noExplicitAny: Grafast plan signature
          function plan(_$root: any, fieldArgs: any) {
            const $input = fieldArgs.getRaw("input");
            const $observer = context().get("observer");
            const $db = context().get("db");

            return lambda(
              [$input, $observer, $db],
              // biome-ignore lint/suspicious/noExplicitAny: Grafast lambda values
              async (values: any) => {
                const [input, observer, db] = values;

                if (!observer) throw new GraphQLError("Unauthorized");

                const [signal] = await db
                  .select({ organizationId: signals.organizationId })
                  .from(signals)
                  .where(eq(signals.id, input.signalId));

                if (!signal) throw new GraphQLError("Signal not found");

                const allowed = await checkPermission(
                  observer.identityProviderId,
                  "organization",
                  signal.organizationId,
                  "admin",
                );
                if (!allowed) {
                  throw new GraphQLError("Insufficient permissions");
                }

                const { post, merged } = await promoteSignalRecord(db, {
                  signalId: input.signalId,
                  userId: observer.id,
                  title: input.title,
                });

                // On merge the canonical post already exists (and was indexed +
                // emitted when first created), so only fire side effects for a
                // newly created post. Best-effort, never fatal.
                if (!merged) {
                  if (isSearchEnabled) {
                    try {
                      await indexPost(post, signal.organizationId);
                    } catch (error) {
                      console.error(
                        "[Signal Promote] Failed to index post:",
                        error,
                      );
                    }
                  }
                  try {
                    await events.emit({
                      type: "backfeed.post.created",
                      data: {
                        postId: post.id,
                        projectId: post.projectId,
                        organizationId: signal.organizationId,
                      },
                      organizationId: signal.organizationId,
                      subject: post.id,
                    });
                  } catch (error) {
                    console.error(
                      "[Signal Promote] Failed to emit post.created:",
                      error,
                    );
                  }
                }

                return post;
              },
              false,
            );
          },
        [
          GraphQLError,
          checkPermission,
          context,
          eq,
          events,
          indexPost,
          isSearchEnabled,
          lambda,
          promoteSignalRecord,
          signals,
        ],
      ),
    },
  },
}));

export default SignalIngestionPlugin;
