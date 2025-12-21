import { PgAggregatesPreset } from "@graphile/pg-aggregates";
import { PgSimplifyInflectionPreset } from "@graphile/simplify-inflection";
import { makePgService } from "postgraphile/adaptors/pg";
import { PostGraphileAmberPreset } from "postgraphile/presets/amber";
import { PostGraphileConnectionFilterPreset } from "postgraphile-plugin-connection-filter";

import { DATABASE_URL, isProdEnv } from "./src/lib/config/env.config";
import {
  CommentPlugin,
  DownvotePlugin,
  InvitationPlugin,
  MemberPlugin,
  OrganizationPlugin,
  PostPlugin,
  PostStatusPlugin,
  PrimaryKeyMutationsOnlyPlugin,
  ProjectPlugin,
  ProjectSocialPlugin,
  SmartTagPlugin,
  UpvotePlugin,
  UserPlugin,
} from "./src/lib/plugins/postgraphile";

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
    // See https://github.com/graphile-contrib/postgraphile-plugin-connection-filter?tab=readme-ov-file#handling-null-and-empty-objects
    connectionFilterAllowNullInput: true,
    connectionFilterAllowEmptyObjectInput: true,
  },
  disablePlugins: ["PgIndexBehaviorsPlugin"],
  plugins: [
    PrimaryKeyMutationsOnlyPlugin,
    OrganizationPlugin,
    UserPlugin,
    MemberPlugin,
    InvitationPlugin,
    ProjectPlugin,
    ProjectSocialPlugin,
    PostPlugin,
    PostStatusPlugin,
    DownvotePlugin,
    UpvotePlugin,
    CommentPlugin,
    SmartTagPlugin,
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
