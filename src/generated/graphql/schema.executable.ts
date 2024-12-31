// @ts-nocheck
import { PgBooleanFilterStep, PgConditionStep, PgDeleteSingleStep, PgExecutor, PgOrFilterStep, PgSelectStep, PgUnionAllStep, TYPES, assertPgClassSingleStep, listOfCodec, makeRegistry, pgDeleteSingle, pgInsertSingle, pgSelectFromRecord, pgUpdateSingle, pgWhereConditionSpecListToSQL, recordCodec } from "@dataplan/pg";
import { ConnectionStep, EdgeStep, ModifierStep, ObjectStep, SafeError, __ValueStep, access, assertEdgeCapableStep, assertExecutableStep, assertPageInfoCapableStep, connection, constant, context, first, getEnumValueConfig, inhibitOnNull, lambda, list, makeGrafastSchema, node, object, rootValue, specFromNodeId } from "grafast";
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
const userOrganizationIdentifier = sql.identifier("public", "user_organization");
const spec_userOrganization = {
  name: "userOrganization",
  identifier: userOrganizationIdentifier,
  attributes: Object.assign(Object.create(null), {
    user_id: {
      description: undefined,
      codec: TYPES.uuid,
      notNull: true,
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
      codec: TYPES.uuid,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    created_at: {
      description: undefined,
      codec: TYPES.timestamptz,
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
    oid: "77872",
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "public",
      name: "user_organization"
    },
    tags: Object.create(null)
  },
  executor: executor
};
const userOrganizationCodec = recordCodec(spec_userOrganization);
const upvoteIdentifier = sql.identifier("public", "upvote");
const spec_upvote = {
  name: "upvote",
  identifier: upvoteIdentifier,
  attributes: Object.assign(Object.create(null), {
    id: {
      description: undefined,
      codec: TYPES.uuid,
      notNull: true,
      hasDefault: true,
      extensions: {
        tags: {},
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    post_id: {
      description: undefined,
      codec: TYPES.uuid,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    user_id: {
      description: undefined,
      codec: TYPES.uuid,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    created_at: {
      description: undefined,
      codec: TYPES.timestamptz,
      notNull: false,
      hasDefault: true,
      extensions: {
        tags: {},
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    updated_at: {
      description: undefined,
      codec: TYPES.timestamptz,
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
    oid: "77850",
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
      codec: TYPES.uuid,
      notNull: true,
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
    slug: {
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
    created_at: {
      description: undefined,
      codec: TYPES.timestamptz,
      notNull: false,
      hasDefault: true,
      extensions: {
        tags: {},
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    updated_at: {
      description: undefined,
      codec: TYPES.timestamptz,
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
    oid: "77812",
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
const commentIdentifier = sql.identifier("public", "comment");
const spec_comment = {
  name: "comment",
  identifier: commentIdentifier,
  attributes: Object.assign(Object.create(null), {
    id: {
      description: undefined,
      codec: TYPES.uuid,
      notNull: true,
      hasDefault: true,
      extensions: {
        tags: {},
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    message: {
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
    post_id: {
      description: undefined,
      codec: TYPES.uuid,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    user_id: {
      description: undefined,
      codec: TYPES.uuid,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    created_at: {
      description: undefined,
      codec: TYPES.timestamptz,
      notNull: false,
      hasDefault: true,
      extensions: {
        tags: {},
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    updated_at: {
      description: undefined,
      codec: TYPES.timestamptz,
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
    oid: "78467",
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "public",
      name: "comment"
    },
    tags: Object.create(null)
  },
  executor: executor
};
const commentCodec = recordCodec(spec_comment);
const postIdentifier = sql.identifier("public", "post");
const spec_post = {
  name: "post",
  identifier: postIdentifier,
  attributes: Object.assign(Object.create(null), {
    id: {
      description: undefined,
      codec: TYPES.uuid,
      notNull: true,
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
    project_id: {
      description: undefined,
      codec: TYPES.uuid,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    user_id: {
      description: undefined,
      codec: TYPES.uuid,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    created_at: {
      description: undefined,
      codec: TYPES.timestamptz,
      notNull: false,
      hasDefault: true,
      extensions: {
        tags: {},
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    updated_at: {
      description: undefined,
      codec: TYPES.timestamptz,
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
    oid: "77826",
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
      codec: TYPES.uuid,
      notNull: true,
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
    slug: {
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
      codec: TYPES.uuid,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    created_at: {
      description: undefined,
      codec: TYPES.timestamptz,
      notNull: false,
      hasDefault: true,
      extensions: {
        tags: {},
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    updated_at: {
      description: undefined,
      codec: TYPES.timestamptz,
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
    oid: "77836",
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
      codec: TYPES.uuid,
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
      codec: TYPES.timestamptz,
      notNull: false,
      hasDefault: true,
      extensions: {
        tags: {},
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    updated_at: {
      description: undefined,
      codec: TYPES.timestamptz,
      notNull: false,
      hasDefault: true,
      extensions: {
        tags: {},
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    hidra_id: {
      description: undefined,
      codec: TYPES.uuid,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    username: {
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
    first_name: {
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
    last_name: {
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
    oid: "77860",
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
const registryConfig_pgResources_user_organization_user_organization = {
  executor: executor,
  name: "user_organization",
  identifier: "main.public.user_organization",
  from: userOrganizationIdentifier,
  codec: userOrganizationCodec,
  uniques: [{
    isPrimary: false,
    attributes: ["user_id", "organization_id"],
    description: undefined,
    extensions: {
      tags: Object.create(null)
    }
  }],
  isVirtual: false,
  description: undefined,
  extensions: {
    description: undefined,
    pg: {
      serviceName: "main",
      schemaName: "public",
      name: "user_organization"
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
const upvoteUniques = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}, {
  isPrimary: false,
  attributes: ["post_id", "user_id"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}];
const registryConfig_pgResources_upvote_upvote = {
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
};
const organizationUniques = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}, {
  isPrimary: false,
  attributes: ["name"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}, {
  isPrimary: false,
  attributes: ["slug"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}];
const registryConfig_pgResources_organization_organization = {
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
};
const commentUniques = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}];
const registryConfig_pgResources_comment_comment = {
  executor: executor,
  name: "comment",
  identifier: "main.public.comment",
  from: commentIdentifier,
  codec: commentCodec,
  uniques: commentUniques,
  isVirtual: false,
  description: undefined,
  extensions: {
    description: undefined,
    pg: {
      serviceName: "main",
      schemaName: "public",
      name: "comment"
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
const postUniques = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}];
const registryConfig_pgResources_post_post = {
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
};
const userUniques = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}, {
  isPrimary: false,
  attributes: ["hidra_id"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}, {
  isPrimary: false,
  attributes: ["username"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}];
const registryConfig_pgResources_user_user = {
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
};
const projectUniques = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}, {
  isPrimary: false,
  attributes: ["name"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}, {
  isPrimary: false,
  attributes: ["slug", "organization_id"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}];
const registryConfig_pgResources_project_project = {
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
};
const registryConfig = {
  pgExecutors: Object.assign(Object.create(null), {
    main: executor
  }),
  pgCodecs: Object.assign(Object.create(null), {
    userOrganization: userOrganizationCodec,
    uuid: TYPES.uuid,
    timestamptz: TYPES.timestamptz,
    upvote: upvoteCodec,
    organization: organizationCodec,
    text: TYPES.text,
    comment: commentCodec,
    post: postCodec,
    project: projectCodec,
    user: userCodec
  }),
  pgResources: Object.assign(Object.create(null), {
    user_organization: registryConfig_pgResources_user_organization_user_organization,
    upvote: registryConfig_pgResources_upvote_upvote,
    organization: registryConfig_pgResources_organization_organization,
    comment: registryConfig_pgResources_comment_comment,
    post: registryConfig_pgResources_post_post,
    user: registryConfig_pgResources_user_user,
    project: registryConfig_pgResources_project_project
  }),
  pgRelations: Object.assign(Object.create(null), {
    comment: Object.assign(Object.create(null), {
      postByMyPostId: {
        localCodec: commentCodec,
        remoteResourceOptions: registryConfig_pgResources_post_post,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["post_id"],
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
        localCodec: commentCodec,
        remoteResourceOptions: registryConfig_pgResources_user_user,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["user_id"],
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
    organization: Object.assign(Object.create(null), {
      projectsByTheirOrganizationId: {
        localCodec: organizationCodec,
        remoteResourceOptions: registryConfig_pgResources_project_project,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["id"],
        remoteAttributes: ["organization_id"],
        isUnique: false,
        isReferencee: true,
        description: undefined,
        extensions: {
          tags: {
            behavior: []
          }
        }
      },
      userOrganizationsByTheirOrganizationId: {
        localCodec: organizationCodec,
        remoteResourceOptions: registryConfig_pgResources_user_organization_user_organization,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["id"],
        remoteAttributes: ["organization_id"],
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
      projectByMyProjectId: {
        localCodec: postCodec,
        remoteResourceOptions: registryConfig_pgResources_project_project,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["project_id"],
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
        localCodec: postCodec,
        remoteResourceOptions: registryConfig_pgResources_user_user,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["user_id"],
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
        remoteResourceOptions: registryConfig_pgResources_upvote_upvote,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["id"],
        remoteAttributes: ["post_id"],
        isUnique: false,
        isReferencee: true,
        description: undefined,
        extensions: {
          tags: {
            behavior: []
          }
        }
      },
      commentsByTheirPostId: {
        localCodec: postCodec,
        remoteResourceOptions: registryConfig_pgResources_comment_comment,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["id"],
        remoteAttributes: ["post_id"],
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
        remoteResourceOptions: registryConfig_pgResources_organization_organization,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["organization_id"],
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
        remoteResourceOptions: registryConfig_pgResources_post_post,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["id"],
        remoteAttributes: ["project_id"],
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
        remoteResourceOptions: registryConfig_pgResources_post_post,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["post_id"],
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
        remoteResourceOptions: registryConfig_pgResources_user_user,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["user_id"],
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
      postsByTheirUserId: {
        localCodec: userCodec,
        remoteResourceOptions: registryConfig_pgResources_post_post,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["id"],
        remoteAttributes: ["user_id"],
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
        remoteResourceOptions: registryConfig_pgResources_upvote_upvote,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["id"],
        remoteAttributes: ["user_id"],
        isUnique: false,
        isReferencee: true,
        description: undefined,
        extensions: {
          tags: {
            behavior: []
          }
        }
      },
      userOrganizationsByTheirUserId: {
        localCodec: userCodec,
        remoteResourceOptions: registryConfig_pgResources_user_organization_user_organization,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["id"],
        remoteAttributes: ["user_id"],
        isUnique: false,
        isReferencee: true,
        description: undefined,
        extensions: {
          tags: {
            behavior: []
          }
        }
      },
      commentsByTheirUserId: {
        localCodec: userCodec,
        remoteResourceOptions: registryConfig_pgResources_comment_comment,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["id"],
        remoteAttributes: ["user_id"],
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
    userOrganization: Object.assign(Object.create(null), {
      organizationByMyOrganizationId: {
        localCodec: userOrganizationCodec,
        remoteResourceOptions: registryConfig_pgResources_organization_organization,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["organization_id"],
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
        localCodec: userOrganizationCodec,
        remoteResourceOptions: registryConfig_pgResources_user_user,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["user_id"],
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
    })
  })
};
const registry = makeRegistry(registryConfig);
const pgResource_upvotePgResource = registry.pgResources["upvote"];
const pgResource_organizationPgResource = registry.pgResources["organization"];
const pgResource_commentPgResource = registry.pgResources["comment"];
const pgResource_postPgResource = registry.pgResources["post"];
const pgResource_userPgResource = registry.pgResources["user"];
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
  Comment: {
    typeName: "Comment",
    codec: nodeIdCodecs_base64JSON_base64JSON,
    deprecationReason: undefined,
    plan($record) {
      return list([constant("Comment", false), $record.get("id")]);
    },
    getSpec($list) {
      return {
        id: inhibitOnNull(access($list, [1]))
      };
    },
    get(spec) {
      return pgResource_commentPgResource.get(spec);
    },
    match(obj) {
      return obj[0] === "Comment";
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
const resource_user_organizationPgResource = registry.pgResources["user_organization"];
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
})(nodeIdHandlerByTypeName.Organization);
const fetcher3 = (handler => {
  const fn = $nodeId => {
    const $decoded = lambda($nodeId, specForHandler(handler));
    return handler.get(handler.getSpec($decoded));
  };
  fn.deprecationReason = handler.deprecationReason;
  return fn;
})(nodeIdHandlerByTypeName.Comment);
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
})(nodeIdHandlerByTypeName.User);
const fetcher6 = (handler => {
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
function UUIDSerialize(value) {
  return "" + value;
}
const coerce = string => {
  if (!/^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}$/i.test(string)) throw new GraphQLError("Invalid UUID, expected 32 hexadecimal characters, optionally with hypens");
  return string;
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
    fragment: sql.fragment`${$pgSelect.alias}.${sql.identifier("image")}`
  });
}
function ProjectGroupBy_extensions_grafast_applyPlan2($pgSelect) {
  $pgSelect.groupBy({
    fragment: sql.fragment`${$pgSelect.alias}.${sql.identifier("slug")}`
  });
}
function ProjectGroupBy_extensions_grafast_applyPlan3($pgSelect) {
  $pgSelect.groupBy({
    fragment: sql.fragment`${$pgSelect.alias}.${sql.identifier("description")}`
  });
}
function ProjectGroupBy_extensions_grafast_applyPlan4($pgSelect) {
  $pgSelect.groupBy({
    fragment: sql.fragment`${$pgSelect.alias}.${sql.identifier("organization_id")}`
  });
}
function ProjectGroupBy_extensions_grafast_applyPlan5($pgSelect) {
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
function ProjectGroupBy_extensions_grafast_applyPlan6($pgSelect) {
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
function ProjectGroupBy_extensions_grafast_applyPlan7($pgSelect) {
  $pgSelect.groupBy({
    fragment: aggregateGroupBySpec2.sqlWrap(sql`${$pgSelect.alias}.${sql.identifier("created_at")}`)
  });
}
function ProjectGroupBy_extensions_grafast_applyPlan8($pgSelect) {
  $pgSelect.groupBy({
    fragment: sql.fragment`${$pgSelect.alias}.${sql.identifier("updated_at")}`
  });
}
function ProjectGroupBy_extensions_grafast_applyPlan9($pgSelect) {
  $pgSelect.groupBy({
    fragment: aggregateGroupBySpec.sqlWrap(sql`${$pgSelect.alias}.${sql.identifier("updated_at")}`)
  });
}
function ProjectGroupBy_extensions_grafast_applyPlan10($pgSelect) {
  $pgSelect.groupBy({
    fragment: aggregateGroupBySpec2.sqlWrap(sql`${$pgSelect.alias}.${sql.identifier("updated_at")}`)
  });
}
export const ProjectGroupBy = new GraphQLEnumType({
  name: "ProjectGroupBy",
  description: "Grouping methods for `Project` for usage during aggregation.",
  values: Object.assign(Object.create(null), {
    IMAGE: {
      value: "IMAGE",
      extensions: Object.assign(Object.create(null), {
        grafast: {
          applyPlan: ProjectGroupBy_extensions_grafast_applyPlan
        }
      })
    },
    SLUG: {
      value: "SLUG",
      extensions: Object.assign(Object.create(null), {
        grafast: {
          applyPlan: ProjectGroupBy_extensions_grafast_applyPlan2
        }
      })
    },
    DESCRIPTION: {
      value: "DESCRIPTION",
      extensions: Object.assign(Object.create(null), {
        grafast: {
          applyPlan: ProjectGroupBy_extensions_grafast_applyPlan3
        }
      })
    },
    ORGANIZATION_ID: {
      value: "ORGANIZATION_ID",
      extensions: Object.assign(Object.create(null), {
        grafast: {
          applyPlan: ProjectGroupBy_extensions_grafast_applyPlan4
        }
      })
    },
    CREATED_AT: {
      value: "CREATED_AT",
      extensions: Object.assign(Object.create(null), {
        grafast: {
          applyPlan: ProjectGroupBy_extensions_grafast_applyPlan5
        }
      })
    },
    CREATED_AT_TRUNCATED_TO_HOUR: {
      value: "CREATED_AT_TRUNCATED_TO_HOUR",
      extensions: Object.assign(Object.create(null), {
        grafast: {
          applyPlan: ProjectGroupBy_extensions_grafast_applyPlan6
        }
      })
    },
    CREATED_AT_TRUNCATED_TO_DAY: {
      value: "CREATED_AT_TRUNCATED_TO_DAY",
      extensions: Object.assign(Object.create(null), {
        grafast: {
          applyPlan: ProjectGroupBy_extensions_grafast_applyPlan7
        }
      })
    },
    UPDATED_AT: {
      value: "UPDATED_AT",
      extensions: Object.assign(Object.create(null), {
        grafast: {
          applyPlan: ProjectGroupBy_extensions_grafast_applyPlan8
        }
      })
    },
    UPDATED_AT_TRUNCATED_TO_HOUR: {
      value: "UPDATED_AT_TRUNCATED_TO_HOUR",
      extensions: Object.assign(Object.create(null), {
        grafast: {
          applyPlan: ProjectGroupBy_extensions_grafast_applyPlan9
        }
      })
    },
    UPDATED_AT_TRUNCATED_TO_DAY: {
      value: "UPDATED_AT_TRUNCATED_TO_DAY",
      extensions: Object.assign(Object.create(null), {
        grafast: {
          applyPlan: ProjectGroupBy_extensions_grafast_applyPlan10
        }
      })
    }
  })
});
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
function PostGroupBy_extensions_grafast_applyPlan($pgSelect) {
  $pgSelect.groupBy({
    fragment: sql.fragment`${$pgSelect.alias}.${sql.identifier("title")}`
  });
}
function PostGroupBy_extensions_grafast_applyPlan2($pgSelect) {
  $pgSelect.groupBy({
    fragment: sql.fragment`${$pgSelect.alias}.${sql.identifier("description")}`
  });
}
function PostGroupBy_extensions_grafast_applyPlan3($pgSelect) {
  $pgSelect.groupBy({
    fragment: sql.fragment`${$pgSelect.alias}.${sql.identifier("project_id")}`
  });
}
function PostGroupBy_extensions_grafast_applyPlan4($pgSelect) {
  $pgSelect.groupBy({
    fragment: sql.fragment`${$pgSelect.alias}.${sql.identifier("user_id")}`
  });
}
function PostGroupBy_extensions_grafast_applyPlan5($pgSelect) {
  $pgSelect.groupBy({
    fragment: sql.fragment`${$pgSelect.alias}.${sql.identifier("created_at")}`
  });
}
function PostGroupBy_extensions_grafast_applyPlan6($pgSelect) {
  $pgSelect.groupBy({
    fragment: aggregateGroupBySpec.sqlWrap(sql`${$pgSelect.alias}.${sql.identifier("created_at")}`)
  });
}
function PostGroupBy_extensions_grafast_applyPlan7($pgSelect) {
  $pgSelect.groupBy({
    fragment: aggregateGroupBySpec2.sqlWrap(sql`${$pgSelect.alias}.${sql.identifier("created_at")}`)
  });
}
function PostGroupBy_extensions_grafast_applyPlan8($pgSelect) {
  $pgSelect.groupBy({
    fragment: sql.fragment`${$pgSelect.alias}.${sql.identifier("updated_at")}`
  });
}
function PostGroupBy_extensions_grafast_applyPlan9($pgSelect) {
  $pgSelect.groupBy({
    fragment: aggregateGroupBySpec.sqlWrap(sql`${$pgSelect.alias}.${sql.identifier("updated_at")}`)
  });
}
function PostGroupBy_extensions_grafast_applyPlan10($pgSelect) {
  $pgSelect.groupBy({
    fragment: aggregateGroupBySpec2.sqlWrap(sql`${$pgSelect.alias}.${sql.identifier("updated_at")}`)
  });
}
export const PostGroupBy = new GraphQLEnumType({
  name: "PostGroupBy",
  description: "Grouping methods for `Post` for usage during aggregation.",
  values: Object.assign(Object.create(null), {
    TITLE: {
      value: "TITLE",
      extensions: Object.assign(Object.create(null), {
        grafast: {
          applyPlan: PostGroupBy_extensions_grafast_applyPlan
        }
      })
    },
    DESCRIPTION: {
      value: "DESCRIPTION",
      extensions: Object.assign(Object.create(null), {
        grafast: {
          applyPlan: PostGroupBy_extensions_grafast_applyPlan2
        }
      })
    },
    PROJECT_ID: {
      value: "PROJECT_ID",
      extensions: Object.assign(Object.create(null), {
        grafast: {
          applyPlan: PostGroupBy_extensions_grafast_applyPlan3
        }
      })
    },
    USER_ID: {
      value: "USER_ID",
      extensions: Object.assign(Object.create(null), {
        grafast: {
          applyPlan: PostGroupBy_extensions_grafast_applyPlan4
        }
      })
    },
    CREATED_AT: {
      value: "CREATED_AT",
      extensions: Object.assign(Object.create(null), {
        grafast: {
          applyPlan: PostGroupBy_extensions_grafast_applyPlan5
        }
      })
    },
    CREATED_AT_TRUNCATED_TO_HOUR: {
      value: "CREATED_AT_TRUNCATED_TO_HOUR",
      extensions: Object.assign(Object.create(null), {
        grafast: {
          applyPlan: PostGroupBy_extensions_grafast_applyPlan6
        }
      })
    },
    CREATED_AT_TRUNCATED_TO_DAY: {
      value: "CREATED_AT_TRUNCATED_TO_DAY",
      extensions: Object.assign(Object.create(null), {
        grafast: {
          applyPlan: PostGroupBy_extensions_grafast_applyPlan7
        }
      })
    },
    UPDATED_AT: {
      value: "UPDATED_AT",
      extensions: Object.assign(Object.create(null), {
        grafast: {
          applyPlan: PostGroupBy_extensions_grafast_applyPlan8
        }
      })
    },
    UPDATED_AT_TRUNCATED_TO_HOUR: {
      value: "UPDATED_AT_TRUNCATED_TO_HOUR",
      extensions: Object.assign(Object.create(null), {
        grafast: {
          applyPlan: PostGroupBy_extensions_grafast_applyPlan9
        }
      })
    },
    UPDATED_AT_TRUNCATED_TO_DAY: {
      value: "UPDATED_AT_TRUNCATED_TO_DAY",
      extensions: Object.assign(Object.create(null), {
        grafast: {
          applyPlan: PostGroupBy_extensions_grafast_applyPlan10
        }
      })
    }
  })
});
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
const relation = registry.pgRelations["post"]["upvotesByTheirPostId"];
const dataTypeToAggregateTypeMap = {};
const aggregateSpec = {
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
    return (_b = oid ? dataTypeToAggregateTypeMap[oid] : null) !== null && _b !== void 0 ? _b : TYPES.bigint;
  }
};
const relation2 = registry.pgRelations["post"]["commentsByTheirPostId"];
const colSpec = {
  fieldName: "rowId",
  attributeName: "id",
  attribute: spec_post.attributes.id
};
const colSpec2 = {
  fieldName: "title",
  attributeName: "title",
  attribute: spec_post.attributes.title
};
const colSpec3 = {
  fieldName: "description",
  attributeName: "description",
  attribute: spec_post.attributes.description
};
const colSpec4 = {
  fieldName: "projectId",
  attributeName: "project_id",
  attribute: spec_post.attributes.project_id
};
const colSpec5 = {
  fieldName: "userId",
  attributeName: "user_id",
  attribute: spec_post.attributes.user_id
};
const colSpec6 = {
  fieldName: "createdAt",
  attributeName: "created_at",
  attribute: spec_post.attributes.created_at
};
const colSpec7 = {
  fieldName: "updatedAt",
  attributeName: "updated_at",
  attribute: spec_post.attributes.updated_at
};
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
const resolve23 = (i, v) => sql`${i} LIKE ${v}`;
function escapeLikeWildcards(input) {
  if (typeof input !== "string") throw new Error("Non-string input was provided to escapeLikeWildcards");else return input.split("%").join("\\%").split("_").join("\\_");
}
const resolveInput = input => `%${escapeLikeWildcards(input)}%`;
const resolve24 = (i, v) => sql`${i} NOT LIKE ${v}`;
const resolveInput2 = input => `%${escapeLikeWildcards(input)}%`;
const resolve25 = (i, v) => sql`${i} ILIKE ${v}`;
const resolveInput3 = input => `%${escapeLikeWildcards(input)}%`;
const forceTextTypesInsensitive = [TYPES.char, TYPES.bpchar];
function resolveInputCodec7(c) {
  if (c.arrayOfCodec) {
    if (forceTextTypesInsensitive.includes(resolveDomains2(c.arrayOfCodec))) return listOfCodec(TYPES.text, {
      extensions: {
        listItemNonNull: c.extensions?.listItemNonNull
      }
    });
    return c;
  } else {
    if (forceTextTypesInsensitive.includes(resolveDomains2(c))) return TYPES.text;
    return c;
  }
}
function resolveSqlIdentifier3(identifier, c) {
  if (c.arrayOfCodec && forceTextTypesInsensitive.includes(resolveDomains2(c.arrayOfCodec))) return [sql`(${identifier})::text[]`, listOfCodec(TYPES.text, {
    extensions: {
      listItemNonNull: c.extensions?.listItemNonNull
    }
  })];else if (forceTextTypesInsensitive.includes(resolveDomains2(c))) return [sql`(${identifier})::text`, TYPES.text];else return [identifier, c];
}
const resolve26 = (i, v) => sql`${i} NOT ILIKE ${v}`;
const resolveInput4 = input => `%${escapeLikeWildcards(input)}%`;
const resolve27 = (i, v) => sql`${i} LIKE ${v}`;
const resolveInput5 = input => `${escapeLikeWildcards(input)}%`;
const resolve28 = (i, v) => sql`${i} NOT LIKE ${v}`;
const resolveInput6 = input => `${escapeLikeWildcards(input)}%`;
const resolve29 = (i, v) => sql`${i} ILIKE ${v}`;
const resolveInput7 = input => `${escapeLikeWildcards(input)}%`;
const resolve30 = (i, v) => sql`${i} NOT ILIKE ${v}`;
const resolveInput8 = input => `${escapeLikeWildcards(input)}%`;
const resolve31 = (i, v) => sql`${i} LIKE ${v}`;
const resolveInput9 = input => `%${escapeLikeWildcards(input)}`;
const resolve32 = (i, v) => sql`${i} NOT LIKE ${v}`;
const resolveInput10 = input => `%${escapeLikeWildcards(input)}`;
const resolve33 = (i, v) => sql`${i} ILIKE ${v}`;
const resolveInput11 = input => `%${escapeLikeWildcards(input)}`;
const resolve34 = (i, v) => sql`${i} NOT ILIKE ${v}`;
const resolveInput12 = input => `%${escapeLikeWildcards(input)}`;
const resolve35 = (i, v) => sql`${i} LIKE ${v}`;
const resolve36 = (i, v) => sql`${i} NOT LIKE ${v}`;
const resolve37 = (i, v) => sql`${i} ILIKE ${v}`;
const resolve38 = (i, v) => sql`${i} NOT ILIKE ${v}`;
function resolveInputCodec8(inputCodec) {
  if ("equalTo" === "in" || "equalTo" === "notIn") {
    const t = resolveDomains2(inputCodec) === TYPES.citext ? inputCodec : TYPES.text;
    return listOfCodec(t, {
      extensions: {
        listItemNonNull: !0
      }
    });
  } else return resolveDomains2(inputCodec) === TYPES.citext ? inputCodec : TYPES.text;
}
function resolveSqlIdentifier4(sourceAlias, codec) {
  return resolveDomains2(codec) === TYPES.citext ? [sourceAlias, codec] : [sql`lower(${sourceAlias}::text)`, TYPES.text];
}
function resolveSqlValue3($placeholderable, $input, inputCodec) {
  if ("equalTo" === "in" || "equalTo" === "notIn") {
    const sqlList = $placeholderable.placeholder($input, inputCodec);
    if (inputCodec.arrayOfCodec === TYPES.citext) return sqlList;else return sql`(select lower(t) from unnest(${sqlList}) t)`;
  } else {
    const sqlValue = $placeholderable.placeholder($input, inputCodec);
    if (inputCodec === TYPES.citext) return sqlValue;else return sql`lower(${sqlValue})`;
  }
}
function resolveInputCodec9(inputCodec) {
  if ("notEqualTo" === "in" || "notEqualTo" === "notIn") {
    const t = resolveDomains2(inputCodec) === TYPES.citext ? inputCodec : TYPES.text;
    return listOfCodec(t, {
      extensions: {
        listItemNonNull: !0
      }
    });
  } else return resolveDomains2(inputCodec) === TYPES.citext ? inputCodec : TYPES.text;
}
function resolveSqlIdentifier5(sourceAlias, codec) {
  return resolveDomains2(codec) === TYPES.citext ? [sourceAlias, codec] : [sql`lower(${sourceAlias}::text)`, TYPES.text];
}
function resolveSqlValue4($placeholderable, $input, inputCodec) {
  if ("notEqualTo" === "in" || "notEqualTo" === "notIn") {
    const sqlList = $placeholderable.placeholder($input, inputCodec);
    if (inputCodec.arrayOfCodec === TYPES.citext) return sqlList;else return sql`(select lower(t) from unnest(${sqlList}) t)`;
  } else {
    const sqlValue = $placeholderable.placeholder($input, inputCodec);
    if (inputCodec === TYPES.citext) return sqlValue;else return sql`lower(${sqlValue})`;
  }
}
function resolveInputCodec10(inputCodec) {
  if ("distinctFrom" === "in" || "distinctFrom" === "notIn") {
    const t = resolveDomains2(inputCodec) === TYPES.citext ? inputCodec : TYPES.text;
    return listOfCodec(t, {
      extensions: {
        listItemNonNull: !0
      }
    });
  } else return resolveDomains2(inputCodec) === TYPES.citext ? inputCodec : TYPES.text;
}
function resolveSqlIdentifier6(sourceAlias, codec) {
  return resolveDomains2(codec) === TYPES.citext ? [sourceAlias, codec] : [sql`lower(${sourceAlias}::text)`, TYPES.text];
}
function resolveSqlValue5($placeholderable, $input, inputCodec) {
  if ("distinctFrom" === "in" || "distinctFrom" === "notIn") {
    const sqlList = $placeholderable.placeholder($input, inputCodec);
    if (inputCodec.arrayOfCodec === TYPES.citext) return sqlList;else return sql`(select lower(t) from unnest(${sqlList}) t)`;
  } else {
    const sqlValue = $placeholderable.placeholder($input, inputCodec);
    if (inputCodec === TYPES.citext) return sqlValue;else return sql`lower(${sqlValue})`;
  }
}
function resolveInputCodec11(inputCodec) {
  if ("notDistinctFrom" === "in" || "notDistinctFrom" === "notIn") {
    const t = resolveDomains2(inputCodec) === TYPES.citext ? inputCodec : TYPES.text;
    return listOfCodec(t, {
      extensions: {
        listItemNonNull: !0
      }
    });
  } else return resolveDomains2(inputCodec) === TYPES.citext ? inputCodec : TYPES.text;
}
function resolveSqlIdentifier7(sourceAlias, codec) {
  return resolveDomains2(codec) === TYPES.citext ? [sourceAlias, codec] : [sql`lower(${sourceAlias}::text)`, TYPES.text];
}
function resolveSqlValue6($placeholderable, $input, inputCodec) {
  if ("notDistinctFrom" === "in" || "notDistinctFrom" === "notIn") {
    const sqlList = $placeholderable.placeholder($input, inputCodec);
    if (inputCodec.arrayOfCodec === TYPES.citext) return sqlList;else return sql`(select lower(t) from unnest(${sqlList}) t)`;
  } else {
    const sqlValue = $placeholderable.placeholder($input, inputCodec);
    if (inputCodec === TYPES.citext) return sqlValue;else return sql`lower(${sqlValue})`;
  }
}
function resolveInputCodec12(inputCodec) {
  if ("in" === "in" || "in" === "notIn") {
    const t = resolveDomains2(inputCodec) === TYPES.citext ? inputCodec : TYPES.text;
    return listOfCodec(t, {
      extensions: {
        listItemNonNull: !0
      }
    });
  } else return resolveDomains2(inputCodec) === TYPES.citext ? inputCodec : TYPES.text;
}
function resolveSqlIdentifier8(sourceAlias, codec) {
  return resolveDomains2(codec) === TYPES.citext ? [sourceAlias, codec] : [sql`lower(${sourceAlias}::text)`, TYPES.text];
}
function resolveSqlValue7($placeholderable, $input, inputCodec) {
  if ("in" === "in" || "in" === "notIn") {
    const sqlList = $placeholderable.placeholder($input, inputCodec);
    if (inputCodec.arrayOfCodec === TYPES.citext) return sqlList;else return sql`(select lower(t) from unnest(${sqlList}) t)`;
  } else {
    const sqlValue = $placeholderable.placeholder($input, inputCodec);
    if (inputCodec === TYPES.citext) return sqlValue;else return sql`lower(${sqlValue})`;
  }
}
function resolveInputCodec13(inputCodec) {
  if ("notIn" === "in" || "notIn" === "notIn") {
    const t = resolveDomains2(inputCodec) === TYPES.citext ? inputCodec : TYPES.text;
    return listOfCodec(t, {
      extensions: {
        listItemNonNull: !0
      }
    });
  } else return resolveDomains2(inputCodec) === TYPES.citext ? inputCodec : TYPES.text;
}
function resolveSqlIdentifier9(sourceAlias, codec) {
  return resolveDomains2(codec) === TYPES.citext ? [sourceAlias, codec] : [sql`lower(${sourceAlias}::text)`, TYPES.text];
}
function resolveSqlValue8($placeholderable, $input, inputCodec) {
  if ("notIn" === "in" || "notIn" === "notIn") {
    const sqlList = $placeholderable.placeholder($input, inputCodec);
    if (inputCodec.arrayOfCodec === TYPES.citext) return sqlList;else return sql`(select lower(t) from unnest(${sqlList}) t)`;
  } else {
    const sqlValue = $placeholderable.placeholder($input, inputCodec);
    if (inputCodec === TYPES.citext) return sqlValue;else return sql`lower(${sqlValue})`;
  }
}
function resolveInputCodec14(inputCodec) {
  if ("lessThan" === "in" || "lessThan" === "notIn") {
    const t = resolveDomains2(inputCodec) === TYPES.citext ? inputCodec : TYPES.text;
    return listOfCodec(t, {
      extensions: {
        listItemNonNull: !0
      }
    });
  } else return resolveDomains2(inputCodec) === TYPES.citext ? inputCodec : TYPES.text;
}
function resolveSqlIdentifier10(sourceAlias, codec) {
  return resolveDomains2(codec) === TYPES.citext ? [sourceAlias, codec] : [sql`lower(${sourceAlias}::text)`, TYPES.text];
}
function resolveSqlValue9($placeholderable, $input, inputCodec) {
  if ("lessThan" === "in" || "lessThan" === "notIn") {
    const sqlList = $placeholderable.placeholder($input, inputCodec);
    if (inputCodec.arrayOfCodec === TYPES.citext) return sqlList;else return sql`(select lower(t) from unnest(${sqlList}) t)`;
  } else {
    const sqlValue = $placeholderable.placeholder($input, inputCodec);
    if (inputCodec === TYPES.citext) return sqlValue;else return sql`lower(${sqlValue})`;
  }
}
function resolveInputCodec15(inputCodec) {
  if ("lessThanOrEqualTo" === "in" || "lessThanOrEqualTo" === "notIn") {
    const t = resolveDomains2(inputCodec) === TYPES.citext ? inputCodec : TYPES.text;
    return listOfCodec(t, {
      extensions: {
        listItemNonNull: !0
      }
    });
  } else return resolveDomains2(inputCodec) === TYPES.citext ? inputCodec : TYPES.text;
}
function resolveSqlIdentifier11(sourceAlias, codec) {
  return resolveDomains2(codec) === TYPES.citext ? [sourceAlias, codec] : [sql`lower(${sourceAlias}::text)`, TYPES.text];
}
function resolveSqlValue10($placeholderable, $input, inputCodec) {
  if ("lessThanOrEqualTo" === "in" || "lessThanOrEqualTo" === "notIn") {
    const sqlList = $placeholderable.placeholder($input, inputCodec);
    if (inputCodec.arrayOfCodec === TYPES.citext) return sqlList;else return sql`(select lower(t) from unnest(${sqlList}) t)`;
  } else {
    const sqlValue = $placeholderable.placeholder($input, inputCodec);
    if (inputCodec === TYPES.citext) return sqlValue;else return sql`lower(${sqlValue})`;
  }
}
function resolveInputCodec16(inputCodec) {
  if ("greaterThan" === "in" || "greaterThan" === "notIn") {
    const t = resolveDomains2(inputCodec) === TYPES.citext ? inputCodec : TYPES.text;
    return listOfCodec(t, {
      extensions: {
        listItemNonNull: !0
      }
    });
  } else return resolveDomains2(inputCodec) === TYPES.citext ? inputCodec : TYPES.text;
}
function resolveSqlIdentifier12(sourceAlias, codec) {
  return resolveDomains2(codec) === TYPES.citext ? [sourceAlias, codec] : [sql`lower(${sourceAlias}::text)`, TYPES.text];
}
function resolveSqlValue11($placeholderable, $input, inputCodec) {
  if ("greaterThan" === "in" || "greaterThan" === "notIn") {
    const sqlList = $placeholderable.placeholder($input, inputCodec);
    if (inputCodec.arrayOfCodec === TYPES.citext) return sqlList;else return sql`(select lower(t) from unnest(${sqlList}) t)`;
  } else {
    const sqlValue = $placeholderable.placeholder($input, inputCodec);
    if (inputCodec === TYPES.citext) return sqlValue;else return sql`lower(${sqlValue})`;
  }
}
function resolveInputCodec17(inputCodec) {
  if ("greaterThanOrEqualTo" === "in" || "greaterThanOrEqualTo" === "notIn") {
    const t = resolveDomains2(inputCodec) === TYPES.citext ? inputCodec : TYPES.text;
    return listOfCodec(t, {
      extensions: {
        listItemNonNull: !0
      }
    });
  } else return resolveDomains2(inputCodec) === TYPES.citext ? inputCodec : TYPES.text;
}
function resolveSqlIdentifier13(sourceAlias, codec) {
  return resolveDomains2(codec) === TYPES.citext ? [sourceAlias, codec] : [sql`lower(${sourceAlias}::text)`, TYPES.text];
}
function resolveSqlValue12($placeholderable, $input, inputCodec) {
  if ("greaterThanOrEqualTo" === "in" || "greaterThanOrEqualTo" === "notIn") {
    const sqlList = $placeholderable.placeholder($input, inputCodec);
    if (inputCodec.arrayOfCodec === TYPES.citext) return sqlList;else return sql`(select lower(t) from unnest(${sqlList}) t)`;
  } else {
    const sqlValue = $placeholderable.placeholder($input, inputCodec);
    if (inputCodec === TYPES.citext) return sqlValue;else return sql`lower(${sqlValue})`;
  }
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
const PgAggregateConditionExpressionStep = class PgAggregateConditionExpressionStep extends ModifierStep {
  constructor($parent, spec, pgWhereConditionSpecListToSQL) {
    super($parent);
    this.spec = spec;
    this.pgWhereConditionSpecListToSQL = pgWhereConditionSpecListToSQL;
    this.conditions = [];
    this.alias = $parent.alias;
  }
  placeholder($step, codec) {
    return this.$parent.placeholder($step, codec);
  }
  where(condition) {
    this.conditions.push(condition);
  }
  apply() {
    const sqlCondition = this.pgWhereConditionSpecListToSQL(this.alias, this.conditions);
    if (sqlCondition) this.$parent.expression(sqlCondition);
  }
};
const PgAggregateConditionStep = class PgAggregateConditionStep extends ModifierStep {
  constructor($parent, options, pgWhereConditionSpecListToSQL) {
    super($parent);
    this.pgWhereConditionSpecListToSQL = pgWhereConditionSpecListToSQL;
    this.conditions = [];
    this.expressions = [];
    const {
      sql,
      tableExpression,
      alias
    } = options;
    this.sql = sql;
    this.alias = sql.identifier(Symbol(alias !== null && alias !== void 0 ? alias : "aggregate"));
    this.tableExpression = tableExpression;
  }
  placeholder($step, codec) {
    return this.$parent.placeholder($step, codec);
  }
  where(condition) {
    this.conditions.push(condition);
  }
  expression(expression) {
    this.expressions.push(expression);
  }
  forAggregate(spec) {
    return new PgAggregateConditionExpressionStep(this, spec, this.pgWhereConditionSpecListToSQL);
  }
  apply() {
    const {
        sql
      } = this,
      sqlCondition = this.pgWhereConditionSpecListToSQL(this.alias, this.conditions),
      where = sqlCondition ? sql`where ${sqlCondition}` : sql.blank,
      boolExpr = this.expressions.length === 0 ? sql.true : sql.parens(sql.join(this.expressions.map(expr => sql.parens(expr)), `
and
`)),
      subquery = sql`(${sql.indent`\
select ${boolExpr}
from ${this.tableExpression} as ${this.alias}
${where}`}
group by ())`;
    return this.$parent.where(subquery);
  }
};
const colSpec8 = {
  fieldName: "rowId",
  attributeName: "id",
  attribute: spec_upvote.attributes.id
};
const colSpec9 = {
  fieldName: "postId",
  attributeName: "post_id",
  attribute: spec_upvote.attributes.post_id
};
const colSpec10 = {
  fieldName: "userId",
  attributeName: "user_id",
  attribute: spec_upvote.attributes.user_id
};
const colSpec11 = {
  fieldName: "createdAt",
  attributeName: "created_at",
  attribute: spec_upvote.attributes.created_at
};
const colSpec12 = {
  fieldName: "updatedAt",
  attributeName: "updated_at",
  attribute: spec_upvote.attributes.updated_at
};
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
const colSpec13 = {
  fieldName: "rowId",
  attributeName: "id",
  attribute: spec_user.attributes.id
};
const colSpec14 = {
  fieldName: "createdAt",
  attributeName: "created_at",
  attribute: spec_user.attributes.created_at
};
const colSpec15 = {
  fieldName: "updatedAt",
  attributeName: "updated_at",
  attribute: spec_user.attributes.updated_at
};
const colSpec16 = {
  fieldName: "hidraId",
  attributeName: "hidra_id",
  attribute: spec_user.attributes.hidra_id
};
const colSpec17 = {
  fieldName: "username",
  attributeName: "username",
  attribute: spec_user.attributes.username
};
const colSpec18 = {
  fieldName: "firstName",
  attributeName: "first_name",
  attribute: spec_user.attributes.first_name
};
const colSpec19 = {
  fieldName: "lastName",
  attributeName: "last_name",
  attribute: spec_user.attributes.last_name
};
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
const resolve50 = (i, _v, $input) => sql`${i} ${$input.eval() ? sql`IS NULL` : sql`IS NOT NULL`}`;
const resolveInputCodec21 = () => TYPES.boolean;
const resolveSqlValue14 = () => sql.null;
const resolve51 = (i, v) => sql`${i} = ${v}`;
const forceTextTypesSensitive4 = [TYPES.citext, TYPES.char, TYPES.bpchar];
function resolveDomains4(c) {
  let current = c;
  while (current.domainOfCodec) current = current.domainOfCodec;
  return current;
}
function resolveInputCodec22(c) {
  if (c.arrayOfCodec) {
    if (forceTextTypesSensitive4.includes(resolveDomains4(c.arrayOfCodec))) return listOfCodec(TYPES.text, {
      extensions: {
        listItemNonNull: c.extensions?.listItemNonNull
      }
    });
    return c;
  } else {
    if (forceTextTypesSensitive4.includes(resolveDomains4(c))) return TYPES.text;
    return c;
  }
}
function resolveSqlIdentifier15(identifier, c) {
  if (c.arrayOfCodec && forceTextTypesSensitive4.includes(resolveDomains4(c.arrayOfCodec))) return [sql`(${identifier})::text[]`, listOfCodec(TYPES.text, {
    extensions: {
      listItemNonNull: c.extensions?.listItemNonNull
    }
  })];else if (forceTextTypesSensitive4.includes(resolveDomains4(c))) return [sql`(${identifier})::text`, TYPES.text];else return [identifier, c];
}
const resolve52 = (i, v) => sql`${i} <> ${v}`;
const resolve53 = (i, v) => sql`${i} IS DISTINCT FROM ${v}`;
const resolve54 = (i, v) => sql`${i} IS NOT DISTINCT FROM ${v}`;
const resolve55 = (i, v) => sql`${i} = ANY(${v})`;
function resolveInputCodec23(c) {
  if (forceTextTypesSensitive4.includes(resolveDomains4(c))) return listOfCodec(TYPES.text, {
    extensions: {
      listItemNonNull: !0
    }
  });else return listOfCodec(c, {
    extensions: {
      listItemNonNull: !0
    }
  });
}
const resolve56 = (i, v) => sql`${i} <> ALL(${v})`;
const resolve57 = (i, v) => sql`${i} < ${v}`;
const resolve58 = (i, v) => sql`${i} <= ${v}`;
const resolve59 = (i, v) => sql`${i} > ${v}`;
const resolve60 = (i, v) => sql`${i} >= ${v}`;
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
const colSpec20 = {
  fieldName: "userId",
  attributeName: "user_id",
  attribute: spec_userOrganization.attributes.user_id
};
const colSpec21 = {
  fieldName: "organizationId",
  attributeName: "organization_id",
  attribute: spec_userOrganization.attributes.organization_id
};
const colSpec22 = {
  fieldName: "createdAt",
  attributeName: "created_at",
  attribute: spec_userOrganization.attributes.created_at
};
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
const colSpec23 = {
  fieldName: "rowId",
  attributeName: "id",
  attribute: spec_organization.attributes.id
};
const colSpec24 = {
  fieldName: "name",
  attributeName: "name",
  attribute: spec_organization.attributes.name
};
const colSpec25 = {
  fieldName: "slug",
  attributeName: "slug",
  attribute: spec_organization.attributes.slug
};
const colSpec26 = {
  fieldName: "createdAt",
  attributeName: "created_at",
  attribute: spec_organization.attributes.created_at
};
const colSpec27 = {
  fieldName: "updatedAt",
  attributeName: "updated_at",
  attribute: spec_organization.attributes.updated_at
};
function assertAllowed30(fieldArgs, mode) {
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
function assertAllowed31(fieldArgs, mode) {
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
function assertAllowed32(fieldArgs, mode) {
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
const colSpec28 = {
  fieldName: "rowId",
  attributeName: "id",
  attribute: spec_project.attributes.id
};
const colSpec29 = {
  fieldName: "name",
  attributeName: "name",
  attribute: spec_project.attributes.name
};
const colSpec30 = {
  fieldName: "image",
  attributeName: "image",
  attribute: spec_project.attributes.image
};
const colSpec31 = {
  fieldName: "slug",
  attributeName: "slug",
  attribute: spec_project.attributes.slug
};
const colSpec32 = {
  fieldName: "description",
  attributeName: "description",
  attribute: spec_project.attributes.description
};
const colSpec33 = {
  fieldName: "organizationId",
  attributeName: "organization_id",
  attribute: spec_project.attributes.organization_id
};
const colSpec34 = {
  fieldName: "createdAt",
  attributeName: "created_at",
  attribute: spec_project.attributes.created_at
};
const colSpec35 = {
  fieldName: "updatedAt",
  attributeName: "updated_at",
  attribute: spec_project.attributes.updated_at
};
function assertAllowed33(fieldArgs, mode) {
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
function assertAllowed34(fieldArgs, mode) {
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
function assertAllowed35(fieldArgs, mode) {
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
function assertAllowed36(fieldArgs, mode) {
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
function assertAllowed37(fieldArgs, mode) {
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
function assertAllowed38(fieldArgs, mode) {
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
const colSpec36 = {
  fieldName: "rowId",
  attributeName: "id",
  attribute: spec_comment.attributes.id
};
const colSpec37 = {
  fieldName: "message",
  attributeName: "message",
  attribute: spec_comment.attributes.message
};
const colSpec38 = {
  fieldName: "postId",
  attributeName: "post_id",
  attribute: spec_comment.attributes.post_id
};
const colSpec39 = {
  fieldName: "userId",
  attributeName: "user_id",
  attribute: spec_comment.attributes.user_id
};
const colSpec40 = {
  fieldName: "createdAt",
  attributeName: "created_at",
  attribute: spec_comment.attributes.created_at
};
const colSpec41 = {
  fieldName: "updatedAt",
  attributeName: "updated_at",
  attribute: spec_comment.attributes.updated_at
};
function assertAllowed39(fieldArgs, mode) {
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
function assertAllowed40(fieldArgs, mode) {
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
function assertAllowed41(fieldArgs, mode) {
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
function UpvoteGroupBy_extensions_grafast_applyPlan($pgSelect) {
  $pgSelect.groupBy({
    fragment: sql.fragment`${$pgSelect.alias}.${sql.identifier("post_id")}`
  });
}
function UpvoteGroupBy_extensions_grafast_applyPlan2($pgSelect) {
  $pgSelect.groupBy({
    fragment: sql.fragment`${$pgSelect.alias}.${sql.identifier("user_id")}`
  });
}
function UpvoteGroupBy_extensions_grafast_applyPlan3($pgSelect) {
  $pgSelect.groupBy({
    fragment: sql.fragment`${$pgSelect.alias}.${sql.identifier("created_at")}`
  });
}
function UpvoteGroupBy_extensions_grafast_applyPlan4($pgSelect) {
  $pgSelect.groupBy({
    fragment: aggregateGroupBySpec.sqlWrap(sql`${$pgSelect.alias}.${sql.identifier("created_at")}`)
  });
}
function UpvoteGroupBy_extensions_grafast_applyPlan5($pgSelect) {
  $pgSelect.groupBy({
    fragment: aggregateGroupBySpec2.sqlWrap(sql`${$pgSelect.alias}.${sql.identifier("created_at")}`)
  });
}
function UpvoteGroupBy_extensions_grafast_applyPlan6($pgSelect) {
  $pgSelect.groupBy({
    fragment: sql.fragment`${$pgSelect.alias}.${sql.identifier("updated_at")}`
  });
}
function UpvoteGroupBy_extensions_grafast_applyPlan7($pgSelect) {
  $pgSelect.groupBy({
    fragment: aggregateGroupBySpec.sqlWrap(sql`${$pgSelect.alias}.${sql.identifier("updated_at")}`)
  });
}
function UpvoteGroupBy_extensions_grafast_applyPlan8($pgSelect) {
  $pgSelect.groupBy({
    fragment: aggregateGroupBySpec2.sqlWrap(sql`${$pgSelect.alias}.${sql.identifier("updated_at")}`)
  });
}
export const UpvoteGroupBy = new GraphQLEnumType({
  name: "UpvoteGroupBy",
  description: "Grouping methods for `Upvote` for usage during aggregation.",
  values: Object.assign(Object.create(null), {
    POST_ID: {
      value: "POST_ID",
      extensions: Object.assign(Object.create(null), {
        grafast: {
          applyPlan: UpvoteGroupBy_extensions_grafast_applyPlan
        }
      })
    },
    USER_ID: {
      value: "USER_ID",
      extensions: Object.assign(Object.create(null), {
        grafast: {
          applyPlan: UpvoteGroupBy_extensions_grafast_applyPlan2
        }
      })
    },
    CREATED_AT: {
      value: "CREATED_AT",
      extensions: Object.assign(Object.create(null), {
        grafast: {
          applyPlan: UpvoteGroupBy_extensions_grafast_applyPlan3
        }
      })
    },
    CREATED_AT_TRUNCATED_TO_HOUR: {
      value: "CREATED_AT_TRUNCATED_TO_HOUR",
      extensions: Object.assign(Object.create(null), {
        grafast: {
          applyPlan: UpvoteGroupBy_extensions_grafast_applyPlan4
        }
      })
    },
    CREATED_AT_TRUNCATED_TO_DAY: {
      value: "CREATED_AT_TRUNCATED_TO_DAY",
      extensions: Object.assign(Object.create(null), {
        grafast: {
          applyPlan: UpvoteGroupBy_extensions_grafast_applyPlan5
        }
      })
    },
    UPDATED_AT: {
      value: "UPDATED_AT",
      extensions: Object.assign(Object.create(null), {
        grafast: {
          applyPlan: UpvoteGroupBy_extensions_grafast_applyPlan6
        }
      })
    },
    UPDATED_AT_TRUNCATED_TO_HOUR: {
      value: "UPDATED_AT_TRUNCATED_TO_HOUR",
      extensions: Object.assign(Object.create(null), {
        grafast: {
          applyPlan: UpvoteGroupBy_extensions_grafast_applyPlan7
        }
      })
    },
    UPDATED_AT_TRUNCATED_TO_DAY: {
      value: "UPDATED_AT_TRUNCATED_TO_DAY",
      extensions: Object.assign(Object.create(null), {
        grafast: {
          applyPlan: UpvoteGroupBy_extensions_grafast_applyPlan8
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
const aggregateSpec_isSuitableType = codec => isIntervalLike(codec) || isNumberLike(codec);
const dataTypeToAggregateTypeMap2 = {
  "20": TYPES.numeric,
  "21": TYPES.bigint,
  "23": TYPES.bigint,
  "700": TYPES.float4,
  "701": TYPES.float,
  "790": TYPES.money,
  "1186": TYPES.interval
};
const aggregateSpec2 = {
  id: "sum",
  humanLabel: "sum",
  HumanLabel: "Sum",
  isSuitableType: aggregateSpec_isSuitableType,
  sqlAggregateWrap(sqlFrag) {
    return sql`coalesce(sum(${sqlFrag}), '0')`;
  },
  isNonNull: true,
  pgTypeCodecModifier(codec) {
    var _a, _b;
    const oid = (_a = codec.extensions) === null || _a === void 0 ? void 0 : _a.oid;
    return (_b = oid ? dataTypeToAggregateTypeMap2[oid] : null) !== null && _b !== void 0 ? _b : TYPES.numeric;
  }
};
const infix = () => sql.fragment`=`;
const infix2 = () => sql.fragment`<>`;
const infix3 = () => sql.fragment`>`;
const infix4 = () => sql.fragment`>=`;
const infix5 = () => sql.fragment`<`;
const infix6 = () => sql.fragment`<=`;
const aggregateSpec3 = {
  id: "min",
  humanLabel: "minimum",
  HumanLabel: "Minimum",
  isSuitableType: aggregateSpec_isSuitableType,
  sqlAggregateWrap(sqlFrag) {
    return sql`min(${sqlFrag})`;
  }
};
const aggregateSpec4 = {
  id: "max",
  humanLabel: "maximum",
  HumanLabel: "Maximum",
  isSuitableType: aggregateSpec_isSuitableType,
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
const aggregateSpec5 = {
  id: "average",
  humanLabel: "mean average",
  HumanLabel: "Mean average",
  isSuitableType: aggregateSpec_isSuitableType,
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
const aggregateSpec6 = {
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
const aggregateSpec7 = {
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
const aggregateSpec8 = {
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
const aggregateSpec9 = {
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
function UserOrganizationGroupBy_extensions_grafast_applyPlan($pgSelect) {
  $pgSelect.groupBy({
    fragment: sql.fragment`${$pgSelect.alias}.${sql.identifier("user_id")}`
  });
}
function UserOrganizationGroupBy_extensions_grafast_applyPlan2($pgSelect) {
  $pgSelect.groupBy({
    fragment: sql.fragment`${$pgSelect.alias}.${sql.identifier("organization_id")}`
  });
}
function UserOrganizationGroupBy_extensions_grafast_applyPlan3($pgSelect) {
  $pgSelect.groupBy({
    fragment: sql.fragment`${$pgSelect.alias}.${sql.identifier("created_at")}`
  });
}
function UserOrganizationGroupBy_extensions_grafast_applyPlan4($pgSelect) {
  $pgSelect.groupBy({
    fragment: aggregateGroupBySpec.sqlWrap(sql`${$pgSelect.alias}.${sql.identifier("created_at")}`)
  });
}
function UserOrganizationGroupBy_extensions_grafast_applyPlan5($pgSelect) {
  $pgSelect.groupBy({
    fragment: aggregateGroupBySpec2.sqlWrap(sql`${$pgSelect.alias}.${sql.identifier("created_at")}`)
  });
}
export const UserOrganizationGroupBy = new GraphQLEnumType({
  name: "UserOrganizationGroupBy",
  description: "Grouping methods for `UserOrganization` for usage during aggregation.",
  values: Object.assign(Object.create(null), {
    USER_ID: {
      value: "USER_ID",
      extensions: Object.assign(Object.create(null), {
        grafast: {
          applyPlan: UserOrganizationGroupBy_extensions_grafast_applyPlan
        }
      })
    },
    ORGANIZATION_ID: {
      value: "ORGANIZATION_ID",
      extensions: Object.assign(Object.create(null), {
        grafast: {
          applyPlan: UserOrganizationGroupBy_extensions_grafast_applyPlan2
        }
      })
    },
    CREATED_AT: {
      value: "CREATED_AT",
      extensions: Object.assign(Object.create(null), {
        grafast: {
          applyPlan: UserOrganizationGroupBy_extensions_grafast_applyPlan3
        }
      })
    },
    CREATED_AT_TRUNCATED_TO_HOUR: {
      value: "CREATED_AT_TRUNCATED_TO_HOUR",
      extensions: Object.assign(Object.create(null), {
        grafast: {
          applyPlan: UserOrganizationGroupBy_extensions_grafast_applyPlan4
        }
      })
    },
    CREATED_AT_TRUNCATED_TO_DAY: {
      value: "CREATED_AT_TRUNCATED_TO_DAY",
      extensions: Object.assign(Object.create(null), {
        grafast: {
          applyPlan: UserOrganizationGroupBy_extensions_grafast_applyPlan5
        }
      })
    }
  })
});
function CommentGroupBy_extensions_grafast_applyPlan($pgSelect) {
  $pgSelect.groupBy({
    fragment: sql.fragment`${$pgSelect.alias}.${sql.identifier("message")}`
  });
}
function CommentGroupBy_extensions_grafast_applyPlan2($pgSelect) {
  $pgSelect.groupBy({
    fragment: sql.fragment`${$pgSelect.alias}.${sql.identifier("post_id")}`
  });
}
function CommentGroupBy_extensions_grafast_applyPlan3($pgSelect) {
  $pgSelect.groupBy({
    fragment: sql.fragment`${$pgSelect.alias}.${sql.identifier("user_id")}`
  });
}
function CommentGroupBy_extensions_grafast_applyPlan4($pgSelect) {
  $pgSelect.groupBy({
    fragment: sql.fragment`${$pgSelect.alias}.${sql.identifier("created_at")}`
  });
}
function CommentGroupBy_extensions_grafast_applyPlan5($pgSelect) {
  $pgSelect.groupBy({
    fragment: aggregateGroupBySpec.sqlWrap(sql`${$pgSelect.alias}.${sql.identifier("created_at")}`)
  });
}
function CommentGroupBy_extensions_grafast_applyPlan6($pgSelect) {
  $pgSelect.groupBy({
    fragment: aggregateGroupBySpec2.sqlWrap(sql`${$pgSelect.alias}.${sql.identifier("created_at")}`)
  });
}
function CommentGroupBy_extensions_grafast_applyPlan7($pgSelect) {
  $pgSelect.groupBy({
    fragment: sql.fragment`${$pgSelect.alias}.${sql.identifier("updated_at")}`
  });
}
function CommentGroupBy_extensions_grafast_applyPlan8($pgSelect) {
  $pgSelect.groupBy({
    fragment: aggregateGroupBySpec.sqlWrap(sql`${$pgSelect.alias}.${sql.identifier("updated_at")}`)
  });
}
function CommentGroupBy_extensions_grafast_applyPlan9($pgSelect) {
  $pgSelect.groupBy({
    fragment: aggregateGroupBySpec2.sqlWrap(sql`${$pgSelect.alias}.${sql.identifier("updated_at")}`)
  });
}
export const CommentGroupBy = new GraphQLEnumType({
  name: "CommentGroupBy",
  description: "Grouping methods for `Comment` for usage during aggregation.",
  values: Object.assign(Object.create(null), {
    MESSAGE: {
      value: "MESSAGE",
      extensions: Object.assign(Object.create(null), {
        grafast: {
          applyPlan: CommentGroupBy_extensions_grafast_applyPlan
        }
      })
    },
    POST_ID: {
      value: "POST_ID",
      extensions: Object.assign(Object.create(null), {
        grafast: {
          applyPlan: CommentGroupBy_extensions_grafast_applyPlan2
        }
      })
    },
    USER_ID: {
      value: "USER_ID",
      extensions: Object.assign(Object.create(null), {
        grafast: {
          applyPlan: CommentGroupBy_extensions_grafast_applyPlan3
        }
      })
    },
    CREATED_AT: {
      value: "CREATED_AT",
      extensions: Object.assign(Object.create(null), {
        grafast: {
          applyPlan: CommentGroupBy_extensions_grafast_applyPlan4
        }
      })
    },
    CREATED_AT_TRUNCATED_TO_HOUR: {
      value: "CREATED_AT_TRUNCATED_TO_HOUR",
      extensions: Object.assign(Object.create(null), {
        grafast: {
          applyPlan: CommentGroupBy_extensions_grafast_applyPlan5
        }
      })
    },
    CREATED_AT_TRUNCATED_TO_DAY: {
      value: "CREATED_AT_TRUNCATED_TO_DAY",
      extensions: Object.assign(Object.create(null), {
        grafast: {
          applyPlan: CommentGroupBy_extensions_grafast_applyPlan6
        }
      })
    },
    UPDATED_AT: {
      value: "UPDATED_AT",
      extensions: Object.assign(Object.create(null), {
        grafast: {
          applyPlan: CommentGroupBy_extensions_grafast_applyPlan7
        }
      })
    },
    UPDATED_AT_TRUNCATED_TO_HOUR: {
      value: "UPDATED_AT_TRUNCATED_TO_HOUR",
      extensions: Object.assign(Object.create(null), {
        grafast: {
          applyPlan: CommentGroupBy_extensions_grafast_applyPlan8
        }
      })
    },
    UPDATED_AT_TRUNCATED_TO_DAY: {
      value: "UPDATED_AT_TRUNCATED_TO_DAY",
      extensions: Object.assign(Object.create(null), {
        grafast: {
          applyPlan: CommentGroupBy_extensions_grafast_applyPlan9
        }
      })
    }
  })
});
const relation3 = registry.pgRelations["project"]["postsByTheirProjectId"];
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
    fragment: sql.fragment`${$pgSelect.alias}.${sql.identifier("updated_at")}`
  });
}
function OrganizationGroupBy_extensions_grafast_applyPlan5($pgSelect) {
  $pgSelect.groupBy({
    fragment: aggregateGroupBySpec.sqlWrap(sql`${$pgSelect.alias}.${sql.identifier("updated_at")}`)
  });
}
function OrganizationGroupBy_extensions_grafast_applyPlan6($pgSelect) {
  $pgSelect.groupBy({
    fragment: aggregateGroupBySpec2.sqlWrap(sql`${$pgSelect.alias}.${sql.identifier("updated_at")}`)
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
    UPDATED_AT: {
      value: "UPDATED_AT",
      extensions: Object.assign(Object.create(null), {
        grafast: {
          applyPlan: OrganizationGroupBy_extensions_grafast_applyPlan4
        }
      })
    },
    UPDATED_AT_TRUNCATED_TO_HOUR: {
      value: "UPDATED_AT_TRUNCATED_TO_HOUR",
      extensions: Object.assign(Object.create(null), {
        grafast: {
          applyPlan: OrganizationGroupBy_extensions_grafast_applyPlan5
        }
      })
    },
    UPDATED_AT_TRUNCATED_TO_DAY: {
      value: "UPDATED_AT_TRUNCATED_TO_DAY",
      extensions: Object.assign(Object.create(null), {
        grafast: {
          applyPlan: OrganizationGroupBy_extensions_grafast_applyPlan6
        }
      })
    }
  })
});
const relation4 = registry.pgRelations["organization"]["projectsByTheirOrganizationId"];
const relation5 = registry.pgRelations["organization"]["userOrganizationsByTheirOrganizationId"];
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
    fragment: sql.fragment`${$pgSelect.alias}.${sql.identifier("updated_at")}`
  });
}
function UserGroupBy_extensions_grafast_applyPlan5($pgSelect) {
  $pgSelect.groupBy({
    fragment: aggregateGroupBySpec.sqlWrap(sql`${$pgSelect.alias}.${sql.identifier("updated_at")}`)
  });
}
function UserGroupBy_extensions_grafast_applyPlan6($pgSelect) {
  $pgSelect.groupBy({
    fragment: aggregateGroupBySpec2.sqlWrap(sql`${$pgSelect.alias}.${sql.identifier("updated_at")}`)
  });
}
function UserGroupBy_extensions_grafast_applyPlan7($pgSelect) {
  $pgSelect.groupBy({
    fragment: sql.fragment`${$pgSelect.alias}.${sql.identifier("first_name")}`
  });
}
function UserGroupBy_extensions_grafast_applyPlan8($pgSelect) {
  $pgSelect.groupBy({
    fragment: sql.fragment`${$pgSelect.alias}.${sql.identifier("last_name")}`
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
    UPDATED_AT: {
      value: "UPDATED_AT",
      extensions: Object.assign(Object.create(null), {
        grafast: {
          applyPlan: UserGroupBy_extensions_grafast_applyPlan4
        }
      })
    },
    UPDATED_AT_TRUNCATED_TO_HOUR: {
      value: "UPDATED_AT_TRUNCATED_TO_HOUR",
      extensions: Object.assign(Object.create(null), {
        grafast: {
          applyPlan: UserGroupBy_extensions_grafast_applyPlan5
        }
      })
    },
    UPDATED_AT_TRUNCATED_TO_DAY: {
      value: "UPDATED_AT_TRUNCATED_TO_DAY",
      extensions: Object.assign(Object.create(null), {
        grafast: {
          applyPlan: UserGroupBy_extensions_grafast_applyPlan6
        }
      })
    },
    FIRST_NAME: {
      value: "FIRST_NAME",
      extensions: Object.assign(Object.create(null), {
        grafast: {
          applyPlan: UserGroupBy_extensions_grafast_applyPlan7
        }
      })
    },
    LAST_NAME: {
      value: "LAST_NAME",
      extensions: Object.assign(Object.create(null), {
        grafast: {
          applyPlan: UserGroupBy_extensions_grafast_applyPlan8
        }
      })
    }
  })
});
const relation6 = registry.pgRelations["user"]["postsByTheirUserId"];
const relation7 = registry.pgRelations["user"]["upvotesByTheirUserId"];
const relation8 = registry.pgRelations["user"]["userOrganizationsByTheirUserId"];
const relation9 = registry.pgRelations["user"]["commentsByTheirUserId"];
const specFromArgs = args => {
  const $nodeId = args.get(["input", "id"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Upvote, $nodeId);
};
const specFromArgs2 = args => {
  const $nodeId = args.get(["input", "id"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Organization, $nodeId);
};
const specFromArgs3 = args => {
  const $nodeId = args.get(["input", "id"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Comment, $nodeId);
};
const specFromArgs4 = args => {
  const $nodeId = args.get(["input", "id"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Post, $nodeId);
};
const specFromArgs5 = args => {
  const $nodeId = args.get(["input", "id"]);
  return specFromNodeId(nodeIdHandlerByTypeName.User, $nodeId);
};
const specFromArgs6 = args => {
  const $nodeId = args.get(["input", "id"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Project, $nodeId);
};
const specFromArgs7 = args => {
  const $nodeId = args.get(["input", "id"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Upvote, $nodeId);
};
const specFromArgs8 = args => {
  const $nodeId = args.get(["input", "id"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Organization, $nodeId);
};
const specFromArgs9 = args => {
  const $nodeId = args.get(["input", "id"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Comment, $nodeId);
};
const specFromArgs10 = args => {
  const $nodeId = args.get(["input", "id"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Post, $nodeId);
};
const specFromArgs11 = args => {
  const $nodeId = args.get(["input", "id"]);
  return specFromNodeId(nodeIdHandlerByTypeName.User, $nodeId);
};
const specFromArgs12 = args => {
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

  """Get a single \`UserOrganization\`."""
  userOrganizationByUserIdAndOrganizationId(userId: UUID!, organizationId: UUID!): UserOrganization

  """Get a single \`Upvote\`."""
  upvote(rowId: UUID!): Upvote

  """Get a single \`Upvote\`."""
  upvoteByPostIdAndUserId(postId: UUID!, userId: UUID!): Upvote

  """Get a single \`Organization\`."""
  organization(rowId: UUID!): Organization

  """Get a single \`Organization\`."""
  organizationByName(name: String!): Organization

  """Get a single \`Organization\`."""
  organizationBySlug(slug: String!): Organization

  """Get a single \`Comment\`."""
  comment(rowId: UUID!): Comment

  """Get a single \`Post\`."""
  post(rowId: UUID!): Post

  """Get a single \`User\`."""
  user(rowId: UUID!): User

  """Get a single \`User\`."""
  userByHidraId(hidraId: UUID!): User

  """Get a single \`User\`."""
  userByUsername(username: String!): User

  """Get a single \`Project\`."""
  project(rowId: UUID!): Project

  """Get a single \`Project\`."""
  projectByName(name: String!): Project

  """Get a single \`Project\`."""
  projectBySlugAndOrganizationId(slug: String!, organizationId: UUID!): Project

  """Reads a single \`Upvote\` using its globally unique \`ID\`."""
  upvoteById(
    """The globally unique \`ID\` to be used in selecting a single \`Upvote\`."""
    id: ID!
  ): Upvote

  """Reads a single \`Organization\` using its globally unique \`ID\`."""
  organizationById(
    """
    The globally unique \`ID\` to be used in selecting a single \`Organization\`.
    """
    id: ID!
  ): Organization

  """Reads a single \`Comment\` using its globally unique \`ID\`."""
  commentById(
    """The globally unique \`ID\` to be used in selecting a single \`Comment\`."""
    id: ID!
  ): Comment

  """Reads a single \`Post\` using its globally unique \`ID\`."""
  postById(
    """The globally unique \`ID\` to be used in selecting a single \`Post\`."""
    id: ID!
  ): Post

  """Reads a single \`User\` using its globally unique \`ID\`."""
  userById(
    """The globally unique \`ID\` to be used in selecting a single \`User\`."""
    id: ID!
  ): User

  """Reads a single \`Project\` using its globally unique \`ID\`."""
  projectById(
    """The globally unique \`ID\` to be used in selecting a single \`Project\`."""
    id: ID!
  ): Project

  """Reads and enables pagination through a set of \`UserOrganization\`."""
  userOrganizations(
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

    """The method to use when ordering \`UserOrganization\`."""
    orderBy: [UserOrganizationOrderBy!] = [NATURAL]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: UserOrganizationCondition

    """
    A filter to be used in determining which values should be returned by the collection.
    """
    filter: UserOrganizationFilter
  ): UserOrganizationConnection

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

  """Reads and enables pagination through a set of \`Comment\`."""
  comments(
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

    """The method to use when ordering \`Comment\`."""
    orderBy: [CommentOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: CommentCondition

    """
    A filter to be used in determining which values should be returned by the collection.
    """
    filter: CommentFilter
  ): CommentConnection

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

type UserOrganization {
  userId: UUID!
  organizationId: UUID!
  createdAt: Datetime

  """
  Reads a single \`Organization\` that is related to this \`UserOrganization\`.
  """
  organization: Organization

  """Reads a single \`User\` that is related to this \`UserOrganization\`."""
  user: User
}

"""
A universally unique identifier as defined by [RFC 4122](https://tools.ietf.org/html/rfc4122).
"""
scalar UUID

"""
A point in time as described by the [ISO
8601](https://en.wikipedia.org/wiki/ISO_8601) and, if it has a timezone, [RFC
3339](https://datatracker.ietf.org/doc/html/rfc3339) standards. Input values
that do not conform to both ISO 8601 and RFC 3339 may be coerced, which may lead
to unexpected results.
"""
scalar Datetime

type Organization implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  id: ID!
  rowId: UUID!
  name: String
  slug: String
  createdAt: Datetime
  updatedAt: Datetime

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
  ): ProjectConnection!

  """Reads and enables pagination through a set of \`UserOrganization\`."""
  userOrganizations(
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

    """The method to use when ordering \`UserOrganization\`."""
    orderBy: [UserOrganizationOrderBy!] = [NATURAL]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: UserOrganizationCondition

    """
    A filter to be used in determining which values should be returned by the collection.
    """
    filter: UserOrganizationFilter
  ): UserOrganizationConnection!
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

type Project implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  id: ID!
  rowId: UUID!
  name: String
  image: String
  slug: String
  description: String
  organizationId: UUID!
  createdAt: Datetime
  updatedAt: Datetime

  """Reads a single \`Organization\` that is related to this \`Project\`."""
  organization: Organization

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
  ): PostConnection!
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

type Post implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  id: ID!
  rowId: UUID!
  title: String
  description: String
  projectId: UUID!
  userId: UUID!
  createdAt: Datetime
  updatedAt: Datetime

  """Reads a single \`Project\` that is related to this \`Post\`."""
  project: Project

  """Reads a single \`User\` that is related to this \`Post\`."""
  user: User

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
  ): UpvoteConnection!

  """Reads and enables pagination through a set of \`Comment\`."""
  comments(
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

    """The method to use when ordering \`Comment\`."""
    orderBy: [CommentOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: CommentCondition

    """
    A filter to be used in determining which values should be returned by the collection.
    """
    filter: CommentFilter
  ): CommentConnection!
}

type User implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  id: ID!
  rowId: UUID!
  createdAt: Datetime
  updatedAt: Datetime
  hidraId: UUID!
  username: String
  firstName: String
  lastName: String

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
  ): PostConnection!

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
  ): UpvoteConnection!

  """Reads and enables pagination through a set of \`UserOrganization\`."""
  userOrganizations(
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

    """The method to use when ordering \`UserOrganization\`."""
    orderBy: [UserOrganizationOrderBy!] = [NATURAL]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: UserOrganizationCondition

    """
    A filter to be used in determining which values should be returned by the collection.
    """
    filter: UserOrganizationFilter
  ): UserOrganizationConnection!

  """Reads and enables pagination through a set of \`Comment\`."""
  comments(
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

    """The method to use when ordering \`Comment\`."""
    orderBy: [CommentOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: CommentCondition

    """
    A filter to be used in determining which values should be returned by the collection.
    """
    filter: CommentFilter
  ): CommentConnection!
}

"""A location in a connection that can be used for resuming pagination."""
scalar Cursor

"""Methods to use when ordering \`Post\`."""
enum PostOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ROW_ID_ASC
  ROW_ID_DESC
  TITLE_ASC
  TITLE_DESC
  DESCRIPTION_ASC
  DESCRIPTION_DESC
  PROJECT_ID_ASC
  PROJECT_ID_DESC
  USER_ID_ASC
  USER_ID_DESC
  CREATED_AT_ASC
  CREATED_AT_DESC
  UPDATED_AT_ASC
  UPDATED_AT_DESC
  UPVOTES_COUNT_ASC
  UPVOTES_COUNT_DESC
  UPVOTES_DISTINCT_COUNT_ROW_ID_ASC
  UPVOTES_DISTINCT_COUNT_ROW_ID_DESC
  UPVOTES_DISTINCT_COUNT_POST_ID_ASC
  UPVOTES_DISTINCT_COUNT_POST_ID_DESC
  UPVOTES_DISTINCT_COUNT_USER_ID_ASC
  UPVOTES_DISTINCT_COUNT_USER_ID_DESC
  UPVOTES_DISTINCT_COUNT_CREATED_AT_ASC
  UPVOTES_DISTINCT_COUNT_CREATED_AT_DESC
  UPVOTES_DISTINCT_COUNT_UPDATED_AT_ASC
  UPVOTES_DISTINCT_COUNT_UPDATED_AT_DESC
  COMMENTS_COUNT_ASC
  COMMENTS_COUNT_DESC
  COMMENTS_DISTINCT_COUNT_ROW_ID_ASC
  COMMENTS_DISTINCT_COUNT_ROW_ID_DESC
  COMMENTS_DISTINCT_COUNT_MESSAGE_ASC
  COMMENTS_DISTINCT_COUNT_MESSAGE_DESC
  COMMENTS_DISTINCT_COUNT_POST_ID_ASC
  COMMENTS_DISTINCT_COUNT_POST_ID_DESC
  COMMENTS_DISTINCT_COUNT_USER_ID_ASC
  COMMENTS_DISTINCT_COUNT_USER_ID_DESC
  COMMENTS_DISTINCT_COUNT_CREATED_AT_ASC
  COMMENTS_DISTINCT_COUNT_CREATED_AT_DESC
  COMMENTS_DISTINCT_COUNT_UPDATED_AT_ASC
  COMMENTS_DISTINCT_COUNT_UPDATED_AT_DESC
}

"""
A condition to be used against \`Post\` object types. All fields are tested for equality and combined with a logical ‘and.’
"""
input PostCondition {
  """Checks for equality with the object’s \`rowId\` field."""
  rowId: UUID

  """Checks for equality with the object’s \`title\` field."""
  title: String

  """Checks for equality with the object’s \`description\` field."""
  description: String

  """Checks for equality with the object’s \`projectId\` field."""
  projectId: UUID

  """Checks for equality with the object’s \`userId\` field."""
  userId: UUID

  """Checks for equality with the object’s \`createdAt\` field."""
  createdAt: Datetime

  """Checks for equality with the object’s \`updatedAt\` field."""
  updatedAt: Datetime
}

"""
A filter to be used against \`Post\` object types. All fields are combined with a logical ‘and.’
"""
input PostFilter {
  """Filter by the object’s \`rowId\` field."""
  rowId: UUIDFilter

  """Filter by the object’s \`title\` field."""
  title: StringFilter

  """Filter by the object’s \`description\` field."""
  description: StringFilter

  """Filter by the object’s \`projectId\` field."""
  projectId: UUIDFilter

  """Filter by the object’s \`userId\` field."""
  userId: UUIDFilter

  """Filter by the object’s \`createdAt\` field."""
  createdAt: DatetimeFilter

  """Filter by the object’s \`updatedAt\` field."""
  updatedAt: DatetimeFilter

  """Filter by the object’s \`upvotes\` relation."""
  upvotes: PostToManyUpvoteFilter

  """Some related \`upvotes\` exist."""
  upvotesExist: Boolean

  """Filter by the object’s \`comments\` relation."""
  comments: PostToManyCommentFilter

  """Some related \`comments\` exist."""
  commentsExist: Boolean

  """Filter by the object’s \`project\` relation."""
  project: ProjectFilter

  """Filter by the object’s \`user\` relation."""
  user: UserFilter

  """Checks for all expressions in this list."""
  and: [PostFilter!]

  """Checks for any expressions in this list."""
  or: [PostFilter!]

  """Negates the expression."""
  not: PostFilter
}

"""
A filter to be used against UUID fields. All fields are combined with a logical ‘and.’
"""
input UUIDFilter {
  """
  Is null (if \`true\` is specified) or is not null (if \`false\` is specified).
  """
  isNull: Boolean

  """Equal to the specified value."""
  equalTo: UUID

  """Not equal to the specified value."""
  notEqualTo: UUID

  """
  Not equal to the specified value, treating null like an ordinary value.
  """
  distinctFrom: UUID

  """Equal to the specified value, treating null like an ordinary value."""
  notDistinctFrom: UUID

  """Included in the specified list."""
  in: [UUID!]

  """Not included in the specified list."""
  notIn: [UUID!]

  """Less than the specified value."""
  lessThan: UUID

  """Less than or equal to the specified value."""
  lessThanOrEqualTo: UUID

  """Greater than the specified value."""
  greaterThan: UUID

  """Greater than or equal to the specified value."""
  greaterThanOrEqualTo: UUID
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

  """Aggregates across related \`Upvote\` match the filter criteria."""
  aggregates: UpvoteAggregatesFilter
}

"""
A filter to be used against \`Upvote\` object types. All fields are combined with a logical ‘and.’
"""
input UpvoteFilter {
  """Filter by the object’s \`rowId\` field."""
  rowId: UUIDFilter

  """Filter by the object’s \`postId\` field."""
  postId: UUIDFilter

  """Filter by the object’s \`userId\` field."""
  userId: UUIDFilter

  """Filter by the object’s \`createdAt\` field."""
  createdAt: DatetimeFilter

  """Filter by the object’s \`updatedAt\` field."""
  updatedAt: DatetimeFilter

  """Filter by the object’s \`post\` relation."""
  post: PostFilter

  """Filter by the object’s \`user\` relation."""
  user: UserFilter

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
  rowId: UUIDFilter

  """Filter by the object’s \`createdAt\` field."""
  createdAt: DatetimeFilter

  """Filter by the object’s \`updatedAt\` field."""
  updatedAt: DatetimeFilter

  """Filter by the object’s \`hidraId\` field."""
  hidraId: UUIDFilter

  """Filter by the object’s \`username\` field."""
  username: StringFilter

  """Filter by the object’s \`firstName\` field."""
  firstName: StringFilter

  """Filter by the object’s \`lastName\` field."""
  lastName: StringFilter

  """Filter by the object’s \`posts\` relation."""
  posts: UserToManyPostFilter

  """Some related \`posts\` exist."""
  postsExist: Boolean

  """Filter by the object’s \`upvotes\` relation."""
  upvotes: UserToManyUpvoteFilter

  """Some related \`upvotes\` exist."""
  upvotesExist: Boolean

  """Filter by the object’s \`userOrganizations\` relation."""
  userOrganizations: UserToManyUserOrganizationFilter

  """Some related \`userOrganizations\` exist."""
  userOrganizationsExist: Boolean

  """Filter by the object’s \`comments\` relation."""
  comments: UserToManyCommentFilter

  """Some related \`comments\` exist."""
  commentsExist: Boolean

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

  """Aggregates across related \`Post\` match the filter criteria."""
  aggregates: PostAggregatesFilter
}

"""A filter to be used against aggregates of \`Post\` object types."""
input PostAggregatesFilter {
  """
  A filter that must pass for the relevant \`Post\` object to be included within the aggregate.
  """
  filter: PostFilter

  """Distinct count aggregate over matching \`Post\` objects."""
  distinctCount: PostDistinctCountAggregateFilter
}

input PostDistinctCountAggregateFilter {
  rowId: BigIntFilter
  title: BigIntFilter
  description: BigIntFilter
  projectId: BigIntFilter
  userId: BigIntFilter
  createdAt: BigIntFilter
  updatedAt: BigIntFilter
}

"""
A filter to be used against BigInt fields. All fields are combined with a logical ‘and.’
"""
input BigIntFilter {
  """
  Is null (if \`true\` is specified) or is not null (if \`false\` is specified).
  """
  isNull: Boolean

  """Equal to the specified value."""
  equalTo: BigInt

  """Not equal to the specified value."""
  notEqualTo: BigInt

  """
  Not equal to the specified value, treating null like an ordinary value.
  """
  distinctFrom: BigInt

  """Equal to the specified value, treating null like an ordinary value."""
  notDistinctFrom: BigInt

  """Included in the specified list."""
  in: [BigInt!]

  """Not included in the specified list."""
  notIn: [BigInt!]

  """Less than the specified value."""
  lessThan: BigInt

  """Less than or equal to the specified value."""
  lessThanOrEqualTo: BigInt

  """Greater than the specified value."""
  greaterThan: BigInt

  """Greater than or equal to the specified value."""
  greaterThanOrEqualTo: BigInt
}

"""
A signed eight-byte integer. The upper big integer values are greater than the
max value for a JavaScript number. Therefore all big integers will be output as
strings and not numbers.
"""
scalar BigInt

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

  """Aggregates across related \`Upvote\` match the filter criteria."""
  aggregates: UpvoteAggregatesFilter
}

"""A filter to be used against aggregates of \`Upvote\` object types."""
input UpvoteAggregatesFilter {
  """
  A filter that must pass for the relevant \`Upvote\` object to be included within the aggregate.
  """
  filter: UpvoteFilter

  """Distinct count aggregate over matching \`Upvote\` objects."""
  distinctCount: UpvoteDistinctCountAggregateFilter
}

input UpvoteDistinctCountAggregateFilter {
  rowId: BigIntFilter
  postId: BigIntFilter
  userId: BigIntFilter
  createdAt: BigIntFilter
  updatedAt: BigIntFilter
}

"""
A filter to be used against many \`UserOrganization\` object types. All fields are combined with a logical ‘and.’
"""
input UserToManyUserOrganizationFilter {
  """
  Every related \`UserOrganization\` matches the filter criteria. All fields are combined with a logical ‘and.’
  """
  every: UserOrganizationFilter

  """
  Some related \`UserOrganization\` matches the filter criteria. All fields are combined with a logical ‘and.’
  """
  some: UserOrganizationFilter

  """
  No related \`UserOrganization\` matches the filter criteria. All fields are combined with a logical ‘and.’
  """
  none: UserOrganizationFilter

  """
  Aggregates across related \`UserOrganization\` match the filter criteria.
  """
  aggregates: UserOrganizationAggregatesFilter
}

"""
A filter to be used against \`UserOrganization\` object types. All fields are combined with a logical ‘and.’
"""
input UserOrganizationFilter {
  """Filter by the object’s \`userId\` field."""
  userId: UUIDFilter

  """Filter by the object’s \`organizationId\` field."""
  organizationId: UUIDFilter

  """Filter by the object’s \`createdAt\` field."""
  createdAt: DatetimeFilter

  """Filter by the object’s \`organization\` relation."""
  organization: OrganizationFilter

  """Filter by the object’s \`user\` relation."""
  user: UserFilter

  """Checks for all expressions in this list."""
  and: [UserOrganizationFilter!]

  """Checks for any expressions in this list."""
  or: [UserOrganizationFilter!]

  """Negates the expression."""
  not: UserOrganizationFilter
}

"""
A filter to be used against \`Organization\` object types. All fields are combined with a logical ‘and.’
"""
input OrganizationFilter {
  """Filter by the object’s \`rowId\` field."""
  rowId: UUIDFilter

  """Filter by the object’s \`name\` field."""
  name: StringFilter

  """Filter by the object’s \`slug\` field."""
  slug: StringFilter

  """Filter by the object’s \`createdAt\` field."""
  createdAt: DatetimeFilter

  """Filter by the object’s \`updatedAt\` field."""
  updatedAt: DatetimeFilter

  """Filter by the object’s \`projects\` relation."""
  projects: OrganizationToManyProjectFilter

  """Some related \`projects\` exist."""
  projectsExist: Boolean

  """Filter by the object’s \`userOrganizations\` relation."""
  userOrganizations: OrganizationToManyUserOrganizationFilter

  """Some related \`userOrganizations\` exist."""
  userOrganizationsExist: Boolean

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

  """Aggregates across related \`Project\` match the filter criteria."""
  aggregates: ProjectAggregatesFilter
}

"""
A filter to be used against \`Project\` object types. All fields are combined with a logical ‘and.’
"""
input ProjectFilter {
  """Filter by the object’s \`rowId\` field."""
  rowId: UUIDFilter

  """Filter by the object’s \`name\` field."""
  name: StringFilter

  """Filter by the object’s \`image\` field."""
  image: StringFilter

  """Filter by the object’s \`slug\` field."""
  slug: StringFilter

  """Filter by the object’s \`description\` field."""
  description: StringFilter

  """Filter by the object’s \`organizationId\` field."""
  organizationId: UUIDFilter

  """Filter by the object’s \`createdAt\` field."""
  createdAt: DatetimeFilter

  """Filter by the object’s \`updatedAt\` field."""
  updatedAt: DatetimeFilter

  """Filter by the object’s \`posts\` relation."""
  posts: ProjectToManyPostFilter

  """Some related \`posts\` exist."""
  postsExist: Boolean

  """Filter by the object’s \`organization\` relation."""
  organization: OrganizationFilter

  """Checks for all expressions in this list."""
  and: [ProjectFilter!]

  """Checks for any expressions in this list."""
  or: [ProjectFilter!]

  """Negates the expression."""
  not: ProjectFilter
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

  """Aggregates across related \`Post\` match the filter criteria."""
  aggregates: PostAggregatesFilter
}

"""A filter to be used against aggregates of \`Project\` object types."""
input ProjectAggregatesFilter {
  """
  A filter that must pass for the relevant \`Project\` object to be included within the aggregate.
  """
  filter: ProjectFilter

  """Distinct count aggregate over matching \`Project\` objects."""
  distinctCount: ProjectDistinctCountAggregateFilter
}

input ProjectDistinctCountAggregateFilter {
  rowId: BigIntFilter
  name: BigIntFilter
  image: BigIntFilter
  slug: BigIntFilter
  description: BigIntFilter
  organizationId: BigIntFilter
  createdAt: BigIntFilter
  updatedAt: BigIntFilter
}

"""
A filter to be used against many \`UserOrganization\` object types. All fields are combined with a logical ‘and.’
"""
input OrganizationToManyUserOrganizationFilter {
  """
  Every related \`UserOrganization\` matches the filter criteria. All fields are combined with a logical ‘and.’
  """
  every: UserOrganizationFilter

  """
  Some related \`UserOrganization\` matches the filter criteria. All fields are combined with a logical ‘and.’
  """
  some: UserOrganizationFilter

  """
  No related \`UserOrganization\` matches the filter criteria. All fields are combined with a logical ‘and.’
  """
  none: UserOrganizationFilter

  """
  Aggregates across related \`UserOrganization\` match the filter criteria.
  """
  aggregates: UserOrganizationAggregatesFilter
}

"""
A filter to be used against aggregates of \`UserOrganization\` object types.
"""
input UserOrganizationAggregatesFilter {
  """
  A filter that must pass for the relevant \`UserOrganization\` object to be included within the aggregate.
  """
  filter: UserOrganizationFilter

  """Distinct count aggregate over matching \`UserOrganization\` objects."""
  distinctCount: UserOrganizationDistinctCountAggregateFilter
}

input UserOrganizationDistinctCountAggregateFilter {
  userId: BigIntFilter
  organizationId: BigIntFilter
  createdAt: BigIntFilter
}

"""
A filter to be used against many \`Comment\` object types. All fields are combined with a logical ‘and.’
"""
input UserToManyCommentFilter {
  """
  Every related \`Comment\` matches the filter criteria. All fields are combined with a logical ‘and.’
  """
  every: CommentFilter

  """
  Some related \`Comment\` matches the filter criteria. All fields are combined with a logical ‘and.’
  """
  some: CommentFilter

  """
  No related \`Comment\` matches the filter criteria. All fields are combined with a logical ‘and.’
  """
  none: CommentFilter

  """Aggregates across related \`Comment\` match the filter criteria."""
  aggregates: CommentAggregatesFilter
}

"""
A filter to be used against \`Comment\` object types. All fields are combined with a logical ‘and.’
"""
input CommentFilter {
  """Filter by the object’s \`rowId\` field."""
  rowId: UUIDFilter

  """Filter by the object’s \`message\` field."""
  message: StringFilter

  """Filter by the object’s \`postId\` field."""
  postId: UUIDFilter

  """Filter by the object’s \`userId\` field."""
  userId: UUIDFilter

  """Filter by the object’s \`createdAt\` field."""
  createdAt: DatetimeFilter

  """Filter by the object’s \`updatedAt\` field."""
  updatedAt: DatetimeFilter

  """Filter by the object’s \`post\` relation."""
  post: PostFilter

  """Filter by the object’s \`user\` relation."""
  user: UserFilter

  """Checks for all expressions in this list."""
  and: [CommentFilter!]

  """Checks for any expressions in this list."""
  or: [CommentFilter!]

  """Negates the expression."""
  not: CommentFilter
}

"""A filter to be used against aggregates of \`Comment\` object types."""
input CommentAggregatesFilter {
  """
  A filter that must pass for the relevant \`Comment\` object to be included within the aggregate.
  """
  filter: CommentFilter

  """Distinct count aggregate over matching \`Comment\` objects."""
  distinctCount: CommentDistinctCountAggregateFilter
}

input CommentDistinctCountAggregateFilter {
  rowId: BigIntFilter
  message: BigIntFilter
  postId: BigIntFilter
  userId: BigIntFilter
  createdAt: BigIntFilter
  updatedAt: BigIntFilter
}

"""
A filter to be used against many \`Comment\` object types. All fields are combined with a logical ‘and.’
"""
input PostToManyCommentFilter {
  """
  Every related \`Comment\` matches the filter criteria. All fields are combined with a logical ‘and.’
  """
  every: CommentFilter

  """
  Some related \`Comment\` matches the filter criteria. All fields are combined with a logical ‘and.’
  """
  some: CommentFilter

  """
  No related \`Comment\` matches the filter criteria. All fields are combined with a logical ‘and.’
  """
  none: CommentFilter

  """Aggregates across related \`Comment\` match the filter criteria."""
  aggregates: CommentAggregatesFilter
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

type Upvote implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  id: ID!
  rowId: UUID!
  postId: UUID!
  userId: UUID!
  createdAt: Datetime
  updatedAt: Datetime

  """Reads a single \`Post\` that is related to this \`Upvote\`."""
  post: Post

  """Reads a single \`User\` that is related to this \`Upvote\`."""
  user: User
}

"""A \`Upvote\` edge in the connection."""
type UpvoteEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`Upvote\` at the end of the edge."""
  node: Upvote
}

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
  Distinct count aggregates across the matching connection (ignoring before/after/first/last/offset)
  """
  distinctCount: UpvoteDistinctCountAggregates
}

type UpvoteDistinctCountAggregates {
  """Distinct count of rowId across the matching connection"""
  rowId: BigInt

  """Distinct count of postId across the matching connection"""
  postId: BigInt

  """Distinct count of userId across the matching connection"""
  userId: BigInt

  """Distinct count of createdAt across the matching connection"""
  createdAt: BigInt

  """Distinct count of updatedAt across the matching connection"""
  updatedAt: BigInt
}

"""Grouping methods for \`Upvote\` for usage during aggregation."""
enum UpvoteGroupBy {
  POST_ID
  USER_ID
  CREATED_AT
  CREATED_AT_TRUNCATED_TO_HOUR
  CREATED_AT_TRUNCATED_TO_DAY
  UPDATED_AT
  UPDATED_AT_TRUNCATED_TO_HOUR
  UPDATED_AT_TRUNCATED_TO_DAY
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
  createdAt: HavingDatetimeFilter
  updatedAt: HavingDatetimeFilter
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
  createdAt: HavingDatetimeFilter
  updatedAt: HavingDatetimeFilter
}

input UpvoteHavingMinInput {
  createdAt: HavingDatetimeFilter
  updatedAt: HavingDatetimeFilter
}

input UpvoteHavingMaxInput {
  createdAt: HavingDatetimeFilter
  updatedAt: HavingDatetimeFilter
}

input UpvoteHavingAverageInput {
  createdAt: HavingDatetimeFilter
  updatedAt: HavingDatetimeFilter
}

input UpvoteHavingStddevSampleInput {
  createdAt: HavingDatetimeFilter
  updatedAt: HavingDatetimeFilter
}

input UpvoteHavingStddevPopulationInput {
  createdAt: HavingDatetimeFilter
  updatedAt: HavingDatetimeFilter
}

input UpvoteHavingVarianceSampleInput {
  createdAt: HavingDatetimeFilter
  updatedAt: HavingDatetimeFilter
}

input UpvoteHavingVariancePopulationInput {
  createdAt: HavingDatetimeFilter
  updatedAt: HavingDatetimeFilter
}

"""Methods to use when ordering \`Upvote\`."""
enum UpvoteOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ROW_ID_ASC
  ROW_ID_DESC
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
  rowId: UUID

  """Checks for equality with the object’s \`postId\` field."""
  postId: UUID

  """Checks for equality with the object’s \`userId\` field."""
  userId: UUID

  """Checks for equality with the object’s \`createdAt\` field."""
  createdAt: Datetime

  """Checks for equality with the object’s \`updatedAt\` field."""
  updatedAt: Datetime
}

"""A connection to a list of \`UserOrganization\` values."""
type UserOrganizationConnection {
  """A list of \`UserOrganization\` objects."""
  nodes: [UserOrganization]!

  """
  A list of edges which contains the \`UserOrganization\` and cursor to aid in pagination.
  """
  edges: [UserOrganizationEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """
  The count of *all* \`UserOrganization\` you could get from the connection.
  """
  totalCount: Int!

  """
  Aggregates across the matching connection (ignoring before/after/first/last/offset)
  """
  aggregates: UserOrganizationAggregates

  """
  Grouped aggregates across the matching connection (ignoring before/after/first/last/offset)
  """
  groupedAggregates(
    """
    The method to use when grouping \`UserOrganization\` for these aggregates.
    """
    groupBy: [UserOrganizationGroupBy!]!

    """Conditions on the grouped aggregates."""
    having: UserOrganizationHavingInput
  ): [UserOrganizationAggregates!]
}

"""A \`UserOrganization\` edge in the connection."""
type UserOrganizationEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`UserOrganization\` at the end of the edge."""
  node: UserOrganization
}

type UserOrganizationAggregates {
  keys: [String]

  """
  Distinct count aggregates across the matching connection (ignoring before/after/first/last/offset)
  """
  distinctCount: UserOrganizationDistinctCountAggregates
}

type UserOrganizationDistinctCountAggregates {
  """Distinct count of userId across the matching connection"""
  userId: BigInt

  """Distinct count of organizationId across the matching connection"""
  organizationId: BigInt

  """Distinct count of createdAt across the matching connection"""
  createdAt: BigInt
}

"""Grouping methods for \`UserOrganization\` for usage during aggregation."""
enum UserOrganizationGroupBy {
  USER_ID
  ORGANIZATION_ID
  CREATED_AT
  CREATED_AT_TRUNCATED_TO_HOUR
  CREATED_AT_TRUNCATED_TO_DAY
}

"""Conditions for \`UserOrganization\` aggregates."""
input UserOrganizationHavingInput {
  AND: [UserOrganizationHavingInput!]
  OR: [UserOrganizationHavingInput!]
  sum: UserOrganizationHavingSumInput
  distinctCount: UserOrganizationHavingDistinctCountInput
  min: UserOrganizationHavingMinInput
  max: UserOrganizationHavingMaxInput
  average: UserOrganizationHavingAverageInput
  stddevSample: UserOrganizationHavingStddevSampleInput
  stddevPopulation: UserOrganizationHavingStddevPopulationInput
  varianceSample: UserOrganizationHavingVarianceSampleInput
  variancePopulation: UserOrganizationHavingVariancePopulationInput
}

input UserOrganizationHavingSumInput {
  createdAt: HavingDatetimeFilter
}

input UserOrganizationHavingDistinctCountInput {
  createdAt: HavingDatetimeFilter
}

input UserOrganizationHavingMinInput {
  createdAt: HavingDatetimeFilter
}

input UserOrganizationHavingMaxInput {
  createdAt: HavingDatetimeFilter
}

input UserOrganizationHavingAverageInput {
  createdAt: HavingDatetimeFilter
}

input UserOrganizationHavingStddevSampleInput {
  createdAt: HavingDatetimeFilter
}

input UserOrganizationHavingStddevPopulationInput {
  createdAt: HavingDatetimeFilter
}

input UserOrganizationHavingVarianceSampleInput {
  createdAt: HavingDatetimeFilter
}

input UserOrganizationHavingVariancePopulationInput {
  createdAt: HavingDatetimeFilter
}

"""Methods to use when ordering \`UserOrganization\`."""
enum UserOrganizationOrderBy {
  NATURAL
  USER_ID_ASC
  USER_ID_DESC
  ORGANIZATION_ID_ASC
  ORGANIZATION_ID_DESC
  CREATED_AT_ASC
  CREATED_AT_DESC
}

"""
A condition to be used against \`UserOrganization\` object types. All fields are
tested for equality and combined with a logical ‘and.’
"""
input UserOrganizationCondition {
  """Checks for equality with the object’s \`userId\` field."""
  userId: UUID

  """Checks for equality with the object’s \`organizationId\` field."""
  organizationId: UUID

  """Checks for equality with the object’s \`createdAt\` field."""
  createdAt: Datetime
}

"""A connection to a list of \`Comment\` values."""
type CommentConnection {
  """A list of \`Comment\` objects."""
  nodes: [Comment]!

  """
  A list of edges which contains the \`Comment\` and cursor to aid in pagination.
  """
  edges: [CommentEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`Comment\` you could get from the connection."""
  totalCount: Int!

  """
  Aggregates across the matching connection (ignoring before/after/first/last/offset)
  """
  aggregates: CommentAggregates

  """
  Grouped aggregates across the matching connection (ignoring before/after/first/last/offset)
  """
  groupedAggregates(
    """The method to use when grouping \`Comment\` for these aggregates."""
    groupBy: [CommentGroupBy!]!

    """Conditions on the grouped aggregates."""
    having: CommentHavingInput
  ): [CommentAggregates!]
}

type Comment implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  id: ID!
  rowId: UUID!
  message: String
  postId: UUID!
  userId: UUID!
  createdAt: Datetime
  updatedAt: Datetime

  """Reads a single \`Post\` that is related to this \`Comment\`."""
  post: Post

  """Reads a single \`User\` that is related to this \`Comment\`."""
  user: User
}

"""A \`Comment\` edge in the connection."""
type CommentEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`Comment\` at the end of the edge."""
  node: Comment
}

type CommentAggregates {
  keys: [String]

  """
  Distinct count aggregates across the matching connection (ignoring before/after/first/last/offset)
  """
  distinctCount: CommentDistinctCountAggregates
}

type CommentDistinctCountAggregates {
  """Distinct count of rowId across the matching connection"""
  rowId: BigInt

  """Distinct count of message across the matching connection"""
  message: BigInt

  """Distinct count of postId across the matching connection"""
  postId: BigInt

  """Distinct count of userId across the matching connection"""
  userId: BigInt

  """Distinct count of createdAt across the matching connection"""
  createdAt: BigInt

  """Distinct count of updatedAt across the matching connection"""
  updatedAt: BigInt
}

"""Grouping methods for \`Comment\` for usage during aggregation."""
enum CommentGroupBy {
  MESSAGE
  POST_ID
  USER_ID
  CREATED_AT
  CREATED_AT_TRUNCATED_TO_HOUR
  CREATED_AT_TRUNCATED_TO_DAY
  UPDATED_AT
  UPDATED_AT_TRUNCATED_TO_HOUR
  UPDATED_AT_TRUNCATED_TO_DAY
}

"""Conditions for \`Comment\` aggregates."""
input CommentHavingInput {
  AND: [CommentHavingInput!]
  OR: [CommentHavingInput!]
  sum: CommentHavingSumInput
  distinctCount: CommentHavingDistinctCountInput
  min: CommentHavingMinInput
  max: CommentHavingMaxInput
  average: CommentHavingAverageInput
  stddevSample: CommentHavingStddevSampleInput
  stddevPopulation: CommentHavingStddevPopulationInput
  varianceSample: CommentHavingVarianceSampleInput
  variancePopulation: CommentHavingVariancePopulationInput
}

input CommentHavingSumInput {
  createdAt: HavingDatetimeFilter
  updatedAt: HavingDatetimeFilter
}

input CommentHavingDistinctCountInput {
  createdAt: HavingDatetimeFilter
  updatedAt: HavingDatetimeFilter
}

input CommentHavingMinInput {
  createdAt: HavingDatetimeFilter
  updatedAt: HavingDatetimeFilter
}

input CommentHavingMaxInput {
  createdAt: HavingDatetimeFilter
  updatedAt: HavingDatetimeFilter
}

input CommentHavingAverageInput {
  createdAt: HavingDatetimeFilter
  updatedAt: HavingDatetimeFilter
}

input CommentHavingStddevSampleInput {
  createdAt: HavingDatetimeFilter
  updatedAt: HavingDatetimeFilter
}

input CommentHavingStddevPopulationInput {
  createdAt: HavingDatetimeFilter
  updatedAt: HavingDatetimeFilter
}

input CommentHavingVarianceSampleInput {
  createdAt: HavingDatetimeFilter
  updatedAt: HavingDatetimeFilter
}

input CommentHavingVariancePopulationInput {
  createdAt: HavingDatetimeFilter
  updatedAt: HavingDatetimeFilter
}

"""Methods to use when ordering \`Comment\`."""
enum CommentOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ROW_ID_ASC
  ROW_ID_DESC
  MESSAGE_ASC
  MESSAGE_DESC
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
A condition to be used against \`Comment\` object types. All fields are tested for equality and combined with a logical ‘and.’
"""
input CommentCondition {
  """Checks for equality with the object’s \`rowId\` field."""
  rowId: UUID

  """Checks for equality with the object’s \`message\` field."""
  message: String

  """Checks for equality with the object’s \`postId\` field."""
  postId: UUID

  """Checks for equality with the object’s \`userId\` field."""
  userId: UUID

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

type PostAggregates {
  keys: [String]

  """
  Distinct count aggregates across the matching connection (ignoring before/after/first/last/offset)
  """
  distinctCount: PostDistinctCountAggregates
}

type PostDistinctCountAggregates {
  """Distinct count of rowId across the matching connection"""
  rowId: BigInt

  """Distinct count of title across the matching connection"""
  title: BigInt

  """Distinct count of description across the matching connection"""
  description: BigInt

  """Distinct count of projectId across the matching connection"""
  projectId: BigInt

  """Distinct count of userId across the matching connection"""
  userId: BigInt

  """Distinct count of createdAt across the matching connection"""
  createdAt: BigInt

  """Distinct count of updatedAt across the matching connection"""
  updatedAt: BigInt
}

"""Grouping methods for \`Post\` for usage during aggregation."""
enum PostGroupBy {
  TITLE
  DESCRIPTION
  PROJECT_ID
  USER_ID
  CREATED_AT
  CREATED_AT_TRUNCATED_TO_HOUR
  CREATED_AT_TRUNCATED_TO_DAY
  UPDATED_AT
  UPDATED_AT_TRUNCATED_TO_HOUR
  UPDATED_AT_TRUNCATED_TO_DAY
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
  createdAt: HavingDatetimeFilter
  updatedAt: HavingDatetimeFilter
}

input PostHavingDistinctCountInput {
  createdAt: HavingDatetimeFilter
  updatedAt: HavingDatetimeFilter
}

input PostHavingMinInput {
  createdAt: HavingDatetimeFilter
  updatedAt: HavingDatetimeFilter
}

input PostHavingMaxInput {
  createdAt: HavingDatetimeFilter
  updatedAt: HavingDatetimeFilter
}

input PostHavingAverageInput {
  createdAt: HavingDatetimeFilter
  updatedAt: HavingDatetimeFilter
}

input PostHavingStddevSampleInput {
  createdAt: HavingDatetimeFilter
  updatedAt: HavingDatetimeFilter
}

input PostHavingStddevPopulationInput {
  createdAt: HavingDatetimeFilter
  updatedAt: HavingDatetimeFilter
}

input PostHavingVarianceSampleInput {
  createdAt: HavingDatetimeFilter
  updatedAt: HavingDatetimeFilter
}

input PostHavingVariancePopulationInput {
  createdAt: HavingDatetimeFilter
  updatedAt: HavingDatetimeFilter
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
  Distinct count aggregates across the matching connection (ignoring before/after/first/last/offset)
  """
  distinctCount: ProjectDistinctCountAggregates
}

type ProjectDistinctCountAggregates {
  """Distinct count of rowId across the matching connection"""
  rowId: BigInt

  """Distinct count of name across the matching connection"""
  name: BigInt

  """Distinct count of image across the matching connection"""
  image: BigInt

  """Distinct count of slug across the matching connection"""
  slug: BigInt

  """Distinct count of description across the matching connection"""
  description: BigInt

  """Distinct count of organizationId across the matching connection"""
  organizationId: BigInt

  """Distinct count of createdAt across the matching connection"""
  createdAt: BigInt

  """Distinct count of updatedAt across the matching connection"""
  updatedAt: BigInt
}

"""Grouping methods for \`Project\` for usage during aggregation."""
enum ProjectGroupBy {
  IMAGE
  SLUG
  DESCRIPTION
  ORGANIZATION_ID
  CREATED_AT
  CREATED_AT_TRUNCATED_TO_HOUR
  CREATED_AT_TRUNCATED_TO_DAY
  UPDATED_AT
  UPDATED_AT_TRUNCATED_TO_HOUR
  UPDATED_AT_TRUNCATED_TO_DAY
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
  createdAt: HavingDatetimeFilter
  updatedAt: HavingDatetimeFilter
}

input ProjectHavingDistinctCountInput {
  createdAt: HavingDatetimeFilter
  updatedAt: HavingDatetimeFilter
}

input ProjectHavingMinInput {
  createdAt: HavingDatetimeFilter
  updatedAt: HavingDatetimeFilter
}

input ProjectHavingMaxInput {
  createdAt: HavingDatetimeFilter
  updatedAt: HavingDatetimeFilter
}

input ProjectHavingAverageInput {
  createdAt: HavingDatetimeFilter
  updatedAt: HavingDatetimeFilter
}

input ProjectHavingStddevSampleInput {
  createdAt: HavingDatetimeFilter
  updatedAt: HavingDatetimeFilter
}

input ProjectHavingStddevPopulationInput {
  createdAt: HavingDatetimeFilter
  updatedAt: HavingDatetimeFilter
}

input ProjectHavingVarianceSampleInput {
  createdAt: HavingDatetimeFilter
  updatedAt: HavingDatetimeFilter
}

input ProjectHavingVariancePopulationInput {
  createdAt: HavingDatetimeFilter
  updatedAt: HavingDatetimeFilter
}

"""Methods to use when ordering \`Project\`."""
enum ProjectOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ROW_ID_ASC
  ROW_ID_DESC
  NAME_ASC
  NAME_DESC
  IMAGE_ASC
  IMAGE_DESC
  SLUG_ASC
  SLUG_DESC
  DESCRIPTION_ASC
  DESCRIPTION_DESC
  ORGANIZATION_ID_ASC
  ORGANIZATION_ID_DESC
  CREATED_AT_ASC
  CREATED_AT_DESC
  UPDATED_AT_ASC
  UPDATED_AT_DESC
  POSTS_COUNT_ASC
  POSTS_COUNT_DESC
  POSTS_DISTINCT_COUNT_ROW_ID_ASC
  POSTS_DISTINCT_COUNT_ROW_ID_DESC
  POSTS_DISTINCT_COUNT_TITLE_ASC
  POSTS_DISTINCT_COUNT_TITLE_DESC
  POSTS_DISTINCT_COUNT_DESCRIPTION_ASC
  POSTS_DISTINCT_COUNT_DESCRIPTION_DESC
  POSTS_DISTINCT_COUNT_PROJECT_ID_ASC
  POSTS_DISTINCT_COUNT_PROJECT_ID_DESC
  POSTS_DISTINCT_COUNT_USER_ID_ASC
  POSTS_DISTINCT_COUNT_USER_ID_DESC
  POSTS_DISTINCT_COUNT_CREATED_AT_ASC
  POSTS_DISTINCT_COUNT_CREATED_AT_DESC
  POSTS_DISTINCT_COUNT_UPDATED_AT_ASC
  POSTS_DISTINCT_COUNT_UPDATED_AT_DESC
}

"""
A condition to be used against \`Project\` object types. All fields are tested for equality and combined with a logical ‘and.’
"""
input ProjectCondition {
  """Checks for equality with the object’s \`rowId\` field."""
  rowId: UUID

  """Checks for equality with the object’s \`name\` field."""
  name: String

  """Checks for equality with the object’s \`image\` field."""
  image: String

  """Checks for equality with the object’s \`slug\` field."""
  slug: String

  """Checks for equality with the object’s \`description\` field."""
  description: String

  """Checks for equality with the object’s \`organizationId\` field."""
  organizationId: UUID

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
  Distinct count aggregates across the matching connection (ignoring before/after/first/last/offset)
  """
  distinctCount: OrganizationDistinctCountAggregates
}

type OrganizationDistinctCountAggregates {
  """Distinct count of rowId across the matching connection"""
  rowId: BigInt

  """Distinct count of name across the matching connection"""
  name: BigInt

  """Distinct count of slug across the matching connection"""
  slug: BigInt

  """Distinct count of createdAt across the matching connection"""
  createdAt: BigInt

  """Distinct count of updatedAt across the matching connection"""
  updatedAt: BigInt
}

"""Grouping methods for \`Organization\` for usage during aggregation."""
enum OrganizationGroupBy {
  CREATED_AT
  CREATED_AT_TRUNCATED_TO_HOUR
  CREATED_AT_TRUNCATED_TO_DAY
  UPDATED_AT
  UPDATED_AT_TRUNCATED_TO_HOUR
  UPDATED_AT_TRUNCATED_TO_DAY
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
  createdAt: HavingDatetimeFilter
  updatedAt: HavingDatetimeFilter
}

input OrganizationHavingDistinctCountInput {
  createdAt: HavingDatetimeFilter
  updatedAt: HavingDatetimeFilter
}

input OrganizationHavingMinInput {
  createdAt: HavingDatetimeFilter
  updatedAt: HavingDatetimeFilter
}

input OrganizationHavingMaxInput {
  createdAt: HavingDatetimeFilter
  updatedAt: HavingDatetimeFilter
}

input OrganizationHavingAverageInput {
  createdAt: HavingDatetimeFilter
  updatedAt: HavingDatetimeFilter
}

input OrganizationHavingStddevSampleInput {
  createdAt: HavingDatetimeFilter
  updatedAt: HavingDatetimeFilter
}

input OrganizationHavingStddevPopulationInput {
  createdAt: HavingDatetimeFilter
  updatedAt: HavingDatetimeFilter
}

input OrganizationHavingVarianceSampleInput {
  createdAt: HavingDatetimeFilter
  updatedAt: HavingDatetimeFilter
}

input OrganizationHavingVariancePopulationInput {
  createdAt: HavingDatetimeFilter
  updatedAt: HavingDatetimeFilter
}

"""Methods to use when ordering \`Organization\`."""
enum OrganizationOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ROW_ID_ASC
  ROW_ID_DESC
  NAME_ASC
  NAME_DESC
  SLUG_ASC
  SLUG_DESC
  CREATED_AT_ASC
  CREATED_AT_DESC
  UPDATED_AT_ASC
  UPDATED_AT_DESC
  PROJECTS_COUNT_ASC
  PROJECTS_COUNT_DESC
  PROJECTS_DISTINCT_COUNT_ROW_ID_ASC
  PROJECTS_DISTINCT_COUNT_ROW_ID_DESC
  PROJECTS_DISTINCT_COUNT_NAME_ASC
  PROJECTS_DISTINCT_COUNT_NAME_DESC
  PROJECTS_DISTINCT_COUNT_IMAGE_ASC
  PROJECTS_DISTINCT_COUNT_IMAGE_DESC
  PROJECTS_DISTINCT_COUNT_SLUG_ASC
  PROJECTS_DISTINCT_COUNT_SLUG_DESC
  PROJECTS_DISTINCT_COUNT_DESCRIPTION_ASC
  PROJECTS_DISTINCT_COUNT_DESCRIPTION_DESC
  PROJECTS_DISTINCT_COUNT_ORGANIZATION_ID_ASC
  PROJECTS_DISTINCT_COUNT_ORGANIZATION_ID_DESC
  PROJECTS_DISTINCT_COUNT_CREATED_AT_ASC
  PROJECTS_DISTINCT_COUNT_CREATED_AT_DESC
  PROJECTS_DISTINCT_COUNT_UPDATED_AT_ASC
  PROJECTS_DISTINCT_COUNT_UPDATED_AT_DESC
  USER_ORGANIZATIONS_COUNT_ASC
  USER_ORGANIZATIONS_COUNT_DESC
  USER_ORGANIZATIONS_DISTINCT_COUNT_USER_ID_ASC
  USER_ORGANIZATIONS_DISTINCT_COUNT_USER_ID_DESC
  USER_ORGANIZATIONS_DISTINCT_COUNT_ORGANIZATION_ID_ASC
  USER_ORGANIZATIONS_DISTINCT_COUNT_ORGANIZATION_ID_DESC
  USER_ORGANIZATIONS_DISTINCT_COUNT_CREATED_AT_ASC
  USER_ORGANIZATIONS_DISTINCT_COUNT_CREATED_AT_DESC
}

"""
A condition to be used against \`Organization\` object types. All fields are
tested for equality and combined with a logical ‘and.’
"""
input OrganizationCondition {
  """Checks for equality with the object’s \`rowId\` field."""
  rowId: UUID

  """Checks for equality with the object’s \`name\` field."""
  name: String

  """Checks for equality with the object’s \`slug\` field."""
  slug: String

  """Checks for equality with the object’s \`createdAt\` field."""
  createdAt: Datetime

  """Checks for equality with the object’s \`updatedAt\` field."""
  updatedAt: Datetime
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
  Distinct count aggregates across the matching connection (ignoring before/after/first/last/offset)
  """
  distinctCount: UserDistinctCountAggregates
}

type UserDistinctCountAggregates {
  """Distinct count of rowId across the matching connection"""
  rowId: BigInt

  """Distinct count of createdAt across the matching connection"""
  createdAt: BigInt

  """Distinct count of updatedAt across the matching connection"""
  updatedAt: BigInt

  """Distinct count of hidraId across the matching connection"""
  hidraId: BigInt

  """Distinct count of username across the matching connection"""
  username: BigInt

  """Distinct count of firstName across the matching connection"""
  firstName: BigInt

  """Distinct count of lastName across the matching connection"""
  lastName: BigInt
}

"""Grouping methods for \`User\` for usage during aggregation."""
enum UserGroupBy {
  CREATED_AT
  CREATED_AT_TRUNCATED_TO_HOUR
  CREATED_AT_TRUNCATED_TO_DAY
  UPDATED_AT
  UPDATED_AT_TRUNCATED_TO_HOUR
  UPDATED_AT_TRUNCATED_TO_DAY
  FIRST_NAME
  LAST_NAME
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
  createdAt: HavingDatetimeFilter
  updatedAt: HavingDatetimeFilter
}

input UserHavingDistinctCountInput {
  createdAt: HavingDatetimeFilter
  updatedAt: HavingDatetimeFilter
}

input UserHavingMinInput {
  createdAt: HavingDatetimeFilter
  updatedAt: HavingDatetimeFilter
}

input UserHavingMaxInput {
  createdAt: HavingDatetimeFilter
  updatedAt: HavingDatetimeFilter
}

input UserHavingAverageInput {
  createdAt: HavingDatetimeFilter
  updatedAt: HavingDatetimeFilter
}

input UserHavingStddevSampleInput {
  createdAt: HavingDatetimeFilter
  updatedAt: HavingDatetimeFilter
}

input UserHavingStddevPopulationInput {
  createdAt: HavingDatetimeFilter
  updatedAt: HavingDatetimeFilter
}

input UserHavingVarianceSampleInput {
  createdAt: HavingDatetimeFilter
  updatedAt: HavingDatetimeFilter
}

input UserHavingVariancePopulationInput {
  createdAt: HavingDatetimeFilter
  updatedAt: HavingDatetimeFilter
}

"""Methods to use when ordering \`User\`."""
enum UserOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ROW_ID_ASC
  ROW_ID_DESC
  CREATED_AT_ASC
  CREATED_AT_DESC
  UPDATED_AT_ASC
  UPDATED_AT_DESC
  HIDRA_ID_ASC
  HIDRA_ID_DESC
  USERNAME_ASC
  USERNAME_DESC
  FIRST_NAME_ASC
  FIRST_NAME_DESC
  LAST_NAME_ASC
  LAST_NAME_DESC
  POSTS_COUNT_ASC
  POSTS_COUNT_DESC
  POSTS_DISTINCT_COUNT_ROW_ID_ASC
  POSTS_DISTINCT_COUNT_ROW_ID_DESC
  POSTS_DISTINCT_COUNT_TITLE_ASC
  POSTS_DISTINCT_COUNT_TITLE_DESC
  POSTS_DISTINCT_COUNT_DESCRIPTION_ASC
  POSTS_DISTINCT_COUNT_DESCRIPTION_DESC
  POSTS_DISTINCT_COUNT_PROJECT_ID_ASC
  POSTS_DISTINCT_COUNT_PROJECT_ID_DESC
  POSTS_DISTINCT_COUNT_USER_ID_ASC
  POSTS_DISTINCT_COUNT_USER_ID_DESC
  POSTS_DISTINCT_COUNT_CREATED_AT_ASC
  POSTS_DISTINCT_COUNT_CREATED_AT_DESC
  POSTS_DISTINCT_COUNT_UPDATED_AT_ASC
  POSTS_DISTINCT_COUNT_UPDATED_AT_DESC
  UPVOTES_COUNT_ASC
  UPVOTES_COUNT_DESC
  UPVOTES_DISTINCT_COUNT_ROW_ID_ASC
  UPVOTES_DISTINCT_COUNT_ROW_ID_DESC
  UPVOTES_DISTINCT_COUNT_POST_ID_ASC
  UPVOTES_DISTINCT_COUNT_POST_ID_DESC
  UPVOTES_DISTINCT_COUNT_USER_ID_ASC
  UPVOTES_DISTINCT_COUNT_USER_ID_DESC
  UPVOTES_DISTINCT_COUNT_CREATED_AT_ASC
  UPVOTES_DISTINCT_COUNT_CREATED_AT_DESC
  UPVOTES_DISTINCT_COUNT_UPDATED_AT_ASC
  UPVOTES_DISTINCT_COUNT_UPDATED_AT_DESC
  USER_ORGANIZATIONS_COUNT_ASC
  USER_ORGANIZATIONS_COUNT_DESC
  USER_ORGANIZATIONS_DISTINCT_COUNT_USER_ID_ASC
  USER_ORGANIZATIONS_DISTINCT_COUNT_USER_ID_DESC
  USER_ORGANIZATIONS_DISTINCT_COUNT_ORGANIZATION_ID_ASC
  USER_ORGANIZATIONS_DISTINCT_COUNT_ORGANIZATION_ID_DESC
  USER_ORGANIZATIONS_DISTINCT_COUNT_CREATED_AT_ASC
  USER_ORGANIZATIONS_DISTINCT_COUNT_CREATED_AT_DESC
  COMMENTS_COUNT_ASC
  COMMENTS_COUNT_DESC
  COMMENTS_DISTINCT_COUNT_ROW_ID_ASC
  COMMENTS_DISTINCT_COUNT_ROW_ID_DESC
  COMMENTS_DISTINCT_COUNT_MESSAGE_ASC
  COMMENTS_DISTINCT_COUNT_MESSAGE_DESC
  COMMENTS_DISTINCT_COUNT_POST_ID_ASC
  COMMENTS_DISTINCT_COUNT_POST_ID_DESC
  COMMENTS_DISTINCT_COUNT_USER_ID_ASC
  COMMENTS_DISTINCT_COUNT_USER_ID_DESC
  COMMENTS_DISTINCT_COUNT_CREATED_AT_ASC
  COMMENTS_DISTINCT_COUNT_CREATED_AT_DESC
  COMMENTS_DISTINCT_COUNT_UPDATED_AT_ASC
  COMMENTS_DISTINCT_COUNT_UPDATED_AT_DESC
}

"""
A condition to be used against \`User\` object types. All fields are tested for equality and combined with a logical ‘and.’
"""
input UserCondition {
  """Checks for equality with the object’s \`rowId\` field."""
  rowId: UUID

  """Checks for equality with the object’s \`createdAt\` field."""
  createdAt: Datetime

  """Checks for equality with the object’s \`updatedAt\` field."""
  updatedAt: Datetime

  """Checks for equality with the object’s \`hidraId\` field."""
  hidraId: UUID

  """Checks for equality with the object’s \`username\` field."""
  username: String

  """Checks for equality with the object’s \`firstName\` field."""
  firstName: String

  """Checks for equality with the object’s \`lastName\` field."""
  lastName: String
}

"""
The root mutation type which contains root level fields which mutate data.
"""
type Mutation {
  """Creates a single \`UserOrganization\`."""
  createUserOrganization(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateUserOrganizationInput!
  ): CreateUserOrganizationPayload

  """Creates a single \`Upvote\`."""
  createUpvote(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateUpvoteInput!
  ): CreateUpvotePayload

  """Creates a single \`Organization\`."""
  createOrganization(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateOrganizationInput!
  ): CreateOrganizationPayload

  """Creates a single \`Comment\`."""
  createComment(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateCommentInput!
  ): CreateCommentPayload

  """Creates a single \`Post\`."""
  createPost(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreatePostInput!
  ): CreatePostPayload

  """Creates a single \`User\`."""
  createUser(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateUserInput!
  ): CreateUserPayload

  """Creates a single \`Project\`."""
  createProject(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateProjectInput!
  ): CreateProjectPayload

  """Updates a single \`UserOrganization\` using a unique key and a patch."""
  updateUserOrganizationByUserIdAndOrganizationId(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateUserOrganizationByUserIdAndOrganizationIdInput!
  ): UpdateUserOrganizationPayload

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

  """Updates a single \`Upvote\` using a unique key and a patch."""
  updateUpvoteByPostIdAndUserId(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateUpvoteByPostIdAndUserIdInput!
  ): UpdateUpvotePayload

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

  """Updates a single \`Organization\` using a unique key and a patch."""
  updateOrganizationByName(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateOrganizationByNameInput!
  ): UpdateOrganizationPayload

  """Updates a single \`Organization\` using a unique key and a patch."""
  updateOrganizationBySlug(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateOrganizationBySlugInput!
  ): UpdateOrganizationPayload

  """Updates a single \`Comment\` using its globally unique id and a patch."""
  updateCommentById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateCommentByIdInput!
  ): UpdateCommentPayload

  """Updates a single \`Comment\` using a unique key and a patch."""
  updateComment(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateCommentInput!
  ): UpdateCommentPayload

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

  """Updates a single \`User\` using a unique key and a patch."""
  updateUserByHidraId(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateUserByHidraIdInput!
  ): UpdateUserPayload

  """Updates a single \`User\` using a unique key and a patch."""
  updateUserByUsername(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateUserByUsernameInput!
  ): UpdateUserPayload

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

  """Updates a single \`Project\` using a unique key and a patch."""
  updateProjectByName(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateProjectByNameInput!
  ): UpdateProjectPayload

  """Updates a single \`Project\` using a unique key and a patch."""
  updateProjectBySlugAndOrganizationId(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateProjectBySlugAndOrganizationIdInput!
  ): UpdateProjectPayload

  """Deletes a single \`UserOrganization\` using a unique key."""
  deleteUserOrganizationByUserIdAndOrganizationId(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteUserOrganizationByUserIdAndOrganizationIdInput!
  ): DeleteUserOrganizationPayload

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

  """Deletes a single \`Upvote\` using a unique key."""
  deleteUpvoteByPostIdAndUserId(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteUpvoteByPostIdAndUserIdInput!
  ): DeleteUpvotePayload

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

  """Deletes a single \`Organization\` using a unique key."""
  deleteOrganizationByName(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteOrganizationByNameInput!
  ): DeleteOrganizationPayload

  """Deletes a single \`Organization\` using a unique key."""
  deleteOrganizationBySlug(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteOrganizationBySlugInput!
  ): DeleteOrganizationPayload

  """Deletes a single \`Comment\` using its globally unique id."""
  deleteCommentById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteCommentByIdInput!
  ): DeleteCommentPayload

  """Deletes a single \`Comment\` using a unique key."""
  deleteComment(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteCommentInput!
  ): DeleteCommentPayload

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

  """Deletes a single \`User\` using a unique key."""
  deleteUserByHidraId(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteUserByHidraIdInput!
  ): DeleteUserPayload

  """Deletes a single \`User\` using a unique key."""
  deleteUserByUsername(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteUserByUsernameInput!
  ): DeleteUserPayload

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

  """Deletes a single \`Project\` using a unique key."""
  deleteProjectByName(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteProjectByNameInput!
  ): DeleteProjectPayload

  """Deletes a single \`Project\` using a unique key."""
  deleteProjectBySlugAndOrganizationId(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteProjectBySlugAndOrganizationIdInput!
  ): DeleteProjectPayload
}

"""The output of our create \`UserOrganization\` mutation."""
type CreateUserOrganizationPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`UserOrganization\` that was created by this mutation."""
  userOrganization: UserOrganization

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query
}

"""All input for the create \`UserOrganization\` mutation."""
input CreateUserOrganizationInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The \`UserOrganization\` to be created by this mutation."""
  userOrganization: UserOrganizationInput!
}

"""An input for mutations affecting \`UserOrganization\`"""
input UserOrganizationInput {
  userId: UUID!
  organizationId: UUID!
  createdAt: Datetime
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
  rowId: UUID
  postId: UUID!
  userId: UUID!
  createdAt: Datetime
  updatedAt: Datetime
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
  rowId: UUID
  name: String
  slug: String
  createdAt: Datetime
  updatedAt: Datetime
}

"""The output of our create \`Comment\` mutation."""
type CreateCommentPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Comment\` that was created by this mutation."""
  comment: Comment

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Comment\`. May be used by Relay 1."""
  commentEdge(
    """The method to use when ordering \`Comment\`."""
    orderBy: [CommentOrderBy!]! = [PRIMARY_KEY_ASC]
  ): CommentEdge
}

"""All input for the create \`Comment\` mutation."""
input CreateCommentInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The \`Comment\` to be created by this mutation."""
  comment: CommentInput!
}

"""An input for mutations affecting \`Comment\`"""
input CommentInput {
  rowId: UUID
  message: String
  postId: UUID!
  userId: UUID!
  createdAt: Datetime
  updatedAt: Datetime
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
  rowId: UUID
  title: String
  description: String
  projectId: UUID!
  userId: UUID!
  createdAt: Datetime
  updatedAt: Datetime
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
  rowId: UUID
  createdAt: Datetime
  updatedAt: Datetime
  hidraId: UUID!
  username: String
  firstName: String
  lastName: String
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
  rowId: UUID
  name: String
  image: String
  slug: String
  description: String
  organizationId: UUID!
  createdAt: Datetime
  updatedAt: Datetime
}

"""The output of our update \`UserOrganization\` mutation."""
type UpdateUserOrganizationPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`UserOrganization\` that was updated by this mutation."""
  userOrganization: UserOrganization

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query
}

"""
All input for the \`updateUserOrganizationByUserIdAndOrganizationId\` mutation.
"""
input UpdateUserOrganizationByUserIdAndOrganizationIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  userId: UUID!
  organizationId: UUID!

  """
  An object where the defined keys will be set on the \`UserOrganization\` being updated.
  """
  patch: UserOrganizationPatch!
}

"""
Represents an update to a \`UserOrganization\`. Fields that are set will be updated.
"""
input UserOrganizationPatch {
  userId: UUID
  organizationId: UUID
  createdAt: Datetime
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
  rowId: UUID
  postId: UUID
  userId: UUID
  createdAt: Datetime
  updatedAt: Datetime
}

"""All input for the \`updateUpvote\` mutation."""
input UpdateUpvoteInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  rowId: UUID!

  """
  An object where the defined keys will be set on the \`Upvote\` being updated.
  """
  patch: UpvotePatch!
}

"""All input for the \`updateUpvoteByPostIdAndUserId\` mutation."""
input UpdateUpvoteByPostIdAndUserIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  postId: UUID!
  userId: UUID!

  """
  An object where the defined keys will be set on the \`Upvote\` being updated.
  """
  patch: UpvotePatch!
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
  rowId: UUID
  name: String
  slug: String
  createdAt: Datetime
  updatedAt: Datetime
}

"""All input for the \`updateOrganization\` mutation."""
input UpdateOrganizationInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  rowId: UUID!

  """
  An object where the defined keys will be set on the \`Organization\` being updated.
  """
  patch: OrganizationPatch!
}

"""All input for the \`updateOrganizationByName\` mutation."""
input UpdateOrganizationByNameInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  name: String!

  """
  An object where the defined keys will be set on the \`Organization\` being updated.
  """
  patch: OrganizationPatch!
}

"""All input for the \`updateOrganizationBySlug\` mutation."""
input UpdateOrganizationBySlugInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  slug: String!

  """
  An object where the defined keys will be set on the \`Organization\` being updated.
  """
  patch: OrganizationPatch!
}

"""The output of our update \`Comment\` mutation."""
type UpdateCommentPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Comment\` that was updated by this mutation."""
  comment: Comment

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Comment\`. May be used by Relay 1."""
  commentEdge(
    """The method to use when ordering \`Comment\`."""
    orderBy: [CommentOrderBy!]! = [PRIMARY_KEY_ASC]
  ): CommentEdge
}

"""All input for the \`updateCommentById\` mutation."""
input UpdateCommentByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`Comment\` to be updated.
  """
  id: ID!

  """
  An object where the defined keys will be set on the \`Comment\` being updated.
  """
  patch: CommentPatch!
}

"""
Represents an update to a \`Comment\`. Fields that are set will be updated.
"""
input CommentPatch {
  rowId: UUID
  message: String
  postId: UUID
  userId: UUID
  createdAt: Datetime
  updatedAt: Datetime
}

"""All input for the \`updateComment\` mutation."""
input UpdateCommentInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  rowId: UUID!

  """
  An object where the defined keys will be set on the \`Comment\` being updated.
  """
  patch: CommentPatch!
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
  rowId: UUID
  title: String
  description: String
  projectId: UUID
  userId: UUID
  createdAt: Datetime
  updatedAt: Datetime
}

"""All input for the \`updatePost\` mutation."""
input UpdatePostInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  rowId: UUID!

  """
  An object where the defined keys will be set on the \`Post\` being updated.
  """
  patch: PostPatch!
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
  rowId: UUID
  createdAt: Datetime
  updatedAt: Datetime
  hidraId: UUID
  username: String
  firstName: String
  lastName: String
}

"""All input for the \`updateUser\` mutation."""
input UpdateUserInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  rowId: UUID!

  """
  An object where the defined keys will be set on the \`User\` being updated.
  """
  patch: UserPatch!
}

"""All input for the \`updateUserByHidraId\` mutation."""
input UpdateUserByHidraIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  hidraId: UUID!

  """
  An object where the defined keys will be set on the \`User\` being updated.
  """
  patch: UserPatch!
}

"""All input for the \`updateUserByUsername\` mutation."""
input UpdateUserByUsernameInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  username: String!

  """
  An object where the defined keys will be set on the \`User\` being updated.
  """
  patch: UserPatch!
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
  rowId: UUID
  name: String
  image: String
  slug: String
  description: String
  organizationId: UUID
  createdAt: Datetime
  updatedAt: Datetime
}

"""All input for the \`updateProject\` mutation."""
input UpdateProjectInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  rowId: UUID!

  """
  An object where the defined keys will be set on the \`Project\` being updated.
  """
  patch: ProjectPatch!
}

"""All input for the \`updateProjectByName\` mutation."""
input UpdateProjectByNameInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  name: String!

  """
  An object where the defined keys will be set on the \`Project\` being updated.
  """
  patch: ProjectPatch!
}

"""All input for the \`updateProjectBySlugAndOrganizationId\` mutation."""
input UpdateProjectBySlugAndOrganizationIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  slug: String!
  organizationId: UUID!

  """
  An object where the defined keys will be set on the \`Project\` being updated.
  """
  patch: ProjectPatch!
}

"""The output of our delete \`UserOrganization\` mutation."""
type DeleteUserOrganizationPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`UserOrganization\` that was deleted by this mutation."""
  userOrganization: UserOrganization

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query
}

"""
All input for the \`deleteUserOrganizationByUserIdAndOrganizationId\` mutation.
"""
input DeleteUserOrganizationByUserIdAndOrganizationIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  userId: UUID!
  organizationId: UUID!
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
  rowId: UUID!
}

"""All input for the \`deleteUpvoteByPostIdAndUserId\` mutation."""
input DeleteUpvoteByPostIdAndUserIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  postId: UUID!
  userId: UUID!
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
  rowId: UUID!
}

"""All input for the \`deleteOrganizationByName\` mutation."""
input DeleteOrganizationByNameInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  name: String!
}

"""All input for the \`deleteOrganizationBySlug\` mutation."""
input DeleteOrganizationBySlugInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  slug: String!
}

"""The output of our delete \`Comment\` mutation."""
type DeleteCommentPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Comment\` that was deleted by this mutation."""
  comment: Comment
  deletedCommentId: ID

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Comment\`. May be used by Relay 1."""
  commentEdge(
    """The method to use when ordering \`Comment\`."""
    orderBy: [CommentOrderBy!]! = [PRIMARY_KEY_ASC]
  ): CommentEdge
}

"""All input for the \`deleteCommentById\` mutation."""
input DeleteCommentByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`Comment\` to be deleted.
  """
  id: ID!
}

"""All input for the \`deleteComment\` mutation."""
input DeleteCommentInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  rowId: UUID!
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
  rowId: UUID!
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
  rowId: UUID!
}

"""All input for the \`deleteUserByHidraId\` mutation."""
input DeleteUserByHidraIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  hidraId: UUID!
}

"""All input for the \`deleteUserByUsername\` mutation."""
input DeleteUserByUsernameInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  username: String!
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
  rowId: UUID!
}

"""All input for the \`deleteProjectByName\` mutation."""
input DeleteProjectByNameInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  name: String!
}

"""All input for the \`deleteProjectBySlugAndOrganizationId\` mutation."""
input DeleteProjectBySlugAndOrganizationIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  slug: String!
  organizationId: UUID!
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
    userOrganizationByUserIdAndOrganizationId: {
      plan(_$root, args) {
        return resource_user_organizationPgResource.get({
          user_id: args.get("userId"),
          organization_id: args.get("organizationId")
        });
      },
      args: {
        userId: undefined,
        organizationId: undefined
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
    upvoteByPostIdAndUserId: {
      plan(_$root, args) {
        return pgResource_upvotePgResource.get({
          post_id: args.get("postId"),
          user_id: args.get("userId")
        });
      },
      args: {
        postId: undefined,
        userId: undefined
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
    organizationByName: {
      plan(_$root, args) {
        return pgResource_organizationPgResource.get({
          name: args.get("name")
        });
      },
      args: {
        name: undefined
      }
    },
    organizationBySlug: {
      plan(_$root, args) {
        return pgResource_organizationPgResource.get({
          slug: args.get("slug")
        });
      },
      args: {
        slug: undefined
      }
    },
    comment: {
      plan(_$root, args) {
        return pgResource_commentPgResource.get({
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
    userByHidraId: {
      plan(_$root, args) {
        return pgResource_userPgResource.get({
          hidra_id: args.get("hidraId")
        });
      },
      args: {
        hidraId: undefined
      }
    },
    userByUsername: {
      plan(_$root, args) {
        return pgResource_userPgResource.get({
          username: args.get("username")
        });
      },
      args: {
        username: undefined
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
    projectByName: {
      plan(_$root, args) {
        return pgResource_projectPgResource.get({
          name: args.get("name")
        });
      },
      args: {
        name: undefined
      }
    },
    projectBySlugAndOrganizationId: {
      plan(_$root, args) {
        return pgResource_projectPgResource.get({
          slug: args.get("slug"),
          organization_id: args.get("organizationId")
        });
      },
      args: {
        slug: undefined,
        organizationId: undefined
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
    organizationById: {
      plan(_$parent, args) {
        const $nodeId = args.get("id");
        return fetcher2($nodeId);
      },
      args: {
        id: undefined
      }
    },
    commentById: {
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
    userById: {
      plan(_$parent, args) {
        const $nodeId = args.get("id");
        return fetcher5($nodeId);
      },
      args: {
        id: undefined
      }
    },
    projectById: {
      plan(_$parent, args) {
        const $nodeId = args.get("id");
        return fetcher6($nodeId);
      },
      args: {
        id: undefined
      }
    },
    userOrganizations: {
      plan() {
        return connection(resource_user_organizationPgResource.find());
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
            applyOrderToPlan($select, $value, info.schema.getType("UserOrganizationOrderBy"));
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
    comments: {
      plan() {
        return connection(pgResource_commentPgResource.find());
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
            applyOrderToPlan($select, $value, info.schema.getType("CommentOrderBy"));
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
            assertAllowed6(fieldArgs, "object");
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
            assertAllowed7(fieldArgs, "object");
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
  UserOrganization: {
    __assertStep: assertPgClassSingleStep,
    userId($record) {
      return $record.get("user_id");
    },
    organizationId($record) {
      return $record.get("organization_id");
    },
    createdAt($record) {
      return $record.get("created_at");
    },
    organization($record) {
      return pgResource_organizationPgResource.get({
        id: $record.get("organization_id")
      });
    },
    user($record) {
      return pgResource_userPgResource.get({
        id: $record.get("user_id")
      });
    }
  },
  UUID: {
    serialize: UUIDSerialize,
    parseValue(value) {
      return coerce("" + value);
    },
    parseLiteral(ast) {
      if (ast.kind !== Kind.STRING) throw new GraphQLError(`${"UUID" ?? "This scalar"} can only parse string values (kind = '${ast.kind}')`);
      return coerce(ast.value);
    }
  },
  Datetime: {
    serialize: UUIDSerialize,
    parseValue: UUIDSerialize,
    parseLiteral(ast) {
      if (ast.kind !== Kind.STRING) throw new GraphQLError(`${"Datetime" ?? "This scalar"} can only parse string values (kind='${ast.kind}')`);
      return ast.value;
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
      return $record.get("created_at");
    },
    updatedAt($record) {
      return $record.get("updated_at");
    },
    projects: {
      plan($record) {
        const $records = pgResource_projectPgResource.find({
          organization_id: $record.get("id")
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
            assertAllowed8(fieldArgs, "object");
            const $where = $connection.getSubplan().wherePlan();
            if (null) $where.extensions.pgFilterAttribute = {
              codec: null
            };
            fieldArgs.apply($where);
          }
        }
      }
    },
    userOrganizations: {
      plan($record) {
        const $records = resource_user_organizationPgResource.find({
          organization_id: $record.get("id")
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
            applyOrderToPlan($select, $value, info.schema.getType("UserOrganizationOrderBy"));
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
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, !1);
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
    image($record) {
      return $record.get("image");
    },
    slug($record) {
      return $record.get("slug");
    },
    description($record) {
      return $record.get("description");
    },
    organizationId($record) {
      return $record.get("organization_id");
    },
    createdAt($record) {
      return $record.get("created_at");
    },
    updatedAt($record) {
      return $record.get("updated_at");
    },
    organization($record) {
      return pgResource_organizationPgResource.get({
        id: $record.get("organization_id")
      });
    },
    posts: {
      plan($record) {
        const $records = pgResource_postPgResource.find({
          project_id: $record.get("id")
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
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, !1);
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
      return $record.get("project_id");
    },
    userId($record) {
      return $record.get("user_id");
    },
    createdAt($record) {
      return $record.get("created_at");
    },
    updatedAt($record) {
      return $record.get("updated_at");
    },
    project($record) {
      return pgResource_projectPgResource.get({
        id: $record.get("project_id")
      });
    },
    user($record) {
      return pgResource_userPgResource.get({
        id: $record.get("user_id")
      });
    },
    upvotes: {
      plan($record) {
        const $records = pgResource_upvotePgResource.find({
          post_id: $record.get("id")
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
            assertAllowed11(fieldArgs, "object");
            const $where = $connection.getSubplan().wherePlan();
            if (null) $where.extensions.pgFilterAttribute = {
              codec: null
            };
            fieldArgs.apply($where);
          }
        }
      }
    },
    comments: {
      plan($record) {
        const $records = pgResource_commentPgResource.find({
          post_id: $record.get("id")
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
            applyOrderToPlan($select, $value, info.schema.getType("CommentOrderBy"));
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
            assertAllowed12(fieldArgs, "object");
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
    createdAt($record) {
      return $record.get("created_at");
    },
    updatedAt($record) {
      return $record.get("updated_at");
    },
    hidraId($record) {
      return $record.get("hidra_id");
    },
    username($record) {
      return $record.get("username");
    },
    firstName($record) {
      return $record.get("first_name");
    },
    lastName($record) {
      return $record.get("last_name");
    },
    posts: {
      plan($record) {
        const $records = pgResource_postPgResource.find({
          user_id: $record.get("id")
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
            assertAllowed13(fieldArgs, "object");
            const $where = $connection.getSubplan().wherePlan();
            if (null) $where.extensions.pgFilterAttribute = {
              codec: null
            };
            fieldArgs.apply($where);
          }
        }
      }
    },
    upvotes: {
      plan($record) {
        const $records = pgResource_upvotePgResource.find({
          user_id: $record.get("id")
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
            assertAllowed14(fieldArgs, "object");
            const $where = $connection.getSubplan().wherePlan();
            if (null) $where.extensions.pgFilterAttribute = {
              codec: null
            };
            fieldArgs.apply($where);
          }
        }
      }
    },
    userOrganizations: {
      plan($record) {
        const $records = resource_user_organizationPgResource.find({
          user_id: $record.get("id")
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
            applyOrderToPlan($select, $value, info.schema.getType("UserOrganizationOrderBy"));
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
            assertAllowed15(fieldArgs, "object");
            const $where = $connection.getSubplan().wherePlan();
            if (null) $where.extensions.pgFilterAttribute = {
              codec: null
            };
            fieldArgs.apply($where);
          }
        }
      }
    },
    comments: {
      plan($record) {
        const $records = pgResource_commentPgResource.find({
          user_id: $record.get("id")
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
            applyOrderToPlan($select, $value, info.schema.getType("CommentOrderBy"));
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
            assertAllowed16(fieldArgs, "object");
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
  Cursor: {
    serialize: UUIDSerialize,
    parseValue: UUIDSerialize,
    parseLiteral(ast) {
      if (ast.kind !== Kind.STRING) throw new GraphQLError(`${"Cursor" ?? "This scalar"} can only parse string values (kind='${ast.kind}')`);
      return ast.value;
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
    ROW_ID_ASC: {
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
    ROW_ID_DESC: {
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
    },
    USER_ID_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "user_id",
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
          attribute: "user_id",
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
    UPDATED_AT_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "updated_at",
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
          attribute: "updated_at",
          direction: "DESC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (false) plan.setOrderIsUnique();
      }
    },
    UPVOTES_COUNT_ASC: {
      applyPlan($select) {
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(pgResource_upvotePgResource.name));
        relation.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof pgResource_upvotePgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`select count(*)
from ${pgResource_upvotePgResource.from} ${tableAlias}
where ${sql.parens(sql.join(conditions.map(c => sql.parens(c)), " AND "))}`})`;
        $select.orderBy({
          fragment,
          codec: TYPES.bigint,
          direction: "ASC"
        });
      }
    },
    UPVOTES_COUNT_DESC: {
      applyPlan($select) {
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(pgResource_upvotePgResource.name));
        relation.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof pgResource_upvotePgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`select count(*)
from ${pgResource_upvotePgResource.from} ${tableAlias}
where ${sql.parens(sql.join(conditions.map(c => sql.parens(c)), " AND "))}`})`;
        $select.orderBy({
          fragment,
          codec: TYPES.bigint,
          direction: "DESC"
        });
      }
    },
    UPVOTES_DISTINCT_COUNT_ROW_ID_ASC: {
      applyPlan($select) {
        var _a, _b;
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(pgResource_upvotePgResource.name));
        relation.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof pgResource_upvotePgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`
select ${aggregateSpec.sqlAggregateWrap(sql.fragment`${tableAlias}.${sql.identifier("id")}`, spec_upvote.attributes.id.codec)}
from ${pgResource_upvotePgResource.from} ${tableAlias}
where ${sql.join(conditions.map(c => sql.parens(c)), " AND ")}`})`;
        $select.orderBy({
          fragment,
          codec: (_b = (_a = aggregateSpec.pgTypeCodecModifier) === null || _a === void 0 ? void 0 : _a.call(aggregateSpec, spec_upvote.attributes.id.codec)) !== null && _b !== void 0 ? _b : spec_upvote.attributes.id.codec,
          direction: "ASC"
        });
      }
    },
    UPVOTES_DISTINCT_COUNT_ROW_ID_DESC: {
      applyPlan($select) {
        var _a, _b;
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(pgResource_upvotePgResource.name));
        relation.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof pgResource_upvotePgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`
select ${aggregateSpec.sqlAggregateWrap(sql.fragment`${tableAlias}.${sql.identifier("id")}`, spec_upvote.attributes.id.codec)}
from ${pgResource_upvotePgResource.from} ${tableAlias}
where ${sql.join(conditions.map(c => sql.parens(c)), " AND ")}`})`;
        $select.orderBy({
          fragment,
          codec: (_b = (_a = aggregateSpec.pgTypeCodecModifier) === null || _a === void 0 ? void 0 : _a.call(aggregateSpec, spec_upvote.attributes.id.codec)) !== null && _b !== void 0 ? _b : spec_upvote.attributes.id.codec,
          direction: "DESC"
        });
      }
    },
    UPVOTES_DISTINCT_COUNT_POST_ID_ASC: {
      applyPlan($select) {
        var _a, _b;
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(pgResource_upvotePgResource.name));
        relation.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof pgResource_upvotePgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`
select ${aggregateSpec.sqlAggregateWrap(sql.fragment`${tableAlias}.${sql.identifier("post_id")}`, spec_upvote.attributes.post_id.codec)}
from ${pgResource_upvotePgResource.from} ${tableAlias}
where ${sql.join(conditions.map(c => sql.parens(c)), " AND ")}`})`;
        $select.orderBy({
          fragment,
          codec: (_b = (_a = aggregateSpec.pgTypeCodecModifier) === null || _a === void 0 ? void 0 : _a.call(aggregateSpec, spec_upvote.attributes.post_id.codec)) !== null && _b !== void 0 ? _b : spec_upvote.attributes.post_id.codec,
          direction: "ASC"
        });
      }
    },
    UPVOTES_DISTINCT_COUNT_POST_ID_DESC: {
      applyPlan($select) {
        var _a, _b;
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(pgResource_upvotePgResource.name));
        relation.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof pgResource_upvotePgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`
select ${aggregateSpec.sqlAggregateWrap(sql.fragment`${tableAlias}.${sql.identifier("post_id")}`, spec_upvote.attributes.post_id.codec)}
from ${pgResource_upvotePgResource.from} ${tableAlias}
where ${sql.join(conditions.map(c => sql.parens(c)), " AND ")}`})`;
        $select.orderBy({
          fragment,
          codec: (_b = (_a = aggregateSpec.pgTypeCodecModifier) === null || _a === void 0 ? void 0 : _a.call(aggregateSpec, spec_upvote.attributes.post_id.codec)) !== null && _b !== void 0 ? _b : spec_upvote.attributes.post_id.codec,
          direction: "DESC"
        });
      }
    },
    UPVOTES_DISTINCT_COUNT_USER_ID_ASC: {
      applyPlan($select) {
        var _a, _b;
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(pgResource_upvotePgResource.name));
        relation.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof pgResource_upvotePgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`
select ${aggregateSpec.sqlAggregateWrap(sql.fragment`${tableAlias}.${sql.identifier("user_id")}`, spec_upvote.attributes.user_id.codec)}
from ${pgResource_upvotePgResource.from} ${tableAlias}
where ${sql.join(conditions.map(c => sql.parens(c)), " AND ")}`})`;
        $select.orderBy({
          fragment,
          codec: (_b = (_a = aggregateSpec.pgTypeCodecModifier) === null || _a === void 0 ? void 0 : _a.call(aggregateSpec, spec_upvote.attributes.user_id.codec)) !== null && _b !== void 0 ? _b : spec_upvote.attributes.user_id.codec,
          direction: "ASC"
        });
      }
    },
    UPVOTES_DISTINCT_COUNT_USER_ID_DESC: {
      applyPlan($select) {
        var _a, _b;
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(pgResource_upvotePgResource.name));
        relation.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof pgResource_upvotePgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`
select ${aggregateSpec.sqlAggregateWrap(sql.fragment`${tableAlias}.${sql.identifier("user_id")}`, spec_upvote.attributes.user_id.codec)}
from ${pgResource_upvotePgResource.from} ${tableAlias}
where ${sql.join(conditions.map(c => sql.parens(c)), " AND ")}`})`;
        $select.orderBy({
          fragment,
          codec: (_b = (_a = aggregateSpec.pgTypeCodecModifier) === null || _a === void 0 ? void 0 : _a.call(aggregateSpec, spec_upvote.attributes.user_id.codec)) !== null && _b !== void 0 ? _b : spec_upvote.attributes.user_id.codec,
          direction: "DESC"
        });
      }
    },
    UPVOTES_DISTINCT_COUNT_CREATED_AT_ASC: {
      applyPlan($select) {
        var _a, _b;
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(pgResource_upvotePgResource.name));
        relation.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof pgResource_upvotePgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`
select ${aggregateSpec.sqlAggregateWrap(sql.fragment`${tableAlias}.${sql.identifier("created_at")}`, spec_upvote.attributes.created_at.codec)}
from ${pgResource_upvotePgResource.from} ${tableAlias}
where ${sql.join(conditions.map(c => sql.parens(c)), " AND ")}`})`;
        $select.orderBy({
          fragment,
          codec: (_b = (_a = aggregateSpec.pgTypeCodecModifier) === null || _a === void 0 ? void 0 : _a.call(aggregateSpec, spec_upvote.attributes.created_at.codec)) !== null && _b !== void 0 ? _b : spec_upvote.attributes.created_at.codec,
          direction: "ASC"
        });
      }
    },
    UPVOTES_DISTINCT_COUNT_CREATED_AT_DESC: {
      applyPlan($select) {
        var _a, _b;
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(pgResource_upvotePgResource.name));
        relation.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof pgResource_upvotePgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`
select ${aggregateSpec.sqlAggregateWrap(sql.fragment`${tableAlias}.${sql.identifier("created_at")}`, spec_upvote.attributes.created_at.codec)}
from ${pgResource_upvotePgResource.from} ${tableAlias}
where ${sql.join(conditions.map(c => sql.parens(c)), " AND ")}`})`;
        $select.orderBy({
          fragment,
          codec: (_b = (_a = aggregateSpec.pgTypeCodecModifier) === null || _a === void 0 ? void 0 : _a.call(aggregateSpec, spec_upvote.attributes.created_at.codec)) !== null && _b !== void 0 ? _b : spec_upvote.attributes.created_at.codec,
          direction: "DESC"
        });
      }
    },
    UPVOTES_DISTINCT_COUNT_UPDATED_AT_ASC: {
      applyPlan($select) {
        var _a, _b;
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(pgResource_upvotePgResource.name));
        relation.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof pgResource_upvotePgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`
select ${aggregateSpec.sqlAggregateWrap(sql.fragment`${tableAlias}.${sql.identifier("updated_at")}`, spec_upvote.attributes.updated_at.codec)}
from ${pgResource_upvotePgResource.from} ${tableAlias}
where ${sql.join(conditions.map(c => sql.parens(c)), " AND ")}`})`;
        $select.orderBy({
          fragment,
          codec: (_b = (_a = aggregateSpec.pgTypeCodecModifier) === null || _a === void 0 ? void 0 : _a.call(aggregateSpec, spec_upvote.attributes.updated_at.codec)) !== null && _b !== void 0 ? _b : spec_upvote.attributes.updated_at.codec,
          direction: "ASC"
        });
      }
    },
    UPVOTES_DISTINCT_COUNT_UPDATED_AT_DESC: {
      applyPlan($select) {
        var _a, _b;
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(pgResource_upvotePgResource.name));
        relation.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof pgResource_upvotePgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`
select ${aggregateSpec.sqlAggregateWrap(sql.fragment`${tableAlias}.${sql.identifier("updated_at")}`, spec_upvote.attributes.updated_at.codec)}
from ${pgResource_upvotePgResource.from} ${tableAlias}
where ${sql.join(conditions.map(c => sql.parens(c)), " AND ")}`})`;
        $select.orderBy({
          fragment,
          codec: (_b = (_a = aggregateSpec.pgTypeCodecModifier) === null || _a === void 0 ? void 0 : _a.call(aggregateSpec, spec_upvote.attributes.updated_at.codec)) !== null && _b !== void 0 ? _b : spec_upvote.attributes.updated_at.codec,
          direction: "DESC"
        });
      }
    },
    COMMENTS_COUNT_ASC: {
      applyPlan($select) {
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(pgResource_commentPgResource.name));
        relation2.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation2.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof pgResource_commentPgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`select count(*)
from ${pgResource_commentPgResource.from} ${tableAlias}
where ${sql.parens(sql.join(conditions.map(c => sql.parens(c)), " AND "))}`})`;
        $select.orderBy({
          fragment,
          codec: TYPES.bigint,
          direction: "ASC"
        });
      }
    },
    COMMENTS_COUNT_DESC: {
      applyPlan($select) {
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(pgResource_commentPgResource.name));
        relation2.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation2.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof pgResource_commentPgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`select count(*)
from ${pgResource_commentPgResource.from} ${tableAlias}
where ${sql.parens(sql.join(conditions.map(c => sql.parens(c)), " AND "))}`})`;
        $select.orderBy({
          fragment,
          codec: TYPES.bigint,
          direction: "DESC"
        });
      }
    },
    COMMENTS_DISTINCT_COUNT_ROW_ID_ASC: {
      applyPlan($select) {
        var _a, _b;
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(pgResource_commentPgResource.name));
        relation2.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation2.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof pgResource_commentPgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`
select ${aggregateSpec.sqlAggregateWrap(sql.fragment`${tableAlias}.${sql.identifier("id")}`, spec_comment.attributes.id.codec)}
from ${pgResource_commentPgResource.from} ${tableAlias}
where ${sql.join(conditions.map(c => sql.parens(c)), " AND ")}`})`;
        $select.orderBy({
          fragment,
          codec: (_b = (_a = aggregateSpec.pgTypeCodecModifier) === null || _a === void 0 ? void 0 : _a.call(aggregateSpec, spec_comment.attributes.id.codec)) !== null && _b !== void 0 ? _b : spec_comment.attributes.id.codec,
          direction: "ASC"
        });
      }
    },
    COMMENTS_DISTINCT_COUNT_ROW_ID_DESC: {
      applyPlan($select) {
        var _a, _b;
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(pgResource_commentPgResource.name));
        relation2.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation2.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof pgResource_commentPgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`
select ${aggregateSpec.sqlAggregateWrap(sql.fragment`${tableAlias}.${sql.identifier("id")}`, spec_comment.attributes.id.codec)}
from ${pgResource_commentPgResource.from} ${tableAlias}
where ${sql.join(conditions.map(c => sql.parens(c)), " AND ")}`})`;
        $select.orderBy({
          fragment,
          codec: (_b = (_a = aggregateSpec.pgTypeCodecModifier) === null || _a === void 0 ? void 0 : _a.call(aggregateSpec, spec_comment.attributes.id.codec)) !== null && _b !== void 0 ? _b : spec_comment.attributes.id.codec,
          direction: "DESC"
        });
      }
    },
    COMMENTS_DISTINCT_COUNT_MESSAGE_ASC: {
      applyPlan($select) {
        var _a, _b;
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(pgResource_commentPgResource.name));
        relation2.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation2.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof pgResource_commentPgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`
select ${aggregateSpec.sqlAggregateWrap(sql.fragment`${tableAlias}.${sql.identifier("message")}`, spec_comment.attributes.message.codec)}
from ${pgResource_commentPgResource.from} ${tableAlias}
where ${sql.join(conditions.map(c => sql.parens(c)), " AND ")}`})`;
        $select.orderBy({
          fragment,
          codec: (_b = (_a = aggregateSpec.pgTypeCodecModifier) === null || _a === void 0 ? void 0 : _a.call(aggregateSpec, spec_comment.attributes.message.codec)) !== null && _b !== void 0 ? _b : spec_comment.attributes.message.codec,
          direction: "ASC"
        });
      }
    },
    COMMENTS_DISTINCT_COUNT_MESSAGE_DESC: {
      applyPlan($select) {
        var _a, _b;
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(pgResource_commentPgResource.name));
        relation2.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation2.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof pgResource_commentPgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`
select ${aggregateSpec.sqlAggregateWrap(sql.fragment`${tableAlias}.${sql.identifier("message")}`, spec_comment.attributes.message.codec)}
from ${pgResource_commentPgResource.from} ${tableAlias}
where ${sql.join(conditions.map(c => sql.parens(c)), " AND ")}`})`;
        $select.orderBy({
          fragment,
          codec: (_b = (_a = aggregateSpec.pgTypeCodecModifier) === null || _a === void 0 ? void 0 : _a.call(aggregateSpec, spec_comment.attributes.message.codec)) !== null && _b !== void 0 ? _b : spec_comment.attributes.message.codec,
          direction: "DESC"
        });
      }
    },
    COMMENTS_DISTINCT_COUNT_POST_ID_ASC: {
      applyPlan($select) {
        var _a, _b;
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(pgResource_commentPgResource.name));
        relation2.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation2.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof pgResource_commentPgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`
select ${aggregateSpec.sqlAggregateWrap(sql.fragment`${tableAlias}.${sql.identifier("post_id")}`, spec_comment.attributes.post_id.codec)}
from ${pgResource_commentPgResource.from} ${tableAlias}
where ${sql.join(conditions.map(c => sql.parens(c)), " AND ")}`})`;
        $select.orderBy({
          fragment,
          codec: (_b = (_a = aggregateSpec.pgTypeCodecModifier) === null || _a === void 0 ? void 0 : _a.call(aggregateSpec, spec_comment.attributes.post_id.codec)) !== null && _b !== void 0 ? _b : spec_comment.attributes.post_id.codec,
          direction: "ASC"
        });
      }
    },
    COMMENTS_DISTINCT_COUNT_POST_ID_DESC: {
      applyPlan($select) {
        var _a, _b;
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(pgResource_commentPgResource.name));
        relation2.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation2.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof pgResource_commentPgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`
select ${aggregateSpec.sqlAggregateWrap(sql.fragment`${tableAlias}.${sql.identifier("post_id")}`, spec_comment.attributes.post_id.codec)}
from ${pgResource_commentPgResource.from} ${tableAlias}
where ${sql.join(conditions.map(c => sql.parens(c)), " AND ")}`})`;
        $select.orderBy({
          fragment,
          codec: (_b = (_a = aggregateSpec.pgTypeCodecModifier) === null || _a === void 0 ? void 0 : _a.call(aggregateSpec, spec_comment.attributes.post_id.codec)) !== null && _b !== void 0 ? _b : spec_comment.attributes.post_id.codec,
          direction: "DESC"
        });
      }
    },
    COMMENTS_DISTINCT_COUNT_USER_ID_ASC: {
      applyPlan($select) {
        var _a, _b;
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(pgResource_commentPgResource.name));
        relation2.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation2.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof pgResource_commentPgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`
select ${aggregateSpec.sqlAggregateWrap(sql.fragment`${tableAlias}.${sql.identifier("user_id")}`, spec_comment.attributes.user_id.codec)}
from ${pgResource_commentPgResource.from} ${tableAlias}
where ${sql.join(conditions.map(c => sql.parens(c)), " AND ")}`})`;
        $select.orderBy({
          fragment,
          codec: (_b = (_a = aggregateSpec.pgTypeCodecModifier) === null || _a === void 0 ? void 0 : _a.call(aggregateSpec, spec_comment.attributes.user_id.codec)) !== null && _b !== void 0 ? _b : spec_comment.attributes.user_id.codec,
          direction: "ASC"
        });
      }
    },
    COMMENTS_DISTINCT_COUNT_USER_ID_DESC: {
      applyPlan($select) {
        var _a, _b;
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(pgResource_commentPgResource.name));
        relation2.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation2.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof pgResource_commentPgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`
select ${aggregateSpec.sqlAggregateWrap(sql.fragment`${tableAlias}.${sql.identifier("user_id")}`, spec_comment.attributes.user_id.codec)}
from ${pgResource_commentPgResource.from} ${tableAlias}
where ${sql.join(conditions.map(c => sql.parens(c)), " AND ")}`})`;
        $select.orderBy({
          fragment,
          codec: (_b = (_a = aggregateSpec.pgTypeCodecModifier) === null || _a === void 0 ? void 0 : _a.call(aggregateSpec, spec_comment.attributes.user_id.codec)) !== null && _b !== void 0 ? _b : spec_comment.attributes.user_id.codec,
          direction: "DESC"
        });
      }
    },
    COMMENTS_DISTINCT_COUNT_CREATED_AT_ASC: {
      applyPlan($select) {
        var _a, _b;
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(pgResource_commentPgResource.name));
        relation2.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation2.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof pgResource_commentPgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`
select ${aggregateSpec.sqlAggregateWrap(sql.fragment`${tableAlias}.${sql.identifier("created_at")}`, spec_comment.attributes.created_at.codec)}
from ${pgResource_commentPgResource.from} ${tableAlias}
where ${sql.join(conditions.map(c => sql.parens(c)), " AND ")}`})`;
        $select.orderBy({
          fragment,
          codec: (_b = (_a = aggregateSpec.pgTypeCodecModifier) === null || _a === void 0 ? void 0 : _a.call(aggregateSpec, spec_comment.attributes.created_at.codec)) !== null && _b !== void 0 ? _b : spec_comment.attributes.created_at.codec,
          direction: "ASC"
        });
      }
    },
    COMMENTS_DISTINCT_COUNT_CREATED_AT_DESC: {
      applyPlan($select) {
        var _a, _b;
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(pgResource_commentPgResource.name));
        relation2.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation2.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof pgResource_commentPgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`
select ${aggregateSpec.sqlAggregateWrap(sql.fragment`${tableAlias}.${sql.identifier("created_at")}`, spec_comment.attributes.created_at.codec)}
from ${pgResource_commentPgResource.from} ${tableAlias}
where ${sql.join(conditions.map(c => sql.parens(c)), " AND ")}`})`;
        $select.orderBy({
          fragment,
          codec: (_b = (_a = aggregateSpec.pgTypeCodecModifier) === null || _a === void 0 ? void 0 : _a.call(aggregateSpec, spec_comment.attributes.created_at.codec)) !== null && _b !== void 0 ? _b : spec_comment.attributes.created_at.codec,
          direction: "DESC"
        });
      }
    },
    COMMENTS_DISTINCT_COUNT_UPDATED_AT_ASC: {
      applyPlan($select) {
        var _a, _b;
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(pgResource_commentPgResource.name));
        relation2.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation2.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof pgResource_commentPgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`
select ${aggregateSpec.sqlAggregateWrap(sql.fragment`${tableAlias}.${sql.identifier("updated_at")}`, spec_comment.attributes.updated_at.codec)}
from ${pgResource_commentPgResource.from} ${tableAlias}
where ${sql.join(conditions.map(c => sql.parens(c)), " AND ")}`})`;
        $select.orderBy({
          fragment,
          codec: (_b = (_a = aggregateSpec.pgTypeCodecModifier) === null || _a === void 0 ? void 0 : _a.call(aggregateSpec, spec_comment.attributes.updated_at.codec)) !== null && _b !== void 0 ? _b : spec_comment.attributes.updated_at.codec,
          direction: "ASC"
        });
      }
    },
    COMMENTS_DISTINCT_COUNT_UPDATED_AT_DESC: {
      applyPlan($select) {
        var _a, _b;
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(pgResource_commentPgResource.name));
        relation2.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation2.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof pgResource_commentPgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`
select ${aggregateSpec.sqlAggregateWrap(sql.fragment`${tableAlias}.${sql.identifier("updated_at")}`, spec_comment.attributes.updated_at.codec)}
from ${pgResource_commentPgResource.from} ${tableAlias}
where ${sql.join(conditions.map(c => sql.parens(c)), " AND ")}`})`;
        $select.orderBy({
          fragment,
          codec: (_b = (_a = aggregateSpec.pgTypeCodecModifier) === null || _a === void 0 ? void 0 : _a.call(aggregateSpec, spec_comment.attributes.updated_at.codec)) !== null && _b !== void 0 ? _b : spec_comment.attributes.updated_at.codec,
          direction: "DESC"
        });
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
    },
    userId: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) $condition.where({
          type: "attribute",
          attribute: "user_id",
          callback(expression) {
            return sql`${expression} is null`;
          }
        });else $condition.where({
          type: "attribute",
          attribute: "user_id",
          callback(expression) {
            return sql`${expression} = ${$condition.placeholder(val.get(), spec_post.attributes.user_id.codec)}`;
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
    updatedAt: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) $condition.where({
          type: "attribute",
          attribute: "updated_at",
          callback(expression) {
            return sql`${expression} is null`;
          }
        });else $condition.where({
          type: "attribute",
          attribute: "updated_at",
          callback(expression) {
            return sql`${expression} = ${$condition.placeholder(val.get(), spec_post.attributes.updated_at.codec)}`;
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
        $col.extensions.pgFilterAttribute = colSpec;
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
    projectId: {
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
    userId: {
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
    createdAt: {
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
    updatedAt: {
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
    upvotes: {
      applyPlan($where, fieldArgs) {
        assertAllowed17(fieldArgs, "object");
        const $rel = $where.andPlan();
        $rel.extensions.pgFilterRelation = {
          tableExpression: upvoteIdentifier,
          alias: pgResource_upvotePgResource.name,
          localAttributes: registryConfig.pgRelations.post.upvotesByTheirPostId.localAttributes,
          remoteAttributes: registryConfig.pgRelations.post.upvotesByTheirPostId.remoteAttributes
        };
        fieldArgs.apply($rel);
      }
    },
    upvotesExist: {
      applyPlan($where, fieldArgs) {
        assertAllowed17(fieldArgs, "scalar");
        const $subQuery = $where.existsPlan({
          tableExpression: upvoteIdentifier,
          alias: pgResource_upvotePgResource.name,
          $equals: fieldArgs.get()
        });
        registryConfig.pgRelations.post.upvotesByTheirPostId.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = registryConfig.pgRelations.post.upvotesByTheirPostId.remoteAttributes[i];
          $subQuery.where(sql`${$where.alias}.${sql.identifier(localAttribute)} = ${$subQuery.alias}.${sql.identifier(remoteAttribute)}`);
        });
      }
    },
    comments: {
      applyPlan($where, fieldArgs) {
        assertAllowed17(fieldArgs, "object");
        const $rel = $where.andPlan();
        $rel.extensions.pgFilterRelation = {
          tableExpression: commentIdentifier,
          alias: pgResource_commentPgResource.name,
          localAttributes: registryConfig.pgRelations.post.commentsByTheirPostId.localAttributes,
          remoteAttributes: registryConfig.pgRelations.post.commentsByTheirPostId.remoteAttributes
        };
        fieldArgs.apply($rel);
      }
    },
    commentsExist: {
      applyPlan($where, fieldArgs) {
        assertAllowed17(fieldArgs, "scalar");
        const $subQuery = $where.existsPlan({
          tableExpression: commentIdentifier,
          alias: pgResource_commentPgResource.name,
          $equals: fieldArgs.get()
        });
        registryConfig.pgRelations.post.commentsByTheirPostId.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = registryConfig.pgRelations.post.commentsByTheirPostId.remoteAttributes[i];
          $subQuery.where(sql`${$where.alias}.${sql.identifier(localAttribute)} = ${$subQuery.alias}.${sql.identifier(remoteAttribute)}`);
        });
      }
    },
    project: {
      applyPlan($where, fieldArgs) {
        assertAllowed18(fieldArgs, "object");
        const $subQuery = $where.existsPlan({
          tableExpression: projectIdentifier,
          alias: pgResource_projectPgResource.name
        });
        registryConfig.pgRelations.post.projectByMyProjectId.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = registryConfig.pgRelations.post.projectByMyProjectId.remoteAttributes[i];
          $subQuery.where(sql`${$where.alias}.${sql.identifier(localAttribute)} = ${$subQuery.alias}.${sql.identifier(remoteAttribute)}`);
        });
        fieldArgs.apply($subQuery);
      }
    },
    user: {
      applyPlan($where, fieldArgs) {
        assertAllowed18(fieldArgs, "object");
        const $subQuery = $where.existsPlan({
          tableExpression: userIdentifier,
          alias: pgResource_userPgResource.name
        });
        registryConfig.pgRelations.post.userByMyUserId.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = registryConfig.pgRelations.post.userByMyUserId.remoteAttributes[i];
          $subQuery.where(sql`${$where.alias}.${sql.identifier(localAttribute)} = ${$subQuery.alias}.${sql.identifier(remoteAttribute)}`);
        });
        fieldArgs.apply($subQuery);
      }
    },
    and: {
      applyPlan($where, fieldArgs) {
        assertAllowed19(fieldArgs, "list");
        const $and = $where.andPlan();
        fieldArgs.apply($and);
      }
    },
    or: {
      applyPlan($where, fieldArgs) {
        assertAllowed19(fieldArgs, "list");
        const $or = $where.orPlan();
        fieldArgs.apply(() => $or.andPlan());
      }
    },
    not: {
      applyPlan($where, fieldArgs) {
        assertAllowed19(fieldArgs, "object");
        const $and = $where.notPlan().andPlan();
        fieldArgs.apply($and);
      }
    }
  },
  UUIDFilter: {
    isNull: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to `postgraphile-plugin-connection-filter` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            fieldName: parentFieldName,
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
          fragment = resolve(sqlIdentifier, sqlValue, $input, $where, {
            fieldName: parentFieldName ?? null,
            operatorName: "isNull"
          });
        $where.where(fragment);
      }
    },
    equalTo: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to `postgraphile-plugin-connection-filter` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            fieldName: parentFieldName,
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
          fragment = resolve2(sqlIdentifier, sqlValue, $input, $where, {
            fieldName: parentFieldName ?? null,
            operatorName: "equalTo"
          });
        $where.where(fragment);
      }
    },
    notEqualTo: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to `postgraphile-plugin-connection-filter` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            fieldName: parentFieldName,
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
          fragment = resolve3(sqlIdentifier, sqlValue, $input, $where, {
            fieldName: parentFieldName ?? null,
            operatorName: "notEqualTo"
          });
        $where.where(fragment);
      }
    },
    distinctFrom: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to `postgraphile-plugin-connection-filter` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            fieldName: parentFieldName,
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
          fragment = resolve4(sqlIdentifier, sqlValue, $input, $where, {
            fieldName: parentFieldName ?? null,
            operatorName: "distinctFrom"
          });
        $where.where(fragment);
      }
    },
    notDistinctFrom: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to `postgraphile-plugin-connection-filter` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            fieldName: parentFieldName,
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
          fragment = resolve5(sqlIdentifier, sqlValue, $input, $where, {
            fieldName: parentFieldName ?? null,
            operatorName: "notDistinctFrom"
          });
        $where.where(fragment);
      }
    },
    in: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to `postgraphile-plugin-connection-filter` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            fieldName: parentFieldName,
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
          fragment = resolve6(sqlIdentifier, sqlValue, $input, $where, {
            fieldName: parentFieldName ?? null,
            operatorName: "in"
          });
        $where.where(fragment);
      }
    },
    notIn: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to `postgraphile-plugin-connection-filter` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            fieldName: parentFieldName,
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
          fragment = resolve7(sqlIdentifier, sqlValue, $input, $where, {
            fieldName: parentFieldName ?? null,
            operatorName: "notIn"
          });
        $where.where(fragment);
      }
    },
    lessThan: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to `postgraphile-plugin-connection-filter` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            fieldName: parentFieldName,
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
          fragment = resolve8(sqlIdentifier, sqlValue, $input, $where, {
            fieldName: parentFieldName ?? null,
            operatorName: "lessThan"
          });
        $where.where(fragment);
      }
    },
    lessThanOrEqualTo: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to `postgraphile-plugin-connection-filter` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            fieldName: parentFieldName,
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
          fragment = resolve9(sqlIdentifier, sqlValue, $input, $where, {
            fieldName: parentFieldName ?? null,
            operatorName: "lessThanOrEqualTo"
          });
        $where.where(fragment);
      }
    },
    greaterThan: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to `postgraphile-plugin-connection-filter` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            fieldName: parentFieldName,
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
          fragment = resolve10(sqlIdentifier, sqlValue, $input, $where, {
            fieldName: parentFieldName ?? null,
            operatorName: "greaterThan"
          });
        $where.where(fragment);
      }
    },
    greaterThanOrEqualTo: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to `postgraphile-plugin-connection-filter` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            fieldName: parentFieldName,
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
          fragment = resolve11(sqlIdentifier, sqlValue, $input, $where, {
            fieldName: parentFieldName ?? null,
            operatorName: "greaterThanOrEqualTo"
          });
        $where.where(fragment);
      }
    }
  },
  StringFilter: {
    isNull: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to `postgraphile-plugin-connection-filter` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            fieldName: parentFieldName,
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
          fragment = resolve12(sqlIdentifier, sqlValue, $input, $where, {
            fieldName: parentFieldName ?? null,
            operatorName: "isNull"
          });
        $where.where(fragment);
      }
    },
    equalTo: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to `postgraphile-plugin-connection-filter` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            fieldName: parentFieldName,
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
          fragment = resolve13(sqlIdentifier, sqlValue, $input, $where, {
            fieldName: parentFieldName ?? null,
            operatorName: "equalTo"
          });
        $where.where(fragment);
      }
    },
    notEqualTo: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to `postgraphile-plugin-connection-filter` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            fieldName: parentFieldName,
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
          fragment = resolve14(sqlIdentifier, sqlValue, $input, $where, {
            fieldName: parentFieldName ?? null,
            operatorName: "notEqualTo"
          });
        $where.where(fragment);
      }
    },
    distinctFrom: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to `postgraphile-plugin-connection-filter` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            fieldName: parentFieldName,
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
          fragment = resolve15(sqlIdentifier, sqlValue, $input, $where, {
            fieldName: parentFieldName ?? null,
            operatorName: "distinctFrom"
          });
        $where.where(fragment);
      }
    },
    notDistinctFrom: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to `postgraphile-plugin-connection-filter` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            fieldName: parentFieldName,
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
          fragment = resolve16(sqlIdentifier, sqlValue, $input, $where, {
            fieldName: parentFieldName ?? null,
            operatorName: "notDistinctFrom"
          });
        $where.where(fragment);
      }
    },
    in: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to `postgraphile-plugin-connection-filter` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            fieldName: parentFieldName,
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
          fragment = resolve17(sqlIdentifier, sqlValue, $input, $where, {
            fieldName: parentFieldName ?? null,
            operatorName: "in"
          });
        $where.where(fragment);
      }
    },
    notIn: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to `postgraphile-plugin-connection-filter` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            fieldName: parentFieldName,
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
          fragment = resolve18(sqlIdentifier, sqlValue, $input, $where, {
            fieldName: parentFieldName ?? null,
            operatorName: "notIn"
          });
        $where.where(fragment);
      }
    },
    lessThan: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to `postgraphile-plugin-connection-filter` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            fieldName: parentFieldName,
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
          fragment = resolve19(sqlIdentifier, sqlValue, $input, $where, {
            fieldName: parentFieldName ?? null,
            operatorName: "lessThan"
          });
        $where.where(fragment);
      }
    },
    lessThanOrEqualTo: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to `postgraphile-plugin-connection-filter` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            fieldName: parentFieldName,
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
          fragment = resolve20(sqlIdentifier, sqlValue, $input, $where, {
            fieldName: parentFieldName ?? null,
            operatorName: "lessThanOrEqualTo"
          });
        $where.where(fragment);
      }
    },
    greaterThan: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to `postgraphile-plugin-connection-filter` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            fieldName: parentFieldName,
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
          fragment = resolve21(sqlIdentifier, sqlValue, $input, $where, {
            fieldName: parentFieldName ?? null,
            operatorName: "greaterThan"
          });
        $where.where(fragment);
      }
    },
    greaterThanOrEqualTo: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to `postgraphile-plugin-connection-filter` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            fieldName: parentFieldName,
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
          fragment = resolve22(sqlIdentifier, sqlValue, $input, $where, {
            fieldName: parentFieldName ?? null,
            operatorName: "greaterThanOrEqualTo"
          });
        $where.where(fragment);
      }
    },
    includes: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to `postgraphile-plugin-connection-filter` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            fieldName: parentFieldName,
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
        const $resolvedInput = resolveInput ? lambda($input, resolveInput) : $input,
          inputCodec = resolveInputCodec5 ? resolveInputCodec5(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = undefined ? undefined($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve23(sqlIdentifier, sqlValue, $input, $where, {
            fieldName: parentFieldName ?? null,
            operatorName: "includes"
          });
        $where.where(fragment);
      }
    },
    notIncludes: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to `postgraphile-plugin-connection-filter` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            fieldName: parentFieldName,
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
        const $resolvedInput = resolveInput2 ? lambda($input, resolveInput2) : $input,
          inputCodec = resolveInputCodec5 ? resolveInputCodec5(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = undefined ? undefined($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve24(sqlIdentifier, sqlValue, $input, $where, {
            fieldName: parentFieldName ?? null,
            operatorName: "notIncludes"
          });
        $where.where(fragment);
      }
    },
    includesInsensitive: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to `postgraphile-plugin-connection-filter` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            fieldName: parentFieldName,
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
        const $resolvedInput = resolveInput3 ? lambda($input, resolveInput3) : $input,
          inputCodec = resolveInputCodec7 ? resolveInputCodec7(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = undefined ? undefined($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve25(sqlIdentifier, sqlValue, $input, $where, {
            fieldName: parentFieldName ?? null,
            operatorName: "includesInsensitive"
          });
        $where.where(fragment);
      }
    },
    notIncludesInsensitive: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to `postgraphile-plugin-connection-filter` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            fieldName: parentFieldName,
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
        const $resolvedInput = resolveInput4 ? lambda($input, resolveInput4) : $input,
          inputCodec = resolveInputCodec7 ? resolveInputCodec7(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = undefined ? undefined($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve26(sqlIdentifier, sqlValue, $input, $where, {
            fieldName: parentFieldName ?? null,
            operatorName: "notIncludesInsensitive"
          });
        $where.where(fragment);
      }
    },
    startsWith: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to `postgraphile-plugin-connection-filter` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            fieldName: parentFieldName,
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
        const $resolvedInput = resolveInput5 ? lambda($input, resolveInput5) : $input,
          inputCodec = resolveInputCodec5 ? resolveInputCodec5(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = undefined ? undefined($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve27(sqlIdentifier, sqlValue, $input, $where, {
            fieldName: parentFieldName ?? null,
            operatorName: "startsWith"
          });
        $where.where(fragment);
      }
    },
    notStartsWith: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to `postgraphile-plugin-connection-filter` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            fieldName: parentFieldName,
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
        const $resolvedInput = resolveInput6 ? lambda($input, resolveInput6) : $input,
          inputCodec = resolveInputCodec5 ? resolveInputCodec5(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = undefined ? undefined($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve28(sqlIdentifier, sqlValue, $input, $where, {
            fieldName: parentFieldName ?? null,
            operatorName: "notStartsWith"
          });
        $where.where(fragment);
      }
    },
    startsWithInsensitive: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to `postgraphile-plugin-connection-filter` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            fieldName: parentFieldName,
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
        const $resolvedInput = resolveInput7 ? lambda($input, resolveInput7) : $input,
          inputCodec = resolveInputCodec7 ? resolveInputCodec7(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = undefined ? undefined($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve29(sqlIdentifier, sqlValue, $input, $where, {
            fieldName: parentFieldName ?? null,
            operatorName: "startsWithInsensitive"
          });
        $where.where(fragment);
      }
    },
    notStartsWithInsensitive: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to `postgraphile-plugin-connection-filter` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            fieldName: parentFieldName,
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
        const $resolvedInput = resolveInput8 ? lambda($input, resolveInput8) : $input,
          inputCodec = resolveInputCodec7 ? resolveInputCodec7(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = undefined ? undefined($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve30(sqlIdentifier, sqlValue, $input, $where, {
            fieldName: parentFieldName ?? null,
            operatorName: "notStartsWithInsensitive"
          });
        $where.where(fragment);
      }
    },
    endsWith: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to `postgraphile-plugin-connection-filter` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            fieldName: parentFieldName,
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
        const $resolvedInput = resolveInput9 ? lambda($input, resolveInput9) : $input,
          inputCodec = resolveInputCodec5 ? resolveInputCodec5(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = undefined ? undefined($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve31(sqlIdentifier, sqlValue, $input, $where, {
            fieldName: parentFieldName ?? null,
            operatorName: "endsWith"
          });
        $where.where(fragment);
      }
    },
    notEndsWith: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to `postgraphile-plugin-connection-filter` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            fieldName: parentFieldName,
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
        const $resolvedInput = resolveInput10 ? lambda($input, resolveInput10) : $input,
          inputCodec = resolveInputCodec5 ? resolveInputCodec5(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = undefined ? undefined($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve32(sqlIdentifier, sqlValue, $input, $where, {
            fieldName: parentFieldName ?? null,
            operatorName: "notEndsWith"
          });
        $where.where(fragment);
      }
    },
    endsWithInsensitive: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to `postgraphile-plugin-connection-filter` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            fieldName: parentFieldName,
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
        const $resolvedInput = resolveInput11 ? lambda($input, resolveInput11) : $input,
          inputCodec = resolveInputCodec7 ? resolveInputCodec7(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = undefined ? undefined($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve33(sqlIdentifier, sqlValue, $input, $where, {
            fieldName: parentFieldName ?? null,
            operatorName: "endsWithInsensitive"
          });
        $where.where(fragment);
      }
    },
    notEndsWithInsensitive: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to `postgraphile-plugin-connection-filter` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            fieldName: parentFieldName,
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
        const $resolvedInput = resolveInput12 ? lambda($input, resolveInput12) : $input,
          inputCodec = resolveInputCodec7 ? resolveInputCodec7(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = undefined ? undefined($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve34(sqlIdentifier, sqlValue, $input, $where, {
            fieldName: parentFieldName ?? null,
            operatorName: "notEndsWithInsensitive"
          });
        $where.where(fragment);
      }
    },
    like: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to `postgraphile-plugin-connection-filter` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            fieldName: parentFieldName,
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
          fragment = resolve35(sqlIdentifier, sqlValue, $input, $where, {
            fieldName: parentFieldName ?? null,
            operatorName: "like"
          });
        $where.where(fragment);
      }
    },
    notLike: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to `postgraphile-plugin-connection-filter` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            fieldName: parentFieldName,
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
          fragment = resolve36(sqlIdentifier, sqlValue, $input, $where, {
            fieldName: parentFieldName ?? null,
            operatorName: "notLike"
          });
        $where.where(fragment);
      }
    },
    likeInsensitive: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to `postgraphile-plugin-connection-filter` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            fieldName: parentFieldName,
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
          inputCodec = resolveInputCodec7 ? resolveInputCodec7(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = undefined ? undefined($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve37(sqlIdentifier, sqlValue, $input, $where, {
            fieldName: parentFieldName ?? null,
            operatorName: "likeInsensitive"
          });
        $where.where(fragment);
      }
    },
    notLikeInsensitive: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to `postgraphile-plugin-connection-filter` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            fieldName: parentFieldName,
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
          inputCodec = resolveInputCodec7 ? resolveInputCodec7(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = undefined ? undefined($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve38(sqlIdentifier, sqlValue, $input, $where, {
            fieldName: parentFieldName ?? null,
            operatorName: "notLikeInsensitive"
          });
        $where.where(fragment);
      }
    },
    equalToInsensitive: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to `postgraphile-plugin-connection-filter` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            fieldName: parentFieldName,
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
          inputCodec = resolveInputCodec8 ? resolveInputCodec8(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = resolveSqlValue3 ? resolveSqlValue3($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve13(sqlIdentifier, sqlValue, $input, $where, {
            fieldName: parentFieldName ?? null,
            operatorName: "equalToInsensitive"
          });
        $where.where(fragment);
      }
    },
    notEqualToInsensitive: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to `postgraphile-plugin-connection-filter` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            fieldName: parentFieldName,
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
          inputCodec = resolveInputCodec9 ? resolveInputCodec9(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = resolveSqlValue4 ? resolveSqlValue4($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve14(sqlIdentifier, sqlValue, $input, $where, {
            fieldName: parentFieldName ?? null,
            operatorName: "notEqualToInsensitive"
          });
        $where.where(fragment);
      }
    },
    distinctFromInsensitive: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to `postgraphile-plugin-connection-filter` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            fieldName: parentFieldName,
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
          inputCodec = resolveInputCodec10 ? resolveInputCodec10(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = resolveSqlValue5 ? resolveSqlValue5($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve15(sqlIdentifier, sqlValue, $input, $where, {
            fieldName: parentFieldName ?? null,
            operatorName: "distinctFromInsensitive"
          });
        $where.where(fragment);
      }
    },
    notDistinctFromInsensitive: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to `postgraphile-plugin-connection-filter` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            fieldName: parentFieldName,
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
          inputCodec = resolveInputCodec11 ? resolveInputCodec11(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = resolveSqlValue6 ? resolveSqlValue6($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve16(sqlIdentifier, sqlValue, $input, $where, {
            fieldName: parentFieldName ?? null,
            operatorName: "notDistinctFromInsensitive"
          });
        $where.where(fragment);
      }
    },
    inInsensitive: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to `postgraphile-plugin-connection-filter` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            fieldName: parentFieldName,
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
          inputCodec = resolveInputCodec12 ? resolveInputCodec12(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = resolveSqlValue7 ? resolveSqlValue7($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve17(sqlIdentifier, sqlValue, $input, $where, {
            fieldName: parentFieldName ?? null,
            operatorName: "inInsensitive"
          });
        $where.where(fragment);
      }
    },
    notInInsensitive: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to `postgraphile-plugin-connection-filter` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            fieldName: parentFieldName,
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
          inputCodec = resolveInputCodec13 ? resolveInputCodec13(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = resolveSqlValue8 ? resolveSqlValue8($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve18(sqlIdentifier, sqlValue, $input, $where, {
            fieldName: parentFieldName ?? null,
            operatorName: "notInInsensitive"
          });
        $where.where(fragment);
      }
    },
    lessThanInsensitive: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to `postgraphile-plugin-connection-filter` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            fieldName: parentFieldName,
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
          inputCodec = resolveInputCodec14 ? resolveInputCodec14(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = resolveSqlValue9 ? resolveSqlValue9($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve19(sqlIdentifier, sqlValue, $input, $where, {
            fieldName: parentFieldName ?? null,
            operatorName: "lessThanInsensitive"
          });
        $where.where(fragment);
      }
    },
    lessThanOrEqualToInsensitive: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to `postgraphile-plugin-connection-filter` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            fieldName: parentFieldName,
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
          inputCodec = resolveInputCodec15 ? resolveInputCodec15(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = resolveSqlValue10 ? resolveSqlValue10($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve20(sqlIdentifier, sqlValue, $input, $where, {
            fieldName: parentFieldName ?? null,
            operatorName: "lessThanOrEqualToInsensitive"
          });
        $where.where(fragment);
      }
    },
    greaterThanInsensitive: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to `postgraphile-plugin-connection-filter` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            fieldName: parentFieldName,
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
          inputCodec = resolveInputCodec16 ? resolveInputCodec16(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = resolveSqlValue11 ? resolveSqlValue11($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve21(sqlIdentifier, sqlValue, $input, $where, {
            fieldName: parentFieldName ?? null,
            operatorName: "greaterThanInsensitive"
          });
        $where.where(fragment);
      }
    },
    greaterThanOrEqualToInsensitive: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to `postgraphile-plugin-connection-filter` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            fieldName: parentFieldName,
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
          sqlValue = resolveSqlValue12 ? resolveSqlValue12($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve22(sqlIdentifier, sqlValue, $input, $where, {
            fieldName: parentFieldName ?? null,
            operatorName: "greaterThanOrEqualToInsensitive"
          });
        $where.where(fragment);
      }
    }
  },
  DatetimeFilter: {
    isNull: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to `postgraphile-plugin-connection-filter` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            fieldName: parentFieldName,
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
          fragment = resolve39(sqlIdentifier, sqlValue, $input, $where, {
            fieldName: parentFieldName ?? null,
            operatorName: "isNull"
          });
        $where.where(fragment);
      }
    },
    equalTo: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to `postgraphile-plugin-connection-filter` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            fieldName: parentFieldName,
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
          fragment = resolve40(sqlIdentifier, sqlValue, $input, $where, {
            fieldName: parentFieldName ?? null,
            operatorName: "equalTo"
          });
        $where.where(fragment);
      }
    },
    notEqualTo: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to `postgraphile-plugin-connection-filter` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            fieldName: parentFieldName,
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
          fragment = resolve41(sqlIdentifier, sqlValue, $input, $where, {
            fieldName: parentFieldName ?? null,
            operatorName: "notEqualTo"
          });
        $where.where(fragment);
      }
    },
    distinctFrom: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to `postgraphile-plugin-connection-filter` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            fieldName: parentFieldName,
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
          fragment = resolve42(sqlIdentifier, sqlValue, $input, $where, {
            fieldName: parentFieldName ?? null,
            operatorName: "distinctFrom"
          });
        $where.where(fragment);
      }
    },
    notDistinctFrom: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to `postgraphile-plugin-connection-filter` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            fieldName: parentFieldName,
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
          fragment = resolve43(sqlIdentifier, sqlValue, $input, $where, {
            fieldName: parentFieldName ?? null,
            operatorName: "notDistinctFrom"
          });
        $where.where(fragment);
      }
    },
    in: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to `postgraphile-plugin-connection-filter` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            fieldName: parentFieldName,
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
          fragment = resolve44(sqlIdentifier, sqlValue, $input, $where, {
            fieldName: parentFieldName ?? null,
            operatorName: "in"
          });
        $where.where(fragment);
      }
    },
    notIn: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to `postgraphile-plugin-connection-filter` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            fieldName: parentFieldName,
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
          fragment = resolve45(sqlIdentifier, sqlValue, $input, $where, {
            fieldName: parentFieldName ?? null,
            operatorName: "notIn"
          });
        $where.where(fragment);
      }
    },
    lessThan: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to `postgraphile-plugin-connection-filter` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            fieldName: parentFieldName,
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
          fragment = resolve46(sqlIdentifier, sqlValue, $input, $where, {
            fieldName: parentFieldName ?? null,
            operatorName: "lessThan"
          });
        $where.where(fragment);
      }
    },
    lessThanOrEqualTo: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to `postgraphile-plugin-connection-filter` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            fieldName: parentFieldName,
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
          fragment = resolve47(sqlIdentifier, sqlValue, $input, $where, {
            fieldName: parentFieldName ?? null,
            operatorName: "lessThanOrEqualTo"
          });
        $where.where(fragment);
      }
    },
    greaterThan: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to `postgraphile-plugin-connection-filter` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            fieldName: parentFieldName,
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
          fragment = resolve48(sqlIdentifier, sqlValue, $input, $where, {
            fieldName: parentFieldName ?? null,
            operatorName: "greaterThan"
          });
        $where.where(fragment);
      }
    },
    greaterThanOrEqualTo: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to `postgraphile-plugin-connection-filter` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            fieldName: parentFieldName,
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
          fragment = resolve49(sqlIdentifier, sqlValue, $input, $where, {
            fieldName: parentFieldName ?? null,
            operatorName: "greaterThanOrEqualTo"
          });
        $where.where(fragment);
      }
    }
  },
  PostToManyUpvoteFilter: {
    every: {
      applyPlan($where, fieldArgs) {
        assertAllowed20(fieldArgs, "object");
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
        assertAllowed20(fieldArgs, "object");
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
        assertAllowed20(fieldArgs, "object");
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
    },
    aggregates: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions.pgFilterRelation) throw new Error("Invalid use of filter, 'pgFilterRelation' expected");
        const {
            localAttributes,
            remoteAttributes,
            tableExpression,
            alias
          } = $where.extensions.pgFilterRelation,
          $subQuery = new PgAggregateConditionStep($where, {
            sql,
            tableExpression,
            alias
          }, pgWhereConditionSpecListToSQL);
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
        $col.extensions.pgFilterAttribute = colSpec8;
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
        $col.extensions.pgFilterAttribute = colSpec9;
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
        $col.extensions.pgFilterAttribute = colSpec10;
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
        $col.extensions.pgFilterAttribute = colSpec11;
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
        $col.extensions.pgFilterAttribute = colSpec12;
        fieldArgs.apply($col);
      }
    },
    post: {
      applyPlan($where, fieldArgs) {
        assertAllowed21(fieldArgs, "object");
        const $subQuery = $where.existsPlan({
          tableExpression: postIdentifier,
          alias: pgResource_postPgResource.name
        });
        registryConfig.pgRelations.upvote.postByMyPostId.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = registryConfig.pgRelations.upvote.postByMyPostId.remoteAttributes[i];
          $subQuery.where(sql`${$where.alias}.${sql.identifier(localAttribute)} = ${$subQuery.alias}.${sql.identifier(remoteAttribute)}`);
        });
        fieldArgs.apply($subQuery);
      }
    },
    user: {
      applyPlan($where, fieldArgs) {
        assertAllowed21(fieldArgs, "object");
        const $subQuery = $where.existsPlan({
          tableExpression: userIdentifier,
          alias: pgResource_userPgResource.name
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
        assertAllowed22(fieldArgs, "list");
        const $and = $where.andPlan();
        fieldArgs.apply($and);
      }
    },
    or: {
      applyPlan($where, fieldArgs) {
        assertAllowed22(fieldArgs, "list");
        const $or = $where.orPlan();
        fieldArgs.apply(() => $or.andPlan());
      }
    },
    not: {
      applyPlan($where, fieldArgs) {
        assertAllowed22(fieldArgs, "object");
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
    hidraId: {
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
    username: {
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
    firstName: {
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
    lastName: {
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
    posts: {
      applyPlan($where, fieldArgs) {
        assertAllowed23(fieldArgs, "object");
        const $rel = $where.andPlan();
        $rel.extensions.pgFilterRelation = {
          tableExpression: postIdentifier,
          alias: pgResource_postPgResource.name,
          localAttributes: registryConfig.pgRelations.user.postsByTheirUserId.localAttributes,
          remoteAttributes: registryConfig.pgRelations.user.postsByTheirUserId.remoteAttributes
        };
        fieldArgs.apply($rel);
      }
    },
    postsExist: {
      applyPlan($where, fieldArgs) {
        assertAllowed23(fieldArgs, "scalar");
        const $subQuery = $where.existsPlan({
          tableExpression: postIdentifier,
          alias: pgResource_postPgResource.name,
          $equals: fieldArgs.get()
        });
        registryConfig.pgRelations.user.postsByTheirUserId.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = registryConfig.pgRelations.user.postsByTheirUserId.remoteAttributes[i];
          $subQuery.where(sql`${$where.alias}.${sql.identifier(localAttribute)} = ${$subQuery.alias}.${sql.identifier(remoteAttribute)}`);
        });
      }
    },
    upvotes: {
      applyPlan($where, fieldArgs) {
        assertAllowed23(fieldArgs, "object");
        const $rel = $where.andPlan();
        $rel.extensions.pgFilterRelation = {
          tableExpression: upvoteIdentifier,
          alias: pgResource_upvotePgResource.name,
          localAttributes: registryConfig.pgRelations.user.upvotesByTheirUserId.localAttributes,
          remoteAttributes: registryConfig.pgRelations.user.upvotesByTheirUserId.remoteAttributes
        };
        fieldArgs.apply($rel);
      }
    },
    upvotesExist: {
      applyPlan($where, fieldArgs) {
        assertAllowed23(fieldArgs, "scalar");
        const $subQuery = $where.existsPlan({
          tableExpression: upvoteIdentifier,
          alias: pgResource_upvotePgResource.name,
          $equals: fieldArgs.get()
        });
        registryConfig.pgRelations.user.upvotesByTheirUserId.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = registryConfig.pgRelations.user.upvotesByTheirUserId.remoteAttributes[i];
          $subQuery.where(sql`${$where.alias}.${sql.identifier(localAttribute)} = ${$subQuery.alias}.${sql.identifier(remoteAttribute)}`);
        });
      }
    },
    userOrganizations: {
      applyPlan($where, fieldArgs) {
        assertAllowed23(fieldArgs, "object");
        const $rel = $where.andPlan();
        $rel.extensions.pgFilterRelation = {
          tableExpression: userOrganizationIdentifier,
          alias: resource_user_organizationPgResource.name,
          localAttributes: registryConfig.pgRelations.user.userOrganizationsByTheirUserId.localAttributes,
          remoteAttributes: registryConfig.pgRelations.user.userOrganizationsByTheirUserId.remoteAttributes
        };
        fieldArgs.apply($rel);
      }
    },
    userOrganizationsExist: {
      applyPlan($where, fieldArgs) {
        assertAllowed23(fieldArgs, "scalar");
        const $subQuery = $where.existsPlan({
          tableExpression: userOrganizationIdentifier,
          alias: resource_user_organizationPgResource.name,
          $equals: fieldArgs.get()
        });
        registryConfig.pgRelations.user.userOrganizationsByTheirUserId.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = registryConfig.pgRelations.user.userOrganizationsByTheirUserId.remoteAttributes[i];
          $subQuery.where(sql`${$where.alias}.${sql.identifier(localAttribute)} = ${$subQuery.alias}.${sql.identifier(remoteAttribute)}`);
        });
      }
    },
    comments: {
      applyPlan($where, fieldArgs) {
        assertAllowed23(fieldArgs, "object");
        const $rel = $where.andPlan();
        $rel.extensions.pgFilterRelation = {
          tableExpression: commentIdentifier,
          alias: pgResource_commentPgResource.name,
          localAttributes: registryConfig.pgRelations.user.commentsByTheirUserId.localAttributes,
          remoteAttributes: registryConfig.pgRelations.user.commentsByTheirUserId.remoteAttributes
        };
        fieldArgs.apply($rel);
      }
    },
    commentsExist: {
      applyPlan($where, fieldArgs) {
        assertAllowed23(fieldArgs, "scalar");
        const $subQuery = $where.existsPlan({
          tableExpression: commentIdentifier,
          alias: pgResource_commentPgResource.name,
          $equals: fieldArgs.get()
        });
        registryConfig.pgRelations.user.commentsByTheirUserId.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = registryConfig.pgRelations.user.commentsByTheirUserId.remoteAttributes[i];
          $subQuery.where(sql`${$where.alias}.${sql.identifier(localAttribute)} = ${$subQuery.alias}.${sql.identifier(remoteAttribute)}`);
        });
      }
    },
    and: {
      applyPlan($where, fieldArgs) {
        assertAllowed24(fieldArgs, "list");
        const $and = $where.andPlan();
        fieldArgs.apply($and);
      }
    },
    or: {
      applyPlan($where, fieldArgs) {
        assertAllowed24(fieldArgs, "list");
        const $or = $where.orPlan();
        fieldArgs.apply(() => $or.andPlan());
      }
    },
    not: {
      applyPlan($where, fieldArgs) {
        assertAllowed24(fieldArgs, "object");
        const $and = $where.notPlan().andPlan();
        fieldArgs.apply($and);
      }
    }
  },
  UserToManyPostFilter: {
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
    },
    aggregates: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions.pgFilterRelation) throw new Error("Invalid use of filter, 'pgFilterRelation' expected");
        const {
            localAttributes,
            remoteAttributes,
            tableExpression,
            alias
          } = $where.extensions.pgFilterRelation,
          $subQuery = new PgAggregateConditionStep($where, {
            sql,
            tableExpression,
            alias
          }, pgWhereConditionSpecListToSQL);
        localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = remoteAttributes[i];
          $subQuery.where(sql`${$where.alias}.${sql.identifier(localAttribute)} = ${$subQuery.alias}.${sql.identifier(remoteAttribute)}`);
        });
        fieldArgs.apply($subQuery);
      }
    }
  },
  PostAggregatesFilter: {
    filter: {
      applyPlan($subquery, fieldArgs) {
        const $condition = new PgConditionStep($subquery, !1, "AND");
        fieldArgs.apply($condition);
      }
    },
    distinctCount: {
      applyPlan($subquery, fieldArgs) {
        fieldArgs.apply($subquery.forAggregate(aggregateSpec));
      }
    }
  },
  PostDistinctCountAggregateFilter: {
    rowId: {
      applyPlan($parent, fieldArgs) {
        const $col = new PgConditionStep($parent);
        $col.extensions.pgFilterAttribute = {
          codec: TYPES.bigint,
          expression: aggregateSpec.sqlAggregateWrap(sql`${$col.alias}.${sql.identifier("id")}`, spec_post.attributes.id.codec)
        };
        fieldArgs.apply($col);
      }
    },
    title: {
      applyPlan($parent, fieldArgs) {
        const $col = new PgConditionStep($parent);
        $col.extensions.pgFilterAttribute = {
          codec: TYPES.bigint,
          expression: aggregateSpec.sqlAggregateWrap(sql`${$col.alias}.${sql.identifier("title")}`, spec_post.attributes.title.codec)
        };
        fieldArgs.apply($col);
      }
    },
    description: {
      applyPlan($parent, fieldArgs) {
        const $col = new PgConditionStep($parent);
        $col.extensions.pgFilterAttribute = {
          codec: TYPES.bigint,
          expression: aggregateSpec.sqlAggregateWrap(sql`${$col.alias}.${sql.identifier("description")}`, spec_post.attributes.description.codec)
        };
        fieldArgs.apply($col);
      }
    },
    projectId: {
      applyPlan($parent, fieldArgs) {
        const $col = new PgConditionStep($parent);
        $col.extensions.pgFilterAttribute = {
          codec: TYPES.bigint,
          expression: aggregateSpec.sqlAggregateWrap(sql`${$col.alias}.${sql.identifier("project_id")}`, spec_post.attributes.project_id.codec)
        };
        fieldArgs.apply($col);
      }
    },
    userId: {
      applyPlan($parent, fieldArgs) {
        const $col = new PgConditionStep($parent);
        $col.extensions.pgFilterAttribute = {
          codec: TYPES.bigint,
          expression: aggregateSpec.sqlAggregateWrap(sql`${$col.alias}.${sql.identifier("user_id")}`, spec_post.attributes.user_id.codec)
        };
        fieldArgs.apply($col);
      }
    },
    createdAt: {
      applyPlan($parent, fieldArgs) {
        const $col = new PgConditionStep($parent);
        $col.extensions.pgFilterAttribute = {
          codec: TYPES.bigint,
          expression: aggregateSpec.sqlAggregateWrap(sql`${$col.alias}.${sql.identifier("created_at")}`, spec_post.attributes.created_at.codec)
        };
        fieldArgs.apply($col);
      }
    },
    updatedAt: {
      applyPlan($parent, fieldArgs) {
        const $col = new PgConditionStep($parent);
        $col.extensions.pgFilterAttribute = {
          codec: TYPES.bigint,
          expression: aggregateSpec.sqlAggregateWrap(sql`${$col.alias}.${sql.identifier("updated_at")}`, spec_post.attributes.updated_at.codec)
        };
        fieldArgs.apply($col);
      }
    }
  },
  BigIntFilter: {
    isNull: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to `postgraphile-plugin-connection-filter` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            fieldName: parentFieldName,
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
          inputCodec = resolveInputCodec21 ? resolveInputCodec21(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = resolveSqlValue14 ? resolveSqlValue14($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve50(sqlIdentifier, sqlValue, $input, $where, {
            fieldName: parentFieldName ?? null,
            operatorName: "isNull"
          });
        $where.where(fragment);
      }
    },
    equalTo: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to `postgraphile-plugin-connection-filter` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            fieldName: parentFieldName,
            attributeName,
            attribute,
            codec,
            expression
          } = $where.extensions.pgFilterAttribute,
          sourceAlias = attribute ? attribute.expression ? attribute.expression($where.alias) : sql`${$where.alias}.${sql.identifier(attributeName)}` : expression ? expression : $where.alias,
          sourceCodec = codec ?? attribute.codec,
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier15 ? resolveSqlIdentifier15(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = undefined ? lambda($input, undefined) : $input,
          inputCodec = resolveInputCodec22 ? resolveInputCodec22(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = undefined ? undefined($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve51(sqlIdentifier, sqlValue, $input, $where, {
            fieldName: parentFieldName ?? null,
            operatorName: "equalTo"
          });
        $where.where(fragment);
      }
    },
    notEqualTo: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to `postgraphile-plugin-connection-filter` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            fieldName: parentFieldName,
            attributeName,
            attribute,
            codec,
            expression
          } = $where.extensions.pgFilterAttribute,
          sourceAlias = attribute ? attribute.expression ? attribute.expression($where.alias) : sql`${$where.alias}.${sql.identifier(attributeName)}` : expression ? expression : $where.alias,
          sourceCodec = codec ?? attribute.codec,
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier15 ? resolveSqlIdentifier15(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = undefined ? lambda($input, undefined) : $input,
          inputCodec = resolveInputCodec22 ? resolveInputCodec22(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = undefined ? undefined($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve52(sqlIdentifier, sqlValue, $input, $where, {
            fieldName: parentFieldName ?? null,
            operatorName: "notEqualTo"
          });
        $where.where(fragment);
      }
    },
    distinctFrom: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to `postgraphile-plugin-connection-filter` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            fieldName: parentFieldName,
            attributeName,
            attribute,
            codec,
            expression
          } = $where.extensions.pgFilterAttribute,
          sourceAlias = attribute ? attribute.expression ? attribute.expression($where.alias) : sql`${$where.alias}.${sql.identifier(attributeName)}` : expression ? expression : $where.alias,
          sourceCodec = codec ?? attribute.codec,
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier15 ? resolveSqlIdentifier15(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = undefined ? lambda($input, undefined) : $input,
          inputCodec = resolveInputCodec22 ? resolveInputCodec22(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = undefined ? undefined($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve53(sqlIdentifier, sqlValue, $input, $where, {
            fieldName: parentFieldName ?? null,
            operatorName: "distinctFrom"
          });
        $where.where(fragment);
      }
    },
    notDistinctFrom: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to `postgraphile-plugin-connection-filter` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            fieldName: parentFieldName,
            attributeName,
            attribute,
            codec,
            expression
          } = $where.extensions.pgFilterAttribute,
          sourceAlias = attribute ? attribute.expression ? attribute.expression($where.alias) : sql`${$where.alias}.${sql.identifier(attributeName)}` : expression ? expression : $where.alias,
          sourceCodec = codec ?? attribute.codec,
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier15 ? resolveSqlIdentifier15(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = undefined ? lambda($input, undefined) : $input,
          inputCodec = resolveInputCodec22 ? resolveInputCodec22(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = undefined ? undefined($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve54(sqlIdentifier, sqlValue, $input, $where, {
            fieldName: parentFieldName ?? null,
            operatorName: "notDistinctFrom"
          });
        $where.where(fragment);
      }
    },
    in: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to `postgraphile-plugin-connection-filter` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            fieldName: parentFieldName,
            attributeName,
            attribute,
            codec,
            expression
          } = $where.extensions.pgFilterAttribute,
          sourceAlias = attribute ? attribute.expression ? attribute.expression($where.alias) : sql`${$where.alias}.${sql.identifier(attributeName)}` : expression ? expression : $where.alias,
          sourceCodec = codec ?? attribute.codec,
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier15 ? resolveSqlIdentifier15(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = undefined ? lambda($input, undefined) : $input,
          inputCodec = resolveInputCodec23 ? resolveInputCodec23(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = undefined ? undefined($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve55(sqlIdentifier, sqlValue, $input, $where, {
            fieldName: parentFieldName ?? null,
            operatorName: "in"
          });
        $where.where(fragment);
      }
    },
    notIn: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to `postgraphile-plugin-connection-filter` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            fieldName: parentFieldName,
            attributeName,
            attribute,
            codec,
            expression
          } = $where.extensions.pgFilterAttribute,
          sourceAlias = attribute ? attribute.expression ? attribute.expression($where.alias) : sql`${$where.alias}.${sql.identifier(attributeName)}` : expression ? expression : $where.alias,
          sourceCodec = codec ?? attribute.codec,
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier15 ? resolveSqlIdentifier15(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = undefined ? lambda($input, undefined) : $input,
          inputCodec = resolveInputCodec23 ? resolveInputCodec23(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = undefined ? undefined($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve56(sqlIdentifier, sqlValue, $input, $where, {
            fieldName: parentFieldName ?? null,
            operatorName: "notIn"
          });
        $where.where(fragment);
      }
    },
    lessThan: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to `postgraphile-plugin-connection-filter` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            fieldName: parentFieldName,
            attributeName,
            attribute,
            codec,
            expression
          } = $where.extensions.pgFilterAttribute,
          sourceAlias = attribute ? attribute.expression ? attribute.expression($where.alias) : sql`${$where.alias}.${sql.identifier(attributeName)}` : expression ? expression : $where.alias,
          sourceCodec = codec ?? attribute.codec,
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier15 ? resolveSqlIdentifier15(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = undefined ? lambda($input, undefined) : $input,
          inputCodec = resolveInputCodec22 ? resolveInputCodec22(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = undefined ? undefined($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve57(sqlIdentifier, sqlValue, $input, $where, {
            fieldName: parentFieldName ?? null,
            operatorName: "lessThan"
          });
        $where.where(fragment);
      }
    },
    lessThanOrEqualTo: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to `postgraphile-plugin-connection-filter` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            fieldName: parentFieldName,
            attributeName,
            attribute,
            codec,
            expression
          } = $where.extensions.pgFilterAttribute,
          sourceAlias = attribute ? attribute.expression ? attribute.expression($where.alias) : sql`${$where.alias}.${sql.identifier(attributeName)}` : expression ? expression : $where.alias,
          sourceCodec = codec ?? attribute.codec,
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier15 ? resolveSqlIdentifier15(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = undefined ? lambda($input, undefined) : $input,
          inputCodec = resolveInputCodec22 ? resolveInputCodec22(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = undefined ? undefined($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve58(sqlIdentifier, sqlValue, $input, $where, {
            fieldName: parentFieldName ?? null,
            operatorName: "lessThanOrEqualTo"
          });
        $where.where(fragment);
      }
    },
    greaterThan: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to `postgraphile-plugin-connection-filter` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            fieldName: parentFieldName,
            attributeName,
            attribute,
            codec,
            expression
          } = $where.extensions.pgFilterAttribute,
          sourceAlias = attribute ? attribute.expression ? attribute.expression($where.alias) : sql`${$where.alias}.${sql.identifier(attributeName)}` : expression ? expression : $where.alias,
          sourceCodec = codec ?? attribute.codec,
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier15 ? resolveSqlIdentifier15(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = undefined ? lambda($input, undefined) : $input,
          inputCodec = resolveInputCodec22 ? resolveInputCodec22(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = undefined ? undefined($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve59(sqlIdentifier, sqlValue, $input, $where, {
            fieldName: parentFieldName ?? null,
            operatorName: "greaterThan"
          });
        $where.where(fragment);
      }
    },
    greaterThanOrEqualTo: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to `postgraphile-plugin-connection-filter` does not implement the required interfaces.");
        const $input = fieldArgs.getRaw();
        if ($input.evalIs(void 0)) return;
        const {
            fieldName: parentFieldName,
            attributeName,
            attribute,
            codec,
            expression
          } = $where.extensions.pgFilterAttribute,
          sourceAlias = attribute ? attribute.expression ? attribute.expression($where.alias) : sql`${$where.alias}.${sql.identifier(attributeName)}` : expression ? expression : $where.alias,
          sourceCodec = codec ?? attribute.codec,
          [sqlIdentifier, identifierCodec] = resolveSqlIdentifier15 ? resolveSqlIdentifier15(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
        if (false && $input.evalIs(null)) return;
        if (!false && $input.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $resolvedInput = undefined ? lambda($input, undefined) : $input,
          inputCodec = resolveInputCodec22 ? resolveInputCodec22(codec ?? attribute.codec) : codec ?? attribute.codec,
          sqlValue = undefined ? undefined($where, $input, inputCodec) : $where.placeholder($resolvedInput, inputCodec),
          fragment = resolve60(sqlIdentifier, sqlValue, $input, $where, {
            fieldName: parentFieldName ?? null,
            operatorName: "greaterThanOrEqualTo"
          });
        $where.where(fragment);
      }
    }
  },
  BigInt: {
    serialize: UUIDSerialize,
    parseValue: UUIDSerialize,
    parseLiteral(ast) {
      if (ast.kind !== Kind.STRING) throw new GraphQLError(`${"BigInt" ?? "This scalar"} can only parse string values (kind='${ast.kind}')`);
      return ast.value;
    }
  },
  UserToManyUpvoteFilter: {
    every: {
      applyPlan($where, fieldArgs) {
        assertAllowed26(fieldArgs, "object");
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
        assertAllowed26(fieldArgs, "object");
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
        assertAllowed26(fieldArgs, "object");
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
    },
    aggregates: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions.pgFilterRelation) throw new Error("Invalid use of filter, 'pgFilterRelation' expected");
        const {
            localAttributes,
            remoteAttributes,
            tableExpression,
            alias
          } = $where.extensions.pgFilterRelation,
          $subQuery = new PgAggregateConditionStep($where, {
            sql,
            tableExpression,
            alias
          }, pgWhereConditionSpecListToSQL);
        localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = remoteAttributes[i];
          $subQuery.where(sql`${$where.alias}.${sql.identifier(localAttribute)} = ${$subQuery.alias}.${sql.identifier(remoteAttribute)}`);
        });
        fieldArgs.apply($subQuery);
      }
    }
  },
  UpvoteAggregatesFilter: {
    filter: {
      applyPlan($subquery, fieldArgs) {
        const $condition = new PgConditionStep($subquery, !1, "AND");
        fieldArgs.apply($condition);
      }
    },
    distinctCount: {
      applyPlan($subquery, fieldArgs) {
        fieldArgs.apply($subquery.forAggregate(aggregateSpec));
      }
    }
  },
  UpvoteDistinctCountAggregateFilter: {
    rowId: {
      applyPlan($parent, fieldArgs) {
        const $col = new PgConditionStep($parent);
        $col.extensions.pgFilterAttribute = {
          codec: TYPES.bigint,
          expression: aggregateSpec.sqlAggregateWrap(sql`${$col.alias}.${sql.identifier("id")}`, spec_upvote.attributes.id.codec)
        };
        fieldArgs.apply($col);
      }
    },
    postId: {
      applyPlan($parent, fieldArgs) {
        const $col = new PgConditionStep($parent);
        $col.extensions.pgFilterAttribute = {
          codec: TYPES.bigint,
          expression: aggregateSpec.sqlAggregateWrap(sql`${$col.alias}.${sql.identifier("post_id")}`, spec_upvote.attributes.post_id.codec)
        };
        fieldArgs.apply($col);
      }
    },
    userId: {
      applyPlan($parent, fieldArgs) {
        const $col = new PgConditionStep($parent);
        $col.extensions.pgFilterAttribute = {
          codec: TYPES.bigint,
          expression: aggregateSpec.sqlAggregateWrap(sql`${$col.alias}.${sql.identifier("user_id")}`, spec_upvote.attributes.user_id.codec)
        };
        fieldArgs.apply($col);
      }
    },
    createdAt: {
      applyPlan($parent, fieldArgs) {
        const $col = new PgConditionStep($parent);
        $col.extensions.pgFilterAttribute = {
          codec: TYPES.bigint,
          expression: aggregateSpec.sqlAggregateWrap(sql`${$col.alias}.${sql.identifier("created_at")}`, spec_upvote.attributes.created_at.codec)
        };
        fieldArgs.apply($col);
      }
    },
    updatedAt: {
      applyPlan($parent, fieldArgs) {
        const $col = new PgConditionStep($parent);
        $col.extensions.pgFilterAttribute = {
          codec: TYPES.bigint,
          expression: aggregateSpec.sqlAggregateWrap(sql`${$col.alias}.${sql.identifier("updated_at")}`, spec_upvote.attributes.updated_at.codec)
        };
        fieldArgs.apply($col);
      }
    }
  },
  UserToManyUserOrganizationFilter: {
    every: {
      applyPlan($where, fieldArgs) {
        assertAllowed27(fieldArgs, "object");
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
        assertAllowed27(fieldArgs, "object");
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
        assertAllowed27(fieldArgs, "object");
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
    },
    aggregates: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions.pgFilterRelation) throw new Error("Invalid use of filter, 'pgFilterRelation' expected");
        const {
            localAttributes,
            remoteAttributes,
            tableExpression,
            alias
          } = $where.extensions.pgFilterRelation,
          $subQuery = new PgAggregateConditionStep($where, {
            sql,
            tableExpression,
            alias
          }, pgWhereConditionSpecListToSQL);
        localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = remoteAttributes[i];
          $subQuery.where(sql`${$where.alias}.${sql.identifier(localAttribute)} = ${$subQuery.alias}.${sql.identifier(remoteAttribute)}`);
        });
        fieldArgs.apply($subQuery);
      }
    }
  },
  UserOrganizationFilter: {
    userId: {
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
    organizationId: {
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
    createdAt: {
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
    organization: {
      applyPlan($where, fieldArgs) {
        assertAllowed28(fieldArgs, "object");
        const $subQuery = $where.existsPlan({
          tableExpression: organizationIdentifier,
          alias: pgResource_organizationPgResource.name
        });
        registryConfig.pgRelations.userOrganization.organizationByMyOrganizationId.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = registryConfig.pgRelations.userOrganization.organizationByMyOrganizationId.remoteAttributes[i];
          $subQuery.where(sql`${$where.alias}.${sql.identifier(localAttribute)} = ${$subQuery.alias}.${sql.identifier(remoteAttribute)}`);
        });
        fieldArgs.apply($subQuery);
      }
    },
    user: {
      applyPlan($where, fieldArgs) {
        assertAllowed28(fieldArgs, "object");
        const $subQuery = $where.existsPlan({
          tableExpression: userIdentifier,
          alias: pgResource_userPgResource.name
        });
        registryConfig.pgRelations.userOrganization.userByMyUserId.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = registryConfig.pgRelations.userOrganization.userByMyUserId.remoteAttributes[i];
          $subQuery.where(sql`${$where.alias}.${sql.identifier(localAttribute)} = ${$subQuery.alias}.${sql.identifier(remoteAttribute)}`);
        });
        fieldArgs.apply($subQuery);
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
  OrganizationFilter: {
    rowId: {
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
    name: {
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
    slug: {
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
    createdAt: {
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
    updatedAt: {
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
    projects: {
      applyPlan($where, fieldArgs) {
        assertAllowed30(fieldArgs, "object");
        const $rel = $where.andPlan();
        $rel.extensions.pgFilterRelation = {
          tableExpression: projectIdentifier,
          alias: pgResource_projectPgResource.name,
          localAttributes: registryConfig.pgRelations.organization.projectsByTheirOrganizationId.localAttributes,
          remoteAttributes: registryConfig.pgRelations.organization.projectsByTheirOrganizationId.remoteAttributes
        };
        fieldArgs.apply($rel);
      }
    },
    projectsExist: {
      applyPlan($where, fieldArgs) {
        assertAllowed30(fieldArgs, "scalar");
        const $subQuery = $where.existsPlan({
          tableExpression: projectIdentifier,
          alias: pgResource_projectPgResource.name,
          $equals: fieldArgs.get()
        });
        registryConfig.pgRelations.organization.projectsByTheirOrganizationId.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = registryConfig.pgRelations.organization.projectsByTheirOrganizationId.remoteAttributes[i];
          $subQuery.where(sql`${$where.alias}.${sql.identifier(localAttribute)} = ${$subQuery.alias}.${sql.identifier(remoteAttribute)}`);
        });
      }
    },
    userOrganizations: {
      applyPlan($where, fieldArgs) {
        assertAllowed30(fieldArgs, "object");
        const $rel = $where.andPlan();
        $rel.extensions.pgFilterRelation = {
          tableExpression: userOrganizationIdentifier,
          alias: resource_user_organizationPgResource.name,
          localAttributes: registryConfig.pgRelations.organization.userOrganizationsByTheirOrganizationId.localAttributes,
          remoteAttributes: registryConfig.pgRelations.organization.userOrganizationsByTheirOrganizationId.remoteAttributes
        };
        fieldArgs.apply($rel);
      }
    },
    userOrganizationsExist: {
      applyPlan($where, fieldArgs) {
        assertAllowed30(fieldArgs, "scalar");
        const $subQuery = $where.existsPlan({
          tableExpression: userOrganizationIdentifier,
          alias: resource_user_organizationPgResource.name,
          $equals: fieldArgs.get()
        });
        registryConfig.pgRelations.organization.userOrganizationsByTheirOrganizationId.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = registryConfig.pgRelations.organization.userOrganizationsByTheirOrganizationId.remoteAttributes[i];
          $subQuery.where(sql`${$where.alias}.${sql.identifier(localAttribute)} = ${$subQuery.alias}.${sql.identifier(remoteAttribute)}`);
        });
      }
    },
    and: {
      applyPlan($where, fieldArgs) {
        assertAllowed31(fieldArgs, "list");
        const $and = $where.andPlan();
        fieldArgs.apply($and);
      }
    },
    or: {
      applyPlan($where, fieldArgs) {
        assertAllowed31(fieldArgs, "list");
        const $or = $where.orPlan();
        fieldArgs.apply(() => $or.andPlan());
      }
    },
    not: {
      applyPlan($where, fieldArgs) {
        assertAllowed31(fieldArgs, "object");
        const $and = $where.notPlan().andPlan();
        fieldArgs.apply($and);
      }
    }
  },
  OrganizationToManyProjectFilter: {
    every: {
      applyPlan($where, fieldArgs) {
        assertAllowed32(fieldArgs, "object");
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
        assertAllowed32(fieldArgs, "object");
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
        assertAllowed32(fieldArgs, "object");
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
    },
    aggregates: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions.pgFilterRelation) throw new Error("Invalid use of filter, 'pgFilterRelation' expected");
        const {
            localAttributes,
            remoteAttributes,
            tableExpression,
            alias
          } = $where.extensions.pgFilterRelation,
          $subQuery = new PgAggregateConditionStep($where, {
            sql,
            tableExpression,
            alias
          }, pgWhereConditionSpecListToSQL);
        localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = remoteAttributes[i];
          $subQuery.where(sql`${$where.alias}.${sql.identifier(localAttribute)} = ${$subQuery.alias}.${sql.identifier(remoteAttribute)}`);
        });
        fieldArgs.apply($subQuery);
      }
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
        $col.extensions.pgFilterAttribute = colSpec28;
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
        $col.extensions.pgFilterAttribute = colSpec29;
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
        $col.extensions.pgFilterAttribute = colSpec30;
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
        $col.extensions.pgFilterAttribute = colSpec31;
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
        $col.extensions.pgFilterAttribute = colSpec32;
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
        $col.extensions.pgFilterAttribute = colSpec33;
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
        $col.extensions.pgFilterAttribute = colSpec34;
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
        $col.extensions.pgFilterAttribute = colSpec35;
        fieldArgs.apply($col);
      }
    },
    posts: {
      applyPlan($where, fieldArgs) {
        assertAllowed33(fieldArgs, "object");
        const $rel = $where.andPlan();
        $rel.extensions.pgFilterRelation = {
          tableExpression: postIdentifier,
          alias: pgResource_postPgResource.name,
          localAttributes: registryConfig.pgRelations.project.postsByTheirProjectId.localAttributes,
          remoteAttributes: registryConfig.pgRelations.project.postsByTheirProjectId.remoteAttributes
        };
        fieldArgs.apply($rel);
      }
    },
    postsExist: {
      applyPlan($where, fieldArgs) {
        assertAllowed33(fieldArgs, "scalar");
        const $subQuery = $where.existsPlan({
          tableExpression: postIdentifier,
          alias: pgResource_postPgResource.name,
          $equals: fieldArgs.get()
        });
        registryConfig.pgRelations.project.postsByTheirProjectId.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = registryConfig.pgRelations.project.postsByTheirProjectId.remoteAttributes[i];
          $subQuery.where(sql`${$where.alias}.${sql.identifier(localAttribute)} = ${$subQuery.alias}.${sql.identifier(remoteAttribute)}`);
        });
      }
    },
    organization: {
      applyPlan($where, fieldArgs) {
        assertAllowed34(fieldArgs, "object");
        const $subQuery = $where.existsPlan({
          tableExpression: organizationIdentifier,
          alias: pgResource_organizationPgResource.name
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
        assertAllowed35(fieldArgs, "list");
        const $and = $where.andPlan();
        fieldArgs.apply($and);
      }
    },
    or: {
      applyPlan($where, fieldArgs) {
        assertAllowed35(fieldArgs, "list");
        const $or = $where.orPlan();
        fieldArgs.apply(() => $or.andPlan());
      }
    },
    not: {
      applyPlan($where, fieldArgs) {
        assertAllowed35(fieldArgs, "object");
        const $and = $where.notPlan().andPlan();
        fieldArgs.apply($and);
      }
    }
  },
  ProjectToManyPostFilter: {
    every: {
      applyPlan($where, fieldArgs) {
        assertAllowed36(fieldArgs, "object");
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
        assertAllowed36(fieldArgs, "object");
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
        assertAllowed36(fieldArgs, "object");
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
    },
    aggregates: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions.pgFilterRelation) throw new Error("Invalid use of filter, 'pgFilterRelation' expected");
        const {
            localAttributes,
            remoteAttributes,
            tableExpression,
            alias
          } = $where.extensions.pgFilterRelation,
          $subQuery = new PgAggregateConditionStep($where, {
            sql,
            tableExpression,
            alias
          }, pgWhereConditionSpecListToSQL);
        localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = remoteAttributes[i];
          $subQuery.where(sql`${$where.alias}.${sql.identifier(localAttribute)} = ${$subQuery.alias}.${sql.identifier(remoteAttribute)}`);
        });
        fieldArgs.apply($subQuery);
      }
    }
  },
  ProjectAggregatesFilter: {
    filter: {
      applyPlan($subquery, fieldArgs) {
        const $condition = new PgConditionStep($subquery, !1, "AND");
        fieldArgs.apply($condition);
      }
    },
    distinctCount: {
      applyPlan($subquery, fieldArgs) {
        fieldArgs.apply($subquery.forAggregate(aggregateSpec));
      }
    }
  },
  ProjectDistinctCountAggregateFilter: {
    rowId: {
      applyPlan($parent, fieldArgs) {
        const $col = new PgConditionStep($parent);
        $col.extensions.pgFilterAttribute = {
          codec: TYPES.bigint,
          expression: aggregateSpec.sqlAggregateWrap(sql`${$col.alias}.${sql.identifier("id")}`, spec_project.attributes.id.codec)
        };
        fieldArgs.apply($col);
      }
    },
    name: {
      applyPlan($parent, fieldArgs) {
        const $col = new PgConditionStep($parent);
        $col.extensions.pgFilterAttribute = {
          codec: TYPES.bigint,
          expression: aggregateSpec.sqlAggregateWrap(sql`${$col.alias}.${sql.identifier("name")}`, spec_project.attributes.name.codec)
        };
        fieldArgs.apply($col);
      }
    },
    image: {
      applyPlan($parent, fieldArgs) {
        const $col = new PgConditionStep($parent);
        $col.extensions.pgFilterAttribute = {
          codec: TYPES.bigint,
          expression: aggregateSpec.sqlAggregateWrap(sql`${$col.alias}.${sql.identifier("image")}`, spec_project.attributes.image.codec)
        };
        fieldArgs.apply($col);
      }
    },
    slug: {
      applyPlan($parent, fieldArgs) {
        const $col = new PgConditionStep($parent);
        $col.extensions.pgFilterAttribute = {
          codec: TYPES.bigint,
          expression: aggregateSpec.sqlAggregateWrap(sql`${$col.alias}.${sql.identifier("slug")}`, spec_project.attributes.slug.codec)
        };
        fieldArgs.apply($col);
      }
    },
    description: {
      applyPlan($parent, fieldArgs) {
        const $col = new PgConditionStep($parent);
        $col.extensions.pgFilterAttribute = {
          codec: TYPES.bigint,
          expression: aggregateSpec.sqlAggregateWrap(sql`${$col.alias}.${sql.identifier("description")}`, spec_project.attributes.description.codec)
        };
        fieldArgs.apply($col);
      }
    },
    organizationId: {
      applyPlan($parent, fieldArgs) {
        const $col = new PgConditionStep($parent);
        $col.extensions.pgFilterAttribute = {
          codec: TYPES.bigint,
          expression: aggregateSpec.sqlAggregateWrap(sql`${$col.alias}.${sql.identifier("organization_id")}`, spec_project.attributes.organization_id.codec)
        };
        fieldArgs.apply($col);
      }
    },
    createdAt: {
      applyPlan($parent, fieldArgs) {
        const $col = new PgConditionStep($parent);
        $col.extensions.pgFilterAttribute = {
          codec: TYPES.bigint,
          expression: aggregateSpec.sqlAggregateWrap(sql`${$col.alias}.${sql.identifier("created_at")}`, spec_project.attributes.created_at.codec)
        };
        fieldArgs.apply($col);
      }
    },
    updatedAt: {
      applyPlan($parent, fieldArgs) {
        const $col = new PgConditionStep($parent);
        $col.extensions.pgFilterAttribute = {
          codec: TYPES.bigint,
          expression: aggregateSpec.sqlAggregateWrap(sql`${$col.alias}.${sql.identifier("updated_at")}`, spec_project.attributes.updated_at.codec)
        };
        fieldArgs.apply($col);
      }
    }
  },
  OrganizationToManyUserOrganizationFilter: {
    every: {
      applyPlan($where, fieldArgs) {
        assertAllowed37(fieldArgs, "object");
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
        assertAllowed37(fieldArgs, "object");
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
        assertAllowed37(fieldArgs, "object");
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
    },
    aggregates: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions.pgFilterRelation) throw new Error("Invalid use of filter, 'pgFilterRelation' expected");
        const {
            localAttributes,
            remoteAttributes,
            tableExpression,
            alias
          } = $where.extensions.pgFilterRelation,
          $subQuery = new PgAggregateConditionStep($where, {
            sql,
            tableExpression,
            alias
          }, pgWhereConditionSpecListToSQL);
        localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = remoteAttributes[i];
          $subQuery.where(sql`${$where.alias}.${sql.identifier(localAttribute)} = ${$subQuery.alias}.${sql.identifier(remoteAttribute)}`);
        });
        fieldArgs.apply($subQuery);
      }
    }
  },
  UserOrganizationAggregatesFilter: {
    filter: {
      applyPlan($subquery, fieldArgs) {
        const $condition = new PgConditionStep($subquery, !1, "AND");
        fieldArgs.apply($condition);
      }
    },
    distinctCount: {
      applyPlan($subquery, fieldArgs) {
        fieldArgs.apply($subquery.forAggregate(aggregateSpec));
      }
    }
  },
  UserOrganizationDistinctCountAggregateFilter: {
    userId: {
      applyPlan($parent, fieldArgs) {
        const $col = new PgConditionStep($parent);
        $col.extensions.pgFilterAttribute = {
          codec: TYPES.bigint,
          expression: aggregateSpec.sqlAggregateWrap(sql`${$col.alias}.${sql.identifier("user_id")}`, spec_userOrganization.attributes.user_id.codec)
        };
        fieldArgs.apply($col);
      }
    },
    organizationId: {
      applyPlan($parent, fieldArgs) {
        const $col = new PgConditionStep($parent);
        $col.extensions.pgFilterAttribute = {
          codec: TYPES.bigint,
          expression: aggregateSpec.sqlAggregateWrap(sql`${$col.alias}.${sql.identifier("organization_id")}`, spec_userOrganization.attributes.organization_id.codec)
        };
        fieldArgs.apply($col);
      }
    },
    createdAt: {
      applyPlan($parent, fieldArgs) {
        const $col = new PgConditionStep($parent);
        $col.extensions.pgFilterAttribute = {
          codec: TYPES.bigint,
          expression: aggregateSpec.sqlAggregateWrap(sql`${$col.alias}.${sql.identifier("created_at")}`, spec_userOrganization.attributes.created_at.codec)
        };
        fieldArgs.apply($col);
      }
    }
  },
  UserToManyCommentFilter: {
    every: {
      applyPlan($where, fieldArgs) {
        assertAllowed38(fieldArgs, "object");
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
        assertAllowed38(fieldArgs, "object");
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
        assertAllowed38(fieldArgs, "object");
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
    },
    aggregates: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions.pgFilterRelation) throw new Error("Invalid use of filter, 'pgFilterRelation' expected");
        const {
            localAttributes,
            remoteAttributes,
            tableExpression,
            alias
          } = $where.extensions.pgFilterRelation,
          $subQuery = new PgAggregateConditionStep($where, {
            sql,
            tableExpression,
            alias
          }, pgWhereConditionSpecListToSQL);
        localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = remoteAttributes[i];
          $subQuery.where(sql`${$where.alias}.${sql.identifier(localAttribute)} = ${$subQuery.alias}.${sql.identifier(remoteAttribute)}`);
        });
        fieldArgs.apply($subQuery);
      }
    }
  },
  CommentFilter: {
    rowId: {
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
    message: {
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
    postId: {
      applyPlan($where, fieldArgs) {
        const $raw = fieldArgs.getRaw();
        if ($raw.evalIs(void 0)) return;
        if (!false && "evalIsEmpty" in $raw && $raw.evalIsEmpty()) throw Object.assign(new Error("Empty objects are forbidden in filter argument input."), {});
        if (!false && $raw.evalIs(null)) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
        const $col = new PgConditionStep($where);
        $col.extensions.pgFilterAttribute = colSpec38;
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
        $col.extensions.pgFilterAttribute = colSpec39;
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
        $col.extensions.pgFilterAttribute = colSpec40;
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
        $col.extensions.pgFilterAttribute = colSpec41;
        fieldArgs.apply($col);
      }
    },
    post: {
      applyPlan($where, fieldArgs) {
        assertAllowed39(fieldArgs, "object");
        const $subQuery = $where.existsPlan({
          tableExpression: postIdentifier,
          alias: pgResource_postPgResource.name
        });
        registryConfig.pgRelations.comment.postByMyPostId.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = registryConfig.pgRelations.comment.postByMyPostId.remoteAttributes[i];
          $subQuery.where(sql`${$where.alias}.${sql.identifier(localAttribute)} = ${$subQuery.alias}.${sql.identifier(remoteAttribute)}`);
        });
        fieldArgs.apply($subQuery);
      }
    },
    user: {
      applyPlan($where, fieldArgs) {
        assertAllowed39(fieldArgs, "object");
        const $subQuery = $where.existsPlan({
          tableExpression: userIdentifier,
          alias: pgResource_userPgResource.name
        });
        registryConfig.pgRelations.comment.userByMyUserId.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = registryConfig.pgRelations.comment.userByMyUserId.remoteAttributes[i];
          $subQuery.where(sql`${$where.alias}.${sql.identifier(localAttribute)} = ${$subQuery.alias}.${sql.identifier(remoteAttribute)}`);
        });
        fieldArgs.apply($subQuery);
      }
    },
    and: {
      applyPlan($where, fieldArgs) {
        assertAllowed40(fieldArgs, "list");
        const $and = $where.andPlan();
        fieldArgs.apply($and);
      }
    },
    or: {
      applyPlan($where, fieldArgs) {
        assertAllowed40(fieldArgs, "list");
        const $or = $where.orPlan();
        fieldArgs.apply(() => $or.andPlan());
      }
    },
    not: {
      applyPlan($where, fieldArgs) {
        assertAllowed40(fieldArgs, "object");
        const $and = $where.notPlan().andPlan();
        fieldArgs.apply($and);
      }
    }
  },
  CommentAggregatesFilter: {
    filter: {
      applyPlan($subquery, fieldArgs) {
        const $condition = new PgConditionStep($subquery, !1, "AND");
        fieldArgs.apply($condition);
      }
    },
    distinctCount: {
      applyPlan($subquery, fieldArgs) {
        fieldArgs.apply($subquery.forAggregate(aggregateSpec));
      }
    }
  },
  CommentDistinctCountAggregateFilter: {
    rowId: {
      applyPlan($parent, fieldArgs) {
        const $col = new PgConditionStep($parent);
        $col.extensions.pgFilterAttribute = {
          codec: TYPES.bigint,
          expression: aggregateSpec.sqlAggregateWrap(sql`${$col.alias}.${sql.identifier("id")}`, spec_comment.attributes.id.codec)
        };
        fieldArgs.apply($col);
      }
    },
    message: {
      applyPlan($parent, fieldArgs) {
        const $col = new PgConditionStep($parent);
        $col.extensions.pgFilterAttribute = {
          codec: TYPES.bigint,
          expression: aggregateSpec.sqlAggregateWrap(sql`${$col.alias}.${sql.identifier("message")}`, spec_comment.attributes.message.codec)
        };
        fieldArgs.apply($col);
      }
    },
    postId: {
      applyPlan($parent, fieldArgs) {
        const $col = new PgConditionStep($parent);
        $col.extensions.pgFilterAttribute = {
          codec: TYPES.bigint,
          expression: aggregateSpec.sqlAggregateWrap(sql`${$col.alias}.${sql.identifier("post_id")}`, spec_comment.attributes.post_id.codec)
        };
        fieldArgs.apply($col);
      }
    },
    userId: {
      applyPlan($parent, fieldArgs) {
        const $col = new PgConditionStep($parent);
        $col.extensions.pgFilterAttribute = {
          codec: TYPES.bigint,
          expression: aggregateSpec.sqlAggregateWrap(sql`${$col.alias}.${sql.identifier("user_id")}`, spec_comment.attributes.user_id.codec)
        };
        fieldArgs.apply($col);
      }
    },
    createdAt: {
      applyPlan($parent, fieldArgs) {
        const $col = new PgConditionStep($parent);
        $col.extensions.pgFilterAttribute = {
          codec: TYPES.bigint,
          expression: aggregateSpec.sqlAggregateWrap(sql`${$col.alias}.${sql.identifier("created_at")}`, spec_comment.attributes.created_at.codec)
        };
        fieldArgs.apply($col);
      }
    },
    updatedAt: {
      applyPlan($parent, fieldArgs) {
        const $col = new PgConditionStep($parent);
        $col.extensions.pgFilterAttribute = {
          codec: TYPES.bigint,
          expression: aggregateSpec.sqlAggregateWrap(sql`${$col.alias}.${sql.identifier("updated_at")}`, spec_comment.attributes.updated_at.codec)
        };
        fieldArgs.apply($col);
      }
    }
  },
  PostToManyCommentFilter: {
    every: {
      applyPlan($where, fieldArgs) {
        assertAllowed41(fieldArgs, "object");
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
        assertAllowed41(fieldArgs, "object");
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
        assertAllowed41(fieldArgs, "object");
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
    },
    aggregates: {
      applyPlan($where, fieldArgs) {
        if (!$where.extensions.pgFilterRelation) throw new Error("Invalid use of filter, 'pgFilterRelation' expected");
        const {
            localAttributes,
            remoteAttributes,
            tableExpression,
            alias
          } = $where.extensions.pgFilterRelation,
          $subQuery = new PgAggregateConditionStep($where, {
            sql,
            tableExpression,
            alias
          }, pgWhereConditionSpecListToSQL);
        localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = remoteAttributes[i];
          $subQuery.where(sql`${$where.alias}.${sql.identifier(localAttribute)} = ${$subQuery.alias}.${sql.identifier(remoteAttribute)}`);
        });
        fieldArgs.apply($subQuery);
      }
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
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, !1);
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
      return $record.get("post_id");
    },
    userId($record) {
      return $record.get("user_id");
    },
    createdAt($record) {
      return $record.get("created_at");
    },
    updatedAt($record) {
      return $record.get("updated_at");
    },
    post($record) {
      return pgResource_postPgResource.get({
        id: $record.get("post_id")
      });
    },
    user($record) {
      return pgResource_userPgResource.get({
        id: $record.get("user_id")
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
    distinctCount($pgSelectSingle) {
      return $pgSelectSingle;
    }
  },
  UpvoteDistinctCountAggregates: {
    rowId($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("id")}`,
        sqlAggregate = aggregateSpec.sqlAggregateWrap(sqlAttribute, TYPES.uuid);
      return $pgSelectSingle.select(sqlAggregate, TYPES.bigint);
    },
    postId($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("post_id")}`,
        sqlAggregate = aggregateSpec.sqlAggregateWrap(sqlAttribute, TYPES.uuid);
      return $pgSelectSingle.select(sqlAggregate, TYPES.bigint);
    },
    userId($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("user_id")}`,
        sqlAggregate = aggregateSpec.sqlAggregateWrap(sqlAttribute, TYPES.uuid);
      return $pgSelectSingle.select(sqlAggregate, TYPES.bigint);
    },
    createdAt($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("created_at")}`,
        sqlAggregate = aggregateSpec.sqlAggregateWrap(sqlAttribute, TYPES.timestamptz);
      return $pgSelectSingle.select(sqlAggregate, TYPES.bigint);
    },
    updatedAt($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("updated_at")}`,
        sqlAggregate = aggregateSpec.sqlAggregateWrap(sqlAttribute, TYPES.timestamptz);
      return $pgSelectSingle.select(sqlAggregate, TYPES.bigint);
    }
  },
  UpvoteGroupBy: {
    POST_ID: {
      applyPlan: UpvoteGroupBy_extensions_grafast_applyPlan
    },
    USER_ID: {
      applyPlan: UpvoteGroupBy_extensions_grafast_applyPlan2
    },
    CREATED_AT: {
      applyPlan: UpvoteGroupBy_extensions_grafast_applyPlan3
    },
    CREATED_AT_TRUNCATED_TO_HOUR: {
      applyPlan: UpvoteGroupBy_extensions_grafast_applyPlan4
    },
    CREATED_AT_TRUNCATED_TO_DAY: {
      applyPlan: UpvoteGroupBy_extensions_grafast_applyPlan5
    },
    UPDATED_AT: {
      applyPlan: UpvoteGroupBy_extensions_grafast_applyPlan6
    },
    UPDATED_AT_TRUNCATED_TO_HOUR: {
      applyPlan: UpvoteGroupBy_extensions_grafast_applyPlan7
    },
    UPDATED_AT_TRUNCATED_TO_DAY: {
      applyPlan: UpvoteGroupBy_extensions_grafast_applyPlan8
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
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = aggregateSpec2.sqlAggregateWrap(attributeExpression, spec_upvote.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    updatedAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("updated_at")}`,
          aggregateExpression = aggregateSpec2.sqlAggregateWrap(attributeExpression, spec_upvote.attributes.updated_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    }
  },
  HavingDatetimeFilter: {
    equalTo: {
      applyPlan($booleanFilter, input) {
        const val = input.get();
        $booleanFilter.having(sql`(${sql.parens($booleanFilter.expression)} ${infix()} ${$booleanFilter.placeholder(val, TYPES.timestamptz)})`);
      }
    },
    notEqualTo: {
      applyPlan($booleanFilter, input) {
        const val = input.get();
        $booleanFilter.having(sql`(${sql.parens($booleanFilter.expression)} ${infix2()} ${$booleanFilter.placeholder(val, TYPES.timestamptz)})`);
      }
    },
    greaterThan: {
      applyPlan($booleanFilter, input) {
        const val = input.get();
        $booleanFilter.having(sql`(${sql.parens($booleanFilter.expression)} ${infix3()} ${$booleanFilter.placeholder(val, TYPES.timestamptz)})`);
      }
    },
    greaterThanOrEqualTo: {
      applyPlan($booleanFilter, input) {
        const val = input.get();
        $booleanFilter.having(sql`(${sql.parens($booleanFilter.expression)} ${infix4()} ${$booleanFilter.placeholder(val, TYPES.timestamptz)})`);
      }
    },
    lessThan: {
      applyPlan($booleanFilter, input) {
        const val = input.get();
        $booleanFilter.having(sql`(${sql.parens($booleanFilter.expression)} ${infix5()} ${$booleanFilter.placeholder(val, TYPES.timestamptz)})`);
      }
    },
    lessThanOrEqualTo: {
      applyPlan($booleanFilter, input) {
        const val = input.get();
        $booleanFilter.having(sql`(${sql.parens($booleanFilter.expression)} ${infix6()} ${$booleanFilter.placeholder(val, TYPES.timestamptz)})`);
      }
    }
  },
  UpvoteHavingDistinctCountInput: {
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = aggregateSpec.sqlAggregateWrap(attributeExpression, spec_upvote.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    updatedAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("updated_at")}`,
          aggregateExpression = aggregateSpec.sqlAggregateWrap(attributeExpression, spec_upvote.attributes.updated_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    }
  },
  UpvoteHavingMinInput: {
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = aggregateSpec3.sqlAggregateWrap(attributeExpression, spec_upvote.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    updatedAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("updated_at")}`,
          aggregateExpression = aggregateSpec3.sqlAggregateWrap(attributeExpression, spec_upvote.attributes.updated_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    }
  },
  UpvoteHavingMaxInput: {
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = aggregateSpec4.sqlAggregateWrap(attributeExpression, spec_upvote.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    updatedAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("updated_at")}`,
          aggregateExpression = aggregateSpec4.sqlAggregateWrap(attributeExpression, spec_upvote.attributes.updated_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    }
  },
  UpvoteHavingAverageInput: {
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = aggregateSpec5.sqlAggregateWrap(attributeExpression, spec_upvote.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    updatedAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("updated_at")}`,
          aggregateExpression = aggregateSpec5.sqlAggregateWrap(attributeExpression, spec_upvote.attributes.updated_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    }
  },
  UpvoteHavingStddevSampleInput: {
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = aggregateSpec6.sqlAggregateWrap(attributeExpression, spec_upvote.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    updatedAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("updated_at")}`,
          aggregateExpression = aggregateSpec6.sqlAggregateWrap(attributeExpression, spec_upvote.attributes.updated_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    }
  },
  UpvoteHavingStddevPopulationInput: {
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = aggregateSpec7.sqlAggregateWrap(attributeExpression, spec_upvote.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    updatedAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("updated_at")}`,
          aggregateExpression = aggregateSpec7.sqlAggregateWrap(attributeExpression, spec_upvote.attributes.updated_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    }
  },
  UpvoteHavingVarianceSampleInput: {
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = aggregateSpec8.sqlAggregateWrap(attributeExpression, spec_upvote.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    updatedAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("updated_at")}`,
          aggregateExpression = aggregateSpec8.sqlAggregateWrap(attributeExpression, spec_upvote.attributes.updated_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    }
  },
  UpvoteHavingVariancePopulationInput: {
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = aggregateSpec9.sqlAggregateWrap(attributeExpression, spec_upvote.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    updatedAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("updated_at")}`,
          aggregateExpression = aggregateSpec9.sqlAggregateWrap(attributeExpression, spec_upvote.attributes.updated_at.codec);
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
    ROW_ID_ASC: {
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
    ROW_ID_DESC: {
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
          attribute: "post_id",
          direction: "ASC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (true) plan.setOrderIsUnique();
      }
    },
    POST_ID_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "post_id",
          direction: "DESC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (true) plan.setOrderIsUnique();
      }
    },
    USER_ID_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "user_id",
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
          attribute: "user_id",
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
    UPDATED_AT_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "updated_at",
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
          attribute: "updated_at",
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
          attribute: "post_id",
          callback(expression) {
            return sql`${expression} is null`;
          }
        });else $condition.where({
          type: "attribute",
          attribute: "post_id",
          callback(expression) {
            return sql`${expression} = ${$condition.placeholder(val.get(), spec_upvote.attributes.post_id.codec)}`;
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
          attribute: "user_id",
          callback(expression) {
            return sql`${expression} is null`;
          }
        });else $condition.where({
          type: "attribute",
          attribute: "user_id",
          callback(expression) {
            return sql`${expression} = ${$condition.placeholder(val.get(), spec_upvote.attributes.user_id.codec)}`;
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
    },
    updatedAt: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) $condition.where({
          type: "attribute",
          attribute: "updated_at",
          callback(expression) {
            return sql`${expression} is null`;
          }
        });else $condition.where({
          type: "attribute",
          attribute: "updated_at",
          callback(expression) {
            return sql`${expression} = ${$condition.placeholder(val.get(), spec_upvote.attributes.updated_at.codec)}`;
          }
        });
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  UserOrganizationConnection: {
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
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, !1);
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
              const config = getEnumValueConfig(UserOrganizationGroupBy, group),
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
  UserOrganizationEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  UserOrganizationAggregates: {
    __assertStep: assertPgClassSingleStep,
    keys($pgSelectSingle) {
      const groups = $pgSelectSingle.getClassStep().getGroups();
      if (groups.length > 0) return $pgSelectSingle.select(sql`json_build_array(${sql.join(groups.map(g => g.fragment), ", ")})`, TYPES.json);else return constant(null);
    },
    distinctCount($pgSelectSingle) {
      return $pgSelectSingle;
    }
  },
  UserOrganizationDistinctCountAggregates: {
    userId($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("user_id")}`,
        sqlAggregate = aggregateSpec.sqlAggregateWrap(sqlAttribute, TYPES.uuid);
      return $pgSelectSingle.select(sqlAggregate, TYPES.bigint);
    },
    organizationId($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("organization_id")}`,
        sqlAggregate = aggregateSpec.sqlAggregateWrap(sqlAttribute, TYPES.uuid);
      return $pgSelectSingle.select(sqlAggregate, TYPES.bigint);
    },
    createdAt($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("created_at")}`,
        sqlAggregate = aggregateSpec.sqlAggregateWrap(sqlAttribute, TYPES.timestamptz);
      return $pgSelectSingle.select(sqlAggregate, TYPES.bigint);
    }
  },
  UserOrganizationGroupBy: {
    USER_ID: {
      applyPlan: UserOrganizationGroupBy_extensions_grafast_applyPlan
    },
    ORGANIZATION_ID: {
      applyPlan: UserOrganizationGroupBy_extensions_grafast_applyPlan2
    },
    CREATED_AT: {
      applyPlan: UserOrganizationGroupBy_extensions_grafast_applyPlan3
    },
    CREATED_AT_TRUNCATED_TO_HOUR: {
      applyPlan: UserOrganizationGroupBy_extensions_grafast_applyPlan4
    },
    CREATED_AT_TRUNCATED_TO_DAY: {
      applyPlan: UserOrganizationGroupBy_extensions_grafast_applyPlan5
    }
  },
  UserOrganizationHavingInput: {
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
  UserOrganizationHavingSumInput: {
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = aggregateSpec2.sqlAggregateWrap(attributeExpression, spec_userOrganization.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    }
  },
  UserOrganizationHavingDistinctCountInput: {
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = aggregateSpec.sqlAggregateWrap(attributeExpression, spec_userOrganization.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    }
  },
  UserOrganizationHavingMinInput: {
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = aggregateSpec3.sqlAggregateWrap(attributeExpression, spec_userOrganization.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    }
  },
  UserOrganizationHavingMaxInput: {
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = aggregateSpec4.sqlAggregateWrap(attributeExpression, spec_userOrganization.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    }
  },
  UserOrganizationHavingAverageInput: {
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = aggregateSpec5.sqlAggregateWrap(attributeExpression, spec_userOrganization.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    }
  },
  UserOrganizationHavingStddevSampleInput: {
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = aggregateSpec6.sqlAggregateWrap(attributeExpression, spec_userOrganization.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    }
  },
  UserOrganizationHavingStddevPopulationInput: {
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = aggregateSpec7.sqlAggregateWrap(attributeExpression, spec_userOrganization.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    }
  },
  UserOrganizationHavingVarianceSampleInput: {
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = aggregateSpec8.sqlAggregateWrap(attributeExpression, spec_userOrganization.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    }
  },
  UserOrganizationHavingVariancePopulationInput: {
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = aggregateSpec9.sqlAggregateWrap(attributeExpression, spec_userOrganization.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    }
  },
  UserOrganizationOrderBy: {
    NATURAL: {
      applyPlan() {}
    },
    USER_ID_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "user_id",
          direction: "ASC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (true) plan.setOrderIsUnique();
      }
    },
    USER_ID_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "user_id",
          direction: "DESC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (true) plan.setOrderIsUnique();
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
  UserOrganizationCondition: {
    userId: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) $condition.where({
          type: "attribute",
          attribute: "user_id",
          callback(expression) {
            return sql`${expression} is null`;
          }
        });else $condition.where({
          type: "attribute",
          attribute: "user_id",
          callback(expression) {
            return sql`${expression} = ${$condition.placeholder(val.get(), spec_userOrganization.attributes.user_id.codec)}`;
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
            return sql`${expression} = ${$condition.placeholder(val.get(), spec_userOrganization.attributes.organization_id.codec)}`;
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
            return sql`${expression} = ${$condition.placeholder(val.get(), spec_userOrganization.attributes.created_at.codec)}`;
          }
        });
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  CommentConnection: {
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
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, !1);
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
              const config = getEnumValueConfig(CommentGroupBy, group),
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
  Comment: {
    __assertStep: assertPgClassSingleStep,
    id($parent) {
      const specifier = nodeIdHandlerByTypeName.Comment.plan($parent);
      return lambda(specifier, nodeIdCodecs[nodeIdHandlerByTypeName.Comment.codec.name].encode);
    },
    rowId($record) {
      return $record.get("id");
    },
    message($record) {
      return $record.get("message");
    },
    postId($record) {
      return $record.get("post_id");
    },
    userId($record) {
      return $record.get("user_id");
    },
    createdAt($record) {
      return $record.get("created_at");
    },
    updatedAt($record) {
      return $record.get("updated_at");
    },
    post($record) {
      return pgResource_postPgResource.get({
        id: $record.get("post_id")
      });
    },
    user($record) {
      return pgResource_userPgResource.get({
        id: $record.get("user_id")
      });
    }
  },
  CommentEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  CommentAggregates: {
    __assertStep: assertPgClassSingleStep,
    keys($pgSelectSingle) {
      const groups = $pgSelectSingle.getClassStep().getGroups();
      if (groups.length > 0) return $pgSelectSingle.select(sql`json_build_array(${sql.join(groups.map(g => g.fragment), ", ")})`, TYPES.json);else return constant(null);
    },
    distinctCount($pgSelectSingle) {
      return $pgSelectSingle;
    }
  },
  CommentDistinctCountAggregates: {
    rowId($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("id")}`,
        sqlAggregate = aggregateSpec.sqlAggregateWrap(sqlAttribute, TYPES.uuid);
      return $pgSelectSingle.select(sqlAggregate, TYPES.bigint);
    },
    message($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("message")}`,
        sqlAggregate = aggregateSpec.sqlAggregateWrap(sqlAttribute, TYPES.text);
      return $pgSelectSingle.select(sqlAggregate, TYPES.bigint);
    },
    postId($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("post_id")}`,
        sqlAggregate = aggregateSpec.sqlAggregateWrap(sqlAttribute, TYPES.uuid);
      return $pgSelectSingle.select(sqlAggregate, TYPES.bigint);
    },
    userId($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("user_id")}`,
        sqlAggregate = aggregateSpec.sqlAggregateWrap(sqlAttribute, TYPES.uuid);
      return $pgSelectSingle.select(sqlAggregate, TYPES.bigint);
    },
    createdAt($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("created_at")}`,
        sqlAggregate = aggregateSpec.sqlAggregateWrap(sqlAttribute, TYPES.timestamptz);
      return $pgSelectSingle.select(sqlAggregate, TYPES.bigint);
    },
    updatedAt($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("updated_at")}`,
        sqlAggregate = aggregateSpec.sqlAggregateWrap(sqlAttribute, TYPES.timestamptz);
      return $pgSelectSingle.select(sqlAggregate, TYPES.bigint);
    }
  },
  CommentGroupBy: {
    MESSAGE: {
      applyPlan: CommentGroupBy_extensions_grafast_applyPlan
    },
    POST_ID: {
      applyPlan: CommentGroupBy_extensions_grafast_applyPlan2
    },
    USER_ID: {
      applyPlan: CommentGroupBy_extensions_grafast_applyPlan3
    },
    CREATED_AT: {
      applyPlan: CommentGroupBy_extensions_grafast_applyPlan4
    },
    CREATED_AT_TRUNCATED_TO_HOUR: {
      applyPlan: CommentGroupBy_extensions_grafast_applyPlan5
    },
    CREATED_AT_TRUNCATED_TO_DAY: {
      applyPlan: CommentGroupBy_extensions_grafast_applyPlan6
    },
    UPDATED_AT: {
      applyPlan: CommentGroupBy_extensions_grafast_applyPlan7
    },
    UPDATED_AT_TRUNCATED_TO_HOUR: {
      applyPlan: CommentGroupBy_extensions_grafast_applyPlan8
    },
    UPDATED_AT_TRUNCATED_TO_DAY: {
      applyPlan: CommentGroupBy_extensions_grafast_applyPlan9
    }
  },
  CommentHavingInput: {
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
  CommentHavingSumInput: {
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = aggregateSpec2.sqlAggregateWrap(attributeExpression, spec_comment.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    updatedAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("updated_at")}`,
          aggregateExpression = aggregateSpec2.sqlAggregateWrap(attributeExpression, spec_comment.attributes.updated_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    }
  },
  CommentHavingDistinctCountInput: {
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = aggregateSpec.sqlAggregateWrap(attributeExpression, spec_comment.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    updatedAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("updated_at")}`,
          aggregateExpression = aggregateSpec.sqlAggregateWrap(attributeExpression, spec_comment.attributes.updated_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    }
  },
  CommentHavingMinInput: {
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = aggregateSpec3.sqlAggregateWrap(attributeExpression, spec_comment.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    updatedAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("updated_at")}`,
          aggregateExpression = aggregateSpec3.sqlAggregateWrap(attributeExpression, spec_comment.attributes.updated_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    }
  },
  CommentHavingMaxInput: {
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = aggregateSpec4.sqlAggregateWrap(attributeExpression, spec_comment.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    updatedAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("updated_at")}`,
          aggregateExpression = aggregateSpec4.sqlAggregateWrap(attributeExpression, spec_comment.attributes.updated_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    }
  },
  CommentHavingAverageInput: {
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = aggregateSpec5.sqlAggregateWrap(attributeExpression, spec_comment.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    updatedAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("updated_at")}`,
          aggregateExpression = aggregateSpec5.sqlAggregateWrap(attributeExpression, spec_comment.attributes.updated_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    }
  },
  CommentHavingStddevSampleInput: {
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = aggregateSpec6.sqlAggregateWrap(attributeExpression, spec_comment.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    updatedAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("updated_at")}`,
          aggregateExpression = aggregateSpec6.sqlAggregateWrap(attributeExpression, spec_comment.attributes.updated_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    }
  },
  CommentHavingStddevPopulationInput: {
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = aggregateSpec7.sqlAggregateWrap(attributeExpression, spec_comment.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    updatedAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("updated_at")}`,
          aggregateExpression = aggregateSpec7.sqlAggregateWrap(attributeExpression, spec_comment.attributes.updated_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    }
  },
  CommentHavingVarianceSampleInput: {
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = aggregateSpec8.sqlAggregateWrap(attributeExpression, spec_comment.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    updatedAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("updated_at")}`,
          aggregateExpression = aggregateSpec8.sqlAggregateWrap(attributeExpression, spec_comment.attributes.updated_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    }
  },
  CommentHavingVariancePopulationInput: {
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = aggregateSpec9.sqlAggregateWrap(attributeExpression, spec_comment.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    updatedAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("updated_at")}`,
          aggregateExpression = aggregateSpec9.sqlAggregateWrap(attributeExpression, spec_comment.attributes.updated_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    }
  },
  CommentOrderBy: {
    NATURAL: {
      applyPlan() {}
    },
    PRIMARY_KEY_ASC: {
      applyPlan(step) {
        commentUniques[0].attributes.forEach(attributeName => {
          const attribute = commentCodec.attributes[attributeName];
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
        commentUniques[0].attributes.forEach(attributeName => {
          const attribute = commentCodec.attributes[attributeName];
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
    ROW_ID_ASC: {
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
    ROW_ID_DESC: {
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
    MESSAGE_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "message",
          direction: "ASC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (false) plan.setOrderIsUnique();
      }
    },
    MESSAGE_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "message",
          direction: "DESC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (false) plan.setOrderIsUnique();
      }
    },
    POST_ID_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "post_id",
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
          attribute: "post_id",
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
          attribute: "user_id",
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
          attribute: "user_id",
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
    UPDATED_AT_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "updated_at",
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
          attribute: "updated_at",
          direction: "DESC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (false) plan.setOrderIsUnique();
      }
    }
  },
  CommentCondition: {
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
            return sql`${expression} = ${$condition.placeholder(val.get(), spec_comment.attributes.id.codec)}`;
          }
        });
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    message: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) $condition.where({
          type: "attribute",
          attribute: "message",
          callback(expression) {
            return sql`${expression} is null`;
          }
        });else $condition.where({
          type: "attribute",
          attribute: "message",
          callback(expression) {
            return sql`${expression} = ${$condition.placeholder(val.get(), spec_comment.attributes.message.codec)}`;
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
          attribute: "post_id",
          callback(expression) {
            return sql`${expression} is null`;
          }
        });else $condition.where({
          type: "attribute",
          attribute: "post_id",
          callback(expression) {
            return sql`${expression} = ${$condition.placeholder(val.get(), spec_comment.attributes.post_id.codec)}`;
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
          attribute: "user_id",
          callback(expression) {
            return sql`${expression} is null`;
          }
        });else $condition.where({
          type: "attribute",
          attribute: "user_id",
          callback(expression) {
            return sql`${expression} = ${$condition.placeholder(val.get(), spec_comment.attributes.user_id.codec)}`;
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
            return sql`${expression} = ${$condition.placeholder(val.get(), spec_comment.attributes.created_at.codec)}`;
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
          attribute: "updated_at",
          callback(expression) {
            return sql`${expression} is null`;
          }
        });else $condition.where({
          type: "attribute",
          attribute: "updated_at",
          callback(expression) {
            return sql`${expression} = ${$condition.placeholder(val.get(), spec_comment.attributes.updated_at.codec)}`;
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
  PostAggregates: {
    __assertStep: assertPgClassSingleStep,
    keys($pgSelectSingle) {
      const groups = $pgSelectSingle.getClassStep().getGroups();
      if (groups.length > 0) return $pgSelectSingle.select(sql`json_build_array(${sql.join(groups.map(g => g.fragment), ", ")})`, TYPES.json);else return constant(null);
    },
    distinctCount($pgSelectSingle) {
      return $pgSelectSingle;
    }
  },
  PostDistinctCountAggregates: {
    rowId($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("id")}`,
        sqlAggregate = aggregateSpec.sqlAggregateWrap(sqlAttribute, TYPES.uuid);
      return $pgSelectSingle.select(sqlAggregate, TYPES.bigint);
    },
    title($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("title")}`,
        sqlAggregate = aggregateSpec.sqlAggregateWrap(sqlAttribute, TYPES.text);
      return $pgSelectSingle.select(sqlAggregate, TYPES.bigint);
    },
    description($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("description")}`,
        sqlAggregate = aggregateSpec.sqlAggregateWrap(sqlAttribute, TYPES.text);
      return $pgSelectSingle.select(sqlAggregate, TYPES.bigint);
    },
    projectId($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("project_id")}`,
        sqlAggregate = aggregateSpec.sqlAggregateWrap(sqlAttribute, TYPES.uuid);
      return $pgSelectSingle.select(sqlAggregate, TYPES.bigint);
    },
    userId($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("user_id")}`,
        sqlAggregate = aggregateSpec.sqlAggregateWrap(sqlAttribute, TYPES.uuid);
      return $pgSelectSingle.select(sqlAggregate, TYPES.bigint);
    },
    createdAt($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("created_at")}`,
        sqlAggregate = aggregateSpec.sqlAggregateWrap(sqlAttribute, TYPES.timestamptz);
      return $pgSelectSingle.select(sqlAggregate, TYPES.bigint);
    },
    updatedAt($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("updated_at")}`,
        sqlAggregate = aggregateSpec.sqlAggregateWrap(sqlAttribute, TYPES.timestamptz);
      return $pgSelectSingle.select(sqlAggregate, TYPES.bigint);
    }
  },
  PostGroupBy: {
    TITLE: {
      applyPlan: PostGroupBy_extensions_grafast_applyPlan
    },
    DESCRIPTION: {
      applyPlan: PostGroupBy_extensions_grafast_applyPlan2
    },
    PROJECT_ID: {
      applyPlan: PostGroupBy_extensions_grafast_applyPlan3
    },
    USER_ID: {
      applyPlan: PostGroupBy_extensions_grafast_applyPlan4
    },
    CREATED_AT: {
      applyPlan: PostGroupBy_extensions_grafast_applyPlan5
    },
    CREATED_AT_TRUNCATED_TO_HOUR: {
      applyPlan: PostGroupBy_extensions_grafast_applyPlan6
    },
    CREATED_AT_TRUNCATED_TO_DAY: {
      applyPlan: PostGroupBy_extensions_grafast_applyPlan7
    },
    UPDATED_AT: {
      applyPlan: PostGroupBy_extensions_grafast_applyPlan8
    },
    UPDATED_AT_TRUNCATED_TO_HOUR: {
      applyPlan: PostGroupBy_extensions_grafast_applyPlan9
    },
    UPDATED_AT_TRUNCATED_TO_DAY: {
      applyPlan: PostGroupBy_extensions_grafast_applyPlan10
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
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = aggregateSpec2.sqlAggregateWrap(attributeExpression, spec_post.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    updatedAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("updated_at")}`,
          aggregateExpression = aggregateSpec2.sqlAggregateWrap(attributeExpression, spec_post.attributes.updated_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    }
  },
  PostHavingDistinctCountInput: {
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = aggregateSpec.sqlAggregateWrap(attributeExpression, spec_post.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    updatedAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("updated_at")}`,
          aggregateExpression = aggregateSpec.sqlAggregateWrap(attributeExpression, spec_post.attributes.updated_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    }
  },
  PostHavingMinInput: {
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = aggregateSpec3.sqlAggregateWrap(attributeExpression, spec_post.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    updatedAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("updated_at")}`,
          aggregateExpression = aggregateSpec3.sqlAggregateWrap(attributeExpression, spec_post.attributes.updated_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    }
  },
  PostHavingMaxInput: {
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = aggregateSpec4.sqlAggregateWrap(attributeExpression, spec_post.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    updatedAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("updated_at")}`,
          aggregateExpression = aggregateSpec4.sqlAggregateWrap(attributeExpression, spec_post.attributes.updated_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    }
  },
  PostHavingAverageInput: {
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = aggregateSpec5.sqlAggregateWrap(attributeExpression, spec_post.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    updatedAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("updated_at")}`,
          aggregateExpression = aggregateSpec5.sqlAggregateWrap(attributeExpression, spec_post.attributes.updated_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    }
  },
  PostHavingStddevSampleInput: {
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = aggregateSpec6.sqlAggregateWrap(attributeExpression, spec_post.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    updatedAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("updated_at")}`,
          aggregateExpression = aggregateSpec6.sqlAggregateWrap(attributeExpression, spec_post.attributes.updated_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    }
  },
  PostHavingStddevPopulationInput: {
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = aggregateSpec7.sqlAggregateWrap(attributeExpression, spec_post.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    updatedAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("updated_at")}`,
          aggregateExpression = aggregateSpec7.sqlAggregateWrap(attributeExpression, spec_post.attributes.updated_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    }
  },
  PostHavingVarianceSampleInput: {
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = aggregateSpec8.sqlAggregateWrap(attributeExpression, spec_post.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    updatedAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("updated_at")}`,
          aggregateExpression = aggregateSpec8.sqlAggregateWrap(attributeExpression, spec_post.attributes.updated_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    }
  },
  PostHavingVariancePopulationInput: {
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = aggregateSpec9.sqlAggregateWrap(attributeExpression, spec_post.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    updatedAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("updated_at")}`,
          aggregateExpression = aggregateSpec9.sqlAggregateWrap(attributeExpression, spec_post.attributes.updated_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
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
    distinctCount($pgSelectSingle) {
      return $pgSelectSingle;
    }
  },
  ProjectDistinctCountAggregates: {
    rowId($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("id")}`,
        sqlAggregate = aggregateSpec.sqlAggregateWrap(sqlAttribute, TYPES.uuid);
      return $pgSelectSingle.select(sqlAggregate, TYPES.bigint);
    },
    name($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("name")}`,
        sqlAggregate = aggregateSpec.sqlAggregateWrap(sqlAttribute, TYPES.text);
      return $pgSelectSingle.select(sqlAggregate, TYPES.bigint);
    },
    image($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("image")}`,
        sqlAggregate = aggregateSpec.sqlAggregateWrap(sqlAttribute, TYPES.text);
      return $pgSelectSingle.select(sqlAggregate, TYPES.bigint);
    },
    slug($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("slug")}`,
        sqlAggregate = aggregateSpec.sqlAggregateWrap(sqlAttribute, TYPES.text);
      return $pgSelectSingle.select(sqlAggregate, TYPES.bigint);
    },
    description($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("description")}`,
        sqlAggregate = aggregateSpec.sqlAggregateWrap(sqlAttribute, TYPES.text);
      return $pgSelectSingle.select(sqlAggregate, TYPES.bigint);
    },
    organizationId($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("organization_id")}`,
        sqlAggregate = aggregateSpec.sqlAggregateWrap(sqlAttribute, TYPES.uuid);
      return $pgSelectSingle.select(sqlAggregate, TYPES.bigint);
    },
    createdAt($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("created_at")}`,
        sqlAggregate = aggregateSpec.sqlAggregateWrap(sqlAttribute, TYPES.timestamptz);
      return $pgSelectSingle.select(sqlAggregate, TYPES.bigint);
    },
    updatedAt($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("updated_at")}`,
        sqlAggregate = aggregateSpec.sqlAggregateWrap(sqlAttribute, TYPES.timestamptz);
      return $pgSelectSingle.select(sqlAggregate, TYPES.bigint);
    }
  },
  ProjectGroupBy: {
    IMAGE: {
      applyPlan: ProjectGroupBy_extensions_grafast_applyPlan
    },
    SLUG: {
      applyPlan: ProjectGroupBy_extensions_grafast_applyPlan2
    },
    DESCRIPTION: {
      applyPlan: ProjectGroupBy_extensions_grafast_applyPlan3
    },
    ORGANIZATION_ID: {
      applyPlan: ProjectGroupBy_extensions_grafast_applyPlan4
    },
    CREATED_AT: {
      applyPlan: ProjectGroupBy_extensions_grafast_applyPlan5
    },
    CREATED_AT_TRUNCATED_TO_HOUR: {
      applyPlan: ProjectGroupBy_extensions_grafast_applyPlan6
    },
    CREATED_AT_TRUNCATED_TO_DAY: {
      applyPlan: ProjectGroupBy_extensions_grafast_applyPlan7
    },
    UPDATED_AT: {
      applyPlan: ProjectGroupBy_extensions_grafast_applyPlan8
    },
    UPDATED_AT_TRUNCATED_TO_HOUR: {
      applyPlan: ProjectGroupBy_extensions_grafast_applyPlan9
    },
    UPDATED_AT_TRUNCATED_TO_DAY: {
      applyPlan: ProjectGroupBy_extensions_grafast_applyPlan10
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
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = aggregateSpec2.sqlAggregateWrap(attributeExpression, spec_project.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    updatedAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("updated_at")}`,
          aggregateExpression = aggregateSpec2.sqlAggregateWrap(attributeExpression, spec_project.attributes.updated_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    }
  },
  ProjectHavingDistinctCountInput: {
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = aggregateSpec.sqlAggregateWrap(attributeExpression, spec_project.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    updatedAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("updated_at")}`,
          aggregateExpression = aggregateSpec.sqlAggregateWrap(attributeExpression, spec_project.attributes.updated_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    }
  },
  ProjectHavingMinInput: {
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = aggregateSpec3.sqlAggregateWrap(attributeExpression, spec_project.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    updatedAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("updated_at")}`,
          aggregateExpression = aggregateSpec3.sqlAggregateWrap(attributeExpression, spec_project.attributes.updated_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    }
  },
  ProjectHavingMaxInput: {
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = aggregateSpec4.sqlAggregateWrap(attributeExpression, spec_project.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    updatedAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("updated_at")}`,
          aggregateExpression = aggregateSpec4.sqlAggregateWrap(attributeExpression, spec_project.attributes.updated_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    }
  },
  ProjectHavingAverageInput: {
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = aggregateSpec5.sqlAggregateWrap(attributeExpression, spec_project.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    updatedAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("updated_at")}`,
          aggregateExpression = aggregateSpec5.sqlAggregateWrap(attributeExpression, spec_project.attributes.updated_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    }
  },
  ProjectHavingStddevSampleInput: {
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = aggregateSpec6.sqlAggregateWrap(attributeExpression, spec_project.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    updatedAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("updated_at")}`,
          aggregateExpression = aggregateSpec6.sqlAggregateWrap(attributeExpression, spec_project.attributes.updated_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    }
  },
  ProjectHavingStddevPopulationInput: {
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = aggregateSpec7.sqlAggregateWrap(attributeExpression, spec_project.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    updatedAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("updated_at")}`,
          aggregateExpression = aggregateSpec7.sqlAggregateWrap(attributeExpression, spec_project.attributes.updated_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    }
  },
  ProjectHavingVarianceSampleInput: {
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = aggregateSpec8.sqlAggregateWrap(attributeExpression, spec_project.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    updatedAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("updated_at")}`,
          aggregateExpression = aggregateSpec8.sqlAggregateWrap(attributeExpression, spec_project.attributes.updated_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    }
  },
  ProjectHavingVariancePopulationInput: {
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = aggregateSpec9.sqlAggregateWrap(attributeExpression, spec_project.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    updatedAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("updated_at")}`,
          aggregateExpression = aggregateSpec9.sqlAggregateWrap(attributeExpression, spec_project.attributes.updated_at.codec);
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
    ROW_ID_ASC: {
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
    ROW_ID_DESC: {
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
        if (true) plan.setOrderIsUnique();
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
        if (true) plan.setOrderIsUnique();
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
        if (true) plan.setOrderIsUnique();
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
        if (true) plan.setOrderIsUnique();
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
    UPDATED_AT_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "updated_at",
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
          attribute: "updated_at",
          direction: "DESC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (false) plan.setOrderIsUnique();
      }
    },
    POSTS_COUNT_ASC: {
      applyPlan($select) {
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(pgResource_postPgResource.name));
        relation3.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation3.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof pgResource_postPgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`select count(*)
from ${pgResource_postPgResource.from} ${tableAlias}
where ${sql.parens(sql.join(conditions.map(c => sql.parens(c)), " AND "))}`})`;
        $select.orderBy({
          fragment,
          codec: TYPES.bigint,
          direction: "ASC"
        });
      }
    },
    POSTS_COUNT_DESC: {
      applyPlan($select) {
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(pgResource_postPgResource.name));
        relation3.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation3.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof pgResource_postPgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`select count(*)
from ${pgResource_postPgResource.from} ${tableAlias}
where ${sql.parens(sql.join(conditions.map(c => sql.parens(c)), " AND "))}`})`;
        $select.orderBy({
          fragment,
          codec: TYPES.bigint,
          direction: "DESC"
        });
      }
    },
    POSTS_DISTINCT_COUNT_ROW_ID_ASC: {
      applyPlan($select) {
        var _a, _b;
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(pgResource_postPgResource.name));
        relation3.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation3.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof pgResource_postPgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`
select ${aggregateSpec.sqlAggregateWrap(sql.fragment`${tableAlias}.${sql.identifier("id")}`, spec_post.attributes.id.codec)}
from ${pgResource_postPgResource.from} ${tableAlias}
where ${sql.join(conditions.map(c => sql.parens(c)), " AND ")}`})`;
        $select.orderBy({
          fragment,
          codec: (_b = (_a = aggregateSpec.pgTypeCodecModifier) === null || _a === void 0 ? void 0 : _a.call(aggregateSpec, spec_post.attributes.id.codec)) !== null && _b !== void 0 ? _b : spec_post.attributes.id.codec,
          direction: "ASC"
        });
      }
    },
    POSTS_DISTINCT_COUNT_ROW_ID_DESC: {
      applyPlan($select) {
        var _a, _b;
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(pgResource_postPgResource.name));
        relation3.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation3.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof pgResource_postPgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`
select ${aggregateSpec.sqlAggregateWrap(sql.fragment`${tableAlias}.${sql.identifier("id")}`, spec_post.attributes.id.codec)}
from ${pgResource_postPgResource.from} ${tableAlias}
where ${sql.join(conditions.map(c => sql.parens(c)), " AND ")}`})`;
        $select.orderBy({
          fragment,
          codec: (_b = (_a = aggregateSpec.pgTypeCodecModifier) === null || _a === void 0 ? void 0 : _a.call(aggregateSpec, spec_post.attributes.id.codec)) !== null && _b !== void 0 ? _b : spec_post.attributes.id.codec,
          direction: "DESC"
        });
      }
    },
    POSTS_DISTINCT_COUNT_TITLE_ASC: {
      applyPlan($select) {
        var _a, _b;
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(pgResource_postPgResource.name));
        relation3.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation3.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof pgResource_postPgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`
select ${aggregateSpec.sqlAggregateWrap(sql.fragment`${tableAlias}.${sql.identifier("title")}`, spec_post.attributes.title.codec)}
from ${pgResource_postPgResource.from} ${tableAlias}
where ${sql.join(conditions.map(c => sql.parens(c)), " AND ")}`})`;
        $select.orderBy({
          fragment,
          codec: (_b = (_a = aggregateSpec.pgTypeCodecModifier) === null || _a === void 0 ? void 0 : _a.call(aggregateSpec, spec_post.attributes.title.codec)) !== null && _b !== void 0 ? _b : spec_post.attributes.title.codec,
          direction: "ASC"
        });
      }
    },
    POSTS_DISTINCT_COUNT_TITLE_DESC: {
      applyPlan($select) {
        var _a, _b;
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(pgResource_postPgResource.name));
        relation3.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation3.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof pgResource_postPgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`
select ${aggregateSpec.sqlAggregateWrap(sql.fragment`${tableAlias}.${sql.identifier("title")}`, spec_post.attributes.title.codec)}
from ${pgResource_postPgResource.from} ${tableAlias}
where ${sql.join(conditions.map(c => sql.parens(c)), " AND ")}`})`;
        $select.orderBy({
          fragment,
          codec: (_b = (_a = aggregateSpec.pgTypeCodecModifier) === null || _a === void 0 ? void 0 : _a.call(aggregateSpec, spec_post.attributes.title.codec)) !== null && _b !== void 0 ? _b : spec_post.attributes.title.codec,
          direction: "DESC"
        });
      }
    },
    POSTS_DISTINCT_COUNT_DESCRIPTION_ASC: {
      applyPlan($select) {
        var _a, _b;
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(pgResource_postPgResource.name));
        relation3.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation3.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof pgResource_postPgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`
select ${aggregateSpec.sqlAggregateWrap(sql.fragment`${tableAlias}.${sql.identifier("description")}`, spec_post.attributes.description.codec)}
from ${pgResource_postPgResource.from} ${tableAlias}
where ${sql.join(conditions.map(c => sql.parens(c)), " AND ")}`})`;
        $select.orderBy({
          fragment,
          codec: (_b = (_a = aggregateSpec.pgTypeCodecModifier) === null || _a === void 0 ? void 0 : _a.call(aggregateSpec, spec_post.attributes.description.codec)) !== null && _b !== void 0 ? _b : spec_post.attributes.description.codec,
          direction: "ASC"
        });
      }
    },
    POSTS_DISTINCT_COUNT_DESCRIPTION_DESC: {
      applyPlan($select) {
        var _a, _b;
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(pgResource_postPgResource.name));
        relation3.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation3.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof pgResource_postPgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`
select ${aggregateSpec.sqlAggregateWrap(sql.fragment`${tableAlias}.${sql.identifier("description")}`, spec_post.attributes.description.codec)}
from ${pgResource_postPgResource.from} ${tableAlias}
where ${sql.join(conditions.map(c => sql.parens(c)), " AND ")}`})`;
        $select.orderBy({
          fragment,
          codec: (_b = (_a = aggregateSpec.pgTypeCodecModifier) === null || _a === void 0 ? void 0 : _a.call(aggregateSpec, spec_post.attributes.description.codec)) !== null && _b !== void 0 ? _b : spec_post.attributes.description.codec,
          direction: "DESC"
        });
      }
    },
    POSTS_DISTINCT_COUNT_PROJECT_ID_ASC: {
      applyPlan($select) {
        var _a, _b;
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(pgResource_postPgResource.name));
        relation3.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation3.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof pgResource_postPgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`
select ${aggregateSpec.sqlAggregateWrap(sql.fragment`${tableAlias}.${sql.identifier("project_id")}`, spec_post.attributes.project_id.codec)}
from ${pgResource_postPgResource.from} ${tableAlias}
where ${sql.join(conditions.map(c => sql.parens(c)), " AND ")}`})`;
        $select.orderBy({
          fragment,
          codec: (_b = (_a = aggregateSpec.pgTypeCodecModifier) === null || _a === void 0 ? void 0 : _a.call(aggregateSpec, spec_post.attributes.project_id.codec)) !== null && _b !== void 0 ? _b : spec_post.attributes.project_id.codec,
          direction: "ASC"
        });
      }
    },
    POSTS_DISTINCT_COUNT_PROJECT_ID_DESC: {
      applyPlan($select) {
        var _a, _b;
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(pgResource_postPgResource.name));
        relation3.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation3.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof pgResource_postPgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`
select ${aggregateSpec.sqlAggregateWrap(sql.fragment`${tableAlias}.${sql.identifier("project_id")}`, spec_post.attributes.project_id.codec)}
from ${pgResource_postPgResource.from} ${tableAlias}
where ${sql.join(conditions.map(c => sql.parens(c)), " AND ")}`})`;
        $select.orderBy({
          fragment,
          codec: (_b = (_a = aggregateSpec.pgTypeCodecModifier) === null || _a === void 0 ? void 0 : _a.call(aggregateSpec, spec_post.attributes.project_id.codec)) !== null && _b !== void 0 ? _b : spec_post.attributes.project_id.codec,
          direction: "DESC"
        });
      }
    },
    POSTS_DISTINCT_COUNT_USER_ID_ASC: {
      applyPlan($select) {
        var _a, _b;
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(pgResource_postPgResource.name));
        relation3.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation3.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof pgResource_postPgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`
select ${aggregateSpec.sqlAggregateWrap(sql.fragment`${tableAlias}.${sql.identifier("user_id")}`, spec_post.attributes.user_id.codec)}
from ${pgResource_postPgResource.from} ${tableAlias}
where ${sql.join(conditions.map(c => sql.parens(c)), " AND ")}`})`;
        $select.orderBy({
          fragment,
          codec: (_b = (_a = aggregateSpec.pgTypeCodecModifier) === null || _a === void 0 ? void 0 : _a.call(aggregateSpec, spec_post.attributes.user_id.codec)) !== null && _b !== void 0 ? _b : spec_post.attributes.user_id.codec,
          direction: "ASC"
        });
      }
    },
    POSTS_DISTINCT_COUNT_USER_ID_DESC: {
      applyPlan($select) {
        var _a, _b;
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(pgResource_postPgResource.name));
        relation3.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation3.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof pgResource_postPgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`
select ${aggregateSpec.sqlAggregateWrap(sql.fragment`${tableAlias}.${sql.identifier("user_id")}`, spec_post.attributes.user_id.codec)}
from ${pgResource_postPgResource.from} ${tableAlias}
where ${sql.join(conditions.map(c => sql.parens(c)), " AND ")}`})`;
        $select.orderBy({
          fragment,
          codec: (_b = (_a = aggregateSpec.pgTypeCodecModifier) === null || _a === void 0 ? void 0 : _a.call(aggregateSpec, spec_post.attributes.user_id.codec)) !== null && _b !== void 0 ? _b : spec_post.attributes.user_id.codec,
          direction: "DESC"
        });
      }
    },
    POSTS_DISTINCT_COUNT_CREATED_AT_ASC: {
      applyPlan($select) {
        var _a, _b;
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(pgResource_postPgResource.name));
        relation3.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation3.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof pgResource_postPgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`
select ${aggregateSpec.sqlAggregateWrap(sql.fragment`${tableAlias}.${sql.identifier("created_at")}`, spec_post.attributes.created_at.codec)}
from ${pgResource_postPgResource.from} ${tableAlias}
where ${sql.join(conditions.map(c => sql.parens(c)), " AND ")}`})`;
        $select.orderBy({
          fragment,
          codec: (_b = (_a = aggregateSpec.pgTypeCodecModifier) === null || _a === void 0 ? void 0 : _a.call(aggregateSpec, spec_post.attributes.created_at.codec)) !== null && _b !== void 0 ? _b : spec_post.attributes.created_at.codec,
          direction: "ASC"
        });
      }
    },
    POSTS_DISTINCT_COUNT_CREATED_AT_DESC: {
      applyPlan($select) {
        var _a, _b;
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(pgResource_postPgResource.name));
        relation3.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation3.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof pgResource_postPgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`
select ${aggregateSpec.sqlAggregateWrap(sql.fragment`${tableAlias}.${sql.identifier("created_at")}`, spec_post.attributes.created_at.codec)}
from ${pgResource_postPgResource.from} ${tableAlias}
where ${sql.join(conditions.map(c => sql.parens(c)), " AND ")}`})`;
        $select.orderBy({
          fragment,
          codec: (_b = (_a = aggregateSpec.pgTypeCodecModifier) === null || _a === void 0 ? void 0 : _a.call(aggregateSpec, spec_post.attributes.created_at.codec)) !== null && _b !== void 0 ? _b : spec_post.attributes.created_at.codec,
          direction: "DESC"
        });
      }
    },
    POSTS_DISTINCT_COUNT_UPDATED_AT_ASC: {
      applyPlan($select) {
        var _a, _b;
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(pgResource_postPgResource.name));
        relation3.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation3.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof pgResource_postPgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`
select ${aggregateSpec.sqlAggregateWrap(sql.fragment`${tableAlias}.${sql.identifier("updated_at")}`, spec_post.attributes.updated_at.codec)}
from ${pgResource_postPgResource.from} ${tableAlias}
where ${sql.join(conditions.map(c => sql.parens(c)), " AND ")}`})`;
        $select.orderBy({
          fragment,
          codec: (_b = (_a = aggregateSpec.pgTypeCodecModifier) === null || _a === void 0 ? void 0 : _a.call(aggregateSpec, spec_post.attributes.updated_at.codec)) !== null && _b !== void 0 ? _b : spec_post.attributes.updated_at.codec,
          direction: "ASC"
        });
      }
    },
    POSTS_DISTINCT_COUNT_UPDATED_AT_DESC: {
      applyPlan($select) {
        var _a, _b;
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(pgResource_postPgResource.name));
        relation3.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation3.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof pgResource_postPgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`
select ${aggregateSpec.sqlAggregateWrap(sql.fragment`${tableAlias}.${sql.identifier("updated_at")}`, spec_post.attributes.updated_at.codec)}
from ${pgResource_postPgResource.from} ${tableAlias}
where ${sql.join(conditions.map(c => sql.parens(c)), " AND ")}`})`;
        $select.orderBy({
          fragment,
          codec: (_b = (_a = aggregateSpec.pgTypeCodecModifier) === null || _a === void 0 ? void 0 : _a.call(aggregateSpec, spec_post.attributes.updated_at.codec)) !== null && _b !== void 0 ? _b : spec_post.attributes.updated_at.codec,
          direction: "DESC"
        });
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
    updatedAt: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) $condition.where({
          type: "attribute",
          attribute: "updated_at",
          callback(expression) {
            return sql`${expression} is null`;
          }
        });else $condition.where({
          type: "attribute",
          attribute: "updated_at",
          callback(expression) {
            return sql`${expression} = ${$condition.placeholder(val.get(), spec_project.attributes.updated_at.codec)}`;
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
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, !1);
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
    distinctCount($pgSelectSingle) {
      return $pgSelectSingle;
    }
  },
  OrganizationDistinctCountAggregates: {
    rowId($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("id")}`,
        sqlAggregate = aggregateSpec.sqlAggregateWrap(sqlAttribute, TYPES.uuid);
      return $pgSelectSingle.select(sqlAggregate, TYPES.bigint);
    },
    name($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("name")}`,
        sqlAggregate = aggregateSpec.sqlAggregateWrap(sqlAttribute, TYPES.text);
      return $pgSelectSingle.select(sqlAggregate, TYPES.bigint);
    },
    slug($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("slug")}`,
        sqlAggregate = aggregateSpec.sqlAggregateWrap(sqlAttribute, TYPES.text);
      return $pgSelectSingle.select(sqlAggregate, TYPES.bigint);
    },
    createdAt($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("created_at")}`,
        sqlAggregate = aggregateSpec.sqlAggregateWrap(sqlAttribute, TYPES.timestamptz);
      return $pgSelectSingle.select(sqlAggregate, TYPES.bigint);
    },
    updatedAt($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("updated_at")}`,
        sqlAggregate = aggregateSpec.sqlAggregateWrap(sqlAttribute, TYPES.timestamptz);
      return $pgSelectSingle.select(sqlAggregate, TYPES.bigint);
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
    UPDATED_AT: {
      applyPlan: OrganizationGroupBy_extensions_grafast_applyPlan4
    },
    UPDATED_AT_TRUNCATED_TO_HOUR: {
      applyPlan: OrganizationGroupBy_extensions_grafast_applyPlan5
    },
    UPDATED_AT_TRUNCATED_TO_DAY: {
      applyPlan: OrganizationGroupBy_extensions_grafast_applyPlan6
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
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = aggregateSpec2.sqlAggregateWrap(attributeExpression, spec_organization.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    updatedAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("updated_at")}`,
          aggregateExpression = aggregateSpec2.sqlAggregateWrap(attributeExpression, spec_organization.attributes.updated_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    }
  },
  OrganizationHavingDistinctCountInput: {
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = aggregateSpec.sqlAggregateWrap(attributeExpression, spec_organization.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    updatedAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("updated_at")}`,
          aggregateExpression = aggregateSpec.sqlAggregateWrap(attributeExpression, spec_organization.attributes.updated_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    }
  },
  OrganizationHavingMinInput: {
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = aggregateSpec3.sqlAggregateWrap(attributeExpression, spec_organization.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    updatedAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("updated_at")}`,
          aggregateExpression = aggregateSpec3.sqlAggregateWrap(attributeExpression, spec_organization.attributes.updated_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    }
  },
  OrganizationHavingMaxInput: {
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = aggregateSpec4.sqlAggregateWrap(attributeExpression, spec_organization.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    updatedAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("updated_at")}`,
          aggregateExpression = aggregateSpec4.sqlAggregateWrap(attributeExpression, spec_organization.attributes.updated_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    }
  },
  OrganizationHavingAverageInput: {
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = aggregateSpec5.sqlAggregateWrap(attributeExpression, spec_organization.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    updatedAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("updated_at")}`,
          aggregateExpression = aggregateSpec5.sqlAggregateWrap(attributeExpression, spec_organization.attributes.updated_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    }
  },
  OrganizationHavingStddevSampleInput: {
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = aggregateSpec6.sqlAggregateWrap(attributeExpression, spec_organization.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    updatedAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("updated_at")}`,
          aggregateExpression = aggregateSpec6.sqlAggregateWrap(attributeExpression, spec_organization.attributes.updated_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    }
  },
  OrganizationHavingStddevPopulationInput: {
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = aggregateSpec7.sqlAggregateWrap(attributeExpression, spec_organization.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    updatedAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("updated_at")}`,
          aggregateExpression = aggregateSpec7.sqlAggregateWrap(attributeExpression, spec_organization.attributes.updated_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    }
  },
  OrganizationHavingVarianceSampleInput: {
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = aggregateSpec8.sqlAggregateWrap(attributeExpression, spec_organization.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    updatedAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("updated_at")}`,
          aggregateExpression = aggregateSpec8.sqlAggregateWrap(attributeExpression, spec_organization.attributes.updated_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    }
  },
  OrganizationHavingVariancePopulationInput: {
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = aggregateSpec9.sqlAggregateWrap(attributeExpression, spec_organization.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    updatedAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("updated_at")}`,
          aggregateExpression = aggregateSpec9.sqlAggregateWrap(attributeExpression, spec_organization.attributes.updated_at.codec);
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
    ROW_ID_ASC: {
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
    ROW_ID_DESC: {
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
        if (true) plan.setOrderIsUnique();
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
        if (true) plan.setOrderIsUnique();
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
        if (true) plan.setOrderIsUnique();
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
    UPDATED_AT_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "updated_at",
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
          attribute: "updated_at",
          direction: "DESC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (false) plan.setOrderIsUnique();
      }
    },
    PROJECTS_COUNT_ASC: {
      applyPlan($select) {
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(pgResource_projectPgResource.name));
        relation4.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation4.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof pgResource_projectPgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`select count(*)
from ${pgResource_projectPgResource.from} ${tableAlias}
where ${sql.parens(sql.join(conditions.map(c => sql.parens(c)), " AND "))}`})`;
        $select.orderBy({
          fragment,
          codec: TYPES.bigint,
          direction: "ASC"
        });
      }
    },
    PROJECTS_COUNT_DESC: {
      applyPlan($select) {
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(pgResource_projectPgResource.name));
        relation4.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation4.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof pgResource_projectPgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`select count(*)
from ${pgResource_projectPgResource.from} ${tableAlias}
where ${sql.parens(sql.join(conditions.map(c => sql.parens(c)), " AND "))}`})`;
        $select.orderBy({
          fragment,
          codec: TYPES.bigint,
          direction: "DESC"
        });
      }
    },
    PROJECTS_DISTINCT_COUNT_ROW_ID_ASC: {
      applyPlan($select) {
        var _a, _b;
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(pgResource_projectPgResource.name));
        relation4.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation4.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof pgResource_projectPgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`
select ${aggregateSpec.sqlAggregateWrap(sql.fragment`${tableAlias}.${sql.identifier("id")}`, spec_project.attributes.id.codec)}
from ${pgResource_projectPgResource.from} ${tableAlias}
where ${sql.join(conditions.map(c => sql.parens(c)), " AND ")}`})`;
        $select.orderBy({
          fragment,
          codec: (_b = (_a = aggregateSpec.pgTypeCodecModifier) === null || _a === void 0 ? void 0 : _a.call(aggregateSpec, spec_project.attributes.id.codec)) !== null && _b !== void 0 ? _b : spec_project.attributes.id.codec,
          direction: "ASC"
        });
      }
    },
    PROJECTS_DISTINCT_COUNT_ROW_ID_DESC: {
      applyPlan($select) {
        var _a, _b;
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(pgResource_projectPgResource.name));
        relation4.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation4.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof pgResource_projectPgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`
select ${aggregateSpec.sqlAggregateWrap(sql.fragment`${tableAlias}.${sql.identifier("id")}`, spec_project.attributes.id.codec)}
from ${pgResource_projectPgResource.from} ${tableAlias}
where ${sql.join(conditions.map(c => sql.parens(c)), " AND ")}`})`;
        $select.orderBy({
          fragment,
          codec: (_b = (_a = aggregateSpec.pgTypeCodecModifier) === null || _a === void 0 ? void 0 : _a.call(aggregateSpec, spec_project.attributes.id.codec)) !== null && _b !== void 0 ? _b : spec_project.attributes.id.codec,
          direction: "DESC"
        });
      }
    },
    PROJECTS_DISTINCT_COUNT_NAME_ASC: {
      applyPlan($select) {
        var _a, _b;
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(pgResource_projectPgResource.name));
        relation4.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation4.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof pgResource_projectPgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`
select ${aggregateSpec.sqlAggregateWrap(sql.fragment`${tableAlias}.${sql.identifier("name")}`, spec_project.attributes.name.codec)}
from ${pgResource_projectPgResource.from} ${tableAlias}
where ${sql.join(conditions.map(c => sql.parens(c)), " AND ")}`})`;
        $select.orderBy({
          fragment,
          codec: (_b = (_a = aggregateSpec.pgTypeCodecModifier) === null || _a === void 0 ? void 0 : _a.call(aggregateSpec, spec_project.attributes.name.codec)) !== null && _b !== void 0 ? _b : spec_project.attributes.name.codec,
          direction: "ASC"
        });
      }
    },
    PROJECTS_DISTINCT_COUNT_NAME_DESC: {
      applyPlan($select) {
        var _a, _b;
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(pgResource_projectPgResource.name));
        relation4.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation4.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof pgResource_projectPgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`
select ${aggregateSpec.sqlAggregateWrap(sql.fragment`${tableAlias}.${sql.identifier("name")}`, spec_project.attributes.name.codec)}
from ${pgResource_projectPgResource.from} ${tableAlias}
where ${sql.join(conditions.map(c => sql.parens(c)), " AND ")}`})`;
        $select.orderBy({
          fragment,
          codec: (_b = (_a = aggregateSpec.pgTypeCodecModifier) === null || _a === void 0 ? void 0 : _a.call(aggregateSpec, spec_project.attributes.name.codec)) !== null && _b !== void 0 ? _b : spec_project.attributes.name.codec,
          direction: "DESC"
        });
      }
    },
    PROJECTS_DISTINCT_COUNT_IMAGE_ASC: {
      applyPlan($select) {
        var _a, _b;
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(pgResource_projectPgResource.name));
        relation4.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation4.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof pgResource_projectPgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`
select ${aggregateSpec.sqlAggregateWrap(sql.fragment`${tableAlias}.${sql.identifier("image")}`, spec_project.attributes.image.codec)}
from ${pgResource_projectPgResource.from} ${tableAlias}
where ${sql.join(conditions.map(c => sql.parens(c)), " AND ")}`})`;
        $select.orderBy({
          fragment,
          codec: (_b = (_a = aggregateSpec.pgTypeCodecModifier) === null || _a === void 0 ? void 0 : _a.call(aggregateSpec, spec_project.attributes.image.codec)) !== null && _b !== void 0 ? _b : spec_project.attributes.image.codec,
          direction: "ASC"
        });
      }
    },
    PROJECTS_DISTINCT_COUNT_IMAGE_DESC: {
      applyPlan($select) {
        var _a, _b;
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(pgResource_projectPgResource.name));
        relation4.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation4.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof pgResource_projectPgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`
select ${aggregateSpec.sqlAggregateWrap(sql.fragment`${tableAlias}.${sql.identifier("image")}`, spec_project.attributes.image.codec)}
from ${pgResource_projectPgResource.from} ${tableAlias}
where ${sql.join(conditions.map(c => sql.parens(c)), " AND ")}`})`;
        $select.orderBy({
          fragment,
          codec: (_b = (_a = aggregateSpec.pgTypeCodecModifier) === null || _a === void 0 ? void 0 : _a.call(aggregateSpec, spec_project.attributes.image.codec)) !== null && _b !== void 0 ? _b : spec_project.attributes.image.codec,
          direction: "DESC"
        });
      }
    },
    PROJECTS_DISTINCT_COUNT_SLUG_ASC: {
      applyPlan($select) {
        var _a, _b;
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(pgResource_projectPgResource.name));
        relation4.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation4.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof pgResource_projectPgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`
select ${aggregateSpec.sqlAggregateWrap(sql.fragment`${tableAlias}.${sql.identifier("slug")}`, spec_project.attributes.slug.codec)}
from ${pgResource_projectPgResource.from} ${tableAlias}
where ${sql.join(conditions.map(c => sql.parens(c)), " AND ")}`})`;
        $select.orderBy({
          fragment,
          codec: (_b = (_a = aggregateSpec.pgTypeCodecModifier) === null || _a === void 0 ? void 0 : _a.call(aggregateSpec, spec_project.attributes.slug.codec)) !== null && _b !== void 0 ? _b : spec_project.attributes.slug.codec,
          direction: "ASC"
        });
      }
    },
    PROJECTS_DISTINCT_COUNT_SLUG_DESC: {
      applyPlan($select) {
        var _a, _b;
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(pgResource_projectPgResource.name));
        relation4.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation4.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof pgResource_projectPgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`
select ${aggregateSpec.sqlAggregateWrap(sql.fragment`${tableAlias}.${sql.identifier("slug")}`, spec_project.attributes.slug.codec)}
from ${pgResource_projectPgResource.from} ${tableAlias}
where ${sql.join(conditions.map(c => sql.parens(c)), " AND ")}`})`;
        $select.orderBy({
          fragment,
          codec: (_b = (_a = aggregateSpec.pgTypeCodecModifier) === null || _a === void 0 ? void 0 : _a.call(aggregateSpec, spec_project.attributes.slug.codec)) !== null && _b !== void 0 ? _b : spec_project.attributes.slug.codec,
          direction: "DESC"
        });
      }
    },
    PROJECTS_DISTINCT_COUNT_DESCRIPTION_ASC: {
      applyPlan($select) {
        var _a, _b;
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(pgResource_projectPgResource.name));
        relation4.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation4.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof pgResource_projectPgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`
select ${aggregateSpec.sqlAggregateWrap(sql.fragment`${tableAlias}.${sql.identifier("description")}`, spec_project.attributes.description.codec)}
from ${pgResource_projectPgResource.from} ${tableAlias}
where ${sql.join(conditions.map(c => sql.parens(c)), " AND ")}`})`;
        $select.orderBy({
          fragment,
          codec: (_b = (_a = aggregateSpec.pgTypeCodecModifier) === null || _a === void 0 ? void 0 : _a.call(aggregateSpec, spec_project.attributes.description.codec)) !== null && _b !== void 0 ? _b : spec_project.attributes.description.codec,
          direction: "ASC"
        });
      }
    },
    PROJECTS_DISTINCT_COUNT_DESCRIPTION_DESC: {
      applyPlan($select) {
        var _a, _b;
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(pgResource_projectPgResource.name));
        relation4.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation4.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof pgResource_projectPgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`
select ${aggregateSpec.sqlAggregateWrap(sql.fragment`${tableAlias}.${sql.identifier("description")}`, spec_project.attributes.description.codec)}
from ${pgResource_projectPgResource.from} ${tableAlias}
where ${sql.join(conditions.map(c => sql.parens(c)), " AND ")}`})`;
        $select.orderBy({
          fragment,
          codec: (_b = (_a = aggregateSpec.pgTypeCodecModifier) === null || _a === void 0 ? void 0 : _a.call(aggregateSpec, spec_project.attributes.description.codec)) !== null && _b !== void 0 ? _b : spec_project.attributes.description.codec,
          direction: "DESC"
        });
      }
    },
    PROJECTS_DISTINCT_COUNT_ORGANIZATION_ID_ASC: {
      applyPlan($select) {
        var _a, _b;
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(pgResource_projectPgResource.name));
        relation4.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation4.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof pgResource_projectPgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`
select ${aggregateSpec.sqlAggregateWrap(sql.fragment`${tableAlias}.${sql.identifier("organization_id")}`, spec_project.attributes.organization_id.codec)}
from ${pgResource_projectPgResource.from} ${tableAlias}
where ${sql.join(conditions.map(c => sql.parens(c)), " AND ")}`})`;
        $select.orderBy({
          fragment,
          codec: (_b = (_a = aggregateSpec.pgTypeCodecModifier) === null || _a === void 0 ? void 0 : _a.call(aggregateSpec, spec_project.attributes.organization_id.codec)) !== null && _b !== void 0 ? _b : spec_project.attributes.organization_id.codec,
          direction: "ASC"
        });
      }
    },
    PROJECTS_DISTINCT_COUNT_ORGANIZATION_ID_DESC: {
      applyPlan($select) {
        var _a, _b;
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(pgResource_projectPgResource.name));
        relation4.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation4.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof pgResource_projectPgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`
select ${aggregateSpec.sqlAggregateWrap(sql.fragment`${tableAlias}.${sql.identifier("organization_id")}`, spec_project.attributes.organization_id.codec)}
from ${pgResource_projectPgResource.from} ${tableAlias}
where ${sql.join(conditions.map(c => sql.parens(c)), " AND ")}`})`;
        $select.orderBy({
          fragment,
          codec: (_b = (_a = aggregateSpec.pgTypeCodecModifier) === null || _a === void 0 ? void 0 : _a.call(aggregateSpec, spec_project.attributes.organization_id.codec)) !== null && _b !== void 0 ? _b : spec_project.attributes.organization_id.codec,
          direction: "DESC"
        });
      }
    },
    PROJECTS_DISTINCT_COUNT_CREATED_AT_ASC: {
      applyPlan($select) {
        var _a, _b;
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(pgResource_projectPgResource.name));
        relation4.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation4.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof pgResource_projectPgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`
select ${aggregateSpec.sqlAggregateWrap(sql.fragment`${tableAlias}.${sql.identifier("created_at")}`, spec_project.attributes.created_at.codec)}
from ${pgResource_projectPgResource.from} ${tableAlias}
where ${sql.join(conditions.map(c => sql.parens(c)), " AND ")}`})`;
        $select.orderBy({
          fragment,
          codec: (_b = (_a = aggregateSpec.pgTypeCodecModifier) === null || _a === void 0 ? void 0 : _a.call(aggregateSpec, spec_project.attributes.created_at.codec)) !== null && _b !== void 0 ? _b : spec_project.attributes.created_at.codec,
          direction: "ASC"
        });
      }
    },
    PROJECTS_DISTINCT_COUNT_CREATED_AT_DESC: {
      applyPlan($select) {
        var _a, _b;
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(pgResource_projectPgResource.name));
        relation4.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation4.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof pgResource_projectPgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`
select ${aggregateSpec.sqlAggregateWrap(sql.fragment`${tableAlias}.${sql.identifier("created_at")}`, spec_project.attributes.created_at.codec)}
from ${pgResource_projectPgResource.from} ${tableAlias}
where ${sql.join(conditions.map(c => sql.parens(c)), " AND ")}`})`;
        $select.orderBy({
          fragment,
          codec: (_b = (_a = aggregateSpec.pgTypeCodecModifier) === null || _a === void 0 ? void 0 : _a.call(aggregateSpec, spec_project.attributes.created_at.codec)) !== null && _b !== void 0 ? _b : spec_project.attributes.created_at.codec,
          direction: "DESC"
        });
      }
    },
    PROJECTS_DISTINCT_COUNT_UPDATED_AT_ASC: {
      applyPlan($select) {
        var _a, _b;
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(pgResource_projectPgResource.name));
        relation4.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation4.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof pgResource_projectPgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`
select ${aggregateSpec.sqlAggregateWrap(sql.fragment`${tableAlias}.${sql.identifier("updated_at")}`, spec_project.attributes.updated_at.codec)}
from ${pgResource_projectPgResource.from} ${tableAlias}
where ${sql.join(conditions.map(c => sql.parens(c)), " AND ")}`})`;
        $select.orderBy({
          fragment,
          codec: (_b = (_a = aggregateSpec.pgTypeCodecModifier) === null || _a === void 0 ? void 0 : _a.call(aggregateSpec, spec_project.attributes.updated_at.codec)) !== null && _b !== void 0 ? _b : spec_project.attributes.updated_at.codec,
          direction: "ASC"
        });
      }
    },
    PROJECTS_DISTINCT_COUNT_UPDATED_AT_DESC: {
      applyPlan($select) {
        var _a, _b;
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(pgResource_projectPgResource.name));
        relation4.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation4.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof pgResource_projectPgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`
select ${aggregateSpec.sqlAggregateWrap(sql.fragment`${tableAlias}.${sql.identifier("updated_at")}`, spec_project.attributes.updated_at.codec)}
from ${pgResource_projectPgResource.from} ${tableAlias}
where ${sql.join(conditions.map(c => sql.parens(c)), " AND ")}`})`;
        $select.orderBy({
          fragment,
          codec: (_b = (_a = aggregateSpec.pgTypeCodecModifier) === null || _a === void 0 ? void 0 : _a.call(aggregateSpec, spec_project.attributes.updated_at.codec)) !== null && _b !== void 0 ? _b : spec_project.attributes.updated_at.codec,
          direction: "DESC"
        });
      }
    },
    USER_ORGANIZATIONS_COUNT_ASC: {
      applyPlan($select) {
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(resource_user_organizationPgResource.name));
        relation5.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation5.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof resource_user_organizationPgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`select count(*)
from ${resource_user_organizationPgResource.from} ${tableAlias}
where ${sql.parens(sql.join(conditions.map(c => sql.parens(c)), " AND "))}`})`;
        $select.orderBy({
          fragment,
          codec: TYPES.bigint,
          direction: "ASC"
        });
      }
    },
    USER_ORGANIZATIONS_COUNT_DESC: {
      applyPlan($select) {
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(resource_user_organizationPgResource.name));
        relation5.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation5.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof resource_user_organizationPgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`select count(*)
from ${resource_user_organizationPgResource.from} ${tableAlias}
where ${sql.parens(sql.join(conditions.map(c => sql.parens(c)), " AND "))}`})`;
        $select.orderBy({
          fragment,
          codec: TYPES.bigint,
          direction: "DESC"
        });
      }
    },
    USER_ORGANIZATIONS_DISTINCT_COUNT_USER_ID_ASC: {
      applyPlan($select) {
        var _a, _b;
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(resource_user_organizationPgResource.name));
        relation5.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation5.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof resource_user_organizationPgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`
select ${aggregateSpec.sqlAggregateWrap(sql.fragment`${tableAlias}.${sql.identifier("user_id")}`, spec_userOrganization.attributes.user_id.codec)}
from ${resource_user_organizationPgResource.from} ${tableAlias}
where ${sql.join(conditions.map(c => sql.parens(c)), " AND ")}`})`;
        $select.orderBy({
          fragment,
          codec: (_b = (_a = aggregateSpec.pgTypeCodecModifier) === null || _a === void 0 ? void 0 : _a.call(aggregateSpec, spec_userOrganization.attributes.user_id.codec)) !== null && _b !== void 0 ? _b : spec_userOrganization.attributes.user_id.codec,
          direction: "ASC"
        });
      }
    },
    USER_ORGANIZATIONS_DISTINCT_COUNT_USER_ID_DESC: {
      applyPlan($select) {
        var _a, _b;
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(resource_user_organizationPgResource.name));
        relation5.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation5.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof resource_user_organizationPgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`
select ${aggregateSpec.sqlAggregateWrap(sql.fragment`${tableAlias}.${sql.identifier("user_id")}`, spec_userOrganization.attributes.user_id.codec)}
from ${resource_user_organizationPgResource.from} ${tableAlias}
where ${sql.join(conditions.map(c => sql.parens(c)), " AND ")}`})`;
        $select.orderBy({
          fragment,
          codec: (_b = (_a = aggregateSpec.pgTypeCodecModifier) === null || _a === void 0 ? void 0 : _a.call(aggregateSpec, spec_userOrganization.attributes.user_id.codec)) !== null && _b !== void 0 ? _b : spec_userOrganization.attributes.user_id.codec,
          direction: "DESC"
        });
      }
    },
    USER_ORGANIZATIONS_DISTINCT_COUNT_ORGANIZATION_ID_ASC: {
      applyPlan($select) {
        var _a, _b;
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(resource_user_organizationPgResource.name));
        relation5.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation5.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof resource_user_organizationPgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`
select ${aggregateSpec.sqlAggregateWrap(sql.fragment`${tableAlias}.${sql.identifier("organization_id")}`, spec_userOrganization.attributes.organization_id.codec)}
from ${resource_user_organizationPgResource.from} ${tableAlias}
where ${sql.join(conditions.map(c => sql.parens(c)), " AND ")}`})`;
        $select.orderBy({
          fragment,
          codec: (_b = (_a = aggregateSpec.pgTypeCodecModifier) === null || _a === void 0 ? void 0 : _a.call(aggregateSpec, spec_userOrganization.attributes.organization_id.codec)) !== null && _b !== void 0 ? _b : spec_userOrganization.attributes.organization_id.codec,
          direction: "ASC"
        });
      }
    },
    USER_ORGANIZATIONS_DISTINCT_COUNT_ORGANIZATION_ID_DESC: {
      applyPlan($select) {
        var _a, _b;
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(resource_user_organizationPgResource.name));
        relation5.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation5.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof resource_user_organizationPgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`
select ${aggregateSpec.sqlAggregateWrap(sql.fragment`${tableAlias}.${sql.identifier("organization_id")}`, spec_userOrganization.attributes.organization_id.codec)}
from ${resource_user_organizationPgResource.from} ${tableAlias}
where ${sql.join(conditions.map(c => sql.parens(c)), " AND ")}`})`;
        $select.orderBy({
          fragment,
          codec: (_b = (_a = aggregateSpec.pgTypeCodecModifier) === null || _a === void 0 ? void 0 : _a.call(aggregateSpec, spec_userOrganization.attributes.organization_id.codec)) !== null && _b !== void 0 ? _b : spec_userOrganization.attributes.organization_id.codec,
          direction: "DESC"
        });
      }
    },
    USER_ORGANIZATIONS_DISTINCT_COUNT_CREATED_AT_ASC: {
      applyPlan($select) {
        var _a, _b;
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(resource_user_organizationPgResource.name));
        relation5.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation5.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof resource_user_organizationPgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`
select ${aggregateSpec.sqlAggregateWrap(sql.fragment`${tableAlias}.${sql.identifier("created_at")}`, spec_userOrganization.attributes.created_at.codec)}
from ${resource_user_organizationPgResource.from} ${tableAlias}
where ${sql.join(conditions.map(c => sql.parens(c)), " AND ")}`})`;
        $select.orderBy({
          fragment,
          codec: (_b = (_a = aggregateSpec.pgTypeCodecModifier) === null || _a === void 0 ? void 0 : _a.call(aggregateSpec, spec_userOrganization.attributes.created_at.codec)) !== null && _b !== void 0 ? _b : spec_userOrganization.attributes.created_at.codec,
          direction: "ASC"
        });
      }
    },
    USER_ORGANIZATIONS_DISTINCT_COUNT_CREATED_AT_DESC: {
      applyPlan($select) {
        var _a, _b;
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(resource_user_organizationPgResource.name));
        relation5.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation5.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof resource_user_organizationPgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`
select ${aggregateSpec.sqlAggregateWrap(sql.fragment`${tableAlias}.${sql.identifier("created_at")}`, spec_userOrganization.attributes.created_at.codec)}
from ${resource_user_organizationPgResource.from} ${tableAlias}
where ${sql.join(conditions.map(c => sql.parens(c)), " AND ")}`})`;
        $select.orderBy({
          fragment,
          codec: (_b = (_a = aggregateSpec.pgTypeCodecModifier) === null || _a === void 0 ? void 0 : _a.call(aggregateSpec, spec_userOrganization.attributes.created_at.codec)) !== null && _b !== void 0 ? _b : spec_userOrganization.attributes.created_at.codec,
          direction: "DESC"
        });
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
    updatedAt: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) $condition.where({
          type: "attribute",
          attribute: "updated_at",
          callback(expression) {
            return sql`${expression} is null`;
          }
        });else $condition.where({
          type: "attribute",
          attribute: "updated_at",
          callback(expression) {
            return sql`${expression} = ${$condition.placeholder(val.get(), spec_organization.attributes.updated_at.codec)}`;
          }
        });
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
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
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, !1);
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
    distinctCount($pgSelectSingle) {
      return $pgSelectSingle;
    }
  },
  UserDistinctCountAggregates: {
    rowId($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("id")}`,
        sqlAggregate = aggregateSpec.sqlAggregateWrap(sqlAttribute, TYPES.uuid);
      return $pgSelectSingle.select(sqlAggregate, TYPES.bigint);
    },
    createdAt($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("created_at")}`,
        sqlAggregate = aggregateSpec.sqlAggregateWrap(sqlAttribute, TYPES.timestamptz);
      return $pgSelectSingle.select(sqlAggregate, TYPES.bigint);
    },
    updatedAt($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("updated_at")}`,
        sqlAggregate = aggregateSpec.sqlAggregateWrap(sqlAttribute, TYPES.timestamptz);
      return $pgSelectSingle.select(sqlAggregate, TYPES.bigint);
    },
    hidraId($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("hidra_id")}`,
        sqlAggregate = aggregateSpec.sqlAggregateWrap(sqlAttribute, TYPES.uuid);
      return $pgSelectSingle.select(sqlAggregate, TYPES.bigint);
    },
    username($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("username")}`,
        sqlAggregate = aggregateSpec.sqlAggregateWrap(sqlAttribute, TYPES.text);
      return $pgSelectSingle.select(sqlAggregate, TYPES.bigint);
    },
    firstName($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("first_name")}`,
        sqlAggregate = aggregateSpec.sqlAggregateWrap(sqlAttribute, TYPES.text);
      return $pgSelectSingle.select(sqlAggregate, TYPES.bigint);
    },
    lastName($pgSelectSingle) {
      const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier("last_name")}`,
        sqlAggregate = aggregateSpec.sqlAggregateWrap(sqlAttribute, TYPES.text);
      return $pgSelectSingle.select(sqlAggregate, TYPES.bigint);
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
    UPDATED_AT: {
      applyPlan: UserGroupBy_extensions_grafast_applyPlan4
    },
    UPDATED_AT_TRUNCATED_TO_HOUR: {
      applyPlan: UserGroupBy_extensions_grafast_applyPlan5
    },
    UPDATED_AT_TRUNCATED_TO_DAY: {
      applyPlan: UserGroupBy_extensions_grafast_applyPlan6
    },
    FIRST_NAME: {
      applyPlan: UserGroupBy_extensions_grafast_applyPlan7
    },
    LAST_NAME: {
      applyPlan: UserGroupBy_extensions_grafast_applyPlan8
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
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = aggregateSpec2.sqlAggregateWrap(attributeExpression, spec_user.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    updatedAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("updated_at")}`,
          aggregateExpression = aggregateSpec2.sqlAggregateWrap(attributeExpression, spec_user.attributes.updated_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    }
  },
  UserHavingDistinctCountInput: {
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = aggregateSpec.sqlAggregateWrap(attributeExpression, spec_user.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    updatedAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("updated_at")}`,
          aggregateExpression = aggregateSpec.sqlAggregateWrap(attributeExpression, spec_user.attributes.updated_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    }
  },
  UserHavingMinInput: {
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = aggregateSpec3.sqlAggregateWrap(attributeExpression, spec_user.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    updatedAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("updated_at")}`,
          aggregateExpression = aggregateSpec3.sqlAggregateWrap(attributeExpression, spec_user.attributes.updated_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    }
  },
  UserHavingMaxInput: {
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = aggregateSpec4.sqlAggregateWrap(attributeExpression, spec_user.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    updatedAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("updated_at")}`,
          aggregateExpression = aggregateSpec4.sqlAggregateWrap(attributeExpression, spec_user.attributes.updated_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    }
  },
  UserHavingAverageInput: {
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = aggregateSpec5.sqlAggregateWrap(attributeExpression, spec_user.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    updatedAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("updated_at")}`,
          aggregateExpression = aggregateSpec5.sqlAggregateWrap(attributeExpression, spec_user.attributes.updated_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    }
  },
  UserHavingStddevSampleInput: {
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = aggregateSpec6.sqlAggregateWrap(attributeExpression, spec_user.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    updatedAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("updated_at")}`,
          aggregateExpression = aggregateSpec6.sqlAggregateWrap(attributeExpression, spec_user.attributes.updated_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    }
  },
  UserHavingStddevPopulationInput: {
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = aggregateSpec7.sqlAggregateWrap(attributeExpression, spec_user.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    updatedAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("updated_at")}`,
          aggregateExpression = aggregateSpec7.sqlAggregateWrap(attributeExpression, spec_user.attributes.updated_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    }
  },
  UserHavingVarianceSampleInput: {
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = aggregateSpec8.sqlAggregateWrap(attributeExpression, spec_user.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    updatedAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("updated_at")}`,
          aggregateExpression = aggregateSpec8.sqlAggregateWrap(attributeExpression, spec_user.attributes.updated_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    }
  },
  UserHavingVariancePopulationInput: {
    createdAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("created_at")}`,
          aggregateExpression = aggregateSpec9.sqlAggregateWrap(attributeExpression, spec_user.attributes.created_at.codec);
        return new PgBooleanFilterStep($having, aggregateExpression);
      }
    },
    updatedAt: {
      applyPlan($having) {
        const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier("updated_at")}`,
          aggregateExpression = aggregateSpec9.sqlAggregateWrap(attributeExpression, spec_user.attributes.updated_at.codec);
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
    ROW_ID_ASC: {
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
    ROW_ID_DESC: {
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
    UPDATED_AT_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "updated_at",
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
          attribute: "updated_at",
          direction: "DESC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (false) plan.setOrderIsUnique();
      }
    },
    HIDRA_ID_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "hidra_id",
          direction: "ASC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (true) plan.setOrderIsUnique();
      }
    },
    HIDRA_ID_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "hidra_id",
          direction: "DESC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (true) plan.setOrderIsUnique();
      }
    },
    USERNAME_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "username",
          direction: "ASC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (true) plan.setOrderIsUnique();
      }
    },
    USERNAME_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "username",
          direction: "DESC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (true) plan.setOrderIsUnique();
      }
    },
    FIRST_NAME_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "first_name",
          direction: "ASC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (false) plan.setOrderIsUnique();
      }
    },
    FIRST_NAME_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "first_name",
          direction: "DESC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (false) plan.setOrderIsUnique();
      }
    },
    LAST_NAME_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "last_name",
          direction: "ASC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (false) plan.setOrderIsUnique();
      }
    },
    LAST_NAME_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        plan.orderBy({
          attribute: "last_name",
          direction: "DESC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (false) plan.setOrderIsUnique();
      }
    },
    POSTS_COUNT_ASC: {
      applyPlan($select) {
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(pgResource_postPgResource.name));
        relation6.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation6.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof pgResource_postPgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`select count(*)
from ${pgResource_postPgResource.from} ${tableAlias}
where ${sql.parens(sql.join(conditions.map(c => sql.parens(c)), " AND "))}`})`;
        $select.orderBy({
          fragment,
          codec: TYPES.bigint,
          direction: "ASC"
        });
      }
    },
    POSTS_COUNT_DESC: {
      applyPlan($select) {
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(pgResource_postPgResource.name));
        relation6.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation6.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof pgResource_postPgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`select count(*)
from ${pgResource_postPgResource.from} ${tableAlias}
where ${sql.parens(sql.join(conditions.map(c => sql.parens(c)), " AND "))}`})`;
        $select.orderBy({
          fragment,
          codec: TYPES.bigint,
          direction: "DESC"
        });
      }
    },
    POSTS_DISTINCT_COUNT_ROW_ID_ASC: {
      applyPlan($select) {
        var _a, _b;
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(pgResource_postPgResource.name));
        relation6.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation6.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof pgResource_postPgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`
select ${aggregateSpec.sqlAggregateWrap(sql.fragment`${tableAlias}.${sql.identifier("id")}`, spec_post.attributes.id.codec)}
from ${pgResource_postPgResource.from} ${tableAlias}
where ${sql.join(conditions.map(c => sql.parens(c)), " AND ")}`})`;
        $select.orderBy({
          fragment,
          codec: (_b = (_a = aggregateSpec.pgTypeCodecModifier) === null || _a === void 0 ? void 0 : _a.call(aggregateSpec, spec_post.attributes.id.codec)) !== null && _b !== void 0 ? _b : spec_post.attributes.id.codec,
          direction: "ASC"
        });
      }
    },
    POSTS_DISTINCT_COUNT_ROW_ID_DESC: {
      applyPlan($select) {
        var _a, _b;
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(pgResource_postPgResource.name));
        relation6.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation6.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof pgResource_postPgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`
select ${aggregateSpec.sqlAggregateWrap(sql.fragment`${tableAlias}.${sql.identifier("id")}`, spec_post.attributes.id.codec)}
from ${pgResource_postPgResource.from} ${tableAlias}
where ${sql.join(conditions.map(c => sql.parens(c)), " AND ")}`})`;
        $select.orderBy({
          fragment,
          codec: (_b = (_a = aggregateSpec.pgTypeCodecModifier) === null || _a === void 0 ? void 0 : _a.call(aggregateSpec, spec_post.attributes.id.codec)) !== null && _b !== void 0 ? _b : spec_post.attributes.id.codec,
          direction: "DESC"
        });
      }
    },
    POSTS_DISTINCT_COUNT_TITLE_ASC: {
      applyPlan($select) {
        var _a, _b;
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(pgResource_postPgResource.name));
        relation6.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation6.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof pgResource_postPgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`
select ${aggregateSpec.sqlAggregateWrap(sql.fragment`${tableAlias}.${sql.identifier("title")}`, spec_post.attributes.title.codec)}
from ${pgResource_postPgResource.from} ${tableAlias}
where ${sql.join(conditions.map(c => sql.parens(c)), " AND ")}`})`;
        $select.orderBy({
          fragment,
          codec: (_b = (_a = aggregateSpec.pgTypeCodecModifier) === null || _a === void 0 ? void 0 : _a.call(aggregateSpec, spec_post.attributes.title.codec)) !== null && _b !== void 0 ? _b : spec_post.attributes.title.codec,
          direction: "ASC"
        });
      }
    },
    POSTS_DISTINCT_COUNT_TITLE_DESC: {
      applyPlan($select) {
        var _a, _b;
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(pgResource_postPgResource.name));
        relation6.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation6.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof pgResource_postPgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`
select ${aggregateSpec.sqlAggregateWrap(sql.fragment`${tableAlias}.${sql.identifier("title")}`, spec_post.attributes.title.codec)}
from ${pgResource_postPgResource.from} ${tableAlias}
where ${sql.join(conditions.map(c => sql.parens(c)), " AND ")}`})`;
        $select.orderBy({
          fragment,
          codec: (_b = (_a = aggregateSpec.pgTypeCodecModifier) === null || _a === void 0 ? void 0 : _a.call(aggregateSpec, spec_post.attributes.title.codec)) !== null && _b !== void 0 ? _b : spec_post.attributes.title.codec,
          direction: "DESC"
        });
      }
    },
    POSTS_DISTINCT_COUNT_DESCRIPTION_ASC: {
      applyPlan($select) {
        var _a, _b;
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(pgResource_postPgResource.name));
        relation6.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation6.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof pgResource_postPgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`
select ${aggregateSpec.sqlAggregateWrap(sql.fragment`${tableAlias}.${sql.identifier("description")}`, spec_post.attributes.description.codec)}
from ${pgResource_postPgResource.from} ${tableAlias}
where ${sql.join(conditions.map(c => sql.parens(c)), " AND ")}`})`;
        $select.orderBy({
          fragment,
          codec: (_b = (_a = aggregateSpec.pgTypeCodecModifier) === null || _a === void 0 ? void 0 : _a.call(aggregateSpec, spec_post.attributes.description.codec)) !== null && _b !== void 0 ? _b : spec_post.attributes.description.codec,
          direction: "ASC"
        });
      }
    },
    POSTS_DISTINCT_COUNT_DESCRIPTION_DESC: {
      applyPlan($select) {
        var _a, _b;
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(pgResource_postPgResource.name));
        relation6.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation6.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof pgResource_postPgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`
select ${aggregateSpec.sqlAggregateWrap(sql.fragment`${tableAlias}.${sql.identifier("description")}`, spec_post.attributes.description.codec)}
from ${pgResource_postPgResource.from} ${tableAlias}
where ${sql.join(conditions.map(c => sql.parens(c)), " AND ")}`})`;
        $select.orderBy({
          fragment,
          codec: (_b = (_a = aggregateSpec.pgTypeCodecModifier) === null || _a === void 0 ? void 0 : _a.call(aggregateSpec, spec_post.attributes.description.codec)) !== null && _b !== void 0 ? _b : spec_post.attributes.description.codec,
          direction: "DESC"
        });
      }
    },
    POSTS_DISTINCT_COUNT_PROJECT_ID_ASC: {
      applyPlan($select) {
        var _a, _b;
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(pgResource_postPgResource.name));
        relation6.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation6.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof pgResource_postPgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`
select ${aggregateSpec.sqlAggregateWrap(sql.fragment`${tableAlias}.${sql.identifier("project_id")}`, spec_post.attributes.project_id.codec)}
from ${pgResource_postPgResource.from} ${tableAlias}
where ${sql.join(conditions.map(c => sql.parens(c)), " AND ")}`})`;
        $select.orderBy({
          fragment,
          codec: (_b = (_a = aggregateSpec.pgTypeCodecModifier) === null || _a === void 0 ? void 0 : _a.call(aggregateSpec, spec_post.attributes.project_id.codec)) !== null && _b !== void 0 ? _b : spec_post.attributes.project_id.codec,
          direction: "ASC"
        });
      }
    },
    POSTS_DISTINCT_COUNT_PROJECT_ID_DESC: {
      applyPlan($select) {
        var _a, _b;
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(pgResource_postPgResource.name));
        relation6.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation6.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof pgResource_postPgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`
select ${aggregateSpec.sqlAggregateWrap(sql.fragment`${tableAlias}.${sql.identifier("project_id")}`, spec_post.attributes.project_id.codec)}
from ${pgResource_postPgResource.from} ${tableAlias}
where ${sql.join(conditions.map(c => sql.parens(c)), " AND ")}`})`;
        $select.orderBy({
          fragment,
          codec: (_b = (_a = aggregateSpec.pgTypeCodecModifier) === null || _a === void 0 ? void 0 : _a.call(aggregateSpec, spec_post.attributes.project_id.codec)) !== null && _b !== void 0 ? _b : spec_post.attributes.project_id.codec,
          direction: "DESC"
        });
      }
    },
    POSTS_DISTINCT_COUNT_USER_ID_ASC: {
      applyPlan($select) {
        var _a, _b;
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(pgResource_postPgResource.name));
        relation6.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation6.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof pgResource_postPgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`
select ${aggregateSpec.sqlAggregateWrap(sql.fragment`${tableAlias}.${sql.identifier("user_id")}`, spec_post.attributes.user_id.codec)}
from ${pgResource_postPgResource.from} ${tableAlias}
where ${sql.join(conditions.map(c => sql.parens(c)), " AND ")}`})`;
        $select.orderBy({
          fragment,
          codec: (_b = (_a = aggregateSpec.pgTypeCodecModifier) === null || _a === void 0 ? void 0 : _a.call(aggregateSpec, spec_post.attributes.user_id.codec)) !== null && _b !== void 0 ? _b : spec_post.attributes.user_id.codec,
          direction: "ASC"
        });
      }
    },
    POSTS_DISTINCT_COUNT_USER_ID_DESC: {
      applyPlan($select) {
        var _a, _b;
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(pgResource_postPgResource.name));
        relation6.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation6.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof pgResource_postPgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`
select ${aggregateSpec.sqlAggregateWrap(sql.fragment`${tableAlias}.${sql.identifier("user_id")}`, spec_post.attributes.user_id.codec)}
from ${pgResource_postPgResource.from} ${tableAlias}
where ${sql.join(conditions.map(c => sql.parens(c)), " AND ")}`})`;
        $select.orderBy({
          fragment,
          codec: (_b = (_a = aggregateSpec.pgTypeCodecModifier) === null || _a === void 0 ? void 0 : _a.call(aggregateSpec, spec_post.attributes.user_id.codec)) !== null && _b !== void 0 ? _b : spec_post.attributes.user_id.codec,
          direction: "DESC"
        });
      }
    },
    POSTS_DISTINCT_COUNT_CREATED_AT_ASC: {
      applyPlan($select) {
        var _a, _b;
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(pgResource_postPgResource.name));
        relation6.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation6.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof pgResource_postPgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`
select ${aggregateSpec.sqlAggregateWrap(sql.fragment`${tableAlias}.${sql.identifier("created_at")}`, spec_post.attributes.created_at.codec)}
from ${pgResource_postPgResource.from} ${tableAlias}
where ${sql.join(conditions.map(c => sql.parens(c)), " AND ")}`})`;
        $select.orderBy({
          fragment,
          codec: (_b = (_a = aggregateSpec.pgTypeCodecModifier) === null || _a === void 0 ? void 0 : _a.call(aggregateSpec, spec_post.attributes.created_at.codec)) !== null && _b !== void 0 ? _b : spec_post.attributes.created_at.codec,
          direction: "ASC"
        });
      }
    },
    POSTS_DISTINCT_COUNT_CREATED_AT_DESC: {
      applyPlan($select) {
        var _a, _b;
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(pgResource_postPgResource.name));
        relation6.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation6.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof pgResource_postPgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`
select ${aggregateSpec.sqlAggregateWrap(sql.fragment`${tableAlias}.${sql.identifier("created_at")}`, spec_post.attributes.created_at.codec)}
from ${pgResource_postPgResource.from} ${tableAlias}
where ${sql.join(conditions.map(c => sql.parens(c)), " AND ")}`})`;
        $select.orderBy({
          fragment,
          codec: (_b = (_a = aggregateSpec.pgTypeCodecModifier) === null || _a === void 0 ? void 0 : _a.call(aggregateSpec, spec_post.attributes.created_at.codec)) !== null && _b !== void 0 ? _b : spec_post.attributes.created_at.codec,
          direction: "DESC"
        });
      }
    },
    POSTS_DISTINCT_COUNT_UPDATED_AT_ASC: {
      applyPlan($select) {
        var _a, _b;
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(pgResource_postPgResource.name));
        relation6.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation6.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof pgResource_postPgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`
select ${aggregateSpec.sqlAggregateWrap(sql.fragment`${tableAlias}.${sql.identifier("updated_at")}`, spec_post.attributes.updated_at.codec)}
from ${pgResource_postPgResource.from} ${tableAlias}
where ${sql.join(conditions.map(c => sql.parens(c)), " AND ")}`})`;
        $select.orderBy({
          fragment,
          codec: (_b = (_a = aggregateSpec.pgTypeCodecModifier) === null || _a === void 0 ? void 0 : _a.call(aggregateSpec, spec_post.attributes.updated_at.codec)) !== null && _b !== void 0 ? _b : spec_post.attributes.updated_at.codec,
          direction: "ASC"
        });
      }
    },
    POSTS_DISTINCT_COUNT_UPDATED_AT_DESC: {
      applyPlan($select) {
        var _a, _b;
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(pgResource_postPgResource.name));
        relation6.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation6.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof pgResource_postPgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`
select ${aggregateSpec.sqlAggregateWrap(sql.fragment`${tableAlias}.${sql.identifier("updated_at")}`, spec_post.attributes.updated_at.codec)}
from ${pgResource_postPgResource.from} ${tableAlias}
where ${sql.join(conditions.map(c => sql.parens(c)), " AND ")}`})`;
        $select.orderBy({
          fragment,
          codec: (_b = (_a = aggregateSpec.pgTypeCodecModifier) === null || _a === void 0 ? void 0 : _a.call(aggregateSpec, spec_post.attributes.updated_at.codec)) !== null && _b !== void 0 ? _b : spec_post.attributes.updated_at.codec,
          direction: "DESC"
        });
      }
    },
    UPVOTES_COUNT_ASC: {
      applyPlan($select) {
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(pgResource_upvotePgResource.name));
        relation7.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation7.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof pgResource_upvotePgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`select count(*)
from ${pgResource_upvotePgResource.from} ${tableAlias}
where ${sql.parens(sql.join(conditions.map(c => sql.parens(c)), " AND "))}`})`;
        $select.orderBy({
          fragment,
          codec: TYPES.bigint,
          direction: "ASC"
        });
      }
    },
    UPVOTES_COUNT_DESC: {
      applyPlan($select) {
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(pgResource_upvotePgResource.name));
        relation7.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation7.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof pgResource_upvotePgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`select count(*)
from ${pgResource_upvotePgResource.from} ${tableAlias}
where ${sql.parens(sql.join(conditions.map(c => sql.parens(c)), " AND "))}`})`;
        $select.orderBy({
          fragment,
          codec: TYPES.bigint,
          direction: "DESC"
        });
      }
    },
    UPVOTES_DISTINCT_COUNT_ROW_ID_ASC: {
      applyPlan($select) {
        var _a, _b;
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(pgResource_upvotePgResource.name));
        relation7.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation7.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof pgResource_upvotePgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`
select ${aggregateSpec.sqlAggregateWrap(sql.fragment`${tableAlias}.${sql.identifier("id")}`, spec_upvote.attributes.id.codec)}
from ${pgResource_upvotePgResource.from} ${tableAlias}
where ${sql.join(conditions.map(c => sql.parens(c)), " AND ")}`})`;
        $select.orderBy({
          fragment,
          codec: (_b = (_a = aggregateSpec.pgTypeCodecModifier) === null || _a === void 0 ? void 0 : _a.call(aggregateSpec, spec_upvote.attributes.id.codec)) !== null && _b !== void 0 ? _b : spec_upvote.attributes.id.codec,
          direction: "ASC"
        });
      }
    },
    UPVOTES_DISTINCT_COUNT_ROW_ID_DESC: {
      applyPlan($select) {
        var _a, _b;
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(pgResource_upvotePgResource.name));
        relation7.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation7.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof pgResource_upvotePgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`
select ${aggregateSpec.sqlAggregateWrap(sql.fragment`${tableAlias}.${sql.identifier("id")}`, spec_upvote.attributes.id.codec)}
from ${pgResource_upvotePgResource.from} ${tableAlias}
where ${sql.join(conditions.map(c => sql.parens(c)), " AND ")}`})`;
        $select.orderBy({
          fragment,
          codec: (_b = (_a = aggregateSpec.pgTypeCodecModifier) === null || _a === void 0 ? void 0 : _a.call(aggregateSpec, spec_upvote.attributes.id.codec)) !== null && _b !== void 0 ? _b : spec_upvote.attributes.id.codec,
          direction: "DESC"
        });
      }
    },
    UPVOTES_DISTINCT_COUNT_POST_ID_ASC: {
      applyPlan($select) {
        var _a, _b;
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(pgResource_upvotePgResource.name));
        relation7.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation7.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof pgResource_upvotePgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`
select ${aggregateSpec.sqlAggregateWrap(sql.fragment`${tableAlias}.${sql.identifier("post_id")}`, spec_upvote.attributes.post_id.codec)}
from ${pgResource_upvotePgResource.from} ${tableAlias}
where ${sql.join(conditions.map(c => sql.parens(c)), " AND ")}`})`;
        $select.orderBy({
          fragment,
          codec: (_b = (_a = aggregateSpec.pgTypeCodecModifier) === null || _a === void 0 ? void 0 : _a.call(aggregateSpec, spec_upvote.attributes.post_id.codec)) !== null && _b !== void 0 ? _b : spec_upvote.attributes.post_id.codec,
          direction: "ASC"
        });
      }
    },
    UPVOTES_DISTINCT_COUNT_POST_ID_DESC: {
      applyPlan($select) {
        var _a, _b;
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(pgResource_upvotePgResource.name));
        relation7.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation7.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof pgResource_upvotePgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`
select ${aggregateSpec.sqlAggregateWrap(sql.fragment`${tableAlias}.${sql.identifier("post_id")}`, spec_upvote.attributes.post_id.codec)}
from ${pgResource_upvotePgResource.from} ${tableAlias}
where ${sql.join(conditions.map(c => sql.parens(c)), " AND ")}`})`;
        $select.orderBy({
          fragment,
          codec: (_b = (_a = aggregateSpec.pgTypeCodecModifier) === null || _a === void 0 ? void 0 : _a.call(aggregateSpec, spec_upvote.attributes.post_id.codec)) !== null && _b !== void 0 ? _b : spec_upvote.attributes.post_id.codec,
          direction: "DESC"
        });
      }
    },
    UPVOTES_DISTINCT_COUNT_USER_ID_ASC: {
      applyPlan($select) {
        var _a, _b;
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(pgResource_upvotePgResource.name));
        relation7.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation7.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof pgResource_upvotePgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`
select ${aggregateSpec.sqlAggregateWrap(sql.fragment`${tableAlias}.${sql.identifier("user_id")}`, spec_upvote.attributes.user_id.codec)}
from ${pgResource_upvotePgResource.from} ${tableAlias}
where ${sql.join(conditions.map(c => sql.parens(c)), " AND ")}`})`;
        $select.orderBy({
          fragment,
          codec: (_b = (_a = aggregateSpec.pgTypeCodecModifier) === null || _a === void 0 ? void 0 : _a.call(aggregateSpec, spec_upvote.attributes.user_id.codec)) !== null && _b !== void 0 ? _b : spec_upvote.attributes.user_id.codec,
          direction: "ASC"
        });
      }
    },
    UPVOTES_DISTINCT_COUNT_USER_ID_DESC: {
      applyPlan($select) {
        var _a, _b;
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(pgResource_upvotePgResource.name));
        relation7.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation7.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof pgResource_upvotePgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`
select ${aggregateSpec.sqlAggregateWrap(sql.fragment`${tableAlias}.${sql.identifier("user_id")}`, spec_upvote.attributes.user_id.codec)}
from ${pgResource_upvotePgResource.from} ${tableAlias}
where ${sql.join(conditions.map(c => sql.parens(c)), " AND ")}`})`;
        $select.orderBy({
          fragment,
          codec: (_b = (_a = aggregateSpec.pgTypeCodecModifier) === null || _a === void 0 ? void 0 : _a.call(aggregateSpec, spec_upvote.attributes.user_id.codec)) !== null && _b !== void 0 ? _b : spec_upvote.attributes.user_id.codec,
          direction: "DESC"
        });
      }
    },
    UPVOTES_DISTINCT_COUNT_CREATED_AT_ASC: {
      applyPlan($select) {
        var _a, _b;
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(pgResource_upvotePgResource.name));
        relation7.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation7.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof pgResource_upvotePgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`
select ${aggregateSpec.sqlAggregateWrap(sql.fragment`${tableAlias}.${sql.identifier("created_at")}`, spec_upvote.attributes.created_at.codec)}
from ${pgResource_upvotePgResource.from} ${tableAlias}
where ${sql.join(conditions.map(c => sql.parens(c)), " AND ")}`})`;
        $select.orderBy({
          fragment,
          codec: (_b = (_a = aggregateSpec.pgTypeCodecModifier) === null || _a === void 0 ? void 0 : _a.call(aggregateSpec, spec_upvote.attributes.created_at.codec)) !== null && _b !== void 0 ? _b : spec_upvote.attributes.created_at.codec,
          direction: "ASC"
        });
      }
    },
    UPVOTES_DISTINCT_COUNT_CREATED_AT_DESC: {
      applyPlan($select) {
        var _a, _b;
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(pgResource_upvotePgResource.name));
        relation7.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation7.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof pgResource_upvotePgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`
select ${aggregateSpec.sqlAggregateWrap(sql.fragment`${tableAlias}.${sql.identifier("created_at")}`, spec_upvote.attributes.created_at.codec)}
from ${pgResource_upvotePgResource.from} ${tableAlias}
where ${sql.join(conditions.map(c => sql.parens(c)), " AND ")}`})`;
        $select.orderBy({
          fragment,
          codec: (_b = (_a = aggregateSpec.pgTypeCodecModifier) === null || _a === void 0 ? void 0 : _a.call(aggregateSpec, spec_upvote.attributes.created_at.codec)) !== null && _b !== void 0 ? _b : spec_upvote.attributes.created_at.codec,
          direction: "DESC"
        });
      }
    },
    UPVOTES_DISTINCT_COUNT_UPDATED_AT_ASC: {
      applyPlan($select) {
        var _a, _b;
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(pgResource_upvotePgResource.name));
        relation7.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation7.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof pgResource_upvotePgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`
select ${aggregateSpec.sqlAggregateWrap(sql.fragment`${tableAlias}.${sql.identifier("updated_at")}`, spec_upvote.attributes.updated_at.codec)}
from ${pgResource_upvotePgResource.from} ${tableAlias}
where ${sql.join(conditions.map(c => sql.parens(c)), " AND ")}`})`;
        $select.orderBy({
          fragment,
          codec: (_b = (_a = aggregateSpec.pgTypeCodecModifier) === null || _a === void 0 ? void 0 : _a.call(aggregateSpec, spec_upvote.attributes.updated_at.codec)) !== null && _b !== void 0 ? _b : spec_upvote.attributes.updated_at.codec,
          direction: "ASC"
        });
      }
    },
    UPVOTES_DISTINCT_COUNT_UPDATED_AT_DESC: {
      applyPlan($select) {
        var _a, _b;
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(pgResource_upvotePgResource.name));
        relation7.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation7.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof pgResource_upvotePgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`
select ${aggregateSpec.sqlAggregateWrap(sql.fragment`${tableAlias}.${sql.identifier("updated_at")}`, spec_upvote.attributes.updated_at.codec)}
from ${pgResource_upvotePgResource.from} ${tableAlias}
where ${sql.join(conditions.map(c => sql.parens(c)), " AND ")}`})`;
        $select.orderBy({
          fragment,
          codec: (_b = (_a = aggregateSpec.pgTypeCodecModifier) === null || _a === void 0 ? void 0 : _a.call(aggregateSpec, spec_upvote.attributes.updated_at.codec)) !== null && _b !== void 0 ? _b : spec_upvote.attributes.updated_at.codec,
          direction: "DESC"
        });
      }
    },
    USER_ORGANIZATIONS_COUNT_ASC: {
      applyPlan($select) {
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(resource_user_organizationPgResource.name));
        relation8.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation8.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof resource_user_organizationPgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`select count(*)
from ${resource_user_organizationPgResource.from} ${tableAlias}
where ${sql.parens(sql.join(conditions.map(c => sql.parens(c)), " AND "))}`})`;
        $select.orderBy({
          fragment,
          codec: TYPES.bigint,
          direction: "ASC"
        });
      }
    },
    USER_ORGANIZATIONS_COUNT_DESC: {
      applyPlan($select) {
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(resource_user_organizationPgResource.name));
        relation8.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation8.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof resource_user_organizationPgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`select count(*)
from ${resource_user_organizationPgResource.from} ${tableAlias}
where ${sql.parens(sql.join(conditions.map(c => sql.parens(c)), " AND "))}`})`;
        $select.orderBy({
          fragment,
          codec: TYPES.bigint,
          direction: "DESC"
        });
      }
    },
    USER_ORGANIZATIONS_DISTINCT_COUNT_USER_ID_ASC: {
      applyPlan($select) {
        var _a, _b;
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(resource_user_organizationPgResource.name));
        relation8.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation8.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof resource_user_organizationPgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`
select ${aggregateSpec.sqlAggregateWrap(sql.fragment`${tableAlias}.${sql.identifier("user_id")}`, spec_userOrganization.attributes.user_id.codec)}
from ${resource_user_organizationPgResource.from} ${tableAlias}
where ${sql.join(conditions.map(c => sql.parens(c)), " AND ")}`})`;
        $select.orderBy({
          fragment,
          codec: (_b = (_a = aggregateSpec.pgTypeCodecModifier) === null || _a === void 0 ? void 0 : _a.call(aggregateSpec, spec_userOrganization.attributes.user_id.codec)) !== null && _b !== void 0 ? _b : spec_userOrganization.attributes.user_id.codec,
          direction: "ASC"
        });
      }
    },
    USER_ORGANIZATIONS_DISTINCT_COUNT_USER_ID_DESC: {
      applyPlan($select) {
        var _a, _b;
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(resource_user_organizationPgResource.name));
        relation8.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation8.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof resource_user_organizationPgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`
select ${aggregateSpec.sqlAggregateWrap(sql.fragment`${tableAlias}.${sql.identifier("user_id")}`, spec_userOrganization.attributes.user_id.codec)}
from ${resource_user_organizationPgResource.from} ${tableAlias}
where ${sql.join(conditions.map(c => sql.parens(c)), " AND ")}`})`;
        $select.orderBy({
          fragment,
          codec: (_b = (_a = aggregateSpec.pgTypeCodecModifier) === null || _a === void 0 ? void 0 : _a.call(aggregateSpec, spec_userOrganization.attributes.user_id.codec)) !== null && _b !== void 0 ? _b : spec_userOrganization.attributes.user_id.codec,
          direction: "DESC"
        });
      }
    },
    USER_ORGANIZATIONS_DISTINCT_COUNT_ORGANIZATION_ID_ASC: {
      applyPlan($select) {
        var _a, _b;
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(resource_user_organizationPgResource.name));
        relation8.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation8.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof resource_user_organizationPgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`
select ${aggregateSpec.sqlAggregateWrap(sql.fragment`${tableAlias}.${sql.identifier("organization_id")}`, spec_userOrganization.attributes.organization_id.codec)}
from ${resource_user_organizationPgResource.from} ${tableAlias}
where ${sql.join(conditions.map(c => sql.parens(c)), " AND ")}`})`;
        $select.orderBy({
          fragment,
          codec: (_b = (_a = aggregateSpec.pgTypeCodecModifier) === null || _a === void 0 ? void 0 : _a.call(aggregateSpec, spec_userOrganization.attributes.organization_id.codec)) !== null && _b !== void 0 ? _b : spec_userOrganization.attributes.organization_id.codec,
          direction: "ASC"
        });
      }
    },
    USER_ORGANIZATIONS_DISTINCT_COUNT_ORGANIZATION_ID_DESC: {
      applyPlan($select) {
        var _a, _b;
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(resource_user_organizationPgResource.name));
        relation8.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation8.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof resource_user_organizationPgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`
select ${aggregateSpec.sqlAggregateWrap(sql.fragment`${tableAlias}.${sql.identifier("organization_id")}`, spec_userOrganization.attributes.organization_id.codec)}
from ${resource_user_organizationPgResource.from} ${tableAlias}
where ${sql.join(conditions.map(c => sql.parens(c)), " AND ")}`})`;
        $select.orderBy({
          fragment,
          codec: (_b = (_a = aggregateSpec.pgTypeCodecModifier) === null || _a === void 0 ? void 0 : _a.call(aggregateSpec, spec_userOrganization.attributes.organization_id.codec)) !== null && _b !== void 0 ? _b : spec_userOrganization.attributes.organization_id.codec,
          direction: "DESC"
        });
      }
    },
    USER_ORGANIZATIONS_DISTINCT_COUNT_CREATED_AT_ASC: {
      applyPlan($select) {
        var _a, _b;
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(resource_user_organizationPgResource.name));
        relation8.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation8.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof resource_user_organizationPgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`
select ${aggregateSpec.sqlAggregateWrap(sql.fragment`${tableAlias}.${sql.identifier("created_at")}`, spec_userOrganization.attributes.created_at.codec)}
from ${resource_user_organizationPgResource.from} ${tableAlias}
where ${sql.join(conditions.map(c => sql.parens(c)), " AND ")}`})`;
        $select.orderBy({
          fragment,
          codec: (_b = (_a = aggregateSpec.pgTypeCodecModifier) === null || _a === void 0 ? void 0 : _a.call(aggregateSpec, spec_userOrganization.attributes.created_at.codec)) !== null && _b !== void 0 ? _b : spec_userOrganization.attributes.created_at.codec,
          direction: "ASC"
        });
      }
    },
    USER_ORGANIZATIONS_DISTINCT_COUNT_CREATED_AT_DESC: {
      applyPlan($select) {
        var _a, _b;
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(resource_user_organizationPgResource.name));
        relation8.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation8.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof resource_user_organizationPgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`
select ${aggregateSpec.sqlAggregateWrap(sql.fragment`${tableAlias}.${sql.identifier("created_at")}`, spec_userOrganization.attributes.created_at.codec)}
from ${resource_user_organizationPgResource.from} ${tableAlias}
where ${sql.join(conditions.map(c => sql.parens(c)), " AND ")}`})`;
        $select.orderBy({
          fragment,
          codec: (_b = (_a = aggregateSpec.pgTypeCodecModifier) === null || _a === void 0 ? void 0 : _a.call(aggregateSpec, spec_userOrganization.attributes.created_at.codec)) !== null && _b !== void 0 ? _b : spec_userOrganization.attributes.created_at.codec,
          direction: "DESC"
        });
      }
    },
    COMMENTS_COUNT_ASC: {
      applyPlan($select) {
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(pgResource_commentPgResource.name));
        relation9.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation9.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof pgResource_commentPgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`select count(*)
from ${pgResource_commentPgResource.from} ${tableAlias}
where ${sql.parens(sql.join(conditions.map(c => sql.parens(c)), " AND "))}`})`;
        $select.orderBy({
          fragment,
          codec: TYPES.bigint,
          direction: "ASC"
        });
      }
    },
    COMMENTS_COUNT_DESC: {
      applyPlan($select) {
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(pgResource_commentPgResource.name));
        relation9.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation9.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof pgResource_commentPgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`select count(*)
from ${pgResource_commentPgResource.from} ${tableAlias}
where ${sql.parens(sql.join(conditions.map(c => sql.parens(c)), " AND "))}`})`;
        $select.orderBy({
          fragment,
          codec: TYPES.bigint,
          direction: "DESC"
        });
      }
    },
    COMMENTS_DISTINCT_COUNT_ROW_ID_ASC: {
      applyPlan($select) {
        var _a, _b;
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(pgResource_commentPgResource.name));
        relation9.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation9.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof pgResource_commentPgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`
select ${aggregateSpec.sqlAggregateWrap(sql.fragment`${tableAlias}.${sql.identifier("id")}`, spec_comment.attributes.id.codec)}
from ${pgResource_commentPgResource.from} ${tableAlias}
where ${sql.join(conditions.map(c => sql.parens(c)), " AND ")}`})`;
        $select.orderBy({
          fragment,
          codec: (_b = (_a = aggregateSpec.pgTypeCodecModifier) === null || _a === void 0 ? void 0 : _a.call(aggregateSpec, spec_comment.attributes.id.codec)) !== null && _b !== void 0 ? _b : spec_comment.attributes.id.codec,
          direction: "ASC"
        });
      }
    },
    COMMENTS_DISTINCT_COUNT_ROW_ID_DESC: {
      applyPlan($select) {
        var _a, _b;
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(pgResource_commentPgResource.name));
        relation9.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation9.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof pgResource_commentPgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`
select ${aggregateSpec.sqlAggregateWrap(sql.fragment`${tableAlias}.${sql.identifier("id")}`, spec_comment.attributes.id.codec)}
from ${pgResource_commentPgResource.from} ${tableAlias}
where ${sql.join(conditions.map(c => sql.parens(c)), " AND ")}`})`;
        $select.orderBy({
          fragment,
          codec: (_b = (_a = aggregateSpec.pgTypeCodecModifier) === null || _a === void 0 ? void 0 : _a.call(aggregateSpec, spec_comment.attributes.id.codec)) !== null && _b !== void 0 ? _b : spec_comment.attributes.id.codec,
          direction: "DESC"
        });
      }
    },
    COMMENTS_DISTINCT_COUNT_MESSAGE_ASC: {
      applyPlan($select) {
        var _a, _b;
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(pgResource_commentPgResource.name));
        relation9.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation9.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof pgResource_commentPgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`
select ${aggregateSpec.sqlAggregateWrap(sql.fragment`${tableAlias}.${sql.identifier("message")}`, spec_comment.attributes.message.codec)}
from ${pgResource_commentPgResource.from} ${tableAlias}
where ${sql.join(conditions.map(c => sql.parens(c)), " AND ")}`})`;
        $select.orderBy({
          fragment,
          codec: (_b = (_a = aggregateSpec.pgTypeCodecModifier) === null || _a === void 0 ? void 0 : _a.call(aggregateSpec, spec_comment.attributes.message.codec)) !== null && _b !== void 0 ? _b : spec_comment.attributes.message.codec,
          direction: "ASC"
        });
      }
    },
    COMMENTS_DISTINCT_COUNT_MESSAGE_DESC: {
      applyPlan($select) {
        var _a, _b;
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(pgResource_commentPgResource.name));
        relation9.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation9.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof pgResource_commentPgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`
select ${aggregateSpec.sqlAggregateWrap(sql.fragment`${tableAlias}.${sql.identifier("message")}`, spec_comment.attributes.message.codec)}
from ${pgResource_commentPgResource.from} ${tableAlias}
where ${sql.join(conditions.map(c => sql.parens(c)), " AND ")}`})`;
        $select.orderBy({
          fragment,
          codec: (_b = (_a = aggregateSpec.pgTypeCodecModifier) === null || _a === void 0 ? void 0 : _a.call(aggregateSpec, spec_comment.attributes.message.codec)) !== null && _b !== void 0 ? _b : spec_comment.attributes.message.codec,
          direction: "DESC"
        });
      }
    },
    COMMENTS_DISTINCT_COUNT_POST_ID_ASC: {
      applyPlan($select) {
        var _a, _b;
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(pgResource_commentPgResource.name));
        relation9.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation9.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof pgResource_commentPgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`
select ${aggregateSpec.sqlAggregateWrap(sql.fragment`${tableAlias}.${sql.identifier("post_id")}`, spec_comment.attributes.post_id.codec)}
from ${pgResource_commentPgResource.from} ${tableAlias}
where ${sql.join(conditions.map(c => sql.parens(c)), " AND ")}`})`;
        $select.orderBy({
          fragment,
          codec: (_b = (_a = aggregateSpec.pgTypeCodecModifier) === null || _a === void 0 ? void 0 : _a.call(aggregateSpec, spec_comment.attributes.post_id.codec)) !== null && _b !== void 0 ? _b : spec_comment.attributes.post_id.codec,
          direction: "ASC"
        });
      }
    },
    COMMENTS_DISTINCT_COUNT_POST_ID_DESC: {
      applyPlan($select) {
        var _a, _b;
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(pgResource_commentPgResource.name));
        relation9.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation9.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof pgResource_commentPgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`
select ${aggregateSpec.sqlAggregateWrap(sql.fragment`${tableAlias}.${sql.identifier("post_id")}`, spec_comment.attributes.post_id.codec)}
from ${pgResource_commentPgResource.from} ${tableAlias}
where ${sql.join(conditions.map(c => sql.parens(c)), " AND ")}`})`;
        $select.orderBy({
          fragment,
          codec: (_b = (_a = aggregateSpec.pgTypeCodecModifier) === null || _a === void 0 ? void 0 : _a.call(aggregateSpec, spec_comment.attributes.post_id.codec)) !== null && _b !== void 0 ? _b : spec_comment.attributes.post_id.codec,
          direction: "DESC"
        });
      }
    },
    COMMENTS_DISTINCT_COUNT_USER_ID_ASC: {
      applyPlan($select) {
        var _a, _b;
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(pgResource_commentPgResource.name));
        relation9.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation9.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof pgResource_commentPgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`
select ${aggregateSpec.sqlAggregateWrap(sql.fragment`${tableAlias}.${sql.identifier("user_id")}`, spec_comment.attributes.user_id.codec)}
from ${pgResource_commentPgResource.from} ${tableAlias}
where ${sql.join(conditions.map(c => sql.parens(c)), " AND ")}`})`;
        $select.orderBy({
          fragment,
          codec: (_b = (_a = aggregateSpec.pgTypeCodecModifier) === null || _a === void 0 ? void 0 : _a.call(aggregateSpec, spec_comment.attributes.user_id.codec)) !== null && _b !== void 0 ? _b : spec_comment.attributes.user_id.codec,
          direction: "ASC"
        });
      }
    },
    COMMENTS_DISTINCT_COUNT_USER_ID_DESC: {
      applyPlan($select) {
        var _a, _b;
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(pgResource_commentPgResource.name));
        relation9.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation9.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof pgResource_commentPgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`
select ${aggregateSpec.sqlAggregateWrap(sql.fragment`${tableAlias}.${sql.identifier("user_id")}`, spec_comment.attributes.user_id.codec)}
from ${pgResource_commentPgResource.from} ${tableAlias}
where ${sql.join(conditions.map(c => sql.parens(c)), " AND ")}`})`;
        $select.orderBy({
          fragment,
          codec: (_b = (_a = aggregateSpec.pgTypeCodecModifier) === null || _a === void 0 ? void 0 : _a.call(aggregateSpec, spec_comment.attributes.user_id.codec)) !== null && _b !== void 0 ? _b : spec_comment.attributes.user_id.codec,
          direction: "DESC"
        });
      }
    },
    COMMENTS_DISTINCT_COUNT_CREATED_AT_ASC: {
      applyPlan($select) {
        var _a, _b;
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(pgResource_commentPgResource.name));
        relation9.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation9.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof pgResource_commentPgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`
select ${aggregateSpec.sqlAggregateWrap(sql.fragment`${tableAlias}.${sql.identifier("created_at")}`, spec_comment.attributes.created_at.codec)}
from ${pgResource_commentPgResource.from} ${tableAlias}
where ${sql.join(conditions.map(c => sql.parens(c)), " AND ")}`})`;
        $select.orderBy({
          fragment,
          codec: (_b = (_a = aggregateSpec.pgTypeCodecModifier) === null || _a === void 0 ? void 0 : _a.call(aggregateSpec, spec_comment.attributes.created_at.codec)) !== null && _b !== void 0 ? _b : spec_comment.attributes.created_at.codec,
          direction: "ASC"
        });
      }
    },
    COMMENTS_DISTINCT_COUNT_CREATED_AT_DESC: {
      applyPlan($select) {
        var _a, _b;
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(pgResource_commentPgResource.name));
        relation9.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation9.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof pgResource_commentPgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`
select ${aggregateSpec.sqlAggregateWrap(sql.fragment`${tableAlias}.${sql.identifier("created_at")}`, spec_comment.attributes.created_at.codec)}
from ${pgResource_commentPgResource.from} ${tableAlias}
where ${sql.join(conditions.map(c => sql.parens(c)), " AND ")}`})`;
        $select.orderBy({
          fragment,
          codec: (_b = (_a = aggregateSpec.pgTypeCodecModifier) === null || _a === void 0 ? void 0 : _a.call(aggregateSpec, spec_comment.attributes.created_at.codec)) !== null && _b !== void 0 ? _b : spec_comment.attributes.created_at.codec,
          direction: "DESC"
        });
      }
    },
    COMMENTS_DISTINCT_COUNT_UPDATED_AT_ASC: {
      applyPlan($select) {
        var _a, _b;
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(pgResource_commentPgResource.name));
        relation9.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation9.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof pgResource_commentPgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`
select ${aggregateSpec.sqlAggregateWrap(sql.fragment`${tableAlias}.${sql.identifier("updated_at")}`, spec_comment.attributes.updated_at.codec)}
from ${pgResource_commentPgResource.from} ${tableAlias}
where ${sql.join(conditions.map(c => sql.parens(c)), " AND ")}`})`;
        $select.orderBy({
          fragment,
          codec: (_b = (_a = aggregateSpec.pgTypeCodecModifier) === null || _a === void 0 ? void 0 : _a.call(aggregateSpec, spec_comment.attributes.updated_at.codec)) !== null && _b !== void 0 ? _b : spec_comment.attributes.updated_at.codec,
          direction: "ASC"
        });
      }
    },
    COMMENTS_DISTINCT_COUNT_UPDATED_AT_DESC: {
      applyPlan($select) {
        var _a, _b;
        const foreignTableAlias = $select.alias,
          conditions = [],
          tableAlias = sql.identifier(Symbol(pgResource_commentPgResource.name));
        relation9.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = relation9.remoteAttributes[i];
          conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
        });
        if (typeof pgResource_commentPgResource.from === "function") throw new Error("Function source unsupported");
        const fragment = sql`(${sql.indent`
select ${aggregateSpec.sqlAggregateWrap(sql.fragment`${tableAlias}.${sql.identifier("updated_at")}`, spec_comment.attributes.updated_at.codec)}
from ${pgResource_commentPgResource.from} ${tableAlias}
where ${sql.join(conditions.map(c => sql.parens(c)), " AND ")}`})`;
        $select.orderBy({
          fragment,
          codec: (_b = (_a = aggregateSpec.pgTypeCodecModifier) === null || _a === void 0 ? void 0 : _a.call(aggregateSpec, spec_comment.attributes.updated_at.codec)) !== null && _b !== void 0 ? _b : spec_comment.attributes.updated_at.codec,
          direction: "DESC"
        });
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
    updatedAt: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) $condition.where({
          type: "attribute",
          attribute: "updated_at",
          callback(expression) {
            return sql`${expression} is null`;
          }
        });else $condition.where({
          type: "attribute",
          attribute: "updated_at",
          callback(expression) {
            return sql`${expression} = ${$condition.placeholder(val.get(), spec_user.attributes.updated_at.codec)}`;
          }
        });
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    hidraId: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) $condition.where({
          type: "attribute",
          attribute: "hidra_id",
          callback(expression) {
            return sql`${expression} is null`;
          }
        });else $condition.where({
          type: "attribute",
          attribute: "hidra_id",
          callback(expression) {
            return sql`${expression} = ${$condition.placeholder(val.get(), spec_user.attributes.hidra_id.codec)}`;
          }
        });
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    username: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) $condition.where({
          type: "attribute",
          attribute: "username",
          callback(expression) {
            return sql`${expression} is null`;
          }
        });else $condition.where({
          type: "attribute",
          attribute: "username",
          callback(expression) {
            return sql`${expression} = ${$condition.placeholder(val.get(), spec_user.attributes.username.codec)}`;
          }
        });
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    firstName: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) $condition.where({
          type: "attribute",
          attribute: "first_name",
          callback(expression) {
            return sql`${expression} is null`;
          }
        });else $condition.where({
          type: "attribute",
          attribute: "first_name",
          callback(expression) {
            return sql`${expression} = ${$condition.placeholder(val.get(), spec_user.attributes.first_name.codec)}`;
          }
        });
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    lastName: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) $condition.where({
          type: "attribute",
          attribute: "last_name",
          callback(expression) {
            return sql`${expression} is null`;
          }
        });else $condition.where({
          type: "attribute",
          attribute: "last_name",
          callback(expression) {
            return sql`${expression} = ${$condition.placeholder(val.get(), spec_user.attributes.last_name.codec)}`;
          }
        });
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  Mutation: {
    __assertStep: __ValueStep,
    createUserOrganization: {
      plan(_, args) {
        const plan = object({
          result: pgInsertSingle(resource_user_organizationPgResource, Object.create(null))
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
    createComment: {
      plan(_, args) {
        const plan = object({
          result: pgInsertSingle(pgResource_commentPgResource, Object.create(null))
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
    updateUserOrganizationByUserIdAndOrganizationId: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(resource_user_organizationPgResource, {
            user_id: args.get(['input', "userId"]),
            organization_id: args.get(['input', "organizationId"])
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
    updateUpvoteByPostIdAndUserId: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_upvotePgResource, {
            post_id: args.get(['input', "postId"]),
            user_id: args.get(['input', "userId"])
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
          result: pgUpdateSingle(pgResource_organizationPgResource, specFromArgs2(args))
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
    updateOrganizationByName: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_organizationPgResource, {
            name: args.get(['input', "name"])
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
    updateOrganizationBySlug: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_organizationPgResource, {
            slug: args.get(['input', "slug"])
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
    updateCommentById: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_commentPgResource, specFromArgs3(args))
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
    updateComment: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_commentPgResource, {
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
    updateUserById: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_userPgResource, specFromArgs5(args))
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
    updateUserByHidraId: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_userPgResource, {
            hidra_id: args.get(['input', "hidraId"])
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
    updateUserByUsername: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_userPgResource, {
            username: args.get(['input', "username"])
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
          result: pgUpdateSingle(pgResource_projectPgResource, specFromArgs6(args))
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
    updateProjectByName: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_projectPgResource, {
            name: args.get(['input', "name"])
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
    updateProjectBySlugAndOrganizationId: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_projectPgResource, {
            slug: args.get(['input', "slug"]),
            organization_id: args.get(['input', "organizationId"])
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
    deleteUserOrganizationByUserIdAndOrganizationId: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(resource_user_organizationPgResource, {
            user_id: args.get(['input', "userId"]),
            organization_id: args.get(['input', "organizationId"])
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
          result: pgDeleteSingle(pgResource_upvotePgResource, specFromArgs7(args))
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
    deleteUpvoteByPostIdAndUserId: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_upvotePgResource, {
            post_id: args.get(['input', "postId"]),
            user_id: args.get(['input', "userId"])
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
    deleteOrganizationByName: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_organizationPgResource, {
            name: args.get(['input', "name"])
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
    deleteOrganizationBySlug: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_organizationPgResource, {
            slug: args.get(['input', "slug"])
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
    deleteCommentById: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_commentPgResource, specFromArgs9(args))
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
    deleteComment: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_commentPgResource, {
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
          result: pgDeleteSingle(pgResource_postPgResource, specFromArgs10(args))
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
    deleteUserById: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_userPgResource, specFromArgs11(args))
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
    deleteUserByHidraId: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_userPgResource, {
            hidra_id: args.get(['input', "hidraId"])
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
    deleteUserByUsername: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_userPgResource, {
            username: args.get(['input', "username"])
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
          result: pgDeleteSingle(pgResource_projectPgResource, specFromArgs12(args))
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
    },
    deleteProjectByName: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_projectPgResource, {
            name: args.get(['input', "name"])
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
    deleteProjectBySlugAndOrganizationId: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_projectPgResource, {
            slug: args.get(['input', "slug"]),
            organization_id: args.get(['input', "organizationId"])
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
  CreateUserOrganizationPayload: {
    __assertStep: assertExecutableStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", !0) ?? constant(null);
    },
    userOrganization($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    }
  },
  CreateUserOrganizationInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      },
      autoApplyAfterParentApplyPlan: true
    },
    userOrganization: {
      applyPlan($object) {
        return $object.getStepForKey("result").setPlan();
      },
      autoApplyAfterParentApplyPlan: true
    }
  },
  UserOrganizationInput: {
    "__inputPlan": function UserOrganizationInput_inputPlan() {
      return object(Object.create(null));
    },
    userId: {
      applyPlan($insert, val) {
        $insert.set("user_id", val.get());
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
    },
    createdAt: {
      applyPlan($insert, val) {
        $insert.set("created_at", val.get());
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
    postId: {
      applyPlan($insert, val) {
        $insert.set("post_id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    userId: {
      applyPlan($insert, val) {
        $insert.set("user_id", val.get());
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
    updatedAt: {
      applyPlan($insert, val) {
        $insert.set("updated_at", val.get());
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
        $insert.set("created_at", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    updatedAt: {
      applyPlan($insert, val) {
        $insert.set("updated_at", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  CreateCommentPayload: {
    __assertStep: assertExecutableStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", !0) ?? constant(null);
    },
    comment($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    commentEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", !0);
        if (!$result) return constant(null);
        const $select = (() => {
            if ($result instanceof PgDeleteSingleStep) return pgSelectFromRecord($result.resource, $result.record());else {
              const spec = commentUniques[0].attributes.reduce((memo, attributeName) => {
                memo[attributeName] = $result.get(attributeName);
                return memo;
              }, Object.create(null));
              return pgResource_commentPgResource.find(spec);
            }
          })(),
          $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("CommentOrderBy"));
        const $connection = connection($select),
          $single = $select.row(first($select));
        return new EdgeStep($connection, $single);
      },
      args: {
        orderBy: undefined
      }
    }
  },
  CreateCommentInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      },
      autoApplyAfterParentApplyPlan: true
    },
    comment: {
      applyPlan($object) {
        return $object.getStepForKey("result").setPlan();
      },
      autoApplyAfterParentApplyPlan: true
    }
  },
  CommentInput: {
    "__inputPlan": function CommentInput_inputPlan() {
      return object(Object.create(null));
    },
    rowId: {
      applyPlan($insert, val) {
        $insert.set("id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    message: {
      applyPlan($insert, val) {
        $insert.set("message", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    postId: {
      applyPlan($insert, val) {
        $insert.set("post_id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    userId: {
      applyPlan($insert, val) {
        $insert.set("user_id", val.get());
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
    updatedAt: {
      applyPlan($insert, val) {
        $insert.set("updated_at", val.get());
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
        $insert.set("project_id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    userId: {
      applyPlan($insert, val) {
        $insert.set("user_id", val.get());
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
    updatedAt: {
      applyPlan($insert, val) {
        $insert.set("updated_at", val.get());
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
    updatedAt: {
      applyPlan($insert, val) {
        $insert.set("updated_at", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    hidraId: {
      applyPlan($insert, val) {
        $insert.set("hidra_id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    username: {
      applyPlan($insert, val) {
        $insert.set("username", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    firstName: {
      applyPlan($insert, val) {
        $insert.set("first_name", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    lastName: {
      applyPlan($insert, val) {
        $insert.set("last_name", val.get());
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
    name: {
      applyPlan($insert, val) {
        $insert.set("name", val.get());
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
    slug: {
      applyPlan($insert, val) {
        $insert.set("slug", val.get());
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
        $insert.set("organization_id", val.get());
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
    updatedAt: {
      applyPlan($insert, val) {
        $insert.set("updated_at", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  UpdateUserOrganizationPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", !0) ?? constant(null);
    },
    userOrganization($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    }
  },
  UpdateUserOrganizationByUserIdAndOrganizationIdInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    userId: undefined,
    organizationId: undefined,
    patch: {
      applyPlan($object) {
        return $object.getStepForKey("result").setPlan();
      }
    }
  },
  UserOrganizationPatch: {
    "__inputPlan": function UserOrganizationPatch_inputPlan() {
      return object(Object.create(null));
    },
    userId: {
      applyPlan($insert, val) {
        $insert.set("user_id", val.get());
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
    },
    createdAt: {
      applyPlan($insert, val) {
        $insert.set("created_at", val.get());
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
    postId: {
      applyPlan($insert, val) {
        $insert.set("post_id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    userId: {
      applyPlan($insert, val) {
        $insert.set("user_id", val.get());
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
    updatedAt: {
      applyPlan($insert, val) {
        $insert.set("updated_at", val.get());
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
  UpdateUpvoteByPostIdAndUserIdInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    postId: undefined,
    userId: undefined,
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
        $insert.set("created_at", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    updatedAt: {
      applyPlan($insert, val) {
        $insert.set("updated_at", val.get());
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
  UpdateOrganizationByNameInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    name: undefined,
    patch: {
      applyPlan($object) {
        return $object.getStepForKey("result").setPlan();
      }
    }
  },
  UpdateOrganizationBySlugInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    slug: undefined,
    patch: {
      applyPlan($object) {
        return $object.getStepForKey("result").setPlan();
      }
    }
  },
  UpdateCommentPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", !0) ?? constant(null);
    },
    comment($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    commentEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", !0);
        if (!$result) return constant(null);
        const $select = (() => {
            if ($result instanceof PgDeleteSingleStep) return pgSelectFromRecord($result.resource, $result.record());else {
              const spec = commentUniques[0].attributes.reduce((memo, attributeName) => {
                memo[attributeName] = $result.get(attributeName);
                return memo;
              }, Object.create(null));
              return pgResource_commentPgResource.find(spec);
            }
          })(),
          $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("CommentOrderBy"));
        const $connection = connection($select),
          $single = $select.row(first($select));
        return new EdgeStep($connection, $single);
      },
      args: {
        orderBy: undefined
      }
    }
  },
  UpdateCommentByIdInput: {
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
  CommentPatch: {
    "__inputPlan": function CommentPatch_inputPlan() {
      return object(Object.create(null));
    },
    rowId: {
      applyPlan($insert, val) {
        $insert.set("id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    message: {
      applyPlan($insert, val) {
        $insert.set("message", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    postId: {
      applyPlan($insert, val) {
        $insert.set("post_id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    userId: {
      applyPlan($insert, val) {
        $insert.set("user_id", val.get());
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
    updatedAt: {
      applyPlan($insert, val) {
        $insert.set("updated_at", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  UpdateCommentInput: {
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
        $insert.set("project_id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    userId: {
      applyPlan($insert, val) {
        $insert.set("user_id", val.get());
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
    updatedAt: {
      applyPlan($insert, val) {
        $insert.set("updated_at", val.get());
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
    updatedAt: {
      applyPlan($insert, val) {
        $insert.set("updated_at", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    hidraId: {
      applyPlan($insert, val) {
        $insert.set("hidra_id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    username: {
      applyPlan($insert, val) {
        $insert.set("username", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    firstName: {
      applyPlan($insert, val) {
        $insert.set("first_name", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    lastName: {
      applyPlan($insert, val) {
        $insert.set("last_name", val.get());
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
  UpdateUserByHidraIdInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    hidraId: undefined,
    patch: {
      applyPlan($object) {
        return $object.getStepForKey("result").setPlan();
      }
    }
  },
  UpdateUserByUsernameInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    username: undefined,
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
    name: {
      applyPlan($insert, val) {
        $insert.set("name", val.get());
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
    slug: {
      applyPlan($insert, val) {
        $insert.set("slug", val.get());
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
        $insert.set("organization_id", val.get());
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
    updatedAt: {
      applyPlan($insert, val) {
        $insert.set("updated_at", val.get());
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
  UpdateProjectByNameInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    name: undefined,
    patch: {
      applyPlan($object) {
        return $object.getStepForKey("result").setPlan();
      }
    }
  },
  UpdateProjectBySlugAndOrganizationIdInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    slug: undefined,
    organizationId: undefined,
    patch: {
      applyPlan($object) {
        return $object.getStepForKey("result").setPlan();
      }
    }
  },
  DeleteUserOrganizationPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", !0) ?? constant(null);
    },
    userOrganization($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    }
  },
  DeleteUserOrganizationByUserIdAndOrganizationIdInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    userId: undefined,
    organizationId: undefined
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
  DeleteUpvoteByPostIdAndUserIdInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    postId: undefined,
    userId: undefined
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
  DeleteOrganizationByNameInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    name: undefined
  },
  DeleteOrganizationBySlugInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    slug: undefined
  },
  DeleteCommentPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", !0) ?? constant(null);
    },
    comment($object) {
      return $object.get("result");
    },
    deletedCommentId($object) {
      const $record = $object.getStepForKey("result"),
        specifier = nodeIdHandlerByTypeName.Comment.plan($record);
      return lambda(specifier, nodeIdCodecs_base64JSON_base64JSON.encode);
    },
    query() {
      return rootValue();
    },
    commentEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", !0);
        if (!$result) return constant(null);
        const $select = (() => {
            if ($result instanceof PgDeleteSingleStep) return pgSelectFromRecord($result.resource, $result.record());else {
              const spec = commentUniques[0].attributes.reduce((memo, attributeName) => {
                memo[attributeName] = $result.get(attributeName);
                return memo;
              }, Object.create(null));
              return pgResource_commentPgResource.find(spec);
            }
          })(),
          $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("CommentOrderBy"));
        const $connection = connection($select),
          $single = $select.row(first($select));
        return new EdgeStep($connection, $single);
      },
      args: {
        orderBy: undefined
      }
    }
  },
  DeleteCommentByIdInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    id: undefined
  },
  DeleteCommentInput: {
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
  DeleteUserByHidraIdInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    hidraId: undefined
  },
  DeleteUserByUsernameInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    username: undefined
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
  },
  DeleteProjectByNameInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    name: undefined
  },
  DeleteProjectBySlugAndOrganizationIdInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    slug: undefined,
    organizationId: undefined
  }
};
export const schema = makeGrafastSchema({
  typeDefs: typeDefs,
  plans: plans
});