import { PgAggregatesPreset } from "@graphile/pg-aggregates";
import { PgSimplifyInflectionPreset } from "@graphile/simplify-inflection";
import { makePgService } from "postgraphile/adaptors/pg";
import { PostGraphileAmberPreset } from "postgraphile/presets/amber";
import { PostGraphileConnectionFilterPreset } from "postgraphile-plugin-connection-filter";

import { DATABASE_URL, isProdEnv } from "./src/lib/config/env.config";
import {
  CommentRBACPlugin,
  DownvoteRBACPlugin,
  MemberRBACPlugin,
  OrganizationRBACPlugin,
  PostRBACPlugin,
  PostStatusRBACPlugin,
  PrimaryKeyMutationsOnlyPlugin,
  ProjectRBACPlugin,
  ProjectSocialRBACPlugin,
  SmartTagsPlugin,
  UpvoteRBACPlugin,
  UserRBACPlugin,
} from "./src/lib/plugins/postgraphile";

import type { GraphileConfig } from "graphile-config";

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
    OrganizationRBACPlugin,
    UserRBACPlugin,
    MemberRBACPlugin,
    ProjectRBACPlugin,
    ProjectSocialRBACPlugin,
    PostRBACPlugin,
    PostStatusRBACPlugin,
    DownvoteRBACPlugin,
    UpvoteRBACPlugin,
    CommentRBACPlugin,
    SmartTagsPlugin,
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
