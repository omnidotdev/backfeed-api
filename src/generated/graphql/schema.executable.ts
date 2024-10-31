// @ts-nocheck
import { PgBooleanFilterStep, PgConditionStep, PgDeleteSingleStep, PgExecutor, PgOrFilterStep, PgSelectStep, PgUnionAllStep, TYPES, assertPgClassSingleStep, listOfCodec, makeRegistry, pgDeleteSingle, pgInsertSingle, pgSelectFromRecord, pgUpdateSingle, recordCodec } from "@dataplan/pg";
import { ConnectionStep, EdgeStep, ObjectStep, SafeError, __ValueStep, access, assertEdgeCapableStep, assertExecutableStep, assertPageInfoCapableStep, connection, constant, context, first, getEnumValueConfig, inhibitOnNull, lambda, list, makeGrafastSchema, node, object, rootValue, specFromNodeId } from "grafast";
import { GraphQLEnumType, GraphQLError, Kind } from "graphql";
import { sql } from "pg-sql2";
import { inspect } from "util";
const handler = {
  typeName: "Query",
  codec: {
    name: "raw",
    encode: Object.assign(function rawEncode(value) {
      return typeof value === "string" ? value : null;
    }, {
      isSyncAndSafe: true
    }),
    decode: Object.assign(function rawDecode(value) {
      return typeof value === "string" ? value : null;
    }, {
      isSyncAndSafe: true
    })
  },
  match(specifier) {
    return specifier === "query";
  },
  getSpec() {
    return "irrelevant";
  },
  get() {
    return rootValue();
  },
  plan() {
    return constant`query`;
  }
};
const nodeIdCodecs_base64JSON_base64JSON = {
  name: "base64JSON",
  encode: (() => {
    function base64JSONEncode(value) {
      return Buffer.from(JSON.stringify(value), "utf8").toString("base64");
    }
    base64JSONEncode.isSyncAndSafe = !0;
    return base64JSONEncode;
  })(),
  decode: (() => {
    function base64JSONDecode(value) {
      return JSON.parse(Buffer.from(value, "base64").toString("utf8"));
    }
    base64JSONDecode.isSyncAndSafe = !0;
    return base64JSONDecode;
  })()
};
const nodeIdCodecs = Object.assign(Object.create(null), {
  raw: handler.codec,
  base64JSON: nodeIdCodecs_base64JSON_base64JSON,
  pipeString: {
    name: "pipeString",
    encode: Object.assign(function pipeStringEncode(value) {
      return Array.isArray(value) ? value.join("|") : null;
    }, {
      isSyncAndSafe: true
    }),
    decode: Object.assign(function pipeStringDecode(value) {
      return typeof value === "string" ? value.split("|") : null;
    }, {
      isSyncAndSafe: true
    })
  }
});
const executor = new PgExecutor({
  name: "main",
  context() {
    const ctx = context();
    return object({
      pgSettings: "pgSettings" != null ? ctx.get("pgSettings") : constant(null),
      withPgClient: ctx.get("withPgClient")
    });
  }
});
const upvoteIdentifier = sql.identifier("public", "upvote");
const spec_upvote = {
  name: "upvote",
  identifier: upvoteIdentifier,
  attributes: Object.assign(Object.create(null), {
    id: {
      description: undefined,
      codec: TYPES.int,
      notNull: true,
      hasDefault: true,
      extensions: {
        tags: {},
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    created_at: {
      description: undefined,
      codec: TYPES.timestamp,
      notNull: false,
      hasDefault: true,
      extensions: {
        tags: {},
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    }
  }),
  description: undefined,
  extensions: {
    oid: "72497",
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "public",
      name: "upvote"
    },
    tags: Object.create(null)
  },
  executor: executor
};
const upvoteCodec = recordCodec(spec_upvote);
const organizationIdentifier = sql.identifier("public", "organization");
const spec_organization = {
  name: "organization",
  identifier: organizationIdentifier,
  attributes: Object.assign(Object.create(null), {
    id: {
      description: undefined,
      codec: TYPES.int,
      notNull: true,
      hasDefault: true,
      extensions: {
        tags: {},
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    created_at: {
      description: undefined,
      codec: TYPES.timestamp,
      notNull: false,
      hasDefault: true,
      extensions: {
        tags: {},
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    name: {
      description: undefined,
      codec: TYPES.text,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    description: {
      description: undefined,
      codec: TYPES.varchar,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    slug: {
      description: undefined,
      codec: TYPES.varchar,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    projects: {
      description: undefined,
      codec: TYPES.text,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    }
  }),
  description: undefined,
  extensions: {
    oid: "72461",
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "public",
      name: "organization"
    },
    tags: Object.create(null)
  },
  executor: executor
};
const organizationCodec = recordCodec(spec_organization);
const postIdentifier = sql.identifier("public", "post");
const spec_post = {
  name: "post",
  identifier: postIdentifier,
  attributes: Object.assign(Object.create(null), {
    id: {
      description: undefined,
      codec: TYPES.int,
      notNull: true,
      hasDefault: true,
      extensions: {
        tags: {},
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    created_at: {
      description: undefined,
      codec: TYPES.timestamp,
      notNull: false,
      hasDefault: true,
      extensions: {
        tags: {},
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    title: {
      description: undefined,
      codec: TYPES.text,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    body: {
      description: undefined,
      codec: TYPES.text,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    author_id: {
      description: undefined,
      codec: TYPES.int,
      notNull: true,
      hasDefault: true,
      extensions: {
        tags: {},
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    project_id: {
      description: undefined,
      codec: TYPES.int,
      notNull: true,
      hasDefault: true,
      extensions: {
        tags: {},
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    }
  }),
  description: undefined,
  extensions: {
    oid: "72473",
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "public",
      name: "post"
    },
    tags: Object.create(null)
  },
  executor: executor
};
const postCodec = recordCodec(spec_post);
const projectIdentifier = sql.identifier("public", "project");
const spec_project = {
  name: "project",
  identifier: projectIdentifier,
  attributes: Object.assign(Object.create(null), {
    id: {
      description: undefined,
      codec: TYPES.int,
      notNull: true,
      hasDefault: true,
      extensions: {
        tags: {},
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    created_at: {
      description: undefined,
      codec: TYPES.timestamp,
      notNull: false,
      hasDefault: true,
      extensions: {
        tags: {},
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    name: {
      description: undefined,
      codec: TYPES.text,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    description: {
      description: undefined,
      codec: TYPES.varchar,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    slug: {
      description: undefined,
      codec: TYPES.varchar,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    image: {
      description: undefined,
      codec: TYPES.text,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    organization_id: {
      description: undefined,
      codec: TYPES.int,
      notNull: true,
      hasDefault: true,
      extensions: {
        tags: {},
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    }
  }),
  description: undefined,
  extensions: {
    oid: "72486",
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "public",
      name: "project"
    },
    tags: Object.create(null)
  },
  executor: executor
};
const projectCodec = recordCodec(spec_project);
const userIdentifier = sql.identifier("public", "user");
const spec_user = {
  name: "user",
  identifier: userIdentifier,
  attributes: Object.assign(Object.create(null), {
    id: {
      description: undefined,
      codec: TYPES.int,
      notNull: true,
      hasDefault: true,
      extensions: {
        tags: {},
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    created_at: {
      description: undefined,
      codec: TYPES.timestamp,
      notNull: false,
      hasDefault: true,
      extensions: {
        tags: {},
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    wallet_address: {
      description: undefined,
      codec: TYPES.varchar,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    posts: {
      description: undefined,
      codec: TYPES.text,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    upvotes: {
      description: undefined,
      codec: TYPES.text,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    }
  }),
  description: undefined,
  extensions: {
    oid: "72505",
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "public",
      name: "user"
    },
    tags: Object.create(null)
  },
  executor: executor
};
const userCodec = recordCodec(spec_user);
const upvoteUniques = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}];
const userUniques = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}];
const organizationUniques = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}];
const postUniques = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}];
const projectUniques = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}];
const registry = makeRegistry({
  pgExecutors: Object.assign(Object.create(null), {
    main: executor
  }),
  pgCodecs: Object.assign(Object.create(null), {
    upvote: upvoteCodec,
    int4: TYPES.int,
    timestamp: TYPES.timestamp,
    organization: organizationCodec,
    text: TYPES.text,
    varchar: TYPES.varchar,
    post: postCodec,
    project: projectCodec,
    user: userCodec
  }),
  pgResources: Object.assign(Object.create(null), {
    upvote: {
      executor: executor,
      name: "upvote",
      identifier: "main.public.upvote",
      from: upvoteIdentifier,
      codec: upvoteCodec,
      uniques: upvoteUniques,
      isVirtual: false,
      description: undefined,
      extensions: {
        description: undefined,
        pg: {
          serviceName: "main",
          schemaName: "public",
          name: "upvote"
        },
        isInsertable: true,
        isUpdatable: true,
        isDeletable: true,
        tags: {},
        canSelect: true,
        canInsert: true,
        canUpdate: true,
        canDelete: true
      }
    },
    user: {
      executor: executor,
      name: "user",
      identifier: "main.public.user",
      from: userIdentifier,
      codec: userCodec,
      uniques: userUniques,
      isVirtual: false,
      description: undefined,
      extensions: {
        description: undefined,
        pg: {
          serviceName: "main",
          schemaName: "public",
          name: "user"
        },
        isInsertable: true,
        isUpdatable: true,
        isDeletable: true,
        tags: {},
        canSelect: true,
        canInsert: true,
        canUpdate: true,
        canDelete: true
      }
    },
    organization: {
      executor: executor,
      name: "organization",
      identifier: "main.public.organization",
      from: organizationIdentifier,
      codec: organizationCodec,
      uniques: organizationUniques,
      isVirtual: false,
      description: undefined,
      extensions: {
        description: undefined,
        pg: {
          serviceName: "main",
          schemaName: "public",
          name: "organization"
        },
        isInsertable: true,
        isUpdatable: true,
        isDeletable: true,
        tags: {},
        canSelect: true,
        canInsert: true,
        canUpdate: true,
        canDelete: true
      }
    },
    post: {
      executor: executor,
      name: "post",
      identifier: "main.public.post",
      from: postIdentifier,
      codec: postCodec,
      uniques: postUniques,
      isVirtual: false,
      description: undefined,
      extensions: {
        description: undefined,
        pg: {
          serviceName: "main",
          schemaName: "public",
          name: "post"
        },
        isInsertable: true,
        isUpdatable: true,
        isDeletable: true,
        tags: {},
        canSelect: true,
        canInsert: true,
        canUpdate: true,
        canDelete: true
      }
    },
    project: {
      executor: executor,
      name: "project",
      identifier: "main.public.project",
      from: projectIdentifier,
      codec: projectCodec,
      uniques: projectUniques,
      isVirtual: false,
      description: undefined,
      extensions: {
        description: undefined,
        pg: {
          serviceName: "main",
          schemaName: "public",
          name: "project"
        },
        isInsertable: true,
        isUpdatable: true,
        isDeletable: true,
        tags: {},
        canSelect: true,
        canInsert: true,
        canUpdate: true,
        canDelete: true
      }
    }
  }),
  pgRelations: Object.create(null)
});
const pgResource_upvotePgResource = registry.pgResources["upvote"];
const pgResource_userPgResource = registry.pgResources["user"];
const pgResource_organizationPgResource = registry.pgResources["organization"];
const pgResource_postPgResource = registry.pgResources["post"];
const pgResource_projectPgResource = registry.pgResources["project"];
const nodeIdHandlerByTypeName = Object.assign(Object.create(null), {
  Query: handler,
  Upvote: {
    typeName: "Upvote",
    codec: nodeIdCodecs_base64JSON_base64JSON,
    deprecationReason: undefined,
    plan($record) {
      return list([constant("Upvote", false), $record.get("id")]);
    },
    getSpec($list) {
      return {
        id: inhibitOnNull(access($list, [1]))
      };
    },
    get(spec) {
      return pgResource_upvotePgResource.get(spec);
    },
    match(obj) {
      return obj[0] === "Upvote";
    }
  },
  User: {
    typeName: "User",
    codec: nodeIdCodecs_base64JSON_base64JSON,
    deprecationReason: undefined,
    plan($record) {
      return list([constant("User", false), $record.get("id")]);
    },
    getSpec($list) {
      return {
        id: inhibitOnNull(access($list, [1]))
      };
    },
    get(spec) {
      return pgResource_userPgResource.get(spec);
    },
    match(obj) {
      return obj[0] === "User";
    }
  },
  Organization: {
    typeName: "Organization",
    codec: nodeIdCodecs_base64JSON_base64JSON,
    deprecationReason: undefined,
    plan($record) {
      return list([constant("Organization", false), $record.get("id")]);
    },
    getSpec($list) {
      return {
        id: inhibitOnNull(access($list, [1]))
      };
    },
    get(spec) {
      return pgResource_organizationPgResource.get(spec);
    },
    match(obj) {
      return obj[0] === "Organization";
    }
  },
  Post: {
    typeName: "Post",
    codec: nodeIdCodecs_base64JSON_base64JSON,
    deprecationReason: undefined,
    plan($record) {
      return list([constant("Post", false), $record.get("id")]);
    },
    getSpec($list) {
      return {
        id: inhibitOnNull(access($list, [1]))
      };
    },
    get(spec) {
      return pgResource_postPgResource.get(spec);
    },
    match(obj) {
      return obj[0] === "Post";
    }
  },
  Project: {
    typeName: "Project",
    codec: nodeIdCodecs_base64JSON_base64JSON,
    deprecationReason: undefined,
    plan($record) {
      return list([constant("Project", false), $record.get("id")]);
    },
    getSpec($list) {
      return {
        id: inhibitOnNull(access($list, [1]))
      };
    },
    get(spec) {
      return pgResource_projectPgResource.get(spec);
    },
    match(obj) {
      return obj[0] === "Project";
    }
  }
});
function specForHandler(handler) {
  function spec(nodeId) {
    try {
      const specifier = handler.codec.decode(nodeId);
      if (handler.match(specifier)) return specifier;
    } catch {}
    return null;
  }
  spec.displayName = `specifier_${handler.typeName}_${handler.codec.name}`;
  spec.isSyncAndSafe = !0;
  return spec;
}
const fetcher = (handler => {
  const fn = $nodeId => {
    const $decoded = lambda($nodeId, specForHandler(handler));
    return handler.get(handler.getSpec($decoded));
  };
  fn.deprecationReason = handler.deprecationReason;
  return fn;
})(nodeIdHandlerByTypeName.Upvote);
const fetcher2 = (handler => {
  const fn = $nodeId => {
    const $decoded = lambda($nodeId, specForHandler(handler));
    return handler.get(handler.getSpec($decoded));
  };
  fn.deprecationReason = handler.deprecationReason;
  return fn;
})(nodeIdHandlerByTypeName.User);
const fetcher3 = (handler => {
  const fn = $nodeId => {
    const $decoded = lambda($nodeId, specForHandler(handler));
    return handler.get(handler.getSpec($decoded));
  };
  fn.deprecationReason = handler.deprecationReason;
  return fn;
})(nodeIdHandlerByTypeName.Organization);
const fetcher4 = (handler => {
  const fn = $nodeId => {
    const $decoded = lambda($nodeId, specForHandler(handler));
    return handler.get(handler.getSpec($decoded));
  };
  fn.deprecationReason = handler.deprecationReason;
  return fn;
})(nodeIdHandlerByTypeName.Post);
const fetcher5 = (handler => {
  const fn = $nodeId => {
    const $decoded = lambda($nodeId, specForHandler(handler));
    return handler.get(handler.getSpec($decoded));
  };
  fn.deprecationReason = handler.deprecationReason;
  return fn;
})(nodeIdHandlerByTypeName.Project);
const applyOrderToPlan = ($select, $value, TableOrderByType) => {
  if (!("evalLength" in $value)) return;
  const length = $value.evalLength();
  if (length == null) return;
  for (let i = 0; i < length; i++) {
    const order = $value.at(i).eval();
    if (order == null) continue;
    const plan = getEnumValueConfig(TableOrderByType, order)?.extensions?.grafast?.applyPlan;
    if (typeof plan !== "function") {
      console.error(`Internal server error: invalid orderBy configuration: expected function, but received ${inspect(plan)}`);
      throw new SafeError("Internal server error: invalid orderBy configuration");
    }
    plan($select);
  }
};
function assertAllowed(fieldArgs, mode) {
  const $raw = fieldArgs.getRaw();
  if (mode === "object" && !false && "evalIsEmpty" in $raw && $raw.evalIsEmpty()) throw Object.assign(new Error("Empty objects are forbidden in filter argument input."), {});
  if (mode === "list" && !false && "evalLength" in $raw) {
    const l = $raw.evalLength();
    if (l != null) for (let i = 0; i < l; i++) {
      const $entry = $raw.at(i);
      if ("evalIsEmpty" in $entry && $entry.evalIsEmpty()) throw Object.assign(new Error("Empty objects are forbidden in filter argument input."), {});
    }
  }
  if (!false && $raw.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
}
function assertAllowed2(fieldArgs, mode) {
  const $raw = fieldArgs.getRaw();
  if (mode === "object" && !false && "evalIsEmpty" in $raw && $raw.evalIsEmpty()) throw Object.assign(new Error("Empty objects are forbidden in filter argument input."), {});
  if (mode === "list" && !false && "evalLength" in $raw) {
    const l = $raw.evalLength();
    if (l != null) for (let i = 0; i < l; i++) {
      const $entry = $raw.at(i);
      if ("evalIsEmpty" in $entry && $entry.evalIsEmpty()) throw Object.assign(new Error("Empty objects are forbidden in filter argument input."), {});
    }
  }
  if (!false && $raw.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
}
function assertAllowed3(fieldArgs, mode) {
  const $raw = fieldArgs.getRaw();
  if (mode === "object" && !false && "evalIsEmpty" in $raw && $raw.evalIsEmpty()) throw Object.assign(new Error("Empty objects are forbidden in filter argument input."), {});
  if (mode === "list" && !false && "evalLength" in $raw) {
    const l = $raw.evalLength();
    if (l != null) for (let i = 0; i < l; i++) {
      const $entry = $raw.at(i);
      if ("evalIsEmpty" in $entry && $entry.evalIsEmpty()) throw Object.assign(new Error("Empty objects are forbidden in filter argument input."), {});
    }
  }
  if (!false && $raw.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
}
function assertAllowed4(fieldArgs, mode) {
  const $raw = fieldArgs.getRaw();
  if (mode === "object" && !false && "evalIsEmpty" in $raw && $raw.evalIsEmpty()) throw Object.assign(new Error("Empty objects are forbidden in filter argument input."), {});
  if (mode === "list" && !false && "evalLength" in $raw) {
    const l = $raw.evalLength();
    if (l != null) for (let i = 0; i < l; i++) {
      const $entry = $raw.at(i);
      if ("evalIsEmpty" in $entry && $entry.evalIsEmpty()) throw Object.assign(new Error("Empty objects are forbidden in filter argument input."), {});
    }
  }
  if (!false && $raw.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
}
function assertAllowed5(fieldArgs, mode) {
  const $raw = fieldArgs.getRaw();
  if (mode === "object" && !false && "evalIsEmpty" in $raw && $raw.evalIsEmpty()) throw Object.assign(new Error("Empty objects are forbidden in filter argument input."), {});
  if (mode === "list" && !false && "evalLength" in $raw) {
    const l = $raw.evalLength();
    if (l != null) for (let i = 0; i < l; i++) {
      const $entry = $raw.at(i);
      if ("evalIsEmpty" in $entry && $entry.evalIsEmpty()) throw Object.assign(new Error("Empty objects are forbidden in filter argument input."), {});
    }
  }
  if (!false && $raw.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
}
function DatetimeSerialize(value) {
  return "" + value;
}
function UpvoteGroupBy_extensions_grafast_applyPlan($pgSelect) {
  $pgSelect.groupBy({
    fragment: sql.fragment`${$pgSelect.alias}.${sql.identifier("created_at")}`
  });
}
const aggregateGroupBySpec = {
  id: "truncated-to-hour",
  isSuitableType(codec) {
    return codec === TYPES.timestamp || codec === TYPES.timestamptz;
  },
  sqlWrap(sqlFrag) {
    return sql`date_trunc('hour', ${sqlFrag})`;
  }
};
function UpvoteGroupBy_extensions_grafast_applyPlan2($pgSelect) {
  $pgSelect.groupBy({
    fragment: aggregateGroupBySpec.sqlWrap(sql`${$pgSelect.alias}.${sql.identifier("created_at")}`)
  });
}
const aggregateGroupBySpec2 = {
  id: "truncated-to-day",
  isSuitableType(codec) {
    return codec === TYPES.timestamp || codec === TYPES.timestamptz;
  },
  sqlWrap(sqlFrag) {
    return sql`date_trunc('day', ${sqlFrag})`;
  }
};
function UpvoteGroupBy_extensions_grafast_applyPlan3($pgSelect) {
  $pgSelect.groupBy({
    fragment: aggregateGroupBySpec2.sqlWrap(sql`${$pgSelect.alias}.${sql.identifier("created_at")}`)
  });
}
export const UpvoteGroupBy = new GraphQLEnumType({
  name: "UpvoteGroupBy",
  description: "Grouping methods for `Upvote` for usage during aggregation.",
  values: Object.assign(Object.create(null), {
    CREATED_AT: {
      value: "CREATED_AT",
      extensions: Object.assign(Object.create(null), {
        grafast: {
          applyPlan: UpvoteGroupBy_extensions_grafast_applyPlan
        }
      })
    },
    CREATED_AT_TRUNCATED_TO_HOUR: {
      value: "CREATED_AT_TRUNCATED_TO_HOUR",
      extensions: Object.assign(Object.create(null), {
        grafast: {
          applyPlan: UpvoteGroupBy_extensions_grafast_applyPlan2
        }
      })
    },
    CREATED_AT_TRUNCATED_TO_DAY: {
      value: "CREATED_AT_TRUNCATED_TO_DAY",
      extensions: Object.assign(Object.create(null), {
        grafast: {
          applyPlan: UpvoteGroupBy_extensions_grafast_applyPlan3
        }
      })
    }
  })
});
const isIntervalLike = codec => {
  var _a;
  return !!((_a = codec.extensions) === null || _a === void 0 ? void 0 : _a.isIntervalLike);
};
const isNumberLike = codec => {
  var _a;
  return !!((_a = codec.extensions) === null || _a === void 0 ? void 0 : _a.isNumberLike);
};
const spec_isSuitableType = codec => isIntervalLike(codec) || isNumberLike(codec);
const dataTypeToAggregateTypeMap = {
  "20": TYPES.numeric,
  "21": TYPES.bigint,
  "23": TYPES.bigint,
  "700": TYPES.float4,
  "701": TYPES.float,
  "790": TYPES.money,
  "1186": TYPES.interval
};
const spec = {
  id: "sum",
  humanLabel: "sum",
  HumanLabel: "Sum",
  isSuitableType: spec_isSuitableType,
  sqlAggregateWrap(sqlFrag) {
    return sql`coalesce(sum(${sqlFrag}), '0')`;
  },
  isNonNull: true,
  pgTypeCodecModifier(codec) {
    var _a, _b;
    const oid = (_a = codec.extensions) === null || _a === void 0 ? void 0 : _a.oid;
    return (_b = oid ? dataTypeToAggregateTypeMap[oid] : null) !== null && _b !== void 0 ? _b : TYPES.numeric;
  }
};
const dataTypeToAggregateTypeMap2 = {};
const spec2 = {
  id: "distinctCount",
  humanLabel: "distinct count",
  HumanLabel: "Distinct count",
  isSuitableType() {
    return !0;
  },
  sqlAggregateWrap(sqlFrag) {
    return sql`count(distinct ${sqlFrag})`;
  },
  pgTypeCodecModifier(codec) {
    var _a, _b;
    const oid = (_a = codec.extensions) === null || _a === void 0 ? void 0 : _a.oid;
    return (_b = oid ? dataTypeToAggregateTypeMap2[oid] : null) !== null && _b !== void 0 ? _b : TYPES.bigint;
  }
};
const spec3 = {
  id: "min",
  humanLabel: "minimum",
  HumanLabel: "Minimum",
  isSuitableType: spec_isSuitableType,
  sqlAggregateWrap(sqlFrag) {
    return sql`min(${sqlFrag})`;
  }
};
const spec4 = {
  id: "max",
  humanLabel: "maximum",
  HumanLabel: "Maximum",
  isSuitableType: spec_isSuitableType,
  sqlAggregateWrap(sqlFrag) {
    return sql`max(${sqlFrag})`;
  }
};
const dataTypeToAggregateTypeMap3 = {
  "20": TYPES.numeric,
  "21": TYPES.numeric,
  "23": TYPES.numeric,
  "700": TYPES.float,
  "701": TYPES.float,
  "1186": TYPES.interval,
  "1700": TYPES.numeric
};
const spec5 = {
  id: "average",
  humanLabel: "mean average",
  HumanLabel: "Mean average",
  isSuitableType: spec_isSuitableType,
  sqlAggregateWrap(sqlFrag) {
    return sql`avg(${sqlFrag})`;
  },
  pgTypeCodecModifier(codec) {
    var _a, _b;
    const oid = (_a = codec.extensions) === null || _a === void 0 ? void 0 : _a.oid;
    return (_b = oid ? dataTypeToAggregateTypeMap3[oid] : null) !== null && _b !== void 0 ? _b : TYPES.numeric;
  }
};
const dataTypeToAggregateTypeMap4 = {
  "700": TYPES.float,
  "701": TYPES.float
};
const spec6 = {
  id: "stddevSample",
  humanLabel: "sample standard deviation",
  HumanLabel: "Sample standard deviation",
  isSuitableType: isNumberLike,
  sqlAggregateWrap(sqlFrag) {
    return sql`stddev_samp(${sqlFrag})`;
  },
  pgTypeCodecModifier(codec) {
    var _a, _b;
    const oid = (_a = codec.extensions) === null || _a === void 0 ? void 0 : _a.oid;
    return (_b = oid ? dataTypeToAggregateTypeMap4[oid] : null) !== null && _b !== void 0 ? _b : TYPES.numeric;
  }
};
const dataTypeToAggregateTypeMap5 = {
  "700": TYPES.float,
  "701": TYPES.float
};
const spec7 = {
  id: "stddevPopulation",
  humanLabel: "population standard deviation",
  HumanLabel: "Population standard deviation",
  isSuitableType: isNumberLike,
  sqlAggregateWrap(sqlFrag) {
    return sql`stddev_pop(${sqlFrag})`;
  },
  pgTypeCodecModifier(codec) {
    var _a, _b;
    const oid = (_a = codec.extensions) === null || _a === void 0 ? void 0 : _a.oid;
    return (_b = oid ? dataTypeToAggregateTypeMap5[oid] : null) !== null && _b !== void 0 ? _b : TYPES.numeric;
  }
};
const dataTypeToAggregateTypeMap6 = {
  "700": TYPES.float,
  "701": TYPES.float
};
const spec8 = {
  id: "varianceSample",
  humanLabel: "sample variance",
  HumanLabel: "Sample variance",
  isSuitableType: isNumberLike,
  sqlAggregateWrap(sqlFrag) {
    return sql`var_samp(${sqlFrag})`;
  },
  pgTypeCodecModifier(codec) {
    var _a, _b;
    const oid = (_a = codec.extensions) === null || _a === void 0 ? void 0 : _a.oid;
    return (_b = oid ? dataTypeToAggregateTypeMap6[oid] : null) !== null && _b !== void 0 ? _b : TYPES.numeric;
  }
};
const dataTypeToAggregateTypeMap7 = {
  "700": TYPES.float,
  "701": TYPES.float
};
const spec9 = {
  id: "variancePopulation",
  humanLabel: "population variance",
  HumanLabel: "Population variance",
  isSuitableType: isNumberLike,
  sqlAggregateWrap(sqlFrag) {
    return sql`var_pop(${sqlFrag})`;
  },
  pgTypeCodecModifier(codec) {
    var _a, _b;
    const oid = (_a = codec.extensions) === null || _a === void 0 ? void 0 : _a.oid;
    return (_b = oid ? dataTypeToAggregateTypeMap7[oid] : null) !== null && _b !== void 0 ? _b : TYPES.numeric;
  }
};
const infix = () => sql.fragment`=`;
const infix2 = () => sql.fragment`<>`;
const infix3 = () => sql.fragment`>`;
const infix4 = () => sql.fragment`>=`;
const infix5 = () => sql.fragment`<`;
const infix6 = () => sql.fragment`<=`;
const infix7 = () => sql.fragment`=`;
const infix8 = () => sql.fragment`<>`;
const infix9 = () => sql.fragment`>`;
const infix10 = () => sql.fragment`>=`;
const infix11 = () => sql.fragment`<`;
const infix12 = () => sql.fragment`<=`;
const colSpec = {
  attributeName: "id",
  attribute: spec_upvote.attributes.id
};
const colSpec2 = {
  attributeName: "created_at",
  attribute: spec_upvote.attributes.created_at
};
function assertAllowed6(fieldArgs, mode) {
  const $raw = fieldArgs.getRaw();
  if (mode === "object" && !false && "evalIsEmpty" in $raw && $raw.evalIsEmpty()) throw Object.assign(new Error("Empty objects are forbidden in filter argument input."), {});
  if (mode === "list" && !false && "evalLength" in $raw) {
    const l = $raw.evalLength();
    if (l != null) for (let i = 0; i < l; i++) {
      const $entry = $raw.at(i);
      if ("evalIsEmpty" in $entry && $entry.evalIsEmpty()) throw Object.assign(new Error("Empty objects are forbidden in filter argument input."), {});
    }
  }
  if (!false && $raw.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
}
const resolve = (i, _v, $input) => sql`${i} ${$input.eval() ? sql`IS NULL` : sql`IS NOT NULL`}`;
const resolveInputCodec = () => TYPES.boolean;
const resolveSqlValue = () => sql.null;
const resolve2 = (i, v) => sql`${i} = ${v}`;
const forceTextTypesSensitive = [TYPES.citext, TYPES.char, TYPES.bpchar];
function resolveDomains(c) {
  let current = c;
  while (current.domainOfCodec) current = current.domainOfCodec;
  return current;
}
function resolveInputCodec2(c) {
  if (c.arrayOfCodec) {
    if (forceTextTypesSensitive.includes(resolveDomains(c.arrayOfCodec))) return listOfCodec(TYPES.text, {
      extensions: {
        listItemNonNull: c.extensions?.listItemNonNull
      }
    });
    return c;
  } else {
    if (forceTextTypesSensitive.includes(resolveDomains(c))) return TYPES.text;
    return c;
  }
}
function resolveSqlIdentifier(identifier, c) {
  if (c.arrayOfCodec && forceTextTypesSensitive.includes(resolveDomains(c.arrayOfCodec))) return [sql`(${identifier})::text[]`, listOfCodec(TYPES.text, {
    extensions: {
      listItemNonNull: c.extensions?.listItemNonNull
    }
  })];else if (forceTextTypesSensitive.includes(resolveDomains(c))) return [sql`(${identifier})::text`, TYPES.text];else return [identifier, c];
}
const resolve3 = (i, v) => sql`${i} <> ${v}`;
const resolve4 = (i, v) => sql`${i} IS DISTINCT FROM ${v}`;
const resolve5 = (i, v) => sql`${i} IS NOT DISTINCT FROM ${v}`;
const resolve6 = (i, v) => sql`${i} = ANY(${v})`;
function resolveInputCodec3(c) {
  if (forceTextTypesSensitive.includes(resolveDomains(c))) return listOfCodec(TYPES.text, {
    extensions: {
      listItemNonNull: !0
    }
  });else return listOfCodec(c, {
    extensions: {
      listItemNonNull: !0
    }
  });
}
const resolve7 = (i, v) => sql`${i} <> ALL(${v})`;
const resolve8 = (i, v) => sql`${i} < ${v}`;
const resolve9 = (i, v) => sql`${i} <= ${v}`;
const resolve10 = (i, v) => sql`${i} > ${v}`;
const resolve11 = (i, v) => sql`${i} >= ${v}`;
const resolve12 = (i, _v, $input) => sql`${i} ${$input.eval() ? sql`IS NULL` : sql`IS NOT NULL`}`;
const resolveInputCodec4 = () => TYPES.boolean;
const resolveSqlValue2 = () => sql.null;
const resolve13 = (i, v) => sql`${i} = ${v}`;
const forceTextTypesSensitive2 = [TYPES.citext, TYPES.char, TYPES.bpchar];
function resolveDomains2(c) {
  let current = c;
  while (current.domainOfCodec) current = current.domainOfCodec;
  return current;
}
function resolveInputCodec5(c) {
  if (c.arrayOfCodec) {
    if (forceTextTypesSensitive2.includes(resolveDomains2(c.arrayOfCodec))) return listOfCodec(TYPES.text, {
      extensions: {
        listItemNonNull: c.extensions?.listItemNonNull
      }
    });
    return c;
  } else {
    if (forceTextTypesSensitive2.includes(resolveDomains2(c))) return TYPES.text;
    return c;
  }
}
function resolveSqlIdentifier2(identifier, c) {
  if (c.arrayOfCodec && forceTextTypesSensitive2.includes(resolveDomains2(c.arrayOfCodec))) return [sql`(${identifier})::text[]`, listOfCodec(TYPES.text, {
    extensions: {
      listItemNonNull: c.extensions?.listItemNonNull
    }
  })];else if (forceTextTypesSensitive2.includes(resolveDomains2(c))) return [sql`(${identifier})::text`, TYPES.text];else return [identifier, c];
}
const resolve14 = (i, v) => sql`${i} <> ${v}`;
const resolve15 = (i, v) => sql`${i} IS DISTINCT FROM ${v}`;
const resolve16 = (i, v) => sql`${i} IS NOT DISTINCT FROM ${v}`;
const resolve17 = (i, v) => sql`${i} = ANY(${v})`;
function resolveInputCodec6(c) {
  if (forceTextTypesSensitive2.includes(resolveDomains2(c))) return listOfCodec(TYPES.text, {
    extensions: {
      listItemNonNull: !0
    }
  });else return listOfCodec(c, {
    extensions: {
      listItemNonNull: !0
    }
  });
}
const resolve18 = (i, v) => sql`${i} <> ALL(${v})`;
const resolve19 = (i, v) => sql`${i} < ${v}`;
const resolve20 = (i, v) => sql`${i} <= ${v}`;
const resolve21 = (i, v) => sql`${i} > ${v}`;
const resolve22 = (i, v) => sql`${i} >= ${v}`;
function UserGroupBy_extensions_grafast_applyPlan($pgSelect) {
  $pgSelect.groupBy({
    fragment: sql.fragment`${$pgSelect.alias}.${sql.identifier("created_at")}`
  });
}
function UserGroupBy_extensions_grafast_applyPlan2($pgSelect) {
  $pgSelect.groupBy({
    fragment: aggregateGroupBySpec.sqlWrap(sql`${$pgSelect.alias}.${sql.identifier("created_at")}`)
  });
}
function UserGroupBy_extensions_grafast_applyPlan3($pgSelect) {
  $pgSelect.groupBy({
    fragment: aggregateGroupBySpec2.sqlWrap(sql`${$pgSelect.alias}.${sql.identifier("created_at")}`)
  });
}
function UserGroupBy_extensions_grafast_applyPlan4($pgSelect) {
  $pgSelect.groupBy({
    fragment: sql.fragment`${$pgSelect.alias}.${sql.identifier("wallet_address")}`
  });
}
function UserGroupBy_extensions_grafast_applyPlan5($pgSelect) {
  $pgSelect.groupBy({
    fragment: sql.fragment`${$pgSelect.alias}.${sql.identifier("posts")}`
  });
}
function UserGroupBy_extensions_grafast_applyPlan6($pgSelect) {
  $pgSelect.groupBy({
    fragment: sql.fragment`${$pgSelect.alias}.${sql.identifier("upvotes")}`
  });
}
export const UserGroupBy = new GraphQLEnumType({
  name: "UserGroupBy",
  description: "Grouping methods for `User` for usage during aggregation.",
  values: Object.assign(Object.create(null), {
    CREATED_AT: {
      value: "CREATED_AT",
      extensions: Object.assign(Object.create(null), {
        grafast: {
          applyPlan: UserGroupBy_extensions_grafast_applyPlan
        }
      })
    },
    CREATED_AT_TRUNCATED_TO_HOUR: {
      value: "CREATED_AT_TRUNCATED_TO_HOUR",
      extensions: Object.assign(Object.create(null), {
        grafast: {
          applyPlan: UserGroupBy_extensions_grafast_applyPlan2
        }
      })
    },
    CREATED_AT_TRUNCATED_TO_DAY: {
      value: "CREATED_AT_TRUNCATED_TO_DAY",
      extensions: Object.assign(Object.create(null), {
        grafast: {
          applyPlan: UserGroupBy_extensions_grafast_applyPlan3
        }
      })
    },
    WALLET_ADDRESS: {
      value: "WALLET_ADDRESS",
      extensions: Object.assign(Object.create(null), {
        grafast: {
          applyPlan: UserGroupBy_extensions_grafast_applyPlan4
        }
      })
    },
    POSTS: {
      value: "POSTS",
      extensions: Object.assign(Object.create(null), {
        grafast: {
          applyPlan: UserGroupBy_extensions_grafast_applyPlan5
        }
      })
    },
    UPVOTES: {
      value: "UPVOTES",
      extensions: Object.assign(Object.create(null), {
        grafast: {
          applyPlan: UserGroupBy_extensions_grafast_applyPlan6
        }
      })
    }
  })
});
const colSpec3 = {
  attributeName: "id",
  attribute: spec_user.attributes.id
};
const colSpec4 = {
  attributeName: "created_at",
  attribute: spec_user.attributes.created_at
};
const colSpec5 = {
  attributeName: "wallet_address",
  attribute: spec_user.attributes.wallet_address
};
const colSpec6 = {
  attributeName: "posts",
  attribute: spec_user.attributes.posts
};
const colSpec7 = {
  attributeName: "upvotes",
  attribute: spec_user.attributes.upvotes
};
function assertAllowed7(fieldArgs, mode) {
  const $raw = fieldArgs.getRaw();
  if (mode === "object" && !false && "evalIsEmpty" in $raw && $raw.evalIsEmpty()) throw Object.assign(new Error("Empty objects are forbidden in filter argument input."), {});
  if (mode === "list" && !false && "evalLength" in $raw) {
    const l = $raw.evalLength();
    if (l != null) for (let i = 0; i < l; i++) {
      const $entry = $raw.at(i);
      if ("evalIsEmpty" in $entry && $entry.evalIsEmpty()) throw Object.assign(new Error("Empty objects are forbidden in filter argument input."), {});
    }
  }
  if (!false && $raw.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
}
const resolve23 = (i, _v, $input) => sql`${i} ${$input.eval() ? sql`IS NULL` : sql`IS NOT NULL`}`;
const resolveInputCodec7 = () => TYPES.boolean;
const resolveSqlValue3 = () => sql.null;
const resolve24 = (i, v) => sql`${i} = ${v}`;
const forceTextTypesSensitive3 = [TYPES.citext, TYPES.char, TYPES.bpchar];
function resolveDomains3(c) {
  let current = c;
  while (current.domainOfCodec) current = current.domainOfCodec;
  return current;
}
function resolveInputCodec8(c) {
  if (c.arrayOfCodec) {
    if (forceTextTypesSensitive3.includes(resolveDomains3(c.arrayOfCodec))) return listOfCodec(TYPES.text, {
      extensions: {
        listItemNonNull: c.extensions?.listItemNonNull
      }
    });
    return c;
  } else {
    if (forceTextTypesSensitive3.includes(resolveDomains3(c))) return TYPES.text;
    return c;
  }
}
function resolveSqlIdentifier3(identifier, c) {
  if (c.arrayOfCodec && forceTextTypesSensitive3.includes(resolveDomains3(c.arrayOfCodec))) return [sql`(${identifier})::text[]`, listOfCodec(TYPES.text, {
    extensions: {
      listItemNonNull: c.extensions?.listItemNonNull
    }
  })];else if (forceTextTypesSensitive3.includes(resolveDomains3(c))) return [sql`(${identifier})::text`, TYPES.text];else return [identifier, c];
}
const resolve25 = (i, v) => sql`${i} <> ${v}`;
const resolve26 = (i, v) => sql`${i} IS DISTINCT FROM ${v}`;
const resolve27 = (i, v) => sql`${i} IS NOT DISTINCT FROM ${v}`;
const resolve28 = (i, v) => sql`${i} = ANY(${v})`;
function resolveInputCodec9(c) {
  if (forceTextTypesSensitive3.includes(resolveDomains3(c))) return listOfCodec(TYPES.text, {
    extensions: {
      listItemNonNull: !0
    }
  });else return listOfCodec(c, {
    extensions: {
      listItemNonNull: !0
    }
  });
}
const resolve29 = (i, v) => sql`${i} <> ALL(${v})`;
const resolve30 = (i, v) => sql`${i} < ${v}`;
const resolve31 = (i, v) => sql`${i} <= ${v}`;
const resolve32 = (i, v) => sql`${i} > ${v}`;
const resolve33 = (i, v) => sql`${i} >= ${v}`;
const resolve34 = (i, v) => sql`${i} LIKE ${v}`;
function escapeLikeWildcards(input) {
  if (typeof input !== "string") throw new Error("Non-string input was provided to escapeLikeWildcards");else return input.split("%").join("\\%").split("_").join("\\_");
}
const resolveInput = input => `%${escapeLikeWildcards(input)}%`;
const resolve35 = (i, v) => sql`${i} NOT LIKE ${v}`;
const resolveInput2 = input => `%${escapeLikeWildcards(input)}%`;
const resolve36 = (i, v) => sql`${i} ILIKE ${v}`;
const resolveInput3 = input => `%${escapeLikeWildcards(input)}%`;
const forceTextTypesInsensitive = [TYPES.char, TYPES.bpchar];
function resolveInputCodec10(c) {
  if (c.arrayOfCodec) {
    if (forceTextTypesInsensitive.includes(resolveDomains3(c.arrayOfCodec))) return listOfCodec(TYPES.text, {
      extensions: {
        listItemNonNull: c.extensions?.listItemNonNull
      }
    });
    return c;
  } else {
    if (forceTextTypesInsensitive.includes(resolveDomains3(c))) return TYPES.text;
    return c;
  }
}
function resolveSqlIdentifier4(identifier, c) {
  if (c.arrayOfCodec && forceTextTypesInsensitive.includes(resolveDomains3(c.arrayOfCodec))) return [sql`(${identifier})::text[]`, listOfCodec(TYPES.text, {
    extensions: {
      listItemNonNull: c.extensions?.listItemNonNull
    }
  })];else if (forceTextTypesInsensitive.includes(resolveDomains3(c))) return [sql`(${identifier})::text`, TYPES.text];else return [identifier, c];
}
const resolve37 = (i, v) => sql`${i} NOT ILIKE ${v}`;
const resolveInput4 = input => `%${escapeLikeWildcards(input)}%`;
const resolve38 = (i, v) => sql`${i} LIKE ${v}`;
const resolveInput5 = input => `${escapeLikeWildcards(input)}%`;
const resolve39 = (i, v) => sql`${i} NOT LIKE ${v}`;
const resolveInput6 = input => `${escapeLikeWildcards(input)}%`;
const resolve40 = (i, v) => sql`${i} ILIKE ${v}`;
const resolveInput7 = input => `${escapeLikeWildcards(input)}%`;
const resolve41 = (i, v) => sql`${i} NOT ILIKE ${v}`;
const resolveInput8 = input => `${escapeLikeWildcards(input)}%`;
const resolve42 = (i, v) => sql`${i} LIKE ${v}`;
const resolveInput9 = input => `%${escapeLikeWildcards(input)}`;
const resolve43 = (i, v) => sql`${i} NOT LIKE ${v}`;
const resolveInput10 = input => `%${escapeLikeWildcards(input)}`;
const resolve44 = (i, v) => sql`${i} ILIKE ${v}`;
const resolveInput11 = input => `%${escapeLikeWildcards(input)}`;
const resolve45 = (i, v) => sql`${i} NOT ILIKE ${v}`;
const resolveInput12 = input => `%${escapeLikeWildcards(input)}`;
const resolve46 = (i, v) => sql`${i} LIKE ${v}`;
const resolve47 = (i, v) => sql`${i} NOT LIKE ${v}`;
const resolve48 = (i, v) => sql`${i} ILIKE ${v}`;
const resolve49 = (i, v) => sql`${i} NOT ILIKE ${v}`;
function resolveInputCodec11(inputCodec) {
  if ("equalTo" === "in" || "equalTo" === "notIn") {
    const t = resolveDomains3(inputCodec) === TYPES.citext ? inputCodec : TYPES.text;
    return listOfCodec(t, {
      extensions: {
        listItemNonNull: !0
      }
    });
  } else return resolveDomains3(inputCodec) === TYPES.citext ? inputCodec : TYPES.text;
}
function resolveSqlIdentifier5(sourceAlias, codec) {
  return resolveDomains3(codec) === TYPES.citext ? [sourceAlias, codec] : [sql`lower(${sourceAlias}::text)`, TYPES.text];
}
function resolveSqlValue4($placeholderable, $input, inputCodec) {
  if ("equalTo" === "in" || "equalTo" === "notIn") {
    const sqlList = $placeholderable.placeholder($input, inputCodec);
    if (inputCodec.arrayOfCodec === TYPES.citext) return sqlList;else return sql`(select lower(t) from unnest(${sqlList}) t)`;
  } else {
    const sqlValue = $placeholderable.placeholder($input, inputCodec);
    if (inputCodec === TYPES.citext) return sqlValue;else return sql`lower(${sqlValue})`;
  }
}
function resolveInputCodec12(inputCodec) {
  if ("notEqualTo" === "in" || "notEqualTo" === "notIn") {
    const t = resolveDomains3(inputCodec) === TYPES.citext ? inputCodec : TYPES.text;
    return listOfCodec(t, {
      extensions: {
        listItemNonNull: !0
      }
    });
  } else return resolveDomains3(inputCodec) === TYPES.citext ? inputCodec : TYPES.text;
}
function resolveSqlIdentifier6(sourceAlias, codec) {
  return resolveDomains3(codec) === TYPES.citext ? [sourceAlias, codec] : [sql`lower(${sourceAlias}::text)`, TYPES.text];
}
function resolveSqlValue5($placeholderable, $input, inputCodec) {
  if ("notEqualTo" === "in" || "notEqualTo" === "notIn") {
    const sqlList = $placeholderable.placeholder($input, inputCodec);
    if (inputCodec.arrayOfCodec === TYPES.citext) return sqlList;else return sql`(select lower(t) from unnest(${sqlList}) t)`;
  } else {
    const sqlValue = $placeholderable.placeholder($input, inputCodec);
    if (inputCodec === TYPES.citext) return sqlValue;else return sql`lower(${sqlValue})`;
  }
}
function resolveInputCodec13(inputCodec) {
  if ("distinctFrom" === "in" || "distinctFrom" === "notIn") {
    const t = resolveDomains3(inputCodec) === TYPES.citext ? inputCodec : TYPES.text;
    return listOfCodec(t, {
      extensions: {
        listItemNonNull: !0
      }
    });
  } else return resolveDomains3(inputCodec) === TYPES.citext ? inputCodec : TYPES.text;
}
function resolveSqlIdentifier7(sourceAlias, codec) {
  return resolveDomains3(codec) === TYPES.citext ? [sourceAlias, codec] : [sql`lower(${sourceAlias}::text)`, TYPES.text];
}
function resolveSqlValue6($placeholderable, $input, inputCodec) {
  if ("distinctFrom" === "in" || "distinctFrom" === "notIn") {
    const sqlList = $placeholderable.placeholder($input, inputCodec);
    if (inputCodec.arrayOfCodec === TYPES.citext) return sqlList;else return sql`(select lower(t) from unnest(${sqlList}) t)`;
  } else {
    const sqlValue = $placeholderable.placeholder($input, inputCodec);
    if (inputCodec === TYPES.citext) return sqlValue;else return sql`lower(${sqlValue})`;
  }
}
function resolveInputCodec14(inputCodec) {
  if ("notDistinctFrom" === "in" || "notDistinctFrom" === "notIn") {
    const t = resolveDomains3(inputCodec) === TYPES.citext ? inputCodec : TYPES.text;
    return listOfCodec(t, {
      extensions: {
        listItemNonNull: !0
      }
    });
  } else return resolveDomains3(inputCodec) === TYPES.citext ? inputCodec : TYPES.text;
}
function resolveSqlIdentifier8(sourceAlias, codec) {
  return resolveDomains3(codec) === TYPES.citext ? [sourceAlias, codec] : [sql`lower(${sourceAlias}::text)`, TYPES.text];
}
function resolveSqlValue7($placeholderable, $input, inputCodec) {
  if ("notDistinctFrom" === "in" || "notDistinctFrom" === "notIn") {
    const sqlList = $placeholderable.placeholder($input, inputCodec);
    if (inputCodec.arrayOfCodec === TYPES.citext) return sqlList;else return sql`(select lower(t) from unnest(${sqlList}) t)`;
  } else {
    const sqlValue = $placeholderable.placeholder($input, inputCodec);
    if (inputCodec === TYPES.citext) return sqlValue;else return sql`lower(${sqlValue})`;
  }
}
function resolveInputCodec15(inputCodec) {
  if ("in" === "in" || "in" === "notIn") {
    const t = resolveDomains3(inputCodec) === TYPES.citext ? inputCodec : TYPES.text;
    return listOfCodec(t, {
      extensions: {
        listItemNonNull: !0
      }
    });
  } else return resolveDomains3(inputCodec) === TYPES.citext ? inputCodec : TYPES.text;
}
function resolveSqlIdentifier9(sourceAlias, codec) {
  return resolveDomains3(codec) === TYPES.citext ? [sourceAlias, codec] : [sql`lower(${sourceAlias}::text)`, TYPES.text];
}
function resolveSqlValue8($placeholderable, $input, inputCodec) {
  if ("in" === "in" || "in" === "notIn") {
    const sqlList = $placeholderable.placeholder($input, inputCodec);
    if (inputCodec.arrayOfCodec === TYPES.citext) return sqlList;else return sql`(select lower(t) from unnest(${sqlList}) t)`;
  } else {
    const sqlValue = $placeholderable.placeholder($input, inputCodec);
    if (inputCodec === TYPES.citext) return sqlValue;else return sql`lower(${sqlValue})`;
  }
}
function resolveInputCodec16(inputCodec) {
  if ("notIn" === "in" || "notIn" === "notIn") {
    const t = resolveDomains3(inputCodec) === TYPES.citext ? inputCodec : TYPES.text;
    return listOfCodec(t, {
      extensions: {
        listItemNonNull: !0
      }
    });
  } else return resolveDomains3(inputCodec) === TYPES.citext ? inputCodec : TYPES.text;
}
function resolveSqlIdentifier10(sourceAlias, codec) {
  return resolveDomains3(codec) === TYPES.citext ? [sourceAlias, codec] : [sql`lower(${sourceAlias}::text)`, TYPES.text];
}
function resolveSqlValue9($placeholderable, $input, inputCodec) {
  if ("notIn" === "in" || "notIn" === "notIn") {
    const sqlList = $placeholderable.placeholder($input, inputCodec);
    if (inputCodec.arrayOfCodec === TYPES.citext) return sqlList;else return sql`(select lower(t) from unnest(${sqlList}) t)`;
  } else {
    const sqlValue = $placeholderable.placeholder($input, inputCodec);
    if (inputCodec === TYPES.citext) return sqlValue;else return sql`lower(${sqlValue})`;
  }
}
function resolveInputCodec17(inputCodec) {
  if ("lessThan" === "in" || "lessThan" === "notIn") {
    const t = resolveDomains3(inputCodec) === TYPES.citext ? inputCodec : TYPES.text;
    return listOfCodec(t, {
      extensions: {
        listItemNonNull: !0
      }
    });
  } else return resolveDomains3(inputCodec) === TYPES.citext ? inputCodec : TYPES.text;
}
function resolveSqlIdentifier11(sourceAlias, codec) {
  return resolveDomains3(codec) === TYPES.citext ? [sourceAlias, codec] : [sql`lower(${sourceAlias}::text)`, TYPES.text];
}
function resolveSqlValue10($placeholderable, $input, inputCodec) {
  if ("lessThan" === "in" || "lessThan" === "notIn") {
    const sqlList = $placeholderable.placeholder($input, inputCodec);
    if (inputCodec.arrayOfCodec === TYPES.citext) return sqlList;else return sql`(select lower(t) from unnest(${sqlList}) t)`;
  } else {
    const sqlValue = $placeholderable.placeholder($input, inputCodec);
    if (inputCodec === TYPES.citext) return sqlValue;else return sql`lower(${sqlValue})`;
  }
}
function resolveInputCodec18(inputCodec) {
  if ("lessThanOrEqualTo" === "in" || "lessThanOrEqualTo" === "notIn") {
    const t = resolveDomains3(inputCodec) === TYPES.citext ? inputCodec : TYPES.text;
    return listOfCodec(t, {
      extensions: {
        listItemNonNull: !0
      }
    });
  } else return resolveDomains3(inputCodec) === TYPES.citext ? inputCodec : TYPES.text;
}
function resolveSqlIdentifier12(sourceAlias, codec) {
  return resolveDomains3(codec) === TYPES.citext ? [sourceAlias, codec] : [sql`lower(${sourceAlias}::text)`, TYPES.text];
}
function resolveSqlValue11($placeholderable, $input, inputCodec) {
  if ("lessThanOrEqualTo" === "in" || "lessThanOrEqualTo" === "notIn") {
    const sqlList = $placeholderable.placeholder($input, inputCodec);
    if (inputCodec.arrayOfCodec === TYPES.citext) return sqlList;else return sql`(select lower(t) from unnest(${sqlList}) t)`;
  } else {
    const sqlValue = $placeholderable.placeholder($input, inputCodec);
    if (inputCodec === TYPES.citext) return sqlValue;else return sql`lower(${sqlValue})`;
  }
}
function resolveInputCodec19(inputCodec) {
  if ("greaterThan" === "in" || "greaterThan" === "notIn") {
    const t = resolveDomains3(inputCodec) === TYPES.citext ? inputCodec : TYPES.text;
    return listOfCodec(t, {
      extensions: {
        listItemNonNull: !0
      }
    });
  } else return resolveDomains3(inputCodec) === TYPES.citext ? inputCodec : TYPES.text;
}
function resolveSqlIdentifier13(sourceAlias, codec) {
  return resolveDomains3(codec) === TYPES.citext ? [sourceAlias, codec] : [sql`lower(${sourceAlias}::text)`, TYPES.text];
}
function resolveSqlValue12($placeholderable, $input, inputCodec) {
  if ("greaterThan" === "in" || "greaterThan" === "notIn") {
    const sqlList = $placeholderable.placeholder($input, inputCodec);
    if (inputCodec.arrayOfCodec === TYPES.citext) return sqlList;else return sql`(select lower(t) from unnest(${sqlList}) t)`;
  } else {
    const sqlValue = $placeholderable.placeholder($input, inputCodec);
    if (inputCodec === TYPES.citext) return sqlValue;else return sql`lower(${sqlValue})`;
  }
}
function resolveInputCodec20(inputCodec) {
  if ("greaterThanOrEqualTo" === "in" || "greaterThanOrEqualTo" === "notIn") {
    const t = resolveDomains3(inputCodec) === TYPES.citext ? inputCodec : TYPES.text;
    return listOfCodec(t, {
      extensions: {
        listItemNonNull: !0
      }
    });
  } else return resolveDomains3(inputCodec) === TYPES.citext ? inputCodec : TYPES.text;
}
function resolveSqlIdentifier14(sourceAlias, codec) {
  return resolveDomains3(codec) === TYPES.citext ? [sourceAlias, codec] : [sql`lower(${sourceAlias}::text)`, TYPES.text];
}
function resolveSqlValue13($placeholderable, $input, inputCodec) {
  if ("greaterThanOrEqualTo" === "in" || "greaterThanOrEqualTo" === "notIn") {
    const sqlList = $placeholderable.placeholder($input, inputCodec);
    if (inputCodec.arrayOfCodec === TYPES.citext) return sqlList;else return sql`(select lower(t) from unnest(${sqlList}) t)`;
  } else {
    const sqlValue = $placeholderable.placeholder($input, inputCodec);
    if (inputCodec === TYPES.citext) return sqlValue;else return sql`lower(${sqlValue})`;
  }
}
function OrganizationGroupBy_extensions_grafast_applyPlan($pgSelect) {
  $pgSelect.groupBy({
    fragment: sql.fragment`${$pgSelect.alias}.${sql.identifier("created_at")}`
  });
}
function OrganizationGroupBy_extensions_grafast_applyPlan2($pgSelect) {
  $pgSelect.groupBy({
    fragment: aggregateGroupBySpec.sqlWrap(sql`${$pgSelect.alias}.${sql.identifier("created_at")}`)
  });
}
function OrganizationGroupBy_extensions_grafast_applyPlan3($pgSelect) {
  $pgSelect.groupBy({
    fragment: aggregateGroupBySpec2.sqlWrap(sql`${$pgSelect.alias}.${sql.identifier("created_at")}`)
  });
}
function OrganizationGroupBy_extensions_grafast_applyPlan4($pgSelect) {
  $pgSelect.groupBy({
    fragment: sql.fragment`${$pgSelect.alias}.${sql.identifier("name")}`
  });
}
function OrganizationGroupBy_extensions_grafast_applyPlan5($pgSelect) {
  $pgSelect.groupBy({
    fragment: sql.fragment`${$pgSelect.alias}.${sql.identifier("description")}`
  });
}
function OrganizationGroupBy_extensions_grafast_applyPlan6($pgSelect) {
  $pgSelect.groupBy({
    fragment: sql.fragment`${$pgSelect.alias}.${sql.identifier("slug")}`
  });
}
function OrganizationGroupBy_extensions_grafast_applyPlan7($pgSelect) {
  $pgSelect.groupBy({
    fragment: sql.fragment`${$pgSelect.alias}.${sql.identifier("projects")}`
  });
}
export const OrganizationGroupBy = new GraphQLEnumType({
  name: "OrganizationGroupBy",
  description: "Grouping methods for `Organization` for usage during aggregation.",
  values: Object.assign(Object.create(null), {
    CREATED_AT: {
      value: "CREATED_AT",
      extensions: Object.assign(Object.create(null), {
        grafast: {
          applyPlan: OrganizationGroupBy_extensions_grafast_applyPlan
        }
      })
    },
    CREATED_AT_TRUNCATED_TO_HOUR: {
      value: "CREATED_AT_TRUNCATED_TO_HOUR",
      extensions: Object.assign(Object.create(null), {
        grafast: {
          applyPlan: OrganizationGroupBy_extensions_grafast_applyPlan2
        }
      })
    },
    CREATED_AT_TRUNCATED_TO_DAY: {
      value: "CREATED_AT_TRUNCATED_TO_DAY",
      extensions: Object.assign(Object.create(null), {
        grafast: {
          applyPlan: OrganizationGroupBy_extensions_grafast_applyPlan3
        }
      })
    },
    NAME: {
      value: "NAME",
      extensions: Object.assign(Object.create(null), {
        grafast: {
          applyPlan: OrganizationGroupBy_extensions_grafast_applyPlan4
        }
      })
    },
    DESCRIPTION: {
      value: "DESCRIPTION",
      extensions: Object.assign(Object.create(null), {
        grafast: {
          applyPlan: OrganizationGroupBy_extensions_grafast_applyPlan5
        }
      })
    },
    SLUG: {
      value: "SLUG",
      extensions: Object.assign(Object.create(null), {
        grafast: {
          applyPlan: OrganizationGroupBy_extensions_grafast_applyPlan6
        }
      })
    },
    PROJECTS: {
      value: "PROJECTS",
      extensions: Object.assign(Object.create(null), {
        grafast: {
          applyPlan: OrganizationGroupBy_extensions_grafast_applyPlan7
        }
      })
    }
  })
});
const colSpec8 = {
  attributeName: "id",
  attribute: spec_organization.attributes.id
};
const colSpec9 = {
  attributeName: "created_at",
  attribute: spec_organization.attributes.created_at
};
const colSpec10 = {
  attributeName: "name",
  attribute: spec_organization.attributes.name
};
const colSpec11 = {
  attributeName: "description",
  attribute: spec_organization.attributes.description
};
const colSpec12 = {
  attributeName: "slug",
  attribute: spec_organization.attributes.slug
};
const colSpec13 = {
  attributeName: "projects",
  attribute: spec_organization.attributes.projects
};
function assertAllowed8(fieldArgs, mode) {
  const $raw = fieldArgs.getRaw();
  if (mode === "object" && !false && "evalIsEmpty" in $raw && $raw.evalIsEmpty()) throw Object.assign(new Error("Empty objects are forbidden in filter argument input."), {});
  if (mode === "list" && !false && "evalLength" in $raw) {
    const l = $raw.evalLength();
    if (l != null) for (let i = 0; i < l; i++) {
      const $entry = $raw.at(i);
      if ("evalIsEmpty" in $entry && $entry.evalIsEmpty()) throw Object.assign(new Error("Empty objects are forbidden in filter argument input."), {});
    }
  }
  if (!false && $raw.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
}
function PostGroupBy_extensions_grafast_applyPlan($pgSelect) {
  $pgSelect.groupBy({
    fragment: sql.fragment`${$pgSelect.alias}.${sql.identifier("created_at")}`
  });
}
function PostGroupBy_extensions_grafast_applyPlan2($pgSelect) {
  $pgSelect.groupBy({
    fragment: aggregateGroupBySpec.sqlWrap(sql`${$pgSelect.alias}.${sql.identifier("created_at")}`)
  });
}
function PostGroupBy_extensions_grafast_applyPlan3($pgSelect) {
  $pgSelect.groupBy({
    fragment: aggregateGroupBySpec2.sqlWrap(sql`${$pgSelect.alias}.${sql.identifier("created_at")}`)
  });
}
function PostGroupBy_extensions_grafast_applyPlan4($pgSelect) {
  $pgSelect.groupBy({
    fragment: sql.fragment`${$pgSelect.alias}.${sql.identifier("title")}`
  });
}
function PostGroupBy_extensions_grafast_applyPlan5($pgSelect) {
  $pgSelect.groupBy({
    fragment: sql.fragment`${$pgSelect.alias}.${sql.identifier("body")}`
  });
}
function PostGroupBy_extensions_grafast_applyPlan6($pgSelect) {
  $pgSelect.groupBy({
    fragment: sql.fragment`${$pgSelect.alias}.${sql.identifier("author_id")}`
  });
}
function PostGroupBy_extensions_grafast_applyPlan7($pgSelect) {
  $pgSelect.groupBy({
    fragment: sql.fragment`${$pgSelect.alias}.${sql.identifier("project_id")}`
  });
}
export const PostGroupBy = new GraphQLEnumType({
  name: "PostGroupBy",
  description: "Grouping methods for `Post` for usage during aggregation.",
  values: Object.assign(Object.create(null), {
    CREATED_AT: {
      value: "CREATED_AT",
      extensions: Object.assign(Object.create(null), {
        grafast: {
          applyPlan: PostGroupBy_extensions_grafast_applyPlan
        }
      })
    },
    CREATED_AT_TRUNCATED_TO_HOUR: {
      value: "CREATED_AT_TRUNCATED_TO_HOUR",
      extensions: Object.assign(Object.create(null), {
        grafast: {
          applyPlan: PostGroupBy_extensions_grafast_applyPlan2
        }
      })
    },
    CREATED_AT_TRUNCATED_TO_DAY: {
      value: "CREATED_AT_TRUNCATED_TO_DAY",
      extensions: Object.assign(Object.create(null), {
        grafast: {
          applyPlan: PostGroupBy_extensions_grafast_applyPlan3
        }
      })
    },
    TITLE: {
      value: "TITLE",
      extensions: Object.assign(Object.create(null), {
        grafast: {
          applyPlan: PostGroupBy_extensions_grafast_applyPlan4
        }
      })
    },
    BODY: {
      value: "BODY",
      extensions: Object.assign(Object.create(null), {
        grafast: {
          applyPlan: PostGroupBy_extensions_grafast_applyPlan5
        }
      })
    },
    AUTHOR_ID: {
      value: "AUTHOR_ID",
      extensions: Object.assign(Object.create(null), {
        grafast: {
          applyPlan: PostGroupBy_extensions_grafast_applyPlan6
        }
      })
    },
    PROJECT_ID: {
      value: "PROJECT_ID",
      extensions: Object.assign(Object.create(null), {
        grafast: {
          applyPlan: PostGroupBy_extensions_grafast_applyPlan7
        }
      })
    }
  })
});
const colSpec14 = {
  attributeName: "id",
  attribute: spec_post.attributes.id
};
const colSpec15 = {
  attributeName: "created_at",
  attribute: spec_post.attributes.created_at
};
const colSpec16 = {
  attributeName: "title",
  attribute: spec_post.attributes.title
};
const colSpec17 = {
  attributeName: "body",
  attribute: spec_post.attributes.body
};
const colSpec18 = {
  attributeName: "author_id",
  attribute: spec_post.attributes.author_id
};
const colSpec19 = {
  attributeName: "project_id",
  attribute: spec_post.attributes.project_id
};
function assertAllowed9(fieldArgs, mode) {
  const $raw = fieldArgs.getRaw();
  if (mode === "object" && !false && "evalIsEmpty" in $raw && $raw.evalIsEmpty()) throw Object.assign(new Error("Empty objects are forbidden in filter argument input."), {});
  if (mode === "list" && !false && "evalLength" in $raw) {
    const l = $raw.evalLength();
    if (l != null) for (let i = 0; i < l; i++) {
      const $entry = $raw.at(i);
      if ("evalIsEmpty" in $entry && $entry.evalIsEmpty()) throw Object.assign(new Error("Empty objects are forbidden in filter argument input."), {});
    }
  }
  if (!false && $raw.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
}
function ProjectGroupBy_extensions_grafast_applyPlan($pgSelect) {
  $pgSelect.groupBy({
    fragment: sql.fragment`${$pgSelect.alias}.${sql.identifier("created_at")}`
  });
}
function ProjectGroupBy_extensions_grafast_applyPlan2($pgSelect) {
  $pgSelect.groupBy({
    fragment: aggregateGroupBySpec.sqlWrap(sql`${$pgSelect.alias}.${sql.identifier("created_at")}`)
  });
}
function ProjectGroupBy_extensions_grafast_applyPlan3($pgSelect) {
  $pgSelect.groupBy({
    fragment: aggregateGroupBySpec2.sqlWrap(sql`${$pgSelect.alias}.${sql.identifier("created_at")}`)
  });
}
function ProjectGroupBy_extensions_grafast_applyPlan4($pgSelect) {
  $pgSelect.groupBy({
    fragment: sql.fragment`${$pgSelect.alias}.${sql.identifier("name")}`
  });
}
function ProjectGroupBy_extensions_grafast_applyPlan5($pgSelect) {
  $pgSelect.groupBy({
    fragment: sql.fragment`${$pgSelect.alias}.${sql.identifier("description")}`
  });
}
function ProjectGroupBy_extensions_grafast_applyPlan6($pgSelect) {
  $pgSelect.groupBy({
    fragment: sql.fragment`${$pgSelect.alias}.${sql.identifier("slug")}`
  });
}
function ProjectGroupBy_extensions_grafast_applyPlan7($pgSelect) {
  $pgSelect.groupBy({
    fragment: sql.fragment`${$pgSelect.alias}.${sql.identifier("image")}`
  });
}
function ProjectGroupBy_extensions_grafast_applyPlan8($pgSelect) {
  $pgSelect.groupBy({
    fragment: sql.fragment`${$pgSelect.alias}.${sql.identifier("organization_id")}`
  });
}
export const ProjectGroupBy = new GraphQLEnumType({
  name: "ProjectGroupBy",
  description: "Grouping methods for `Project` for usage during aggregation.",
  values: Object.assign(Object.create(null), {
    CREATED_AT: {
      value: "CREATED_AT",
      extensions: Object.assign(Object.create(null), {
        grafast: {
          applyPlan: ProjectGroupBy_extensions_grafast_applyPlan
        }
      })
    },
    CREATED_AT_TRUNCATED_TO_HOUR: {
      value: "CREATED_AT_TRUNCATED_TO_HOUR",
      extensions: Object.assign(Object.create(null), {
        grafast: {
          applyPlan: ProjectGroupBy_extensions_grafast_applyPlan2
        }
      })
    },
    CREATED_AT_TRUNCATED_TO_DAY: {
      value: "CREATED_AT_TRUNCATED_TO_DAY",
      extensions: Object.assign(Object.create(null), {
        grafast: {
          applyPlan: ProjectGroupBy_extensions_grafast_applyPlan3
        }
      })
    },
    NAME: {
      value: "NAME",
      extensions: Object.assign(Object.create(null), {
        grafast: {
          applyPlan: ProjectGroupBy_extensions_grafast_applyPlan4
        }
      })
    },
    DESCRIPTION: {
      value: "DESCRIPTION",
      extensions: Object.assign(Object.create(null), {
        grafast: {
          applyPlan: ProjectGroupBy_extensions_grafast_applyPlan5
        }
      })
    },
    SLUG: {
      value: "SLUG",
      extensions: Object.assign(Object.create(null), {
        grafast: {
          applyPlan: ProjectGroupBy_extensions_grafast_applyPlan6
        }
      })
    },
    IMAGE: {
      value: "IMAGE",
      extensions: Object.assign(Object.create(null), {
        grafast: {
          applyPlan: ProjectGroupBy_extensions_grafast_applyPlan7
        }
      })
    },
    ORGANIZATION_ID: {
      value: "ORGANIZATION_ID",
      extensions: Object.assign(Object.create(null), {
        grafast: {
          applyPlan: ProjectGroupBy_extensions_grafast_applyPlan8
        }
      })
    }
  })
});
const colSpec20 = {
  attributeName: "id",
  attribute: spec_project.attributes.id
};
const colSpec21 = {
  attributeName: "created_at",
  attribute: spec_project.attributes.created_at
};
const colSpec22 = {
  attributeName: "name",
  attribute: spec_project.attributes.name
};
const colSpec23 = {
  attributeName: "description",
  attribute: spec_project.attributes.description
};
const colSpec24 = {
  attributeName: "slug",
  attribute: spec_project.attributes.slug
};
const colSpec25 = {
  attributeName: "image",
  attribute: spec_project.attributes.image
};
const colSpec26 = {
  attributeName: "organization_id",
  attribute: spec_project.attributes.organization_id
};
function assertAllowed10(fieldArgs, mode) {
  const $raw = fieldArgs.getRaw();
  if (mode === "object" && !false && "evalIsEmpty" in $raw && $raw.evalIsEmpty()) throw Object.assign(new Error("Empty objects are forbidden in filter argument input."), {});
  if (mode === "list" && !false && "evalLength" in $raw) {
    const l = $raw.evalLength();
    if (l != null) for (let i = 0; i < l; i++) {
      const $entry = $raw.at(i);
      if ("evalIsEmpty" in $entry && $entry.evalIsEmpty()) throw Object.assign(new Error("Empty objects are forbidden in filter argument input."), {});
    }
  }
  if (!false && $raw.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
}
const specFromArgs = args => {
  const $nodeId = args.get(["input", "id"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Upvote, $nodeId);
};
const specFromArgs2 = args => {
  const $nodeId = args.get(["input", "id"]);
  return specFromNodeId(nodeIdHandlerByTypeName.User, $nodeId);
};
const specFromArgs3 = args => {
  const $nodeId = args.get(["input", "id"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Organization, $nodeId);
};
const specFromArgs4 = args => {
  const $nodeId = args.get(["input", "id"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Post, $nodeId);
};
const specFromArgs5 = args => {
  const $nodeId = args.get(["input", "id"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Project, $nodeId);
};
const specFromArgs6 = args => {
  const $nodeId = args.get(["input", "id"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Upvote, $nodeId);
};
const specFromArgs7 = args => {
  const $nodeId = args.get(["input", "id"]);
  return specFromNodeId(nodeIdHandlerByTypeName.User, $nodeId);
};
const specFromArgs8 = args => {
  const $nodeId = args.get(["input", "id"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Organization, $nodeId);
};
const specFromArgs9 = args => {
  const $nodeId = args.get(["input", "id"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Post, $nodeId);
};
const specFromArgs10 = args => {
  const $nodeId = args.get(["input", "id"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Project, $nodeId);
};
export const typeDefs = /* GraphQL */`"""The root query type which gives access points into the data universe."""
type Query implements Node {
  """
  Exposes the root query type nested one level down. This is helpful for Relay 1
  which can only query top level fields if they are in a particular form.
  """
  query: Query!

  """
  The root query type must be a \`Node\` to work well with Relay 1 mutations. This just resolves to \`query\`.
  """
  id: ID!

  """Fetches an object given its globally unique \`ID\`."""
  node(
    """The globally unique \`ID\`."""
    id: ID!
  ): Node

  """Get a single \`Upvote\`."""
  upvote(rowId: Int!): Upvote

  """Get a single \`User\`."""
  user(rowId: Int!): User

  """Get a single \`Organization\`."""
  organization(rowId: Int!): Organization

  """Get a single \`Post\`."""
  post(rowId: Int!): Post

  """Get a single \`Project\`."""
  project(rowId: Int!): Project

  """Reads a single \`Upvote\` using its globally unique \`ID\`."""
  upvoteById(
    """The globally unique \`ID\` to be used in selecting a single \`Upvote\`."""
    id: ID!
  ): Upvote

  """Reads a single \`User\` using its globally unique \`ID\`."""
  userById(
    """The globally unique \`ID\` to be used in selecting a single \`User\`."""
    id: ID!
  ): User

  """Reads a single \`Organization\` using its globally unique \`ID\`."""
  organizationById(
    """
    The globally unique \`ID\` to be used in selecting a single \`Organization\`.
    """
    id: ID!
  ): Organization

  """Reads a single \`Post\` using its globally unique \`ID\`."""
  postById(
    """The globally unique \`ID\` to be used in selecting a single \`Post\`."""
    id: ID!
  ): Post

  """Reads a single \`Project\` using its globally unique \`ID\`."""
  projectById(
    """The globally unique \`ID\` to be used in selecting a single \`Project\`."""
    id: ID!
  ): Project

  """Reads and enables pagination through a set of \`Upvote\`."""
  upvotes(
    """Only read the first \`n\` values of the set."""
    first: Int

    """Only read the last \`n\` values of the set."""
    last: Int

    """
    Skip the first \`n\` values from our \`after\` cursor, an alternative to cursor
    based pagination. May not be used with \`last\`.
    """
    offset: Int

    """Read all values in the set before (above) this cursor."""
    before: Cursor

    """Read all values in the set after (below) this cursor."""
    after: Cursor

    """The method to use when ordering \`Upvote\`."""
    orderBy: [UpvoteOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: UpvoteCondition

    """
    A filter to be used in determining which values should be returned by the collection.
    """
    filter: UpvoteFilter
  ): UpvoteConnection

  """Reads and enables pagination through a set of \`User\`."""
  users(
    """Only read the first \`n\` values of the set."""
    first: Int

    """Only read the last \`n\` values of the set."""
    last: Int

    """
    Skip the first \`n\` values from our \`after\` cursor, an alternative to cursor
    based pagination. May not be used with \`last\`.
    """
    offset: Int

    """Read all values in the set before (above) this cursor."""
    before: Cursor

    """Read all values in the set after (below) this cursor."""
    after: Cursor

    """The method to use when ordering \`User\`."""
    orderBy: [UserOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: UserCondition

    """
    A filter to be used in determining which values should be returned by the collection.
    """
    filter: UserFilter
  ): UserConnection

  """Reads and enables pagination through a set of \`Organization\`."""
  organizations(
    """Only read the first \`n\` values of the set."""
    first: Int

    """Only read the last \`n\` values of the set."""
    last: Int

    """
    Skip the first \`n\` values from our \`after\` cursor, an alternative to cursor
    based pagination. May not be used with \`last\`.
    """
    offset: Int

    """Read all values in the set before (above) this cursor."""
    before: Cursor

    """Read all values in the set after (below) this cursor."""
    after: Cursor

    """The method to use when ordering \`Organization\`."""
    orderBy: [OrganizationOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: OrganizationCondition

    """
    A filter to be used in determining which values should be returned by the collection.
    """
    filter: OrganizationFilter
  ): OrganizationConnection

  """Reads and enables pagination through a set of \`Post\`."""
  posts(
    """Only read the first \`n\` values of the set."""
    first: Int

    """Only read the last \`n\` values of the set."""
    last: Int

    """
    Skip the first \`n\` values from our \`after\` cursor, an alternative to cursor
    based pagination. May not be used with \`last\`.
    """
    offset: Int

    """Read all values in the set before (above) this cursor."""
    before: Cursor

    """Read all values in the set after (below) this cursor."""
    after: Cursor

    """The method to use when ordering \`Post\`."""
    orderBy: [PostOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: PostCondition

    """
    A filter to be used in determining which values should be returned by the collection.
    """
    filter: PostFilter
  ): PostConnection

  """Reads and enables pagination through a set of \`Project\`."""
  projects(
    """Only read the first \`n\` values of the set."""
    first: Int

    """Only read the last \`n\` values of the set."""
    last: Int

    """
    Skip the first \`n\` values from our \`after\` cursor, an alternative to cursor
    based pagination. May not be used with \`last\`.
    """
    offset: Int

    """Read all values in the set before (above) this cursor."""
    before: Cursor

    """Read all values in the set after (below) this cursor."""
    after: Cursor

    """The method to use when ordering \`Project\`."""
    orderBy: [ProjectOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: ProjectCondition

    """
    A filter to be used in determining which values should be returned by the collection.
    """
    filter: ProjectFilter
  ): ProjectConnection
}

"""An object with a globally unique \`ID\`."""
interface Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  id: ID!
}

type Upvote implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  id: ID!
  rowId: Int!
  createdAt: Datetime
}

"""
A point in time as described by the [ISO
8601](https://en.wikipedia.org/wiki/ISO_8601) and, if it has a timezone, [RFC
3339](https://datatracker.ietf.org/doc/html/rfc3339) standards. Input values
that do not conform to both ISO 8601 and RFC 3339 may be coerced, which may lead
to unexpected results.
"""
scalar Datetime

type User implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  id: ID!
  rowId: Int!
  createdAt: Datetime
  walletAddress: String!
  posts: String
  upvotes: String
}

type Organization implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  id: ID!
  rowId: Int!
  createdAt: Datetime
  name: String
  description: String
  slug: String
  projects: String
}

type Post implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  id: ID!
  rowId: Int!
  createdAt: Datetime
  title: String
  body: String
  authorId: Int!
  projectId: Int!
}

type Project implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  id: ID!
  rowId: Int!
  createdAt: Datetime
  name: String
  description: String
  slug: String
  image: String
  organizationId: Int!
}

"""A connection to a list of \`Upvote\` values."""
type UpvoteConnection {
  """A list of \`Upvote\` objects."""
  nodes: [Upvote]!

  """
  A list of edges which contains the \`Upvote\` and cursor to aid in pagination.
  """
  edges: [UpvoteEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`Upvote\` you could get from the connection."""
  totalCount: Int!

  """
  Aggregates across the matching connection (ignoring before/after/first/last/offset)
  """
  aggregates: UpvoteAggregates

  """
  Grouped aggregates across the matching connection (ignoring before/after/first/last/offset)
  """
  groupedAggregates(
    """The method to use when grouping \`Upvote\` for these aggregates."""
    groupBy: [UpvoteGroupBy!]!

    """Conditions on the grouped aggregates."""
    having: UpvoteHavingInput
  ): [UpvoteAggregates!]
}

"""A \`Upvote\` edge in the connection."""
type UpvoteEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`Upvote\` at the end of the edge."""
  node: Upvote
}

"""A location in a connection that can be used for resuming pagination."""
scalar Cursor

"""Information about pagination in a connection."""
type PageInfo {
  """When paginating forwards, are there more items?"""
  hasNextPage: Boolean!

  """When paginating backwards, are there more items?"""
  hasPreviousPage: Boolean!

  """When paginating backwards, the cursor to continue."""
  startCursor: Cursor

  """When paginating forwards, the cursor to continue."""
  endCursor: Cursor
}

type UpvoteAggregates {
  keys: [String]

  """
  Sum aggregates across the matching connection (ignoring before/after/first/last/offset)
  """
  sum: UpvoteSumAggregates

  """
  Distinct count aggregates across the matching connection (ignoring before/after/first/last/offset)
  """
  distinctCount: UpvoteDistinctCountAggregates

  """
  Minimum aggregates across the matching connection (ignoring before/after/first/last/offset)
  """
  min: UpvoteMinAggregates

  """
  Maximum aggregates across the matching connection (ignoring before/after/first/last/offset)
  """
  max: UpvoteMaxAggregates

  """
  Mean average aggregates across the matching connection (ignoring before/after/first/last/offset)
  """
  average: UpvoteAverageAggregates

  """
  Sample standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset)
  """
  stddevSample: UpvoteStddevSampleAggregates

  """
  Population standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset)
  """
  stddevPopulation: UpvoteStddevPopulationAggregates

  """
  Sample variance aggregates across the matching connection (ignoring before/after/first/last/offset)
  """
  varianceSample: UpvoteVarianceSampleAggregates

  """
  Population variance aggregates across the matching connection (ignoring before/after/first/last/offset)
  """
  variancePopulation: UpvoteVariancePopulationAggregates
}

type UpvoteSumAggregates {
  """Sum of rowId across the matching connection"""
  rowId: BigInt!
}

"""
A signed eight-byte integer. The upper big integer values are greater than the
max value for a JavaScript number. Therefore all big integers will be output as
strings and not numbers.
"""
scalar BigInt

type UpvoteDistinctCountAggregates {
  """Distinct count of rowId across the matching connection"""
  rowId: BigInt

  """Distinct count of createdAt across the matching connection"""
  createdAt: BigInt
}

type UpvoteMinAggregates {
  """Minimum of rowId across the matching connection"""
  rowId: Int
}

type UpvoteMaxAggregates {
  """Maximum of rowId across the matching connection"""
  rowId: Int
}

type UpvoteAverageAggregates {
  """Mean average of rowId across the matching connection"""
  rowId: BigFloat
}

"""
A floating point number that requires more precision than IEEE 754 binary 64
"""
scalar BigFloat

type UpvoteStddevSampleAggregates {
  """Sample standard deviation of rowId across the matching connection"""
  rowId: BigFloat
}

type UpvoteStddevPopulationAggregates {
  """Population standard deviation of rowId across the matching connection"""
  rowId: BigFloat
}

type UpvoteVarianceSampleAggregates {
  """Sample variance of rowId across the matching connection"""
  rowId: BigFloat
}

type UpvoteVariancePopulationAggregates {
  """Population variance of rowId across the matching connection"""
  rowId: BigFloat
}

"""Grouping methods for \`Upvote\` for usage during aggregation."""
enum UpvoteGroupBy {
  CREATED_AT
  CREATED_AT_TRUNCATED_TO_HOUR
  CREATED_AT_TRUNCATED_TO_DAY
}

"""Conditions for \`Upvote\` aggregates."""
input UpvoteHavingInput {
  AND: [UpvoteHavingInput!]
  OR: [UpvoteHavingInput!]
  sum: UpvoteHavingSumInput
  distinctCount: UpvoteHavingDistinctCountInput
  min: UpvoteHavingMinInput
  max: UpvoteHavingMaxInput
  average: UpvoteHavingAverageInput
  stddevSample: UpvoteHavingStddevSampleInput
  stddevPopulation: UpvoteHavingStddevPopulationInput
  varianceSample: UpvoteHavingVarianceSampleInput
  variancePopulation: UpvoteHavingVariancePopulationInput
}

input UpvoteHavingSumInput {
  rowId: HavingIntFilter
  createdAt: HavingDatetimeFilter
}

input HavingIntFilter {
  equalTo: Int
  notEqualTo: Int
  greaterThan: Int
  greaterThanOrEqualTo: Int
  lessThan: Int
  lessThanOrEqualTo: Int
}

input HavingDatetimeFilter {
  equalTo: Datetime
  notEqualTo: Datetime
  greaterThan: Datetime
  greaterThanOrEqualTo: Datetime
  lessThan: Datetime
  lessThanOrEqualTo: Datetime
}

input UpvoteHavingDistinctCountInput {
  rowId: HavingIntFilter
  createdAt: HavingDatetimeFilter
}

input UpvoteHavingMinInput {
  rowId: HavingIntFilter
  createdAt: HavingDatetimeFilter
}

input UpvoteHavingMaxInput {
  rowId: HavingIntFilter
  createdAt: HavingDatetimeFilter
}

input UpvoteHavingAverageInput {
  rowId: HavingIntFilter
  createdAt: HavingDatetimeFilter
}

input UpvoteHavingStddevSampleInput {
  rowId: HavingIntFilter
  createdAt: HavingDatetimeFilter
}

input UpvoteHavingStddevPopulationInput {
  rowId: HavingIntFilter
  createdAt: HavingDatetimeFilter
}

input UpvoteHavingVarianceSampleInput {
  rowId: HavingIntFilter
  createdAt: HavingDatetimeFilter
}

input UpvoteHavingVariancePopulationInput {
  rowId: HavingIntFilter
  createdAt: HavingDatetimeFilter
}

"""Methods to use when ordering \`Upvote\`."""
enum UpvoteOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ID_ASC
  ID_DESC
  CREATED_AT_ASC
  CREATED_AT_DESC
}

"""
A condition to be used against \`Upvote\` object types. All fields are tested for equality and combined with a logical ‘and.’
"""
input UpvoteCondition {
  """Checks for equality with the object’s \`rowId\` field."""
  rowId: Int

  """Checks for equality with the object’s \`createdAt\` field."""
  createdAt: Datetime
}

"""
A filter to be used against \`Upvote\` object types. All fields are combined with a logical ‘and.’
"""
input UpvoteFilter {
  """Filter by the object’s \`rowId\` field."""
  rowId: IntFilter

  """Filter by the object’s \`createdAt\` field."""
  createdAt: DatetimeFilter

  """Checks for all expressions in this list."""
  and: [UpvoteFilter!]

  """Checks for any expressions in this list."""
  or: [UpvoteFilter!]

  """Negates the expression."""
  not: UpvoteFilter
}

"""
A filter to be used against Int fields. All fields are combined with a logical ‘and.’
"""
input IntFilter {
  """
  Is null (if \`true\` is specified) or is not null (if \`false\` is specified).
  """
  isNull: Boolean

  """Equal to the specified value."""
  equalTo: Int

  """Not equal to the specified value."""
  notEqualTo: Int

  """
  Not equal to the specified value, treating null like an ordinary value.
  """
  distinctFrom: Int

  """Equal to the specified value, treating null like an ordinary value."""
  notDistinctFrom: Int

  """Included in the specified list."""
  in: [Int!]

  """Not included in the specified list."""
  notIn: [Int!]

  """Less than the specified value."""
  lessThan: Int

  """Less than or equal to the specified value."""
  lessThanOrEqualTo: Int

  """Greater than the specified value."""
  greaterThan: Int

  """Greater than or equal to the specified value."""
  greaterThanOrEqualTo: Int
}

"""
A filter to be used against Datetime fields. All fields are combined with a logical ‘and.’
"""
input DatetimeFilter {
  """
  Is null (if \`true\` is specified) or is not null (if \`false\` is specified).
  """
  isNull: Boolean

  """Equal to the specified value."""
  equalTo: Datetime

  """Not equal to the specified value."""
  notEqualTo: Datetime

  """
  Not equal to the specified value, treating null like an ordinary value.
  """
  distinctFrom: Datetime

  """Equal to the specified value, treating null like an ordinary value."""
  notDistinctFrom: Datetime

  """Included in the specified list."""
  in: [Datetime!]

  """Not included in the specified list."""
  notIn: [Datetime!]

  """Less than the specified value."""
  lessThan: Datetime

  """Less than or equal to the specified value."""
  lessThanOrEqualTo: Datetime

  """Greater than the specified value."""
  greaterThan: Datetime

  """Greater than or equal to the specified value."""
  greaterThanOrEqualTo: Datetime
}

"""A connection to a list of \`User\` values."""
type UserConnection {
  """A list of \`User\` objects."""
  nodes: [User]!

  """
  A list of edges which contains the \`User\` and cursor to aid in pagination.
  """
  edges: [UserEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`User\` you could get from the connection."""
  totalCount: Int!

  """
  Aggregates across the matching connection (ignoring before/after/first/last/offset)
  """
  aggregates: UserAggregates

  """
  Grouped aggregates across the matching connection (ignoring before/after/first/last/offset)
  """
  groupedAggregates(
    """The method to use when grouping \`User\` for these aggregates."""
    groupBy: [UserGroupBy!]!

    """Conditions on the grouped aggregates."""
    having: UserHavingInput
  ): [UserAggregates!]
}

"""A \`User\` edge in the connection."""
type UserEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`User\` at the end of the edge."""
  node: User
}

type UserAggregates {
  keys: [String]

  """
  Sum aggregates across the matching connection (ignoring before/after/first/last/offset)
  """
  sum: UserSumAggregates

  """
  Distinct count aggregates across the matching connection (ignoring before/after/first/last/offset)
  """
  distinctCount: UserDistinctCountAggregates

  """
  Minimum aggregates across the matching connection (ignoring before/after/first/last/offset)
  """
  min: UserMinAggregates

  """
  Maximum aggregates across the matching connection (ignoring before/after/first/last/offset)
  """
  max: UserMaxAggregates

  """
  Mean average aggregates across the matching connection (ignoring before/after/first/last/offset)
  """
  average: UserAverageAggregates

  """
  Sample standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset)
  """
  stddevSample: UserStddevSampleAggregates

  """
  Population standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset)
  """
  stddevPopulation: UserStddevPopulationAggregates

  """
  Sample variance aggregates across the matching connection (ignoring before/after/first/last/offset)
  """
  varianceSample: UserVarianceSampleAggregates

  """
  Population variance aggregates across the matching connection (ignoring before/after/first/last/offset)
  """
  variancePopulation: UserVariancePopulationAggregates
}

type UserSumAggregates {
  """Sum of rowId across the matching connection"""
  rowId: BigInt!
}

type UserDistinctCountAggregates {
  """Distinct count of rowId across the matching connection"""
  rowId: BigInt

  """Distinct count of createdAt across the matching connection"""
  createdAt: BigInt

  """Distinct count of walletAddress across the matching connection"""
  walletAddress: BigInt

  """Distinct count of posts across the matching connection"""
  posts: BigInt

  """Distinct count of upvotes across the matching connection"""
  upvotes: BigInt
}

type UserMinAggregates {
  """Minimum of rowId across the matching connection"""
  rowId: Int
}

type UserMaxAggregates {
  """Maximum of rowId across the matching connection"""
  rowId: Int
}

type UserAverageAggregates {
  """Mean average of rowId across the matching connection"""
  rowId: BigFloat
}

type UserStddevSampleAggregates {
  """Sample standard deviation of rowId across the matching connection"""
  rowId: BigFloat
}

type UserStddevPopulationAggregates {
  """Population standard deviation of rowId across the matching connection"""
  rowId: BigFloat
}

type UserVarianceSampleAggregates {
  """Sample variance of rowId across the matching connection"""
  rowId: BigFloat
}

type UserVariancePopulationAggregates {
  """Population variance of rowId across the matching connection"""
  rowId: BigFloat
}

"""Grouping methods for \`User\` for usage during aggregation."""
enum UserGroupBy {
  CREATED_AT
  CREATED_AT_TRUNCATED_TO_HOUR
  CREATED_AT_TRUNCATED_TO_DAY
  WALLET_ADDRESS
  POSTS
  UPVOTES
}

"""Conditions for \`User\` aggregates."""
input UserHavingInput {
  AND: [UserHavingInput!]
  OR: [UserHavingInput!]
  sum: UserHavingSumInput
  distinctCount: UserHavingDistinctCountInput
  min: UserHavingMinInput
  max: UserHavingMaxInput
  average: UserHavingAverageInput
  stddevSample: UserHavingStddevSampleInput
  stddevPopulation: UserHavingStddevPopulationInput
  varianceSample: UserHavingVarianceSampleInput
  variancePopulation: UserHavingVariancePopulationInput
}

input UserHavingSumInput {
  rowId: HavingIntFilter
  createdAt: HavingDatetimeFilter
}

input UserHavingDistinctCountInput {
  rowId: HavingIntFilter
  createdAt: HavingDatetimeFilter
}

input UserHavingMinInput {
  rowId: HavingIntFilter
  createdAt: HavingDatetimeFilter
}

input UserHavingMaxInput {
  rowId: HavingIntFilter
  createdAt: HavingDatetimeFilter
}

input UserHavingAverageInput {
  rowId: HavingIntFilter
  createdAt: HavingDatetimeFilter
}

input UserHavingStddevSampleInput {
  rowId: HavingIntFilter
  createdAt: HavingDatetimeFilter
}

input UserHavingStddevPopulationInput {
  rowId: HavingIntFilter
  createdAt: HavingDatetimeFilter
}

input UserHavingVarianceSampleInput {
  rowId: HavingIntFilter
  createdAt: HavingDatetimeFilter
}

input UserHavingVariancePopulationInput {
  rowId: HavingIntFilter
  createdAt: HavingDatetimeFilter
}

"""Methods to use when ordering \`User\`."""
enum UserOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ID_ASC
  ID_DESC
  CREATED_AT_ASC
  CREATED_AT_DESC
  WALLET_ADDRESS_ASC
  WALLET_ADDRESS_DESC
  POSTS_ASC
  POSTS_DESC
  UPVOTES_ASC
  UPVOTES_DESC
}

"""
A condition to be used against \`User\` object types. All fields are tested for equality and combined with a logical ‘and.’
"""
input UserCondition {
  """Checks for equality with the object’s \`rowId\` field."""
  rowId: Int

  """Checks for equality with the object’s \`createdAt\` field."""
  createdAt: Datetime

  """Checks for equality with the object’s \`walletAddress\` field."""
  walletAddress: String

  """Checks for equality with the object’s \`posts\` field."""
  posts: String

  """Checks for equality with the object’s \`upvotes\` field."""
  upvotes: String
}

"""
A filter to be used against \`User\` object types. All fields are combined with a logical ‘and.’
"""
input UserFilter {
  """Filter by the object’s \`rowId\` field."""
  rowId: IntFilter

  """Filter by the object’s \`createdAt\` field."""
  createdAt: DatetimeFilter

  """Filter by the object’s \`walletAddress\` field."""
  walletAddress: StringFilter

  """Filter by the object’s \`posts\` field."""
  posts: StringFilter

  """Filter by the object’s \`upvotes\` field."""
  upvotes: StringFilter

  """Checks for all expressions in this list."""
  and: [UserFilter!]

  """Checks for any expressions in this list."""
  or: [UserFilter!]

  """Negates the expression."""
  not: UserFilter
}

"""
A filter to be used against String fields. All fields are combined with a logical ‘and.’
"""
input StringFilter {
  """
  Is null (if \`true\` is specified) or is not null (if \`false\` is specified).
  """
  isNull: Boolean

  """Equal to the specified value."""
  equalTo: String

  """Not equal to the specified value."""
  notEqualTo: String

  """
  Not equal to the specified value, treating null like an ordinary value.
  """
  distinctFrom: String

  """Equal to the specified value, treating null like an ordinary value."""
  notDistinctFrom: String

  """Included in the specified list."""
  in: [String!]

  """Not included in the specified list."""
  notIn: [String!]

  """Less than the specified value."""
  lessThan: String

  """Less than or equal to the specified value."""
  lessThanOrEqualTo: String

  """Greater than the specified value."""
  greaterThan: String

  """Greater than or equal to the specified value."""
  greaterThanOrEqualTo: String

  """Contains the specified string (case-sensitive)."""
  includes: String

  """Does not contain the specified string (case-sensitive)."""
  notIncludes: String

  """Contains the specified string (case-insensitive)."""
  includesInsensitive: String

  """Does not contain the specified string (case-insensitive)."""
  notIncludesInsensitive: String

  """Starts with the specified string (case-sensitive)."""
  startsWith: String

  """Does not start with the specified string (case-sensitive)."""
  notStartsWith: String

  """Starts with the specified string (case-insensitive)."""
  startsWithInsensitive: String

  """Does not start with the specified string (case-insensitive)."""
  notStartsWithInsensitive: String

  """Ends with the specified string (case-sensitive)."""
  endsWith: String

  """Does not end with the specified string (case-sensitive)."""
  notEndsWith: String

  """Ends with the specified string (case-insensitive)."""
  endsWithInsensitive: String

  """Does not end with the specified string (case-insensitive)."""
  notEndsWithInsensitive: String

  """
  Matches the specified pattern (case-sensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters.
  """
  like: String

  """
  Does not match the specified pattern (case-sensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters.
  """
  notLike: String

  """
  Matches the specified pattern (case-insensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters.
  """
  likeInsensitive: String

  """
  Does not match the specified pattern (case-insensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters.
  """
  notLikeInsensitive: String

  """Equal to the specified value (case-insensitive)."""
  equalToInsensitive: String

  """Not equal to the specified value (case-insensitive)."""
  notEqualToInsensitive: String

  """
  Not equal to the specified value, treating null like an ordinary value (case-insensitive).
  """
  distinctFromInsensitive: String

  """
  Equal to the specified value, treating null like an ordinary value (case-insensitive).
  """
  notDistinctFromInsensitive: String

  """Included in the specified list (case-insensitive)."""
  inInsensitive: [String!]

  """Not included in the specified list (case-insensitive)."""
  notInInsensitive: [String!]

  """Less than the specified value (case-insensitive)."""
  lessThanInsensitive: String

  """Less than or equal to the specified value (case-insensitive)."""
  lessThanOrEqualToInsensitive: String

  """Greater than the specified value (case-insensitive)."""
  greaterThanInsensitive: String

  """Greater than or equal to the specified value (case-insensitive)."""
  greaterThanOrEqualToInsensitive: String
}

"""A connection to a list of \`Organization\` values."""
type OrganizationConnection {
  """A list of \`Organization\` objects."""
  nodes: [Organization]!

  """
  A list of edges which contains the \`Organization\` and cursor to aid in pagination.
  """
  edges: [OrganizationEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`Organization\` you could get from the connection."""
  totalCount: Int!

  """
  Aggregates across the matching connection (ignoring before/after/first/last/offset)
  """
  aggregates: OrganizationAggregates

  """
  Grouped aggregates across the matching connection (ignoring before/after/first/last/offset)
  """
  groupedAggregates(
    """The method to use when grouping \`Organization\` for these aggregates."""
    groupBy: [OrganizationGroupBy!]!

    """Conditions on the grouped aggregates."""
    having: OrganizationHavingInput
  ): [OrganizationAggregates!]
}

"""A \`Organization\` edge in the connection."""
type OrganizationEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`Organization\` at the end of the edge."""
  node: Organization
}

type OrganizationAggregates {
  keys: [String]

  """
  Sum aggregates across the matching connection (ignoring before/after/first/last/offset)
  """
  sum: OrganizationSumAggregates

  """
  Distinct count aggregates across the matching connection (ignoring before/after/first/last/offset)
  """
  distinctCount: OrganizationDistinctCountAggregates

  """
  Minimum aggregates across the matching connection (ignoring before/after/first/last/offset)
  """
  min: OrganizationMinAggregates

  """
  Maximum aggregates across the matching connection (ignoring before/after/first/last/offset)
  """
  max: OrganizationMaxAggregates

  """
  Mean average aggregates across the matching connection (ignoring before/after/first/last/offset)
  """
  average: OrganizationAverageAggregates

  """
  Sample standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset)
  """
  stddevSample: OrganizationStddevSampleAggregates

  """
  Population standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset)
  """
  stddevPopulation: OrganizationStddevPopulationAggregates

  """
  Sample variance aggregates across the matching connection (ignoring before/after/first/last/offset)
  """
  varianceSample: OrganizationVarianceSampleAggregates

  """
  Population variance aggregates across the matching connection (ignoring before/after/first/last/offset)
  """
  variancePopulation: OrganizationVariancePopulationAggregates
}

type OrganizationSumAggregates {
  """Sum of rowId across the matching connection"""
  rowId: BigInt!
}

type OrganizationDistinctCountAggregates {
  """Distinct count of rowId across the matching connection"""
  rowId: BigInt

  """Distinct count of createdAt across the matching connection"""
  createdAt: BigInt

  """Distinct count of name across the matching connection"""
  name: BigInt

  """Distinct count of description across the matching connection"""
  description: BigInt

  """Distinct count of slug across the matching connection"""
  slug: BigInt

  """Distinct count of projects across the matching connection"""
  projects: BigInt
}

type OrganizationMinAggregates {
  """Minimum of rowId across the matching connection"""
  rowId: Int
}

type OrganizationMaxAggregates {
  """Maximum of rowId across the matching connection"""
  rowId: Int
}

type OrganizationAverageAggregates {
  """Mean average of rowId across the matching connection"""
  rowId: BigFloat
}

type OrganizationStddevSampleAggregates {
  """Sample standard deviation of rowId across the matching connection"""
  rowId: BigFloat
}

type OrganizationStddevPopulationAggregates {
  """Population standard deviation of rowId across the matching connection"""
  rowId: BigFloat
}

type OrganizationVarianceSampleAggregates {
  """Sample variance of rowId across the matching connection"""
  rowId: BigFloat
}

type OrganizationVariancePopulationAggregates {
  """Population variance of rowId across the matching connection"""
  rowId: BigFloat
}

"""Grouping methods for \`Organization\` for usage during aggregation."""
enum OrganizationGroupBy {
  CREATED_AT
  CREATED_AT_TRUNCATED_TO_HOUR
  CREATED_AT_TRUNCATED_TO_DAY
  NAME
  DESCRIPTION
  SLUG
  PROJECTS
}

"""Conditions for \`Organization\` aggregates."""
input OrganizationHavingInput {
  AND: [OrganizationHavingInput!]
  OR: [OrganizationHavingInput!]
  sum: OrganizationHavingSumInput
  distinctCount: OrganizationHavingDistinctCountInput
  min: OrganizationHavingMinInput
  max: OrganizationHavingMaxInput
  average: OrganizationHavingAverageInput
  stddevSample: OrganizationHavingStddevSampleInput
  stddevPopulation: OrganizationHavingStddevPopulationInput
  varianceSample: OrganizationHavingVarianceSampleInput
  variancePopulation: OrganizationHavingVariancePopulationInput
}

input OrganizationHavingSumInput {
  rowId: HavingIntFilter
  createdAt: HavingDatetimeFilter
}

input OrganizationHavingDistinctCountInput {
  rowId: HavingIntFilter
  createdAt: HavingDatetimeFilter
}

input OrganizationHavingMinInput {
  rowId: HavingIntFilter
  createdAt: HavingDatetimeFilter
}

input OrganizationHavingMaxInput {
  rowId: HavingIntFilter
  createdAt: HavingDatetimeFilter
}

input OrganizationHavingAverageInput {
  rowId: HavingIntFilter
  createdAt: HavingDatetimeFilter
}

input OrganizationHavingStddevSampleInput {
  rowId: HavingIntFilter
  createdAt: HavingDatetimeFilter
}

input OrganizationHavingStddevPopulationInput {
  rowId: HavingIntFilter
  createdAt: HavingDatetimeFilter
}

input OrganizationHavingVarianceSampleInput {
  rowId: HavingIntFilter
  createdAt: HavingDatetimeFilter
}

input OrganizationHavingVariancePopulationInput {
  rowId: HavingIntFilter
  createdAt: HavingDatetimeFilter
}

"""Methods to use when ordering \`Organization\`."""
enum OrganizationOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ID_ASC
  ID_DESC
  CREATED_AT_ASC
  CREATED_AT_DESC
  NAME_ASC
  NAME_DESC
  DESCRIPTION_ASC
  DESCRIPTION_DESC
  SLUG_ASC
  SLUG_DESC
  PROJECTS_ASC
  PROJECTS_DESC
}

"""
A condition to be used against \`Organization\` object types. All fields are
tested for equality and combined with a logical ‘and.’
"""
input OrganizationCondition {
  """Checks for equality with the object’s \`rowId\` field."""
  rowId: Int

  """Checks for equality with the object’s \`createdAt\` field."""
  createdAt: Datetime

  """Checks for equality with the object’s \`name\` field."""
  name: String

  """Checks for equality with the object’s \`description\` field."""
  description: String

  """Checks for equality with the object’s \`slug\` field."""
  slug: String

  """Checks for equality with the object’s \`projects\` field."""
  projects: String
}

"""
A filter to be used against \`Organization\` object types. All fields are combined with a logical ‘and.’
"""
input OrganizationFilter {
  """Filter by the object’s \`rowId\` field."""
  rowId: IntFilter

  """Filter by the object’s \`createdAt\` field."""
  createdAt: DatetimeFilter

  """Filter by the object’s \`name\` field."""
  name: StringFilter

  """Filter by the object’s \`description\` field."""
  description: StringFilter

  """Filter by the object’s \`slug\` field."""
  slug: StringFilter

  """Filter by the object’s \`projects\` field."""
  projects: StringFilter

  """Checks for all expressions in this list."""
  and: [OrganizationFilter!]

  """Checks for any expressions in this list."""
  or: [OrganizationFilter!]

  """Negates the expression."""
  not: OrganizationFilter
}

"""A connection to a list of \`Post\` values."""
type PostConnection {
  """A list of \`Post\` objects."""
  nodes: [Post]!

  """
  A list of edges which contains the \`Post\` and cursor to aid in pagination.
  """
  edges: [PostEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`Post\` you could get from the connection."""
  totalCount: Int!

  """
  Aggregates across the matching connection (ignoring before/after/first/last/offset)
  """
  aggregates: PostAggregates

  """
  Grouped aggregates across the matching connection (ignoring before/after/first/last/offset)
  """
  groupedAggregates(
    """The method to use when grouping \`Post\` for these aggregates."""
    groupBy: [PostGroupBy!]!

    """Conditions on the grouped aggregates."""
    having: PostHavingInput
  ): [PostAggregates!]
}

"""A \`Post\` edge in the connection."""
type PostEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`Post\` at the end of the edge."""
  node: Post
}

type PostAggregates {
  keys: [String]

  """
  Sum aggregates across the matching connection (ignoring before/after/first/last/offset)
  """
  sum: PostSumAggregates

  """
  Distinct count aggregates across the matching connection (ignoring before/after/first/last/offset)
  """
  distinctCount: PostDistinctCountAggregates

  """
  Minimum aggregates across the matching connection (ignoring before/after/first/last/offset)
  """
  min: PostMinAggregates

  """
  Maximum aggregates across the matching connection (ignoring before/after/first/last/offset)
  """
  max: PostMaxAggregates

  """
  Mean average aggregates across the matching connection (ignoring before/after/first/last/offset)
  """
  average: PostAverageAggregates

  """
  Sample standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset)
  """
  stddevSample: PostStddevSampleAggregates

  """
  Population standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset)
  """
  stddevPopulation: PostStddevPopulationAggregates

  """
  Sample variance aggregates across the matching connection (ignoring before/after/first/last/offset)
  """
  varianceSample: PostVarianceSampleAggregates

  """
  Population variance aggregates across the matching connection (ignoring before/after/first/last/offset)
  """
  variancePopulation: PostVariancePopulationAggregates
}

type PostSumAggregates {
  """Sum of rowId across the matching connection"""
  rowId: BigInt!

  """Sum of authorId across the matching connection"""
  authorId: BigInt!

  """Sum of projectId across the matching connection"""
  projectId: BigInt!
}

type PostDistinctCountAggregates {
  """Distinct count of rowId across the matching connection"""
  rowId: BigInt

  """Distinct count of createdAt across the matching connection"""
  createdAt: BigInt

  """Distinct count of title across the matching connection"""
  title: BigInt

  """Distinct count of body across the matching connection"""
  body: BigInt

  """Distinct count of authorId across the matching connection"""
  authorId: BigInt

  """Distinct count of projectId across the matching connection"""
  projectId: BigInt
}

type PostMinAggregates {
  """Minimum of rowId across the matching connection"""
  rowId: Int

  """Minimum of authorId across the matching connection"""
  authorId: Int

  """Minimum of projectId across the matching connection"""
  projectId: Int
}

type PostMaxAggregates {
  """Maximum of rowId across the matching connection"""
  rowId: Int

  """Maximum of authorId across the matching connection"""
  authorId: Int

  """Maximum of projectId across the matching connection"""
  projectId: Int
}

type PostAverageAggregates {
  """Mean average of rowId across the matching connection"""
  rowId: BigFloat

  """Mean average of authorId across the matching connection"""
  authorId: BigFloat

  """Mean average of projectId across the matching connection"""
  projectId: BigFloat
}

type PostStddevSampleAggregates {
  """Sample standard deviation of rowId across the matching connection"""
  rowId: BigFloat

  """Sample standard deviation of authorId across the matching connection"""
  authorId: BigFloat

  """Sample standard deviation of projectId across the matching connection"""
  projectId: BigFloat
}

type PostStddevPopulationAggregates {
  """Population standard deviation of rowId across the matching connection"""
  rowId: BigFloat

  """
  Population standard deviation of authorId across the matching connection
  """
  authorId: BigFloat

  """
  Population standard deviation of projectId across the matching connection
  """
  projectId: BigFloat
}

type PostVarianceSampleAggregates {
  """Sample variance of rowId across the matching connection"""
  rowId: BigFloat

  """Sample variance of authorId across the matching connection"""
  authorId: BigFloat

  """Sample variance of projectId across the matching connection"""
  projectId: BigFloat
}

type PostVariancePopulationAggregates {
  """Population variance of rowId across the matching connection"""
  rowId: BigFloat

  """Population variance of authorId across the matching connection"""
  authorId: BigFloat

  """Population variance of projectId across the matching connection"""
  projectId: BigFloat
}

"""Grouping methods for \`Post\` for usage during aggregation."""
enum PostGroupBy {
  CREATED_AT
  CREATED_AT_TRUNCATED_TO_HOUR
  CREATED_AT_TRUNCATED_TO_DAY
  TITLE
  BODY
  AUTHOR_ID
  PROJECT_ID
}

"""Conditions for \`Post\` aggregates."""
input PostHavingInput {
  AND: [PostHavingInput!]
  OR: [PostHavingInput!]
  sum: PostHavingSumInput
  distinctCount: PostHavingDistinctCountInput
  min: PostHavingMinInput
  max: PostHavingMaxInput
  average: PostHavingAverageInput
  stddevSample: PostHavingStddevSampleInput
  stddevPopulation: PostHavingStddevPopulationInput
  varianceSample: PostHavingVarianceSampleInput
  variancePopulation: PostHavingVariancePopulationInput
}

input PostHavingSumInput {
  rowId: HavingIntFilter
  createdAt: HavingDatetimeFilter
  authorId: HavingIntFilter
  projectId: HavingIntFilter
}

input PostHavingDistinctCountInput {
  rowId: HavingIntFilter
  createdAt: HavingDatetimeFilter
  authorId: HavingIntFilter
  projectId: HavingIntFilter
}

input PostHavingMinInput {
  rowId: HavingIntFilter
  createdAt: HavingDatetimeFilter
  authorId: HavingIntFilter
  projectId: HavingIntFilter
}

input PostHavingMaxInput {
  rowId: HavingIntFilter
  createdAt: HavingDatetimeFilter
  authorId: HavingIntFilter
  projectId: HavingIntFilter
}

input PostHavingAverageInput {
  rowId: HavingIntFilter
  createdAt: HavingDatetimeFilter
  authorId: HavingIntFilter
  projectId: HavingIntFilter
}

input PostHavingStddevSampleInput {
  rowId: HavingIntFilter
  createdAt: HavingDatetimeFilter
  authorId: HavingIntFilter
  projectId: HavingIntFilter
}

input PostHavingStddevPopulationInput {
  rowId: HavingIntFilter
  createdAt: HavingDatetimeFilter
  authorId: HavingIntFilter
  projectId: HavingIntFilter
}

input PostHavingVarianceSampleInput {
  rowId: HavingIntFilter
  createdAt: HavingDatetimeFilter
  authorId: HavingIntFilter
  projectId: HavingIntFilter
}

input PostHavingVariancePopulationInput {
  rowId: HavingIntFilter
  createdAt: HavingDatetimeFilter
  authorId: HavingIntFilter
  projectId: HavingIntFilter
}

"""Methods to use when ordering \`Post\`."""
enum PostOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ID_ASC
  ID_DESC
  CREATED_AT_ASC
  CREATED_AT_DESC
  TITLE_ASC
  TITLE_DESC
  BODY_ASC
  BODY_DESC
  AUTHOR_ID_ASC
  AUTHOR_ID_DESC
  PROJECT_ID_ASC
  PROJECT_ID_DESC
}

"""
A condition to be used against \`Post\` object types. All fields are tested for equality and combined with a logical ‘and.’
"""
input PostCondition {
  """Checks for equality with the object’s \`rowId\` field."""
  rowId: Int

  """Checks for equality with the object’s \`createdAt\` field."""
  createdAt: Datetime

  """Checks for equality with the object’s \`title\` field."""
  title: String

  """Checks for equality with the object’s \`body\` field."""
  body: String

  """Checks for equality with the object’s \`authorId\` field."""
  authorId: Int

  """Checks for equality with the object’s \`projectId\` field."""
  projectId: Int
}

"""
A filter to be used against \`Post\` object types. All fields are combined with a logical ‘and.’
"""
input PostFilter {
  """Filter by the object’s \`rowId\` field."""
  rowId: IntFilter

  """Filter by the object’s \`createdAt\` field."""
  createdAt: DatetimeFilter

  """Filter by the object’s \`title\` field."""
  title: StringFilter

  """Filter by the object’s \`body\` field."""
  body: StringFilter

  """Filter by the object’s \`authorId\` field."""
  authorId: IntFilter

  """Filter by the object’s \`projectId\` field."""
  projectId: IntFilter

  """Checks for all expressions in this list."""
  and: [PostFilter!]

  """Checks for any expressions in this list."""
  or: [PostFilter!]

  """Negates the expression."""
  not: PostFilter
}

"""A connection to a list of \`Project\` values."""
type ProjectConnection {
  """A list of \`Project\` objects."""
  nodes: [Project]!

  """
  A list of edges which contains the \`Project\` and cursor to aid in pagination.
  """
  edges: [ProjectEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`Project\` you could get from the connection."""
  totalCount: Int!

  """
  Aggregates across the matching connection (ignoring before/after/first/last/offset)
  """
  aggregates: ProjectAggregates

  """
  Grouped aggregates across the matching connection (ignoring before/after/first/last/offset)
  """
  groupedAggregates(
    """The method to use when grouping \`Project\` for these aggregates."""
    groupBy: [ProjectGroupBy!]!

    """Conditions on the grouped aggregates."""
    having: ProjectHavingInput
  ): [ProjectAggregates!]
}

"""A \`Project\` edge in the connection."""
type ProjectEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`Project\` at the end of the edge."""
  node: Project
}

type ProjectAggregates {
  keys: [String]

  """
  Sum aggregates across the matching connection (ignoring before/after/first/last/offset)
  """
  sum: ProjectSumAggregates

  """
  Distinct count aggregates across the matching connection (ignoring before/after/first/last/offset)
  """
  distinctCount: ProjectDistinctCountAggregates

  """
  Minimum aggregates across the matching connection (ignoring before/after/first/last/offset)
  """
  min: ProjectMinAggregates

  """
  Maximum aggregates across the matching connection (ignoring before/after/first/last/offset)
  """
  max: ProjectMaxAggregates

  """
  Mean average aggregates across the matching connection (ignoring before/after/first/last/offset)
  """
  average: ProjectAverageAggregates

  """
  Sample standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset)
  """
  stddevSample: ProjectStddevSampleAggregates

  """
  Population standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset)
  """
  stddevPopulation: ProjectStddevPopulationAggregates

  """
  Sample variance aggregates across the matching connection (ignoring before/after/first/last/offset)
  """
  varianceSample: ProjectVarianceSampleAggregates

  """
  Population variance aggregates across the matching connection (ignoring before/after/first/last/offset)
  """
  variancePopulation: ProjectVariancePopulationAggregates
}

type ProjectSumAggregates {
  """Sum of rowId across the matching connection"""
  rowId: BigInt!

  """Sum of organizationId across the matching connection"""
  organizationId: BigInt!
}

type ProjectDistinctCountAggregates {
  """Distinct count of rowId across the matching connection"""
  rowId: BigInt

  """Distinct count of createdAt across the matching connection"""
  createdAt: BigInt

  """Distinct count of name across the matching connection"""
  name: BigInt

  """Distinct count of description across the matching connection"""
  description: BigInt

  """Distinct count of slug across the matching connection"""
  slug: BigInt

  """Distinct count of image across the matching connection"""
  image: BigInt

  """Distinct count of organizationId across the matching connection"""
  organizationId: BigInt
}

type ProjectMinAggregates {
  """Minimum of rowId across the matching connection"""
  rowId: Int

  """Minimum of organizationId across the matching connection"""
  organizationId: Int
}

type ProjectMaxAggregates {
  """Maximum of rowId across the matching connection"""
  rowId: Int

  """Maximum of organizationId across the matching connection"""
  organizationId: Int
}

type ProjectAverageAggregates {
  """Mean average of rowId across the matching connection"""
  rowId: BigFloat

  """Mean average of organizationId across the matching connection"""
  organizationId: BigFloat
}

type ProjectStddevSampleAggregates {
  """Sample standard deviation of rowId across the matching connection"""
  rowId: BigFloat

  """
  Sample standard deviation of organizationId across the matching connection
  """
  organizationId: BigFloat
}

type ProjectStddevPopulationAggregates {
  """Population standard deviation of rowId across the matching connection"""
  rowId: BigFloat

  """
  Population standard deviation of organizationId across the matching connection
  """
  organizationId: BigFloat
}

type ProjectVarianceSampleAggregates {
  """Sample variance of rowId across the matching connection"""
  rowId: BigFloat

  """Sample variance of organizationId across the matching connection"""
  organizationId: BigFloat
}

type ProjectVariancePopulationAggregates {
  """Population variance of rowId across the matching connection"""
  rowId: BigFloat

  """Population variance of organizationId across the matching connection"""
  organizationId: BigFloat
}

"""Grouping methods for \`Project\` for usage during aggregation."""
enum ProjectGroupBy {
  CREATED_AT
  CREATED_AT_TRUNCATED_TO_HOUR
  CREATED_AT_TRUNCATED_TO_DAY
  NAME
  DESCRIPTION
  SLUG
  IMAGE
  ORGANIZATION_ID
}

"""Conditions for \`Project\` aggregates."""
input ProjectHavingInput {
  AND: [ProjectHavingInput!]
  OR: [ProjectHavingInput!]
  sum: ProjectHavingSumInput
  distinctCount: ProjectHavingDistinctCountInput
  min: ProjectHavingMinInput
  max: ProjectHavingMaxInput
  average: ProjectHavingAverageInput
  stddevSample: ProjectHavingStddevSampleInput
  stddevPopulation: ProjectHavingStddevPopulationInput
  varianceSample: ProjectHavingVarianceSampleInput
  variancePopulation: ProjectHavingVariancePopulationInput
}

input ProjectHavingSumInput {
  rowId: HavingIntFilter
  createdAt: HavingDatetimeFilter
  organizationId: HavingIntFilter
}

input ProjectHavingDistinctCountInput {
  rowId: HavingIntFilter
  createdAt: HavingDatetimeFilter
  organizationId: HavingIntFilter
}

input ProjectHavingMinInput {
  rowId: HavingIntFilter
  createdAt: HavingDatetimeFilter
  organizationId: HavingIntFilter
}

input ProjectHavingMaxInput {
  rowId: HavingIntFilter
  createdAt: HavingDatetimeFilter
  organizationId: HavingIntFilter
}

input ProjectHavingAverageInput {
  rowId: HavingIntFilter
  createdAt: HavingDatetimeFilter
  organizationId: HavingIntFilter
}

input ProjectHavingStddevSampleInput {
  rowId: HavingIntFilter
  createdAt: HavingDatetimeFilter
  organizationId: HavingIntFilter
}

input ProjectHavingStddevPopulationInput {
  rowId: HavingIntFilter
  createdAt: HavingDatetimeFilter
  organizationId: HavingIntFilter
}

input ProjectHavingVarianceSampleInput {
  rowId: HavingIntFilter
  createdAt: HavingDatetimeFilter
  organizationId: HavingIntFilter
}

input ProjectHavingVariancePopulationInput {
  rowId: HavingIntFilter
  createdAt: HavingDatetimeFilter
  organizationId: HavingIntFilter
}

"""Methods to use when ordering \`Project\`."""
enum ProjectOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ID_ASC
  ID_DESC
  CREATED_AT_ASC
  CREATED_AT_DESC
  NAME_ASC
  NAME_DESC
  DESCRIPTION_ASC
  DESCRIPTION_DESC
  SLUG_ASC
  SLUG_DESC
  IMAGE_ASC
  IMAGE_DESC
  ORGANIZATION_ID_ASC
  ORGANIZATION_ID_DESC
}

"""
A condition to be used against \`Project\` object types. All fields are tested for equality and combined with a logical ‘and.’
"""
input ProjectCondition {
  """Checks for equality with the object’s \`rowId\` field."""
  rowId: Int

  """Checks for equality with the object’s \`createdAt\` field."""
  createdAt: Datetime

  """Checks for equality with the object’s \`name\` field."""
  name: String

  """Checks for equality with the object’s \`description\` field."""
  description: String

  """Checks for equality with the object’s \`slug\` field."""
  slug: String

  """Checks for equality with the object’s \`image\` field."""
  image: String

  """Checks for equality with the object’s \`organizationId\` field."""
  organizationId: Int
}

"""
A filter to be used against \`Project\` object types. All fields are combined with a logical ‘and.’
"""
input ProjectFilter {
  """Filter by the object’s \`rowId\` field."""
  rowId: IntFilter

  """Filter by the object’s \`createdAt\` field."""
  createdAt: DatetimeFilter

  """Filter by the object’s \`name\` field."""
  name: StringFilter

  """Filter by the object’s \`description\` field."""
  description: StringFilter

  """Filter by the object’s \`slug\` field."""
  slug: StringFilter

  """Filter by the object’s \`image\` field."""
  image: StringFilter

  """Filter by the object’s \`organizationId\` field."""
  organizationId: IntFilter

  """Checks for all expressions in this list."""
  and: [ProjectFilter!]

  """Checks for any expressions in this list."""
  or: [ProjectFilter!]

  """Negates the expression."""
  not: ProjectFilter
}

"""
The root mutation type which contains root level fields which mutate data.
"""
type Mutation {
  """Creates a single \`Upvote\`."""
  createUpvote(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateUpvoteInput!
  ): CreateUpvotePayload

  """Creates a single \`User\`."""
  createUser(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateUserInput!
  ): CreateUserPayload

  """Creates a single \`Organization\`."""
  createOrganization(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateOrganizationInput!
  ): CreateOrganizationPayload

  """Creates a single \`Post\`."""
  createPost(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreatePostInput!
  ): CreatePostPayload

  """Creates a single \`Project\`."""
  createProject(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateProjectInput!
  ): CreateProjectPayload

  """Updates a single \`Upvote\` using its globally unique id and a patch."""
  updateUpvoteById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateUpvoteByIdInput!
  ): UpdateUpvotePayload

  """Updates a single \`Upvote\` using a unique key and a patch."""
  updateUpvote(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateUpvoteInput!
  ): UpdateUpvotePayload

  """Updates a single \`User\` using its globally unique id and a patch."""
  updateUserById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateUserByIdInput!
  ): UpdateUserPayload

  """Updates a single \`User\` using a unique key and a patch."""
  updateUser(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateUserInput!
  ): UpdateUserPayload

  """
  Updates a single \`Organization\` using its globally unique id and a patch.
  """
  updateOrganizationById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateOrganizationByIdInput!
  ): UpdateOrganizationPayload

  """Updates a single \`Organization\` using a unique key and a patch."""
  updateOrganization(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateOrganizationInput!
  ): UpdateOrganizationPayload

  """Updates a single \`Post\` using its globally unique id and a patch."""
  updatePostById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdatePostByIdInput!
  ): UpdatePostPayload

  """Updates a single \`Post\` using a unique key and a patch."""
  updatePost(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdatePostInput!
  ): UpdatePostPayload

  """Updates a single \`Project\` using its globally unique id and a patch."""
  updateProjectById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateProjectByIdInput!
  ): UpdateProjectPayload

  """Updates a single \`Project\` using a unique key and a patch."""
  updateProject(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateProjectInput!
  ): UpdateProjectPayload

  """Deletes a single \`Upvote\` using its globally unique id."""
  deleteUpvoteById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteUpvoteByIdInput!
  ): DeleteUpvotePayload

  """Deletes a single \`Upvote\` using a unique key."""
  deleteUpvote(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteUpvoteInput!
  ): DeleteUpvotePayload

  """Deletes a single \`User\` using its globally unique id."""
  deleteUserById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteUserByIdInput!
  ): DeleteUserPayload

  """Deletes a single \`User\` using a unique key."""
  deleteUser(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteUserInput!
  ): DeleteUserPayload

  """Deletes a single \`Organization\` using its globally unique id."""
  deleteOrganizationById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteOrganizationByIdInput!
  ): DeleteOrganizationPayload

  """Deletes a single \`Organization\` using a unique key."""
  deleteOrganization(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteOrganizationInput!
  ): DeleteOrganizationPayload

  """Deletes a single \`Post\` using its globally unique id."""
  deletePostById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeletePostByIdInput!
  ): DeletePostPayload

  """Deletes a single \`Post\` using a unique key."""
  deletePost(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeletePostInput!
  ): DeletePostPayload

  """Deletes a single \`Project\` using its globally unique id."""
  deleteProjectById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteProjectByIdInput!
  ): DeleteProjectPayload

  """Deletes a single \`Project\` using a unique key."""
  deleteProject(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteProjectInput!
  ): DeleteProjectPayload
}

"""The output of our create \`Upvote\` mutation."""
type CreateUpvotePayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Upvote\` that was created by this mutation."""
  upvote: Upvote

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Upvote\`. May be used by Relay 1."""
  upvoteEdge(
    """The method to use when ordering \`Upvote\`."""
    orderBy: [UpvoteOrderBy!]! = [PRIMARY_KEY_ASC]
  ): UpvoteEdge
}

"""All input for the create \`Upvote\` mutation."""
input CreateUpvoteInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The \`Upvote\` to be created by this mutation."""
  upvote: UpvoteInput!
}

"""An input for mutations affecting \`Upvote\`"""
input UpvoteInput {
  rowId: Int
  createdAt: Datetime
}

"""The output of our create \`User\` mutation."""
type CreateUserPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`User\` that was created by this mutation."""
  user: User

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`User\`. May be used by Relay 1."""
  userEdge(
    """The method to use when ordering \`User\`."""
    orderBy: [UserOrderBy!]! = [PRIMARY_KEY_ASC]
  ): UserEdge
}

"""All input for the create \`User\` mutation."""
input CreateUserInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The \`User\` to be created by this mutation."""
  user: UserInput!
}

"""An input for mutations affecting \`User\`"""
input UserInput {
  rowId: Int
  createdAt: Datetime
  walletAddress: String!
  posts: String
  upvotes: String
}

"""The output of our create \`Organization\` mutation."""
type CreateOrganizationPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Organization\` that was created by this mutation."""
  organization: Organization

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Organization\`. May be used by Relay 1."""
  organizationEdge(
    """The method to use when ordering \`Organization\`."""
    orderBy: [OrganizationOrderBy!]! = [PRIMARY_KEY_ASC]
  ): OrganizationEdge
}

"""All input for the create \`Organization\` mutation."""
input CreateOrganizationInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The \`Organization\` to be created by this mutation."""
  organization: OrganizationInput!
}

"""An input for mutations affecting \`Organization\`"""
input OrganizationInput {
  rowId: Int
  createdAt: Datetime
  name: String
  description: String
  slug: String
  projects: String
}

"""The output of our create \`Post\` mutation."""
type CreatePostPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Post\` that was created by this mutation."""
  post: Post

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Post\`. May be used by Relay 1."""
  postEdge(
    """The method to use when ordering \`Post\`."""
    orderBy: [PostOrderBy!]! = [PRIMARY_KEY_ASC]
  ): PostEdge
}

"""All input for the create \`Post\` mutation."""
input CreatePostInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The \`Post\` to be created by this mutation."""
  post: PostInput!
}

"""An input for mutations affecting \`Post\`"""
input PostInput {
  rowId: Int
  createdAt: Datetime
  title: String
  body: String
  authorId: Int
  projectId: Int
}

"""The output of our create \`Project\` mutation."""
type CreateProjectPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Project\` that was created by this mutation."""
  project: Project

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Project\`. May be used by Relay 1."""
  projectEdge(
    """The method to use when ordering \`Project\`."""
    orderBy: [ProjectOrderBy!]! = [PRIMARY_KEY_ASC]
  ): ProjectEdge
}

"""All input for the create \`Project\` mutation."""
input CreateProjectInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The \`Project\` to be created by this mutation."""
  project: ProjectInput!
}

"""An input for mutations affecting \`Project\`"""
input ProjectInput {
  rowId: Int
  createdAt: Datetime
  name: String
  description: String
  slug: String
  image: String
  organizationId: Int
}

"""The output of our update \`Upvote\` mutation."""
type UpdateUpvotePayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Upvote\` that was updated by this mutation."""
  upvote: Upvote

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Upvote\`. May be used by Relay 1."""
  upvoteEdge(
    """The method to use when ordering \`Upvote\`."""
    orderBy: [UpvoteOrderBy!]! = [PRIMARY_KEY_ASC]
  ): UpvoteEdge
}

"""All input for the \`updateUpvoteById\` mutation."""
input UpdateUpvoteByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`Upvote\` to be updated.
  """
  id: ID!

  """
  An object where the defined keys will be set on the \`Upvote\` being updated.
  """
  patch: UpvotePatch!
}

"""
Represents an update to a \`Upvote\`. Fields that are set will be updated.
"""
input UpvotePatch {
  rowId: Int
  createdAt: Datetime
}

"""All input for the \`updateUpvote\` mutation."""
input UpdateUpvoteInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  rowId: Int!

  """
  An object where the defined keys will be set on the \`Upvote\` being updated.
  """
  patch: UpvotePatch!
}

"""The output of our update \`User\` mutation."""
type UpdateUserPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`User\` that was updated by this mutation."""
  user: User

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`User\`. May be used by Relay 1."""
  userEdge(
    """The method to use when ordering \`User\`."""
    orderBy: [UserOrderBy!]! = [PRIMARY_KEY_ASC]
  ): UserEdge
}

"""All input for the \`updateUserById\` mutation."""
input UpdateUserByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`User\` to be updated.
  """
  id: ID!

  """
  An object where the defined keys will be set on the \`User\` being updated.
  """
  patch: UserPatch!
}

"""Represents an update to a \`User\`. Fields that are set will be updated."""
input UserPatch {
  rowId: Int
  createdAt: Datetime
  walletAddress: String
  posts: String
  upvotes: String
}

"""All input for the \`updateUser\` mutation."""
input UpdateUserInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  rowId: Int!

  """
  An object where the defined keys will be set on the \`User\` being updated.
  """
  patch: UserPatch!
}

"""The output of our update \`Organization\` mutation."""
type UpdateOrganizationPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Organization\` that was updated by this mutation."""
  organization: Organization

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Organization\`. May be used by Relay 1."""
  organizationEdge(
    """The method to use when ordering \`Organization\`."""
    orderBy: [OrganizationOrderBy!]! = [PRIMARY_KEY_ASC]
  ): OrganizationEdge
}

"""All input for the \`updateOrganizationById\` mutation."""
input UpdateOrganizationByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`Organization\` to be updated.
  """
  id: ID!

  """
  An object where the defined keys will be set on the \`Organization\` being updated.
  """
  patch: OrganizationPatch!
}

"""
Represents an update to a \`Organization\`. Fields that are set will be updated.
"""
input OrganizationPatch {
  rowId: Int
  createdAt: Datetime
  name: String
  description: String
  slug: String
  projects: String
}

"""All input for the \`updateOrganization\` mutation."""
input UpdateOrganizationInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  rowId: Int!

  """
  An object where the defined keys will be set on the \`Organization\` being updated.
  """
  patch: OrganizationPatch!
}

"""The output of our update \`Post\` mutation."""
type UpdatePostPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Post\` that was updated by this mutation."""
  post: Post

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Post\`. May be used by Relay 1."""
  postEdge(
    """The method to use when ordering \`Post\`."""
    orderBy: [PostOrderBy!]! = [PRIMARY_KEY_ASC]
  ): PostEdge
}

"""All input for the \`updatePostById\` mutation."""
input UpdatePostByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`Post\` to be updated.
  """
  id: ID!

  """
  An object where the defined keys will be set on the \`Post\` being updated.
  """
  patch: PostPatch!
}

"""Represents an update to a \`Post\`. Fields that are set will be updated."""
input PostPatch {
  rowId: Int
  createdAt: Datetime
  title: String
  body: String
  authorId: Int
  projectId: Int
}

"""All input for the \`updatePost\` mutation."""
input UpdatePostInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  rowId: Int!

  """
  An object where the defined keys will be set on the \`Post\` being updated.
  """
  patch: PostPatch!
}

"""The output of our update \`Project\` mutation."""
type UpdateProjectPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Project\` that was updated by this mutation."""
  project: Project

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Project\`. May be used by Relay 1."""
  projectEdge(
    """The method to use when ordering \`Project\`."""
    orderBy: [ProjectOrderBy!]! = [PRIMARY_KEY_ASC]
  ): ProjectEdge
}

"""All input for the \`updateProjectById\` mutation."""
input UpdateProjectByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`Project\` to be updated.
  """
  id: ID!

  """
  An object where the defined keys will be set on the \`Project\` being updated.
  """
  patch: ProjectPatch!
}

"""
Represents an update to a \`Project\`. Fields that are set will be updated.
"""
input ProjectPatch {
  rowId: Int
  createdAt: Datetime
  name: String
  description: String
  slug: String
  image: String
  organizationId: Int
}

"""All input for the \`updateProject\` mutation."""
input UpdateProjectInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  rowId: Int!

  """
  An object where the defined keys will be set on the \`Project\` being updated.
  """
  patch: ProjectPatch!
}

"""The output of our delete \`Upvote\` mutation."""
type DeleteUpvotePayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Upvote\` that was deleted by this mutation."""
  upvote: Upvote
  deletedUpvoteId: ID

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Upvote\`. May be used by Relay 1."""
  upvoteEdge(
    """The method to use when ordering \`Upvote\`."""
    orderBy: [UpvoteOrderBy!]! = [PRIMARY_KEY_ASC]
  ): UpvoteEdge
}

"""All input for the \`deleteUpvoteById\` mutation."""
input DeleteUpvoteByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`Upvote\` to be deleted.
  """
  id: ID!
}

"""All input for the \`deleteUpvote\` mutation."""
input DeleteUpvoteInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  rowId: Int!
}

"""The output of our delete \`User\` mutation."""
type DeleteUserPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`User\` that was deleted by this mutation."""
  user: User
  deletedUserId: ID

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`User\`. May be used by Relay 1."""
  userEdge(
    """The method to use when ordering \`User\`."""
    orderBy: [UserOrderBy!]! = [PRIMARY_KEY_ASC]
  ): UserEdge
}

"""All input for the \`deleteUserById\` mutation."""
input DeleteUserByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`User\` to be deleted.
  """
  id: ID!
}

"""All input for the \`deleteUser\` mutation."""
input DeleteUserInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  rowId: Int!
}

"""The output of our delete \`Organization\` mutation."""
type DeleteOrganizationPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Organization\` that was deleted by this mutation."""
  organization: Organization
  deletedOrganizationId: ID

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Organization\`. May be used by Relay 1."""
  organizationEdge(
    """The method to use when ordering \`Organization\`."""
    orderBy: [OrganizationOrderBy!]! = [PRIMARY_KEY_ASC]
  ): OrganizationEdge
}

"""All input for the \`deleteOrganizationById\` mutation."""
input DeleteOrganizationByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`Organization\` to be deleted.
  """
  id: ID!
}

"""All input for the \`deleteOrganization\` mutation."""
input DeleteOrganizationInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  rowId: Int!
}

"""The output of our delete \`Post\` mutation."""
type DeletePostPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Post\` that was deleted by this mutation."""
  post: Post
  deletedPostId: ID

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Post\`. May be used by Relay 1."""
  postEdge(
    """The method to use when ordering \`Post\`."""
    orderBy: [PostOrderBy!]! = [PRIMARY_KEY_ASC]
  ): PostEdge
}

"""All input for the \`deletePostById\` mutation."""
input DeletePostByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`Post\` to be deleted.
  """
  id: ID!
}

"""All input for the \`deletePost\` mutation."""
input DeletePostInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  rowId: Int!
}

"""The output of our delete \`Project\` mutation."""
type DeleteProjectPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Project\` that was deleted by this mutation."""
  project: Project
  deletedProjectId: ID

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Project\`. May be used by Relay 1."""
  projectEdge(
    """The method to use when ordering \`Project\`."""
    orderBy: [ProjectOrderBy!]! = [PRIMARY_KEY_ASC]
  ): ProjectEdge
}

"""All input for the \`deleteProjectById\` mutation."""
input DeleteProjectByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`Project\` to be deleted.
  """
  id: ID!
}

"""All input for the \`deleteProject\` mutation."""
input DeleteProjectInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  rowId: Int!
}`;
export const plans = {
  Query: {
    __assertStep() {
      return !0;
    },
    query() {
      return rootValue();
    },
    id($parent) {
      const specifier = handler.plan($parent);
      return lambda(specifier, nodeIdCodecs[handler.codec.name].encode);
    },
    node: {
      plan(_$root, args) {
        return node(nodeIdHandlerByTypeName, args.get("id"));
      },
      args: {
        id: undefined
      }
    },
    upvote: {
      plan(_$root, args) {
        return pgResource_upvotePgResource.get({
          id: args.get("rowId")
        });
      },
      args: {
        rowId: undefined
      }
    },
    user: {
      plan(_$root, args) {
        return pgResource_userPgResource.get({
          id: args.get("rowId")
        });
      },
      args: {
        rowId: undefined
      }
    },
    organization: {
      plan(_$root, args) {
        return pgResource_organizationPgResource.get({
          id: args.get("rowId")
        });
      },
      args: {
        rowId: undefined
      }
    },
    post: {
      plan(_$root, args) {
        return pgResource_postPgResource.get({
          id: args.get("rowId")
        });
      },
      args: {
        rowId: undefined
      }
    },
    project: {
      plan(_$root, args) {
        return pgResource_projectPgResource.get({
          id: args.get("rowId")
        });
      },
      args: {
        rowId: undefined
      }
    },
    upvoteById: {
      plan(_$parent, args) {
        const $nodeId = args.get("id");
        return fetcher($nodeId);
      },
      args: {
        id: undefined
      }
    },
    userById: {
      plan(_$parent, args) {
        const $nodeId = args.get("id");
        return fetcher2($nodeId);
      },
      args: {
        id: undefined
      }
    },
    organizationById: {
      plan(_$parent, args) {
        const $nodeId = args.get("id");
        return fetcher3($nodeId);
      },
      args: {
        id: undefined
      }
    },
    postById: {
      plan(_$parent, args) {
        const $nodeId = args.get("id");
        return fetcher4($nodeId);
      },
      args: {
        id: undefined
      }
    },
    projectById: {
      plan(_$parent, args) {
        const $nodeId = args.get("id");
        return fetcher5($nodeId);
      },
      args: {
        id: undefined
      }
    },
    upvotes: {
      plan() {
        return connection(pgResource_upvotePgResource.find());
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw(),
              $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("UpvoteOrderBy"));
            return null;
          }
        },
        condition: {
          autoApplyAfterParentPlan: true,
          applyPlan(_condition, $connection) {
            return $connection.getSubplan().wherePlan();
          }
        },
        filter: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, fieldArgs) {
            assertAllowed(fieldArgs, "object");
            const $where = $connection.getSubplan().wherePlan();
            if (null) $where.extensions.pgFilterAttribute = {
              codec: null
            };
            fieldArgs.apply($where);
          }
        }
      }
    },
    users: {
      plan() {
        return connection(pgResource_userPgResource.find());
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw(),
              $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("UserOrderBy"));
            return null;
          }
        },
        condition: {
          autoApplyAfterParentPlan: true,
          applyPlan(_condition, $connection) {
            return $connection.getSubplan().wherePlan();
          }
        },
        filter: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, fieldArgs) {
            assertAllowed2(fieldArgs, "object");
            const $where = $connection.getSubplan().wherePlan();
            if (null) $where.extensions.pgFilterAttribute = {
              codec: null
            };
            fieldArgs.apply($where);
          }
        }
      }
    },
    organizations: {
      plan() {
        return connection(pgResource_organizationPgResource.find());
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw(),
              $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("OrganizationOrderBy"));
            return null;
          }
        },
        condition: {
          autoApplyAfterParentPlan: true,
          applyPlan(_condition, $connection) {
            return $connection.getSubplan().wherePlan();
          }
        },
        filter: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, fieldArgs) {
            assertAllowed3(fieldArgs, "object");
            const $where = $connection.getSubplan().wherePlan();
            if (null) $where.extensions.pgFilterAttribute = {
              codec: null
            };
            fieldArgs.apply($where);
          }
        }
      }
    },
    posts: {
      plan() {
        return connection(pgResource_postPgResource.find());
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw(),
              $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("PostOrderBy"));
            return null;
          }
        },
        condition: {
          autoApplyAfterParentPlan: true,
          applyPlan(_condition, $connection) {
            return $connection.getSubplan().wherePlan();
          }
        },
        filter: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, fieldArgs) {
            assertAllowed4(fieldArgs, "object");
            const $where = $connection.getSubplan().wherePlan();
            if (null) $where.extensions.pgFilterAttribute = {
              codec: null
            };
            fieldArgs.apply($where);
          }
        }
      }
    },
    projects: {
      plan() {
        return connection(pgResource_projectPgResource.find());
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw(),
              $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("ProjectOrderBy"));
            return null;
          }
        },
        condition: {
          autoApplyAfterParentPlan: true,
          applyPlan(_condition, $connection) {
            return $connection.getSubplan().wherePlan();
          }
        },
        filter: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, fieldArgs) {
            assertAllowed5(fieldArgs, "object");
            const $where = $connection.getSubplan().wherePlan();
            if (null) $where.extensions.pgFilterAttribute = {
              codec: null
            };
            fieldArgs.apply($where);
          }
        }
      }
    }
  },
  Upvote: {
    __assertStep: assertPgClassSingleStep,
    id($parent) {
      const specifier = nodeIdHandlerByTypeName.Upvote.plan($parent);
      return lambda(specifier, nodeIdCodecs[nodeIdHandlerByTypeName.Upvote.codec.name].encode);
    },
    rowId($record) {
      return $record.get("id");
    },
    createdAt($record) {
      return $record.get("created_at");
    }
  },
  Datetime: {
    serialize: DatetimeSerialize,
    parseValue: DatetimeSerialize,
    parseLiteral(ast) {
      if (ast.kind !== Kind.STRING) throw new GraphQLError(`${"Datetime" ?? "This scalar"} can only parse string values (kind='${ast.kind}')`);
      return ast.value;
    }
  },
  User: {
    __assertStep: assertPgClassSingleStep,
    id($parent) {
      const specifier = nodeIdHandlerByTypeName.User.plan($parent);
      return lambda(specifier, nodeIdCodecs[nodeIdHandlerByTypeName.User.codec.name].encode);
    },
    rowId($record) {
      return $record.get("id");
    },
    createdAt($record) {
      return $record.get("created_at");
    },
    walletAddress($record) {
      return $record.get("wallet_address");
    },
    posts($record) {
      return $record.get("posts");
    },
    upvotes($record) {
      return $record.get("upvotes");
    }
  },
  Organization: {
    __assertStep: assertPgClassSingleStep,
    id($parent) {
      const specifier = nodeIdHandlerByTypeName.Organization.plan($parent);
      return lambda(specifier, nodeIdCodecs[nodeIdHandlerByTypeName.Organization.codec.name].encode);
    },
    rowId($record) {
      return $record.get("id");
    },
    createdAt($record) {
      return $record.get("created_at");
    },
    name($record) {
      return $record.get("name");
    },
    description($record) {
      return $record.get("description");
    },
    slug($record) {
      return $record.get("slug");
    },
    projects($record) {
      return $record.get("projects");
    }
  },
  Post: {
    __assertStep: assertPgClassSingleStep,
    id($parent) {
      const specifier = nodeIdHandlerByTypeName.Post.plan($parent);
      return lambda(specifier, nodeIdCodecs[nodeIdHandlerByTypeName.Post.codec.name].encode);
    },
    rowId($record) {
      return $record.get("id");
    },
    createdAt($record) {
      return $record.get("created_at");
    },
    title($record) {
      return $record.get("title");
    },
    body($record) {
      return $record.get("body");
    },
    authorId($record) {
      return $record.get("author_id");
    },
    projectId($record) {
      return $record.get("project_id");
    }
  },
  Project: {
    __assertStep: assertPgClassSingleStep,
    id($parent) {
      const specifier = nodeIdHandlerByTypeName.Project.plan($parent);
      return lambda(specifier, nodeIdCodecs[nodeIdHandlerByTypeName.Project.codec.name].encode);
    },
    rowId($record) {
      return $record.get("id");
    },
    createdAt($record) {
      return $record.get("created_at");
    },
    name($record) {
      return $record.get("name");
    },
    description($record) {
      return $record.get("description");
    },
    slug($record) {
      return $record.get("slug");
    },
    image($record) {
      return $record.get("image");
    },
    organizationId($record) {
      return $record.get("organization_id");
    }
  },
  UpvoteConnection: {
    __assertStep: ConnectionStep,
    nodes($connection) {
      return $connection.nodes();
    },
    edges($connection) {
      return $connection.edges();
    },
    pageInfo($connection) {
      return $connection.pageInfo();
    },
    totalCount($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint);
    },
    aggregates($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").single();
    },
    groupedAggregates: {
      plan($connection) {
        return $connection.cloneSubplanWithoutPagination("aggregate");
      },
      args: {
        groupBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_$parent, $pgSelect, input) {
            var _a, _b;
            const val = input.getRaw().eval();
            if (!Array.isArray(val)) throw new Error("Invalid!");
            for (const group of val) {
              const config = getEnumValueConfig(UpvoteGroupBy, group),
                plan = (_b = (_a = config === null || config === void 0 ? void 0 : config.extensions) === null || _a === void 0 ? void 0 : _a.grafast) === null || _b === void 0 ? void 0 : _b.applyPlan;
              if (typeof plan === "function") plan($pgSelect);
            }
            return null;
          }
        },
        having: {
          autoApplyAfterParentPlan: true,
          applyPlan(_$parent, $pgSelect) {
            return $pgSelect.havingPlan();
          }
        }
      }
    }
  },
  UpvoteEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  Cursor: {
    serialize: DatetimeSerialize,
    parseValue: DatetimeSerialize,
    parseLiteral(ast) {
      if (ast.kind !== Kind.STRING) throw new GraphQLError(`${"Cursor" ?? "This scalar"} can only parse string values (kind='${ast.kind}')`);
      return ast.value;
    }
  },
  PageInfo: {
    __assertStep: assertPageInfoCapableStep,
    hasNextPage($pageInfo) {
      return $pageInfo.hasNextPage();
    },
    hasPreviousPage($pageInfo) {
      return $pageInfo.hasPreviousPage();
    },
    startCursor($pageInfo) {
      return $pageInfo.startCursor();
    },
    endCursor($pageInfo) {
      return $pageInfo.endCursor();
    }
  },
  UpvoteAggregates: {
    __assertStep: assertPgClassSingleStep,
    keys($pgSelectSingle) {
      const groups = $pgSelectSingle.getClassStep().getGroups();
      if (groups.length > 0) return $pgSelectSingle.select(sql`json_build_array(${sql.join(groups.map(g => g.fragment), ", ")})`, TYPES.json);else return constant(null);
    },
    sum($pgSelectSingle) {
      return $pgSelectSingle;
    },
    distinctCount($pgSelectSingle) {
      return $pgSelectSingle;
    },
    min($pgSelectSingle) {
      return $pgSelectSingle;
    },
    max($pgSelectSingle) {
      return $pgSelectSingle;
    },
    average($pgSelectSingle) {
      return $pgSelectSingle;
    },
    stddevSample($pgSelectSingle) {
      return $pgSelectSingle;
    },
    stddevPopulation($pgSelectSingle) {
      return $pgSelectSingle;
    },
    varianceSample($pgSelectSingle) {
      return $pgSelectSingle;
    },
    variancePopulation($pgSelectSingle) {
      return $pgSelectSingle;
    }
  },
  UpvoteSumAggregates: {
    rowId($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("id")}`,
        sqlAggregate = spec.sqlAggregateWrap(sqlAttribute, TYPES.int);
      return $pgSelectSingle.select(sqlAggregate, TYPES.bigint);
    }
  },
  BigInt: {
    serialize: DatetimeSerialize,
    parseValue: DatetimeSerialize,
    parseLiteral(ast) {
      if (ast.kind !== Kind.STRING) throw new GraphQLError(`${"BigInt" ?? "This scalar"} can only parse string values (kind='${ast.kind}')`);
      return ast.value;
    }
  },
  UpvoteDistinctCountAggregates: {
    rowId($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("id")}`,
        sqlAggregate = spec2.sqlAggregateWrap(sqlAttribute, TYPES.int);
      return $pgSelectSingle.select(sqlAggregate, TYPES.bigint);
    },
    createdAt($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("created_at")}`,
        sqlAggregate = spec2.sqlAggregateWrap(sqlAttribute, TYPES.timestamp);
      return $pgSelectSingle.select(sqlAggregate, TYPES.bigint);
    }
  },
  UpvoteMinAggregates: {
    rowId($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("id")}`,
        sqlAggregate = spec3.sqlAggregateWrap(sqlAttribute, TYPES.int);
      return $pgSelectSingle.select(sqlAggregate, TYPES.int);
    }
  },
  UpvoteMaxAggregates: {
    rowId($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("id")}`,
        sqlAggregate = spec4.sqlAggregateWrap(sqlAttribute, TYPES.int);
      return $pgSelectSingle.select(sqlAggregate, TYPES.int);
    }
  },
  UpvoteAverageAggregates: {
    rowId($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("id")}`,
        sqlAggregate = spec5.sqlAggregateWrap(sqlAttribute, TYPES.int);
      return $pgSelectSingle.select(sqlAggregate, TYPES.numeric);
    }
  },
  BigFloat: {
    serialize: DatetimeSerialize,
    parseValue: DatetimeSerialize,
    parseLiteral(ast) {
      if (ast.kind !== Kind.STRING) throw new GraphQLError(`${"BigFloat" ?? "This scalar"} can only parse string values (kind='${ast.kind}')`);
      return ast.value;
    }
  },
  UpvoteStddevSampleAggregates: {
    rowId($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("id")}`,
        sqlAggregate = spec6.sqlAggregateWrap(sqlAttribute, TYPES.int);
      return $pgSelectSingle.select(sqlAggregate, TYPES.numeric);
    }
  },
  UpvoteStddevPopulationAggregates: {
    rowId($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("id")}`,
        sqlAggregate = spec7.sqlAggregateWrap(sqlAttribute, TYPES.int);
      return $pgSelectSingle.select(sqlAggregate, TYPES.numeric);
    }
  },
  UpvoteVarianceSampleAggregates: {
    rowId($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("id")}`,
        sqlAggregate = spec8.sqlAggregateWrap(sqlAttribute, TYPES.int);
      return $pgSelectSingle.select(sqlAggregate, TYPES.numeric);
    }
  },
  UpvoteVariancePopulationAggregates: {
    rowId($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("id")}`,
        sqlAggregate = spec9.sqlAggregateWrap(sqlAttribute, TYPES.int);
      return $pgSelectSingle.select(sqlAggregate, TYPES.numeric);
    }
  },
  UpvoteGroupBy: {
    CREATED_AT: {
      applyPlan: UpvoteGroupBy_extensions_grafast_applyPlan
    },
    CREATED_AT_TRUNCATED_TO_HOUR: {
      applyPlan: UpvoteGroupBy_extensions_grafast_applyPlan2
    },
    CREATED_AT_TRUNCATED_TO_DAY: {
      applyPlan: UpvoteGroupBy_extensions_grafast_applyPlan3
    }
  },
  UpvoteHavingInput: {
    AND: {
      applyPlan($where, input) {
        input.apply($where);
        return null;
      }
    },
    OR: {
      applyPlan($where, input) {
        const $or = new PgOrFilterStep($where);
        input.apply($or);
        return null;
      }
    },
    sum: {
      applyPlan($having) {
        return $having;
      }
    },
    distinctCount: {
      applyPlan($having) {
        return $having;
      }
    },
    min: {
      applyPlan($having) {
        return $having;
      }
    },
    max: {
      applyPlan($having) {
        return $having;
      }
    },
    average: {
      applyPlan($having) {
        return $having;
      }
    },
    stddevSample: {
      applyPlan($having) {
        return $having;
      }
    },
    stddevPopulation: {
      applyPlan($having) {
        return $having;
      }
    },
    varianceSample: {
      applyPlan($having) {
        return $having;
      }
    },
    variancePopulation: {
      applyPlan($having) {
        return $having;
      }
    }
  },
  UpvoteHavingSumInput: {
    rowId: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("id")}`,
          aggregateExpression = spec.sqlAggregateWrap(attributeExpression, spec_upvote.attributes.id.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = spec.sqlAggregateWrap(attributeExpression, spec_upvote.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    }
  },
  HavingIntFilter: {
    equalTo: {
      applyPlan($booleanFilter, input) {
        const val = input.get();
        $booleanFilter.having(sql`(${sql.parens($booleanFilter.expression)} ${infix()} ${$booleanFilter.placeholder(val, TYPES.int)})`);
      }
    },
    notEqualTo: {
      applyPlan($booleanFilter, input) {
        const val = input.get();
        $booleanFilter.having(sql`(${sql.parens($booleanFilter.expression)} ${infix2()} ${$booleanFilter.placeholder(val, TYPES.int)})`);
      }
    },
    greaterThan: {
      applyPlan($booleanFilter, input) {
        const val = input.get();
        $booleanFilter.having(sql`(${sql.parens($booleanFilter.expression)} ${infix3()} ${$booleanFilter.placeholder(val, TYPES.int)})`);
      }
    },
    greaterThanOrEqualTo: {
      applyPlan($booleanFilter, input) {
        const val = input.get();
        $booleanFilter.having(sql`(${sql.parens($booleanFilter.expression)} ${infix4()} ${$booleanFilter.placeholder(val, TYPES.int)})`);
      }
    },
    lessThan: {
      applyPlan($booleanFilter, input) {
        const val = input.get();
        $booleanFilter.having(sql`(${sql.parens($booleanFilter.expression)} ${infix5()} ${$booleanFilter.placeholder(val, TYPES.int)})`);
      }
    },
    lessThanOrEqualTo: {
      applyPlan($booleanFilter, input) {
        const val = input.get();
        $booleanFilter.having(sql`(${sql.parens($booleanFilter.expression)} ${infix6()} ${$booleanFilter.placeholder(val, TYPES.int)})`);
      }
    }
  },
  HavingDatetimeFilter: {
    equalTo: {
      applyPlan($booleanFilter, input) {
        const val = input.get();
        $booleanFilter.having(sql`(${sql.parens($booleanFilter.expression)} ${infix7()} ${$booleanFilter.placeholder(val, TYPES.timestamptz)})`);
      }
    },
    notEqualTo: {
      applyPlan($booleanFilter, input) {
        const val = input.get();
        $booleanFilter.having(sql`(${sql.parens($booleanFilter.expression)} ${infix8()} ${$booleanFilter.placeholder(val, TYPES.timestamptz)})`);
      }
    },
    greaterThan: {
      applyPlan($booleanFilter, input) {
        const val = input.get();
        $booleanFilter.having(sql`(${sql.parens($booleanFilter.expression)} ${infix9()} ${$booleanFilter.placeholder(val, TYPES.timestamptz)})`);
      }
    },
    greaterThanOrEqualTo: {
      applyPlan($booleanFilter, input) {
        const val = input.get();
        $booleanFilter.having(sql`(${sql.parens($booleanFilter.expression)} ${infix10()} ${$booleanFilter.placeholder(val, TYPES.timestamptz)})`);
      }
    },
    lessThan: {
      applyPlan($booleanFilter, input) {
        const val = input.get();
        $booleanFilter.having(sql`(${sql.parens($booleanFilter.expression)} ${infix11()} ${$booleanFilter.placeholder(val, TYPES.timestamptz)})`);
      }
    },
    lessThanOrEqualTo: {
      applyPlan($booleanFilter, input) {
        const val = input.get();
        $booleanFilter.having(sql`(${sql.parens($booleanFilter.expression)} ${infix12()} ${$booleanFilter.placeholder(val, TYPES.timestamptz)})`);
      }
    }
  },
  UpvoteHavingDistinctCountInput: {
    rowId: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("id")}`,
          aggregateExpression = spec2.sqlAggregateWrap(attributeExpression, spec_upvote.attributes.id.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = spec2.sqlAggregateWrap(attributeExpression, spec_upvote.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    }
  },
  UpvoteHavingMinInput: {
    rowId: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("id")}`,
          aggregateExpression = spec3.sqlAggregateWrap(attributeExpression, spec_upvote.attributes.id.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = spec3.sqlAggregateWrap(attributeExpression, spec_upvote.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    }
  },
  UpvoteHavingMaxInput: {
    rowId: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("id")}`,
          aggregateExpression = spec4.sqlAggregateWrap(attributeExpression, spec_upvote.attributes.id.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = spec4.sqlAggregateWrap(attributeExpression, spec_upvote.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    }
  },
  UpvoteHavingAverageInput: {
    rowId: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("id")}`,
          aggregateExpression = spec5.sqlAggregateWrap(attributeExpression, spec_upvote.attributes.id.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = spec5.sqlAggregateWrap(attributeExpression, spec_upvote.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    }
  },
  UpvoteHavingStddevSampleInput: {
    rowId: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("id")}`,
          aggregateExpression = spec6.sqlAggregateWrap(attributeExpression, spec_upvote.attributes.id.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = spec6.sqlAggregateWrap(attributeExpression, spec_upvote.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    }
  },
  UpvoteHavingStddevPopulationInput: {
    rowId: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("id")}`,
          aggregateExpression = spec7.sqlAggregateWrap(attributeExpression, spec_upvote.attributes.id.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = spec7.sqlAggregateWrap(attributeExpression, spec_upvote.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    }
  },
  UpvoteHavingVarianceSampleInput: {
    rowId: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("id")}`,
          aggregateExpression = spec8.sqlAggregateWrap(attributeExpression, spec_upvote.attributes.id.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = spec8.sqlAggregateWrap(attributeExpression, spec_upvote.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    }
  },
  UpvoteHavingVariancePopulationInput: {
    rowId: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("id")}`,
          aggregateExpression = spec9.sqlAggregateWrap(attributeExpression, spec_upvote.attributes.id.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = spec9.sqlAggregateWrap(attributeExpression, spec_upvote.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    }
  },
  UpvoteOrderBy: {
    NATURAL: {
      applyPlan() {}
    },
    PRIMARY_KEY_ASC: {
      applyPlan(step) {
        upvoteUniques[0].attributes.forEach(attributeName => {
          const attribute = upvoteCodec.attributes[attributeName];
          step.orderBy({
            codec: attribute.codec,
            fragment: sql`${step}.${sql.identifier(attributeName)}`,
            direction: "ASC",
            ...(undefined != null ? {
              nulls: undefined ? "LAST" : "FIRST"
            } : null)
          });
        });
        step.setOrderIsUnique();
      }
    },
    PRIMARY_KEY_DESC: {
      applyPlan(step) {
        upvoteUniques[0].attributes.forEach(attributeName => {
          const attribute = upvoteCodec.attributes[attributeName];
          step.orderBy({
            codec: attribute.codec,
            fragment: sql`${step}.${sql.identifier(attributeName)}`,
            direction: "DESC",
            ...(undefined != null ? {
              nulls: undefined ? "LAST" : "FIRST"
            } : null)
          });
        });
        step.setOrderIsUnique();
      }
    },
    ID_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "id",
          direction: "ASC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (true) plan.setOrderIsUnique();
      }
    },
    ID_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "id",
          direction: "DESC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (true) plan.setOrderIsUnique();
      }
    },
    CREATED_AT_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "created_at",
          direction: "ASC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (false) plan.setOrderIsUnique();
      }
    },
    CREATED_AT_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "created_at",
          direction: "DESC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (false) plan.setOrderIsUnique();
      }
    }
  },
  UpvoteCondition: {
    rowId: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) $condition.where({
          type: "attribute",
          attribute: "id",
          callback(expression) {
            return sql`${expression} is null`;
          }
        });else $condition.where({
          type: "attribute",
          attribute: "id",
          callback(expression) {
            return sql`${expression} = ${$condition.placeholder(val.get(), spec_upvote.attributes.id.codec)}`;
          }
        });
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    createdAt: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) $condition.where({
          type: "attribute",
          attribute: "created_at",
          callback(expression) {
            return sql`${expression} is null`;
          }
        });else $condition.where({
          type: "attribute",
          attribute: "created_at",
          callback(expression) {
            return sql`${expression} = ${$condition.placeholder(val.get(), spec_upvote.attributes.created_at.codec)}`;
          }
        });
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  UpvoteFilter: {
    rowId: {
      applyPlan($where, fieldArgs) {
        const $raw = fieldArgs.getRaw();
        if ($raw.evalIs(void 0)) return;
        if (!false && "evalIsEmpty" in $raw && $raw.evalIsEmpty()) throw Object.assign(new Error("Empty objects are forbidden in filter argument input."), {});
        if (!false && $raw.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $col = new PgConditionStep($where);
        $col.extensions.pgFilterAttribute = colSpec;
        fieldArgs.apply($col);
      }
    },
    createdAt: {
      applyPlan($where, fieldArgs) {
        const $raw = fieldArgs.getRaw();
        if ($raw.evalIs(void 0)) return;
        if (!false && "evalIsEmpty" in $raw && $raw.evalIsEmpty()) throw Object.assign(new Error("Empty objects are forbidden in filter argument input."), {});
        if (!false && $raw.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $col = new PgConditionStep($where);
        $col.extensions.pgFilterAttribute = colSpec2;
        fieldArgs.apply($col);
      }
    },
    and: {
      applyPlan($where, fieldArgs) {
        assertAllowed6(fieldArgs, "list");
        const $and = $where.andPlan();
        fieldArgs.apply($and);
      }
    },
    or: {
      applyPlan($where, fieldArgs) {
        assertAllowed6(fieldArgs, "list");
        const $or = $where.orPlan();
        fieldArgs.apply(() => $or.andPlan());
      }
    },
    not: {
      applyPlan($where, fieldArgs) {
        assertAllowed6(fieldArgs, "object");
        const $and = $where.notPlan().andPlan();
        fieldArgs.apply($and);
      }
    }
  },
  IntFilter: {
    isNull: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to \`postgraphile-plugin-connection-filter\` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            attributeName,
            attribute,
            codec,
            expression
          } = $where.extensions.pgFilterAttribute,
          sourceAlias = attribute ? attribute.expression ? attribute.expression($where.alias) : sql`${$where.alias}.${sql.identifier(attributeName)}` : expression ? expression : $where.alias,
          sourceCodec = codec ?? attribute.codec,
          [sqlIdentifier, identifierCodec] = undefined ? undefined(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = undefined ? lambda($input, undefined) : $input,
          inputCodec = resolveInputCodec ? resolveInputCodec(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = resolveSqlValue ? resolveSqlValue($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve(sqlIdentifier, sqlValue, $input, $where);
        $where.where(fragment);
      }
    },
    equalTo: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to \`postgraphile-plugin-connection-filter\` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            attributeName,
            attribute,
            codec,
            expression
          } = $where.extensions.pgFilterAttribute,
          sourceAlias = attribute ? attribute.expression ? attribute.expression($where.alias) : sql`${$where.alias}.${sql.identifier(attributeName)}` : expression ? expression : $where.alias,
          sourceCodec = codec ?? attribute.codec,
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier ? resolveSqlIdentifier(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = undefined ? lambda($input, undefined) : $input,
          inputCodec = resolveInputCodec2 ? resolveInputCodec2(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = undefined ? undefined($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve2(sqlIdentifier, sqlValue, $input, $where);
        $where.where(fragment);
      }
    },
    notEqualTo: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to \`postgraphile-plugin-connection-filter\` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            attributeName,
            attribute,
            codec,
            expression
          } = $where.extensions.pgFilterAttribute,
          sourceAlias = attribute ? attribute.expression ? attribute.expression($where.alias) : sql`${$where.alias}.${sql.identifier(attributeName)}` : expression ? expression : $where.alias,
          sourceCodec = codec ?? attribute.codec,
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier ? resolveSqlIdentifier(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = undefined ? lambda($input, undefined) : $input,
          inputCodec = resolveInputCodec2 ? resolveInputCodec2(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = undefined ? undefined($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve3(sqlIdentifier, sqlValue, $input, $where);
        $where.where(fragment);
      }
    },
    distinctFrom: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to \`postgraphile-plugin-connection-filter\` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            attributeName,
            attribute,
            codec,
            expression
          } = $where.extensions.pgFilterAttribute,
          sourceAlias = attribute ? attribute.expression ? attribute.expression($where.alias) : sql`${$where.alias}.${sql.identifier(attributeName)}` : expression ? expression : $where.alias,
          sourceCodec = codec ?? attribute.codec,
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier ? resolveSqlIdentifier(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = undefined ? lambda($input, undefined) : $input,
          inputCodec = resolveInputCodec2 ? resolveInputCodec2(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = undefined ? undefined($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve4(sqlIdentifier, sqlValue, $input, $where);
        $where.where(fragment);
      }
    },
    notDistinctFrom: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to \`postgraphile-plugin-connection-filter\` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            attributeName,
            attribute,
            codec,
            expression
          } = $where.extensions.pgFilterAttribute,
          sourceAlias = attribute ? attribute.expression ? attribute.expression($where.alias) : sql`${$where.alias}.${sql.identifier(attributeName)}` : expression ? expression : $where.alias,
          sourceCodec = codec ?? attribute.codec,
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier ? resolveSqlIdentifier(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = undefined ? lambda($input, undefined) : $input,
          inputCodec = resolveInputCodec2 ? resolveInputCodec2(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = undefined ? undefined($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve5(sqlIdentifier, sqlValue, $input, $where);
        $where.where(fragment);
      }
    },
    in: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to \`postgraphile-plugin-connection-filter\` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            attributeName,
            attribute,
            codec,
            expression
          } = $where.extensions.pgFilterAttribute,
          sourceAlias = attribute ? attribute.expression ? attribute.expression($where.alias) : sql`${$where.alias}.${sql.identifier(attributeName)}` : expression ? expression : $where.alias,
          sourceCodec = codec ?? attribute.codec,
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier ? resolveSqlIdentifier(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = undefined ? lambda($input, undefined) : $input,
          inputCodec = resolveInputCodec3 ? resolveInputCodec3(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = undefined ? undefined($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve6(sqlIdentifier, sqlValue, $input, $where);
        $where.where(fragment);
      }
    },
    notIn: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to \`postgraphile-plugin-connection-filter\` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            attributeName,
            attribute,
            codec,
            expression
          } = $where.extensions.pgFilterAttribute,
          sourceAlias = attribute ? attribute.expression ? attribute.expression($where.alias) : sql`${$where.alias}.${sql.identifier(attributeName)}` : expression ? expression : $where.alias,
          sourceCodec = codec ?? attribute.codec,
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier ? resolveSqlIdentifier(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = undefined ? lambda($input, undefined) : $input,
          inputCodec = resolveInputCodec3 ? resolveInputCodec3(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = undefined ? undefined($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve7(sqlIdentifier, sqlValue, $input, $where);
        $where.where(fragment);
      }
    },
    lessThan: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to \`postgraphile-plugin-connection-filter\` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            attributeName,
            attribute,
            codec,
            expression
          } = $where.extensions.pgFilterAttribute,
          sourceAlias = attribute ? attribute.expression ? attribute.expression($where.alias) : sql`${$where.alias}.${sql.identifier(attributeName)}` : expression ? expression : $where.alias,
          sourceCodec = codec ?? attribute.codec,
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier ? resolveSqlIdentifier(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = undefined ? lambda($input, undefined) : $input,
          inputCodec = resolveInputCodec2 ? resolveInputCodec2(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = undefined ? undefined($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve8(sqlIdentifier, sqlValue, $input, $where);
        $where.where(fragment);
      }
    },
    lessThanOrEqualTo: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to \`postgraphile-plugin-connection-filter\` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            attributeName,
            attribute,
            codec,
            expression
          } = $where.extensions.pgFilterAttribute,
          sourceAlias = attribute ? attribute.expression ? attribute.expression($where.alias) : sql`${$where.alias}.${sql.identifier(attributeName)}` : expression ? expression : $where.alias,
          sourceCodec = codec ?? attribute.codec,
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier ? resolveSqlIdentifier(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = undefined ? lambda($input, undefined) : $input,
          inputCodec = resolveInputCodec2 ? resolveInputCodec2(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = undefined ? undefined($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve9(sqlIdentifier, sqlValue, $input, $where);
        $where.where(fragment);
      }
    },
    greaterThan: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to \`postgraphile-plugin-connection-filter\` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            attributeName,
            attribute,
            codec,
            expression
          } = $where.extensions.pgFilterAttribute,
          sourceAlias = attribute ? attribute.expression ? attribute.expression($where.alias) : sql`${$where.alias}.${sql.identifier(attributeName)}` : expression ? expression : $where.alias,
          sourceCodec = codec ?? attribute.codec,
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier ? resolveSqlIdentifier(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = undefined ? lambda($input, undefined) : $input,
          inputCodec = resolveInputCodec2 ? resolveInputCodec2(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = undefined ? undefined($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve10(sqlIdentifier, sqlValue, $input, $where);
        $where.where(fragment);
      }
    },
    greaterThanOrEqualTo: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to \`postgraphile-plugin-connection-filter\` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            attributeName,
            attribute,
            codec,
            expression
          } = $where.extensions.pgFilterAttribute,
          sourceAlias = attribute ? attribute.expression ? attribute.expression($where.alias) : sql`${$where.alias}.${sql.identifier(attributeName)}` : expression ? expression : $where.alias,
          sourceCodec = codec ?? attribute.codec,
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier ? resolveSqlIdentifier(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = undefined ? lambda($input, undefined) : $input,
          inputCodec = resolveInputCodec2 ? resolveInputCodec2(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = undefined ? undefined($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve11(sqlIdentifier, sqlValue, $input, $where);
        $where.where(fragment);
      }
    }
  },
  DatetimeFilter: {
    isNull: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to \`postgraphile-plugin-connection-filter\` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            attributeName,
            attribute,
            codec,
            expression
          } = $where.extensions.pgFilterAttribute,
          sourceAlias = attribute ? attribute.expression ? attribute.expression($where.alias) : sql`${$where.alias}.${sql.identifier(attributeName)}` : expression ? expression : $where.alias,
          sourceCodec = codec ?? attribute.codec,
          [sqlIdentifier, identifierCodec] = undefined ? undefined(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = undefined ? lambda($input, undefined) : $input,
          inputCodec = resolveInputCodec4 ? resolveInputCodec4(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = resolveSqlValue2 ? resolveSqlValue2($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve12(sqlIdentifier, sqlValue, $input, $where);
        $where.where(fragment);
      }
    },
    equalTo: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to \`postgraphile-plugin-connection-filter\` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            attributeName,
            attribute,
            codec,
            expression
          } = $where.extensions.pgFilterAttribute,
          sourceAlias = attribute ? attribute.expression ? attribute.expression($where.alias) : sql`${$where.alias}.${sql.identifier(attributeName)}` : expression ? expression : $where.alias,
          sourceCodec = codec ?? attribute.codec,
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier2 ? resolveSqlIdentifier2(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = undefined ? lambda($input, undefined) : $input,
          inputCodec = resolveInputCodec5 ? resolveInputCodec5(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = undefined ? undefined($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve13(sqlIdentifier, sqlValue, $input, $where);
        $where.where(fragment);
      }
    },
    notEqualTo: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to \`postgraphile-plugin-connection-filter\` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            attributeName,
            attribute,
            codec,
            expression
          } = $where.extensions.pgFilterAttribute,
          sourceAlias = attribute ? attribute.expression ? attribute.expression($where.alias) : sql`${$where.alias}.${sql.identifier(attributeName)}` : expression ? expression : $where.alias,
          sourceCodec = codec ?? attribute.codec,
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier2 ? resolveSqlIdentifier2(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = undefined ? lambda($input, undefined) : $input,
          inputCodec = resolveInputCodec5 ? resolveInputCodec5(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = undefined ? undefined($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve14(sqlIdentifier, sqlValue, $input, $where);
        $where.where(fragment);
      }
    },
    distinctFrom: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to \`postgraphile-plugin-connection-filter\` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            attributeName,
            attribute,
            codec,
            expression
          } = $where.extensions.pgFilterAttribute,
          sourceAlias = attribute ? attribute.expression ? attribute.expression($where.alias) : sql`${$where.alias}.${sql.identifier(attributeName)}` : expression ? expression : $where.alias,
          sourceCodec = codec ?? attribute.codec,
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier2 ? resolveSqlIdentifier2(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = undefined ? lambda($input, undefined) : $input,
          inputCodec = resolveInputCodec5 ? resolveInputCodec5(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = undefined ? undefined($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve15(sqlIdentifier, sqlValue, $input, $where);
        $where.where(fragment);
      }
    },
    notDistinctFrom: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to \`postgraphile-plugin-connection-filter\` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            attributeName,
            attribute,
            codec,
            expression
          } = $where.extensions.pgFilterAttribute,
          sourceAlias = attribute ? attribute.expression ? attribute.expression($where.alias) : sql`${$where.alias}.${sql.identifier(attributeName)}` : expression ? expression : $where.alias,
          sourceCodec = codec ?? attribute.codec,
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier2 ? resolveSqlIdentifier2(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = undefined ? lambda($input, undefined) : $input,
          inputCodec = resolveInputCodec5 ? resolveInputCodec5(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = undefined ? undefined($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve16(sqlIdentifier, sqlValue, $input, $where);
        $where.where(fragment);
      }
    },
    in: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to \`postgraphile-plugin-connection-filter\` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            attributeName,
            attribute,
            codec,
            expression
          } = $where.extensions.pgFilterAttribute,
          sourceAlias = attribute ? attribute.expression ? attribute.expression($where.alias) : sql`${$where.alias}.${sql.identifier(attributeName)}` : expression ? expression : $where.alias,
          sourceCodec = codec ?? attribute.codec,
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier2 ? resolveSqlIdentifier2(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = undefined ? lambda($input, undefined) : $input,
          inputCodec = resolveInputCodec6 ? resolveInputCodec6(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = undefined ? undefined($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve17(sqlIdentifier, sqlValue, $input, $where);
        $where.where(fragment);
      }
    },
    notIn: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to \`postgraphile-plugin-connection-filter\` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            attributeName,
            attribute,
            codec,
            expression
          } = $where.extensions.pgFilterAttribute,
          sourceAlias = attribute ? attribute.expression ? attribute.expression($where.alias) : sql`${$where.alias}.${sql.identifier(attributeName)}` : expression ? expression : $where.alias,
          sourceCodec = codec ?? attribute.codec,
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier2 ? resolveSqlIdentifier2(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = undefined ? lambda($input, undefined) : $input,
          inputCodec = resolveInputCodec6 ? resolveInputCodec6(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = undefined ? undefined($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve18(sqlIdentifier, sqlValue, $input, $where);
        $where.where(fragment);
      }
    },
    lessThan: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to \`postgraphile-plugin-connection-filter\` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            attributeName,
            attribute,
            codec,
            expression
          } = $where.extensions.pgFilterAttribute,
          sourceAlias = attribute ? attribute.expression ? attribute.expression($where.alias) : sql`${$where.alias}.${sql.identifier(attributeName)}` : expression ? expression : $where.alias,
          sourceCodec = codec ?? attribute.codec,
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier2 ? resolveSqlIdentifier2(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = undefined ? lambda($input, undefined) : $input,
          inputCodec = resolveInputCodec5 ? resolveInputCodec5(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = undefined ? undefined($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve19(sqlIdentifier, sqlValue, $input, $where);
        $where.where(fragment);
      }
    },
    lessThanOrEqualTo: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to \`postgraphile-plugin-connection-filter\` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            attributeName,
            attribute,
            codec,
            expression
          } = $where.extensions.pgFilterAttribute,
          sourceAlias = attribute ? attribute.expression ? attribute.expression($where.alias) : sql`${$where.alias}.${sql.identifier(attributeName)}` : expression ? expression : $where.alias,
          sourceCodec = codec ?? attribute.codec,
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier2 ? resolveSqlIdentifier2(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = undefined ? lambda($input, undefined) : $input,
          inputCodec = resolveInputCodec5 ? resolveInputCodec5(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = undefined ? undefined($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve20(sqlIdentifier, sqlValue, $input, $where);
        $where.where(fragment);
      }
    },
    greaterThan: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to \`postgraphile-plugin-connection-filter\` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            attributeName,
            attribute,
            codec,
            expression
          } = $where.extensions.pgFilterAttribute,
          sourceAlias = attribute ? attribute.expression ? attribute.expression($where.alias) : sql`${$where.alias}.${sql.identifier(attributeName)}` : expression ? expression : $where.alias,
          sourceCodec = codec ?? attribute.codec,
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier2 ? resolveSqlIdentifier2(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = undefined ? lambda($input, undefined) : $input,
          inputCodec = resolveInputCodec5 ? resolveInputCodec5(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = undefined ? undefined($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve21(sqlIdentifier, sqlValue, $input, $where);
        $where.where(fragment);
      }
    },
    greaterThanOrEqualTo: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to \`postgraphile-plugin-connection-filter\` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            attributeName,
            attribute,
            codec,
            expression
          } = $where.extensions.pgFilterAttribute,
          sourceAlias = attribute ? attribute.expression ? attribute.expression($where.alias) : sql`${$where.alias}.${sql.identifier(attributeName)}` : expression ? expression : $where.alias,
          sourceCodec = codec ?? attribute.codec,
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier2 ? resolveSqlIdentifier2(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = undefined ? lambda($input, undefined) : $input,
          inputCodec = resolveInputCodec5 ? resolveInputCodec5(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = undefined ? undefined($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve22(sqlIdentifier, sqlValue, $input, $where);
        $where.where(fragment);
      }
    }
  },
  UserConnection: {
    __assertStep: ConnectionStep,
    nodes($connection) {
      return $connection.nodes();
    },
    edges($connection) {
      return $connection.edges();
    },
    pageInfo($connection) {
      return $connection.pageInfo();
    },
    totalCount($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint);
    },
    aggregates($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").single();
    },
    groupedAggregates: {
      plan($connection) {
        return $connection.cloneSubplanWithoutPagination("aggregate");
      },
      args: {
        groupBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_$parent, $pgSelect, input) {
            var _a, _b;
            const val = input.getRaw().eval();
            if (!Array.isArray(val)) throw new Error("Invalid!");
            for (const group of val) {
              const config = getEnumValueConfig(UserGroupBy, group),
                plan = (_b = (_a = config === null || config === void 0 ? void 0 : config.extensions) === null || _a === void 0 ? void 0 : _a.grafast) === null || _b === void 0 ? void 0 : _b.applyPlan;
              if (typeof plan === "function") plan($pgSelect);
            }
            return null;
          }
        },
        having: {
          autoApplyAfterParentPlan: true,
          applyPlan(_$parent, $pgSelect) {
            return $pgSelect.havingPlan();
          }
        }
      }
    }
  },
  UserEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  UserAggregates: {
    __assertStep: assertPgClassSingleStep,
    keys($pgSelectSingle) {
      const groups = $pgSelectSingle.getClassStep().getGroups();
      if (groups.length > 0) return $pgSelectSingle.select(sql`json_build_array(${sql.join(groups.map(g => g.fragment), ", ")})`, TYPES.json);else return constant(null);
    },
    sum($pgSelectSingle) {
      return $pgSelectSingle;
    },
    distinctCount($pgSelectSingle) {
      return $pgSelectSingle;
    },
    min($pgSelectSingle) {
      return $pgSelectSingle;
    },
    max($pgSelectSingle) {
      return $pgSelectSingle;
    },
    average($pgSelectSingle) {
      return $pgSelectSingle;
    },
    stddevSample($pgSelectSingle) {
      return $pgSelectSingle;
    },
    stddevPopulation($pgSelectSingle) {
      return $pgSelectSingle;
    },
    varianceSample($pgSelectSingle) {
      return $pgSelectSingle;
    },
    variancePopulation($pgSelectSingle) {
      return $pgSelectSingle;
    }
  },
  UserSumAggregates: {
    rowId($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("id")}`,
        sqlAggregate = spec.sqlAggregateWrap(sqlAttribute, TYPES.int);
      return $pgSelectSingle.select(sqlAggregate, TYPES.bigint);
    }
  },
  UserDistinctCountAggregates: {
    rowId($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("id")}`,
        sqlAggregate = spec2.sqlAggregateWrap(sqlAttribute, TYPES.int);
      return $pgSelectSingle.select(sqlAggregate, TYPES.bigint);
    },
    createdAt($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("created_at")}`,
        sqlAggregate = spec2.sqlAggregateWrap(sqlAttribute, TYPES.timestamp);
      return $pgSelectSingle.select(sqlAggregate, TYPES.bigint);
    },
    walletAddress($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("wallet_address")}`,
        sqlAggregate = spec2.sqlAggregateWrap(sqlAttribute, TYPES.varchar);
      return $pgSelectSingle.select(sqlAggregate, TYPES.bigint);
    },
    posts($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("posts")}`,
        sqlAggregate = spec2.sqlAggregateWrap(sqlAttribute, TYPES.text);
      return $pgSelectSingle.select(sqlAggregate, TYPES.bigint);
    },
    upvotes($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("upvotes")}`,
        sqlAggregate = spec2.sqlAggregateWrap(sqlAttribute, TYPES.text);
      return $pgSelectSingle.select(sqlAggregate, TYPES.bigint);
    }
  },
  UserMinAggregates: {
    rowId($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("id")}`,
        sqlAggregate = spec3.sqlAggregateWrap(sqlAttribute, TYPES.int);
      return $pgSelectSingle.select(sqlAggregate, TYPES.int);
    }
  },
  UserMaxAggregates: {
    rowId($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("id")}`,
        sqlAggregate = spec4.sqlAggregateWrap(sqlAttribute, TYPES.int);
      return $pgSelectSingle.select(sqlAggregate, TYPES.int);
    }
  },
  UserAverageAggregates: {
    rowId($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("id")}`,
        sqlAggregate = spec5.sqlAggregateWrap(sqlAttribute, TYPES.int);
      return $pgSelectSingle.select(sqlAggregate, TYPES.numeric);
    }
  },
  UserStddevSampleAggregates: {
    rowId($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("id")}`,
        sqlAggregate = spec6.sqlAggregateWrap(sqlAttribute, TYPES.int);
      return $pgSelectSingle.select(sqlAggregate, TYPES.numeric);
    }
  },
  UserStddevPopulationAggregates: {
    rowId($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("id")}`,
        sqlAggregate = spec7.sqlAggregateWrap(sqlAttribute, TYPES.int);
      return $pgSelectSingle.select(sqlAggregate, TYPES.numeric);
    }
  },
  UserVarianceSampleAggregates: {
    rowId($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("id")}`,
        sqlAggregate = spec8.sqlAggregateWrap(sqlAttribute, TYPES.int);
      return $pgSelectSingle.select(sqlAggregate, TYPES.numeric);
    }
  },
  UserVariancePopulationAggregates: {
    rowId($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("id")}`,
        sqlAggregate = spec9.sqlAggregateWrap(sqlAttribute, TYPES.int);
      return $pgSelectSingle.select(sqlAggregate, TYPES.numeric);
    }
  },
  UserGroupBy: {
    CREATED_AT: {
      applyPlan: UserGroupBy_extensions_grafast_applyPlan
    },
    CREATED_AT_TRUNCATED_TO_HOUR: {
      applyPlan: UserGroupBy_extensions_grafast_applyPlan2
    },
    CREATED_AT_TRUNCATED_TO_DAY: {
      applyPlan: UserGroupBy_extensions_grafast_applyPlan3
    },
    WALLET_ADDRESS: {
      applyPlan: UserGroupBy_extensions_grafast_applyPlan4
    },
    POSTS: {
      applyPlan: UserGroupBy_extensions_grafast_applyPlan5
    },
    UPVOTES: {
      applyPlan: UserGroupBy_extensions_grafast_applyPlan6
    }
  },
  UserHavingInput: {
    AND: {
      applyPlan($where, input) {
        input.apply($where);
        return null;
      }
    },
    OR: {
      applyPlan($where, input) {
        const $or = new PgOrFilterStep($where);
        input.apply($or);
        return null;
      }
    },
    sum: {
      applyPlan($having) {
        return $having;
      }
    },
    distinctCount: {
      applyPlan($having) {
        return $having;
      }
    },
    min: {
      applyPlan($having) {
        return $having;
      }
    },
    max: {
      applyPlan($having) {
        return $having;
      }
    },
    average: {
      applyPlan($having) {
        return $having;
      }
    },
    stddevSample: {
      applyPlan($having) {
        return $having;
      }
    },
    stddevPopulation: {
      applyPlan($having) {
        return $having;
      }
    },
    varianceSample: {
      applyPlan($having) {
        return $having;
      }
    },
    variancePopulation: {
      applyPlan($having) {
        return $having;
      }
    }
  },
  UserHavingSumInput: {
    rowId: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("id")}`,
          aggregateExpression = spec.sqlAggregateWrap(attributeExpression, spec_user.attributes.id.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = spec.sqlAggregateWrap(attributeExpression, spec_user.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    }
  },
  UserHavingDistinctCountInput: {
    rowId: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("id")}`,
          aggregateExpression = spec2.sqlAggregateWrap(attributeExpression, spec_user.attributes.id.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = spec2.sqlAggregateWrap(attributeExpression, spec_user.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    }
  },
  UserHavingMinInput: {
    rowId: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("id")}`,
          aggregateExpression = spec3.sqlAggregateWrap(attributeExpression, spec_user.attributes.id.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = spec3.sqlAggregateWrap(attributeExpression, spec_user.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    }
  },
  UserHavingMaxInput: {
    rowId: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("id")}`,
          aggregateExpression = spec4.sqlAggregateWrap(attributeExpression, spec_user.attributes.id.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = spec4.sqlAggregateWrap(attributeExpression, spec_user.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    }
  },
  UserHavingAverageInput: {
    rowId: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("id")}`,
          aggregateExpression = spec5.sqlAggregateWrap(attributeExpression, spec_user.attributes.id.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = spec5.sqlAggregateWrap(attributeExpression, spec_user.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    }
  },
  UserHavingStddevSampleInput: {
    rowId: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("id")}`,
          aggregateExpression = spec6.sqlAggregateWrap(attributeExpression, spec_user.attributes.id.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = spec6.sqlAggregateWrap(attributeExpression, spec_user.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    }
  },
  UserHavingStddevPopulationInput: {
    rowId: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("id")}`,
          aggregateExpression = spec7.sqlAggregateWrap(attributeExpression, spec_user.attributes.id.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = spec7.sqlAggregateWrap(attributeExpression, spec_user.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    }
  },
  UserHavingVarianceSampleInput: {
    rowId: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("id")}`,
          aggregateExpression = spec8.sqlAggregateWrap(attributeExpression, spec_user.attributes.id.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = spec8.sqlAggregateWrap(attributeExpression, spec_user.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    }
  },
  UserHavingVariancePopulationInput: {
    rowId: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("id")}`,
          aggregateExpression = spec9.sqlAggregateWrap(attributeExpression, spec_user.attributes.id.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = spec9.sqlAggregateWrap(attributeExpression, spec_user.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    }
  },
  UserOrderBy: {
    NATURAL: {
      applyPlan() {}
    },
    PRIMARY_KEY_ASC: {
      applyPlan(step) {
        userUniques[0].attributes.forEach(attributeName => {
          const attribute = userCodec.attributes[attributeName];
          step.orderBy({
            codec: attribute.codec,
            fragment: sql`${step}.${sql.identifier(attributeName)}`,
            direction: "ASC",
            ...(undefined != null ? {
              nulls: undefined ? "LAST" : "FIRST"
            } : null)
          });
        });
        step.setOrderIsUnique();
      }
    },
    PRIMARY_KEY_DESC: {
      applyPlan(step) {
        userUniques[0].attributes.forEach(attributeName => {
          const attribute = userCodec.attributes[attributeName];
          step.orderBy({
            codec: attribute.codec,
            fragment: sql`${step}.${sql.identifier(attributeName)}`,
            direction: "DESC",
            ...(undefined != null ? {
              nulls: undefined ? "LAST" : "FIRST"
            } : null)
          });
        });
        step.setOrderIsUnique();
      }
    },
    ID_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "id",
          direction: "ASC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (true) plan.setOrderIsUnique();
      }
    },
    ID_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "id",
          direction: "DESC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (true) plan.setOrderIsUnique();
      }
    },
    CREATED_AT_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "created_at",
          direction: "ASC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (false) plan.setOrderIsUnique();
      }
    },
    CREATED_AT_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "created_at",
          direction: "DESC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (false) plan.setOrderIsUnique();
      }
    },
    WALLET_ADDRESS_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "wallet_address",
          direction: "ASC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (false) plan.setOrderIsUnique();
      }
    },
    WALLET_ADDRESS_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "wallet_address",
          direction: "DESC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (false) plan.setOrderIsUnique();
      }
    },
    POSTS_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "posts",
          direction: "ASC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (false) plan.setOrderIsUnique();
      }
    },
    POSTS_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "posts",
          direction: "DESC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (false) plan.setOrderIsUnique();
      }
    },
    UPVOTES_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "upvotes",
          direction: "ASC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (false) plan.setOrderIsUnique();
      }
    },
    UPVOTES_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "upvotes",
          direction: "DESC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (false) plan.setOrderIsUnique();
      }
    }
  },
  UserCondition: {
    rowId: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) $condition.where({
          type: "attribute",
          attribute: "id",
          callback(expression) {
            return sql`${expression} is null`;
          }
        });else $condition.where({
          type: "attribute",
          attribute: "id",
          callback(expression) {
            return sql`${expression} = ${$condition.placeholder(val.get(), spec_user.attributes.id.codec)}`;
          }
        });
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    createdAt: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) $condition.where({
          type: "attribute",
          attribute: "created_at",
          callback(expression) {
            return sql`${expression} is null`;
          }
        });else $condition.where({
          type: "attribute",
          attribute: "created_at",
          callback(expression) {
            return sql`${expression} = ${$condition.placeholder(val.get(), spec_user.attributes.created_at.codec)}`;
          }
        });
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    walletAddress: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) $condition.where({
          type: "attribute",
          attribute: "wallet_address",
          callback(expression) {
            return sql`${expression} is null`;
          }
        });else $condition.where({
          type: "attribute",
          attribute: "wallet_address",
          callback(expression) {
            return sql`${expression} = ${$condition.placeholder(val.get(), spec_user.attributes.wallet_address.codec)}`;
          }
        });
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    posts: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) $condition.where({
          type: "attribute",
          attribute: "posts",
          callback(expression) {
            return sql`${expression} is null`;
          }
        });else $condition.where({
          type: "attribute",
          attribute: "posts",
          callback(expression) {
            return sql`${expression} = ${$condition.placeholder(val.get(), spec_user.attributes.posts.codec)}`;
          }
        });
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    upvotes: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) $condition.where({
          type: "attribute",
          attribute: "upvotes",
          callback(expression) {
            return sql`${expression} is null`;
          }
        });else $condition.where({
          type: "attribute",
          attribute: "upvotes",
          callback(expression) {
            return sql`${expression} = ${$condition.placeholder(val.get(), spec_user.attributes.upvotes.codec)}`;
          }
        });
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  UserFilter: {
    rowId: {
      applyPlan($where, fieldArgs) {
        const $raw = fieldArgs.getRaw();
        if ($raw.evalIs(void 0)) return;
        if (!false && "evalIsEmpty" in $raw && $raw.evalIsEmpty()) throw Object.assign(new Error("Empty objects are forbidden in filter argument input."), {});
        if (!false && $raw.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $col = new PgConditionStep($where);
        $col.extensions.pgFilterAttribute = colSpec3;
        fieldArgs.apply($col);
      }
    },
    createdAt: {
      applyPlan($where, fieldArgs) {
        const $raw = fieldArgs.getRaw();
        if ($raw.evalIs(void 0)) return;
        if (!false && "evalIsEmpty" in $raw && $raw.evalIsEmpty()) throw Object.assign(new Error("Empty objects are forbidden in filter argument input."), {});
        if (!false && $raw.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $col = new PgConditionStep($where);
        $col.extensions.pgFilterAttribute = colSpec4;
        fieldArgs.apply($col);
      }
    },
    walletAddress: {
      applyPlan($where, fieldArgs) {
        const $raw = fieldArgs.getRaw();
        if ($raw.evalIs(void 0)) return;
        if (!false && "evalIsEmpty" in $raw && $raw.evalIsEmpty()) throw Object.assign(new Error("Empty objects are forbidden in filter argument input."), {});
        if (!false && $raw.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $col = new PgConditionStep($where);
        $col.extensions.pgFilterAttribute = colSpec5;
        fieldArgs.apply($col);
      }
    },
    posts: {
      applyPlan($where, fieldArgs) {
        const $raw = fieldArgs.getRaw();
        if ($raw.evalIs(void 0)) return;
        if (!false && "evalIsEmpty" in $raw && $raw.evalIsEmpty()) throw Object.assign(new Error("Empty objects are forbidden in filter argument input."), {});
        if (!false && $raw.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $col = new PgConditionStep($where);
        $col.extensions.pgFilterAttribute = colSpec6;
        fieldArgs.apply($col);
      }
    },
    upvotes: {
      applyPlan($where, fieldArgs) {
        const $raw = fieldArgs.getRaw();
        if ($raw.evalIs(void 0)) return;
        if (!false && "evalIsEmpty" in $raw && $raw.evalIsEmpty()) throw Object.assign(new Error("Empty objects are forbidden in filter argument input."), {});
        if (!false && $raw.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $col = new PgConditionStep($where);
        $col.extensions.pgFilterAttribute = colSpec7;
        fieldArgs.apply($col);
      }
    },
    and: {
      applyPlan($where, fieldArgs) {
        assertAllowed7(fieldArgs, "list");
        const $and = $where.andPlan();
        fieldArgs.apply($and);
      }
    },
    or: {
      applyPlan($where, fieldArgs) {
        assertAllowed7(fieldArgs, "list");
        const $or = $where.orPlan();
        fieldArgs.apply(() => $or.andPlan());
      }
    },
    not: {
      applyPlan($where, fieldArgs) {
        assertAllowed7(fieldArgs, "object");
        const $and = $where.notPlan().andPlan();
        fieldArgs.apply($and);
      }
    }
  },
  StringFilter: {
    isNull: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to \`postgraphile-plugin-connection-filter\` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            attributeName,
            attribute,
            codec,
            expression
          } = $where.extensions.pgFilterAttribute,
          sourceAlias = attribute ? attribute.expression ? attribute.expression($where.alias) : sql`${$where.alias}.${sql.identifier(attributeName)}` : expression ? expression : $where.alias,
          sourceCodec = codec ?? attribute.codec,
          [sqlIdentifier, identifierCodec] = undefined ? undefined(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = undefined ? lambda($input, undefined) : $input,
          inputCodec = resolveInputCodec7 ? resolveInputCodec7(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = resolveSqlValue3 ? resolveSqlValue3($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve23(sqlIdentifier, sqlValue, $input, $where);
        $where.where(fragment);
      }
    },
    equalTo: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to \`postgraphile-plugin-connection-filter\` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            attributeName,
            attribute,
            codec,
            expression
          } = $where.extensions.pgFilterAttribute,
          sourceAlias = attribute ? attribute.expression ? attribute.expression($where.alias) : sql`${$where.alias}.${sql.identifier(attributeName)}` : expression ? expression : $where.alias,
          sourceCodec = codec ?? attribute.codec,
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier3 ? resolveSqlIdentifier3(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = undefined ? lambda($input, undefined) : $input,
          inputCodec = resolveInputCodec8 ? resolveInputCodec8(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = undefined ? undefined($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve24(sqlIdentifier, sqlValue, $input, $where);
        $where.where(fragment);
      }
    },
    notEqualTo: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to \`postgraphile-plugin-connection-filter\` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            attributeName,
            attribute,
            codec,
            expression
          } = $where.extensions.pgFilterAttribute,
          sourceAlias = attribute ? attribute.expression ? attribute.expression($where.alias) : sql`${$where.alias}.${sql.identifier(attributeName)}` : expression ? expression : $where.alias,
          sourceCodec = codec ?? attribute.codec,
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier3 ? resolveSqlIdentifier3(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = undefined ? lambda($input, undefined) : $input,
          inputCodec = resolveInputCodec8 ? resolveInputCodec8(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = undefined ? undefined($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve25(sqlIdentifier, sqlValue, $input, $where);
        $where.where(fragment);
      }
    },
    distinctFrom: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to \`postgraphile-plugin-connection-filter\` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            attributeName,
            attribute,
            codec,
            expression
          } = $where.extensions.pgFilterAttribute,
          sourceAlias = attribute ? attribute.expression ? attribute.expression($where.alias) : sql`${$where.alias}.${sql.identifier(attributeName)}` : expression ? expression : $where.alias,
          sourceCodec = codec ?? attribute.codec,
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier3 ? resolveSqlIdentifier3(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = undefined ? lambda($input, undefined) : $input,
          inputCodec = resolveInputCodec8 ? resolveInputCodec8(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = undefined ? undefined($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve26(sqlIdentifier, sqlValue, $input, $where);
        $where.where(fragment);
      }
    },
    notDistinctFrom: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to \`postgraphile-plugin-connection-filter\` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            attributeName,
            attribute,
            codec,
            expression
          } = $where.extensions.pgFilterAttribute,
          sourceAlias = attribute ? attribute.expression ? attribute.expression($where.alias) : sql`${$where.alias}.${sql.identifier(attributeName)}` : expression ? expression : $where.alias,
          sourceCodec = codec ?? attribute.codec,
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier3 ? resolveSqlIdentifier3(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = undefined ? lambda($input, undefined) : $input,
          inputCodec = resolveInputCodec8 ? resolveInputCodec8(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = undefined ? undefined($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve27(sqlIdentifier, sqlValue, $input, $where);
        $where.where(fragment);
      }
    },
    in: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to \`postgraphile-plugin-connection-filter\` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            attributeName,
            attribute,
            codec,
            expression
          } = $where.extensions.pgFilterAttribute,
          sourceAlias = attribute ? attribute.expression ? attribute.expression($where.alias) : sql`${$where.alias}.${sql.identifier(attributeName)}` : expression ? expression : $where.alias,
          sourceCodec = codec ?? attribute.codec,
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier3 ? resolveSqlIdentifier3(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = undefined ? lambda($input, undefined) : $input,
          inputCodec = resolveInputCodec9 ? resolveInputCodec9(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = undefined ? undefined($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve28(sqlIdentifier, sqlValue, $input, $where);
        $where.where(fragment);
      }
    },
    notIn: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to \`postgraphile-plugin-connection-filter\` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            attributeName,
            attribute,
            codec,
            expression
          } = $where.extensions.pgFilterAttribute,
          sourceAlias = attribute ? attribute.expression ? attribute.expression($where.alias) : sql`${$where.alias}.${sql.identifier(attributeName)}` : expression ? expression : $where.alias,
          sourceCodec = codec ?? attribute.codec,
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier3 ? resolveSqlIdentifier3(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = undefined ? lambda($input, undefined) : $input,
          inputCodec = resolveInputCodec9 ? resolveInputCodec9(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = undefined ? undefined($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve29(sqlIdentifier, sqlValue, $input, $where);
        $where.where(fragment);
      }
    },
    lessThan: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to \`postgraphile-plugin-connection-filter\` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            attributeName,
            attribute,
            codec,
            expression
          } = $where.extensions.pgFilterAttribute,
          sourceAlias = attribute ? attribute.expression ? attribute.expression($where.alias) : sql`${$where.alias}.${sql.identifier(attributeName)}` : expression ? expression : $where.alias,
          sourceCodec = codec ?? attribute.codec,
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier3 ? resolveSqlIdentifier3(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = undefined ? lambda($input, undefined) : $input,
          inputCodec = resolveInputCodec8 ? resolveInputCodec8(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = undefined ? undefined($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve30(sqlIdentifier, sqlValue, $input, $where);
        $where.where(fragment);
      }
    },
    lessThanOrEqualTo: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to \`postgraphile-plugin-connection-filter\` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            attributeName,
            attribute,
            codec,
            expression
          } = $where.extensions.pgFilterAttribute,
          sourceAlias = attribute ? attribute.expression ? attribute.expression($where.alias) : sql`${$where.alias}.${sql.identifier(attributeName)}` : expression ? expression : $where.alias,
          sourceCodec = codec ?? attribute.codec,
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier3 ? resolveSqlIdentifier3(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = undefined ? lambda($input, undefined) : $input,
          inputCodec = resolveInputCodec8 ? resolveInputCodec8(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = undefined ? undefined($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve31(sqlIdentifier, sqlValue, $input, $where);
        $where.where(fragment);
      }
    },
    greaterThan: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to \`postgraphile-plugin-connection-filter\` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            attributeName,
            attribute,
            codec,
            expression
          } = $where.extensions.pgFilterAttribute,
          sourceAlias = attribute ? attribute.expression ? attribute.expression($where.alias) : sql`${$where.alias}.${sql.identifier(attributeName)}` : expression ? expression : $where.alias,
          sourceCodec = codec ?? attribute.codec,
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier3 ? resolveSqlIdentifier3(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = undefined ? lambda($input, undefined) : $input,
          inputCodec = resolveInputCodec8 ? resolveInputCodec8(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = undefined ? undefined($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve32(sqlIdentifier, sqlValue, $input, $where);
        $where.where(fragment);
      }
    },
    greaterThanOrEqualTo: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to \`postgraphile-plugin-connection-filter\` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            attributeName,
            attribute,
            codec,
            expression
          } = $where.extensions.pgFilterAttribute,
          sourceAlias = attribute ? attribute.expression ? attribute.expression($where.alias) : sql`${$where.alias}.${sql.identifier(attributeName)}` : expression ? expression : $where.alias,
          sourceCodec = codec ?? attribute.codec,
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier3 ? resolveSqlIdentifier3(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = undefined ? lambda($input, undefined) : $input,
          inputCodec = resolveInputCodec8 ? resolveInputCodec8(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = undefined ? undefined($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve33(sqlIdentifier, sqlValue, $input, $where);
        $where.where(fragment);
      }
    },
    includes: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to \`postgraphile-plugin-connection-filter\` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            attributeName,
            attribute,
            codec,
            expression
          } = $where.extensions.pgFilterAttribute,
          sourceAlias = attribute ? attribute.expression ? attribute.expression($where.alias) : sql`${$where.alias}.${sql.identifier(attributeName)}` : expression ? expression : $where.alias,
          sourceCodec = codec ?? attribute.codec,
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier3 ? resolveSqlIdentifier3(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = resolveInput ? lambda($input, resolveInput) : $input,
          inputCodec = resolveInputCodec8 ? resolveInputCodec8(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = undefined ? undefined($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve34(sqlIdentifier, sqlValue, $input, $where);
        $where.where(fragment);
      }
    },
    notIncludes: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to \`postgraphile-plugin-connection-filter\` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            attributeName,
            attribute,
            codec,
            expression
          } = $where.extensions.pgFilterAttribute,
          sourceAlias = attribute ? attribute.expression ? attribute.expression($where.alias) : sql`${$where.alias}.${sql.identifier(attributeName)}` : expression ? expression : $where.alias,
          sourceCodec = codec ?? attribute.codec,
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier3 ? resolveSqlIdentifier3(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = resolveInput2 ? lambda($input, resolveInput2) : $input,
          inputCodec = resolveInputCodec8 ? resolveInputCodec8(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = undefined ? undefined($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve35(sqlIdentifier, sqlValue, $input, $where);
        $where.where(fragment);
      }
    },
    includesInsensitive: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to \`postgraphile-plugin-connection-filter\` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            attributeName,
            attribute,
            codec,
            expression
          } = $where.extensions.pgFilterAttribute,
          sourceAlias = attribute ? attribute.expression ? attribute.expression($where.alias) : sql`${$where.alias}.${sql.identifier(attributeName)}` : expression ? expression : $where.alias,
          sourceCodec = codec ?? attribute.codec,
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier4 ? resolveSqlIdentifier4(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = resolveInput3 ? lambda($input, resolveInput3) : $input,
          inputCodec = resolveInputCodec10 ? resolveInputCodec10(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = undefined ? undefined($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve36(sqlIdentifier, sqlValue, $input, $where);
        $where.where(fragment);
      }
    },
    notIncludesInsensitive: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to \`postgraphile-plugin-connection-filter\` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            attributeName,
            attribute,
            codec,
            expression
          } = $where.extensions.pgFilterAttribute,
          sourceAlias = attribute ? attribute.expression ? attribute.expression($where.alias) : sql`${$where.alias}.${sql.identifier(attributeName)}` : expression ? expression : $where.alias,
          sourceCodec = codec ?? attribute.codec,
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier4 ? resolveSqlIdentifier4(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = resolveInput4 ? lambda($input, resolveInput4) : $input,
          inputCodec = resolveInputCodec10 ? resolveInputCodec10(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = undefined ? undefined($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve37(sqlIdentifier, sqlValue, $input, $where);
        $where.where(fragment);
      }
    },
    startsWith: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to \`postgraphile-plugin-connection-filter\` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            attributeName,
            attribute,
            codec,
            expression
          } = $where.extensions.pgFilterAttribute,
          sourceAlias = attribute ? attribute.expression ? attribute.expression($where.alias) : sql`${$where.alias}.${sql.identifier(attributeName)}` : expression ? expression : $where.alias,
          sourceCodec = codec ?? attribute.codec,
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier3 ? resolveSqlIdentifier3(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = resolveInput5 ? lambda($input, resolveInput5) : $input,
          inputCodec = resolveInputCodec8 ? resolveInputCodec8(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = undefined ? undefined($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve38(sqlIdentifier, sqlValue, $input, $where);
        $where.where(fragment);
      }
    },
    notStartsWith: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to \`postgraphile-plugin-connection-filter\` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            attributeName,
            attribute,
            codec,
            expression
          } = $where.extensions.pgFilterAttribute,
          sourceAlias = attribute ? attribute.expression ? attribute.expression($where.alias) : sql`${$where.alias}.${sql.identifier(attributeName)}` : expression ? expression : $where.alias,
          sourceCodec = codec ?? attribute.codec,
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier3 ? resolveSqlIdentifier3(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = resolveInput6 ? lambda($input, resolveInput6) : $input,
          inputCodec = resolveInputCodec8 ? resolveInputCodec8(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = undefined ? undefined($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve39(sqlIdentifier, sqlValue, $input, $where);
        $where.where(fragment);
      }
    },
    startsWithInsensitive: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to \`postgraphile-plugin-connection-filter\` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            attributeName,
            attribute,
            codec,
            expression
          } = $where.extensions.pgFilterAttribute,
          sourceAlias = attribute ? attribute.expression ? attribute.expression($where.alias) : sql`${$where.alias}.${sql.identifier(attributeName)}` : expression ? expression : $where.alias,
          sourceCodec = codec ?? attribute.codec,
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier4 ? resolveSqlIdentifier4(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = resolveInput7 ? lambda($input, resolveInput7) : $input,
          inputCodec = resolveInputCodec10 ? resolveInputCodec10(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = undefined ? undefined($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve40(sqlIdentifier, sqlValue, $input, $where);
        $where.where(fragment);
      }
    },
    notStartsWithInsensitive: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to \`postgraphile-plugin-connection-filter\` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            attributeName,
            attribute,
            codec,
            expression
          } = $where.extensions.pgFilterAttribute,
          sourceAlias = attribute ? attribute.expression ? attribute.expression($where.alias) : sql`${$where.alias}.${sql.identifier(attributeName)}` : expression ? expression : $where.alias,
          sourceCodec = codec ?? attribute.codec,
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier4 ? resolveSqlIdentifier4(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = resolveInput8 ? lambda($input, resolveInput8) : $input,
          inputCodec = resolveInputCodec10 ? resolveInputCodec10(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = undefined ? undefined($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve41(sqlIdentifier, sqlValue, $input, $where);
        $where.where(fragment);
      }
    },
    endsWith: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to \`postgraphile-plugin-connection-filter\` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            attributeName,
            attribute,
            codec,
            expression
          } = $where.extensions.pgFilterAttribute,
          sourceAlias = attribute ? attribute.expression ? attribute.expression($where.alias) : sql`${$where.alias}.${sql.identifier(attributeName)}` : expression ? expression : $where.alias,
          sourceCodec = codec ?? attribute.codec,
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier3 ? resolveSqlIdentifier3(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = resolveInput9 ? lambda($input, resolveInput9) : $input,
          inputCodec = resolveInputCodec8 ? resolveInputCodec8(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = undefined ? undefined($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve42(sqlIdentifier, sqlValue, $input, $where);
        $where.where(fragment);
      }
    },
    notEndsWith: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to \`postgraphile-plugin-connection-filter\` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            attributeName,
            attribute,
            codec,
            expression
          } = $where.extensions.pgFilterAttribute,
          sourceAlias = attribute ? attribute.expression ? attribute.expression($where.alias) : sql`${$where.alias}.${sql.identifier(attributeName)}` : expression ? expression : $where.alias,
          sourceCodec = codec ?? attribute.codec,
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier3 ? resolveSqlIdentifier3(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = resolveInput10 ? lambda($input, resolveInput10) : $input,
          inputCodec = resolveInputCodec8 ? resolveInputCodec8(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = undefined ? undefined($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve43(sqlIdentifier, sqlValue, $input, $where);
        $where.where(fragment);
      }
    },
    endsWithInsensitive: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to \`postgraphile-plugin-connection-filter\` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            attributeName,
            attribute,
            codec,
            expression
          } = $where.extensions.pgFilterAttribute,
          sourceAlias = attribute ? attribute.expression ? attribute.expression($where.alias) : sql`${$where.alias}.${sql.identifier(attributeName)}` : expression ? expression : $where.alias,
          sourceCodec = codec ?? attribute.codec,
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier4 ? resolveSqlIdentifier4(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = resolveInput11 ? lambda($input, resolveInput11) : $input,
          inputCodec = resolveInputCodec10 ? resolveInputCodec10(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = undefined ? undefined($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve44(sqlIdentifier, sqlValue, $input, $where);
        $where.where(fragment);
      }
    },
    notEndsWithInsensitive: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to \`postgraphile-plugin-connection-filter\` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            attributeName,
            attribute,
            codec,
            expression
          } = $where.extensions.pgFilterAttribute,
          sourceAlias = attribute ? attribute.expression ? attribute.expression($where.alias) : sql`${$where.alias}.${sql.identifier(attributeName)}` : expression ? expression : $where.alias,
          sourceCodec = codec ?? attribute.codec,
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier4 ? resolveSqlIdentifier4(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = resolveInput12 ? lambda($input, resolveInput12) : $input,
          inputCodec = resolveInputCodec10 ? resolveInputCodec10(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = undefined ? undefined($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve45(sqlIdentifier, sqlValue, $input, $where);
        $where.where(fragment);
      }
    },
    like: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to \`postgraphile-plugin-connection-filter\` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            attributeName,
            attribute,
            codec,
            expression
          } = $where.extensions.pgFilterAttribute,
          sourceAlias = attribute ? attribute.expression ? attribute.expression($where.alias) : sql`${$where.alias}.${sql.identifier(attributeName)}` : expression ? expression : $where.alias,
          sourceCodec = codec ?? attribute.codec,
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier3 ? resolveSqlIdentifier3(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = undefined ? lambda($input, undefined) : $input,
          inputCodec = resolveInputCodec8 ? resolveInputCodec8(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = undefined ? undefined($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve46(sqlIdentifier, sqlValue, $input, $where);
        $where.where(fragment);
      }
    },
    notLike: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to \`postgraphile-plugin-connection-filter\` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            attributeName,
            attribute,
            codec,
            expression
          } = $where.extensions.pgFilterAttribute,
          sourceAlias = attribute ? attribute.expression ? attribute.expression($where.alias) : sql`${$where.alias}.${sql.identifier(attributeName)}` : expression ? expression : $where.alias,
          sourceCodec = codec ?? attribute.codec,
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier3 ? resolveSqlIdentifier3(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = undefined ? lambda($input, undefined) : $input,
          inputCodec = resolveInputCodec8 ? resolveInputCodec8(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = undefined ? undefined($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve47(sqlIdentifier, sqlValue, $input, $where);
        $where.where(fragment);
      }
    },
    likeInsensitive: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to \`postgraphile-plugin-connection-filter\` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            attributeName,
            attribute,
            codec,
            expression
          } = $where.extensions.pgFilterAttribute,
          sourceAlias = attribute ? attribute.expression ? attribute.expression($where.alias) : sql`${$where.alias}.${sql.identifier(attributeName)}` : expression ? expression : $where.alias,
          sourceCodec = codec ?? attribute.codec,
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier4 ? resolveSqlIdentifier4(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = undefined ? lambda($input, undefined) : $input,
          inputCodec = resolveInputCodec10 ? resolveInputCodec10(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = undefined ? undefined($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve48(sqlIdentifier, sqlValue, $input, $where);
        $where.where(fragment);
      }
    },
    notLikeInsensitive: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to \`postgraphile-plugin-connection-filter\` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            attributeName,
            attribute,
            codec,
            expression
          } = $where.extensions.pgFilterAttribute,
          sourceAlias = attribute ? attribute.expression ? attribute.expression($where.alias) : sql`${$where.alias}.${sql.identifier(attributeName)}` : expression ? expression : $where.alias,
          sourceCodec = codec ?? attribute.codec,
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier4 ? resolveSqlIdentifier4(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = undefined ? lambda($input, undefined) : $input,
          inputCodec = resolveInputCodec10 ? resolveInputCodec10(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = undefined ? undefined($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve49(sqlIdentifier, sqlValue, $input, $where);
        $where.where(fragment);
      }
    },
    equalToInsensitive: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to \`postgraphile-plugin-connection-filter\` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            attributeName,
            attribute,
            codec,
            expression
          } = $where.extensions.pgFilterAttribute,
          sourceAlias = attribute ? attribute.expression ? attribute.expression($where.alias) : sql`${$where.alias}.${sql.identifier(attributeName)}` : expression ? expression : $where.alias,
          sourceCodec = codec ?? attribute.codec,
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier5 ? resolveSqlIdentifier5(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = undefined ? lambda($input, undefined) : $input,
          inputCodec = resolveInputCodec11 ? resolveInputCodec11(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = resolveSqlValue4 ? resolveSqlValue4($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve24(sqlIdentifier, sqlValue, $input, $where);
        $where.where(fragment);
      }
    },
    notEqualToInsensitive: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to \`postgraphile-plugin-connection-filter\` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            attributeName,
            attribute,
            codec,
            expression
          } = $where.extensions.pgFilterAttribute,
          sourceAlias = attribute ? attribute.expression ? attribute.expression($where.alias) : sql`${$where.alias}.${sql.identifier(attributeName)}` : expression ? expression : $where.alias,
          sourceCodec = codec ?? attribute.codec,
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier6 ? resolveSqlIdentifier6(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = undefined ? lambda($input, undefined) : $input,
          inputCodec = resolveInputCodec12 ? resolveInputCodec12(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = resolveSqlValue5 ? resolveSqlValue5($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve25(sqlIdentifier, sqlValue, $input, $where);
        $where.where(fragment);
      }
    },
    distinctFromInsensitive: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to \`postgraphile-plugin-connection-filter\` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            attributeName,
            attribute,
            codec,
            expression
          } = $where.extensions.pgFilterAttribute,
          sourceAlias = attribute ? attribute.expression ? attribute.expression($where.alias) : sql`${$where.alias}.${sql.identifier(attributeName)}` : expression ? expression : $where.alias,
          sourceCodec = codec ?? attribute.codec,
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier7 ? resolveSqlIdentifier7(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = undefined ? lambda($input, undefined) : $input,
          inputCodec = resolveInputCodec13 ? resolveInputCodec13(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = resolveSqlValue6 ? resolveSqlValue6($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve26(sqlIdentifier, sqlValue, $input, $where);
        $where.where(fragment);
      }
    },
    notDistinctFromInsensitive: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to \`postgraphile-plugin-connection-filter\` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            attributeName,
            attribute,
            codec,
            expression
          } = $where.extensions.pgFilterAttribute,
          sourceAlias = attribute ? attribute.expression ? attribute.expression($where.alias) : sql`${$where.alias}.${sql.identifier(attributeName)}` : expression ? expression : $where.alias,
          sourceCodec = codec ?? attribute.codec,
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier8 ? resolveSqlIdentifier8(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = undefined ? lambda($input, undefined) : $input,
          inputCodec = resolveInputCodec14 ? resolveInputCodec14(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = resolveSqlValue7 ? resolveSqlValue7($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve27(sqlIdentifier, sqlValue, $input, $where);
        $where.where(fragment);
      }
    },
    inInsensitive: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to \`postgraphile-plugin-connection-filter\` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            attributeName,
            attribute,
            codec,
            expression
          } = $where.extensions.pgFilterAttribute,
          sourceAlias = attribute ? attribute.expression ? attribute.expression($where.alias) : sql`${$where.alias}.${sql.identifier(attributeName)}` : expression ? expression : $where.alias,
          sourceCodec = codec ?? attribute.codec,
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier9 ? resolveSqlIdentifier9(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = undefined ? lambda($input, undefined) : $input,
          inputCodec = resolveInputCodec15 ? resolveInputCodec15(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = resolveSqlValue8 ? resolveSqlValue8($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve28(sqlIdentifier, sqlValue, $input, $where);
        $where.where(fragment);
      }
    },
    notInInsensitive: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to \`postgraphile-plugin-connection-filter\` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            attributeName,
            attribute,
            codec,
            expression
          } = $where.extensions.pgFilterAttribute,
          sourceAlias = attribute ? attribute.expression ? attribute.expression($where.alias) : sql`${$where.alias}.${sql.identifier(attributeName)}` : expression ? expression : $where.alias,
          sourceCodec = codec ?? attribute.codec,
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier10 ? resolveSqlIdentifier10(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = undefined ? lambda($input, undefined) : $input,
          inputCodec = resolveInputCodec16 ? resolveInputCodec16(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = resolveSqlValue9 ? resolveSqlValue9($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve29(sqlIdentifier, sqlValue, $input, $where);
        $where.where(fragment);
      }
    },
    lessThanInsensitive: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to \`postgraphile-plugin-connection-filter\` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            attributeName,
            attribute,
            codec,
            expression
          } = $where.extensions.pgFilterAttribute,
          sourceAlias = attribute ? attribute.expression ? attribute.expression($where.alias) : sql`${$where.alias}.${sql.identifier(attributeName)}` : expression ? expression : $where.alias,
          sourceCodec = codec ?? attribute.codec,
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier11 ? resolveSqlIdentifier11(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = undefined ? lambda($input, undefined) : $input,
          inputCodec = resolveInputCodec17 ? resolveInputCodec17(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = resolveSqlValue10 ? resolveSqlValue10($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve30(sqlIdentifier, sqlValue, $input, $where);
        $where.where(fragment);
      }
    },
    lessThanOrEqualToInsensitive: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to \`postgraphile-plugin-connection-filter\` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            attributeName,
            attribute,
            codec,
            expression
          } = $where.extensions.pgFilterAttribute,
          sourceAlias = attribute ? attribute.expression ? attribute.expression($where.alias) : sql`${$where.alias}.${sql.identifier(attributeName)}` : expression ? expression : $where.alias,
          sourceCodec = codec ?? attribute.codec,
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier12 ? resolveSqlIdentifier12(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = undefined ? lambda($input, undefined) : $input,
          inputCodec = resolveInputCodec18 ? resolveInputCodec18(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = resolveSqlValue11 ? resolveSqlValue11($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve31(sqlIdentifier, sqlValue, $input, $where);
        $where.where(fragment);
      }
    },
    greaterThanInsensitive: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to \`postgraphile-plugin-connection-filter\` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            attributeName,
            attribute,
            codec,
            expression
          } = $where.extensions.pgFilterAttribute,
          sourceAlias = attribute ? attribute.expression ? attribute.expression($where.alias) : sql`${$where.alias}.${sql.identifier(attributeName)}` : expression ? expression : $where.alias,
          sourceCodec = codec ?? attribute.codec,
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier13 ? resolveSqlIdentifier13(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = undefined ? lambda($input, undefined) : $input,
          inputCodec = resolveInputCodec19 ? resolveInputCodec19(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = resolveSqlValue12 ? resolveSqlValue12($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve32(sqlIdentifier, sqlValue, $input, $where);
        $where.where(fragment);
      }
    },
    greaterThanOrEqualToInsensitive: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to \`postgraphile-plugin-connection-filter\` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            attributeName,
            attribute,
            codec,
            expression
          } = $where.extensions.pgFilterAttribute,
          sourceAlias = attribute ? attribute.expression ? attribute.expression($where.alias) : sql`${$where.alias}.${sql.identifier(attributeName)}` : expression ? expression : $where.alias,
          sourceCodec = codec ?? attribute.codec,
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier14 ? resolveSqlIdentifier14(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = undefined ? lambda($input, undefined) : $input,
          inputCodec = resolveInputCodec20 ? resolveInputCodec20(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = resolveSqlValue13 ? resolveSqlValue13($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve33(sqlIdentifier, sqlValue, $input, $where);
        $where.where(fragment);
      }
    }
  },
  OrganizationConnection: {
    __assertStep: ConnectionStep,
    nodes($connection) {
      return $connection.nodes();
    },
    edges($connection) {
      return $connection.edges();
    },
    pageInfo($connection) {
      return $connection.pageInfo();
    },
    totalCount($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint);
    },
    aggregates($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").single();
    },
    groupedAggregates: {
      plan($connection) {
        return $connection.cloneSubplanWithoutPagination("aggregate");
      },
      args: {
        groupBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_$parent, $pgSelect, input) {
            var _a, _b;
            const val = input.getRaw().eval();
            if (!Array.isArray(val)) throw new Error("Invalid!");
            for (const group of val) {
              const config = getEnumValueConfig(OrganizationGroupBy, group),
                plan = (_b = (_a = config === null || config === void 0 ? void 0 : config.extensions) === null || _a === void 0 ? void 0 : _a.grafast) === null || _b === void 0 ? void 0 : _b.applyPlan;
              if (typeof plan === "function") plan($pgSelect);
            }
            return null;
          }
        },
        having: {
          autoApplyAfterParentPlan: true,
          applyPlan(_$parent, $pgSelect) {
            return $pgSelect.havingPlan();
          }
        }
      }
    }
  },
  OrganizationEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  OrganizationAggregates: {
    __assertStep: assertPgClassSingleStep,
    keys($pgSelectSingle) {
      const groups = $pgSelectSingle.getClassStep().getGroups();
      if (groups.length > 0) return $pgSelectSingle.select(sql`json_build_array(${sql.join(groups.map(g => g.fragment), ", ")})`, TYPES.json);else return constant(null);
    },
    sum($pgSelectSingle) {
      return $pgSelectSingle;
    },
    distinctCount($pgSelectSingle) {
      return $pgSelectSingle;
    },
    min($pgSelectSingle) {
      return $pgSelectSingle;
    },
    max($pgSelectSingle) {
      return $pgSelectSingle;
    },
    average($pgSelectSingle) {
      return $pgSelectSingle;
    },
    stddevSample($pgSelectSingle) {
      return $pgSelectSingle;
    },
    stddevPopulation($pgSelectSingle) {
      return $pgSelectSingle;
    },
    varianceSample($pgSelectSingle) {
      return $pgSelectSingle;
    },
    variancePopulation($pgSelectSingle) {
      return $pgSelectSingle;
    }
  },
  OrganizationSumAggregates: {
    rowId($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("id")}`,
        sqlAggregate = spec.sqlAggregateWrap(sqlAttribute, TYPES.int);
      return $pgSelectSingle.select(sqlAggregate, TYPES.bigint);
    }
  },
  OrganizationDistinctCountAggregates: {
    rowId($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("id")}`,
        sqlAggregate = spec2.sqlAggregateWrap(sqlAttribute, TYPES.int);
      return $pgSelectSingle.select(sqlAggregate, TYPES.bigint);
    },
    createdAt($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("created_at")}`,
        sqlAggregate = spec2.sqlAggregateWrap(sqlAttribute, TYPES.timestamp);
      return $pgSelectSingle.select(sqlAggregate, TYPES.bigint);
    },
    name($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("name")}`,
        sqlAggregate = spec2.sqlAggregateWrap(sqlAttribute, TYPES.text);
      return $pgSelectSingle.select(sqlAggregate, TYPES.bigint);
    },
    description($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("description")}`,
        sqlAggregate = spec2.sqlAggregateWrap(sqlAttribute, TYPES.varchar);
      return $pgSelectSingle.select(sqlAggregate, TYPES.bigint);
    },
    slug($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("slug")}`,
        sqlAggregate = spec2.sqlAggregateWrap(sqlAttribute, TYPES.varchar);
      return $pgSelectSingle.select(sqlAggregate, TYPES.bigint);
    },
    projects($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("projects")}`,
        sqlAggregate = spec2.sqlAggregateWrap(sqlAttribute, TYPES.text);
      return $pgSelectSingle.select(sqlAggregate, TYPES.bigint);
    }
  },
  OrganizationMinAggregates: {
    rowId($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("id")}`,
        sqlAggregate = spec3.sqlAggregateWrap(sqlAttribute, TYPES.int);
      return $pgSelectSingle.select(sqlAggregate, TYPES.int);
    }
  },
  OrganizationMaxAggregates: {
    rowId($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("id")}`,
        sqlAggregate = spec4.sqlAggregateWrap(sqlAttribute, TYPES.int);
      return $pgSelectSingle.select(sqlAggregate, TYPES.int);
    }
  },
  OrganizationAverageAggregates: {
    rowId($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("id")}`,
        sqlAggregate = spec5.sqlAggregateWrap(sqlAttribute, TYPES.int);
      return $pgSelectSingle.select(sqlAggregate, TYPES.numeric);
    }
  },
  OrganizationStddevSampleAggregates: {
    rowId($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("id")}`,
        sqlAggregate = spec6.sqlAggregateWrap(sqlAttribute, TYPES.int);
      return $pgSelectSingle.select(sqlAggregate, TYPES.numeric);
    }
  },
  OrganizationStddevPopulationAggregates: {
    rowId($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("id")}`,
        sqlAggregate = spec7.sqlAggregateWrap(sqlAttribute, TYPES.int);
      return $pgSelectSingle.select(sqlAggregate, TYPES.numeric);
    }
  },
  OrganizationVarianceSampleAggregates: {
    rowId($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("id")}`,
        sqlAggregate = spec8.sqlAggregateWrap(sqlAttribute, TYPES.int);
      return $pgSelectSingle.select(sqlAggregate, TYPES.numeric);
    }
  },
  OrganizationVariancePopulationAggregates: {
    rowId($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("id")}`,
        sqlAggregate = spec9.sqlAggregateWrap(sqlAttribute, TYPES.int);
      return $pgSelectSingle.select(sqlAggregate, TYPES.numeric);
    }
  },
  OrganizationGroupBy: {
    CREATED_AT: {
      applyPlan: OrganizationGroupBy_extensions_grafast_applyPlan
    },
    CREATED_AT_TRUNCATED_TO_HOUR: {
      applyPlan: OrganizationGroupBy_extensions_grafast_applyPlan2
    },
    CREATED_AT_TRUNCATED_TO_DAY: {
      applyPlan: OrganizationGroupBy_extensions_grafast_applyPlan3
    },
    NAME: {
      applyPlan: OrganizationGroupBy_extensions_grafast_applyPlan4
    },
    DESCRIPTION: {
      applyPlan: OrganizationGroupBy_extensions_grafast_applyPlan5
    },
    SLUG: {
      applyPlan: OrganizationGroupBy_extensions_grafast_applyPlan6
    },
    PROJECTS: {
      applyPlan: OrganizationGroupBy_extensions_grafast_applyPlan7
    }
  },
  OrganizationHavingInput: {
    AND: {
      applyPlan($where, input) {
        input.apply($where);
        return null;
      }
    },
    OR: {
      applyPlan($where, input) {
        const $or = new PgOrFilterStep($where);
        input.apply($or);
        return null;
      }
    },
    sum: {
      applyPlan($having) {
        return $having;
      }
    },
    distinctCount: {
      applyPlan($having) {
        return $having;
      }
    },
    min: {
      applyPlan($having) {
        return $having;
      }
    },
    max: {
      applyPlan($having) {
        return $having;
      }
    },
    average: {
      applyPlan($having) {
        return $having;
      }
    },
    stddevSample: {
      applyPlan($having) {
        return $having;
      }
    },
    stddevPopulation: {
      applyPlan($having) {
        return $having;
      }
    },
    varianceSample: {
      applyPlan($having) {
        return $having;
      }
    },
    variancePopulation: {
      applyPlan($having) {
        return $having;
      }
    }
  },
  OrganizationHavingSumInput: {
    rowId: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("id")}`,
          aggregateExpression = spec.sqlAggregateWrap(attributeExpression, spec_organization.attributes.id.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = spec.sqlAggregateWrap(attributeExpression, spec_organization.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    }
  },
  OrganizationHavingDistinctCountInput: {
    rowId: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("id")}`,
          aggregateExpression = spec2.sqlAggregateWrap(attributeExpression, spec_organization.attributes.id.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = spec2.sqlAggregateWrap(attributeExpression, spec_organization.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    }
  },
  OrganizationHavingMinInput: {
    rowId: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("id")}`,
          aggregateExpression = spec3.sqlAggregateWrap(attributeExpression, spec_organization.attributes.id.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = spec3.sqlAggregateWrap(attributeExpression, spec_organization.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    }
  },
  OrganizationHavingMaxInput: {
    rowId: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("id")}`,
          aggregateExpression = spec4.sqlAggregateWrap(attributeExpression, spec_organization.attributes.id.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = spec4.sqlAggregateWrap(attributeExpression, spec_organization.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    }
  },
  OrganizationHavingAverageInput: {
    rowId: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("id")}`,
          aggregateExpression = spec5.sqlAggregateWrap(attributeExpression, spec_organization.attributes.id.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = spec5.sqlAggregateWrap(attributeExpression, spec_organization.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    }
  },
  OrganizationHavingStddevSampleInput: {
    rowId: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("id")}`,
          aggregateExpression = spec6.sqlAggregateWrap(attributeExpression, spec_organization.attributes.id.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = spec6.sqlAggregateWrap(attributeExpression, spec_organization.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    }
  },
  OrganizationHavingStddevPopulationInput: {
    rowId: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("id")}`,
          aggregateExpression = spec7.sqlAggregateWrap(attributeExpression, spec_organization.attributes.id.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = spec7.sqlAggregateWrap(attributeExpression, spec_organization.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    }
  },
  OrganizationHavingVarianceSampleInput: {
    rowId: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("id")}`,
          aggregateExpression = spec8.sqlAggregateWrap(attributeExpression, spec_organization.attributes.id.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = spec8.sqlAggregateWrap(attributeExpression, spec_organization.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    }
  },
  OrganizationHavingVariancePopulationInput: {
    rowId: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("id")}`,
          aggregateExpression = spec9.sqlAggregateWrap(attributeExpression, spec_organization.attributes.id.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = spec9.sqlAggregateWrap(attributeExpression, spec_organization.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    }
  },
  OrganizationOrderBy: {
    NATURAL: {
      applyPlan() {}
    },
    PRIMARY_KEY_ASC: {
      applyPlan(step) {
        organizationUniques[0].attributes.forEach(attributeName => {
          const attribute = organizationCodec.attributes[attributeName];
          step.orderBy({
            codec: attribute.codec,
            fragment: sql`${step}.${sql.identifier(attributeName)}`,
            direction: "ASC",
            ...(undefined != null ? {
              nulls: undefined ? "LAST" : "FIRST"
            } : null)
          });
        });
        step.setOrderIsUnique();
      }
    },
    PRIMARY_KEY_DESC: {
      applyPlan(step) {
        organizationUniques[0].attributes.forEach(attributeName => {
          const attribute = organizationCodec.attributes[attributeName];
          step.orderBy({
            codec: attribute.codec,
            fragment: sql`${step}.${sql.identifier(attributeName)}`,
            direction: "DESC",
            ...(undefined != null ? {
              nulls: undefined ? "LAST" : "FIRST"
            } : null)
          });
        });
        step.setOrderIsUnique();
      }
    },
    ID_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "id",
          direction: "ASC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (true) plan.setOrderIsUnique();
      }
    },
    ID_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "id",
          direction: "DESC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (true) plan.setOrderIsUnique();
      }
    },
    CREATED_AT_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "created_at",
          direction: "ASC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (false) plan.setOrderIsUnique();
      }
    },
    CREATED_AT_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "created_at",
          direction: "DESC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (false) plan.setOrderIsUnique();
      }
    },
    NAME_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "name",
          direction: "ASC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (false) plan.setOrderIsUnique();
      }
    },
    NAME_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "name",
          direction: "DESC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (false) plan.setOrderIsUnique();
      }
    },
    DESCRIPTION_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "description",
          direction: "ASC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (false) plan.setOrderIsUnique();
      }
    },
    DESCRIPTION_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "description",
          direction: "DESC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (false) plan.setOrderIsUnique();
      }
    },
    SLUG_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "slug",
          direction: "ASC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (false) plan.setOrderIsUnique();
      }
    },
    SLUG_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "slug",
          direction: "DESC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (false) plan.setOrderIsUnique();
      }
    },
    PROJECTS_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "projects",
          direction: "ASC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (false) plan.setOrderIsUnique();
      }
    },
    PROJECTS_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "projects",
          direction: "DESC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (false) plan.setOrderIsUnique();
      }
    }
  },
  OrganizationCondition: {
    rowId: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) $condition.where({
          type: "attribute",
          attribute: "id",
          callback(expression) {
            return sql`${expression} is null`;
          }
        });else $condition.where({
          type: "attribute",
          attribute: "id",
          callback(expression) {
            return sql`${expression} = ${$condition.placeholder(val.get(), spec_organization.attributes.id.codec)}`;
          }
        });
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    createdAt: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) $condition.where({
          type: "attribute",
          attribute: "created_at",
          callback(expression) {
            return sql`${expression} is null`;
          }
        });else $condition.where({
          type: "attribute",
          attribute: "created_at",
          callback(expression) {
            return sql`${expression} = ${$condition.placeholder(val.get(), spec_organization.attributes.created_at.codec)}`;
          }
        });
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    name: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) $condition.where({
          type: "attribute",
          attribute: "name",
          callback(expression) {
            return sql`${expression} is null`;
          }
        });else $condition.where({
          type: "attribute",
          attribute: "name",
          callback(expression) {
            return sql`${expression} = ${$condition.placeholder(val.get(), spec_organization.attributes.name.codec)}`;
          }
        });
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    description: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) $condition.where({
          type: "attribute",
          attribute: "description",
          callback(expression) {
            return sql`${expression} is null`;
          }
        });else $condition.where({
          type: "attribute",
          attribute: "description",
          callback(expression) {
            return sql`${expression} = ${$condition.placeholder(val.get(), spec_organization.attributes.description.codec)}`;
          }
        });
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    slug: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) $condition.where({
          type: "attribute",
          attribute: "slug",
          callback(expression) {
            return sql`${expression} is null`;
          }
        });else $condition.where({
          type: "attribute",
          attribute: "slug",
          callback(expression) {
            return sql`${expression} = ${$condition.placeholder(val.get(), spec_organization.attributes.slug.codec)}`;
          }
        });
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    projects: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) $condition.where({
          type: "attribute",
          attribute: "projects",
          callback(expression) {
            return sql`${expression} is null`;
          }
        });else $condition.where({
          type: "attribute",
          attribute: "projects",
          callback(expression) {
            return sql`${expression} = ${$condition.placeholder(val.get(), spec_organization.attributes.projects.codec)}`;
          }
        });
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  OrganizationFilter: {
    rowId: {
      applyPlan($where, fieldArgs) {
        const $raw = fieldArgs.getRaw();
        if ($raw.evalIs(void 0)) return;
        if (!false && "evalIsEmpty" in $raw && $raw.evalIsEmpty()) throw Object.assign(new Error("Empty objects are forbidden in filter argument input."), {});
        if (!false && $raw.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $col = new PgConditionStep($where);
        $col.extensions.pgFilterAttribute = colSpec8;
        fieldArgs.apply($col);
      }
    },
    createdAt: {
      applyPlan($where, fieldArgs) {
        const $raw = fieldArgs.getRaw();
        if ($raw.evalIs(void 0)) return;
        if (!false && "evalIsEmpty" in $raw && $raw.evalIsEmpty()) throw Object.assign(new Error("Empty objects are forbidden in filter argument input."), {});
        if (!false && $raw.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $col = new PgConditionStep($where);
        $col.extensions.pgFilterAttribute = colSpec9;
        fieldArgs.apply($col);
      }
    },
    name: {
      applyPlan($where, fieldArgs) {
        const $raw = fieldArgs.getRaw();
        if ($raw.evalIs(void 0)) return;
        if (!false && "evalIsEmpty" in $raw && $raw.evalIsEmpty()) throw Object.assign(new Error("Empty objects are forbidden in filter argument input."), {});
        if (!false && $raw.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $col = new PgConditionStep($where);
        $col.extensions.pgFilterAttribute = colSpec10;
        fieldArgs.apply($col);
      }
    },
    description: {
      applyPlan($where, fieldArgs) {
        const $raw = fieldArgs.getRaw();
        if ($raw.evalIs(void 0)) return;
        if (!false && "evalIsEmpty" in $raw && $raw.evalIsEmpty()) throw Object.assign(new Error("Empty objects are forbidden in filter argument input."), {});
        if (!false && $raw.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $col = new PgConditionStep($where);
        $col.extensions.pgFilterAttribute = colSpec11;
        fieldArgs.apply($col);
      }
    },
    slug: {
      applyPlan($where, fieldArgs) {
        const $raw = fieldArgs.getRaw();
        if ($raw.evalIs(void 0)) return;
        if (!false && "evalIsEmpty" in $raw && $raw.evalIsEmpty()) throw Object.assign(new Error("Empty objects are forbidden in filter argument input."), {});
        if (!false && $raw.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $col = new PgConditionStep($where);
        $col.extensions.pgFilterAttribute = colSpec12;
        fieldArgs.apply($col);
      }
    },
    projects: {
      applyPlan($where, fieldArgs) {
        const $raw = fieldArgs.getRaw();
        if ($raw.evalIs(void 0)) return;
        if (!false && "evalIsEmpty" in $raw && $raw.evalIsEmpty()) throw Object.assign(new Error("Empty objects are forbidden in filter argument input."), {});
        if (!false && $raw.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $col = new PgConditionStep($where);
        $col.extensions.pgFilterAttribute = colSpec13;
        fieldArgs.apply($col);
      }
    },
    and: {
      applyPlan($where, fieldArgs) {
        assertAllowed8(fieldArgs, "list");
        const $and = $where.andPlan();
        fieldArgs.apply($and);
      }
    },
    or: {
      applyPlan($where, fieldArgs) {
        assertAllowed8(fieldArgs, "list");
        const $or = $where.orPlan();
        fieldArgs.apply(() => $or.andPlan());
      }
    },
    not: {
      applyPlan($where, fieldArgs) {
        assertAllowed8(fieldArgs, "object");
        const $and = $where.notPlan().andPlan();
        fieldArgs.apply($and);
      }
    }
  },
  PostConnection: {
    __assertStep: ConnectionStep,
    nodes($connection) {
      return $connection.nodes();
    },
    edges($connection) {
      return $connection.edges();
    },
    pageInfo($connection) {
      return $connection.pageInfo();
    },
    totalCount($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint);
    },
    aggregates($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").single();
    },
    groupedAggregates: {
      plan($connection) {
        return $connection.cloneSubplanWithoutPagination("aggregate");
      },
      args: {
        groupBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_$parent, $pgSelect, input) {
            var _a, _b;
            const val = input.getRaw().eval();
            if (!Array.isArray(val)) throw new Error("Invalid!");
            for (const group of val) {
              const config = getEnumValueConfig(PostGroupBy, group),
                plan = (_b = (_a = config === null || config === void 0 ? void 0 : config.extensions) === null || _a === void 0 ? void 0 : _a.grafast) === null || _b === void 0 ? void 0 : _b.applyPlan;
              if (typeof plan === "function") plan($pgSelect);
            }
            return null;
          }
        },
        having: {
          autoApplyAfterParentPlan: true,
          applyPlan(_$parent, $pgSelect) {
            return $pgSelect.havingPlan();
          }
        }
      }
    }
  },
  PostEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  PostAggregates: {
    __assertStep: assertPgClassSingleStep,
    keys($pgSelectSingle) {
      const groups = $pgSelectSingle.getClassStep().getGroups();
      if (groups.length > 0) return $pgSelectSingle.select(sql`json_build_array(${sql.join(groups.map(g => g.fragment), ", ")})`, TYPES.json);else return constant(null);
    },
    sum($pgSelectSingle) {
      return $pgSelectSingle;
    },
    distinctCount($pgSelectSingle) {
      return $pgSelectSingle;
    },
    min($pgSelectSingle) {
      return $pgSelectSingle;
    },
    max($pgSelectSingle) {
      return $pgSelectSingle;
    },
    average($pgSelectSingle) {
      return $pgSelectSingle;
    },
    stddevSample($pgSelectSingle) {
      return $pgSelectSingle;
    },
    stddevPopulation($pgSelectSingle) {
      return $pgSelectSingle;
    },
    varianceSample($pgSelectSingle) {
      return $pgSelectSingle;
    },
    variancePopulation($pgSelectSingle) {
      return $pgSelectSingle;
    }
  },
  PostSumAggregates: {
    rowId($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("id")}`,
        sqlAggregate = spec.sqlAggregateWrap(sqlAttribute, TYPES.int);
      return $pgSelectSingle.select(sqlAggregate, TYPES.bigint);
    },
    authorId($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("author_id")}`,
        sqlAggregate = spec.sqlAggregateWrap(sqlAttribute, TYPES.int);
      return $pgSelectSingle.select(sqlAggregate, TYPES.bigint);
    },
    projectId($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("project_id")}`,
        sqlAggregate = spec.sqlAggregateWrap(sqlAttribute, TYPES.int);
      return $pgSelectSingle.select(sqlAggregate, TYPES.bigint);
    }
  },
  PostDistinctCountAggregates: {
    rowId($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("id")}`,
        sqlAggregate = spec2.sqlAggregateWrap(sqlAttribute, TYPES.int);
      return $pgSelectSingle.select(sqlAggregate, TYPES.bigint);
    },
    createdAt($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("created_at")}`,
        sqlAggregate = spec2.sqlAggregateWrap(sqlAttribute, TYPES.timestamp);
      return $pgSelectSingle.select(sqlAggregate, TYPES.bigint);
    },
    title($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("title")}`,
        sqlAggregate = spec2.sqlAggregateWrap(sqlAttribute, TYPES.text);
      return $pgSelectSingle.select(sqlAggregate, TYPES.bigint);
    },
    body($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("body")}`,
        sqlAggregate = spec2.sqlAggregateWrap(sqlAttribute, TYPES.text);
      return $pgSelectSingle.select(sqlAggregate, TYPES.bigint);
    },
    authorId($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("author_id")}`,
        sqlAggregate = spec2.sqlAggregateWrap(sqlAttribute, TYPES.int);
      return $pgSelectSingle.select(sqlAggregate, TYPES.bigint);
    },
    projectId($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("project_id")}`,
        sqlAggregate = spec2.sqlAggregateWrap(sqlAttribute, TYPES.int);
      return $pgSelectSingle.select(sqlAggregate, TYPES.bigint);
    }
  },
  PostMinAggregates: {
    rowId($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("id")}`,
        sqlAggregate = spec3.sqlAggregateWrap(sqlAttribute, TYPES.int);
      return $pgSelectSingle.select(sqlAggregate, TYPES.int);
    },
    authorId($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("author_id")}`,
        sqlAggregate = spec3.sqlAggregateWrap(sqlAttribute, TYPES.int);
      return $pgSelectSingle.select(sqlAggregate, TYPES.int);
    },
    projectId($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("project_id")}`,
        sqlAggregate = spec3.sqlAggregateWrap(sqlAttribute, TYPES.int);
      return $pgSelectSingle.select(sqlAggregate, TYPES.int);
    }
  },
  PostMaxAggregates: {
    rowId($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("id")}`,
        sqlAggregate = spec4.sqlAggregateWrap(sqlAttribute, TYPES.int);
      return $pgSelectSingle.select(sqlAggregate, TYPES.int);
    },
    authorId($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("author_id")}`,
        sqlAggregate = spec4.sqlAggregateWrap(sqlAttribute, TYPES.int);
      return $pgSelectSingle.select(sqlAggregate, TYPES.int);
    },
    projectId($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("project_id")}`,
        sqlAggregate = spec4.sqlAggregateWrap(sqlAttribute, TYPES.int);
      return $pgSelectSingle.select(sqlAggregate, TYPES.int);
    }
  },
  PostAverageAggregates: {
    rowId($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("id")}`,
        sqlAggregate = spec5.sqlAggregateWrap(sqlAttribute, TYPES.int);
      return $pgSelectSingle.select(sqlAggregate, TYPES.numeric);
    },
    authorId($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("author_id")}`,
        sqlAggregate = spec5.sqlAggregateWrap(sqlAttribute, TYPES.int);
      return $pgSelectSingle.select(sqlAggregate, TYPES.numeric);
    },
    projectId($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("project_id")}`,
        sqlAggregate = spec5.sqlAggregateWrap(sqlAttribute, TYPES.int);
      return $pgSelectSingle.select(sqlAggregate, TYPES.numeric);
    }
  },
  PostStddevSampleAggregates: {
    rowId($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("id")}`,
        sqlAggregate = spec6.sqlAggregateWrap(sqlAttribute, TYPES.int);
      return $pgSelectSingle.select(sqlAggregate, TYPES.numeric);
    },
    authorId($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("author_id")}`,
        sqlAggregate = spec6.sqlAggregateWrap(sqlAttribute, TYPES.int);
      return $pgSelectSingle.select(sqlAggregate, TYPES.numeric);
    },
    projectId($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("project_id")}`,
        sqlAggregate = spec6.sqlAggregateWrap(sqlAttribute, TYPES.int);
      return $pgSelectSingle.select(sqlAggregate, TYPES.numeric);
    }
  },
  PostStddevPopulationAggregates: {
    rowId($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("id")}`,
        sqlAggregate = spec7.sqlAggregateWrap(sqlAttribute, TYPES.int);
      return $pgSelectSingle.select(sqlAggregate, TYPES.numeric);
    },
    authorId($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("author_id")}`,
        sqlAggregate = spec7.sqlAggregateWrap(sqlAttribute, TYPES.int);
      return $pgSelectSingle.select(sqlAggregate, TYPES.numeric);
    },
    projectId($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("project_id")}`,
        sqlAggregate = spec7.sqlAggregateWrap(sqlAttribute, TYPES.int);
      return $pgSelectSingle.select(sqlAggregate, TYPES.numeric);
    }
  },
  PostVarianceSampleAggregates: {
    rowId($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("id")}`,
        sqlAggregate = spec8.sqlAggregateWrap(sqlAttribute, TYPES.int);
      return $pgSelectSingle.select(sqlAggregate, TYPES.numeric);
    },
    authorId($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("author_id")}`,
        sqlAggregate = spec8.sqlAggregateWrap(sqlAttribute, TYPES.int);
      return $pgSelectSingle.select(sqlAggregate, TYPES.numeric);
    },
    projectId($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("project_id")}`,
        sqlAggregate = spec8.sqlAggregateWrap(sqlAttribute, TYPES.int);
      return $pgSelectSingle.select(sqlAggregate, TYPES.numeric);
    }
  },
  PostVariancePopulationAggregates: {
    rowId($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("id")}`,
        sqlAggregate = spec9.sqlAggregateWrap(sqlAttribute, TYPES.int);
      return $pgSelectSingle.select(sqlAggregate, TYPES.numeric);
    },
    authorId($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("author_id")}`,
        sqlAggregate = spec9.sqlAggregateWrap(sqlAttribute, TYPES.int);
      return $pgSelectSingle.select(sqlAggregate, TYPES.numeric);
    },
    projectId($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("project_id")}`,
        sqlAggregate = spec9.sqlAggregateWrap(sqlAttribute, TYPES.int);
      return $pgSelectSingle.select(sqlAggregate, TYPES.numeric);
    }
  },
  PostGroupBy: {
    CREATED_AT: {
      applyPlan: PostGroupBy_extensions_grafast_applyPlan
    },
    CREATED_AT_TRUNCATED_TO_HOUR: {
      applyPlan: PostGroupBy_extensions_grafast_applyPlan2
    },
    CREATED_AT_TRUNCATED_TO_DAY: {
      applyPlan: PostGroupBy_extensions_grafast_applyPlan3
    },
    TITLE: {
      applyPlan: PostGroupBy_extensions_grafast_applyPlan4
    },
    BODY: {
      applyPlan: PostGroupBy_extensions_grafast_applyPlan5
    },
    AUTHOR_ID: {
      applyPlan: PostGroupBy_extensions_grafast_applyPlan6
    },
    PROJECT_ID: {
      applyPlan: PostGroupBy_extensions_grafast_applyPlan7
    }
  },
  PostHavingInput: {
    AND: {
      applyPlan($where, input) {
        input.apply($where);
        return null;
      }
    },
    OR: {
      applyPlan($where, input) {
        const $or = new PgOrFilterStep($where);
        input.apply($or);
        return null;
      }
    },
    sum: {
      applyPlan($having) {
        return $having;
      }
    },
    distinctCount: {
      applyPlan($having) {
        return $having;
      }
    },
    min: {
      applyPlan($having) {
        return $having;
      }
    },
    max: {
      applyPlan($having) {
        return $having;
      }
    },
    average: {
      applyPlan($having) {
        return $having;
      }
    },
    stddevSample: {
      applyPlan($having) {
        return $having;
      }
    },
    stddevPopulation: {
      applyPlan($having) {
        return $having;
      }
    },
    varianceSample: {
      applyPlan($having) {
        return $having;
      }
    },
    variancePopulation: {
      applyPlan($having) {
        return $having;
      }
    }
  },
  PostHavingSumInput: {
    rowId: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("id")}`,
          aggregateExpression = spec.sqlAggregateWrap(attributeExpression, spec_post.attributes.id.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = spec.sqlAggregateWrap(attributeExpression, spec_post.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    authorId: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("author_id")}`,
          aggregateExpression = spec.sqlAggregateWrap(attributeExpression, spec_post.attributes.author_id.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    projectId: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("project_id")}`,
          aggregateExpression = spec.sqlAggregateWrap(attributeExpression, spec_post.attributes.project_id.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    }
  },
  PostHavingDistinctCountInput: {
    rowId: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("id")}`,
          aggregateExpression = spec2.sqlAggregateWrap(attributeExpression, spec_post.attributes.id.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = spec2.sqlAggregateWrap(attributeExpression, spec_post.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    authorId: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("author_id")}`,
          aggregateExpression = spec2.sqlAggregateWrap(attributeExpression, spec_post.attributes.author_id.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    projectId: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("project_id")}`,
          aggregateExpression = spec2.sqlAggregateWrap(attributeExpression, spec_post.attributes.project_id.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    }
  },
  PostHavingMinInput: {
    rowId: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("id")}`,
          aggregateExpression = spec3.sqlAggregateWrap(attributeExpression, spec_post.attributes.id.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = spec3.sqlAggregateWrap(attributeExpression, spec_post.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    authorId: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("author_id")}`,
          aggregateExpression = spec3.sqlAggregateWrap(attributeExpression, spec_post.attributes.author_id.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    projectId: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("project_id")}`,
          aggregateExpression = spec3.sqlAggregateWrap(attributeExpression, spec_post.attributes.project_id.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    }
  },
  PostHavingMaxInput: {
    rowId: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("id")}`,
          aggregateExpression = spec4.sqlAggregateWrap(attributeExpression, spec_post.attributes.id.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = spec4.sqlAggregateWrap(attributeExpression, spec_post.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    authorId: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("author_id")}`,
          aggregateExpression = spec4.sqlAggregateWrap(attributeExpression, spec_post.attributes.author_id.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    projectId: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("project_id")}`,
          aggregateExpression = spec4.sqlAggregateWrap(attributeExpression, spec_post.attributes.project_id.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    }
  },
  PostHavingAverageInput: {
    rowId: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("id")}`,
          aggregateExpression = spec5.sqlAggregateWrap(attributeExpression, spec_post.attributes.id.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = spec5.sqlAggregateWrap(attributeExpression, spec_post.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    authorId: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("author_id")}`,
          aggregateExpression = spec5.sqlAggregateWrap(attributeExpression, spec_post.attributes.author_id.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    projectId: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("project_id")}`,
          aggregateExpression = spec5.sqlAggregateWrap(attributeExpression, spec_post.attributes.project_id.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    }
  },
  PostHavingStddevSampleInput: {
    rowId: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("id")}`,
          aggregateExpression = spec6.sqlAggregateWrap(attributeExpression, spec_post.attributes.id.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = spec6.sqlAggregateWrap(attributeExpression, spec_post.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    authorId: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("author_id")}`,
          aggregateExpression = spec6.sqlAggregateWrap(attributeExpression, spec_post.attributes.author_id.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    projectId: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("project_id")}`,
          aggregateExpression = spec6.sqlAggregateWrap(attributeExpression, spec_post.attributes.project_id.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    }
  },
  PostHavingStddevPopulationInput: {
    rowId: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("id")}`,
          aggregateExpression = spec7.sqlAggregateWrap(attributeExpression, spec_post.attributes.id.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = spec7.sqlAggregateWrap(attributeExpression, spec_post.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    authorId: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("author_id")}`,
          aggregateExpression = spec7.sqlAggregateWrap(attributeExpression, spec_post.attributes.author_id.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    projectId: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("project_id")}`,
          aggregateExpression = spec7.sqlAggregateWrap(attributeExpression, spec_post.attributes.project_id.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    }
  },
  PostHavingVarianceSampleInput: {
    rowId: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("id")}`,
          aggregateExpression = spec8.sqlAggregateWrap(attributeExpression, spec_post.attributes.id.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = spec8.sqlAggregateWrap(attributeExpression, spec_post.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    authorId: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("author_id")}`,
          aggregateExpression = spec8.sqlAggregateWrap(attributeExpression, spec_post.attributes.author_id.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    projectId: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("project_id")}`,
          aggregateExpression = spec8.sqlAggregateWrap(attributeExpression, spec_post.attributes.project_id.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    }
  },
  PostHavingVariancePopulationInput: {
    rowId: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("id")}`,
          aggregateExpression = spec9.sqlAggregateWrap(attributeExpression, spec_post.attributes.id.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = spec9.sqlAggregateWrap(attributeExpression, spec_post.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    authorId: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("author_id")}`,
          aggregateExpression = spec9.sqlAggregateWrap(attributeExpression, spec_post.attributes.author_id.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    projectId: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("project_id")}`,
          aggregateExpression = spec9.sqlAggregateWrap(attributeExpression, spec_post.attributes.project_id.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    }
  },
  PostOrderBy: {
    NATURAL: {
      applyPlan() {}
    },
    PRIMARY_KEY_ASC: {
      applyPlan(step) {
        postUniques[0].attributes.forEach(attributeName => {
          const attribute = postCodec.attributes[attributeName];
          step.orderBy({
            codec: attribute.codec,
            fragment: sql`${step}.${sql.identifier(attributeName)}`,
            direction: "ASC",
            ...(undefined != null ? {
              nulls: undefined ? "LAST" : "FIRST"
            } : null)
          });
        });
        step.setOrderIsUnique();
      }
    },
    PRIMARY_KEY_DESC: {
      applyPlan(step) {
        postUniques[0].attributes.forEach(attributeName => {
          const attribute = postCodec.attributes[attributeName];
          step.orderBy({
            codec: attribute.codec,
            fragment: sql`${step}.${sql.identifier(attributeName)}`,
            direction: "DESC",
            ...(undefined != null ? {
              nulls: undefined ? "LAST" : "FIRST"
            } : null)
          });
        });
        step.setOrderIsUnique();
      }
    },
    ID_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "id",
          direction: "ASC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (true) plan.setOrderIsUnique();
      }
    },
    ID_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "id",
          direction: "DESC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (true) plan.setOrderIsUnique();
      }
    },
    CREATED_AT_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "created_at",
          direction: "ASC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (false) plan.setOrderIsUnique();
      }
    },
    CREATED_AT_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "created_at",
          direction: "DESC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (false) plan.setOrderIsUnique();
      }
    },
    TITLE_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "title",
          direction: "ASC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (false) plan.setOrderIsUnique();
      }
    },
    TITLE_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "title",
          direction: "DESC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (false) plan.setOrderIsUnique();
      }
    },
    BODY_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "body",
          direction: "ASC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (false) plan.setOrderIsUnique();
      }
    },
    BODY_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "body",
          direction: "DESC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (false) plan.setOrderIsUnique();
      }
    },
    AUTHOR_ID_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "author_id",
          direction: "ASC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (false) plan.setOrderIsUnique();
      }
    },
    AUTHOR_ID_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "author_id",
          direction: "DESC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (false) plan.setOrderIsUnique();
      }
    },
    PROJECT_ID_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "project_id",
          direction: "ASC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (false) plan.setOrderIsUnique();
      }
    },
    PROJECT_ID_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "project_id",
          direction: "DESC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (false) plan.setOrderIsUnique();
      }
    }
  },
  PostCondition: {
    rowId: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) $condition.where({
          type: "attribute",
          attribute: "id",
          callback(expression) {
            return sql`${expression} is null`;
          }
        });else $condition.where({
          type: "attribute",
          attribute: "id",
          callback(expression) {
            return sql`${expression} = ${$condition.placeholder(val.get(), spec_post.attributes.id.codec)}`;
          }
        });
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    createdAt: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) $condition.where({
          type: "attribute",
          attribute: "created_at",
          callback(expression) {
            return sql`${expression} is null`;
          }
        });else $condition.where({
          type: "attribute",
          attribute: "created_at",
          callback(expression) {
            return sql`${expression} = ${$condition.placeholder(val.get(), spec_post.attributes.created_at.codec)}`;
          }
        });
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    title: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) $condition.where({
          type: "attribute",
          attribute: "title",
          callback(expression) {
            return sql`${expression} is null`;
          }
        });else $condition.where({
          type: "attribute",
          attribute: "title",
          callback(expression) {
            return sql`${expression} = ${$condition.placeholder(val.get(), spec_post.attributes.title.codec)}`;
          }
        });
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    body: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) $condition.where({
          type: "attribute",
          attribute: "body",
          callback(expression) {
            return sql`${expression} is null`;
          }
        });else $condition.where({
          type: "attribute",
          attribute: "body",
          callback(expression) {
            return sql`${expression} = ${$condition.placeholder(val.get(), spec_post.attributes.body.codec)}`;
          }
        });
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    authorId: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) $condition.where({
          type: "attribute",
          attribute: "author_id",
          callback(expression) {
            return sql`${expression} is null`;
          }
        });else $condition.where({
          type: "attribute",
          attribute: "author_id",
          callback(expression) {
            return sql`${expression} = ${$condition.placeholder(val.get(), spec_post.attributes.author_id.codec)}`;
          }
        });
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    projectId: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) $condition.where({
          type: "attribute",
          attribute: "project_id",
          callback(expression) {
            return sql`${expression} is null`;
          }
        });else $condition.where({
          type: "attribute",
          attribute: "project_id",
          callback(expression) {
            return sql`${expression} = ${$condition.placeholder(val.get(), spec_post.attributes.project_id.codec)}`;
          }
        });
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  PostFilter: {
    rowId: {
      applyPlan($where, fieldArgs) {
        const $raw = fieldArgs.getRaw();
        if ($raw.evalIs(void 0)) return;
        if (!false && "evalIsEmpty" in $raw && $raw.evalIsEmpty()) throw Object.assign(new Error("Empty objects are forbidden in filter argument input."), {});
        if (!false && $raw.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $col = new PgConditionStep($where);
        $col.extensions.pgFilterAttribute = colSpec14;
        fieldArgs.apply($col);
      }
    },
    createdAt: {
      applyPlan($where, fieldArgs) {
        const $raw = fieldArgs.getRaw();
        if ($raw.evalIs(void 0)) return;
        if (!false && "evalIsEmpty" in $raw && $raw.evalIsEmpty()) throw Object.assign(new Error("Empty objects are forbidden in filter argument input."), {});
        if (!false && $raw.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $col = new PgConditionStep($where);
        $col.extensions.pgFilterAttribute = colSpec15;
        fieldArgs.apply($col);
      }
    },
    title: {
      applyPlan($where, fieldArgs) {
        const $raw = fieldArgs.getRaw();
        if ($raw.evalIs(void 0)) return;
        if (!false && "evalIsEmpty" in $raw && $raw.evalIsEmpty()) throw Object.assign(new Error("Empty objects are forbidden in filter argument input."), {});
        if (!false && $raw.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $col = new PgConditionStep($where);
        $col.extensions.pgFilterAttribute = colSpec16;
        fieldArgs.apply($col);
      }
    },
    body: {
      applyPlan($where, fieldArgs) {
        const $raw = fieldArgs.getRaw();
        if ($raw.evalIs(void 0)) return;
        if (!false && "evalIsEmpty" in $raw && $raw.evalIsEmpty()) throw Object.assign(new Error("Empty objects are forbidden in filter argument input."), {});
        if (!false && $raw.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $col = new PgConditionStep($where);
        $col.extensions.pgFilterAttribute = colSpec17;
        fieldArgs.apply($col);
      }
    },
    authorId: {
      applyPlan($where, fieldArgs) {
        const $raw = fieldArgs.getRaw();
        if ($raw.evalIs(void 0)) return;
        if (!false && "evalIsEmpty" in $raw && $raw.evalIsEmpty()) throw Object.assign(new Error("Empty objects are forbidden in filter argument input."), {});
        if (!false && $raw.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $col = new PgConditionStep($where);
        $col.extensions.pgFilterAttribute = colSpec18;
        fieldArgs.apply($col);
      }
    },
    projectId: {
      applyPlan($where, fieldArgs) {
        const $raw = fieldArgs.getRaw();
        if ($raw.evalIs(void 0)) return;
        if (!false && "evalIsEmpty" in $raw && $raw.evalIsEmpty()) throw Object.assign(new Error("Empty objects are forbidden in filter argument input."), {});
        if (!false && $raw.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $col = new PgConditionStep($where);
        $col.extensions.pgFilterAttribute = colSpec19;
        fieldArgs.apply($col);
      }
    },
    and: {
      applyPlan($where, fieldArgs) {
        assertAllowed9(fieldArgs, "list");
        const $and = $where.andPlan();
        fieldArgs.apply($and);
      }
    },
    or: {
      applyPlan($where, fieldArgs) {
        assertAllowed9(fieldArgs, "list");
        const $or = $where.orPlan();
        fieldArgs.apply(() => $or.andPlan());
      }
    },
    not: {
      applyPlan($where, fieldArgs) {
        assertAllowed9(fieldArgs, "object");
        const $and = $where.notPlan().andPlan();
        fieldArgs.apply($and);
      }
    }
  },
  ProjectConnection: {
    __assertStep: ConnectionStep,
    nodes($connection) {
      return $connection.nodes();
    },
    edges($connection) {
      return $connection.edges();
    },
    pageInfo($connection) {
      return $connection.pageInfo();
    },
    totalCount($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint);
    },
    aggregates($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").single();
    },
    groupedAggregates: {
      plan($connection) {
        return $connection.cloneSubplanWithoutPagination("aggregate");
      },
      args: {
        groupBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_$parent, $pgSelect, input) {
            var _a, _b;
            const val = input.getRaw().eval();
            if (!Array.isArray(val)) throw new Error("Invalid!");
            for (const group of val) {
              const config = getEnumValueConfig(ProjectGroupBy, group),
                plan = (_b = (_a = config === null || config === void 0 ? void 0 : config.extensions) === null || _a === void 0 ? void 0 : _a.grafast) === null || _b === void 0 ? void 0 : _b.applyPlan;
              if (typeof plan === "function") plan($pgSelect);
            }
            return null;
          }
        },
        having: {
          autoApplyAfterParentPlan: true,
          applyPlan(_$parent, $pgSelect) {
            return $pgSelect.havingPlan();
          }
        }
      }
    }
  },
  ProjectEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  ProjectAggregates: {
    __assertStep: assertPgClassSingleStep,
    keys($pgSelectSingle) {
      const groups = $pgSelectSingle.getClassStep().getGroups();
      if (groups.length > 0) return $pgSelectSingle.select(sql`json_build_array(${sql.join(groups.map(g => g.fragment), ", ")})`, TYPES.json);else return constant(null);
    },
    sum($pgSelectSingle) {
      return $pgSelectSingle;
    },
    distinctCount($pgSelectSingle) {
      return $pgSelectSingle;
    },
    min($pgSelectSingle) {
      return $pgSelectSingle;
    },
    max($pgSelectSingle) {
      return $pgSelectSingle;
    },
    average($pgSelectSingle) {
      return $pgSelectSingle;
    },
    stddevSample($pgSelectSingle) {
      return $pgSelectSingle;
    },
    stddevPopulation($pgSelectSingle) {
      return $pgSelectSingle;
    },
    varianceSample($pgSelectSingle) {
      return $pgSelectSingle;
    },
    variancePopulation($pgSelectSingle) {
      return $pgSelectSingle;
    }
  },
  ProjectSumAggregates: {
    rowId($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("id")}`,
        sqlAggregate = spec.sqlAggregateWrap(sqlAttribute, TYPES.int);
      return $pgSelectSingle.select(sqlAggregate, TYPES.bigint);
    },
    organizationId($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("organization_id")}`,
        sqlAggregate = spec.sqlAggregateWrap(sqlAttribute, TYPES.int);
      return $pgSelectSingle.select(sqlAggregate, TYPES.bigint);
    }
  },
  ProjectDistinctCountAggregates: {
    rowId($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("id")}`,
        sqlAggregate = spec2.sqlAggregateWrap(sqlAttribute, TYPES.int);
      return $pgSelectSingle.select(sqlAggregate, TYPES.bigint);
    },
    createdAt($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("created_at")}`,
        sqlAggregate = spec2.sqlAggregateWrap(sqlAttribute, TYPES.timestamp);
      return $pgSelectSingle.select(sqlAggregate, TYPES.bigint);
    },
    name($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("name")}`,
        sqlAggregate = spec2.sqlAggregateWrap(sqlAttribute, TYPES.text);
      return $pgSelectSingle.select(sqlAggregate, TYPES.bigint);
    },
    description($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("description")}`,
        sqlAggregate = spec2.sqlAggregateWrap(sqlAttribute, TYPES.varchar);
      return $pgSelectSingle.select(sqlAggregate, TYPES.bigint);
    },
    slug($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("slug")}`,
        sqlAggregate = spec2.sqlAggregateWrap(sqlAttribute, TYPES.varchar);
      return $pgSelectSingle.select(sqlAggregate, TYPES.bigint);
    },
    image($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("image")}`,
        sqlAggregate = spec2.sqlAggregateWrap(sqlAttribute, TYPES.text);
      return $pgSelectSingle.select(sqlAggregate, TYPES.bigint);
    },
    organizationId($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("organization_id")}`,
        sqlAggregate = spec2.sqlAggregateWrap(sqlAttribute, TYPES.int);
      return $pgSelectSingle.select(sqlAggregate, TYPES.bigint);
    }
  },
  ProjectMinAggregates: {
    rowId($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("id")}`,
        sqlAggregate = spec3.sqlAggregateWrap(sqlAttribute, TYPES.int);
      return $pgSelectSingle.select(sqlAggregate, TYPES.int);
    },
    organizationId($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("organization_id")}`,
        sqlAggregate = spec3.sqlAggregateWrap(sqlAttribute, TYPES.int);
      return $pgSelectSingle.select(sqlAggregate, TYPES.int);
    }
  },
  ProjectMaxAggregates: {
    rowId($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("id")}`,
        sqlAggregate = spec4.sqlAggregateWrap(sqlAttribute, TYPES.int);
      return $pgSelectSingle.select(sqlAggregate, TYPES.int);
    },
    organizationId($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("organization_id")}`,
        sqlAggregate = spec4.sqlAggregateWrap(sqlAttribute, TYPES.int);
      return $pgSelectSingle.select(sqlAggregate, TYPES.int);
    }
  },
  ProjectAverageAggregates: {
    rowId($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("id")}`,
        sqlAggregate = spec5.sqlAggregateWrap(sqlAttribute, TYPES.int);
      return $pgSelectSingle.select(sqlAggregate, TYPES.numeric);
    },
    organizationId($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("organization_id")}`,
        sqlAggregate = spec5.sqlAggregateWrap(sqlAttribute, TYPES.int);
      return $pgSelectSingle.select(sqlAggregate, TYPES.numeric);
    }
  },
  ProjectStddevSampleAggregates: {
    rowId($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("id")}`,
        sqlAggregate = spec6.sqlAggregateWrap(sqlAttribute, TYPES.int);
      return $pgSelectSingle.select(sqlAggregate, TYPES.numeric);
    },
    organizationId($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("organization_id")}`,
        sqlAggregate = spec6.sqlAggregateWrap(sqlAttribute, TYPES.int);
      return $pgSelectSingle.select(sqlAggregate, TYPES.numeric);
    }
  },
  ProjectStddevPopulationAggregates: {
    rowId($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("id")}`,
        sqlAggregate = spec7.sqlAggregateWrap(sqlAttribute, TYPES.int);
      return $pgSelectSingle.select(sqlAggregate, TYPES.numeric);
    },
    organizationId($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("organization_id")}`,
        sqlAggregate = spec7.sqlAggregateWrap(sqlAttribute, TYPES.int);
      return $pgSelectSingle.select(sqlAggregate, TYPES.numeric);
    }
  },
  ProjectVarianceSampleAggregates: {
    rowId($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("id")}`,
        sqlAggregate = spec8.sqlAggregateWrap(sqlAttribute, TYPES.int);
      return $pgSelectSingle.select(sqlAggregate, TYPES.numeric);
    },
    organizationId($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("organization_id")}`,
        sqlAggregate = spec8.sqlAggregateWrap(sqlAttribute, TYPES.int);
      return $pgSelectSingle.select(sqlAggregate, TYPES.numeric);
    }
  },
  ProjectVariancePopulationAggregates: {
    rowId($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("id")}`,
        sqlAggregate = spec9.sqlAggregateWrap(sqlAttribute, TYPES.int);
      return $pgSelectSingle.select(sqlAggregate, TYPES.numeric);
    },
    organizationId($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("organization_id")}`,
        sqlAggregate = spec9.sqlAggregateWrap(sqlAttribute, TYPES.int);
      return $pgSelectSingle.select(sqlAggregate, TYPES.numeric);
    }
  },
  ProjectGroupBy: {
    CREATED_AT: {
      applyPlan: ProjectGroupBy_extensions_grafast_applyPlan
    },
    CREATED_AT_TRUNCATED_TO_HOUR: {
      applyPlan: ProjectGroupBy_extensions_grafast_applyPlan2
    },
    CREATED_AT_TRUNCATED_TO_DAY: {
      applyPlan: ProjectGroupBy_extensions_grafast_applyPlan3
    },
    NAME: {
      applyPlan: ProjectGroupBy_extensions_grafast_applyPlan4
    },
    DESCRIPTION: {
      applyPlan: ProjectGroupBy_extensions_grafast_applyPlan5
    },
    SLUG: {
      applyPlan: ProjectGroupBy_extensions_grafast_applyPlan6
    },
    IMAGE: {
      applyPlan: ProjectGroupBy_extensions_grafast_applyPlan7
    },
    ORGANIZATION_ID: {
      applyPlan: ProjectGroupBy_extensions_grafast_applyPlan8
    }
  },
  ProjectHavingInput: {
    AND: {
      applyPlan($where, input) {
        input.apply($where);
        return null;
      }
    },
    OR: {
      applyPlan($where, input) {
        const $or = new PgOrFilterStep($where);
        input.apply($or);
        return null;
      }
    },
    sum: {
      applyPlan($having) {
        return $having;
      }
    },
    distinctCount: {
      applyPlan($having) {
        return $having;
      }
    },
    min: {
      applyPlan($having) {
        return $having;
      }
    },
    max: {
      applyPlan($having) {
        return $having;
      }
    },
    average: {
      applyPlan($having) {
        return $having;
      }
    },
    stddevSample: {
      applyPlan($having) {
        return $having;
      }
    },
    stddevPopulation: {
      applyPlan($having) {
        return $having;
      }
    },
    varianceSample: {
      applyPlan($having) {
        return $having;
      }
    },
    variancePopulation: {
      applyPlan($having) {
        return $having;
      }
    }
  },
  ProjectHavingSumInput: {
    rowId: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("id")}`,
          aggregateExpression = spec.sqlAggregateWrap(attributeExpression, spec_project.attributes.id.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = spec.sqlAggregateWrap(attributeExpression, spec_project.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    organizationId: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("organization_id")}`,
          aggregateExpression = spec.sqlAggregateWrap(attributeExpression, spec_project.attributes.organization_id.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    }
  },
  ProjectHavingDistinctCountInput: {
    rowId: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("id")}`,
          aggregateExpression = spec2.sqlAggregateWrap(attributeExpression, spec_project.attributes.id.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = spec2.sqlAggregateWrap(attributeExpression, spec_project.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    organizationId: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("organization_id")}`,
          aggregateExpression = spec2.sqlAggregateWrap(attributeExpression, spec_project.attributes.organization_id.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    }
  },
  ProjectHavingMinInput: {
    rowId: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("id")}`,
          aggregateExpression = spec3.sqlAggregateWrap(attributeExpression, spec_project.attributes.id.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = spec3.sqlAggregateWrap(attributeExpression, spec_project.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    organizationId: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("organization_id")}`,
          aggregateExpression = spec3.sqlAggregateWrap(attributeExpression, spec_project.attributes.organization_id.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    }
  },
  ProjectHavingMaxInput: {
    rowId: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("id")}`,
          aggregateExpression = spec4.sqlAggregateWrap(attributeExpression, spec_project.attributes.id.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = spec4.sqlAggregateWrap(attributeExpression, spec_project.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    organizationId: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("organization_id")}`,
          aggregateExpression = spec4.sqlAggregateWrap(attributeExpression, spec_project.attributes.organization_id.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    }
  },
  ProjectHavingAverageInput: {
    rowId: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("id")}`,
          aggregateExpression = spec5.sqlAggregateWrap(attributeExpression, spec_project.attributes.id.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = spec5.sqlAggregateWrap(attributeExpression, spec_project.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    organizationId: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("organization_id")}`,
          aggregateExpression = spec5.sqlAggregateWrap(attributeExpression, spec_project.attributes.organization_id.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    }
  },
  ProjectHavingStddevSampleInput: {
    rowId: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("id")}`,
          aggregateExpression = spec6.sqlAggregateWrap(attributeExpression, spec_project.attributes.id.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = spec6.sqlAggregateWrap(attributeExpression, spec_project.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    organizationId: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("organization_id")}`,
          aggregateExpression = spec6.sqlAggregateWrap(attributeExpression, spec_project.attributes.organization_id.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    }
  },
  ProjectHavingStddevPopulationInput: {
    rowId: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("id")}`,
          aggregateExpression = spec7.sqlAggregateWrap(attributeExpression, spec_project.attributes.id.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = spec7.sqlAggregateWrap(attributeExpression, spec_project.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    organizationId: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("organization_id")}`,
          aggregateExpression = spec7.sqlAggregateWrap(attributeExpression, spec_project.attributes.organization_id.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    }
  },
  ProjectHavingVarianceSampleInput: {
    rowId: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("id")}`,
          aggregateExpression = spec8.sqlAggregateWrap(attributeExpression, spec_project.attributes.id.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = spec8.sqlAggregateWrap(attributeExpression, spec_project.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    organizationId: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("organization_id")}`,
          aggregateExpression = spec8.sqlAggregateWrap(attributeExpression, spec_project.attributes.organization_id.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    }
  },
  ProjectHavingVariancePopulationInput: {
    rowId: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("id")}`,
          aggregateExpression = spec9.sqlAggregateWrap(attributeExpression, spec_project.attributes.id.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = spec9.sqlAggregateWrap(attributeExpression, spec_project.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    organizationId: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("organization_id")}`,
          aggregateExpression = spec9.sqlAggregateWrap(attributeExpression, spec_project.attributes.organization_id.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    }
  },
  ProjectOrderBy: {
    NATURAL: {
      applyPlan() {}
    },
    PRIMARY_KEY_ASC: {
      applyPlan(step) {
        projectUniques[0].attributes.forEach(attributeName => {
          const attribute = projectCodec.attributes[attributeName];
          step.orderBy({
            codec: attribute.codec,
            fragment: sql`${step}.${sql.identifier(attributeName)}`,
            direction: "ASC",
            ...(undefined != null ? {
              nulls: undefined ? "LAST" : "FIRST"
            } : null)
          });
        });
        step.setOrderIsUnique();
      }
    },
    PRIMARY_KEY_DESC: {
      applyPlan(step) {
        projectUniques[0].attributes.forEach(attributeName => {
          const attribute = projectCodec.attributes[attributeName];
          step.orderBy({
            codec: attribute.codec,
            fragment: sql`${step}.${sql.identifier(attributeName)}`,
            direction: "DESC",
            ...(undefined != null ? {
              nulls: undefined ? "LAST" : "FIRST"
            } : null)
          });
        });
        step.setOrderIsUnique();
      }
    },
    ID_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "id",
          direction: "ASC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (true) plan.setOrderIsUnique();
      }
    },
    ID_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "id",
          direction: "DESC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (true) plan.setOrderIsUnique();
      }
    },
    CREATED_AT_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "created_at",
          direction: "ASC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (false) plan.setOrderIsUnique();
      }
    },
    CREATED_AT_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "created_at",
          direction: "DESC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (false) plan.setOrderIsUnique();
      }
    },
    NAME_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "name",
          direction: "ASC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (false) plan.setOrderIsUnique();
      }
    },
    NAME_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "name",
          direction: "DESC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (false) plan.setOrderIsUnique();
      }
    },
    DESCRIPTION_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "description",
          direction: "ASC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (false) plan.setOrderIsUnique();
      }
    },
    DESCRIPTION_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "description",
          direction: "DESC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (false) plan.setOrderIsUnique();
      }
    },
    SLUG_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "slug",
          direction: "ASC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (false) plan.setOrderIsUnique();
      }
    },
    SLUG_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "slug",
          direction: "DESC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (false) plan.setOrderIsUnique();
      }
    },
    IMAGE_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "image",
          direction: "ASC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (false) plan.setOrderIsUnique();
      }
    },
    IMAGE_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "image",
          direction: "DESC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (false) plan.setOrderIsUnique();
      }
    },
    ORGANIZATION_ID_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "organization_id",
          direction: "ASC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (false) plan.setOrderIsUnique();
      }
    },
    ORGANIZATION_ID_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "organization_id",
          direction: "DESC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (false) plan.setOrderIsUnique();
      }
    }
  },
  ProjectCondition: {
    rowId: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) $condition.where({
          type: "attribute",
          attribute: "id",
          callback(expression) {
            return sql`${expression} is null`;
          }
        });else $condition.where({
          type: "attribute",
          attribute: "id",
          callback(expression) {
            return sql`${expression} = ${$condition.placeholder(val.get(), spec_project.attributes.id.codec)}`;
          }
        });
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    createdAt: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) $condition.where({
          type: "attribute",
          attribute: "created_at",
          callback(expression) {
            return sql`${expression} is null`;
          }
        });else $condition.where({
          type: "attribute",
          attribute: "created_at",
          callback(expression) {
            return sql`${expression} = ${$condition.placeholder(val.get(), spec_project.attributes.created_at.codec)}`;
          }
        });
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    name: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) $condition.where({
          type: "attribute",
          attribute: "name",
          callback(expression) {
            return sql`${expression} is null`;
          }
        });else $condition.where({
          type: "attribute",
          attribute: "name",
          callback(expression) {
            return sql`${expression} = ${$condition.placeholder(val.get(), spec_project.attributes.name.codec)}`;
          }
        });
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    description: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) $condition.where({
          type: "attribute",
          attribute: "description",
          callback(expression) {
            return sql`${expression} is null`;
          }
        });else $condition.where({
          type: "attribute",
          attribute: "description",
          callback(expression) {
            return sql`${expression} = ${$condition.placeholder(val.get(), spec_project.attributes.description.codec)}`;
          }
        });
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    slug: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) $condition.where({
          type: "attribute",
          attribute: "slug",
          callback(expression) {
            return sql`${expression} is null`;
          }
        });else $condition.where({
          type: "attribute",
          attribute: "slug",
          callback(expression) {
            return sql`${expression} = ${$condition.placeholder(val.get(), spec_project.attributes.slug.codec)}`;
          }
        });
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    image: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) $condition.where({
          type: "attribute",
          attribute: "image",
          callback(expression) {
            return sql`${expression} is null`;
          }
        });else $condition.where({
          type: "attribute",
          attribute: "image",
          callback(expression) {
            return sql`${expression} = ${$condition.placeholder(val.get(), spec_project.attributes.image.codec)}`;
          }
        });
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    organizationId: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) $condition.where({
          type: "attribute",
          attribute: "organization_id",
          callback(expression) {
            return sql`${expression} is null`;
          }
        });else $condition.where({
          type: "attribute",
          attribute: "organization_id",
          callback(expression) {
            return sql`${expression} = ${$condition.placeholder(val.get(), spec_project.attributes.organization_id.codec)}`;
          }
        });
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  ProjectFilter: {
    rowId: {
      applyPlan($where, fieldArgs) {
        const $raw = fieldArgs.getRaw();
        if ($raw.evalIs(void 0)) return;
        if (!false && "evalIsEmpty" in $raw && $raw.evalIsEmpty()) throw Object.assign(new Error("Empty objects are forbidden in filter argument input."), {});
        if (!false && $raw.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $col = new PgConditionStep($where);
        $col.extensions.pgFilterAttribute = colSpec20;
        fieldArgs.apply($col);
      }
    },
    createdAt: {
      applyPlan($where, fieldArgs) {
        const $raw = fieldArgs.getRaw();
        if ($raw.evalIs(void 0)) return;
        if (!false && "evalIsEmpty" in $raw && $raw.evalIsEmpty()) throw Object.assign(new Error("Empty objects are forbidden in filter argument input."), {});
        if (!false && $raw.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $col = new PgConditionStep($where);
        $col.extensions.pgFilterAttribute = colSpec21;
        fieldArgs.apply($col);
      }
    },
    name: {
      applyPlan($where, fieldArgs) {
        const $raw = fieldArgs.getRaw();
        if ($raw.evalIs(void 0)) return;
        if (!false && "evalIsEmpty" in $raw && $raw.evalIsEmpty()) throw Object.assign(new Error("Empty objects are forbidden in filter argument input."), {});
        if (!false && $raw.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $col = new PgConditionStep($where);
        $col.extensions.pgFilterAttribute = colSpec22;
        fieldArgs.apply($col);
      }
    },
    description: {
      applyPlan($where, fieldArgs) {
        const $raw = fieldArgs.getRaw();
        if ($raw.evalIs(void 0)) return;
        if (!false && "evalIsEmpty" in $raw && $raw.evalIsEmpty()) throw Object.assign(new Error("Empty objects are forbidden in filter argument input."), {});
        if (!false && $raw.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $col = new PgConditionStep($where);
        $col.extensions.pgFilterAttribute = colSpec23;
        fieldArgs.apply($col);
      }
    },
    slug: {
      applyPlan($where, fieldArgs) {
        const $raw = fieldArgs.getRaw();
        if ($raw.evalIs(void 0)) return;
        if (!false && "evalIsEmpty" in $raw && $raw.evalIsEmpty()) throw Object.assign(new Error("Empty objects are forbidden in filter argument input."), {});
        if (!false && $raw.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $col = new PgConditionStep($where);
        $col.extensions.pgFilterAttribute = colSpec24;
        fieldArgs.apply($col);
      }
    },
    image: {
      applyPlan($where, fieldArgs) {
        const $raw = fieldArgs.getRaw();
        if ($raw.evalIs(void 0)) return;
        if (!false && "evalIsEmpty" in $raw && $raw.evalIsEmpty()) throw Object.assign(new Error("Empty objects are forbidden in filter argument input."), {});
        if (!false && $raw.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $col = new PgConditionStep($where);
        $col.extensions.pgFilterAttribute = colSpec25;
        fieldArgs.apply($col);
      }
    },
    organizationId: {
      applyPlan($where, fieldArgs) {
        const $raw = fieldArgs.getRaw();
        if ($raw.evalIs(void 0)) return;
        if (!false && "evalIsEmpty" in $raw && $raw.evalIsEmpty()) throw Object.assign(new Error("Empty objects are forbidden in filter argument input."), {});
        if (!false && $raw.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $col = new PgConditionStep($where);
        $col.extensions.pgFilterAttribute = colSpec26;
        fieldArgs.apply($col);
      }
    },
    and: {
      applyPlan($where, fieldArgs) {
        assertAllowed10(fieldArgs, "list");
        const $and = $where.andPlan();
        fieldArgs.apply($and);
      }
    },
    or: {
      applyPlan($where, fieldArgs) {
        assertAllowed10(fieldArgs, "list");
        const $or = $where.orPlan();
        fieldArgs.apply(() => $or.andPlan());
      }
    },
    not: {
      applyPlan($where, fieldArgs) {
        assertAllowed10(fieldArgs, "object");
        const $and = $where.notPlan().andPlan();
        fieldArgs.apply($and);
      }
    }
  },
  Mutation: {
    __assertStep: __ValueStep,
    createUpvote: {
      plan(_, args) {
        const plan = object({
          result: pgInsertSingle(pgResource_upvotePgResource, Object.create(null))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    createUser: {
      plan(_, args) {
        const plan = object({
          result: pgInsertSingle(pgResource_userPgResource, Object.create(null))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    createOrganization: {
      plan(_, args) {
        const plan = object({
          result: pgInsertSingle(pgResource_organizationPgResource, Object.create(null))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    createPost: {
      plan(_, args) {
        const plan = object({
          result: pgInsertSingle(pgResource_postPgResource, Object.create(null))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    createProject: {
      plan(_, args) {
        const plan = object({
          result: pgInsertSingle(pgResource_projectPgResource, Object.create(null))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    updateUpvoteById: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_upvotePgResource, specFromArgs(args))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    updateUpvote: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_upvotePgResource, {
            id: args.get(['input', "rowId"])
          })
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    updateUserById: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_userPgResource, specFromArgs2(args))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    updateUser: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_userPgResource, {
            id: args.get(['input', "rowId"])
          })
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    updateOrganizationById: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_organizationPgResource, specFromArgs3(args))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    updateOrganization: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_organizationPgResource, {
            id: args.get(['input', "rowId"])
          })
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    updatePostById: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_postPgResource, specFromArgs4(args))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    updatePost: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_postPgResource, {
            id: args.get(['input', "rowId"])
          })
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    updateProjectById: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_projectPgResource, specFromArgs5(args))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    updateProject: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_projectPgResource, {
            id: args.get(['input', "rowId"])
          })
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    deleteUpvoteById: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_upvotePgResource, specFromArgs6(args))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    deleteUpvote: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_upvotePgResource, {
            id: args.get(['input', "rowId"])
          })
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    deleteUserById: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_userPgResource, specFromArgs7(args))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    deleteUser: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_userPgResource, {
            id: args.get(['input', "rowId"])
          })
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    deleteOrganizationById: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_organizationPgResource, specFromArgs8(args))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    deleteOrganization: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_organizationPgResource, {
            id: args.get(['input', "rowId"])
          })
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    deletePostById: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_postPgResource, specFromArgs9(args))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    deletePost: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_postPgResource, {
            id: args.get(['input', "rowId"])
          })
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    deleteProjectById: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_projectPgResource, specFromArgs10(args))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    deleteProject: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_projectPgResource, {
            id: args.get(['input', "rowId"])
          })
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    }
  },
  CreateUpvotePayload: {
    __assertStep: assertExecutableStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", !0) ?? constant(null);
    },
    upvote($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    upvoteEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", !0);
        if (!$result) return constant(null);
        const $select = (() => {
            if ($result instanceof PgDeleteSingleStep) return pgSelectFromRecord($result.resource, $result.record());else {
              const spec = upvoteUniques[0].attributes.reduce((memo, attributeName) => {
                memo[attributeName] = $result.get(attributeName);
                return memo;
              }, Object.create(null));
              return pgResource_upvotePgResource.find(spec);
            }
          })(),
          $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("UpvoteOrderBy"));
        const $connection = connection($select),
          $single = $select.row(first($select));
        return new EdgeStep($connection, $single);
      },
      args: {
        orderBy: undefined
      }
    }
  },
  CreateUpvoteInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      },
      autoApplyAfterParentApplyPlan: true
    },
    upvote: {
      applyPlan($object) {
        return $object.getStepForKey("result").setPlan();
      },
      autoApplyAfterParentApplyPlan: true
    }
  },
  UpvoteInput: {
    "__inputPlan": function UpvoteInput_inputPlan() {
      return object(Object.create(null));
    },
    rowId: {
      applyPlan($insert, val) {
        $insert.set("id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    createdAt: {
      applyPlan($insert, val) {
        $insert.set("created_at", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  CreateUserPayload: {
    __assertStep: assertExecutableStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", !0) ?? constant(null);
    },
    user($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    userEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", !0);
        if (!$result) return constant(null);
        const $select = (() => {
            if ($result instanceof PgDeleteSingleStep) return pgSelectFromRecord($result.resource, $result.record());else {
              const spec = userUniques[0].attributes.reduce((memo, attributeName) => {
                memo[attributeName] = $result.get(attributeName);
                return memo;
              }, Object.create(null));
              return pgResource_userPgResource.find(spec);
            }
          })(),
          $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("UserOrderBy"));
        const $connection = connection($select),
          $single = $select.row(first($select));
        return new EdgeStep($connection, $single);
      },
      args: {
        orderBy: undefined
      }
    }
  },
  CreateUserInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      },
      autoApplyAfterParentApplyPlan: true
    },
    user: {
      applyPlan($object) {
        return $object.getStepForKey("result").setPlan();
      },
      autoApplyAfterParentApplyPlan: true
    }
  },
  UserInput: {
    "__inputPlan": function UserInput_inputPlan() {
      return object(Object.create(null));
    },
    rowId: {
      applyPlan($insert, val) {
        $insert.set("id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    createdAt: {
      applyPlan($insert, val) {
        $insert.set("created_at", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    walletAddress: {
      applyPlan($insert, val) {
        $insert.set("wallet_address", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    posts: {
      applyPlan($insert, val) {
        $insert.set("posts", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    upvotes: {
      applyPlan($insert, val) {
        $insert.set("upvotes", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  CreateOrganizationPayload: {
    __assertStep: assertExecutableStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", !0) ?? constant(null);
    },
    organization($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    organizationEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", !0);
        if (!$result) return constant(null);
        const $select = (() => {
            if ($result instanceof PgDeleteSingleStep) return pgSelectFromRecord($result.resource, $result.record());else {
              const spec = organizationUniques[0].attributes.reduce((memo, attributeName) => {
                memo[attributeName] = $result.get(attributeName);
                return memo;
              }, Object.create(null));
              return pgResource_organizationPgResource.find(spec);
            }
          })(),
          $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("OrganizationOrderBy"));
        const $connection = connection($select),
          $single = $select.row(first($select));
        return new EdgeStep($connection, $single);
      },
      args: {
        orderBy: undefined
      }
    }
  },
  CreateOrganizationInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      },
      autoApplyAfterParentApplyPlan: true
    },
    organization: {
      applyPlan($object) {
        return $object.getStepForKey("result").setPlan();
      },
      autoApplyAfterParentApplyPlan: true
    }
  },
  OrganizationInput: {
    "__inputPlan": function OrganizationInput_inputPlan() {
      return object(Object.create(null));
    },
    rowId: {
      applyPlan($insert, val) {
        $insert.set("id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    createdAt: {
      applyPlan($insert, val) {
        $insert.set("created_at", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    name: {
      applyPlan($insert, val) {
        $insert.set("name", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    description: {
      applyPlan($insert, val) {
        $insert.set("description", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    slug: {
      applyPlan($insert, val) {
        $insert.set("slug", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    projects: {
      applyPlan($insert, val) {
        $insert.set("projects", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  CreatePostPayload: {
    __assertStep: assertExecutableStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", !0) ?? constant(null);
    },
    post($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    postEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", !0);
        if (!$result) return constant(null);
        const $select = (() => {
            if ($result instanceof PgDeleteSingleStep) return pgSelectFromRecord($result.resource, $result.record());else {
              const spec = postUniques[0].attributes.reduce((memo, attributeName) => {
                memo[attributeName] = $result.get(attributeName);
                return memo;
              }, Object.create(null));
              return pgResource_postPgResource.find(spec);
            }
          })(),
          $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("PostOrderBy"));
        const $connection = connection($select),
          $single = $select.row(first($select));
        return new EdgeStep($connection, $single);
      },
      args: {
        orderBy: undefined
      }
    }
  },
  CreatePostInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      },
      autoApplyAfterParentApplyPlan: true
    },
    post: {
      applyPlan($object) {
        return $object.getStepForKey("result").setPlan();
      },
      autoApplyAfterParentApplyPlan: true
    }
  },
  PostInput: {
    "__inputPlan": function PostInput_inputPlan() {
      return object(Object.create(null));
    },
    rowId: {
      applyPlan($insert, val) {
        $insert.set("id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    createdAt: {
      applyPlan($insert, val) {
        $insert.set("created_at", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    title: {
      applyPlan($insert, val) {
        $insert.set("title", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    body: {
      applyPlan($insert, val) {
        $insert.set("body", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    authorId: {
      applyPlan($insert, val) {
        $insert.set("author_id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    projectId: {
      applyPlan($insert, val) {
        $insert.set("project_id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  CreateProjectPayload: {
    __assertStep: assertExecutableStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", !0) ?? constant(null);
    },
    project($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    projectEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", !0);
        if (!$result) return constant(null);
        const $select = (() => {
            if ($result instanceof PgDeleteSingleStep) return pgSelectFromRecord($result.resource, $result.record());else {
              const spec = projectUniques[0].attributes.reduce((memo, attributeName) => {
                memo[attributeName] = $result.get(attributeName);
                return memo;
              }, Object.create(null));
              return pgResource_projectPgResource.find(spec);
            }
          })(),
          $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("ProjectOrderBy"));
        const $connection = connection($select),
          $single = $select.row(first($select));
        return new EdgeStep($connection, $single);
      },
      args: {
        orderBy: undefined
      }
    }
  },
  CreateProjectInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      },
      autoApplyAfterParentApplyPlan: true
    },
    project: {
      applyPlan($object) {
        return $object.getStepForKey("result").setPlan();
      },
      autoApplyAfterParentApplyPlan: true
    }
  },
  ProjectInput: {
    "__inputPlan": function ProjectInput_inputPlan() {
      return object(Object.create(null));
    },
    rowId: {
      applyPlan($insert, val) {
        $insert.set("id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    createdAt: {
      applyPlan($insert, val) {
        $insert.set("created_at", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    name: {
      applyPlan($insert, val) {
        $insert.set("name", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    description: {
      applyPlan($insert, val) {
        $insert.set("description", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    slug: {
      applyPlan($insert, val) {
        $insert.set("slug", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    image: {
      applyPlan($insert, val) {
        $insert.set("image", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    organizationId: {
      applyPlan($insert, val) {
        $insert.set("organization_id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  UpdateUpvotePayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", !0) ?? constant(null);
    },
    upvote($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    upvoteEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", !0);
        if (!$result) return constant(null);
        const $select = (() => {
            if ($result instanceof PgDeleteSingleStep) return pgSelectFromRecord($result.resource, $result.record());else {
              const spec = upvoteUniques[0].attributes.reduce((memo, attributeName) => {
                memo[attributeName] = $result.get(attributeName);
                return memo;
              }, Object.create(null));
              return pgResource_upvotePgResource.find(spec);
            }
          })(),
          $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("UpvoteOrderBy"));
        const $connection = connection($select),
          $single = $select.row(first($select));
        return new EdgeStep($connection, $single);
      },
      args: {
        orderBy: undefined
      }
    }
  },
  UpdateUpvoteByIdInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    id: undefined,
    patch: {
      applyPlan($object) {
        return $object.getStepForKey("result").setPlan();
      }
    }
  },
  UpvotePatch: {
    "__inputPlan": function UpvotePatch_inputPlan() {
      return object(Object.create(null));
    },
    rowId: {
      applyPlan($insert, val) {
        $insert.set("id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    createdAt: {
      applyPlan($insert, val) {
        $insert.set("created_at", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  UpdateUpvoteInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    rowId: undefined,
    patch: {
      applyPlan($object) {
        return $object.getStepForKey("result").setPlan();
      }
    }
  },
  UpdateUserPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", !0) ?? constant(null);
    },
    user($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    userEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", !0);
        if (!$result) return constant(null);
        const $select = (() => {
            if ($result instanceof PgDeleteSingleStep) return pgSelectFromRecord($result.resource, $result.record());else {
              const spec = userUniques[0].attributes.reduce((memo, attributeName) => {
                memo[attributeName] = $result.get(attributeName);
                return memo;
              }, Object.create(null));
              return pgResource_userPgResource.find(spec);
            }
          })(),
          $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("UserOrderBy"));
        const $connection = connection($select),
          $single = $select.row(first($select));
        return new EdgeStep($connection, $single);
      },
      args: {
        orderBy: undefined
      }
    }
  },
  UpdateUserByIdInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    id: undefined,
    patch: {
      applyPlan($object) {
        return $object.getStepForKey("result").setPlan();
      }
    }
  },
  UserPatch: {
    "__inputPlan": function UserPatch_inputPlan() {
      return object(Object.create(null));
    },
    rowId: {
      applyPlan($insert, val) {
        $insert.set("id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    createdAt: {
      applyPlan($insert, val) {
        $insert.set("created_at", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    walletAddress: {
      applyPlan($insert, val) {
        $insert.set("wallet_address", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    posts: {
      applyPlan($insert, val) {
        $insert.set("posts", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    upvotes: {
      applyPlan($insert, val) {
        $insert.set("upvotes", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  UpdateUserInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    rowId: undefined,
    patch: {
      applyPlan($object) {
        return $object.getStepForKey("result").setPlan();
      }
    }
  },
  UpdateOrganizationPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", !0) ?? constant(null);
    },
    organization($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    organizationEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", !0);
        if (!$result) return constant(null);
        const $select = (() => {
            if ($result instanceof PgDeleteSingleStep) return pgSelectFromRecord($result.resource, $result.record());else {
              const spec = organizationUniques[0].attributes.reduce((memo, attributeName) => {
                memo[attributeName] = $result.get(attributeName);
                return memo;
              }, Object.create(null));
              return pgResource_organizationPgResource.find(spec);
            }
          })(),
          $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("OrganizationOrderBy"));
        const $connection = connection($select),
          $single = $select.row(first($select));
        return new EdgeStep($connection, $single);
      },
      args: {
        orderBy: undefined
      }
    }
  },
  UpdateOrganizationByIdInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    id: undefined,
    patch: {
      applyPlan($object) {
        return $object.getStepForKey("result").setPlan();
      }
    }
  },
  OrganizationPatch: {
    "__inputPlan": function OrganizationPatch_inputPlan() {
      return object(Object.create(null));
    },
    rowId: {
      applyPlan($insert, val) {
        $insert.set("id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    createdAt: {
      applyPlan($insert, val) {
        $insert.set("created_at", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    name: {
      applyPlan($insert, val) {
        $insert.set("name", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    description: {
      applyPlan($insert, val) {
        $insert.set("description", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    slug: {
      applyPlan($insert, val) {
        $insert.set("slug", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    projects: {
      applyPlan($insert, val) {
        $insert.set("projects", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  UpdateOrganizationInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    rowId: undefined,
    patch: {
      applyPlan($object) {
        return $object.getStepForKey("result").setPlan();
      }
    }
  },
  UpdatePostPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", !0) ?? constant(null);
    },
    post($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    postEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", !0);
        if (!$result) return constant(null);
        const $select = (() => {
            if ($result instanceof PgDeleteSingleStep) return pgSelectFromRecord($result.resource, $result.record());else {
              const spec = postUniques[0].attributes.reduce((memo, attributeName) => {
                memo[attributeName] = $result.get(attributeName);
                return memo;
              }, Object.create(null));
              return pgResource_postPgResource.find(spec);
            }
          })(),
          $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("PostOrderBy"));
        const $connection = connection($select),
          $single = $select.row(first($select));
        return new EdgeStep($connection, $single);
      },
      args: {
        orderBy: undefined
      }
    }
  },
  UpdatePostByIdInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    id: undefined,
    patch: {
      applyPlan($object) {
        return $object.getStepForKey("result").setPlan();
      }
    }
  },
  PostPatch: {
    "__inputPlan": function PostPatch_inputPlan() {
      return object(Object.create(null));
    },
    rowId: {
      applyPlan($insert, val) {
        $insert.set("id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    createdAt: {
      applyPlan($insert, val) {
        $insert.set("created_at", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    title: {
      applyPlan($insert, val) {
        $insert.set("title", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    body: {
      applyPlan($insert, val) {
        $insert.set("body", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    authorId: {
      applyPlan($insert, val) {
        $insert.set("author_id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    projectId: {
      applyPlan($insert, val) {
        $insert.set("project_id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  UpdatePostInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    rowId: undefined,
    patch: {
      applyPlan($object) {
        return $object.getStepForKey("result").setPlan();
      }
    }
  },
  UpdateProjectPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", !0) ?? constant(null);
    },
    project($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    projectEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", !0);
        if (!$result) return constant(null);
        const $select = (() => {
            if ($result instanceof PgDeleteSingleStep) return pgSelectFromRecord($result.resource, $result.record());else {
              const spec = projectUniques[0].attributes.reduce((memo, attributeName) => {
                memo[attributeName] = $result.get(attributeName);
                return memo;
              }, Object.create(null));
              return pgResource_projectPgResource.find(spec);
            }
          })(),
          $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("ProjectOrderBy"));
        const $connection = connection($select),
          $single = $select.row(first($select));
        return new EdgeStep($connection, $single);
      },
      args: {
        orderBy: undefined
      }
    }
  },
  UpdateProjectByIdInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    id: undefined,
    patch: {
      applyPlan($object) {
        return $object.getStepForKey("result").setPlan();
      }
    }
  },
  ProjectPatch: {
    "__inputPlan": function ProjectPatch_inputPlan() {
      return object(Object.create(null));
    },
    rowId: {
      applyPlan($insert, val) {
        $insert.set("id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    createdAt: {
      applyPlan($insert, val) {
        $insert.set("created_at", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    name: {
      applyPlan($insert, val) {
        $insert.set("name", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    description: {
      applyPlan($insert, val) {
        $insert.set("description", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    slug: {
      applyPlan($insert, val) {
        $insert.set("slug", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    image: {
      applyPlan($insert, val) {
        $insert.set("image", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    organizationId: {
      applyPlan($insert, val) {
        $insert.set("organization_id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  UpdateProjectInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    rowId: undefined,
    patch: {
      applyPlan($object) {
        return $object.getStepForKey("result").setPlan();
      }
    }
  },
  DeleteUpvotePayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", !0) ?? constant(null);
    },
    upvote($object) {
      return $object.get("result");
    },
    deletedUpvoteId($object) {
      const $record = $object.getStepForKey("result"),
        specifier = nodeIdHandlerByTypeName.Upvote.plan($record);
      return lambda(specifier, nodeIdCodecs_base64JSON_base64JSON.encode);
    },
    query() {
      return rootValue();
    },
    upvoteEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", !0);
        if (!$result) return constant(null);
        const $select = (() => {
            if ($result instanceof PgDeleteSingleStep) return pgSelectFromRecord($result.resource, $result.record());else {
              const spec = upvoteUniques[0].attributes.reduce((memo, attributeName) => {
                memo[attributeName] = $result.get(attributeName);
                return memo;
              }, Object.create(null));
              return pgResource_upvotePgResource.find(spec);
            }
          })(),
          $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("UpvoteOrderBy"));
        const $connection = connection($select),
          $single = $select.row(first($select));
        return new EdgeStep($connection, $single);
      },
      args: {
        orderBy: undefined
      }
    }
  },
  DeleteUpvoteByIdInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    id: undefined
  },
  DeleteUpvoteInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    rowId: undefined
  },
  DeleteUserPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", !0) ?? constant(null);
    },
    user($object) {
      return $object.get("result");
    },
    deletedUserId($object) {
      const $record = $object.getStepForKey("result"),
        specifier = nodeIdHandlerByTypeName.User.plan($record);
      return lambda(specifier, nodeIdCodecs_base64JSON_base64JSON.encode);
    },
    query() {
      return rootValue();
    },
    userEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", !0);
        if (!$result) return constant(null);
        const $select = (() => {
            if ($result instanceof PgDeleteSingleStep) return pgSelectFromRecord($result.resource, $result.record());else {
              const spec = userUniques[0].attributes.reduce((memo, attributeName) => {
                memo[attributeName] = $result.get(attributeName);
                return memo;
              }, Object.create(null));
              return pgResource_userPgResource.find(spec);
            }
          })(),
          $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("UserOrderBy"));
        const $connection = connection($select),
          $single = $select.row(first($select));
        return new EdgeStep($connection, $single);
      },
      args: {
        orderBy: undefined
      }
    }
  },
  DeleteUserByIdInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    id: undefined
  },
  DeleteUserInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    rowId: undefined
  },
  DeleteOrganizationPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", !0) ?? constant(null);
    },
    organization($object) {
      return $object.get("result");
    },
    deletedOrganizationId($object) {
      const $record = $object.getStepForKey("result"),
        specifier = nodeIdHandlerByTypeName.Organization.plan($record);
      return lambda(specifier, nodeIdCodecs_base64JSON_base64JSON.encode);
    },
    query() {
      return rootValue();
    },
    organizationEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", !0);
        if (!$result) return constant(null);
        const $select = (() => {
            if ($result instanceof PgDeleteSingleStep) return pgSelectFromRecord($result.resource, $result.record());else {
              const spec = organizationUniques[0].attributes.reduce((memo, attributeName) => {
                memo[attributeName] = $result.get(attributeName);
                return memo;
              }, Object.create(null));
              return pgResource_organizationPgResource.find(spec);
            }
          })(),
          $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("OrganizationOrderBy"));
        const $connection = connection($select),
          $single = $select.row(first($select));
        return new EdgeStep($connection, $single);
      },
      args: {
        orderBy: undefined
      }
    }
  },
  DeleteOrganizationByIdInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    id: undefined
  },
  DeleteOrganizationInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    rowId: undefined
  },
  DeletePostPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", !0) ?? constant(null);
    },
    post($object) {
      return $object.get("result");
    },
    deletedPostId($object) {
      const $record = $object.getStepForKey("result"),
        specifier = nodeIdHandlerByTypeName.Post.plan($record);
      return lambda(specifier, nodeIdCodecs_base64JSON_base64JSON.encode);
    },
    query() {
      return rootValue();
    },
    postEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", !0);
        if (!$result) return constant(null);
        const $select = (() => {
            if ($result instanceof PgDeleteSingleStep) return pgSelectFromRecord($result.resource, $result.record());else {
              const spec = postUniques[0].attributes.reduce((memo, attributeName) => {
                memo[attributeName] = $result.get(attributeName);
                return memo;
              }, Object.create(null));
              return pgResource_postPgResource.find(spec);
            }
          })(),
          $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("PostOrderBy"));
        const $connection = connection($select),
          $single = $select.row(first($select));
        return new EdgeStep($connection, $single);
      },
      args: {
        orderBy: undefined
      }
    }
  },
  DeletePostByIdInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    id: undefined
  },
  DeletePostInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    rowId: undefined
  },
  DeleteProjectPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", !0) ?? constant(null);
    },
    project($object) {
      return $object.get("result");
    },
    deletedProjectId($object) {
      const $record = $object.getStepForKey("result"),
        specifier = nodeIdHandlerByTypeName.Project.plan($record);
      return lambda(specifier, nodeIdCodecs_base64JSON_base64JSON.encode);
    },
    query() {
      return rootValue();
    },
    projectEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", !0);
        if (!$result) return constant(null);
        const $select = (() => {
            if ($result instanceof PgDeleteSingleStep) return pgSelectFromRecord($result.resource, $result.record());else {
              const spec = projectUniques[0].attributes.reduce((memo, attributeName) => {
                memo[attributeName] = $result.get(attributeName);
                return memo;
              }, Object.create(null));
              return pgResource_projectPgResource.find(spec);
            }
          })(),
          $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("ProjectOrderBy"));
        const $connection = connection($select),
          $single = $select.row(first($select));
        return new EdgeStep($connection, $single);
      },
      args: {
        orderBy: undefined
      }
    }
  },
  DeleteProjectByIdInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    id: undefined
  },
  DeleteProjectInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    rowId: undefined
  }
};
export const schema = makeGrafastSchema({
  typeDefs: typeDefs,
  plans: plans
});