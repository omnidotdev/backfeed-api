import { PgAggregatesPreset } from "@graphile/pg-aggregates";
import { PgSimplifyInflectionPreset } from "@graphile/simplify-inflection";
import { PostGraphileConnectionFilterPreset } from "postgraphile-plugin-connection-filter";
import { makePgService } from "postgraphile/adaptors/pg";
import { PostGraphileAmberPreset } from "postgraphile/presets/amber";

import { DATABASE_URL, isProdEnv } from "./src/lib/config/env";
import {
  CommentRBACPlugin,
  DownvoteRBACPlugin,
  OrganizationRBACPlugin,
  PostRBACPlugin,
  PrimaryKeyMutationsOnlyPlugin,
  ProjectRBACPlugin,
  UpvoteRBACPlugin,
  UserOrganizationsRBACPlugin,
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
  },
  disablePlugins: ["PgIndexBehaviorsPlugin"],
  plugins: [
    PrimaryKeyMutationsOnlyPlugin,
    OrganizationRBACPlugin,
    UserRBACPlugin,
    UserOrganizationsRBACPlugin,
    ProjectRBACPlugin,
    PostRBACPlugin,
    DownvoteRBACPlugin,
    UpvoteRBACPlugin,
    CommentRBACPlugin,
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
