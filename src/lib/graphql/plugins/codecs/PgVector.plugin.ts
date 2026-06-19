/**
 * pgvector codec plugin.
 *
 * The feedback brain stores embeddings in `vector` columns (post.embedding,
 * signal.embedding, signal_cluster.centroid) provided by the pgvector
 * extension. PostGraphile has no built-in codec for `vector`, so introspection
 * would otherwise dump the raw pg_type and warn "Could not build PgCodec for
 * 'public.vector'; maybe you need a plugin implementing
 * gather.hooks.pgCodecs_findPgCodec to add support." before silently dropping
 * the columns.
 *
 * This plugin registers a codec for `vector` (and its array form `_vector`) so
 * the type resolves cleanly. The codec is treated as text on the wire: pgvector
 * accepts/returns `[1,2,3]` string literals, which is all the runtime needs for
 * the columns to round-trip through the registry.
 *
 * We deliberately do NOT expose embeddings through GraphQL. They are internal AI
 * artifacts (1536-float arrays) with no API consumer, are large enough to bloat
 * list responses, and grouping/filtering on them is meaningless. The
 * `schema.entityBehavior` below disables every attribute behavior for
 * vector-typed columns, so they are intentionally excluded from fields,
 * conditions, filters, ordering, and the aggregate/groupBy machinery rather than
 * triggering "Couldn't find a 'output' variant" warnings. This keeps the
 * generated schema identical to its pre-codec shape, minus the warning noise.
 *
 * To expose them later, drop the behavior override below; the codec is already
 * mapped to the String scalar, so the columns would surface as text. For a
 * dedicated scalar instead, register one and call `setGraphQLTypeForPgCodec`,
 * mirroring the upstream PgLtreePlugin.
 *
 * Modeled on graphile-build-pg's PgLtreePlugin.
 * @see https://postgraphile.org/postgraphile/next/extending-raw
 */

import { gatherConfig } from "postgraphile/graphile-build";

/**
 * Negative behaviors applied to every vector-typed attribute so it is excluded
 * from the schema entirely - core field/condition/order behaviors plus the
 * @graphile/pg-aggregates participation (aggregate, groupBy, havingBy, and the
 * aggregate orderBy/filterBy scopes).
 *
 * pg-aggregates only registers spec-prefixed behavior strings in the
 * `BehaviorString` type (e.g. `distinctCount:attribute:aggregate`), but the
 * runtime matches behaviors positionally against the suffix, so these generic
 * forms validly disable every spec at once. They are absent from the type
 * union, hence the cast.
 */
const HIDDEN_ATTRIBUTE_BEHAVIORS = [
  "-attribute:base",
  "-attribute:select",
  "-attribute:insert",
  "-attribute:update",
  "-attribute:filterBy",
  "-attribute:orderBy",
  "-attribute:groupBy",
  "-attribute:havingBy",
  "-attribute:aggregate",
  "-attribute:aggregate:orderBy",
  "-attribute:aggregate:filterBy",
] as GraphileBuild.BehaviorString[];

const PgVectorPlugin: GraphileConfig.Plugin = {
  name: "PgVectorPlugin",
  version: "0.0.0",
  description: "Adds a PgCodec for the pgvector `vector` type.",

  gather: gatherConfig({
    initialState: (_cache, { lib }) => {
      const {
        dataplanPg: { listOfCodec },
        graphileBuild: { EXPORTABLE },
        sql,
      } = lib;

      // pgvector serializes as a text literal (e.g. "[1,2,3]"), so a passthrough
      // text codec is sufficient for values to round-trip through the registry.
      const vectorCodec = EXPORTABLE(
        (sql) => ({
          name: "vector",
          sqlType: sql`vector`,
          toPg: (str: string) => str,
          fromPg: (str: string) => str,
          executor: null,
          attributes: undefined,
        }),
        [sql],
      );

      const vectorArrayCodec = EXPORTABLE(
        (listOfCodec, vectorCodec) => listOfCodec(vectorCodec),
        [listOfCodec, vectorCodec],
      );

      return { vectorCodec, vectorArrayCodec };
    },

    hooks: {
      async pgCodecs_findPgCodec(info, event) {
        // Another plugin already supplied a codec; skip.
        if (event.pgCodec) return;

        const { serviceName, pgType } = event;
        const { typname } = pgType;
        if (typname !== "vector" && typname !== "_vector") return;

        // Only claim types that belong to the pgvector extension, so we don't
        // shadow an unrelated user-defined type that happens to be named the same.
        const vectorExt = await info.helpers.pgIntrospection.getExtensionByName(
          serviceName,
          "vector",
        );
        if (!vectorExt || pgType.typnamespace !== vectorExt.extnamespace)
          return;

        event.pgCodec =
          typname === "vector"
            ? info.state.vectorCodec
            : info.state.vectorArrayCodec;
      },
    },
  }),

  schema: {
    hooks: {
      // graphile-build-pg walks every registered codec to assign it a GraphQL
      // type and warns ("Do not know how to convert PgCodec 'vector'...") for any
      // scalar it can't map. The columns are already hidden by the behavior
      // override below (behavior is checked before type resolution, so they stay
      // out of the schema), but the codec still needs *some* type to silence that
      // pass. Map it to the built-in String scalar - representable as text, and
      // never surfaced because no field references it.
      init(_, build) {
        const codec = build.pgCodecs.vector;
        if (codec && !build.hasGraphQLTypeForPgCodec(codec)) {
          build.setGraphQLTypeForPgCodec(codec, "output", "String");
          build.setGraphQLTypeForPgCodec(codec, "input", "String");
        }
        return _;
      },
    },
    entityBehavior: {
      // Strip all behaviors from vector-typed attributes so they never surface
      // in the schema. Runs after the inferred defaults so these negations win.
      pgCodecAttribute: {
        inferred: {
          provides: ["pgVectorHidden"],
          after: ["default"],
          callback(behavior, [codec, attributeName]) {
            const attributeCodec = codec.attributes?.[attributeName]?.codec;
            const isVector =
              attributeCodec?.name === "vector" ||
              attributeCodec?.arrayOfCodec?.name === "vector";

            if (!isVector) return behavior;

            return [behavior, ...HIDDEN_ATTRIBUTE_BEHAVIORS];
          },
        },
      },
    },
  },
};

export default PgVectorPlugin;
