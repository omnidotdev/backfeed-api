import { PgAggregatesPreset } from "@graphile/pg-aggregates";
import { PgSimplifyInflectionPreset } from "@graphile/simplify-inflection";
import {
  CommentPlugin,
  PostPlugin,
  PrimaryKeyMutationsOnlyPlugin,
  ProjectPlugin,
  ProjectSocialPlugin,
  ProjectStatusConfigPlugin,
  SmartTagPlugin,
  StatusTemplatePlugin,
  UserPlugin,
  VotePlugin,
} from "lib/graphql/plugins/authorization";
import { AuthzSyncPlugin } from "lib/graphql/plugins/authz";
import { makePgService } from "postgraphile/adaptors/pg";
import { PostGraphileAmberPreset } from "postgraphile/presets/amber";
import { PostGraphileConnectionFilterPreset } from "postgraphile-plugin-connection-filter";

import { DATABASE_URL, isProdEnv } from "./env.config";

const preset: GraphileConfig.Preset = {
  extends: [
    PostGraphileAmberPreset,
    PostGraphileConnectionFilterPreset,
    PgSimplifyInflectionPreset,
    PgAggregatesPreset,
  ],
  schema: {
    retryOnInitFail: isProdEnv,
    sortExport: true,
    pgForbidSetofFunctionsToReturnNull: false,
    jsonScalarAsString: false,
    defaultBehavior: "-type:node -interface:node",
    // see https://github.com/graphile-contrib/postgraphile-plugin-connection-filter?tab=readme-ov-file#handling-null-and-empty-objects
    connectionFilterAllowNullInput: true,
    connectionFilterAllowEmptyObjectInput: true,
  },
  disablePlugins: ["PgIndexBehaviorsPlugin"],
  plugins: [
    // Authorization plugins (pre-mutation validation)
    PrimaryKeyMutationsOnlyPlugin,
    UserPlugin,
    ProjectPlugin,
    ProjectSocialPlugin,
    ProjectStatusConfigPlugin,
    PostPlugin,
    StatusTemplatePlugin,
    VotePlugin,
    CommentPlugin,
    SmartTagPlugin,
    // AuthZ sync plugin (post-mutation sync to PDP)
    AuthzSyncPlugin,
  ],
  grafserv: {
    graphiql: false,
  },
  pgServices: [
    makePgService({
      connectionString: DATABASE_URL,
      schemas: ["public"],
    }),
  ],
};

export default preset;
