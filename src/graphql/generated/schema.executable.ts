// @ts-nocheck
import { PgConditionStep, PgDeleteSingleStep, PgExecutor, PgSelectStep, PgUnionAllStep, TYPES, assertPgClassSingleStep, listOfCodec, makeRegistry, pgDeleteSingle, pgInsertSingle, pgSelectFromRecord, pgUpdateSingle, recordCodec } from "@dataplan/pg";
import { ConnectionStep, EdgeStep, ObjectStep, SafeError, __ValueStep, access, assertEdgeCapableStep, assertExecutableStep, assertPageInfoCapableStep, connection, constant, context, first, getEnumValueConfig, inhibitOnNull, lambda, list, makeGrafastSchema, node, object, rootValue, specFromNodeId } from "grafast";
import { GraphQLError, Kind } from "graphql";
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
const userIdentifier = sql.identifier("public", "User");
const spec_user = {
  name: "user",
  identifier: userIdentifier,
  attributes: Object.assign(Object.create(null), {
    id: {
      description: undefined,
      codec: TYPES.text,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    walletAddress: {
      description: undefined,
      codec: TYPES.text,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    createdAt: {
      description: undefined,
      codec: TYPES.timestamp,
      notNull: true,
      hasDefault: true,
      extensions: {
        tags: {},
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    updatedAt: {
      description: undefined,
      codec: TYPES.timestamp,
      notNull: true,
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
    oid: "72201",
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "public",
      name: "User"
    },
    tags: Object.create(null)
  },
  executor: executor
};
const userCodec = recordCodec(spec_user);
const organizationIdentifier = sql.identifier("public", "Organization");
const spec_organization = {
  name: "organization",
  identifier: organizationIdentifier,
  attributes: Object.assign(Object.create(null), {
    id: {
      description: undefined,
      codec: TYPES.text,
      notNull: true,
      hasDefault: false,
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
      notNull: true,
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
      codec: TYPES.text,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    createdAt: {
      description: undefined,
      codec: TYPES.timestamp,
      notNull: true,
      hasDefault: true,
      extensions: {
        tags: {},
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    updatedAt: {
      description: undefined,
      codec: TYPES.timestamp,
      notNull: true,
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
    oid: "72166",
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "public",
      name: "Organization"
    },
    tags: Object.create(null)
  },
  executor: executor
};
const organizationCodec = recordCodec(spec_organization);
const upvoteIdentifier = sql.identifier("public", "Upvote");
const spec_upvote = {
  name: "upvote",
  identifier: upvoteIdentifier,
  attributes: Object.assign(Object.create(null), {
    id: {
      description: undefined,
      codec: TYPES.text,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    postId: {
      description: undefined,
      codec: TYPES.text,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    userId: {
      description: undefined,
      codec: TYPES.text,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    createdAt: {
      description: undefined,
      codec: TYPES.timestamp,
      notNull: true,
      hasDefault: true,
      extensions: {
        tags: {},
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    updatedAt: {
      description: undefined,
      codec: TYPES.timestamp,
      notNull: true,
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
    oid: "72208",
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "public",
      name: "Upvote"
    },
    tags: Object.create(null)
  },
  executor: executor
};
const upvoteCodec = recordCodec(spec_upvote);
const postIdentifier = sql.identifier("public", "Post");
const spec_post = {
  name: "post",
  identifier: postIdentifier,
  attributes: Object.assign(Object.create(null), {
    id: {
      description: undefined,
      codec: TYPES.text,
      notNull: true,
      hasDefault: false,
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
      notNull: true,
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
      codec: TYPES.text,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    projectId: {
      description: undefined,
      codec: TYPES.text,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    authorId: {
      description: undefined,
      codec: TYPES.text,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    createdAt: {
      description: undefined,
      codec: TYPES.timestamp,
      notNull: true,
      hasDefault: true,
      extensions: {
        tags: {},
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    updatedAt: {
      description: undefined,
      codec: TYPES.timestamp,
      notNull: true,
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
    oid: "72180",
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "public",
      name: "Post"
    },
    tags: Object.create(null)
  },
  executor: executor
};
const postCodec = recordCodec(spec_post);
const projectIdentifier = sql.identifier("public", "Project");
const spec_project = {
  name: "project",
  identifier: projectIdentifier,
  attributes: Object.assign(Object.create(null), {
    id: {
      description: undefined,
      codec: TYPES.text,
      notNull: true,
      hasDefault: false,
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
      notNull: true,
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
    organizationId: {
      description: undefined,
      codec: TYPES.text,
      notNull: true,
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
      codec: TYPES.text,
      notNull: true,
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
    createdAt: {
      description: undefined,
      codec: TYPES.timestamp,
      notNull: true,
      hasDefault: true,
      extensions: {
        tags: {},
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    updatedAt: {
      description: undefined,
      codec: TYPES.timestamp,
      notNull: true,
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
    oid: "72173",
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "public",
      name: "Project"
    },
    tags: Object.create(null)
  },
  executor: executor
};
const projectCodec = recordCodec(spec_project);
const _prismaMigrationsIdentifier = sql.identifier("public", "_prisma_migrations");
const spec__prismaMigrations = {
  name: "_prismaMigrations",
  identifier: _prismaMigrationsIdentifier,
  attributes: Object.assign(Object.create(null), {
    id: {
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
    checksum: {
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
    finished_at: {
      description: undefined,
      codec: TYPES.timestamptz,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    migration_name: {
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
    logs: {
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
    rolled_back_at: {
      description: undefined,
      codec: TYPES.timestamptz,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    started_at: {
      description: undefined,
      codec: TYPES.timestamptz,
      notNull: true,
      hasDefault: true,
      extensions: {
        tags: {},
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    applied_steps_count: {
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
    oid: "72157",
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "public",
      name: "_prisma_migrations"
    },
    tags: Object.create(null)
  },
  executor: executor
};
const _prismaMigrationsCodec = recordCodec(spec__prismaMigrations);
const UserUniques = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}];
const registryConfig_pgResources_User_User = {
  executor: executor,
  name: "User",
  identifier: "main.public.User",
  from: userIdentifier,
  codec: userCodec,
  uniques: UserUniques,
  isVirtual: false,
  description: undefined,
  extensions: {
    description: undefined,
    pg: {
      serviceName: "main",
      schemaName: "public",
      name: "User"
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
};
const OrganizationUniques = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}];
const registryConfig_pgResources_Organization_Organization = {
  executor: executor,
  name: "Organization",
  identifier: "main.public.Organization",
  from: organizationIdentifier,
  codec: organizationCodec,
  uniques: OrganizationUniques,
  isVirtual: false,
  description: undefined,
  extensions: {
    description: undefined,
    pg: {
      serviceName: "main",
      schemaName: "public",
      name: "Organization"
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
};
const UpvoteUniques = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}];
const registryConfig_pgResources_Upvote_Upvote = {
  executor: executor,
  name: "Upvote",
  identifier: "main.public.Upvote",
  from: upvoteIdentifier,
  codec: upvoteCodec,
  uniques: UpvoteUniques,
  isVirtual: false,
  description: undefined,
  extensions: {
    description: undefined,
    pg: {
      serviceName: "main",
      schemaName: "public",
      name: "Upvote"
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
};
const PostUniques = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}];
const registryConfig_pgResources_Post_Post = {
  executor: executor,
  name: "Post",
  identifier: "main.public.Post",
  from: postIdentifier,
  codec: postCodec,
  uniques: PostUniques,
  isVirtual: false,
  description: undefined,
  extensions: {
    description: undefined,
    pg: {
      serviceName: "main",
      schemaName: "public",
      name: "Post"
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
};
const ProjectUniques = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}];
const registryConfig_pgResources_Project_Project = {
  executor: executor,
  name: "Project",
  identifier: "main.public.Project",
  from: projectIdentifier,
  codec: projectCodec,
  uniques: ProjectUniques,
  isVirtual: false,
  description: undefined,
  extensions: {
    description: undefined,
    pg: {
      serviceName: "main",
      schemaName: "public",
      name: "Project"
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
};
const _prisma_migrationsUniques = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}];
const registryConfig = {
  pgExecutors: Object.assign(Object.create(null), {
    main: executor
  }),
  pgCodecs: Object.assign(Object.create(null), {
    user: userCodec,
    text: TYPES.text,
    timestamp: TYPES.timestamp,
    organization: organizationCodec,
    upvote: upvoteCodec,
    post: postCodec,
    project: projectCodec,
    varchar: TYPES.varchar,
    _prismaMigrations: _prismaMigrationsCodec,
    timestamptz: TYPES.timestamptz,
    int4: TYPES.int
  }),
  pgResources: Object.assign(Object.create(null), {
    User: registryConfig_pgResources_User_User,
    Organization: registryConfig_pgResources_Organization_Organization,
    Upvote: registryConfig_pgResources_Upvote_Upvote,
    Post: registryConfig_pgResources_Post_Post,
    Project: registryConfig_pgResources_Project_Project,
    _prisma_migrations: {
      executor: executor,
      name: "_prisma_migrations",
      identifier: "main.public._prisma_migrations",
      from: _prismaMigrationsIdentifier,
      codec: _prismaMigrationsCodec,
      uniques: _prisma_migrationsUniques,
      isVirtual: false,
      description: undefined,
      extensions: {
        description: undefined,
        pg: {
          serviceName: "main",
          schemaName: "public",
          name: "_prisma_migrations"
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
  pgRelations: Object.assign(Object.create(null), {
    organization: Object.assign(Object.create(null), {
      projectsByTheirOrganizationId: {
        localCodec: organizationCodec,
        remoteResourceOptions: registryConfig_pgResources_Project_Project,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["id"],
        remoteAttributes: ["organizationId"],
        isUnique: false,
        isReferencee: true,
        description: undefined,
        extensions: {
          tags: {
            behavior: []
          }
        }
      }
    }),
    post: Object.assign(Object.create(null), {
      userByMyAuthorId: {
        localCodec: postCodec,
        remoteResourceOptions: registryConfig_pgResources_User_User,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["authorId"],
        remoteAttributes: ["id"],
        isUnique: true,
        isReferencee: false,
        description: undefined,
        extensions: {
          tags: {
            behavior: []
          }
        }
      },
      projectByMyProjectId: {
        localCodec: postCodec,
        remoteResourceOptions: registryConfig_pgResources_Project_Project,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["projectId"],
        remoteAttributes: ["id"],
        isUnique: true,
        isReferencee: false,
        description: undefined,
        extensions: {
          tags: {
            behavior: []
          }
        }
      },
      upvotesByTheirPostId: {
        localCodec: postCodec,
        remoteResourceOptions: registryConfig_pgResources_Upvote_Upvote,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["id"],
        remoteAttributes: ["postId"],
        isUnique: false,
        isReferencee: true,
        description: undefined,
        extensions: {
          tags: {
            behavior: []
          }
        }
      }
    }),
    project: Object.assign(Object.create(null), {
      organizationByMyOrganizationId: {
        localCodec: projectCodec,
        remoteResourceOptions: registryConfig_pgResources_Organization_Organization,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["organizationId"],
        remoteAttributes: ["id"],
        isUnique: true,
        isReferencee: false,
        description: undefined,
        extensions: {
          tags: {
            behavior: []
          }
        }
      },
      postsByTheirProjectId: {
        localCodec: projectCodec,
        remoteResourceOptions: registryConfig_pgResources_Post_Post,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["id"],
        remoteAttributes: ["projectId"],
        isUnique: false,
        isReferencee: true,
        description: undefined,
        extensions: {
          tags: {
            behavior: []
          }
        }
      }
    }),
    upvote: Object.assign(Object.create(null), {
      postByMyPostId: {
        localCodec: upvoteCodec,
        remoteResourceOptions: registryConfig_pgResources_Post_Post,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["postId"],
        remoteAttributes: ["id"],
        isUnique: true,
        isReferencee: false,
        description: undefined,
        extensions: {
          tags: {
            behavior: []
          }
        }
      },
      userByMyUserId: {
        localCodec: upvoteCodec,
        remoteResourceOptions: registryConfig_pgResources_User_User,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["userId"],
        remoteAttributes: ["id"],
        isUnique: true,
        isReferencee: false,
        description: undefined,
        extensions: {
          tags: {
            behavior: []
          }
        }
      }
    }),
    user: Object.assign(Object.create(null), {
      postsByTheirAuthorId: {
        localCodec: userCodec,
        remoteResourceOptions: registryConfig_pgResources_Post_Post,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["id"],
        remoteAttributes: ["authorId"],
        isUnique: false,
        isReferencee: true,
        description: undefined,
        extensions: {
          tags: {
            behavior: []
          }
        }
      },
      upvotesByTheirUserId: {
        localCodec: userCodec,
        remoteResourceOptions: registryConfig_pgResources_Upvote_Upvote,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["id"],
        remoteAttributes: ["userId"],
        isUnique: false,
        isReferencee: true,
        description: undefined,
        extensions: {
          tags: {
            behavior: []
          }
        }
      }
    })
  })
};
const registry = makeRegistry(registryConfig);
const pgResource_UserPgResource = registry.pgResources["User"];
const pgResource_OrganizationPgResource = registry.pgResources["Organization"];
const pgResource_UpvotePgResource = registry.pgResources["Upvote"];
const pgResource_PostPgResource = registry.pgResources["Post"];
const pgResource_ProjectPgResource = registry.pgResources["Project"];
const pgResource__prisma_migrationsPgResource = registry.pgResources["_prisma_migrations"];
const nodeIdHandlerByTypeName = Object.assign(Object.create(null), {
  Query: handler,
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
      return pgResource_UserPgResource.get(spec);
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
      return pgResource_OrganizationPgResource.get(spec);
    },
    match(obj) {
      return obj[0] === "Organization";
    }
  },
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
      return pgResource_UpvotePgResource.get(spec);
    },
    match(obj) {
      return obj[0] === "Upvote";
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
      return pgResource_PostPgResource.get(spec);
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
      return pgResource_ProjectPgResource.get(spec);
    },
    match(obj) {
      return obj[0] === "Project";
    }
  },
  _PrismaMigration: {
    typeName: "_PrismaMigration",
    codec: nodeIdCodecs_base64JSON_base64JSON,
    deprecationReason: undefined,
    plan($record) {
      return list([constant("_PrismaMigration", false), $record.get("id")]);
    },
    getSpec($list) {
      return {
        id: inhibitOnNull(access($list, [1]))
      };
    },
    get(spec) {
      return pgResource__prisma_migrationsPgResource.get(spec);
    },
    match(obj) {
      return obj[0] === "_PrismaMigration";
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
})(nodeIdHandlerByTypeName.User);
const fetcher2 = (handler => {
  const fn = $nodeId => {
    const $decoded = lambda($nodeId, specForHandler(handler));
    return handler.get(handler.getSpec($decoded));
  };
  fn.deprecationReason = handler.deprecationReason;
  return fn;
})(nodeIdHandlerByTypeName.Organization);
const fetcher3 = (handler => {
  const fn = $nodeId => {
    const $decoded = lambda($nodeId, specForHandler(handler));
    return handler.get(handler.getSpec($decoded));
  };
  fn.deprecationReason = handler.deprecationReason;
  return fn;
})(nodeIdHandlerByTypeName.Upvote);
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
const fetcher6 = (handler => {
  const fn = $nodeId => {
    const $decoded = lambda($nodeId, specForHandler(handler));
    return handler.get(handler.getSpec($decoded));
  };
  fn.deprecationReason = handler.deprecationReason;
  return fn;
})(nodeIdHandlerByTypeName._PrismaMigration);
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
function DatetimeSerialize(value) {
  return "" + value;
}
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
function assertAllowed11(fieldArgs, mode) {
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
const colSpec = {
  attributeName: "id",
  attribute: spec_project.attributes.id
};
const colSpec2 = {
  attributeName: "name",
  attribute: spec_project.attributes.name
};
const colSpec3 = {
  attributeName: "description",
  attribute: spec_project.attributes.description
};
const colSpec4 = {
  attributeName: "organizationId",
  attribute: spec_project.attributes.organizationId
};
const colSpec5 = {
  attributeName: "slug",
  attribute: spec_project.attributes.slug
};
const colSpec6 = {
  attributeName: "image",
  attribute: spec_project.attributes.image
};
const colSpec7 = {
  attributeName: "createdAt",
  attribute: spec_project.attributes.createdAt
};
const colSpec8 = {
  attributeName: "updatedAt",
  attribute: spec_project.attributes.updatedAt
};
function assertAllowed12(fieldArgs, mode) {
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
function assertAllowed13(fieldArgs, mode) {
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
function assertAllowed14(fieldArgs, mode) {
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
const resolve12 = (i, v) => sql`${i} LIKE ${v}`;
function escapeLikeWildcards(input) {
  if (typeof input !== "string") throw new Error("Non-string input was provided to escapeLikeWildcards");else return input.split("%").join("\\%").split("_").join("\\_");
}
const resolveInput = input => `%${escapeLikeWildcards(input)}%`;
const resolve13 = (i, v) => sql`${i} NOT LIKE ${v}`;
const resolveInput2 = input => `%${escapeLikeWildcards(input)}%`;
const resolve14 = (i, v) => sql`${i} ILIKE ${v}`;
const resolveInput3 = input => `%${escapeLikeWildcards(input)}%`;
const forceTextTypesInsensitive = [TYPES.char, TYPES.bpchar];
function resolveInputCodec4(c) {
  if (c.arrayOfCodec) {
    if (forceTextTypesInsensitive.includes(resolveDomains(c.arrayOfCodec))) return listOfCodec(TYPES.text, {
      extensions: {
        listItemNonNull: c.extensions?.listItemNonNull
      }
    });
    return c;
  } else {
    if (forceTextTypesInsensitive.includes(resolveDomains(c))) return TYPES.text;
    return c;
  }
}
function resolveSqlIdentifier2(identifier, c) {
  if (c.arrayOfCodec && forceTextTypesInsensitive.includes(resolveDomains(c.arrayOfCodec))) return [sql`(${identifier})::text[]`, listOfCodec(TYPES.text, {
    extensions: {
      listItemNonNull: c.extensions?.listItemNonNull
    }
  })];else if (forceTextTypesInsensitive.includes(resolveDomains(c))) return [sql`(${identifier})::text`, TYPES.text];else return [identifier, c];
}
const resolve15 = (i, v) => sql`${i} NOT ILIKE ${v}`;
const resolveInput4 = input => `%${escapeLikeWildcards(input)}%`;
const resolve16 = (i, v) => sql`${i} LIKE ${v}`;
const resolveInput5 = input => `${escapeLikeWildcards(input)}%`;
const resolve17 = (i, v) => sql`${i} NOT LIKE ${v}`;
const resolveInput6 = input => `${escapeLikeWildcards(input)}%`;
const resolve18 = (i, v) => sql`${i} ILIKE ${v}`;
const resolveInput7 = input => `${escapeLikeWildcards(input)}%`;
const resolve19 = (i, v) => sql`${i} NOT ILIKE ${v}`;
const resolveInput8 = input => `${escapeLikeWildcards(input)}%`;
const resolve20 = (i, v) => sql`${i} LIKE ${v}`;
const resolveInput9 = input => `%${escapeLikeWildcards(input)}`;
const resolve21 = (i, v) => sql`${i} NOT LIKE ${v}`;
const resolveInput10 = input => `%${escapeLikeWildcards(input)}`;
const resolve22 = (i, v) => sql`${i} ILIKE ${v}`;
const resolveInput11 = input => `%${escapeLikeWildcards(input)}`;
const resolve23 = (i, v) => sql`${i} NOT ILIKE ${v}`;
const resolveInput12 = input => `%${escapeLikeWildcards(input)}`;
const resolve24 = (i, v) => sql`${i} LIKE ${v}`;
const resolve25 = (i, v) => sql`${i} NOT LIKE ${v}`;
const resolve26 = (i, v) => sql`${i} ILIKE ${v}`;
const resolve27 = (i, v) => sql`${i} NOT ILIKE ${v}`;
function resolveInputCodec5(inputCodec) {
  if ("equalTo" === "in" || "equalTo" === "notIn") {
    const t = resolveDomains(inputCodec) === TYPES.citext ? inputCodec : TYPES.text;
    return listOfCodec(t, {
      extensions: {
        listItemNonNull: !0
      }
    });
  } else return resolveDomains(inputCodec) === TYPES.citext ? inputCodec : TYPES.text;
}
function resolveSqlIdentifier3(sourceAlias, codec) {
  return resolveDomains(codec) === TYPES.citext ? [sourceAlias, codec] : [sql`lower(${sourceAlias}::text)`, TYPES.text];
}
function resolveSqlValue2($placeholderable, $input, inputCodec) {
  if ("equalTo" === "in" || "equalTo" === "notIn") {
    const sqlList = $placeholderable.placeholder($input, inputCodec);
    if (inputCodec.arrayOfCodec === TYPES.citext) return sqlList;else return sql`(select lower(t) from unnest(${sqlList}) t)`;
  } else {
    const sqlValue = $placeholderable.placeholder($input, inputCodec);
    if (inputCodec === TYPES.citext) return sqlValue;else return sql`lower(${sqlValue})`;
  }
}
function resolveInputCodec6(inputCodec) {
  if ("notEqualTo" === "in" || "notEqualTo" === "notIn") {
    const t = resolveDomains(inputCodec) === TYPES.citext ? inputCodec : TYPES.text;
    return listOfCodec(t, {
      extensions: {
        listItemNonNull: !0
      }
    });
  } else return resolveDomains(inputCodec) === TYPES.citext ? inputCodec : TYPES.text;
}
function resolveSqlIdentifier4(sourceAlias, codec) {
  return resolveDomains(codec) === TYPES.citext ? [sourceAlias, codec] : [sql`lower(${sourceAlias}::text)`, TYPES.text];
}
function resolveSqlValue3($placeholderable, $input, inputCodec) {
  if ("notEqualTo" === "in" || "notEqualTo" === "notIn") {
    const sqlList = $placeholderable.placeholder($input, inputCodec);
    if (inputCodec.arrayOfCodec === TYPES.citext) return sqlList;else return sql`(select lower(t) from unnest(${sqlList}) t)`;
  } else {
    const sqlValue = $placeholderable.placeholder($input, inputCodec);
    if (inputCodec === TYPES.citext) return sqlValue;else return sql`lower(${sqlValue})`;
  }
}
function resolveInputCodec7(inputCodec) {
  if ("distinctFrom" === "in" || "distinctFrom" === "notIn") {
    const t = resolveDomains(inputCodec) === TYPES.citext ? inputCodec : TYPES.text;
    return listOfCodec(t, {
      extensions: {
        listItemNonNull: !0
      }
    });
  } else return resolveDomains(inputCodec) === TYPES.citext ? inputCodec : TYPES.text;
}
function resolveSqlIdentifier5(sourceAlias, codec) {
  return resolveDomains(codec) === TYPES.citext ? [sourceAlias, codec] : [sql`lower(${sourceAlias}::text)`, TYPES.text];
}
function resolveSqlValue4($placeholderable, $input, inputCodec) {
  if ("distinctFrom" === "in" || "distinctFrom" === "notIn") {
    const sqlList = $placeholderable.placeholder($input, inputCodec);
    if (inputCodec.arrayOfCodec === TYPES.citext) return sqlList;else return sql`(select lower(t) from unnest(${sqlList}) t)`;
  } else {
    const sqlValue = $placeholderable.placeholder($input, inputCodec);
    if (inputCodec === TYPES.citext) return sqlValue;else return sql`lower(${sqlValue})`;
  }
}
function resolveInputCodec8(inputCodec) {
  if ("notDistinctFrom" === "in" || "notDistinctFrom" === "notIn") {
    const t = resolveDomains(inputCodec) === TYPES.citext ? inputCodec : TYPES.text;
    return listOfCodec(t, {
      extensions: {
        listItemNonNull: !0
      }
    });
  } else return resolveDomains(inputCodec) === TYPES.citext ? inputCodec : TYPES.text;
}
function resolveSqlIdentifier6(sourceAlias, codec) {
  return resolveDomains(codec) === TYPES.citext ? [sourceAlias, codec] : [sql`lower(${sourceAlias}::text)`, TYPES.text];
}
function resolveSqlValue5($placeholderable, $input, inputCodec) {
  if ("notDistinctFrom" === "in" || "notDistinctFrom" === "notIn") {
    const sqlList = $placeholderable.placeholder($input, inputCodec);
    if (inputCodec.arrayOfCodec === TYPES.citext) return sqlList;else return sql`(select lower(t) from unnest(${sqlList}) t)`;
  } else {
    const sqlValue = $placeholderable.placeholder($input, inputCodec);
    if (inputCodec === TYPES.citext) return sqlValue;else return sql`lower(${sqlValue})`;
  }
}
function resolveInputCodec9(inputCodec) {
  if ("in" === "in" || "in" === "notIn") {
    const t = resolveDomains(inputCodec) === TYPES.citext ? inputCodec : TYPES.text;
    return listOfCodec(t, {
      extensions: {
        listItemNonNull: !0
      }
    });
  } else return resolveDomains(inputCodec) === TYPES.citext ? inputCodec : TYPES.text;
}
function resolveSqlIdentifier7(sourceAlias, codec) {
  return resolveDomains(codec) === TYPES.citext ? [sourceAlias, codec] : [sql`lower(${sourceAlias}::text)`, TYPES.text];
}
function resolveSqlValue6($placeholderable, $input, inputCodec) {
  if ("in" === "in" || "in" === "notIn") {
    const sqlList = $placeholderable.placeholder($input, inputCodec);
    if (inputCodec.arrayOfCodec === TYPES.citext) return sqlList;else return sql`(select lower(t) from unnest(${sqlList}) t)`;
  } else {
    const sqlValue = $placeholderable.placeholder($input, inputCodec);
    if (inputCodec === TYPES.citext) return sqlValue;else return sql`lower(${sqlValue})`;
  }
}
function resolveInputCodec10(inputCodec) {
  if ("notIn" === "in" || "notIn" === "notIn") {
    const t = resolveDomains(inputCodec) === TYPES.citext ? inputCodec : TYPES.text;
    return listOfCodec(t, {
      extensions: {
        listItemNonNull: !0
      }
    });
  } else return resolveDomains(inputCodec) === TYPES.citext ? inputCodec : TYPES.text;
}
function resolveSqlIdentifier8(sourceAlias, codec) {
  return resolveDomains(codec) === TYPES.citext ? [sourceAlias, codec] : [sql`lower(${sourceAlias}::text)`, TYPES.text];
}
function resolveSqlValue7($placeholderable, $input, inputCodec) {
  if ("notIn" === "in" || "notIn" === "notIn") {
    const sqlList = $placeholderable.placeholder($input, inputCodec);
    if (inputCodec.arrayOfCodec === TYPES.citext) return sqlList;else return sql`(select lower(t) from unnest(${sqlList}) t)`;
  } else {
    const sqlValue = $placeholderable.placeholder($input, inputCodec);
    if (inputCodec === TYPES.citext) return sqlValue;else return sql`lower(${sqlValue})`;
  }
}
function resolveInputCodec11(inputCodec) {
  if ("lessThan" === "in" || "lessThan" === "notIn") {
    const t = resolveDomains(inputCodec) === TYPES.citext ? inputCodec : TYPES.text;
    return listOfCodec(t, {
      extensions: {
        listItemNonNull: !0
      }
    });
  } else return resolveDomains(inputCodec) === TYPES.citext ? inputCodec : TYPES.text;
}
function resolveSqlIdentifier9(sourceAlias, codec) {
  return resolveDomains(codec) === TYPES.citext ? [sourceAlias, codec] : [sql`lower(${sourceAlias}::text)`, TYPES.text];
}
function resolveSqlValue8($placeholderable, $input, inputCodec) {
  if ("lessThan" === "in" || "lessThan" === "notIn") {
    const sqlList = $placeholderable.placeholder($input, inputCodec);
    if (inputCodec.arrayOfCodec === TYPES.citext) return sqlList;else return sql`(select lower(t) from unnest(${sqlList}) t)`;
  } else {
    const sqlValue = $placeholderable.placeholder($input, inputCodec);
    if (inputCodec === TYPES.citext) return sqlValue;else return sql`lower(${sqlValue})`;
  }
}
function resolveInputCodec12(inputCodec) {
  if ("lessThanOrEqualTo" === "in" || "lessThanOrEqualTo" === "notIn") {
    const t = resolveDomains(inputCodec) === TYPES.citext ? inputCodec : TYPES.text;
    return listOfCodec(t, {
      extensions: {
        listItemNonNull: !0
      }
    });
  } else return resolveDomains(inputCodec) === TYPES.citext ? inputCodec : TYPES.text;
}
function resolveSqlIdentifier10(sourceAlias, codec) {
  return resolveDomains(codec) === TYPES.citext ? [sourceAlias, codec] : [sql`lower(${sourceAlias}::text)`, TYPES.text];
}
function resolveSqlValue9($placeholderable, $input, inputCodec) {
  if ("lessThanOrEqualTo" === "in" || "lessThanOrEqualTo" === "notIn") {
    const sqlList = $placeholderable.placeholder($input, inputCodec);
    if (inputCodec.arrayOfCodec === TYPES.citext) return sqlList;else return sql`(select lower(t) from unnest(${sqlList}) t)`;
  } else {
    const sqlValue = $placeholderable.placeholder($input, inputCodec);
    if (inputCodec === TYPES.citext) return sqlValue;else return sql`lower(${sqlValue})`;
  }
}
function resolveInputCodec13(inputCodec) {
  if ("greaterThan" === "in" || "greaterThan" === "notIn") {
    const t = resolveDomains(inputCodec) === TYPES.citext ? inputCodec : TYPES.text;
    return listOfCodec(t, {
      extensions: {
        listItemNonNull: !0
      }
    });
  } else return resolveDomains(inputCodec) === TYPES.citext ? inputCodec : TYPES.text;
}
function resolveSqlIdentifier11(sourceAlias, codec) {
  return resolveDomains(codec) === TYPES.citext ? [sourceAlias, codec] : [sql`lower(${sourceAlias}::text)`, TYPES.text];
}
function resolveSqlValue10($placeholderable, $input, inputCodec) {
  if ("greaterThan" === "in" || "greaterThan" === "notIn") {
    const sqlList = $placeholderable.placeholder($input, inputCodec);
    if (inputCodec.arrayOfCodec === TYPES.citext) return sqlList;else return sql`(select lower(t) from unnest(${sqlList}) t)`;
  } else {
    const sqlValue = $placeholderable.placeholder($input, inputCodec);
    if (inputCodec === TYPES.citext) return sqlValue;else return sql`lower(${sqlValue})`;
  }
}
function resolveInputCodec14(inputCodec) {
  if ("greaterThanOrEqualTo" === "in" || "greaterThanOrEqualTo" === "notIn") {
    const t = resolveDomains(inputCodec) === TYPES.citext ? inputCodec : TYPES.text;
    return listOfCodec(t, {
      extensions: {
        listItemNonNull: !0
      }
    });
  } else return resolveDomains(inputCodec) === TYPES.citext ? inputCodec : TYPES.text;
}
function resolveSqlIdentifier12(sourceAlias, codec) {
  return resolveDomains(codec) === TYPES.citext ? [sourceAlias, codec] : [sql`lower(${sourceAlias}::text)`, TYPES.text];
}
function resolveSqlValue11($placeholderable, $input, inputCodec) {
  if ("greaterThanOrEqualTo" === "in" || "greaterThanOrEqualTo" === "notIn") {
    const sqlList = $placeholderable.placeholder($input, inputCodec);
    if (inputCodec.arrayOfCodec === TYPES.citext) return sqlList;else return sql`(select lower(t) from unnest(${sqlList}) t)`;
  } else {
    const sqlValue = $placeholderable.placeholder($input, inputCodec);
    if (inputCodec === TYPES.citext) return sqlValue;else return sql`lower(${sqlValue})`;
  }
}
const resolve28 = (i, _v, $input) => sql`${i} ${$input.eval() ? sql`IS NULL` : sql`IS NOT NULL`}`;
const resolveInputCodec15 = () => TYPES.boolean;
const resolveSqlValue12 = () => sql.null;
const resolve29 = (i, v) => sql`${i} = ${v}`;
const forceTextTypesSensitive2 = [TYPES.citext, TYPES.char, TYPES.bpchar];
function resolveDomains2(c) {
  let current = c;
  while (current.domainOfCodec) current = current.domainOfCodec;
  return current;
}
function resolveInputCodec16(c) {
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
function resolveSqlIdentifier13(identifier, c) {
  if (c.arrayOfCodec && forceTextTypesSensitive2.includes(resolveDomains2(c.arrayOfCodec))) return [sql`(${identifier})::text[]`, listOfCodec(TYPES.text, {
    extensions: {
      listItemNonNull: c.extensions?.listItemNonNull
    }
  })];else if (forceTextTypesSensitive2.includes(resolveDomains2(c))) return [sql`(${identifier})::text`, TYPES.text];else return [identifier, c];
}
const resolve30 = (i, v) => sql`${i} <> ${v}`;
const resolve31 = (i, v) => sql`${i} IS DISTINCT FROM ${v}`;
const resolve32 = (i, v) => sql`${i} IS NOT DISTINCT FROM ${v}`;
const resolve33 = (i, v) => sql`${i} = ANY(${v})`;
function resolveInputCodec17(c) {
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
const resolve34 = (i, v) => sql`${i} <> ALL(${v})`;
const resolve35 = (i, v) => sql`${i} < ${v}`;
const resolve36 = (i, v) => sql`${i} <= ${v}`;
const resolve37 = (i, v) => sql`${i} > ${v}`;
const resolve38 = (i, v) => sql`${i} >= ${v}`;
function assertAllowed15(fieldArgs, mode) {
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
const colSpec9 = {
  attributeName: "id",
  attribute: spec_post.attributes.id
};
const colSpec10 = {
  attributeName: "title",
  attribute: spec_post.attributes.title
};
const colSpec11 = {
  attributeName: "description",
  attribute: spec_post.attributes.description
};
const colSpec12 = {
  attributeName: "projectId",
  attribute: spec_post.attributes.projectId
};
const colSpec13 = {
  attributeName: "authorId",
  attribute: spec_post.attributes.authorId
};
const colSpec14 = {
  attributeName: "createdAt",
  attribute: spec_post.attributes.createdAt
};
const colSpec15 = {
  attributeName: "updatedAt",
  attribute: spec_post.attributes.updatedAt
};
function assertAllowed16(fieldArgs, mode) {
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
function assertAllowed17(fieldArgs, mode) {
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
function assertAllowed18(fieldArgs, mode) {
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
function assertAllowed19(fieldArgs, mode) {
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
const colSpec16 = {
  attributeName: "id",
  attribute: spec_upvote.attributes.id
};
const colSpec17 = {
  attributeName: "postId",
  attribute: spec_upvote.attributes.postId
};
const colSpec18 = {
  attributeName: "userId",
  attribute: spec_upvote.attributes.userId
};
const colSpec19 = {
  attributeName: "createdAt",
  attribute: spec_upvote.attributes.createdAt
};
const colSpec20 = {
  attributeName: "updatedAt",
  attribute: spec_upvote.attributes.updatedAt
};
function assertAllowed20(fieldArgs, mode) {
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
function assertAllowed21(fieldArgs, mode) {
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
const colSpec21 = {
  attributeName: "id",
  attribute: spec_user.attributes.id
};
const colSpec22 = {
  attributeName: "walletAddress",
  attribute: spec_user.attributes.walletAddress
};
const colSpec23 = {
  attributeName: "createdAt",
  attribute: spec_user.attributes.createdAt
};
const colSpec24 = {
  attributeName: "updatedAt",
  attribute: spec_user.attributes.updatedAt
};
function assertAllowed22(fieldArgs, mode) {
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
function assertAllowed23(fieldArgs, mode) {
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
function assertAllowed24(fieldArgs, mode) {
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
function assertAllowed25(fieldArgs, mode) {
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
const colSpec25 = {
  attributeName: "id",
  attribute: spec_organization.attributes.id
};
const colSpec26 = {
  attributeName: "name",
  attribute: spec_organization.attributes.name
};
const colSpec27 = {
  attributeName: "slug",
  attribute: spec_organization.attributes.slug
};
const colSpec28 = {
  attributeName: "createdAt",
  attribute: spec_organization.attributes.createdAt
};
const colSpec29 = {
  attributeName: "updatedAt",
  attribute: spec_organization.attributes.updatedAt
};
function assertAllowed26(fieldArgs, mode) {
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
function assertAllowed27(fieldArgs, mode) {
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
function assertAllowed28(fieldArgs, mode) {
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
const colSpec30 = {
  attributeName: "id",
  attribute: spec__prismaMigrations.attributes.id
};
const colSpec31 = {
  attributeName: "checksum",
  attribute: spec__prismaMigrations.attributes.checksum
};
const colSpec32 = {
  attributeName: "finished_at",
  attribute: spec__prismaMigrations.attributes.finished_at
};
const colSpec33 = {
  attributeName: "migration_name",
  attribute: spec__prismaMigrations.attributes.migration_name
};
const colSpec34 = {
  attributeName: "logs",
  attribute: spec__prismaMigrations.attributes.logs
};
const colSpec35 = {
  attributeName: "rolled_back_at",
  attribute: spec__prismaMigrations.attributes.rolled_back_at
};
const colSpec36 = {
  attributeName: "started_at",
  attribute: spec__prismaMigrations.attributes.started_at
};
const colSpec37 = {
  attributeName: "applied_steps_count",
  attribute: spec__prismaMigrations.attributes.applied_steps_count
};
function assertAllowed29(fieldArgs, mode) {
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
const resolve39 = (i, _v, $input) => sql`${i} ${$input.eval() ? sql`IS NULL` : sql`IS NOT NULL`}`;
const resolveInputCodec18 = () => TYPES.boolean;
const resolveSqlValue13 = () => sql.null;
const resolve40 = (i, v) => sql`${i} = ${v}`;
const forceTextTypesSensitive3 = [TYPES.citext, TYPES.char, TYPES.bpchar];
function resolveDomains3(c) {
  let current = c;
  while (current.domainOfCodec) current = current.domainOfCodec;
  return current;
}
function resolveInputCodec19(c) {
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
function resolveSqlIdentifier14(identifier, c) {
  if (c.arrayOfCodec && forceTextTypesSensitive3.includes(resolveDomains3(c.arrayOfCodec))) return [sql`(${identifier})::text[]`, listOfCodec(TYPES.text, {
    extensions: {
      listItemNonNull: c.extensions?.listItemNonNull
    }
  })];else if (forceTextTypesSensitive3.includes(resolveDomains3(c))) return [sql`(${identifier})::text`, TYPES.text];else return [identifier, c];
}
const resolve41 = (i, v) => sql`${i} <> ${v}`;
const resolve42 = (i, v) => sql`${i} IS DISTINCT FROM ${v}`;
const resolve43 = (i, v) => sql`${i} IS NOT DISTINCT FROM ${v}`;
const resolve44 = (i, v) => sql`${i} = ANY(${v})`;
function resolveInputCodec20(c) {
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
const resolve45 = (i, v) => sql`${i} <> ALL(${v})`;
const resolve46 = (i, v) => sql`${i} < ${v}`;
const resolve47 = (i, v) => sql`${i} <= ${v}`;
const resolve48 = (i, v) => sql`${i} > ${v}`;
const resolve49 = (i, v) => sql`${i} >= ${v}`;
const specFromArgs = args => {
  const $nodeId = args.get(["input", "id"]);
  return specFromNodeId(nodeIdHandlerByTypeName.User, $nodeId);
};
const specFromArgs2 = args => {
  const $nodeId = args.get(["input", "id"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Organization, $nodeId);
};
const specFromArgs3 = args => {
  const $nodeId = args.get(["input", "id"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Upvote, $nodeId);
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
  return specFromNodeId(nodeIdHandlerByTypeName._PrismaMigration, $nodeId);
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
  return specFromNodeId(nodeIdHandlerByTypeName.Upvote, $nodeId);
};
const specFromArgs10 = args => {
  const $nodeId = args.get(["input", "id"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Post, $nodeId);
};
const specFromArgs11 = args => {
  const $nodeId = args.get(["input", "id"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Project, $nodeId);
};
const specFromArgs12 = args => {
  const $nodeId = args.get(["input", "id"]);
  return specFromNodeId(nodeIdHandlerByTypeName._PrismaMigration, $nodeId);
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

  """Get a single \`User\`."""
  userByRowId(rowId: String!): User

  """Get a single \`Organization\`."""
  organizationByRowId(rowId: String!): Organization

  """Get a single \`Upvote\`."""
  upvoteByRowId(rowId: String!): Upvote

  """Get a single \`Post\`."""
  postByRowId(rowId: String!): Post

  """Get a single \`Project\`."""
  projectByRowId(rowId: String!): Project

  """Get a single \`_PrismaMigration\`."""
  _prismaMigrationByRowId(rowId: String!): _PrismaMigration

  """Reads a single \`User\` using its globally unique \`ID\`."""
  user(
    """The globally unique \`ID\` to be used in selecting a single \`User\`."""
    id: ID!
  ): User

  """Reads a single \`Organization\` using its globally unique \`ID\`."""
  organization(
    """
    The globally unique \`ID\` to be used in selecting a single \`Organization\`.
    """
    id: ID!
  ): Organization

  """Reads a single \`Upvote\` using its globally unique \`ID\`."""
  upvote(
    """The globally unique \`ID\` to be used in selecting a single \`Upvote\`."""
    id: ID!
  ): Upvote

  """Reads a single \`Post\` using its globally unique \`ID\`."""
  post(
    """The globally unique \`ID\` to be used in selecting a single \`Post\`."""
    id: ID!
  ): Post

  """Reads a single \`Project\` using its globally unique \`ID\`."""
  project(
    """The globally unique \`ID\` to be used in selecting a single \`Project\`."""
    id: ID!
  ): Project

  """Reads a single \`_PrismaMigration\` using its globally unique \`ID\`."""
  _prismaMigration(
    """
    The globally unique \`ID\` to be used in selecting a single \`_PrismaMigration\`.
    """
    id: ID!
  ): _PrismaMigration

  """Reads and enables pagination through a set of \`User\`."""
  allUsers(
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
  allOrganizations(
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

  """Reads and enables pagination through a set of \`Upvote\`."""
  allUpvotes(
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

  """Reads and enables pagination through a set of \`Post\`."""
  allPosts(
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
  allProjects(
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

  """Reads and enables pagination through a set of \`_PrismaMigration\`."""
  allPrismaMigrations(
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

    """The method to use when ordering \`_PrismaMigration\`."""
    orderBy: [_PrismaMigrationOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: _PrismaMigrationCondition

    """
    A filter to be used in determining which values should be returned by the collection.
    """
    filter: _PrismaMigrationFilter
  ): _PrismaMigrationConnection
}

"""An object with a globally unique \`ID\`."""
interface Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  id: ID!
}

type User implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  id: ID!
  rowId: String!
  walletAddress: String!
  createdAt: Datetime!
  updatedAt: Datetime!

  """Reads and enables pagination through a set of \`Post\`."""
  postsByAuthorId(
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
  ): PostConnection!

  """Reads and enables pagination through a set of \`Upvote\`."""
  upvotesByUserId(
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
  ): UpvoteConnection!
}

"""
A point in time as described by the [ISO
8601](https://en.wikipedia.org/wiki/ISO_8601) and, if it has a timezone, [RFC
3339](https://datatracker.ietf.org/doc/html/rfc3339) standards. Input values
that do not conform to both ISO 8601 and RFC 3339 may be coerced, which may lead
to unexpected results.
"""
scalar Datetime

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
}

type Post implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  id: ID!
  rowId: String!
  title: String!
  description: String!
  projectId: String!
  authorId: String!
  createdAt: Datetime!
  updatedAt: Datetime!

  """Reads a single \`User\` that is related to this \`Post\`."""
  userByAuthorId: User

  """Reads a single \`Project\` that is related to this \`Post\`."""
  projectByProjectId: Project

  """Reads and enables pagination through a set of \`Upvote\`."""
  upvotesByPostId(
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
  ): UpvoteConnection!
}

type Project implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  id: ID!
  rowId: String!
  name: String!
  description: String
  organizationId: String!
  slug: String!
  image: String
  createdAt: Datetime!
  updatedAt: Datetime!

  """Reads a single \`Organization\` that is related to this \`Project\`."""
  organizationByOrganizationId: Organization

  """Reads and enables pagination through a set of \`Post\`."""
  postsByProjectId(
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
  ): PostConnection!
}

type Organization implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  id: ID!
  rowId: String!
  name: String!
  slug: String!
  createdAt: Datetime!
  updatedAt: Datetime!

  """Reads and enables pagination through a set of \`Project\`."""
  projectsByOrganizationId(
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
  ): ProjectConnection!
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
}

"""A \`Project\` edge in the connection."""
type ProjectEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`Project\` at the end of the edge."""
  node: Project
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

"""Methods to use when ordering \`Project\`."""
enum ProjectOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ID_ASC
  ID_DESC
  NAME_ASC
  NAME_DESC
  DESCRIPTION_ASC
  DESCRIPTION_DESC
  ORGANIZATION_ID_ASC
  ORGANIZATION_ID_DESC
  SLUG_ASC
  SLUG_DESC
  IMAGE_ASC
  IMAGE_DESC
  CREATED_AT_ASC
  CREATED_AT_DESC
  UPDATED_AT_ASC
  UPDATED_AT_DESC
}

"""
A condition to be used against \`Project\` object types. All fields are tested for equality and combined with a logical ‘and.’
"""
input ProjectCondition {
  """Checks for equality with the object’s \`rowId\` field."""
  rowId: String

  """Checks for equality with the object’s \`name\` field."""
  name: String

  """Checks for equality with the object’s \`description\` field."""
  description: String

  """Checks for equality with the object’s \`organizationId\` field."""
  organizationId: String

  """Checks for equality with the object’s \`slug\` field."""
  slug: String

  """Checks for equality with the object’s \`image\` field."""
  image: String

  """Checks for equality with the object’s \`createdAt\` field."""
  createdAt: Datetime

  """Checks for equality with the object’s \`updatedAt\` field."""
  updatedAt: Datetime
}

"""
A filter to be used against \`Project\` object types. All fields are combined with a logical ‘and.’
"""
input ProjectFilter {
  """Filter by the object’s \`rowId\` field."""
  rowId: StringFilter

  """Filter by the object’s \`name\` field."""
  name: StringFilter

  """Filter by the object’s \`description\` field."""
  description: StringFilter

  """Filter by the object’s \`organizationId\` field."""
  organizationId: StringFilter

  """Filter by the object’s \`slug\` field."""
  slug: StringFilter

  """Filter by the object’s \`image\` field."""
  image: StringFilter

  """Filter by the object’s \`createdAt\` field."""
  createdAt: DatetimeFilter

  """Filter by the object’s \`updatedAt\` field."""
  updatedAt: DatetimeFilter

  """Filter by the object’s \`postsByProjectId\` relation."""
  postsByProjectId: ProjectToManyPostFilter

  """Some related \`postsByProjectId\` exist."""
  postsByProjectIdExist: Boolean

  """Filter by the object’s \`organizationByOrganizationId\` relation."""
  organizationByOrganizationId: OrganizationFilter

  """Checks for all expressions in this list."""
  and: [ProjectFilter!]

  """Checks for any expressions in this list."""
  or: [ProjectFilter!]

  """Negates the expression."""
  not: ProjectFilter
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

"""
A filter to be used against many \`Post\` object types. All fields are combined with a logical ‘and.’
"""
input ProjectToManyPostFilter {
  """
  Every related \`Post\` matches the filter criteria. All fields are combined with a logical ‘and.’
  """
  every: PostFilter

  """
  Some related \`Post\` matches the filter criteria. All fields are combined with a logical ‘and.’
  """
  some: PostFilter

  """
  No related \`Post\` matches the filter criteria. All fields are combined with a logical ‘and.’
  """
  none: PostFilter
}

"""
A filter to be used against \`Post\` object types. All fields are combined with a logical ‘and.’
"""
input PostFilter {
  """Filter by the object’s \`rowId\` field."""
  rowId: StringFilter

  """Filter by the object’s \`title\` field."""
  title: StringFilter

  """Filter by the object’s \`description\` field."""
  description: StringFilter

  """Filter by the object’s \`projectId\` field."""
  projectId: StringFilter

  """Filter by the object’s \`authorId\` field."""
  authorId: StringFilter

  """Filter by the object’s \`createdAt\` field."""
  createdAt: DatetimeFilter

  """Filter by the object’s \`updatedAt\` field."""
  updatedAt: DatetimeFilter

  """Filter by the object’s \`upvotesByPostId\` relation."""
  upvotesByPostId: PostToManyUpvoteFilter

  """Some related \`upvotesByPostId\` exist."""
  upvotesByPostIdExist: Boolean

  """Filter by the object’s \`userByAuthorId\` relation."""
  userByAuthorId: UserFilter

  """Filter by the object’s \`projectByProjectId\` relation."""
  projectByProjectId: ProjectFilter

  """Checks for all expressions in this list."""
  and: [PostFilter!]

  """Checks for any expressions in this list."""
  or: [PostFilter!]

  """Negates the expression."""
  not: PostFilter
}

"""
A filter to be used against many \`Upvote\` object types. All fields are combined with a logical ‘and.’
"""
input PostToManyUpvoteFilter {
  """
  Every related \`Upvote\` matches the filter criteria. All fields are combined with a logical ‘and.’
  """
  every: UpvoteFilter

  """
  Some related \`Upvote\` matches the filter criteria. All fields are combined with a logical ‘and.’
  """
  some: UpvoteFilter

  """
  No related \`Upvote\` matches the filter criteria. All fields are combined with a logical ‘and.’
  """
  none: UpvoteFilter
}

"""
A filter to be used against \`Upvote\` object types. All fields are combined with a logical ‘and.’
"""
input UpvoteFilter {
  """Filter by the object’s \`rowId\` field."""
  rowId: StringFilter

  """Filter by the object’s \`postId\` field."""
  postId: StringFilter

  """Filter by the object’s \`userId\` field."""
  userId: StringFilter

  """Filter by the object’s \`createdAt\` field."""
  createdAt: DatetimeFilter

  """Filter by the object’s \`updatedAt\` field."""
  updatedAt: DatetimeFilter

  """Filter by the object’s \`postByPostId\` relation."""
  postByPostId: PostFilter

  """Filter by the object’s \`userByUserId\` relation."""
  userByUserId: UserFilter

  """Checks for all expressions in this list."""
  and: [UpvoteFilter!]

  """Checks for any expressions in this list."""
  or: [UpvoteFilter!]

  """Negates the expression."""
  not: UpvoteFilter
}

"""
A filter to be used against \`User\` object types. All fields are combined with a logical ‘and.’
"""
input UserFilter {
  """Filter by the object’s \`rowId\` field."""
  rowId: StringFilter

  """Filter by the object’s \`walletAddress\` field."""
  walletAddress: StringFilter

  """Filter by the object’s \`createdAt\` field."""
  createdAt: DatetimeFilter

  """Filter by the object’s \`updatedAt\` field."""
  updatedAt: DatetimeFilter

  """Filter by the object’s \`postsByAuthorId\` relation."""
  postsByAuthorId: UserToManyPostFilter

  """Some related \`postsByAuthorId\` exist."""
  postsByAuthorIdExist: Boolean

  """Filter by the object’s \`upvotesByUserId\` relation."""
  upvotesByUserId: UserToManyUpvoteFilter

  """Some related \`upvotesByUserId\` exist."""
  upvotesByUserIdExist: Boolean

  """Checks for all expressions in this list."""
  and: [UserFilter!]

  """Checks for any expressions in this list."""
  or: [UserFilter!]

  """Negates the expression."""
  not: UserFilter
}

"""
A filter to be used against many \`Post\` object types. All fields are combined with a logical ‘and.’
"""
input UserToManyPostFilter {
  """
  Every related \`Post\` matches the filter criteria. All fields are combined with a logical ‘and.’
  """
  every: PostFilter

  """
  Some related \`Post\` matches the filter criteria. All fields are combined with a logical ‘and.’
  """
  some: PostFilter

  """
  No related \`Post\` matches the filter criteria. All fields are combined with a logical ‘and.’
  """
  none: PostFilter
}

"""
A filter to be used against many \`Upvote\` object types. All fields are combined with a logical ‘and.’
"""
input UserToManyUpvoteFilter {
  """
  Every related \`Upvote\` matches the filter criteria. All fields are combined with a logical ‘and.’
  """
  every: UpvoteFilter

  """
  Some related \`Upvote\` matches the filter criteria. All fields are combined with a logical ‘and.’
  """
  some: UpvoteFilter

  """
  No related \`Upvote\` matches the filter criteria. All fields are combined with a logical ‘and.’
  """
  none: UpvoteFilter
}

"""
A filter to be used against \`Organization\` object types. All fields are combined with a logical ‘and.’
"""
input OrganizationFilter {
  """Filter by the object’s \`rowId\` field."""
  rowId: StringFilter

  """Filter by the object’s \`name\` field."""
  name: StringFilter

  """Filter by the object’s \`slug\` field."""
  slug: StringFilter

  """Filter by the object’s \`createdAt\` field."""
  createdAt: DatetimeFilter

  """Filter by the object’s \`updatedAt\` field."""
  updatedAt: DatetimeFilter

  """Filter by the object’s \`projectsByOrganizationId\` relation."""
  projectsByOrganizationId: OrganizationToManyProjectFilter

  """Some related \`projectsByOrganizationId\` exist."""
  projectsByOrganizationIdExist: Boolean

  """Checks for all expressions in this list."""
  and: [OrganizationFilter!]

  """Checks for any expressions in this list."""
  or: [OrganizationFilter!]

  """Negates the expression."""
  not: OrganizationFilter
}

"""
A filter to be used against many \`Project\` object types. All fields are combined with a logical ‘and.’
"""
input OrganizationToManyProjectFilter {
  """
  Every related \`Project\` matches the filter criteria. All fields are combined with a logical ‘and.’
  """
  every: ProjectFilter

  """
  Some related \`Project\` matches the filter criteria. All fields are combined with a logical ‘and.’
  """
  some: ProjectFilter

  """
  No related \`Project\` matches the filter criteria. All fields are combined with a logical ‘and.’
  """
  none: ProjectFilter
}

"""Methods to use when ordering \`Post\`."""
enum PostOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ID_ASC
  ID_DESC
  TITLE_ASC
  TITLE_DESC
  DESCRIPTION_ASC
  DESCRIPTION_DESC
  PROJECT_ID_ASC
  PROJECT_ID_DESC
  AUTHOR_ID_ASC
  AUTHOR_ID_DESC
  CREATED_AT_ASC
  CREATED_AT_DESC
  UPDATED_AT_ASC
  UPDATED_AT_DESC
}

"""
A condition to be used against \`Post\` object types. All fields are tested for equality and combined with a logical ‘and.’
"""
input PostCondition {
  """Checks for equality with the object’s \`rowId\` field."""
  rowId: String

  """Checks for equality with the object’s \`title\` field."""
  title: String

  """Checks for equality with the object’s \`description\` field."""
  description: String

  """Checks for equality with the object’s \`projectId\` field."""
  projectId: String

  """Checks for equality with the object’s \`authorId\` field."""
  authorId: String

  """Checks for equality with the object’s \`createdAt\` field."""
  createdAt: Datetime

  """Checks for equality with the object’s \`updatedAt\` field."""
  updatedAt: Datetime
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
}

type Upvote implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  id: ID!
  rowId: String!
  postId: String!
  userId: String!
  createdAt: Datetime!
  updatedAt: Datetime!

  """Reads a single \`Post\` that is related to this \`Upvote\`."""
  postByPostId: Post

  """Reads a single \`User\` that is related to this \`Upvote\`."""
  userByUserId: User
}

"""A \`Upvote\` edge in the connection."""
type UpvoteEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`Upvote\` at the end of the edge."""
  node: Upvote
}

"""Methods to use when ordering \`Upvote\`."""
enum UpvoteOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ID_ASC
  ID_DESC
  POST_ID_ASC
  POST_ID_DESC
  USER_ID_ASC
  USER_ID_DESC
  CREATED_AT_ASC
  CREATED_AT_DESC
  UPDATED_AT_ASC
  UPDATED_AT_DESC
}

"""
A condition to be used against \`Upvote\` object types. All fields are tested for equality and combined with a logical ‘and.’
"""
input UpvoteCondition {
  """Checks for equality with the object’s \`rowId\` field."""
  rowId: String

  """Checks for equality with the object’s \`postId\` field."""
  postId: String

  """Checks for equality with the object’s \`userId\` field."""
  userId: String

  """Checks for equality with the object’s \`createdAt\` field."""
  createdAt: Datetime

  """Checks for equality with the object’s \`updatedAt\` field."""
  updatedAt: Datetime
}

"""A \`Post\` edge in the connection."""
type PostEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`Post\` at the end of the edge."""
  node: Post
}

type _PrismaMigration implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  id: ID!
  rowId: String!
  checksum: String!
  finishedAt: Datetime
  migrationName: String!
  logs: String
  rolledBackAt: Datetime
  startedAt: Datetime!
  appliedStepsCount: Int!
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
}

"""A \`User\` edge in the connection."""
type UserEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`User\` at the end of the edge."""
  node: User
}

"""Methods to use when ordering \`User\`."""
enum UserOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ID_ASC
  ID_DESC
  WALLET_ADDRESS_ASC
  WALLET_ADDRESS_DESC
  CREATED_AT_ASC
  CREATED_AT_DESC
  UPDATED_AT_ASC
  UPDATED_AT_DESC
}

"""
A condition to be used against \`User\` object types. All fields are tested for equality and combined with a logical ‘and.’
"""
input UserCondition {
  """Checks for equality with the object’s \`rowId\` field."""
  rowId: String

  """Checks for equality with the object’s \`walletAddress\` field."""
  walletAddress: String

  """Checks for equality with the object’s \`createdAt\` field."""
  createdAt: Datetime

  """Checks for equality with the object’s \`updatedAt\` field."""
  updatedAt: Datetime
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
}

"""A \`Organization\` edge in the connection."""
type OrganizationEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`Organization\` at the end of the edge."""
  node: Organization
}

"""Methods to use when ordering \`Organization\`."""
enum OrganizationOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ID_ASC
  ID_DESC
  NAME_ASC
  NAME_DESC
  SLUG_ASC
  SLUG_DESC
  CREATED_AT_ASC
  CREATED_AT_DESC
  UPDATED_AT_ASC
  UPDATED_AT_DESC
}

"""
A condition to be used against \`Organization\` object types. All fields are
tested for equality and combined with a logical ‘and.’
"""
input OrganizationCondition {
  """Checks for equality with the object’s \`rowId\` field."""
  rowId: String

  """Checks for equality with the object’s \`name\` field."""
  name: String

  """Checks for equality with the object’s \`slug\` field."""
  slug: String

  """Checks for equality with the object’s \`createdAt\` field."""
  createdAt: Datetime

  """Checks for equality with the object’s \`updatedAt\` field."""
  updatedAt: Datetime
}

"""A connection to a list of \`_PrismaMigration\` values."""
type _PrismaMigrationConnection {
  """A list of \`_PrismaMigration\` objects."""
  nodes: [_PrismaMigration]!

  """
  A list of edges which contains the \`_PrismaMigration\` and cursor to aid in pagination.
  """
  edges: [_PrismaMigrationEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """
  The count of *all* \`_PrismaMigration\` you could get from the connection.
  """
  totalCount: Int!
}

"""A \`_PrismaMigration\` edge in the connection."""
type _PrismaMigrationEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`_PrismaMigration\` at the end of the edge."""
  node: _PrismaMigration
}

"""Methods to use when ordering \`_PrismaMigration\`."""
enum _PrismaMigrationOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ID_ASC
  ID_DESC
  CHECKSUM_ASC
  CHECKSUM_DESC
  FINISHED_AT_ASC
  FINISHED_AT_DESC
  MIGRATION_NAME_ASC
  MIGRATION_NAME_DESC
  LOGS_ASC
  LOGS_DESC
  ROLLED_BACK_AT_ASC
  ROLLED_BACK_AT_DESC
  STARTED_AT_ASC
  STARTED_AT_DESC
  APPLIED_STEPS_COUNT_ASC
  APPLIED_STEPS_COUNT_DESC
}

"""
A condition to be used against \`_PrismaMigration\` object types. All fields are
tested for equality and combined with a logical ‘and.’
"""
input _PrismaMigrationCondition {
  """Checks for equality with the object’s \`rowId\` field."""
  rowId: String

  """Checks for equality with the object’s \`checksum\` field."""
  checksum: String

  """Checks for equality with the object’s \`finishedAt\` field."""
  finishedAt: Datetime

  """Checks for equality with the object’s \`migrationName\` field."""
  migrationName: String

  """Checks for equality with the object’s \`logs\` field."""
  logs: String

  """Checks for equality with the object’s \`rolledBackAt\` field."""
  rolledBackAt: Datetime

  """Checks for equality with the object’s \`startedAt\` field."""
  startedAt: Datetime

  """Checks for equality with the object’s \`appliedStepsCount\` field."""
  appliedStepsCount: Int
}

"""
A filter to be used against \`_PrismaMigration\` object types. All fields are combined with a logical ‘and.’
"""
input _PrismaMigrationFilter {
  """Filter by the object’s \`rowId\` field."""
  rowId: StringFilter

  """Filter by the object’s \`checksum\` field."""
  checksum: StringFilter

  """Filter by the object’s \`finishedAt\` field."""
  finishedAt: DatetimeFilter

  """Filter by the object’s \`migrationName\` field."""
  migrationName: StringFilter

  """Filter by the object’s \`logs\` field."""
  logs: StringFilter

  """Filter by the object’s \`rolledBackAt\` field."""
  rolledBackAt: DatetimeFilter

  """Filter by the object’s \`startedAt\` field."""
  startedAt: DatetimeFilter

  """Filter by the object’s \`appliedStepsCount\` field."""
  appliedStepsCount: IntFilter

  """Checks for all expressions in this list."""
  and: [_PrismaMigrationFilter!]

  """Checks for any expressions in this list."""
  or: [_PrismaMigrationFilter!]

  """Negates the expression."""
  not: _PrismaMigrationFilter
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
The root mutation type which contains root level fields which mutate data.
"""
type Mutation {
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

  """Creates a single \`Upvote\`."""
  createUpvote(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateUpvoteInput!
  ): CreateUpvotePayload

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

  """Creates a single \`_PrismaMigration\`."""
  createPrismaMigration(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreatePrismaMigrationInput!
  ): CreatePrismaMigrationPayload

  """Updates a single \`User\` using its globally unique id and a patch."""
  updateUser(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateUserInput!
  ): UpdateUserPayload

  """Updates a single \`User\` using a unique key and a patch."""
  updateUserByRowId(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateUserByRowIdInput!
  ): UpdateUserPayload

  """
  Updates a single \`Organization\` using its globally unique id and a patch.
  """
  updateOrganization(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateOrganizationInput!
  ): UpdateOrganizationPayload

  """Updates a single \`Organization\` using a unique key and a patch."""
  updateOrganizationByRowId(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateOrganizationByRowIdInput!
  ): UpdateOrganizationPayload

  """Updates a single \`Upvote\` using its globally unique id and a patch."""
  updateUpvote(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateUpvoteInput!
  ): UpdateUpvotePayload

  """Updates a single \`Upvote\` using a unique key and a patch."""
  updateUpvoteByRowId(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateUpvoteByRowIdInput!
  ): UpdateUpvotePayload

  """Updates a single \`Post\` using its globally unique id and a patch."""
  updatePost(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdatePostInput!
  ): UpdatePostPayload

  """Updates a single \`Post\` using a unique key and a patch."""
  updatePostByRowId(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdatePostByRowIdInput!
  ): UpdatePostPayload

  """Updates a single \`Project\` using its globally unique id and a patch."""
  updateProject(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateProjectInput!
  ): UpdateProjectPayload

  """Updates a single \`Project\` using a unique key and a patch."""
  updateProjectByRowId(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateProjectByRowIdInput!
  ): UpdateProjectPayload

  """
  Updates a single \`_PrismaMigration\` using its globally unique id and a patch.
  """
  updatePrismaMigration(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdatePrismaMigrationInput!
  ): UpdatePrismaMigrationPayload

  """Updates a single \`_PrismaMigration\` using a unique key and a patch."""
  updatePrismaMigrationByRowId(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdatePrismaMigrationByRowIdInput!
  ): UpdatePrismaMigrationPayload

  """Deletes a single \`User\` using its globally unique id."""
  deleteUser(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteUserInput!
  ): DeleteUserPayload

  """Deletes a single \`User\` using a unique key."""
  deleteUserByRowId(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteUserByRowIdInput!
  ): DeleteUserPayload

  """Deletes a single \`Organization\` using its globally unique id."""
  deleteOrganization(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteOrganizationInput!
  ): DeleteOrganizationPayload

  """Deletes a single \`Organization\` using a unique key."""
  deleteOrganizationByRowId(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteOrganizationByRowIdInput!
  ): DeleteOrganizationPayload

  """Deletes a single \`Upvote\` using its globally unique id."""
  deleteUpvote(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteUpvoteInput!
  ): DeleteUpvotePayload

  """Deletes a single \`Upvote\` using a unique key."""
  deleteUpvoteByRowId(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteUpvoteByRowIdInput!
  ): DeleteUpvotePayload

  """Deletes a single \`Post\` using its globally unique id."""
  deletePost(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeletePostInput!
  ): DeletePostPayload

  """Deletes a single \`Post\` using a unique key."""
  deletePostByRowId(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeletePostByRowIdInput!
  ): DeletePostPayload

  """Deletes a single \`Project\` using its globally unique id."""
  deleteProject(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteProjectInput!
  ): DeleteProjectPayload

  """Deletes a single \`Project\` using a unique key."""
  deleteProjectByRowId(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteProjectByRowIdInput!
  ): DeleteProjectPayload

  """Deletes a single \`_PrismaMigration\` using its globally unique id."""
  deletePrismaMigration(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeletePrismaMigrationInput!
  ): DeletePrismaMigrationPayload

  """Deletes a single \`_PrismaMigration\` using a unique key."""
  deletePrismaMigrationByRowId(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeletePrismaMigrationByRowIdInput!
  ): DeletePrismaMigrationPayload
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
  rowId: String!
  walletAddress: String!
  createdAt: Datetime
  updatedAt: Datetime!
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
  rowId: String!
  name: String!
  slug: String!
  createdAt: Datetime
  updatedAt: Datetime!
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
  rowId: String!
  postId: String!
  userId: String!
  createdAt: Datetime
  updatedAt: Datetime!
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
  rowId: String!
  title: String!
  description: String!
  projectId: String!
  authorId: String!
  createdAt: Datetime
  updatedAt: Datetime!
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
  rowId: String!
  name: String!
  description: String
  organizationId: String!
  slug: String!
  image: String
  createdAt: Datetime
  updatedAt: Datetime!
}

"""The output of our create \`_PrismaMigration\` mutation."""
type CreatePrismaMigrationPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`_PrismaMigration\` that was created by this mutation."""
  _prismaMigration: _PrismaMigration

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`_PrismaMigration\`. May be used by Relay 1."""
  _prismaMigrationEdge(
    """The method to use when ordering \`_PrismaMigration\`."""
    orderBy: [_PrismaMigrationOrderBy!]! = [PRIMARY_KEY_ASC]
  ): _PrismaMigrationEdge
}

"""All input for the create \`_PrismaMigration\` mutation."""
input CreatePrismaMigrationInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The \`_PrismaMigration\` to be created by this mutation."""
  _prismaMigration: _PrismaMigrationInput!
}

"""An input for mutations affecting \`_PrismaMigration\`"""
input _PrismaMigrationInput {
  rowId: String!
  checksum: String!
  finishedAt: Datetime
  migrationName: String!
  logs: String
  rolledBackAt: Datetime
  startedAt: Datetime
  appliedStepsCount: Int
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

"""All input for the \`updateUser\` mutation."""
input UpdateUserInput {
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
  userPatch: UserPatch!
}

"""Represents an update to a \`User\`. Fields that are set will be updated."""
input UserPatch {
  rowId: String
  walletAddress: String
  createdAt: Datetime
  updatedAt: Datetime
}

"""All input for the \`updateUserByRowId\` mutation."""
input UpdateUserByRowIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  rowId: String!

  """
  An object where the defined keys will be set on the \`User\` being updated.
  """
  userPatch: UserPatch!
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

"""All input for the \`updateOrganization\` mutation."""
input UpdateOrganizationInput {
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
  organizationPatch: OrganizationPatch!
}

"""
Represents an update to a \`Organization\`. Fields that are set will be updated.
"""
input OrganizationPatch {
  rowId: String
  name: String
  slug: String
  createdAt: Datetime
  updatedAt: Datetime
}

"""All input for the \`updateOrganizationByRowId\` mutation."""
input UpdateOrganizationByRowIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  rowId: String!

  """
  An object where the defined keys will be set on the \`Organization\` being updated.
  """
  organizationPatch: OrganizationPatch!
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

"""All input for the \`updateUpvote\` mutation."""
input UpdateUpvoteInput {
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
  upvotePatch: UpvotePatch!
}

"""
Represents an update to a \`Upvote\`. Fields that are set will be updated.
"""
input UpvotePatch {
  rowId: String
  postId: String
  userId: String
  createdAt: Datetime
  updatedAt: Datetime
}

"""All input for the \`updateUpvoteByRowId\` mutation."""
input UpdateUpvoteByRowIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  rowId: String!

  """
  An object where the defined keys will be set on the \`Upvote\` being updated.
  """
  upvotePatch: UpvotePatch!
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

"""All input for the \`updatePost\` mutation."""
input UpdatePostInput {
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
  postPatch: PostPatch!
}

"""Represents an update to a \`Post\`. Fields that are set will be updated."""
input PostPatch {
  rowId: String
  title: String
  description: String
  projectId: String
  authorId: String
  createdAt: Datetime
  updatedAt: Datetime
}

"""All input for the \`updatePostByRowId\` mutation."""
input UpdatePostByRowIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  rowId: String!

  """
  An object where the defined keys will be set on the \`Post\` being updated.
  """
  postPatch: PostPatch!
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

"""All input for the \`updateProject\` mutation."""
input UpdateProjectInput {
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
  projectPatch: ProjectPatch!
}

"""
Represents an update to a \`Project\`. Fields that are set will be updated.
"""
input ProjectPatch {
  rowId: String
  name: String
  description: String
  organizationId: String
  slug: String
  image: String
  createdAt: Datetime
  updatedAt: Datetime
}

"""All input for the \`updateProjectByRowId\` mutation."""
input UpdateProjectByRowIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  rowId: String!

  """
  An object where the defined keys will be set on the \`Project\` being updated.
  """
  projectPatch: ProjectPatch!
}

"""The output of our update \`_PrismaMigration\` mutation."""
type UpdatePrismaMigrationPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`_PrismaMigration\` that was updated by this mutation."""
  _prismaMigration: _PrismaMigration

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`_PrismaMigration\`. May be used by Relay 1."""
  _prismaMigrationEdge(
    """The method to use when ordering \`_PrismaMigration\`."""
    orderBy: [_PrismaMigrationOrderBy!]! = [PRIMARY_KEY_ASC]
  ): _PrismaMigrationEdge
}

"""All input for the \`updatePrismaMigration\` mutation."""
input UpdatePrismaMigrationInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`_PrismaMigration\` to be updated.
  """
  id: ID!

  """
  An object where the defined keys will be set on the \`_PrismaMigration\` being updated.
  """
  _prismaMigrationPatch: _PrismaMigrationPatch!
}

"""
Represents an update to a \`_PrismaMigration\`. Fields that are set will be updated.
"""
input _PrismaMigrationPatch {
  rowId: String
  checksum: String
  finishedAt: Datetime
  migrationName: String
  logs: String
  rolledBackAt: Datetime
  startedAt: Datetime
  appliedStepsCount: Int
}

"""All input for the \`updatePrismaMigrationByRowId\` mutation."""
input UpdatePrismaMigrationByRowIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  rowId: String!

  """
  An object where the defined keys will be set on the \`_PrismaMigration\` being updated.
  """
  _prismaMigrationPatch: _PrismaMigrationPatch!
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

"""All input for the \`deleteUser\` mutation."""
input DeleteUserInput {
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

"""All input for the \`deleteUserByRowId\` mutation."""
input DeleteUserByRowIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  rowId: String!
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

"""All input for the \`deleteOrganization\` mutation."""
input DeleteOrganizationInput {
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

"""All input for the \`deleteOrganizationByRowId\` mutation."""
input DeleteOrganizationByRowIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  rowId: String!
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

"""All input for the \`deleteUpvote\` mutation."""
input DeleteUpvoteInput {
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

"""All input for the \`deleteUpvoteByRowId\` mutation."""
input DeleteUpvoteByRowIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  rowId: String!
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

"""All input for the \`deletePost\` mutation."""
input DeletePostInput {
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

"""All input for the \`deletePostByRowId\` mutation."""
input DeletePostByRowIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  rowId: String!
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

"""All input for the \`deleteProject\` mutation."""
input DeleteProjectInput {
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

"""All input for the \`deleteProjectByRowId\` mutation."""
input DeleteProjectByRowIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  rowId: String!
}

"""The output of our delete \`_PrismaMigration\` mutation."""
type DeletePrismaMigrationPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`_PrismaMigration\` that was deleted by this mutation."""
  _prismaMigration: _PrismaMigration
  deletedPrismaMigrationId: ID

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`_PrismaMigration\`. May be used by Relay 1."""
  _prismaMigrationEdge(
    """The method to use when ordering \`_PrismaMigration\`."""
    orderBy: [_PrismaMigrationOrderBy!]! = [PRIMARY_KEY_ASC]
  ): _PrismaMigrationEdge
}

"""All input for the \`deletePrismaMigration\` mutation."""
input DeletePrismaMigrationInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`_PrismaMigration\` to be deleted.
  """
  id: ID!
}

"""All input for the \`deletePrismaMigrationByRowId\` mutation."""
input DeletePrismaMigrationByRowIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  rowId: String!
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
    userByRowId: {
      plan(_$root, args) {
        return pgResource_UserPgResource.get({
          id: args.get("rowId")
        });
      },
      args: {
        rowId: undefined
      }
    },
    organizationByRowId: {
      plan(_$root, args) {
        return pgResource_OrganizationPgResource.get({
          id: args.get("rowId")
        });
      },
      args: {
        rowId: undefined
      }
    },
    upvoteByRowId: {
      plan(_$root, args) {
        return pgResource_UpvotePgResource.get({
          id: args.get("rowId")
        });
      },
      args: {
        rowId: undefined
      }
    },
    postByRowId: {
      plan(_$root, args) {
        return pgResource_PostPgResource.get({
          id: args.get("rowId")
        });
      },
      args: {
        rowId: undefined
      }
    },
    projectByRowId: {
      plan(_$root, args) {
        return pgResource_ProjectPgResource.get({
          id: args.get("rowId")
        });
      },
      args: {
        rowId: undefined
      }
    },
    _prismaMigrationByRowId: {
      plan(_$root, args) {
        return pgResource__prisma_migrationsPgResource.get({
          id: args.get("rowId")
        });
      },
      args: {
        rowId: undefined
      }
    },
    user: {
      plan(_$parent, args) {
        const $nodeId = args.get("id");
        return fetcher($nodeId);
      },
      args: {
        id: undefined
      }
    },
    organization: {
      plan(_$parent, args) {
        const $nodeId = args.get("id");
        return fetcher2($nodeId);
      },
      args: {
        id: undefined
      }
    },
    upvote: {
      plan(_$parent, args) {
        const $nodeId = args.get("id");
        return fetcher3($nodeId);
      },
      args: {
        id: undefined
      }
    },
    post: {
      plan(_$parent, args) {
        const $nodeId = args.get("id");
        return fetcher4($nodeId);
      },
      args: {
        id: undefined
      }
    },
    project: {
      plan(_$parent, args) {
        const $nodeId = args.get("id");
        return fetcher5($nodeId);
      },
      args: {
        id: undefined
      }
    },
    _prismaMigration: {
      plan(_$parent, args) {
        const $nodeId = args.get("id");
        return fetcher6($nodeId);
      },
      args: {
        id: undefined
      }
    },
    allUsers: {
      plan() {
        return connection(pgResource_UserPgResource.find());
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
    allOrganizations: {
      plan() {
        return connection(pgResource_OrganizationPgResource.find());
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
    allUpvotes: {
      plan() {
        return connection(pgResource_UpvotePgResource.find());
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
    allPosts: {
      plan() {
        return connection(pgResource_PostPgResource.find());
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
    allProjects: {
      plan() {
        return connection(pgResource_ProjectPgResource.find());
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
    },
    allPrismaMigrations: {
      plan() {
        return connection(pgResource__prisma_migrationsPgResource.find());
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
            applyOrderToPlan($select, $value, info.schema.getType("_PrismaMigrationOrderBy"));
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
            assertAllowed6(fieldArgs, "object");
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
  User: {
    __assertStep: assertPgClassSingleStep,
    id($parent) {
      const specifier = nodeIdHandlerByTypeName.User.plan($parent);
      return lambda(specifier, nodeIdCodecs[nodeIdHandlerByTypeName.User.codec.name].encode);
    },
    rowId($record) {
      return $record.get("id");
    },
    walletAddress($record) {
      return $record.get("walletAddress");
    },
    createdAt($record) {
      return $record.get("createdAt");
    },
    updatedAt($record) {
      return $record.get("updatedAt");
    },
    postsByAuthorId: {
      plan($record) {
        const $records = pgResource_PostPgResource.find({
          authorId: $record.get("id")
        });
        return connection($records);
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
            assertAllowed7(fieldArgs, "object");
            const $where = $connection.getSubplan().wherePlan();
            if (null) $where.extensions.pgFilterAttribute = {
              codec: null
            };
            fieldArgs.apply($where);
          }
        }
      }
    },
    upvotesByUserId: {
      plan($record) {
        const $records = pgResource_UpvotePgResource.find({
          userId: $record.get("id")
        });
        return connection($records);
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
            assertAllowed8(fieldArgs, "object");
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
  Datetime: {
    serialize: DatetimeSerialize,
    parseValue: DatetimeSerialize,
    parseLiteral(ast) {
      if (ast.kind !== Kind.STRING) throw new GraphQLError(`${"Datetime" ?? "This scalar"} can only parse string values (kind='${ast.kind}')`);
      return ast.value;
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
    title($record) {
      return $record.get("title");
    },
    description($record) {
      return $record.get("description");
    },
    projectId($record) {
      return $record.get("projectId");
    },
    authorId($record) {
      return $record.get("authorId");
    },
    createdAt($record) {
      return $record.get("createdAt");
    },
    updatedAt($record) {
      return $record.get("updatedAt");
    },
    userByAuthorId($record) {
      return pgResource_UserPgResource.get({
        id: $record.get("authorId")
      });
    },
    projectByProjectId($record) {
      return pgResource_ProjectPgResource.get({
        id: $record.get("projectId")
      });
    },
    upvotesByPostId: {
      plan($record) {
        const $records = pgResource_UpvotePgResource.find({
          postId: $record.get("id")
        });
        return connection($records);
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
            assertAllowed9(fieldArgs, "object");
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
  Project: {
    __assertStep: assertPgClassSingleStep,
    id($parent) {
      const specifier = nodeIdHandlerByTypeName.Project.plan($parent);
      return lambda(specifier, nodeIdCodecs[nodeIdHandlerByTypeName.Project.codec.name].encode);
    },
    rowId($record) {
      return $record.get("id");
    },
    name($record) {
      return $record.get("name");
    },
    description($record) {
      return $record.get("description");
    },
    organizationId($record) {
      return $record.get("organizationId");
    },
    slug($record) {
      return $record.get("slug");
    },
    image($record) {
      return $record.get("image");
    },
    createdAt($record) {
      return $record.get("createdAt");
    },
    updatedAt($record) {
      return $record.get("updatedAt");
    },
    organizationByOrganizationId($record) {
      return pgResource_OrganizationPgResource.get({
        id: $record.get("organizationId")
      });
    },
    postsByProjectId: {
      plan($record) {
        const $records = pgResource_PostPgResource.find({
          projectId: $record.get("id")
        });
        return connection($records);
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
            assertAllowed10(fieldArgs, "object");
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
  Organization: {
    __assertStep: assertPgClassSingleStep,
    id($parent) {
      const specifier = nodeIdHandlerByTypeName.Organization.plan($parent);
      return lambda(specifier, nodeIdCodecs[nodeIdHandlerByTypeName.Organization.codec.name].encode);
    },
    rowId($record) {
      return $record.get("id");
    },
    name($record) {
      return $record.get("name");
    },
    slug($record) {
      return $record.get("slug");
    },
    createdAt($record) {
      return $record.get("createdAt");
    },
    updatedAt($record) {
      return $record.get("updatedAt");
    },
    projectsByOrganizationId: {
      plan($record) {
        const $records = pgResource_ProjectPgResource.find({
          organizationId: $record.get("id")
        });
        return connection($records);
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
            assertAllowed11(fieldArgs, "object");
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
  ProjectOrderBy: {
    NATURAL: {
      applyPlan() {}
    },
    PRIMARY_KEY_ASC: {
      applyPlan(step) {
        ProjectUniques[0].attributes.forEach(attributeName => {
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
        ProjectUniques[0].attributes.forEach(attributeName => {
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
    ORGANIZATION_ID_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "organizationId",
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
          attribute: "organizationId",
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
    CREATED_AT_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "createdAt",
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
          attribute: "createdAt",
          direction: "DESC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (false) plan.setOrderIsUnique();
      }
    },
    UPDATED_AT_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "updatedAt",
          direction: "ASC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (false) plan.setOrderIsUnique();
      }
    },
    UPDATED_AT_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "updatedAt",
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
    organizationId: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) $condition.where({
          type: "attribute",
          attribute: "organizationId",
          callback(expression) {
            return sql`${expression} is null`;
          }
        });else $condition.where({
          type: "attribute",
          attribute: "organizationId",
          callback(expression) {
            return sql`${expression} = ${$condition.placeholder(val.get(), spec_project.attributes.organizationId.codec)}`;
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
    createdAt: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) $condition.where({
          type: "attribute",
          attribute: "createdAt",
          callback(expression) {
            return sql`${expression} is null`;
          }
        });else $condition.where({
          type: "attribute",
          attribute: "createdAt",
          callback(expression) {
            return sql`${expression} = ${$condition.placeholder(val.get(), spec_project.attributes.createdAt.codec)}`;
          }
        });
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    updatedAt: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) $condition.where({
          type: "attribute",
          attribute: "updatedAt",
          callback(expression) {
            return sql`${expression} is null`;
          }
        });else $condition.where({
          type: "attribute",
          attribute: "updatedAt",
          callback(expression) {
            return sql`${expression} = ${$condition.placeholder(val.get(), spec_project.attributes.updatedAt.codec)}`;
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
        $col.extensions.pgFilterAttribute = colSpec;
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
        $col.extensions.pgFilterAttribute = colSpec2;
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
        $col.extensions.pgFilterAttribute = colSpec3;
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
        $col.extensions.pgFilterAttribute = colSpec4;
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
        $col.extensions.pgFilterAttribute = colSpec5;
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
        $col.extensions.pgFilterAttribute = colSpec6;
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
        $col.extensions.pgFilterAttribute = colSpec7;
        fieldArgs.apply($col);
      }
    },
    updatedAt: {
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
    postsByProjectId: {
      applyPlan($where, fieldArgs) {
        assertAllowed12(fieldArgs, "object");
        const $rel = $where.andPlan();
        $rel.extensions.pgFilterRelation = {
          tableExpression: postIdentifier,
          alias: pgResource_PostPgResource.name,
          localAttributes: registryConfig.pgRelations.project.postsByTheirProjectId.localAttributes,
          remoteAttributes: registryConfig.pgRelations.project.postsByTheirProjectId.remoteAttributes
        };
        fieldArgs.apply($rel);
      }
    },
    postsByProjectIdExist: {
      applyPlan($where, fieldArgs) {
        assertAllowed12(fieldArgs, "scalar");
        const $subQuery = $where.existsPlan({
          tableExpression: postIdentifier,
          alias: pgResource_PostPgResource.name,
          $equals: fieldArgs.get()
        });
        registryConfig.pgRelations.project.postsByTheirProjectId.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = registryConfig.pgRelations.project.postsByTheirProjectId.remoteAttributes[i];
          $subQuery.where(sql`${$where.alias}.${sql.identifier(localAttribute)} = ${$subQuery.alias}.${sql.identifier(remoteAttribute)}`);
        });
      }
    },
    organizationByOrganizationId: {
      applyPlan($where, fieldArgs) {
        assertAllowed13(fieldArgs, "object");
        const $subQuery = $where.existsPlan({
          tableExpression: organizationIdentifier,
          alias: pgResource_OrganizationPgResource.name
        });
        registryConfig.pgRelations.project.organizationByMyOrganizationId.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = registryConfig.pgRelations.project.organizationByMyOrganizationId.remoteAttributes[i];
          $subQuery.where(sql`${$where.alias}.${sql.identifier(localAttribute)} = ${$subQuery.alias}.${sql.identifier(remoteAttribute)}`);
        });
        fieldArgs.apply($subQuery);
      }
    },
    and: {
      applyPlan($where, fieldArgs) {
        assertAllowed14(fieldArgs, "list");
        const $and = $where.andPlan();
        fieldArgs.apply($and);
      }
    },
    or: {
      applyPlan($where, fieldArgs) {
        assertAllowed14(fieldArgs, "list");
        const $or = $where.orPlan();
        fieldArgs.apply(() => $or.andPlan());
      }
    },
    not: {
      applyPlan($where, fieldArgs) {
        assertAllowed14(fieldArgs, "object");
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
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier ? resolveSqlIdentifier(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = resolveInput ? lambda($input, resolveInput) : $input,
          inputCodec = resolveInputCodec2 ? resolveInputCodec2(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = undefined ? undefined($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve12(sqlIdentifier, sqlValue, $input, $where);
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
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier ? resolveSqlIdentifier(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = resolveInput2 ? lambda($input, resolveInput2) : $input,
          inputCodec = resolveInputCodec2 ? resolveInputCodec2(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = undefined ? undefined($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve13(sqlIdentifier, sqlValue, $input, $where);
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
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier2 ? resolveSqlIdentifier2(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = resolveInput3 ? lambda($input, resolveInput3) : $input,
          inputCodec = resolveInputCodec4 ? resolveInputCodec4(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = undefined ? undefined($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve14(sqlIdentifier, sqlValue, $input, $where);
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
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier2 ? resolveSqlIdentifier2(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = resolveInput4 ? lambda($input, resolveInput4) : $input,
          inputCodec = resolveInputCodec4 ? resolveInputCodec4(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = undefined ? undefined($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve15(sqlIdentifier, sqlValue, $input, $where);
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
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier ? resolveSqlIdentifier(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = resolveInput5 ? lambda($input, resolveInput5) : $input,
          inputCodec = resolveInputCodec2 ? resolveInputCodec2(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = undefined ? undefined($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve16(sqlIdentifier, sqlValue, $input, $where);
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
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier ? resolveSqlIdentifier(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = resolveInput6 ? lambda($input, resolveInput6) : $input,
          inputCodec = resolveInputCodec2 ? resolveInputCodec2(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = undefined ? undefined($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve17(sqlIdentifier, sqlValue, $input, $where);
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
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier2 ? resolveSqlIdentifier2(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = resolveInput7 ? lambda($input, resolveInput7) : $input,
          inputCodec = resolveInputCodec4 ? resolveInputCodec4(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = undefined ? undefined($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve18(sqlIdentifier, sqlValue, $input, $where);
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
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier2 ? resolveSqlIdentifier2(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = resolveInput8 ? lambda($input, resolveInput8) : $input,
          inputCodec = resolveInputCodec4 ? resolveInputCodec4(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = undefined ? undefined($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve19(sqlIdentifier, sqlValue, $input, $where);
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
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier ? resolveSqlIdentifier(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = resolveInput9 ? lambda($input, resolveInput9) : $input,
          inputCodec = resolveInputCodec2 ? resolveInputCodec2(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = undefined ? undefined($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve20(sqlIdentifier, sqlValue, $input, $where);
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
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier ? resolveSqlIdentifier(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = resolveInput10 ? lambda($input, resolveInput10) : $input,
          inputCodec = resolveInputCodec2 ? resolveInputCodec2(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = undefined ? undefined($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve21(sqlIdentifier, sqlValue, $input, $where);
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
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier2 ? resolveSqlIdentifier2(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = resolveInput11 ? lambda($input, resolveInput11) : $input,
          inputCodec = resolveInputCodec4 ? resolveInputCodec4(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = undefined ? undefined($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve22(sqlIdentifier, sqlValue, $input, $where);
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
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier2 ? resolveSqlIdentifier2(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = resolveInput12 ? lambda($input, resolveInput12) : $input,
          inputCodec = resolveInputCodec4 ? resolveInputCodec4(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = undefined ? undefined($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve23(sqlIdentifier, sqlValue, $input, $where);
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
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier ? resolveSqlIdentifier(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = undefined ? lambda($input, undefined) : $input,
          inputCodec = resolveInputCodec2 ? resolveInputCodec2(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = undefined ? undefined($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve24(sqlIdentifier, sqlValue, $input, $where);
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
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier ? resolveSqlIdentifier(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = undefined ? lambda($input, undefined) : $input,
          inputCodec = resolveInputCodec2 ? resolveInputCodec2(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = undefined ? undefined($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve25(sqlIdentifier, sqlValue, $input, $where);
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
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier2 ? resolveSqlIdentifier2(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = undefined ? lambda($input, undefined) : $input,
          inputCodec = resolveInputCodec4 ? resolveInputCodec4(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = undefined ? undefined($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve26(sqlIdentifier, sqlValue, $input, $where);
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
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier2 ? resolveSqlIdentifier2(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = undefined ? lambda($input, undefined) : $input,
          inputCodec = resolveInputCodec4 ? resolveInputCodec4(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = undefined ? undefined($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve27(sqlIdentifier, sqlValue, $input, $where);
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
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier3 ? resolveSqlIdentifier3(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = undefined ? lambda($input, undefined) : $input,
          inputCodec = resolveInputCodec5 ? resolveInputCodec5(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = resolveSqlValue2 ? resolveSqlValue2($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve2(sqlIdentifier, sqlValue, $input, $where);
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
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier4 ? resolveSqlIdentifier4(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = undefined ? lambda($input, undefined) : $input,
          inputCodec = resolveInputCodec6 ? resolveInputCodec6(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = resolveSqlValue3 ? resolveSqlValue3($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve3(sqlIdentifier, sqlValue, $input, $where);
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
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier5 ? resolveSqlIdentifier5(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = undefined ? lambda($input, undefined) : $input,
          inputCodec = resolveInputCodec7 ? resolveInputCodec7(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = resolveSqlValue4 ? resolveSqlValue4($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve4(sqlIdentifier, sqlValue, $input, $where);
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
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier6 ? resolveSqlIdentifier6(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = undefined ? lambda($input, undefined) : $input,
          inputCodec = resolveInputCodec8 ? resolveInputCodec8(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = resolveSqlValue5 ? resolveSqlValue5($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve5(sqlIdentifier, sqlValue, $input, $where);
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
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier7 ? resolveSqlIdentifier7(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = undefined ? lambda($input, undefined) : $input,
          inputCodec = resolveInputCodec9 ? resolveInputCodec9(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = resolveSqlValue6 ? resolveSqlValue6($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve6(sqlIdentifier, sqlValue, $input, $where);
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
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier8 ? resolveSqlIdentifier8(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = undefined ? lambda($input, undefined) : $input,
          inputCodec = resolveInputCodec10 ? resolveInputCodec10(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = resolveSqlValue7 ? resolveSqlValue7($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve7(sqlIdentifier, sqlValue, $input, $where);
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
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier9 ? resolveSqlIdentifier9(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = undefined ? lambda($input, undefined) : $input,
          inputCodec = resolveInputCodec11 ? resolveInputCodec11(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = resolveSqlValue8 ? resolveSqlValue8($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve8(sqlIdentifier, sqlValue, $input, $where);
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
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier10 ? resolveSqlIdentifier10(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = undefined ? lambda($input, undefined) : $input,
          inputCodec = resolveInputCodec12 ? resolveInputCodec12(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = resolveSqlValue9 ? resolveSqlValue9($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve9(sqlIdentifier, sqlValue, $input, $where);
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
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier11 ? resolveSqlIdentifier11(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = undefined ? lambda($input, undefined) : $input,
          inputCodec = resolveInputCodec13 ? resolveInputCodec13(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = resolveSqlValue10 ? resolveSqlValue10($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve10(sqlIdentifier, sqlValue, $input, $where);
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
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier12 ? resolveSqlIdentifier12(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = undefined ? lambda($input, undefined) : $input,
          inputCodec = resolveInputCodec14 ? resolveInputCodec14(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = resolveSqlValue11 ? resolveSqlValue11($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
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
          inputCodec = resolveInputCodec15 ? resolveInputCodec15(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = resolveSqlValue12 ? resolveSqlValue12($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve28(sqlIdentifier, sqlValue, $input, $where);
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
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier13 ? resolveSqlIdentifier13(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = undefined ? lambda($input, undefined) : $input,
          inputCodec = resolveInputCodec16 ? resolveInputCodec16(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = undefined ? undefined($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve29(sqlIdentifier, sqlValue, $input, $where);
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
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier13 ? resolveSqlIdentifier13(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = undefined ? lambda($input, undefined) : $input,
          inputCodec = resolveInputCodec16 ? resolveInputCodec16(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = undefined ? undefined($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve30(sqlIdentifier, sqlValue, $input, $where);
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
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier13 ? resolveSqlIdentifier13(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = undefined ? lambda($input, undefined) : $input,
          inputCodec = resolveInputCodec16 ? resolveInputCodec16(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = undefined ? undefined($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve31(sqlIdentifier, sqlValue, $input, $where);
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
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier13 ? resolveSqlIdentifier13(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = undefined ? lambda($input, undefined) : $input,
          inputCodec = resolveInputCodec16 ? resolveInputCodec16(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = undefined ? undefined($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve32(sqlIdentifier, sqlValue, $input, $where);
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
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier13 ? resolveSqlIdentifier13(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = undefined ? lambda($input, undefined) : $input,
          inputCodec = resolveInputCodec17 ? resolveInputCodec17(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = undefined ? undefined($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve33(sqlIdentifier, sqlValue, $input, $where);
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
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier13 ? resolveSqlIdentifier13(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = undefined ? lambda($input, undefined) : $input,
          inputCodec = resolveInputCodec17 ? resolveInputCodec17(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = undefined ? undefined($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve34(sqlIdentifier, sqlValue, $input, $where);
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
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier13 ? resolveSqlIdentifier13(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = undefined ? lambda($input, undefined) : $input,
          inputCodec = resolveInputCodec16 ? resolveInputCodec16(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = undefined ? undefined($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve35(sqlIdentifier, sqlValue, $input, $where);
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
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier13 ? resolveSqlIdentifier13(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = undefined ? lambda($input, undefined) : $input,
          inputCodec = resolveInputCodec16 ? resolveInputCodec16(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = undefined ? undefined($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve36(sqlIdentifier, sqlValue, $input, $where);
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
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier13 ? resolveSqlIdentifier13(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = undefined ? lambda($input, undefined) : $input,
          inputCodec = resolveInputCodec16 ? resolveInputCodec16(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = undefined ? undefined($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve37(sqlIdentifier, sqlValue, $input, $where);
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
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier13 ? resolveSqlIdentifier13(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = undefined ? lambda($input, undefined) : $input,
          inputCodec = resolveInputCodec16 ? resolveInputCodec16(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = undefined ? undefined($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve38(sqlIdentifier, sqlValue, $input, $where);
        $where.where(fragment);
      }
    }
  },
  ProjectToManyPostFilter: {
    every: {
      applyPlan($where, fieldArgs) {
        assertAllowed15(fieldArgs, "object");
        if (!$where.extensions.pgFilterRelation) throw new Error("Invalid use of filter, 'pgFilterRelation' expected");
        const {
            localAttributes,
            remoteAttributes,
            tableExpression,
            alias
          } = $where.extensions.pgFilterRelation,
          $subQuery = $where.notPlan().existsPlan({
            tableExpression,
            alias
          });
        localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = remoteAttributes[i];
          $subQuery.where(sql`${$where.alias}.${sql.identifier(localAttribute)} = ${$subQuery.alias}.${sql.identifier(remoteAttribute)}`);
        });
        fieldArgs.apply($subQuery.notPlan().andPlan());
      }
    },
    some: {
      applyPlan($where, fieldArgs) {
        assertAllowed15(fieldArgs, "object");
        if (!$where.extensions.pgFilterRelation) throw new Error("Invalid use of filter, 'pgFilterRelation' expected");
        const {
            localAttributes,
            remoteAttributes,
            tableExpression,
            alias
          } = $where.extensions.pgFilterRelation,
          $subQuery = $where.existsPlan({
            tableExpression,
            alias
          });
        localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = remoteAttributes[i];
          $subQuery.where(sql`${$where.alias}.${sql.identifier(localAttribute)} = ${$subQuery.alias}.${sql.identifier(remoteAttribute)}`);
        });
        fieldArgs.apply($subQuery);
      }
    },
    none: {
      applyPlan($where, fieldArgs) {
        assertAllowed15(fieldArgs, "object");
        if (!$where.extensions.pgFilterRelation) throw new Error("Invalid use of filter, 'pgFilterRelation' expected");
        const {
            localAttributes,
            remoteAttributes,
            tableExpression,
            alias
          } = $where.extensions.pgFilterRelation,
          $subQuery = $where.notPlan().existsPlan({
            tableExpression,
            alias
          });
        localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = remoteAttributes[i];
          $subQuery.where(sql`${$where.alias}.${sql.identifier(localAttribute)} = ${$subQuery.alias}.${sql.identifier(remoteAttribute)}`);
        });
        fieldArgs.apply($subQuery);
      }
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
        $col.extensions.pgFilterAttribute = colSpec9;
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
    projectId: {
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
    authorId: {
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
    createdAt: {
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
    updatedAt: {
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
    upvotesByPostId: {
      applyPlan($where, fieldArgs) {
        assertAllowed16(fieldArgs, "object");
        const $rel = $where.andPlan();
        $rel.extensions.pgFilterRelation = {
          tableExpression: upvoteIdentifier,
          alias: pgResource_UpvotePgResource.name,
          localAttributes: registryConfig.pgRelations.post.upvotesByTheirPostId.localAttributes,
          remoteAttributes: registryConfig.pgRelations.post.upvotesByTheirPostId.remoteAttributes
        };
        fieldArgs.apply($rel);
      }
    },
    upvotesByPostIdExist: {
      applyPlan($where, fieldArgs) {
        assertAllowed16(fieldArgs, "scalar");
        const $subQuery = $where.existsPlan({
          tableExpression: upvoteIdentifier,
          alias: pgResource_UpvotePgResource.name,
          $equals: fieldArgs.get()
        });
        registryConfig.pgRelations.post.upvotesByTheirPostId.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = registryConfig.pgRelations.post.upvotesByTheirPostId.remoteAttributes[i];
          $subQuery.where(sql`${$where.alias}.${sql.identifier(localAttribute)} = ${$subQuery.alias}.${sql.identifier(remoteAttribute)}`);
        });
      }
    },
    userByAuthorId: {
      applyPlan($where, fieldArgs) {
        assertAllowed17(fieldArgs, "object");
        const $subQuery = $where.existsPlan({
          tableExpression: userIdentifier,
          alias: pgResource_UserPgResource.name
        });
        registryConfig.pgRelations.post.userByMyAuthorId.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = registryConfig.pgRelations.post.userByMyAuthorId.remoteAttributes[i];
          $subQuery.where(sql`${$where.alias}.${sql.identifier(localAttribute)} = ${$subQuery.alias}.${sql.identifier(remoteAttribute)}`);
        });
        fieldArgs.apply($subQuery);
      }
    },
    projectByProjectId: {
      applyPlan($where, fieldArgs) {
        assertAllowed17(fieldArgs, "object");
        const $subQuery = $where.existsPlan({
          tableExpression: projectIdentifier,
          alias: pgResource_ProjectPgResource.name
        });
        registryConfig.pgRelations.post.projectByMyProjectId.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = registryConfig.pgRelations.post.projectByMyProjectId.remoteAttributes[i];
          $subQuery.where(sql`${$where.alias}.${sql.identifier(localAttribute)} = ${$subQuery.alias}.${sql.identifier(remoteAttribute)}`);
        });
        fieldArgs.apply($subQuery);
      }
    },
    and: {
      applyPlan($where, fieldArgs) {
        assertAllowed18(fieldArgs, "list");
        const $and = $where.andPlan();
        fieldArgs.apply($and);
      }
    },
    or: {
      applyPlan($where, fieldArgs) {
        assertAllowed18(fieldArgs, "list");
        const $or = $where.orPlan();
        fieldArgs.apply(() => $or.andPlan());
      }
    },
    not: {
      applyPlan($where, fieldArgs) {
        assertAllowed18(fieldArgs, "object");
        const $and = $where.notPlan().andPlan();
        fieldArgs.apply($and);
      }
    }
  },
  PostToManyUpvoteFilter: {
    every: {
      applyPlan($where, fieldArgs) {
        assertAllowed19(fieldArgs, "object");
        if (!$where.extensions.pgFilterRelation) throw new Error("Invalid use of filter, 'pgFilterRelation' expected");
        const {
            localAttributes,
            remoteAttributes,
            tableExpression,
            alias
          } = $where.extensions.pgFilterRelation,
          $subQuery = $where.notPlan().existsPlan({
            tableExpression,
            alias
          });
        localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = remoteAttributes[i];
          $subQuery.where(sql`${$where.alias}.${sql.identifier(localAttribute)} = ${$subQuery.alias}.${sql.identifier(remoteAttribute)}`);
        });
        fieldArgs.apply($subQuery.notPlan().andPlan());
      }
    },
    some: {
      applyPlan($where, fieldArgs) {
        assertAllowed19(fieldArgs, "object");
        if (!$where.extensions.pgFilterRelation) throw new Error("Invalid use of filter, 'pgFilterRelation' expected");
        const {
            localAttributes,
            remoteAttributes,
            tableExpression,
            alias
          } = $where.extensions.pgFilterRelation,
          $subQuery = $where.existsPlan({
            tableExpression,
            alias
          });
        localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = remoteAttributes[i];
          $subQuery.where(sql`${$where.alias}.${sql.identifier(localAttribute)} = ${$subQuery.alias}.${sql.identifier(remoteAttribute)}`);
        });
        fieldArgs.apply($subQuery);
      }
    },
    none: {
      applyPlan($where, fieldArgs) {
        assertAllowed19(fieldArgs, "object");
        if (!$where.extensions.pgFilterRelation) throw new Error("Invalid use of filter, 'pgFilterRelation' expected");
        const {
            localAttributes,
            remoteAttributes,
            tableExpression,
            alias
          } = $where.extensions.pgFilterRelation,
          $subQuery = $where.notPlan().existsPlan({
            tableExpression,
            alias
          });
        localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = remoteAttributes[i];
          $subQuery.where(sql`${$where.alias}.${sql.identifier(localAttribute)} = ${$subQuery.alias}.${sql.identifier(remoteAttribute)}`);
        });
        fieldArgs.apply($subQuery);
      }
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
        $col.extensions.pgFilterAttribute = colSpec16;
        fieldArgs.apply($col);
      }
    },
    postId: {
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
    userId: {
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
    createdAt: {
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
    updatedAt: {
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
    postByPostId: {
      applyPlan($where, fieldArgs) {
        assertAllowed20(fieldArgs, "object");
        const $subQuery = $where.existsPlan({
          tableExpression: postIdentifier,
          alias: pgResource_PostPgResource.name
        });
        registryConfig.pgRelations.upvote.postByMyPostId.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = registryConfig.pgRelations.upvote.postByMyPostId.remoteAttributes[i];
          $subQuery.where(sql`${$where.alias}.${sql.identifier(localAttribute)} = ${$subQuery.alias}.${sql.identifier(remoteAttribute)}`);
        });
        fieldArgs.apply($subQuery);
      }
    },
    userByUserId: {
      applyPlan($where, fieldArgs) {
        assertAllowed20(fieldArgs, "object");
        const $subQuery = $where.existsPlan({
          tableExpression: userIdentifier,
          alias: pgResource_UserPgResource.name
        });
        registryConfig.pgRelations.upvote.userByMyUserId.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = registryConfig.pgRelations.upvote.userByMyUserId.remoteAttributes[i];
          $subQuery.where(sql`${$where.alias}.${sql.identifier(localAttribute)} = ${$subQuery.alias}.${sql.identifier(remoteAttribute)}`);
        });
        fieldArgs.apply($subQuery);
      }
    },
    and: {
      applyPlan($where, fieldArgs) {
        assertAllowed21(fieldArgs, "list");
        const $and = $where.andPlan();
        fieldArgs.apply($and);
      }
    },
    or: {
      applyPlan($where, fieldArgs) {
        assertAllowed21(fieldArgs, "list");
        const $or = $where.orPlan();
        fieldArgs.apply(() => $or.andPlan());
      }
    },
    not: {
      applyPlan($where, fieldArgs) {
        assertAllowed21(fieldArgs, "object");
        const $and = $where.notPlan().andPlan();
        fieldArgs.apply($and);
      }
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
        $col.extensions.pgFilterAttribute = colSpec21;
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
        $col.extensions.pgFilterAttribute = colSpec22;
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
        $col.extensions.pgFilterAttribute = colSpec23;
        fieldArgs.apply($col);
      }
    },
    updatedAt: {
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
    postsByAuthorId: {
      applyPlan($where, fieldArgs) {
        assertAllowed22(fieldArgs, "object");
        const $rel = $where.andPlan();
        $rel.extensions.pgFilterRelation = {
          tableExpression: postIdentifier,
          alias: pgResource_PostPgResource.name,
          localAttributes: registryConfig.pgRelations.user.postsByTheirAuthorId.localAttributes,
          remoteAttributes: registryConfig.pgRelations.user.postsByTheirAuthorId.remoteAttributes
        };
        fieldArgs.apply($rel);
      }
    },
    postsByAuthorIdExist: {
      applyPlan($where, fieldArgs) {
        assertAllowed22(fieldArgs, "scalar");
        const $subQuery = $where.existsPlan({
          tableExpression: postIdentifier,
          alias: pgResource_PostPgResource.name,
          $equals: fieldArgs.get()
        });
        registryConfig.pgRelations.user.postsByTheirAuthorId.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = registryConfig.pgRelations.user.postsByTheirAuthorId.remoteAttributes[i];
          $subQuery.where(sql`${$where.alias}.${sql.identifier(localAttribute)} = ${$subQuery.alias}.${sql.identifier(remoteAttribute)}`);
        });
      }
    },
    upvotesByUserId: {
      applyPlan($where, fieldArgs) {
        assertAllowed22(fieldArgs, "object");
        const $rel = $where.andPlan();
        $rel.extensions.pgFilterRelation = {
          tableExpression: upvoteIdentifier,
          alias: pgResource_UpvotePgResource.name,
          localAttributes: registryConfig.pgRelations.user.upvotesByTheirUserId.localAttributes,
          remoteAttributes: registryConfig.pgRelations.user.upvotesByTheirUserId.remoteAttributes
        };
        fieldArgs.apply($rel);
      }
    },
    upvotesByUserIdExist: {
      applyPlan($where, fieldArgs) {
        assertAllowed22(fieldArgs, "scalar");
        const $subQuery = $where.existsPlan({
          tableExpression: upvoteIdentifier,
          alias: pgResource_UpvotePgResource.name,
          $equals: fieldArgs.get()
        });
        registryConfig.pgRelations.user.upvotesByTheirUserId.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = registryConfig.pgRelations.user.upvotesByTheirUserId.remoteAttributes[i];
          $subQuery.where(sql`${$where.alias}.${sql.identifier(localAttribute)} = ${$subQuery.alias}.${sql.identifier(remoteAttribute)}`);
        });
      }
    },
    and: {
      applyPlan($where, fieldArgs) {
        assertAllowed23(fieldArgs, "list");
        const $and = $where.andPlan();
        fieldArgs.apply($and);
      }
    },
    or: {
      applyPlan($where, fieldArgs) {
        assertAllowed23(fieldArgs, "list");
        const $or = $where.orPlan();
        fieldArgs.apply(() => $or.andPlan());
      }
    },
    not: {
      applyPlan($where, fieldArgs) {
        assertAllowed23(fieldArgs, "object");
        const $and = $where.notPlan().andPlan();
        fieldArgs.apply($and);
      }
    }
  },
  UserToManyPostFilter: {
    every: {
      applyPlan($where, fieldArgs) {
        assertAllowed24(fieldArgs, "object");
        if (!$where.extensions.pgFilterRelation) throw new Error("Invalid use of filter, 'pgFilterRelation' expected");
        const {
            localAttributes,
            remoteAttributes,
            tableExpression,
            alias
          } = $where.extensions.pgFilterRelation,
          $subQuery = $where.notPlan().existsPlan({
            tableExpression,
            alias
          });
        localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = remoteAttributes[i];
          $subQuery.where(sql`${$where.alias}.${sql.identifier(localAttribute)} = ${$subQuery.alias}.${sql.identifier(remoteAttribute)}`);
        });
        fieldArgs.apply($subQuery.notPlan().andPlan());
      }
    },
    some: {
      applyPlan($where, fieldArgs) {
        assertAllowed24(fieldArgs, "object");
        if (!$where.extensions.pgFilterRelation) throw new Error("Invalid use of filter, 'pgFilterRelation' expected");
        const {
            localAttributes,
            remoteAttributes,
            tableExpression,
            alias
          } = $where.extensions.pgFilterRelation,
          $subQuery = $where.existsPlan({
            tableExpression,
            alias
          });
        localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = remoteAttributes[i];
          $subQuery.where(sql`${$where.alias}.${sql.identifier(localAttribute)} = ${$subQuery.alias}.${sql.identifier(remoteAttribute)}`);
        });
        fieldArgs.apply($subQuery);
      }
    },
    none: {
      applyPlan($where, fieldArgs) {
        assertAllowed24(fieldArgs, "object");
        if (!$where.extensions.pgFilterRelation) throw new Error("Invalid use of filter, 'pgFilterRelation' expected");
        const {
            localAttributes,
            remoteAttributes,
            tableExpression,
            alias
          } = $where.extensions.pgFilterRelation,
          $subQuery = $where.notPlan().existsPlan({
            tableExpression,
            alias
          });
        localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = remoteAttributes[i];
          $subQuery.where(sql`${$where.alias}.${sql.identifier(localAttribute)} = ${$subQuery.alias}.${sql.identifier(remoteAttribute)}`);
        });
        fieldArgs.apply($subQuery);
      }
    }
  },
  UserToManyUpvoteFilter: {
    every: {
      applyPlan($where, fieldArgs) {
        assertAllowed25(fieldArgs, "object");
        if (!$where.extensions.pgFilterRelation) throw new Error("Invalid use of filter, 'pgFilterRelation' expected");
        const {
            localAttributes,
            remoteAttributes,
            tableExpression,
            alias
          } = $where.extensions.pgFilterRelation,
          $subQuery = $where.notPlan().existsPlan({
            tableExpression,
            alias
          });
        localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = remoteAttributes[i];
          $subQuery.where(sql`${$where.alias}.${sql.identifier(localAttribute)} = ${$subQuery.alias}.${sql.identifier(remoteAttribute)}`);
        });
        fieldArgs.apply($subQuery.notPlan().andPlan());
      }
    },
    some: {
      applyPlan($where, fieldArgs) {
        assertAllowed25(fieldArgs, "object");
        if (!$where.extensions.pgFilterRelation) throw new Error("Invalid use of filter, 'pgFilterRelation' expected");
        const {
            localAttributes,
            remoteAttributes,
            tableExpression,
            alias
          } = $where.extensions.pgFilterRelation,
          $subQuery = $where.existsPlan({
            tableExpression,
            alias
          });
        localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = remoteAttributes[i];
          $subQuery.where(sql`${$where.alias}.${sql.identifier(localAttribute)} = ${$subQuery.alias}.${sql.identifier(remoteAttribute)}`);
        });
        fieldArgs.apply($subQuery);
      }
    },
    none: {
      applyPlan($where, fieldArgs) {
        assertAllowed25(fieldArgs, "object");
        if (!$where.extensions.pgFilterRelation) throw new Error("Invalid use of filter, 'pgFilterRelation' expected");
        const {
            localAttributes,
            remoteAttributes,
            tableExpression,
            alias
          } = $where.extensions.pgFilterRelation,
          $subQuery = $where.notPlan().existsPlan({
            tableExpression,
            alias
          });
        localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = remoteAttributes[i];
          $subQuery.where(sql`${$where.alias}.${sql.identifier(localAttribute)} = ${$subQuery.alias}.${sql.identifier(remoteAttribute)}`);
        });
        fieldArgs.apply($subQuery);
      }
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
        $col.extensions.pgFilterAttribute = colSpec25;
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
        $col.extensions.pgFilterAttribute = colSpec26;
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
        $col.extensions.pgFilterAttribute = colSpec27;
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
        $col.extensions.pgFilterAttribute = colSpec28;
        fieldArgs.apply($col);
      }
    },
    updatedAt: {
      applyPlan($where, fieldArgs) {
        const $raw = fieldArgs.getRaw();
        if ($raw.evalIs(void 0)) return;
        if (!false && "evalIsEmpty" in $raw && $raw.evalIsEmpty()) throw Object.assign(new Error("Empty objects are forbidden in filter argument input."), {});
        if (!false && $raw.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $col = new PgConditionStep($where);
        $col.extensions.pgFilterAttribute = colSpec29;
        fieldArgs.apply($col);
      }
    },
    projectsByOrganizationId: {
      applyPlan($where, fieldArgs) {
        assertAllowed26(fieldArgs, "object");
        const $rel = $where.andPlan();
        $rel.extensions.pgFilterRelation = {
          tableExpression: projectIdentifier,
          alias: pgResource_ProjectPgResource.name,
          localAttributes: registryConfig.pgRelations.organization.projectsByTheirOrganizationId.localAttributes,
          remoteAttributes: registryConfig.pgRelations.organization.projectsByTheirOrganizationId.remoteAttributes
        };
        fieldArgs.apply($rel);
      }
    },
    projectsByOrganizationIdExist: {
      applyPlan($where, fieldArgs) {
        assertAllowed26(fieldArgs, "scalar");
        const $subQuery = $where.existsPlan({
          tableExpression: projectIdentifier,
          alias: pgResource_ProjectPgResource.name,
          $equals: fieldArgs.get()
        });
        registryConfig.pgRelations.organization.projectsByTheirOrganizationId.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = registryConfig.pgRelations.organization.projectsByTheirOrganizationId.remoteAttributes[i];
          $subQuery.where(sql`${$where.alias}.${sql.identifier(localAttribute)} = ${$subQuery.alias}.${sql.identifier(remoteAttribute)}`);
        });
      }
    },
    and: {
      applyPlan($where, fieldArgs) {
        assertAllowed27(fieldArgs, "list");
        const $and = $where.andPlan();
        fieldArgs.apply($and);
      }
    },
    or: {
      applyPlan($where, fieldArgs) {
        assertAllowed27(fieldArgs, "list");
        const $or = $where.orPlan();
        fieldArgs.apply(() => $or.andPlan());
      }
    },
    not: {
      applyPlan($where, fieldArgs) {
        assertAllowed27(fieldArgs, "object");
        const $and = $where.notPlan().andPlan();
        fieldArgs.apply($and);
      }
    }
  },
  OrganizationToManyProjectFilter: {
    every: {
      applyPlan($where, fieldArgs) {
        assertAllowed28(fieldArgs, "object");
        if (!$where.extensions.pgFilterRelation) throw new Error("Invalid use of filter, 'pgFilterRelation' expected");
        const {
            localAttributes,
            remoteAttributes,
            tableExpression,
            alias
          } = $where.extensions.pgFilterRelation,
          $subQuery = $where.notPlan().existsPlan({
            tableExpression,
            alias
          });
        localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = remoteAttributes[i];
          $subQuery.where(sql`${$where.alias}.${sql.identifier(localAttribute)} = ${$subQuery.alias}.${sql.identifier(remoteAttribute)}`);
        });
        fieldArgs.apply($subQuery.notPlan().andPlan());
      }
    },
    some: {
      applyPlan($where, fieldArgs) {
        assertAllowed28(fieldArgs, "object");
        if (!$where.extensions.pgFilterRelation) throw new Error("Invalid use of filter, 'pgFilterRelation' expected");
        const {
            localAttributes,
            remoteAttributes,
            tableExpression,
            alias
          } = $where.extensions.pgFilterRelation,
          $subQuery = $where.existsPlan({
            tableExpression,
            alias
          });
        localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = remoteAttributes[i];
          $subQuery.where(sql`${$where.alias}.${sql.identifier(localAttribute)} = ${$subQuery.alias}.${sql.identifier(remoteAttribute)}`);
        });
        fieldArgs.apply($subQuery);
      }
    },
    none: {
      applyPlan($where, fieldArgs) {
        assertAllowed28(fieldArgs, "object");
        if (!$where.extensions.pgFilterRelation) throw new Error("Invalid use of filter, 'pgFilterRelation' expected");
        const {
            localAttributes,
            remoteAttributes,
            tableExpression,
            alias
          } = $where.extensions.pgFilterRelation,
          $subQuery = $where.notPlan().existsPlan({
            tableExpression,
            alias
          });
        localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = remoteAttributes[i];
          $subQuery.where(sql`${$where.alias}.${sql.identifier(localAttribute)} = ${$subQuery.alias}.${sql.identifier(remoteAttribute)}`);
        });
        fieldArgs.apply($subQuery);
      }
    }
  },
  PostOrderBy: {
    NATURAL: {
      applyPlan() {}
    },
    PRIMARY_KEY_ASC: {
      applyPlan(step) {
        PostUniques[0].attributes.forEach(attributeName => {
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
        PostUniques[0].attributes.forEach(attributeName => {
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
    PROJECT_ID_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "projectId",
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
          attribute: "projectId",
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
          attribute: "authorId",
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
          attribute: "authorId",
          direction: "DESC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (false) plan.setOrderIsUnique();
      }
    },
    CREATED_AT_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "createdAt",
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
          attribute: "createdAt",
          direction: "DESC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (false) plan.setOrderIsUnique();
      }
    },
    UPDATED_AT_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "updatedAt",
          direction: "ASC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (false) plan.setOrderIsUnique();
      }
    },
    UPDATED_AT_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "updatedAt",
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
            return sql`${expression} = ${$condition.placeholder(val.get(), spec_post.attributes.description.codec)}`;
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
          attribute: "projectId",
          callback(expression) {
            return sql`${expression} is null`;
          }
        });else $condition.where({
          type: "attribute",
          attribute: "projectId",
          callback(expression) {
            return sql`${expression} = ${$condition.placeholder(val.get(), spec_post.attributes.projectId.codec)}`;
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
          attribute: "authorId",
          callback(expression) {
            return sql`${expression} is null`;
          }
        });else $condition.where({
          type: "attribute",
          attribute: "authorId",
          callback(expression) {
            return sql`${expression} = ${$condition.placeholder(val.get(), spec_post.attributes.authorId.codec)}`;
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
          attribute: "createdAt",
          callback(expression) {
            return sql`${expression} is null`;
          }
        });else $condition.where({
          type: "attribute",
          attribute: "createdAt",
          callback(expression) {
            return sql`${expression} = ${$condition.placeholder(val.get(), spec_post.attributes.createdAt.codec)}`;
          }
        });
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    updatedAt: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) $condition.where({
          type: "attribute",
          attribute: "updatedAt",
          callback(expression) {
            return sql`${expression} is null`;
          }
        });else $condition.where({
          type: "attribute",
          attribute: "updatedAt",
          callback(expression) {
            return sql`${expression} = ${$condition.placeholder(val.get(), spec_post.attributes.updatedAt.codec)}`;
          }
        });
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
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
    postId($record) {
      return $record.get("postId");
    },
    userId($record) {
      return $record.get("userId");
    },
    createdAt($record) {
      return $record.get("createdAt");
    },
    updatedAt($record) {
      return $record.get("updatedAt");
    },
    postByPostId($record) {
      return pgResource_PostPgResource.get({
        id: $record.get("postId")
      });
    },
    userByUserId($record) {
      return pgResource_UserPgResource.get({
        id: $record.get("userId")
      });
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
  UpvoteOrderBy: {
    NATURAL: {
      applyPlan() {}
    },
    PRIMARY_KEY_ASC: {
      applyPlan(step) {
        UpvoteUniques[0].attributes.forEach(attributeName => {
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
        UpvoteUniques[0].attributes.forEach(attributeName => {
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
    POST_ID_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "postId",
          direction: "ASC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (false) plan.setOrderIsUnique();
      }
    },
    POST_ID_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "postId",
          direction: "DESC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (false) plan.setOrderIsUnique();
      }
    },
    USER_ID_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "userId",
          direction: "ASC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (false) plan.setOrderIsUnique();
      }
    },
    USER_ID_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "userId",
          direction: "DESC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (false) plan.setOrderIsUnique();
      }
    },
    CREATED_AT_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "createdAt",
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
          attribute: "createdAt",
          direction: "DESC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (false) plan.setOrderIsUnique();
      }
    },
    UPDATED_AT_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "updatedAt",
          direction: "ASC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (false) plan.setOrderIsUnique();
      }
    },
    UPDATED_AT_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "updatedAt",
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
    postId: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) $condition.where({
          type: "attribute",
          attribute: "postId",
          callback(expression) {
            return sql`${expression} is null`;
          }
        });else $condition.where({
          type: "attribute",
          attribute: "postId",
          callback(expression) {
            return sql`${expression} = ${$condition.placeholder(val.get(), spec_upvote.attributes.postId.codec)}`;
          }
        });
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    userId: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) $condition.where({
          type: "attribute",
          attribute: "userId",
          callback(expression) {
            return sql`${expression} is null`;
          }
        });else $condition.where({
          type: "attribute",
          attribute: "userId",
          callback(expression) {
            return sql`${expression} = ${$condition.placeholder(val.get(), spec_upvote.attributes.userId.codec)}`;
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
          attribute: "createdAt",
          callback(expression) {
            return sql`${expression} is null`;
          }
        });else $condition.where({
          type: "attribute",
          attribute: "createdAt",
          callback(expression) {
            return sql`${expression} = ${$condition.placeholder(val.get(), spec_upvote.attributes.createdAt.codec)}`;
          }
        });
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    updatedAt: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) $condition.where({
          type: "attribute",
          attribute: "updatedAt",
          callback(expression) {
            return sql`${expression} is null`;
          }
        });else $condition.where({
          type: "attribute",
          attribute: "updatedAt",
          callback(expression) {
            return sql`${expression} = ${$condition.placeholder(val.get(), spec_upvote.attributes.updatedAt.codec)}`;
          }
        });
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
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
  _PrismaMigration: {
    __assertStep: assertPgClassSingleStep,
    id($parent) {
      const specifier = nodeIdHandlerByTypeName._PrismaMigration.plan($parent);
      return lambda(specifier, nodeIdCodecs[nodeIdHandlerByTypeName._PrismaMigration.codec.name].encode);
    },
    rowId($record) {
      return $record.get("id");
    },
    checksum($record) {
      return $record.get("checksum");
    },
    finishedAt($record) {
      return $record.get("finished_at");
    },
    migrationName($record) {
      return $record.get("migration_name");
    },
    logs($record) {
      return $record.get("logs");
    },
    rolledBackAt($record) {
      return $record.get("rolled_back_at");
    },
    startedAt($record) {
      return $record.get("started_at");
    },
    appliedStepsCount($record) {
      return $record.get("applied_steps_count");
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
  UserOrderBy: {
    NATURAL: {
      applyPlan() {}
    },
    PRIMARY_KEY_ASC: {
      applyPlan(step) {
        UserUniques[0].attributes.forEach(attributeName => {
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
        UserUniques[0].attributes.forEach(attributeName => {
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
    WALLET_ADDRESS_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "walletAddress",
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
          attribute: "walletAddress",
          direction: "DESC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (false) plan.setOrderIsUnique();
      }
    },
    CREATED_AT_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "createdAt",
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
          attribute: "createdAt",
          direction: "DESC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (false) plan.setOrderIsUnique();
      }
    },
    UPDATED_AT_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "updatedAt",
          direction: "ASC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (false) plan.setOrderIsUnique();
      }
    },
    UPDATED_AT_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "updatedAt",
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
    walletAddress: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) $condition.where({
          type: "attribute",
          attribute: "walletAddress",
          callback(expression) {
            return sql`${expression} is null`;
          }
        });else $condition.where({
          type: "attribute",
          attribute: "walletAddress",
          callback(expression) {
            return sql`${expression} = ${$condition.placeholder(val.get(), spec_user.attributes.walletAddress.codec)}`;
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
          attribute: "createdAt",
          callback(expression) {
            return sql`${expression} is null`;
          }
        });else $condition.where({
          type: "attribute",
          attribute: "createdAt",
          callback(expression) {
            return sql`${expression} = ${$condition.placeholder(val.get(), spec_user.attributes.createdAt.codec)}`;
          }
        });
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    updatedAt: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) $condition.where({
          type: "attribute",
          attribute: "updatedAt",
          callback(expression) {
            return sql`${expression} is null`;
          }
        });else $condition.where({
          type: "attribute",
          attribute: "updatedAt",
          callback(expression) {
            return sql`${expression} = ${$condition.placeholder(val.get(), spec_user.attributes.updatedAt.codec)}`;
          }
        });
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
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
  OrganizationOrderBy: {
    NATURAL: {
      applyPlan() {}
    },
    PRIMARY_KEY_ASC: {
      applyPlan(step) {
        OrganizationUniques[0].attributes.forEach(attributeName => {
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
        OrganizationUniques[0].attributes.forEach(attributeName => {
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
    CREATED_AT_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "createdAt",
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
          attribute: "createdAt",
          direction: "DESC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (false) plan.setOrderIsUnique();
      }
    },
    UPDATED_AT_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "updatedAt",
          direction: "ASC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (false) plan.setOrderIsUnique();
      }
    },
    UPDATED_AT_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "updatedAt",
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
    createdAt: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) $condition.where({
          type: "attribute",
          attribute: "createdAt",
          callback(expression) {
            return sql`${expression} is null`;
          }
        });else $condition.where({
          type: "attribute",
          attribute: "createdAt",
          callback(expression) {
            return sql`${expression} = ${$condition.placeholder(val.get(), spec_organization.attributes.createdAt.codec)}`;
          }
        });
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    updatedAt: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) $condition.where({
          type: "attribute",
          attribute: "updatedAt",
          callback(expression) {
            return sql`${expression} is null`;
          }
        });else $condition.where({
          type: "attribute",
          attribute: "updatedAt",
          callback(expression) {
            return sql`${expression} = ${$condition.placeholder(val.get(), spec_organization.attributes.updatedAt.codec)}`;
          }
        });
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  _PrismaMigrationConnection: {
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
    }
  },
  _PrismaMigrationEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  _PrismaMigrationOrderBy: {
    NATURAL: {
      applyPlan() {}
    },
    PRIMARY_KEY_ASC: {
      applyPlan(step) {
        _prisma_migrationsUniques[0].attributes.forEach(attributeName => {
          const attribute = _prismaMigrationsCodec.attributes[attributeName];
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
        _prisma_migrationsUniques[0].attributes.forEach(attributeName => {
          const attribute = _prismaMigrationsCodec.attributes[attributeName];
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
    CHECKSUM_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "checksum",
          direction: "ASC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (false) plan.setOrderIsUnique();
      }
    },
    CHECKSUM_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "checksum",
          direction: "DESC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (false) plan.setOrderIsUnique();
      }
    },
    FINISHED_AT_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "finished_at",
          direction: "ASC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (false) plan.setOrderIsUnique();
      }
    },
    FINISHED_AT_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "finished_at",
          direction: "DESC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (false) plan.setOrderIsUnique();
      }
    },
    MIGRATION_NAME_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "migration_name",
          direction: "ASC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (false) plan.setOrderIsUnique();
      }
    },
    MIGRATION_NAME_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "migration_name",
          direction: "DESC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (false) plan.setOrderIsUnique();
      }
    },
    LOGS_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "logs",
          direction: "ASC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (false) plan.setOrderIsUnique();
      }
    },
    LOGS_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "logs",
          direction: "DESC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (false) plan.setOrderIsUnique();
      }
    },
    ROLLED_BACK_AT_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "rolled_back_at",
          direction: "ASC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (false) plan.setOrderIsUnique();
      }
    },
    ROLLED_BACK_AT_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "rolled_back_at",
          direction: "DESC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (false) plan.setOrderIsUnique();
      }
    },
    STARTED_AT_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "started_at",
          direction: "ASC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (false) plan.setOrderIsUnique();
      }
    },
    STARTED_AT_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "started_at",
          direction: "DESC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (false) plan.setOrderIsUnique();
      }
    },
    APPLIED_STEPS_COUNT_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "applied_steps_count",
          direction: "ASC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (false) plan.setOrderIsUnique();
      }
    },
    APPLIED_STEPS_COUNT_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "applied_steps_count",
          direction: "DESC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (false) plan.setOrderIsUnique();
      }
    }
  },
  _PrismaMigrationCondition: {
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
            return sql`${expression} = ${$condition.placeholder(val.get(), spec__prismaMigrations.attributes.id.codec)}`;
          }
        });
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    checksum: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) $condition.where({
          type: "attribute",
          attribute: "checksum",
          callback(expression) {
            return sql`${expression} is null`;
          }
        });else $condition.where({
          type: "attribute",
          attribute: "checksum",
          callback(expression) {
            return sql`${expression} = ${$condition.placeholder(val.get(), spec__prismaMigrations.attributes.checksum.codec)}`;
          }
        });
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    finishedAt: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) $condition.where({
          type: "attribute",
          attribute: "finished_at",
          callback(expression) {
            return sql`${expression} is null`;
          }
        });else $condition.where({
          type: "attribute",
          attribute: "finished_at",
          callback(expression) {
            return sql`${expression} = ${$condition.placeholder(val.get(), spec__prismaMigrations.attributes.finished_at.codec)}`;
          }
        });
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    migrationName: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) $condition.where({
          type: "attribute",
          attribute: "migration_name",
          callback(expression) {
            return sql`${expression} is null`;
          }
        });else $condition.where({
          type: "attribute",
          attribute: "migration_name",
          callback(expression) {
            return sql`${expression} = ${$condition.placeholder(val.get(), spec__prismaMigrations.attributes.migration_name.codec)}`;
          }
        });
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    logs: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) $condition.where({
          type: "attribute",
          attribute: "logs",
          callback(expression) {
            return sql`${expression} is null`;
          }
        });else $condition.where({
          type: "attribute",
          attribute: "logs",
          callback(expression) {
            return sql`${expression} = ${$condition.placeholder(val.get(), spec__prismaMigrations.attributes.logs.codec)}`;
          }
        });
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    rolledBackAt: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) $condition.where({
          type: "attribute",
          attribute: "rolled_back_at",
          callback(expression) {
            return sql`${expression} is null`;
          }
        });else $condition.where({
          type: "attribute",
          attribute: "rolled_back_at",
          callback(expression) {
            return sql`${expression} = ${$condition.placeholder(val.get(), spec__prismaMigrations.attributes.rolled_back_at.codec)}`;
          }
        });
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    startedAt: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) $condition.where({
          type: "attribute",
          attribute: "started_at",
          callback(expression) {
            return sql`${expression} is null`;
          }
        });else $condition.where({
          type: "attribute",
          attribute: "started_at",
          callback(expression) {
            return sql`${expression} = ${$condition.placeholder(val.get(), spec__prismaMigrations.attributes.started_at.codec)}`;
          }
        });
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    appliedStepsCount: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) $condition.where({
          type: "attribute",
          attribute: "applied_steps_count",
          callback(expression) {
            return sql`${expression} is null`;
          }
        });else $condition.where({
          type: "attribute",
          attribute: "applied_steps_count",
          callback(expression) {
            return sql`${expression} = ${$condition.placeholder(val.get(), spec__prismaMigrations.attributes.applied_steps_count.codec)}`;
          }
        });
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  _PrismaMigrationFilter: {
    rowId: {
      applyPlan($where, fieldArgs) {
        const $raw = fieldArgs.getRaw();
        if ($raw.evalIs(void 0)) return;
        if (!false && "evalIsEmpty" in $raw && $raw.evalIsEmpty()) throw Object.assign(new Error("Empty objects are forbidden in filter argument input."), {});
        if (!false && $raw.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $col = new PgConditionStep($where);
        $col.extensions.pgFilterAttribute = colSpec30;
        fieldArgs.apply($col);
      }
    },
    checksum: {
      applyPlan($where, fieldArgs) {
        const $raw = fieldArgs.getRaw();
        if ($raw.evalIs(void 0)) return;
        if (!false && "evalIsEmpty" in $raw && $raw.evalIsEmpty()) throw Object.assign(new Error("Empty objects are forbidden in filter argument input."), {});
        if (!false && $raw.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $col = new PgConditionStep($where);
        $col.extensions.pgFilterAttribute = colSpec31;
        fieldArgs.apply($col);
      }
    },
    finishedAt: {
      applyPlan($where, fieldArgs) {
        const $raw = fieldArgs.getRaw();
        if ($raw.evalIs(void 0)) return;
        if (!false && "evalIsEmpty" in $raw && $raw.evalIsEmpty()) throw Object.assign(new Error("Empty objects are forbidden in filter argument input."), {});
        if (!false && $raw.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $col = new PgConditionStep($where);
        $col.extensions.pgFilterAttribute = colSpec32;
        fieldArgs.apply($col);
      }
    },
    migrationName: {
      applyPlan($where, fieldArgs) {
        const $raw = fieldArgs.getRaw();
        if ($raw.evalIs(void 0)) return;
        if (!false && "evalIsEmpty" in $raw && $raw.evalIsEmpty()) throw Object.assign(new Error("Empty objects are forbidden in filter argument input."), {});
        if (!false && $raw.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $col = new PgConditionStep($where);
        $col.extensions.pgFilterAttribute = colSpec33;
        fieldArgs.apply($col);
      }
    },
    logs: {
      applyPlan($where, fieldArgs) {
        const $raw = fieldArgs.getRaw();
        if ($raw.evalIs(void 0)) return;
        if (!false && "evalIsEmpty" in $raw && $raw.evalIsEmpty()) throw Object.assign(new Error("Empty objects are forbidden in filter argument input."), {});
        if (!false && $raw.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $col = new PgConditionStep($where);
        $col.extensions.pgFilterAttribute = colSpec34;
        fieldArgs.apply($col);
      }
    },
    rolledBackAt: {
      applyPlan($where, fieldArgs) {
        const $raw = fieldArgs.getRaw();
        if ($raw.evalIs(void 0)) return;
        if (!false && "evalIsEmpty" in $raw && $raw.evalIsEmpty()) throw Object.assign(new Error("Empty objects are forbidden in filter argument input."), {});
        if (!false && $raw.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $col = new PgConditionStep($where);
        $col.extensions.pgFilterAttribute = colSpec35;
        fieldArgs.apply($col);
      }
    },
    startedAt: {
      applyPlan($where, fieldArgs) {
        const $raw = fieldArgs.getRaw();
        if ($raw.evalIs(void 0)) return;
        if (!false && "evalIsEmpty" in $raw && $raw.evalIsEmpty()) throw Object.assign(new Error("Empty objects are forbidden in filter argument input."), {});
        if (!false && $raw.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $col = new PgConditionStep($where);
        $col.extensions.pgFilterAttribute = colSpec36;
        fieldArgs.apply($col);
      }
    },
    appliedStepsCount: {
      applyPlan($where, fieldArgs) {
        const $raw = fieldArgs.getRaw();
        if ($raw.evalIs(void 0)) return;
        if (!false && "evalIsEmpty" in $raw && $raw.evalIsEmpty()) throw Object.assign(new Error("Empty objects are forbidden in filter argument input."), {});
        if (!false && $raw.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $col = new PgConditionStep($where);
        $col.extensions.pgFilterAttribute = colSpec37;
        fieldArgs.apply($col);
      }
    },
    and: {
      applyPlan($where, fieldArgs) {
        assertAllowed29(fieldArgs, "list");
        const $and = $where.andPlan();
        fieldArgs.apply($and);
      }
    },
    or: {
      applyPlan($where, fieldArgs) {
        assertAllowed29(fieldArgs, "list");
        const $or = $where.orPlan();
        fieldArgs.apply(() => $or.andPlan());
      }
    },
    not: {
      applyPlan($where, fieldArgs) {
        assertAllowed29(fieldArgs, "object");
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
          inputCodec = resolveInputCodec18 ? resolveInputCodec18(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = resolveSqlValue13 ? resolveSqlValue13($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve39(sqlIdentifier, sqlValue, $input, $where);
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
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier14 ? resolveSqlIdentifier14(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = undefined ? lambda($input, undefined) : $input,
          inputCodec = resolveInputCodec19 ? resolveInputCodec19(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = undefined ? undefined($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve40(sqlIdentifier, sqlValue, $input, $where);
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
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier14 ? resolveSqlIdentifier14(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = undefined ? lambda($input, undefined) : $input,
          inputCodec = resolveInputCodec19 ? resolveInputCodec19(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = undefined ? undefined($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve41(sqlIdentifier, sqlValue, $input, $where);
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
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier14 ? resolveSqlIdentifier14(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = undefined ? lambda($input, undefined) : $input,
          inputCodec = resolveInputCodec19 ? resolveInputCodec19(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = undefined ? undefined($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve42(sqlIdentifier, sqlValue, $input, $where);
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
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier14 ? resolveSqlIdentifier14(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = undefined ? lambda($input, undefined) : $input,
          inputCodec = resolveInputCodec19 ? resolveInputCodec19(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = undefined ? undefined($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve43(sqlIdentifier, sqlValue, $input, $where);
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
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier14 ? resolveSqlIdentifier14(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = undefined ? lambda($input, undefined) : $input,
          inputCodec = resolveInputCodec20 ? resolveInputCodec20(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = undefined ? undefined($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve44(sqlIdentifier, sqlValue, $input, $where);
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
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier14 ? resolveSqlIdentifier14(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = undefined ? lambda($input, undefined) : $input,
          inputCodec = resolveInputCodec20 ? resolveInputCodec20(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = undefined ? undefined($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve45(sqlIdentifier, sqlValue, $input, $where);
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
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier14 ? resolveSqlIdentifier14(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = undefined ? lambda($input, undefined) : $input,
          inputCodec = resolveInputCodec19 ? resolveInputCodec19(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = undefined ? undefined($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve46(sqlIdentifier, sqlValue, $input, $where);
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
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier14 ? resolveSqlIdentifier14(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = undefined ? lambda($input, undefined) : $input,
          inputCodec = resolveInputCodec19 ? resolveInputCodec19(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = undefined ? undefined($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve47(sqlIdentifier, sqlValue, $input, $where);
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
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier14 ? resolveSqlIdentifier14(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = undefined ? lambda($input, undefined) : $input,
          inputCodec = resolveInputCodec19 ? resolveInputCodec19(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = undefined ? undefined($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve48(sqlIdentifier, sqlValue, $input, $where);
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
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier14 ? resolveSqlIdentifier14(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = undefined ? lambda($input, undefined) : $input,
          inputCodec = resolveInputCodec19 ? resolveInputCodec19(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = undefined ? undefined($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve49(sqlIdentifier, sqlValue, $input, $where);
        $where.where(fragment);
      }
    }
  },
  Mutation: {
    __assertStep: __ValueStep,
    createUser: {
      plan(_, args) {
        const plan = object({
          result: pgInsertSingle(pgResource_UserPgResource, Object.create(null))
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
          result: pgInsertSingle(pgResource_OrganizationPgResource, Object.create(null))
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
    createUpvote: {
      plan(_, args) {
        const plan = object({
          result: pgInsertSingle(pgResource_UpvotePgResource, Object.create(null))
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
          result: pgInsertSingle(pgResource_PostPgResource, Object.create(null))
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
          result: pgInsertSingle(pgResource_ProjectPgResource, Object.create(null))
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
    createPrismaMigration: {
      plan(_, args) {
        const plan = object({
          result: pgInsertSingle(pgResource__prisma_migrationsPgResource, Object.create(null))
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
    updateUser: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_UserPgResource, specFromArgs(args))
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
    updateUserByRowId: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_UserPgResource, {
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
    updateOrganization: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_OrganizationPgResource, specFromArgs2(args))
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
    updateOrganizationByRowId: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_OrganizationPgResource, {
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
    updateUpvote: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_UpvotePgResource, specFromArgs3(args))
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
    updateUpvoteByRowId: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_UpvotePgResource, {
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
    updatePost: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_PostPgResource, specFromArgs4(args))
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
    updatePostByRowId: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_PostPgResource, {
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
    updateProject: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_ProjectPgResource, specFromArgs5(args))
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
    updateProjectByRowId: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_ProjectPgResource, {
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
    updatePrismaMigration: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource__prisma_migrationsPgResource, specFromArgs6(args))
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
    updatePrismaMigrationByRowId: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource__prisma_migrationsPgResource, {
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
    deleteUser: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_UserPgResource, specFromArgs7(args))
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
    deleteUserByRowId: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_UserPgResource, {
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
    deleteOrganization: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_OrganizationPgResource, specFromArgs8(args))
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
    deleteOrganizationByRowId: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_OrganizationPgResource, {
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
    deleteUpvote: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_UpvotePgResource, specFromArgs9(args))
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
    deleteUpvoteByRowId: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_UpvotePgResource, {
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
    deletePost: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_PostPgResource, specFromArgs10(args))
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
    deletePostByRowId: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_PostPgResource, {
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
    deleteProject: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_ProjectPgResource, specFromArgs11(args))
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
    deleteProjectByRowId: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_ProjectPgResource, {
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
    deletePrismaMigration: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource__prisma_migrationsPgResource, specFromArgs12(args))
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
    deletePrismaMigrationByRowId: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource__prisma_migrationsPgResource, {
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
              const spec = UserUniques[0].attributes.reduce((memo, attributeName) => {
                memo[attributeName] = $result.get(attributeName);
                return memo;
              }, Object.create(null));
              return pgResource_UserPgResource.find(spec);
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
    walletAddress: {
      applyPlan($insert, val) {
        $insert.set("walletAddress", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    createdAt: {
      applyPlan($insert, val) {
        $insert.set("createdAt", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    updatedAt: {
      applyPlan($insert, val) {
        $insert.set("updatedAt", val.get());
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
              const spec = OrganizationUniques[0].attributes.reduce((memo, attributeName) => {
                memo[attributeName] = $result.get(attributeName);
                return memo;
              }, Object.create(null));
              return pgResource_OrganizationPgResource.find(spec);
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
    name: {
      applyPlan($insert, val) {
        $insert.set("name", val.get());
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
    createdAt: {
      applyPlan($insert, val) {
        $insert.set("createdAt", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    updatedAt: {
      applyPlan($insert, val) {
        $insert.set("updatedAt", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
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
              const spec = UpvoteUniques[0].attributes.reduce((memo, attributeName) => {
                memo[attributeName] = $result.get(attributeName);
                return memo;
              }, Object.create(null));
              return pgResource_UpvotePgResource.find(spec);
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
    postId: {
      applyPlan($insert, val) {
        $insert.set("postId", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    userId: {
      applyPlan($insert, val) {
        $insert.set("userId", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    createdAt: {
      applyPlan($insert, val) {
        $insert.set("createdAt", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    updatedAt: {
      applyPlan($insert, val) {
        $insert.set("updatedAt", val.get());
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
              const spec = PostUniques[0].attributes.reduce((memo, attributeName) => {
                memo[attributeName] = $result.get(attributeName);
                return memo;
              }, Object.create(null));
              return pgResource_PostPgResource.find(spec);
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
    title: {
      applyPlan($insert, val) {
        $insert.set("title", val.get());
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
    projectId: {
      applyPlan($insert, val) {
        $insert.set("projectId", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    authorId: {
      applyPlan($insert, val) {
        $insert.set("authorId", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    createdAt: {
      applyPlan($insert, val) {
        $insert.set("createdAt", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    updatedAt: {
      applyPlan($insert, val) {
        $insert.set("updatedAt", val.get());
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
              const spec = ProjectUniques[0].attributes.reduce((memo, attributeName) => {
                memo[attributeName] = $result.get(attributeName);
                return memo;
              }, Object.create(null));
              return pgResource_ProjectPgResource.find(spec);
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
    organizationId: {
      applyPlan($insert, val) {
        $insert.set("organizationId", val.get());
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
    createdAt: {
      applyPlan($insert, val) {
        $insert.set("createdAt", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    updatedAt: {
      applyPlan($insert, val) {
        $insert.set("updatedAt", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  CreatePrismaMigrationPayload: {
    __assertStep: assertExecutableStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", !0) ?? constant(null);
    },
    _prismaMigration($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    _prismaMigrationEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", !0);
        if (!$result) return constant(null);
        const $select = (() => {
            if ($result instanceof PgDeleteSingleStep) return pgSelectFromRecord($result.resource, $result.record());else {
              const spec = _prisma_migrationsUniques[0].attributes.reduce((memo, attributeName) => {
                memo[attributeName] = $result.get(attributeName);
                return memo;
              }, Object.create(null));
              return pgResource__prisma_migrationsPgResource.find(spec);
            }
          })(),
          $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("_PrismaMigrationOrderBy"));
        const $connection = connection($select),
          $single = $select.row(first($select));
        return new EdgeStep($connection, $single);
      },
      args: {
        orderBy: undefined
      }
    }
  },
  CreatePrismaMigrationInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      },
      autoApplyAfterParentApplyPlan: true
    },
    _prismaMigration: {
      applyPlan($object) {
        return $object.getStepForKey("result").setPlan();
      },
      autoApplyAfterParentApplyPlan: true
    }
  },
  _PrismaMigrationInput: {
    "__inputPlan": function _PrismaMigrationInput_inputPlan() {
      return object(Object.create(null));
    },
    rowId: {
      applyPlan($insert, val) {
        $insert.set("id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    checksum: {
      applyPlan($insert, val) {
        $insert.set("checksum", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    finishedAt: {
      applyPlan($insert, val) {
        $insert.set("finished_at", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    migrationName: {
      applyPlan($insert, val) {
        $insert.set("migration_name", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    logs: {
      applyPlan($insert, val) {
        $insert.set("logs", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    rolledBackAt: {
      applyPlan($insert, val) {
        $insert.set("rolled_back_at", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    startedAt: {
      applyPlan($insert, val) {
        $insert.set("started_at", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    appliedStepsCount: {
      applyPlan($insert, val) {
        $insert.set("applied_steps_count", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
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
              const spec = UserUniques[0].attributes.reduce((memo, attributeName) => {
                memo[attributeName] = $result.get(attributeName);
                return memo;
              }, Object.create(null));
              return pgResource_UserPgResource.find(spec);
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
  UpdateUserInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    id: undefined,
    userPatch: {
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
    walletAddress: {
      applyPlan($insert, val) {
        $insert.set("walletAddress", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    createdAt: {
      applyPlan($insert, val) {
        $insert.set("createdAt", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    updatedAt: {
      applyPlan($insert, val) {
        $insert.set("updatedAt", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  UpdateUserByRowIdInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    rowId: undefined,
    userPatch: {
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
              const spec = OrganizationUniques[0].attributes.reduce((memo, attributeName) => {
                memo[attributeName] = $result.get(attributeName);
                return memo;
              }, Object.create(null));
              return pgResource_OrganizationPgResource.find(spec);
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
  UpdateOrganizationInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    id: undefined,
    organizationPatch: {
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
    name: {
      applyPlan($insert, val) {
        $insert.set("name", val.get());
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
    createdAt: {
      applyPlan($insert, val) {
        $insert.set("createdAt", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    updatedAt: {
      applyPlan($insert, val) {
        $insert.set("updatedAt", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  UpdateOrganizationByRowIdInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    rowId: undefined,
    organizationPatch: {
      applyPlan($object) {
        return $object.getStepForKey("result").setPlan();
      }
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
              const spec = UpvoteUniques[0].attributes.reduce((memo, attributeName) => {
                memo[attributeName] = $result.get(attributeName);
                return memo;
              }, Object.create(null));
              return pgResource_UpvotePgResource.find(spec);
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
  UpdateUpvoteInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    id: undefined,
    upvotePatch: {
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
    postId: {
      applyPlan($insert, val) {
        $insert.set("postId", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    userId: {
      applyPlan($insert, val) {
        $insert.set("userId", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    createdAt: {
      applyPlan($insert, val) {
        $insert.set("createdAt", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    updatedAt: {
      applyPlan($insert, val) {
        $insert.set("updatedAt", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  UpdateUpvoteByRowIdInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    rowId: undefined,
    upvotePatch: {
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
              const spec = PostUniques[0].attributes.reduce((memo, attributeName) => {
                memo[attributeName] = $result.get(attributeName);
                return memo;
              }, Object.create(null));
              return pgResource_PostPgResource.find(spec);
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
  UpdatePostInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    id: undefined,
    postPatch: {
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
    title: {
      applyPlan($insert, val) {
        $insert.set("title", val.get());
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
    projectId: {
      applyPlan($insert, val) {
        $insert.set("projectId", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    authorId: {
      applyPlan($insert, val) {
        $insert.set("authorId", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    createdAt: {
      applyPlan($insert, val) {
        $insert.set("createdAt", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    updatedAt: {
      applyPlan($insert, val) {
        $insert.set("updatedAt", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  UpdatePostByRowIdInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    rowId: undefined,
    postPatch: {
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
              const spec = ProjectUniques[0].attributes.reduce((memo, attributeName) => {
                memo[attributeName] = $result.get(attributeName);
                return memo;
              }, Object.create(null));
              return pgResource_ProjectPgResource.find(spec);
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
  UpdateProjectInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    id: undefined,
    projectPatch: {
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
    organizationId: {
      applyPlan($insert, val) {
        $insert.set("organizationId", val.get());
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
    createdAt: {
      applyPlan($insert, val) {
        $insert.set("createdAt", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    updatedAt: {
      applyPlan($insert, val) {
        $insert.set("updatedAt", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  UpdateProjectByRowIdInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    rowId: undefined,
    projectPatch: {
      applyPlan($object) {
        return $object.getStepForKey("result").setPlan();
      }
    }
  },
  UpdatePrismaMigrationPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", !0) ?? constant(null);
    },
    _prismaMigration($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    _prismaMigrationEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", !0);
        if (!$result) return constant(null);
        const $select = (() => {
            if ($result instanceof PgDeleteSingleStep) return pgSelectFromRecord($result.resource, $result.record());else {
              const spec = _prisma_migrationsUniques[0].attributes.reduce((memo, attributeName) => {
                memo[attributeName] = $result.get(attributeName);
                return memo;
              }, Object.create(null));
              return pgResource__prisma_migrationsPgResource.find(spec);
            }
          })(),
          $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("_PrismaMigrationOrderBy"));
        const $connection = connection($select),
          $single = $select.row(first($select));
        return new EdgeStep($connection, $single);
      },
      args: {
        orderBy: undefined
      }
    }
  },
  UpdatePrismaMigrationInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    id: undefined,
    _prismaMigrationPatch: {
      applyPlan($object) {
        return $object.getStepForKey("result").setPlan();
      }
    }
  },
  _PrismaMigrationPatch: {
    "__inputPlan": function _PrismaMigrationPatch_inputPlan() {
      return object(Object.create(null));
    },
    rowId: {
      applyPlan($insert, val) {
        $insert.set("id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    checksum: {
      applyPlan($insert, val) {
        $insert.set("checksum", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    finishedAt: {
      applyPlan($insert, val) {
        $insert.set("finished_at", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    migrationName: {
      applyPlan($insert, val) {
        $insert.set("migration_name", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    logs: {
      applyPlan($insert, val) {
        $insert.set("logs", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    rolledBackAt: {
      applyPlan($insert, val) {
        $insert.set("rolled_back_at", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    startedAt: {
      applyPlan($insert, val) {
        $insert.set("started_at", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    appliedStepsCount: {
      applyPlan($insert, val) {
        $insert.set("applied_steps_count", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  UpdatePrismaMigrationByRowIdInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    rowId: undefined,
    _prismaMigrationPatch: {
      applyPlan($object) {
        return $object.getStepForKey("result").setPlan();
      }
    }
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
              const spec = UserUniques[0].attributes.reduce((memo, attributeName) => {
                memo[attributeName] = $result.get(attributeName);
                return memo;
              }, Object.create(null));
              return pgResource_UserPgResource.find(spec);
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
  DeleteUserInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    id: undefined
  },
  DeleteUserByRowIdInput: {
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
              const spec = OrganizationUniques[0].attributes.reduce((memo, attributeName) => {
                memo[attributeName] = $result.get(attributeName);
                return memo;
              }, Object.create(null));
              return pgResource_OrganizationPgResource.find(spec);
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
  DeleteOrganizationInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    id: undefined
  },
  DeleteOrganizationByRowIdInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    rowId: undefined
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
              const spec = UpvoteUniques[0].attributes.reduce((memo, attributeName) => {
                memo[attributeName] = $result.get(attributeName);
                return memo;
              }, Object.create(null));
              return pgResource_UpvotePgResource.find(spec);
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
  DeleteUpvoteInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    id: undefined
  },
  DeleteUpvoteByRowIdInput: {
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
              const spec = PostUniques[0].attributes.reduce((memo, attributeName) => {
                memo[attributeName] = $result.get(attributeName);
                return memo;
              }, Object.create(null));
              return pgResource_PostPgResource.find(spec);
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
  DeletePostInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    id: undefined
  },
  DeletePostByRowIdInput: {
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
              const spec = ProjectUniques[0].attributes.reduce((memo, attributeName) => {
                memo[attributeName] = $result.get(attributeName);
                return memo;
              }, Object.create(null));
              return pgResource_ProjectPgResource.find(spec);
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
  DeleteProjectInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    id: undefined
  },
  DeleteProjectByRowIdInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    rowId: undefined
  },
  DeletePrismaMigrationPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", !0) ?? constant(null);
    },
    _prismaMigration($object) {
      return $object.get("result");
    },
    deletedPrismaMigrationId($object) {
      const $record = $object.getStepForKey("result"),
        specifier = nodeIdHandlerByTypeName._PrismaMigration.plan($record);
      return lambda(specifier, nodeIdCodecs_base64JSON_base64JSON.encode);
    },
    query() {
      return rootValue();
    },
    _prismaMigrationEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", !0);
        if (!$result) return constant(null);
        const $select = (() => {
            if ($result instanceof PgDeleteSingleStep) return pgSelectFromRecord($result.resource, $result.record());else {
              const spec = _prisma_migrationsUniques[0].attributes.reduce((memo, attributeName) => {
                memo[attributeName] = $result.get(attributeName);
                return memo;
              }, Object.create(null));
              return pgResource__prisma_migrationsPgResource.find(spec);
            }
          })(),
          $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("_PrismaMigrationOrderBy"));
        const $connection = connection($select),
          $single = $select.row(first($select));
        return new EdgeStep($connection, $single);
      },
      args: {
        orderBy: undefined
      }
    }
  },
  DeletePrismaMigrationInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    id: undefined
  },
  DeletePrismaMigrationByRowIdInput: {
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