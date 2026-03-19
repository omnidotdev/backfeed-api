// @ts-nocheck
import { PgBooleanFilter, PgCondition, PgDeleteSingleStep, PgExecutor, PgOrFilter, TYPES, assertPgClassSingleStep, enumCodec, listOfCodec, makeRegistry, pgDeleteSingle, pgInsertSingle, pgSelectFromRecord, pgUpdateSingle, pgWhereConditionSpecListToSQL, recordCodec, sqlValueWithCodec } from "@dataplan/pg";
import { ConnectionStep, EdgeStep, ExecutableStep, Modifier, ObjectStep, __ValueStep, access, assertStep, bakedInputRuntime, connection, constant, context, createObjectAndApplyChildren, first, get as get2, inspect, isStep, lambda, makeDecodeNodeId, makeGrafastSchema, markSyncAndSafe, object, rootValue, sideEffect } from "grafast";
import { GraphQLError, Kind } from "graphql";
import { checkPermission, deleteTuples, isAuthzEnabled, writeTuples } from "lib/authz";
import { statusTemplates } from "lib/db/schema";
import { isWithinLimit } from "lib/entitlements";
import { FEATURE_KEYS, billingBypassOrgIds } from "lib/graphql/plugins/authorization/constants";
import { events } from "lib/providers";
import { deletePostFromIndex, deleteProjectFromIndex, indexPost, indexProject } from "lib/search";
import { sql } from "pg-sql2";
const rawNodeIdCodec = {
  name: "raw",
  encode: markSyncAndSafe(function rawEncode(value) {
    return typeof value === "string" ? value : null;
  }),
  decode: markSyncAndSafe(function rawDecode(value) {
    return typeof value === "string" ? value : null;
  })
};
const nodeIdHandler_Query = {
  typeName: "Query",
  codec: rawNodeIdCodec,
  match(specifier) {
    return specifier === "query";
  },
  getIdentifiers(_value) {
    return [];
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
const nodeIdCodecs = {
  __proto__: null,
  raw: rawNodeIdCodec,
  base64JSON: {
    name: "base64JSON",
    encode: markSyncAndSafe(function base64JSONEncode(value) {
      return Buffer.from(JSON.stringify(value), "utf8").toString("base64");
    }),
    decode: markSyncAndSafe(function base64JSONDecode(value) {
      return JSON.parse(Buffer.from(value, "base64").toString("utf8"));
    })
  },
  pipeString: {
    name: "pipeString",
    encode: markSyncAndSafe(function pipeStringEncode(value) {
      return Array.isArray(value) ? value.join("|") : null;
    }),
    decode: markSyncAndSafe(function pipeStringDecode(value) {
      return typeof value === "string" ? value.split("|") : null;
    })
  }
};
const executor = new PgExecutor({
  name: "main",
  context() {
    const ctx = context();
    return object({
      pgSettings: ctx.get("pgSettings"),
      withPgClient: ctx.get("withPgClient")
    });
  }
});
const commentIdentifier = sql.identifier("public", "comment");
const spec_comment = {
  name: "comment",
  identifier: commentIdentifier,
  attributes: {
    __proto__: null,
    id: {
      codec: TYPES.uuid,
      notNull: true,
      hasDefault: true,
      extensions: {
        __proto__: null,
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    message: {
      codec: TYPES.text,
      extensions: {
        __proto__: null,
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    post_id: {
      codec: TYPES.uuid,
      notNull: true,
      extensions: {
        __proto__: null,
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    user_id: {
      codec: TYPES.uuid,
      notNull: true,
      extensions: {
        __proto__: null,
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    parent_id: {
      codec: TYPES.uuid,
      extensions: {
        __proto__: null,
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    created_at: {
      codec: TYPES.timestamptz,
      notNull: true,
      hasDefault: true,
      extensions: {
        __proto__: null,
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    updated_at: {
      codec: TYPES.timestamptz,
      notNull: true,
      hasDefault: true,
      extensions: {
        __proto__: null,
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    }
  },
  extensions: {
    oid: "66551",
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "public",
      name: "comment"
    }
  },
  executor: executor
};
const commentCodec = recordCodec(spec_comment);
const projectLinkIdentifier = sql.identifier("public", "project_link");
const spec_projectLink = {
  name: "projectLink",
  identifier: projectLinkIdentifier,
  attributes: {
    __proto__: null,
    id: {
      codec: TYPES.uuid,
      notNull: true,
      hasDefault: true,
      extensions: {
        __proto__: null,
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    project_id: {
      codec: TYPES.uuid,
      notNull: true,
      extensions: {
        __proto__: null,
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    url: {
      codec: TYPES.text,
      notNull: true,
      extensions: {
        __proto__: null,
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    title: {
      codec: TYPES.text,
      extensions: {
        __proto__: null,
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    order: {
      codec: TYPES.int,
      notNull: true,
      hasDefault: true,
      extensions: {
        __proto__: null,
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    created_at: {
      codec: TYPES.timestamptz,
      notNull: true,
      hasDefault: true,
      extensions: {
        __proto__: null,
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    updated_at: {
      codec: TYPES.timestamptz,
      notNull: true,
      hasDefault: true,
      extensions: {
        __proto__: null,
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    }
  },
  extensions: {
    oid: "66864",
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "public",
      name: "project_link"
    }
  },
  executor: executor
};
const projectLinkCodec = recordCodec(spec_projectLink);
const statusTemplateIdentifier = sql.identifier("public", "status_template");
const spec_statusTemplate = {
  name: "statusTemplate",
  identifier: statusTemplateIdentifier,
  attributes: {
    __proto__: null,
    id: {
      codec: TYPES.uuid,
      notNull: true,
      hasDefault: true,
      extensions: {
        __proto__: null,
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    organization_id: {
      codec: TYPES.uuid,
      notNull: true,
      extensions: {
        __proto__: null,
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    name: {
      codec: TYPES.text,
      notNull: true,
      extensions: {
        __proto__: null,
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    display_name: {
      codec: TYPES.text,
      notNull: true,
      extensions: {
        __proto__: null,
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    color: {
      codec: TYPES.text,
      extensions: {
        __proto__: null,
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    description: {
      codec: TYPES.text,
      extensions: {
        __proto__: null,
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    sort_order: {
      codec: TYPES.int,
      hasDefault: true,
      extensions: {
        __proto__: null,
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    created_at: {
      codec: TYPES.timestamptz,
      notNull: true,
      hasDefault: true,
      extensions: {
        __proto__: null,
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    updated_at: {
      codec: TYPES.timestamptz,
      notNull: true,
      hasDefault: true,
      extensions: {
        __proto__: null,
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    }
  },
  extensions: {
    oid: "66664",
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "public",
      name: "status_template"
    }
  },
  executor: executor
};
const statusTemplateCodec = recordCodec(spec_statusTemplate);
const voteIdentifier = sql.identifier("public", "vote");
const voteTypeCodec = enumCodec({
  name: "voteType",
  identifier: sql.identifier("public", "vote_type"),
  values: ["up", "down"],
  description: undefined,
  extensions: {
    oid: "66534",
    pg: {
      serviceName: "main",
      schemaName: "public",
      name: "vote_type"
    }
  }
});
const spec_vote = {
  name: "vote",
  identifier: voteIdentifier,
  attributes: {
    __proto__: null,
    id: {
      codec: TYPES.uuid,
      notNull: true,
      hasDefault: true,
      extensions: {
        __proto__: null,
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    post_id: {
      codec: TYPES.uuid,
      notNull: true,
      extensions: {
        __proto__: null,
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    user_id: {
      codec: TYPES.uuid,
      notNull: true,
      extensions: {
        __proto__: null,
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    vote_type: {
      codec: voteTypeCodec,
      notNull: true,
      extensions: {
        __proto__: null,
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    created_at: {
      codec: TYPES.timestamptz,
      notNull: true,
      hasDefault: true,
      extensions: {
        __proto__: null,
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    updated_at: {
      codec: TYPES.timestamptz,
      notNull: true,
      hasDefault: true,
      extensions: {
        __proto__: null,
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    }
  },
  extensions: {
    oid: "66704",
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "public",
      name: "vote"
    }
  },
  executor: executor
};
const voteCodec = recordCodec(spec_vote);
const userIdentifier = sql.identifier("public", "user");
const spec_user = {
  name: "user",
  identifier: userIdentifier,
  attributes: {
    __proto__: null,
    id: {
      codec: TYPES.uuid,
      notNull: true,
      hasDefault: true,
      extensions: {
        __proto__: null,
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    identity_provider_id: {
      codec: TYPES.uuid,
      notNull: true,
      extensions: {
        __proto__: null,
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    username: {
      codec: TYPES.text,
      extensions: {
        __proto__: null,
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    email: {
      codec: TYPES.text,
      notNull: true,
      extensions: {
        __proto__: null,
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    created_at: {
      codec: TYPES.timestamptz,
      notNull: true,
      hasDefault: true,
      extensions: {
        __proto__: null,
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    updated_at: {
      codec: TYPES.timestamptz,
      notNull: true,
      hasDefault: true,
      extensions: {
        __proto__: null,
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    name: {
      codec: TYPES.text,
      notNull: true,
      extensions: {
        __proto__: null,
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    avatar_url: {
      codec: TYPES.text,
      extensions: {
        __proto__: null,
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    }
  },
  extensions: {
    oid: "66683",
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "public",
      name: "user"
    }
  },
  executor: executor
};
const userCodec = recordCodec(spec_user);
const projectStatusConfigIdentifier = sql.identifier("public", "project_status_config");
const spec_projectStatusConfig = {
  name: "projectStatusConfig",
  identifier: projectStatusConfigIdentifier,
  attributes: {
    __proto__: null,
    id: {
      codec: TYPES.uuid,
      notNull: true,
      hasDefault: true,
      extensions: {
        __proto__: null,
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    project_id: {
      codec: TYPES.uuid,
      notNull: true,
      extensions: {
        __proto__: null,
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    status_template_id: {
      codec: TYPES.uuid,
      notNull: true,
      extensions: {
        __proto__: null,
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    custom_color: {
      codec: TYPES.text,
      extensions: {
        __proto__: null,
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    custom_description: {
      codec: TYPES.text,
      extensions: {
        __proto__: null,
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    is_enabled: {
      codec: TYPES.boolean,
      hasDefault: true,
      extensions: {
        __proto__: null,
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    is_default: {
      codec: TYPES.boolean,
      hasDefault: true,
      extensions: {
        __proto__: null,
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    sort_order: {
      codec: TYPES.int,
      extensions: {
        __proto__: null,
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    created_at: {
      codec: TYPES.timestamptz,
      notNull: true,
      hasDefault: true,
      extensions: {
        __proto__: null,
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    }
  },
  extensions: {
    oid: "66647",
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "public",
      name: "project_status_config"
    }
  },
  executor: executor
};
const projectStatusConfigCodec = recordCodec(spec_projectStatusConfig);
const postIdentifier = sql.identifier("public", "post");
const spec_post = {
  name: "post",
  identifier: postIdentifier,
  attributes: {
    __proto__: null,
    id: {
      codec: TYPES.uuid,
      notNull: true,
      hasDefault: true,
      extensions: {
        __proto__: null,
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    title: {
      codec: TYPES.text,
      extensions: {
        __proto__: null,
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    description: {
      codec: TYPES.text,
      extensions: {
        __proto__: null,
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    project_id: {
      codec: TYPES.uuid,
      notNull: true,
      extensions: {
        __proto__: null,
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    user_id: {
      codec: TYPES.uuid,
      notNull: true,
      extensions: {
        __proto__: null,
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    status_template_id: {
      codec: TYPES.uuid,
      extensions: {
        __proto__: null,
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    status_updated_at: {
      codec: TYPES.timestamptz,
      notNull: true,
      hasDefault: true,
      extensions: {
        __proto__: null,
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    created_at: {
      codec: TYPES.timestamptz,
      notNull: true,
      hasDefault: true,
      extensions: {
        __proto__: null,
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    updated_at: {
      codec: TYPES.timestamptz,
      notNull: true,
      hasDefault: true,
      extensions: {
        __proto__: null,
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    number: {
      codec: TYPES.int,
      extensions: {
        __proto__: null,
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    }
  },
  extensions: {
    oid: "66597",
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "public",
      name: "post"
    }
  },
  executor: executor
};
const postCodec = recordCodec(spec_post);
const projectIdentifier = sql.identifier("public", "project");
const spec_project = {
  name: "project",
  identifier: projectIdentifier,
  attributes: {
    __proto__: null,
    id: {
      codec: TYPES.uuid,
      notNull: true,
      hasDefault: true,
      extensions: {
        __proto__: null,
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    name: {
      codec: TYPES.text,
      notNull: true,
      extensions: {
        __proto__: null,
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    image: {
      codec: TYPES.text,
      extensions: {
        __proto__: null,
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    slug: {
      codec: TYPES.text,
      notNull: true,
      extensions: {
        __proto__: null,
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    description: {
      codec: TYPES.text,
      extensions: {
        __proto__: null,
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    organization_id: {
      codec: TYPES.uuid,
      notNull: true,
      extensions: {
        __proto__: null,
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    created_at: {
      codec: TYPES.timestamptz,
      notNull: true,
      hasDefault: true,
      extensions: {
        __proto__: null,
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    updated_at: {
      codec: TYPES.timestamptz,
      notNull: true,
      hasDefault: true,
      extensions: {
        __proto__: null,
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    next_post_number: {
      codec: TYPES.int,
      notNull: true,
      hasDefault: true,
      extensions: {
        __proto__: null,
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    prefix: {
      codec: TYPES.varchar,
      extensions: {
        __proto__: null,
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    is_public: {
      codec: TYPES.boolean,
      notNull: true,
      hasDefault: true,
      extensions: {
        __proto__: null,
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    }
  },
  extensions: {
    oid: "66614",
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "public",
      name: "project"
    }
  },
  executor: executor
};
const projectCodec = recordCodec(spec_project);
const commentUniques = [{
  attributes: ["id"],
  isPrimary: true
}];
const comment_resourceOptionsConfig = {
  executor: executor,
  name: "comment",
  identifier: "main.public.comment",
  from: commentIdentifier,
  codec: commentCodec,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "public",
      name: "comment"
    },
    canSelect: true,
    canInsert: true,
    canUpdate: true,
    canDelete: true
  },
  uniques: commentUniques
};
const project_linkUniques = [{
  attributes: ["id"],
  isPrimary: true
}];
const project_link_resourceOptionsConfig = {
  executor: executor,
  name: "project_link",
  identifier: "main.public.project_link",
  from: projectLinkIdentifier,
  codec: projectLinkCodec,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "public",
      name: "project_link"
    },
    canSelect: true,
    canInsert: true,
    canUpdate: true,
    canDelete: true
  },
  uniques: project_linkUniques
};
const status_templateUniques = [{
  attributes: ["id"],
  isPrimary: true
}, {
  attributes: ["organization_id", "name"],
  extensions: {
    tags: {
      __proto__: null,
      behavior: ["-update", "-delete"]
    }
  }
}];
const status_template_resourceOptionsConfig = {
  executor: executor,
  name: "status_template",
  identifier: "main.public.status_template",
  from: statusTemplateIdentifier,
  codec: statusTemplateCodec,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "public",
      name: "status_template"
    },
    canSelect: true,
    canInsert: true,
    canUpdate: true,
    canDelete: true
  },
  uniques: status_templateUniques
};
const voteUniques = [{
  attributes: ["id"],
  isPrimary: true
}, {
  attributes: ["post_id", "user_id"],
  extensions: {
    tags: {
      __proto__: null,
      behavior: ["-update", "-delete"]
    }
  }
}];
const vote_resourceOptionsConfig = {
  executor: executor,
  name: "vote",
  identifier: "main.public.vote",
  from: voteIdentifier,
  codec: voteCodec,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "public",
      name: "vote"
    },
    canSelect: true,
    canInsert: true,
    canUpdate: true,
    canDelete: true
  },
  uniques: voteUniques
};
const userUniques = [{
  attributes: ["id"],
  isPrimary: true
}, {
  attributes: ["email"],
  extensions: {
    tags: {
      __proto__: null,
      behavior: ["-update", "-delete"]
    }
  }
}, {
  attributes: ["identity_provider_id"],
  extensions: {
    tags: {
      __proto__: null,
      behavior: ["-update", "-delete"]
    }
  }
}, {
  attributes: ["username"],
  extensions: {
    tags: {
      __proto__: null,
      behavior: ["-update", "-delete"]
    }
  }
}];
const user_resourceOptionsConfig = {
  executor: executor,
  name: "user",
  identifier: "main.public.user",
  from: userIdentifier,
  codec: userCodec,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "public",
      name: "user"
    },
    canSelect: true,
    canInsert: true,
    canUpdate: true,
    canDelete: true
  },
  uniques: userUniques
};
const project_status_configUniques = [{
  attributes: ["id"],
  isPrimary: true
}, {
  attributes: ["project_id", "status_template_id"],
  extensions: {
    tags: {
      __proto__: null,
      behavior: ["-update", "-delete"]
    }
  }
}];
const project_status_config_resourceOptionsConfig = {
  executor: executor,
  name: "project_status_config",
  identifier: "main.public.project_status_config",
  from: projectStatusConfigIdentifier,
  codec: projectStatusConfigCodec,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "public",
      name: "project_status_config"
    },
    canSelect: true,
    canInsert: true,
    canUpdate: true,
    canDelete: true
  },
  uniques: project_status_configUniques
};
const postUniques = [{
  attributes: ["id"],
  isPrimary: true
}, {
  attributes: ["project_id", "number"],
  extensions: {
    tags: {
      __proto__: null,
      behavior: ["-update", "-delete"]
    }
  }
}];
const post_resourceOptionsConfig = {
  executor: executor,
  name: "post",
  identifier: "main.public.post",
  from: postIdentifier,
  codec: postCodec,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "public",
      name: "post"
    },
    canSelect: true,
    canInsert: true,
    canUpdate: true,
    canDelete: true
  },
  uniques: postUniques
};
const projectUniques = [{
  attributes: ["id"],
  isPrimary: true
}, {
  attributes: ["slug", "organization_id"],
  extensions: {
    tags: {
      __proto__: null,
      behavior: ["-update", "-delete"]
    }
  }
}];
const project_resourceOptionsConfig = {
  executor: executor,
  name: "project",
  identifier: "main.public.project",
  from: projectIdentifier,
  codec: projectCodec,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "public",
      name: "project"
    },
    canSelect: true,
    canInsert: true,
    canUpdate: true,
    canDelete: true
  },
  uniques: projectUniques
};
const registryConfig = {
  pgExecutors: {
    __proto__: null,
    main: executor
  },
  pgCodecs: {
    __proto__: null,
    comment: commentCodec,
    uuid: TYPES.uuid,
    text: TYPES.text,
    timestamptz: TYPES.timestamptz,
    projectLink: projectLinkCodec,
    int4: TYPES.int,
    statusTemplate: statusTemplateCodec,
    vote: voteCodec,
    voteType: voteTypeCodec,
    user: userCodec,
    projectStatusConfig: projectStatusConfigCodec,
    bool: TYPES.boolean,
    post: postCodec,
    project: projectCodec,
    varchar: TYPES.varchar
  },
  pgResources: {
    __proto__: null,
    comment: comment_resourceOptionsConfig,
    project_link: project_link_resourceOptionsConfig,
    status_template: status_template_resourceOptionsConfig,
    vote: vote_resourceOptionsConfig,
    user: user_resourceOptionsConfig,
    project_status_config: project_status_config_resourceOptionsConfig,
    post: post_resourceOptionsConfig,
    project: project_resourceOptionsConfig
  },
  pgRelations: {
    __proto__: null,
    comment: {
      __proto__: null,
      commentByMyParentId: {
        localCodec: commentCodec,
        remoteResourceOptions: comment_resourceOptionsConfig,
        localAttributes: ["parent_id"],
        remoteAttributes: ["id"],
        isUnique: true
      },
      postByMyPostId: {
        localCodec: commentCodec,
        remoteResourceOptions: post_resourceOptionsConfig,
        localAttributes: ["post_id"],
        remoteAttributes: ["id"],
        isUnique: true
      },
      userByMyUserId: {
        localCodec: commentCodec,
        remoteResourceOptions: user_resourceOptionsConfig,
        localAttributes: ["user_id"],
        remoteAttributes: ["id"],
        isUnique: true
      },
      commentsByTheirParentId: {
        localCodec: commentCodec,
        remoteResourceOptions: comment_resourceOptionsConfig,
        localAttributes: ["id"],
        remoteAttributes: ["parent_id"],
        isReferencee: true
      }
    },
    post: {
      __proto__: null,
      projectByMyProjectId: {
        localCodec: postCodec,
        remoteResourceOptions: project_resourceOptionsConfig,
        localAttributes: ["project_id"],
        remoteAttributes: ["id"],
        isUnique: true
      },
      statusTemplateByMyStatusTemplateId: {
        localCodec: postCodec,
        remoteResourceOptions: status_template_resourceOptionsConfig,
        localAttributes: ["status_template_id"],
        remoteAttributes: ["id"],
        isUnique: true
      },
      userByMyUserId: {
        localCodec: postCodec,
        remoteResourceOptions: user_resourceOptionsConfig,
        localAttributes: ["user_id"],
        remoteAttributes: ["id"],
        isUnique: true
      },
      commentsByTheirPostId: {
        localCodec: postCodec,
        remoteResourceOptions: comment_resourceOptionsConfig,
        localAttributes: ["id"],
        remoteAttributes: ["post_id"],
        isReferencee: true
      },
      votesByTheirPostId: {
        localCodec: postCodec,
        remoteResourceOptions: vote_resourceOptionsConfig,
        localAttributes: ["id"],
        remoteAttributes: ["post_id"],
        isReferencee: true
      }
    },
    project: {
      __proto__: null,
      postsByTheirProjectId: {
        localCodec: projectCodec,
        remoteResourceOptions: post_resourceOptionsConfig,
        localAttributes: ["id"],
        remoteAttributes: ["project_id"],
        isReferencee: true
      },
      projectStatusConfigsByTheirProjectId: {
        localCodec: projectCodec,
        remoteResourceOptions: project_status_config_resourceOptionsConfig,
        localAttributes: ["id"],
        remoteAttributes: ["project_id"],
        isReferencee: true
      },
      projectLinksByTheirProjectId: {
        localCodec: projectCodec,
        remoteResourceOptions: project_link_resourceOptionsConfig,
        localAttributes: ["id"],
        remoteAttributes: ["project_id"],
        isReferencee: true
      }
    },
    projectLink: {
      __proto__: null,
      projectByMyProjectId: {
        localCodec: projectLinkCodec,
        remoteResourceOptions: project_resourceOptionsConfig,
        localAttributes: ["project_id"],
        remoteAttributes: ["id"],
        isUnique: true
      }
    },
    projectStatusConfig: {
      __proto__: null,
      projectByMyProjectId: {
        localCodec: projectStatusConfigCodec,
        remoteResourceOptions: project_resourceOptionsConfig,
        localAttributes: ["project_id"],
        remoteAttributes: ["id"],
        isUnique: true
      },
      statusTemplateByMyStatusTemplateId: {
        localCodec: projectStatusConfigCodec,
        remoteResourceOptions: status_template_resourceOptionsConfig,
        localAttributes: ["status_template_id"],
        remoteAttributes: ["id"],
        isUnique: true
      }
    },
    statusTemplate: {
      __proto__: null,
      postsByTheirStatusTemplateId: {
        localCodec: statusTemplateCodec,
        remoteResourceOptions: post_resourceOptionsConfig,
        localAttributes: ["id"],
        remoteAttributes: ["status_template_id"],
        isReferencee: true
      },
      projectStatusConfigsByTheirStatusTemplateId: {
        localCodec: statusTemplateCodec,
        remoteResourceOptions: project_status_config_resourceOptionsConfig,
        localAttributes: ["id"],
        remoteAttributes: ["status_template_id"],
        isReferencee: true
      }
    },
    user: {
      __proto__: null,
      commentsByTheirUserId: {
        localCodec: userCodec,
        remoteResourceOptions: comment_resourceOptionsConfig,
        localAttributes: ["id"],
        remoteAttributes: ["user_id"],
        isReferencee: true
      },
      postsByTheirUserId: {
        localCodec: userCodec,
        remoteResourceOptions: post_resourceOptionsConfig,
        localAttributes: ["id"],
        remoteAttributes: ["user_id"],
        isReferencee: true
      },
      votesByTheirUserId: {
        localCodec: userCodec,
        remoteResourceOptions: vote_resourceOptionsConfig,
        localAttributes: ["id"],
        remoteAttributes: ["user_id"],
        isReferencee: true
      }
    },
    vote: {
      __proto__: null,
      postByMyPostId: {
        localCodec: voteCodec,
        remoteResourceOptions: post_resourceOptionsConfig,
        localAttributes: ["post_id"],
        remoteAttributes: ["id"],
        isUnique: true
      },
      userByMyUserId: {
        localCodec: voteCodec,
        remoteResourceOptions: user_resourceOptionsConfig,
        localAttributes: ["user_id"],
        remoteAttributes: ["id"],
        isUnique: true
      }
    }
  }
};
const registry = makeRegistry(registryConfig);
const resource_commentPgResource = registry.pgResources["comment"];
const resource_project_linkPgResource = registry.pgResources["project_link"];
const resource_status_templatePgResource = registry.pgResources["status_template"];
const resource_votePgResource = registry.pgResources["vote"];
const resource_userPgResource = registry.pgResources["user"];
const resource_project_status_configPgResource = registry.pgResources["project_status_config"];
const resource_postPgResource = registry.pgResources["post"];
const resource_projectPgResource = registry.pgResources["project"];
function applyFirstArg(_, $connection, arg) {
  $connection.setFirst(arg.getRaw());
}
function applyLastArg(_, $connection, val) {
  $connection.setLast(val.getRaw());
}
function applyOffsetArg(_, $connection, val) {
  $connection.setOffset(val.getRaw());
}
function applyBeforeArg(_, $connection, val) {
  $connection.setBefore(val.getRaw());
}
function applyAfterArg(_, $connection, val) {
  $connection.setAfter(val.getRaw());
}
function qbWhereBuilder(qb) {
  return qb.whereBuilder();
}
const applyConditionArgToConnection = (_condition, $connection, arg) => {
  const $select = $connection.getSubplan();
  arg.apply($select, qbWhereBuilder);
};
function isEmpty(o) {
  return typeof o === "object" && o !== null && Object.keys(o).length === 0;
}
function assertAllowed(value, mode) {
  if (mode === "object" && !true && isEmpty(value)) throw Object.assign(Error("Empty objects are forbidden in filter argument input."), {});
  if (mode === "list" && !true) {
    const arr = value;
    if (arr) {
      const l = arr.length;
      for (let i = 0; i < l; i++) if (isEmpty(arr[i])) throw Object.assign(Error("Empty objects are forbidden in filter argument input."), {});
    }
  }
  if (!true && value === null) throw Object.assign(Error("Null literals are forbidden in filter argument input."), {});
}
function Query_commentsfilterApplyPlan(_, $connection, fieldArg) {
  const $pgSelect = $connection.getSubplan();
  fieldArg.apply($pgSelect, (queryBuilder, value) => {
    assertAllowed(value, "object");
    if (value == null) return;
    const condition = new PgCondition(queryBuilder);
    return condition;
  });
}
function applyOrderByArgToConnection(parent, $connection, value) {
  const $select = $connection.getSubplan();
  value.apply($select);
}
const allFields2 = [{
  name: "rowId",
  type: "UUID!"
}, {
  name: "identityProviderId",
  type: "UUID!"
}, {
  name: "name",
  type: "String!"
}, {
  name: "email",
  type: "String!"
}, {
  name: "username",
  type: "String"
}];
const nodeIdHandlerByTypeName = {
  __proto__: null,
  Query: nodeIdHandler_Query
};
const decodeNodeId = makeDecodeNodeId(Object.values(nodeIdHandlerByTypeName));
function findTypeNameMatch(specifier) {
  if (!specifier) return null;
  for (const [typeName, typeSpec] of Object.entries(nodeIdHandlerByTypeName)) {
    const value = specifier[typeSpec.codec.name];
    if (value != null && typeSpec.match(value)) return typeName;
  }
  console.warn(`Could not find a type that matched the specifier '${inspect(specifier)}'`);
  return null;
}
const Comment_rowIdPlan = $record => {
  return $record.get("id");
};
const Comment_postIdPlan = $record => {
  return $record.get("post_id");
};
const Comment_userIdPlan = $record => {
  return $record.get("user_id");
};
const Comment_createdAtPlan = $record => {
  return $record.get("created_at");
};
const Comment_updatedAtPlan = $record => {
  return $record.get("updated_at");
};
const Comment_postPlan = $record => resource_postPgResource.get({
  id: $record.get("post_id")
});
const Comment_userPlan = $record => resource_userPgResource.get({
  id: $record.get("user_id")
});
function toString(value) {
  return "" + value;
}
const coerce = string => {
  if (!/^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}$/i.test(string)) throw new GraphQLError("Invalid UUID, expected 32 hexadecimal characters, optionally with hyphens");
  return string;
};
const Post_projectIdPlan = $record => {
  return $record.get("project_id");
};
const Post_statusTemplateIdPlan = $record => {
  return $record.get("status_template_id");
};
const Post_projectPlan = $record => resource_projectPgResource.get({
  id: $record.get("project_id")
});
const Post_statusTemplatePlan = $record => resource_status_templatePgResource.get({
  id: $record.get("status_template_id")
});
const Project_organizationIdPlan = $record => {
  return $record.get("organization_id");
};
const totalCountConnectionPlan = $connection => $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, !1);
function pgAggregatesCloneSubplanWithoutPaginationSingle($connection) {
  return $connection.cloneSubplanWithoutPagination("aggregate").single();
}
function pgAggregateCloneSubplanWithoutPaginationAsAggregate($connection) {
  return $connection.cloneSubplanWithoutPagination("aggregate");
}
function pgAggregatesApplyGroupedAggregate(_$parent, $pgSelect, input) {
  return input.apply($pgSelect);
}
function pgAggregatesApplyConditionsToGroupedAggregates(_$parent, $pgSelect, input) {
  return input.apply($pgSelect, queryBuilder => queryBuilder.havingBuilder());
}
const pgAggregatesPlanKeys = $pgSelectSingle => {
  const $groupDetails = $pgSelectSingle.getClassStep().getGroupDetails();
  return lambda([$groupDetails, $pgSelectSingle], ([groupDetails, item]) => {
    if (groupDetails.indicies.length === 0 || item == null) return null;else return groupDetails.indicies.map(({
      index
    }) => item[index]);
  });
};
function PostAggregates_keysPlan($pgSelectSingle) {
  return pgAggregatesPlanKeys($pgSelectSingle);
}
function pgAggregatesPlanAggregates($pgSelectSingle) {
  return $pgSelectSingle;
}
const pgAggregatesPlanAggregateAttribute = (attributeCodec, attributeName, codec, spec, $pgSelectSingle) => {
  const sqlAttribute = sql.fragment`${$pgSelectSingle.getClassStep().alias}.${sql.identifier(attributeName)}`,
    sqlAggregate = spec.sqlAggregateWrap(sqlAttribute, attributeCodec);
  return $pgSelectSingle.select(sqlAggregate, codec);
};
const isIntervalLike = codec => !!codec.extensions?.isIntervalLike;
const isNumberLike = codec => !!codec.extensions?.isNumberLike;
const pgAggregateSpec_sum_isSuitableType = codec => isIntervalLike(codec) || isNumberLike(codec);
const dataTypeToAggregateTypeMap = {
  "20": TYPES.numeric,
  "21": TYPES.bigint,
  "23": TYPES.bigint,
  "700": TYPES.float4,
  "701": TYPES.float,
  "790": TYPES.money,
  "1186": TYPES.interval
};
const pgAggregateSpec_sum = {
  id: "sum",
  humanLabel: "sum",
  HumanLabel: "Sum",
  isSuitableType: pgAggregateSpec_sum_isSuitableType,
  sqlAggregateWrap(sqlFrag) {
    return sql`coalesce(sum(${sqlFrag}), '0')`;
  },
  isNonNull: true,
  pgTypeCodecModifier(codec) {
    const oid = codec.extensions?.oid;
    return (oid ? dataTypeToAggregateTypeMap[oid] : null) ?? TYPES.numeric;
  }
};
const dataTypeToAggregateTypeMap2 = {};
const pgAggregateSpec_distinctCount = {
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
    const oid = codec.extensions?.oid;
    return (oid ? dataTypeToAggregateTypeMap2[oid] : null) ?? TYPES.bigint;
  }
};
function PostDistinctCountAggregates_rowIdPlan($pgSelectSingle) {
  return pgAggregatesPlanAggregateAttribute(TYPES.uuid, "id", TYPES.bigint, pgAggregateSpec_distinctCount, $pgSelectSingle);
}
function PostDistinctCountAggregates_titlePlan($pgSelectSingle) {
  return pgAggregatesPlanAggregateAttribute(TYPES.text, "title", TYPES.bigint, pgAggregateSpec_distinctCount, $pgSelectSingle);
}
function PostDistinctCountAggregates_descriptionPlan($pgSelectSingle) {
  return pgAggregatesPlanAggregateAttribute(TYPES.text, "description", TYPES.bigint, pgAggregateSpec_distinctCount, $pgSelectSingle);
}
function PostDistinctCountAggregates_projectIdPlan($pgSelectSingle) {
  return pgAggregatesPlanAggregateAttribute(TYPES.uuid, "project_id", TYPES.bigint, pgAggregateSpec_distinctCount, $pgSelectSingle);
}
function PostDistinctCountAggregates_userIdPlan($pgSelectSingle) {
  return pgAggregatesPlanAggregateAttribute(TYPES.uuid, "user_id", TYPES.bigint, pgAggregateSpec_distinctCount, $pgSelectSingle);
}
function PostDistinctCountAggregates_statusTemplateIdPlan($pgSelectSingle) {
  return pgAggregatesPlanAggregateAttribute(TYPES.uuid, "status_template_id", TYPES.bigint, pgAggregateSpec_distinctCount, $pgSelectSingle);
}
function PostDistinctCountAggregates_createdAtPlan($pgSelectSingle) {
  return pgAggregatesPlanAggregateAttribute(TYPES.timestamptz, "created_at", TYPES.bigint, pgAggregateSpec_distinctCount, $pgSelectSingle);
}
function PostDistinctCountAggregates_updatedAtPlan($pgSelectSingle) {
  return pgAggregatesPlanAggregateAttribute(TYPES.timestamptz, "updated_at", TYPES.bigint, pgAggregateSpec_distinctCount, $pgSelectSingle);
}
const pgAggregateSpec_min = {
  id: "min",
  humanLabel: "minimum",
  HumanLabel: "Minimum",
  isSuitableType: pgAggregateSpec_sum_isSuitableType,
  sqlAggregateWrap(sqlFrag) {
    return sql`min(${sqlFrag})`;
  }
};
const pgAggregateSpec_max = {
  id: "max",
  humanLabel: "maximum",
  HumanLabel: "Maximum",
  isSuitableType: pgAggregateSpec_sum_isSuitableType,
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
const pgAggregateSpec_average = {
  id: "average",
  humanLabel: "mean average",
  HumanLabel: "Mean average",
  isSuitableType: pgAggregateSpec_sum_isSuitableType,
  sqlAggregateWrap(sqlFrag) {
    return sql`avg(${sqlFrag})`;
  },
  pgTypeCodecModifier(codec) {
    const oid = codec.extensions?.oid;
    return (oid ? dataTypeToAggregateTypeMap3[oid] : null) ?? TYPES.numeric;
  }
};
const dataTypeToAggregateTypeMap4 = {
  "700": TYPES.float,
  "701": TYPES.float
};
const pgAggregateSpec_stddevSample = {
  id: "stddevSample",
  humanLabel: "sample standard deviation",
  HumanLabel: "Sample standard deviation",
  isSuitableType: isNumberLike,
  sqlAggregateWrap(sqlFrag) {
    return sql`stddev_samp(${sqlFrag})`;
  },
  pgTypeCodecModifier(codec) {
    const oid = codec.extensions?.oid;
    return (oid ? dataTypeToAggregateTypeMap4[oid] : null) ?? TYPES.numeric;
  }
};
const dataTypeToAggregateTypeMap5 = {
  "700": TYPES.float,
  "701": TYPES.float
};
const pgAggregateSpec_stddevPopulation = {
  id: "stddevPopulation",
  humanLabel: "population standard deviation",
  HumanLabel: "Population standard deviation",
  isSuitableType: isNumberLike,
  sqlAggregateWrap(sqlFrag) {
    return sql`stddev_pop(${sqlFrag})`;
  },
  pgTypeCodecModifier(codec) {
    const oid = codec.extensions?.oid;
    return (oid ? dataTypeToAggregateTypeMap5[oid] : null) ?? TYPES.numeric;
  }
};
const dataTypeToAggregateTypeMap6 = {
  "700": TYPES.float,
  "701": TYPES.float
};
const pgAggregateSpec_varianceSample = {
  id: "varianceSample",
  humanLabel: "sample variance",
  HumanLabel: "Sample variance",
  isSuitableType: isNumberLike,
  sqlAggregateWrap(sqlFrag) {
    return sql`var_samp(${sqlFrag})`;
  },
  pgTypeCodecModifier(codec) {
    const oid = codec.extensions?.oid;
    return (oid ? dataTypeToAggregateTypeMap6[oid] : null) ?? TYPES.numeric;
  }
};
const dataTypeToAggregateTypeMap7 = {
  "700": TYPES.float,
  "701": TYPES.float
};
const pgAggregateSpec_variancePopulation = {
  id: "variancePopulation",
  humanLabel: "population variance",
  HumanLabel: "Population variance",
  isSuitableType: isNumberLike,
  sqlAggregateWrap(sqlFrag) {
    return sql`var_pop(${sqlFrag})`;
  },
  pgTypeCodecModifier(codec) {
    const oid = codec.extensions?.oid;
    return (oid ? dataTypeToAggregateTypeMap7[oid] : null) ?? TYPES.numeric;
  }
};
const applyGroupByAttribute = (attributeName, attrCodec, qb) => {
  qb.groupBy({
    fragment: sql.fragment`${qb.alias}.${sql.identifier(attributeName)}`,
    codec: attrCodec
  });
};
function PostGroupBy_TITLEApply($pgSelect) {
  applyGroupByAttribute("title", TYPES.text, $pgSelect);
}
function PostGroupBy_DESCRIPTIONApply($pgSelect) {
  applyGroupByAttribute("description", TYPES.text, $pgSelect);
}
function PostGroupBy_PROJECT_IDApply($pgSelect) {
  applyGroupByAttribute("project_id", TYPES.uuid, $pgSelect);
}
function PostGroupBy_USER_IDApply($pgSelect) {
  applyGroupByAttribute("user_id", TYPES.uuid, $pgSelect);
}
function PostGroupBy_STATUS_TEMPLATE_IDApply($pgSelect) {
  applyGroupByAttribute("status_template_id", TYPES.uuid, $pgSelect);
}
const pgAggregateGroupBySpec_truncated_to_hour_isSuitableType = codec => codec === TYPES.timestamp || codec === TYPES.timestamptz;
const pgAggregateGroupBySpec_truncated_to_hour = {
  id: "truncated-to-hour",
  isSuitableType: pgAggregateGroupBySpec_truncated_to_hour_isSuitableType,
  sqlWrap(sqlFrag) {
    return sql`date_trunc('hour', ${sqlFrag})`;
  },
  sqlWrapCodec(codec) {
    return codec;
  }
};
const applyGroupByAggregateSpec = (aggregateGroupBySpec, attributeName, attrCodec, qb) => {
  qb.groupBy({
    fragment: aggregateGroupBySpec.sqlWrap(sql`${qb.alias}.${sql.identifier(attributeName)}`),
    codec: aggregateGroupBySpec.sqlWrapCodec(attrCodec)
  });
};
const pgAggregateGroupBySpec_truncated_to_day = {
  id: "truncated-to-day",
  isSuitableType: pgAggregateGroupBySpec_truncated_to_hour_isSuitableType,
  sqlWrap(sqlFrag) {
    return sql`date_trunc('day', ${sqlFrag})`;
  },
  sqlWrapCodec(codec) {
    return codec;
  }
};
function PostGroupBy_CREATED_ATApply($pgSelect) {
  applyGroupByAttribute("created_at", TYPES.timestamptz, $pgSelect);
}
function PostGroupBy_CREATED_AT_TRUNCATED_TO_HOURApply(qb) {
  applyGroupByAggregateSpec(pgAggregateGroupBySpec_truncated_to_hour, "created_at", TYPES.timestamptz, qb);
}
function PostGroupBy_CREATED_AT_TRUNCATED_TO_DAYApply(qb) {
  applyGroupByAggregateSpec(pgAggregateGroupBySpec_truncated_to_day, "created_at", TYPES.timestamptz, qb);
}
function PostGroupBy_UPDATED_ATApply($pgSelect) {
  applyGroupByAttribute("updated_at", TYPES.timestamptz, $pgSelect);
}
function PostGroupBy_UPDATED_AT_TRUNCATED_TO_HOURApply(qb) {
  applyGroupByAggregateSpec(pgAggregateGroupBySpec_truncated_to_hour, "updated_at", TYPES.timestamptz, qb);
}
function PostGroupBy_UPDATED_AT_TRUNCATED_TO_DAYApply(qb) {
  applyGroupByAggregateSpec(pgAggregateGroupBySpec_truncated_to_day, "updated_at", TYPES.timestamptz, qb);
}
function pgAggregatesApplyAnd($where) {
  return $where;
}
const PostHavingInput_ORApply = $where => new PgOrFilter($where);
function pgAggregatesPlanAggregatesField($having) {
  return $having;
}
const pgAggregatesApplyAttributeFilter = (aggregateSpec, attribute, attributeName, $having) => {
  const attributeExpression = sql.fragment`${$having.alias}.${sql.identifier(attributeName)}`,
    aggregateExpression = aggregateSpec.sqlAggregateWrap(attributeExpression, attribute.codec);
  return new PgBooleanFilter($having, aggregateExpression);
};
const infix = () => sql.fragment`=`;
const pgAggregatesApplyHavingBinaryOperation = (codec, infix, $booleanFilter, input) => {
  if (input == null) return;
  $booleanFilter.having(sql`(${sql.parens($booleanFilter.expression)} ${infix()} ${sqlValueWithCodec(input, codec)})`);
};
const infix2 = () => sql.fragment`<>`;
const infix3 = () => sql.fragment`>`;
const infix4 = () => sql.fragment`>=`;
const infix5 = () => sql.fragment`<`;
const infix6 = () => sql.fragment`<=`;
function applyAttributeCondition(attributeName, attributeCodec, $condition, val) {
  $condition.where({
    type: "attribute",
    attribute: attributeName,
    callback(expression) {
      return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, attributeCodec)}`;
    }
  });
}
const PostCondition_rowIdApply = ($condition, val) => applyAttributeCondition("id", TYPES.uuid, $condition, val);
const PostCondition_titleApply = ($condition, val) => applyAttributeCondition("title", TYPES.text, $condition, val);
const PostCondition_descriptionApply = ($condition, val) => applyAttributeCondition("description", TYPES.text, $condition, val);
const PostCondition_projectIdApply = ($condition, val) => applyAttributeCondition("project_id", TYPES.uuid, $condition, val);
const PostCondition_userIdApply = ($condition, val) => applyAttributeCondition("user_id", TYPES.uuid, $condition, val);
const PostCondition_statusTemplateIdApply = ($condition, val) => applyAttributeCondition("status_template_id", TYPES.uuid, $condition, val);
const PostCondition_createdAtApply = ($condition, val) => applyAttributeCondition("created_at", TYPES.timestamptz, $condition, val);
const PostCondition_updatedAtApply = ($condition, val) => applyAttributeCondition("updated_at", TYPES.timestamptz, $condition, val);
const pgConnectionFilterApplyAttribute = (fieldName, attributeName, attribute, queryBuilder, value) => {
  if (value === void 0) return;
  if (!true && isEmpty(value)) throw Object.assign(Error("Empty objects are forbidden in filter argument input."), {});
  if (!true && value === null) throw Object.assign(Error("Null literals are forbidden in filter argument input."), {});
  const condition = new PgCondition(queryBuilder);
  condition.extensions.pgFilterAttribute = {
    fieldName,
    attributeName,
    attribute
  };
  return condition;
};
const pgConnectionFilterApplySingleRelation = (foreignTable, foreignTableExpression, localAttributes, remoteAttributes, $where, value) => {
  assertAllowed(value, "object");
  if (value == null) return;
  const $subQuery = $where.existsPlan({
    tableExpression: foreignTableExpression,
    alias: foreignTable.name
  });
  localAttributes.forEach((localAttribute, i) => {
    const remoteAttribute = remoteAttributes[i];
    $subQuery.where(sql`${$where.alias}.${sql.identifier(localAttribute)} = ${$subQuery.alias}.${sql.identifier(remoteAttribute)}`);
  });
  return $subQuery;
};
const pgConnectionFilterApplyForwardRelationExists = (foreignTable, foreignTableExpression, localAttributes, remoteAttributes, $where, value) => {
  assertAllowed(value, "scalar");
  if (value == null) return;
  const $subQuery = $where.existsPlan({
    tableExpression: foreignTableExpression,
    alias: foreignTable.name,
    equals: value
  });
  localAttributes.forEach((localAttribute, i) => {
    const remoteAttribute = remoteAttributes[i];
    $subQuery.where(sql`${$where.alias}.${sql.identifier(localAttribute)} = ${$subQuery.alias}.${sql.identifier(remoteAttribute)}`);
  });
};
function PostFilter_andApply($where, value) {
  assertAllowed(value, "list");
  if (value == null) return;
  return $where.andPlan();
}
function PostFilter_orApply($where, value) {
  assertAllowed(value, "list");
  if (value == null) return;
  const $or = $where.orPlan();
  return () => $or.andPlan();
}
function PostFilter_notApply($where, value) {
  assertAllowed(value, "object");
  if (value == null) return;
  return $where.notPlan().andPlan();
}
const pgConnectionFilterApplyFromOperator = (fieldName, resolve, resolveInput, resolveInputCodec, resolveSqlIdentifier, resolveSqlValue, $where, value) => {
  if (!$where.extensions?.pgFilterAttribute) throw Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to `postgraphile-plugin-connection-filter` does not implement the required interfaces.");
  if (value === void 0) return;
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
  if (value === null) return;
  if (!true && value === null) throw Object.assign(Error("Null literals are forbidden in filter argument input."), {});
  const resolvedInput = resolveInput ? resolveInput(value) : value,
    inputCodec = resolveInputCodec ? resolveInputCodec(codec ?? attribute.codec) : codec ?? attribute.codec,
    sqlValue = resolveSqlValue ? resolveSqlValue($where, value, inputCodec) : sqlValueWithCodec(resolvedInput, inputCodec),
    fragment = resolve(sqlIdentifier, sqlValue, value, $where, {
      fieldName: parentFieldName ?? null,
      operatorName: fieldName
    });
  $where.where(fragment);
};
const resolveIsNull = (i, _v, input) => sql`${i} ${input ? sql`IS NULL` : sql`IS NOT NULL`}`;
const resolveBoolean = () => TYPES.boolean;
const resolveSqlValue_null = () => sql.null;
function pgAggregatesApply_isNull($where, value) {
  return pgConnectionFilterApplyFromOperator("isNull", resolveIsNull, undefined, resolveBoolean, undefined, resolveSqlValue_null, $where, value);
}
const resolveEquality = (i, v) => sql`${i} = ${v}`;
const forceTextTypesSensitive = [TYPES.citext, TYPES.char, TYPES.bpchar];
function resolveDomains(c) {
  let current = c;
  while (current.domainOfCodec) current = current.domainOfCodec;
  return current;
}
function resolveInputCodecSensitive(c) {
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
function resolveSqlIdentifierSensitive(identifier, c) {
  if (c.arrayOfCodec && forceTextTypesSensitive.includes(resolveDomains(c.arrayOfCodec))) return [sql`(${identifier})::text[]`, listOfCodec(TYPES.text, {
    extensions: {
      listItemNonNull: c.extensions?.listItemNonNull
    }
  })];else if (forceTextTypesSensitive.includes(resolveDomains(c))) return [sql`(${identifier})::text`, TYPES.text];else return [identifier, c];
}
function pgAggregatesApply_equalTo($where, value) {
  return pgConnectionFilterApplyFromOperator("equalTo", resolveEquality, undefined, resolveInputCodecSensitive, resolveSqlIdentifierSensitive, undefined, $where, value);
}
const resolveInequality = (i, v) => sql`${i} <> ${v}`;
function pgAggregatesApply_notEqualTo($where, value) {
  return pgConnectionFilterApplyFromOperator("notEqualTo", resolveInequality, undefined, resolveInputCodecSensitive, resolveSqlIdentifierSensitive, undefined, $where, value);
}
const resolveDistinct = (i, v) => sql`${i} IS DISTINCT FROM ${v}`;
function pgAggregatesApply_distinctFrom($where, value) {
  return pgConnectionFilterApplyFromOperator("distinctFrom", resolveDistinct, undefined, resolveInputCodecSensitive, resolveSqlIdentifierSensitive, undefined, $where, value);
}
const resolveNotDistinct = (i, v) => sql`${i} IS NOT DISTINCT FROM ${v}`;
function pgAggregatesApply_notDistinctFrom($where, value) {
  return pgConnectionFilterApplyFromOperator("notDistinctFrom", resolveNotDistinct, undefined, resolveInputCodecSensitive, resolveSqlIdentifierSensitive, undefined, $where, value);
}
const resolveEqualsAny = (i, v) => sql`${i} = ANY(${v})`;
function resolveArrayInputCodecSensitive(c) {
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
function pgAggregatesApply_in($where, value) {
  return pgConnectionFilterApplyFromOperator("in", resolveEqualsAny, undefined, resolveArrayInputCodecSensitive, resolveSqlIdentifierSensitive, undefined, $where, value);
}
const resolveInequalAll = (i, v) => sql`${i} <> ALL(${v})`;
function pgAggregatesApply_notIn($where, value) {
  return pgConnectionFilterApplyFromOperator("notIn", resolveInequalAll, undefined, resolveArrayInputCodecSensitive, resolveSqlIdentifierSensitive, undefined, $where, value);
}
const resolveLessThan = (i, v) => sql`${i} < ${v}`;
function pgAggregatesApply_lessThan($where, value) {
  return pgConnectionFilterApplyFromOperator("lessThan", resolveLessThan, undefined, resolveInputCodecSensitive, resolveSqlIdentifierSensitive, undefined, $where, value);
}
const resolveLessThanOrEqualTo = (i, v) => sql`${i} <= ${v}`;
function pgAggregatesApply_lessThanOrEqualTo($where, value) {
  return pgConnectionFilterApplyFromOperator("lessThanOrEqualTo", resolveLessThanOrEqualTo, undefined, resolveInputCodecSensitive, resolveSqlIdentifierSensitive, undefined, $where, value);
}
const resolveGreaterThan = (i, v) => sql`${i} > ${v}`;
function pgAggregatesApply_greaterThan($where, value) {
  return pgConnectionFilterApplyFromOperator("greaterThan", resolveGreaterThan, undefined, resolveInputCodecSensitive, resolveSqlIdentifierSensitive, undefined, $where, value);
}
const resolveGreaterThanOrEqualTo = (i, v) => sql`${i} >= ${v}`;
function pgAggregatesApply_greaterThanOrEqualTo($where, value) {
  return pgConnectionFilterApplyFromOperator("greaterThanOrEqualTo", resolveGreaterThanOrEqualTo, undefined, resolveInputCodecSensitive, resolveSqlIdentifierSensitive, undefined, $where, value);
}
const resolveLike = (i, v) => sql`${i} LIKE ${v}`;
function escapeLikeWildcards(input) {
  if (typeof input !== "string") throw Error("Non-string input was provided to escapeLikeWildcards");else return input.split("%").join("\\%").split("_").join("\\_");
}
const resolveInputContains = input => `%${escapeLikeWildcards(input)}%`;
const resolveNotLike = (i, v) => sql`${i} NOT LIKE ${v}`;
const resolveILike = (i, v) => sql`${i} ILIKE ${v}`;
const forceTextTypesInsensitive = [TYPES.char, TYPES.bpchar];
function resolveInputCodecInsensitive(c) {
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
function resolveSqlIdentifierInsensitive(identifier, c) {
  if (c.arrayOfCodec && forceTextTypesInsensitive.includes(resolveDomains(c.arrayOfCodec))) return [sql`(${identifier})::text[]`, listOfCodec(TYPES.text, {
    extensions: {
      listItemNonNull: c.extensions?.listItemNonNull
    }
  })];else if (forceTextTypesInsensitive.includes(resolveDomains(c))) return [sql`(${identifier})::text`, TYPES.text];else return [identifier, c];
}
const resolveNotILike = (i, v) => sql`${i} NOT ILIKE ${v}`;
const resolveInputStartsWith = input => `${escapeLikeWildcards(input)}%`;
const resolveInputEndsWith = input => `%${escapeLikeWildcards(input)}`;
function resolveInputCodecInsensitiveOperator(inputCodec) {
  return resolveDomains(inputCodec) === TYPES.citext ? inputCodec : TYPES.text;
}
function resolveSqlIdentifierInsensitiveOperator(sourceAlias, codec) {
  return resolveDomains(codec) === TYPES.citext ? [sourceAlias, codec] : [sql`lower(${sourceAlias}::text)`, TYPES.text];
}
function resolveSqlValueInsensitiveOperator(_unused, input, inputCodec) {
  const sqlValue = sqlValueWithCodec(input, inputCodec);
  if (inputCodec === TYPES.citext) return sqlValue;else return sql`lower(${sqlValue})`;
}
function resolveInputCodecInsensitiveOperator_list(inputCodec) {
  const t = resolveDomains(inputCodec) === TYPES.citext ? inputCodec : TYPES.text;
  return listOfCodec(t, {
    extensions: {
      listItemNonNull: !0
    }
  });
}
function resolveSqlValueInsensitiveOperator_list(_unused, input, inputCodec) {
  const sqlList = sqlValueWithCodec(input, inputCodec);
  if (inputCodec.arrayOfCodec === TYPES.citext) return sqlList;else return sql`(select lower(t) from unnest(${sqlList}) t)`;
}
function PostToManyCommentFilter_everyApply($where, value) {
  assertAllowed(value, "object");
  if (value == null) return;
  if (!$where.extensions.pgFilterRelation) throw Error("Invalid use of filter, 'pgFilterRelation' expected");
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
  return $subQuery.notPlan().andPlan();
}
function PostToManyCommentFilter_someApply($where, value) {
  assertAllowed(value, "object");
  if (value == null) return;
  if (!$where.extensions.pgFilterRelation) throw Error("Invalid use of filter, 'pgFilterRelation' expected");
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
  return $subQuery;
}
function PostToManyCommentFilter_noneApply($where, value) {
  assertAllowed(value, "object");
  if (value == null) return;
  if (!$where.extensions.pgFilterRelation) throw Error("Invalid use of filter, 'pgFilterRelation' expected");
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
  return $subQuery;
}
class PgAggregateConditionExpression extends Modifier {
  spec;
  pgWhereConditionSpecListToSQL;
  alias;
  conditions = [];
  constructor(parent, spec, pgWhereConditionSpecListToSQL) {
    super(parent);
    this.spec = spec;
    this.pgWhereConditionSpecListToSQL = pgWhereConditionSpecListToSQL;
    this.alias = parent.alias;
  }
  where(condition) {
    this.conditions.push(condition);
  }
  apply() {
    const sqlCondition = this.pgWhereConditionSpecListToSQL(this.alias, this.conditions);
    if (sqlCondition) this.parent.expression(sqlCondition);
  }
}
class PgAggregateCondition extends Modifier {
  pgWhereConditionSpecListToSQL;
  sql;
  tableExpression;
  alias;
  conditions = [];
  expressions = [];
  constructor(parent, options, pgWhereConditionSpecListToSQL) {
    super(parent);
    this.pgWhereConditionSpecListToSQL = pgWhereConditionSpecListToSQL;
    const {
      sql,
      tableExpression,
      alias
    } = options;
    this.sql = sql;
    this.alias = sql.identifier(Symbol(alias ?? "aggregate"));
    this.tableExpression = tableExpression;
  }
  where(condition) {
    this.conditions.push(condition);
  }
  expression(expression) {
    this.expressions.push(expression);
  }
  forAggregate(spec) {
    return new PgAggregateConditionExpression(this, spec, this.pgWhereConditionSpecListToSQL);
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
    return this.parent.where(subquery);
  }
}
const pgAggregatesApply = ($where, input) => {
  if (input == null) return;
  if (!$where.extensions.pgFilterRelation) throw Error("Invalid use of filter, 'pgFilterRelation' expected");
  const {
      localAttributes,
      remoteAttributes,
      tableExpression,
      alias
    } = $where.extensions.pgFilterRelation,
    $subQuery = new PgAggregateCondition($where, {
      sql,
      tableExpression,
      alias
    }, pgWhereConditionSpecListToSQL);
  localAttributes.forEach((localAttribute, i) => {
    const remoteAttribute = remoteAttributes[i];
    $subQuery.where(sql`${$where.alias}.${sql.identifier(localAttribute)} = ${$subQuery.alias}.${sql.identifier(remoteAttribute)}`);
  });
  return $subQuery;
};
function PostToManyCommentFilter_aggregatesApply($where, input) {
  return pgAggregatesApply($where, input);
}
function pgAggregateApplyForeignCondition($subquery, input) {
  if (input == null) return;
  return new PgCondition($subquery, !1, "AND");
}
const filterApply = ($subquery, input) => pgAggregateApplyForeignCondition($subquery, input);
function CommentAggregatesFilter_distinctCountApply($subquery, input) {
  if (input == null) return;
  return $subquery.forAggregate(pgAggregateSpec_distinctCount);
}
const pgAggregateApplyAttributeOrder = (spec, attributeName, attrCodec, rawAttrCodec, $parent, input) => {
  if (input == null) return;
  const $col = new PgCondition($parent);
  $col.extensions.pgFilterAttribute = {
    codec: attrCodec,
    expression: spec.sqlAggregateWrap(sql`${$col.alias}.${sql.identifier(attributeName)}`, rawAttrCodec)
  };
  return $col;
};
function CommentDistinctCountAggregateFilter_rowIdApply($parent, input) {
  return pgAggregateApplyAttributeOrder(pgAggregateSpec_distinctCount, "id", TYPES.bigint, TYPES.uuid, $parent, input);
}
function CommentDistinctCountAggregateFilter_postIdApply($parent, input) {
  return pgAggregateApplyAttributeOrder(pgAggregateSpec_distinctCount, "post_id", TYPES.bigint, TYPES.uuid, $parent, input);
}
function CommentDistinctCountAggregateFilter_userIdApply($parent, input) {
  return pgAggregateApplyAttributeOrder(pgAggregateSpec_distinctCount, "user_id", TYPES.bigint, TYPES.uuid, $parent, input);
}
function CommentDistinctCountAggregateFilter_createdAtApply($parent, input) {
  return pgAggregateApplyAttributeOrder(pgAggregateSpec_distinctCount, "created_at", TYPES.bigint, TYPES.timestamptz, $parent, input);
}
function CommentDistinctCountAggregateFilter_updatedAtApply($parent, input) {
  return pgAggregateApplyAttributeOrder(pgAggregateSpec_distinctCount, "updated_at", TYPES.bigint, TYPES.timestamptz, $parent, input);
}
function PostAggregatesFilter_sumApply($subquery, input) {
  if (input == null) return;
  return $subquery.forAggregate(pgAggregateSpec_sum);
}
function PostAggregatesFilter_minApply($subquery, input) {
  if (input == null) return;
  return $subquery.forAggregate(pgAggregateSpec_min);
}
function PostAggregatesFilter_maxApply($subquery, input) {
  if (input == null) return;
  return $subquery.forAggregate(pgAggregateSpec_max);
}
function PostAggregatesFilter_averageApply($subquery, input) {
  if (input == null) return;
  return $subquery.forAggregate(pgAggregateSpec_average);
}
function PostAggregatesFilter_stddevSampleApply($subquery, input) {
  if (input == null) return;
  return $subquery.forAggregate(pgAggregateSpec_stddevSample);
}
function PostAggregatesFilter_stddevPopulationApply($subquery, input) {
  if (input == null) return;
  return $subquery.forAggregate(pgAggregateSpec_stddevPopulation);
}
function PostAggregatesFilter_varianceSampleApply($subquery, input) {
  if (input == null) return;
  return $subquery.forAggregate(pgAggregateSpec_varianceSample);
}
function PostAggregatesFilter_variancePopulationApply($subquery, input) {
  if (input == null) return;
  return $subquery.forAggregate(pgAggregateSpec_variancePopulation);
}
function PostDistinctCountAggregateFilter_titleApply($parent, input) {
  return pgAggregateApplyAttributeOrder(pgAggregateSpec_distinctCount, "title", TYPES.bigint, TYPES.text, $parent, input);
}
function PostDistinctCountAggregateFilter_projectIdApply($parent, input) {
  return pgAggregateApplyAttributeOrder(pgAggregateSpec_distinctCount, "project_id", TYPES.bigint, TYPES.uuid, $parent, input);
}
function PostDistinctCountAggregateFilter_statusTemplateIdApply($parent, input) {
  return pgAggregateApplyAttributeOrder(pgAggregateSpec_distinctCount, "status_template_id", TYPES.bigint, TYPES.uuid, $parent, input);
}
const PostOrderBy_ROW_ID_ASCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "id",
    direction: "ASC"
  });
  queryBuilder.setOrderIsUnique();
};
const PostOrderBy_ROW_ID_DESCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "id",
    direction: "DESC"
  });
  queryBuilder.setOrderIsUnique();
};
const PostOrderBy_TITLE_ASCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "title",
    direction: "ASC"
  });
};
const PostOrderBy_TITLE_DESCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "title",
    direction: "DESC"
  });
};
const PostOrderBy_DESCRIPTION_ASCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "description",
    direction: "ASC"
  });
};
const PostOrderBy_DESCRIPTION_DESCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "description",
    direction: "DESC"
  });
};
const PostOrderBy_PROJECT_ID_ASCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "project_id",
    direction: "ASC"
  });
  queryBuilder.setOrderIsUnique();
};
const PostOrderBy_PROJECT_ID_DESCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "project_id",
    direction: "DESC"
  });
  queryBuilder.setOrderIsUnique();
};
const PostOrderBy_USER_ID_ASCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "user_id",
    direction: "ASC"
  });
};
const PostOrderBy_USER_ID_DESCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "user_id",
    direction: "DESC"
  });
};
const PostOrderBy_STATUS_TEMPLATE_ID_ASCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "status_template_id",
    direction: "ASC"
  });
};
const PostOrderBy_STATUS_TEMPLATE_ID_DESCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "status_template_id",
    direction: "DESC"
  });
};
const PostOrderBy_CREATED_AT_ASCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "created_at",
    direction: "ASC"
  });
};
const PostOrderBy_CREATED_AT_DESCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "created_at",
    direction: "DESC"
  });
};
const PostOrderBy_UPDATED_AT_ASCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "updated_at",
    direction: "ASC"
  });
};
const PostOrderBy_UPDATED_AT_DESCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "updated_at",
    direction: "DESC"
  });
};
const pgAggregatesApplyOrderByTotalCount = (direction, relation, table, $select) => {
  const foreignTableAlias = $select.alias,
    conditions = [],
    tableAlias = sql.identifier(Symbol(table.name));
  relation.localAttributes.forEach((localAttribute, i) => {
    const remoteAttribute = relation.remoteAttributes[i];
    conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
  });
  if (typeof table.from === "function") throw Error("Function source unsupported");
  const fragment = sql`(${sql.indent`select count(*)
from ${table.from} ${tableAlias}
where ${sql.parens(sql.join(conditions.map(c => sql.parens(c)), " AND "))}`})`;
  $select.orderBy({
    fragment,
    codec: TYPES.bigint,
    direction
  });
};
const relation = registry.pgRelations["post"]["commentsByTheirPostId"];
const pgAggregatesApplyOrderByAttribute = (aggregateSpec, attribute, attributeName, direction, relation, table, $select) => {
  const foreignTableAlias = $select.alias,
    conditions = [],
    tableAlias = sql.identifier(Symbol(table.name));
  relation.localAttributes.forEach((localAttribute, i) => {
    const remoteAttribute = relation.remoteAttributes[i];
    conditions.push(sql.fragment`${tableAlias}.${sql.identifier(remoteAttribute)} = ${foreignTableAlias}.${sql.identifier(localAttribute)}`);
  });
  if (typeof table.from === "function") throw Error("Function source unsupported");
  const fragment = sql`(${sql.indent`
select ${aggregateSpec.sqlAggregateWrap(sql.fragment`${tableAlias}.${sql.identifier(attributeName)}`, attribute.codec)}
from ${table.from} ${tableAlias}
where ${sql.join(conditions.map(c => sql.parens(c)), " AND ")}`})`;
  $select.orderBy({
    fragment,
    codec: aggregateSpec.pgTypeCodecModifier?.(attribute.codec) ?? attribute.codec,
    direction
  });
};
const relation2 = registry.pgRelations["post"]["votesByTheirPostId"];
const ProjectStatusConfig_sortOrderPlan = $record => {
  return $record.get("sort_order");
};
const ProjectStatusConfigCondition_sortOrderApply = ($condition, val) => applyAttributeCondition("sort_order", TYPES.int, $condition, val);
const ProjectStatusConfigOrderBy_SORT_ORDER_ASCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "sort_order",
    direction: "ASC"
  });
};
const ProjectStatusConfigOrderBy_SORT_ORDER_DESCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "sort_order",
    direction: "DESC"
  });
};
function ProjectStatusConfigSumAggregates_sortOrderPlan($pgSelectSingle) {
  return pgAggregatesPlanAggregateAttribute(TYPES.int, "sort_order", TYPES.bigint, pgAggregateSpec_sum, $pgSelectSingle);
}
function ProjectStatusConfigDistinctCountAggregates_sortOrderPlan($pgSelectSingle) {
  return pgAggregatesPlanAggregateAttribute(TYPES.int, "sort_order", TYPES.bigint, pgAggregateSpec_distinctCount, $pgSelectSingle);
}
function ProjectStatusConfigMinAggregates_sortOrderPlan($pgSelectSingle) {
  return pgAggregatesPlanAggregateAttribute(TYPES.int, "sort_order", TYPES.int, pgAggregateSpec_min, $pgSelectSingle);
}
function ProjectStatusConfigMaxAggregates_sortOrderPlan($pgSelectSingle) {
  return pgAggregatesPlanAggregateAttribute(TYPES.int, "sort_order", TYPES.int, pgAggregateSpec_max, $pgSelectSingle);
}
function ProjectStatusConfigAverageAggregates_sortOrderPlan($pgSelectSingle) {
  return pgAggregatesPlanAggregateAttribute(TYPES.int, "sort_order", TYPES.numeric, pgAggregateSpec_average, $pgSelectSingle);
}
function ProjectStatusConfigStddevSampleAggregates_sortOrderPlan($pgSelectSingle) {
  return pgAggregatesPlanAggregateAttribute(TYPES.int, "sort_order", TYPES.numeric, pgAggregateSpec_stddevSample, $pgSelectSingle);
}
function ProjectStatusConfigStddevPopulationAggregates_sortOrderPlan($pgSelectSingle) {
  return pgAggregatesPlanAggregateAttribute(TYPES.int, "sort_order", TYPES.numeric, pgAggregateSpec_stddevPopulation, $pgSelectSingle);
}
function ProjectStatusConfigVarianceSampleAggregates_sortOrderPlan($pgSelectSingle) {
  return pgAggregatesPlanAggregateAttribute(TYPES.int, "sort_order", TYPES.numeric, pgAggregateSpec_varianceSample, $pgSelectSingle);
}
function ProjectStatusConfigVariancePopulationAggregates_sortOrderPlan($pgSelectSingle) {
  return pgAggregatesPlanAggregateAttribute(TYPES.int, "sort_order", TYPES.numeric, pgAggregateSpec_variancePopulation, $pgSelectSingle);
}
function ProjectStatusConfigGroupBy_SORT_ORDERApply($pgSelect) {
  applyGroupByAttribute("sort_order", TYPES.int, $pgSelect);
}
function CommentDistinctCountAggregates_postIdPlan($pgSelectSingle) {
  return pgAggregatesPlanAggregateAttribute(TYPES.uuid, "post_id", TYPES.bigint, pgAggregateSpec_distinctCount, $pgSelectSingle);
}
function CommentGroupBy_POST_IDApply($pgSelect) {
  applyGroupByAttribute("post_id", TYPES.uuid, $pgSelect);
}
const CommentCondition_postIdApply = ($condition, val) => applyAttributeCondition("post_id", TYPES.uuid, $condition, val);
const relation3 = registry.pgRelations["comment"]["commentsByTheirParentId"];
function StatusTemplateDistinctCountAggregates_organizationIdPlan($pgSelectSingle) {
  return pgAggregatesPlanAggregateAttribute(TYPES.uuid, "organization_id", TYPES.bigint, pgAggregateSpec_distinctCount, $pgSelectSingle);
}
function StatusTemplateDistinctCountAggregates_namePlan($pgSelectSingle) {
  return pgAggregatesPlanAggregateAttribute(TYPES.text, "name", TYPES.bigint, pgAggregateSpec_distinctCount, $pgSelectSingle);
}
function StatusTemplateGroupBy_ORGANIZATION_IDApply($pgSelect) {
  applyGroupByAttribute("organization_id", TYPES.uuid, $pgSelect);
}
function StatusTemplateGroupBy_NAMEApply($pgSelect) {
  applyGroupByAttribute("name", TYPES.text, $pgSelect);
}
const StatusTemplateCondition_organizationIdApply = ($condition, val) => applyAttributeCondition("organization_id", TYPES.uuid, $condition, val);
const StatusTemplateCondition_nameApply = ($condition, val) => applyAttributeCondition("name", TYPES.text, $condition, val);
const StatusTemplateOrderBy_NAME_ASCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "name",
    direction: "ASC"
  });
};
const StatusTemplateOrderBy_NAME_DESCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "name",
    direction: "DESC"
  });
};
const relation4 = registry.pgRelations["statusTemplate"]["postsByTheirStatusTemplateId"];
const relation5 = registry.pgRelations["statusTemplate"]["projectStatusConfigsByTheirStatusTemplateId"];
const relation6 = registry.pgRelations["user"]["commentsByTheirUserId"];
const relation7 = registry.pgRelations["user"]["postsByTheirUserId"];
const relation8 = registry.pgRelations["user"]["votesByTheirUserId"];
const relation9 = registry.pgRelations["project"]["postsByTheirProjectId"];
const relation10 = registry.pgRelations["project"]["projectStatusConfigsByTheirProjectId"];
const relation11 = registry.pgRelations["project"]["projectLinksByTheirProjectId"];
function oldPlan2(_, args) {
  const $insert = pgInsertSingle(resource_commentPgResource);
  args.apply($insert);
  return object({
    result: $insert
  });
}
const planWrapper = (plan, _, fieldArgs) => {
  const $input = fieldArgs.getRaw(["input", "comment"]),
    $observer = context().get("observer"),
    $db = context().get("db");
  sideEffect([$input, $observer, $db], async ([input, observer, db]) => {
    if (!observer) throw Error("Unauthorized");
    {
      const postId = input.postId,
        post = await db.query.posts.findFirst({
          where(table, {
            eq
          }) {
            return eq(table.id, postId);
          },
          with: {
            project: !0
          }
        });
      if (!post) throw Error("Post does not exist");
      const comments = await db.query.comments.findMany({
        where(table, {
          eq
        }) {
          return eq(table.postId, postId);
        },
        columns: {
          id: !0
        }
      });
      if (!(await isWithinLimit({
        organizationId: post.project.organizationId
      }, FEATURE_KEYS.MAX_COMMENTS_PER_POST, comments.length, billingBypassOrgIds))) throw Error("Maximum number of comments has been reached");
    }
  });
  return plan();
};
function oldPlan(...planParams) {
  const smartPlan = (...overrideParams) => {
      const args = [...overrideParams.concat(planParams.slice(overrideParams.length))],
        $prev = oldPlan2.apply(this, args);
      if (!($prev instanceof ExecutableStep)) {
        console.error(`Wrapped a plan function at Mutation.createComment, but that function did not return a step!
${String(oldPlan2)}`);
        throw Error("Wrapped a plan function, but that function did not return a step!");
      }
      args[1].autoApply($prev);
      return $prev;
    },
    [$source, fieldArgs, info] = planParams,
    $newPlan = planWrapper(smartPlan, $source, fieldArgs, info);
  if ($newPlan === void 0) throw Error("Your plan wrapper didn't return anything; it must return a step or null!");
  if ($newPlan !== null && !isStep($newPlan)) throw Error(`Your plan wrapper returned something other than a step... It must return a step (or null). (Returned: ${inspect($newPlan)})`);
  return $newPlan;
}
const planWrapper2 = (plan, _, fieldArgs) => {
  const $result = plan(),
    $input = fieldArgs.getRaw(["input", "comment"]),
    $db = context().get("db");
  sideEffect([$result, $input, $db], async ([result, input, db]) => {
    if (!result) return;
    const {
        postId
      } = input,
      commentId = result?.id;
    if (!commentId) return;
    const post = await db.query.posts.findFirst({
      where(table, {
        eq
      }) {
        return eq(table.id, postId);
      },
      with: {
        project: {
          columns: {
            organizationId: !0
          }
        }
      }
    });
    if (!post?.project) return;
    try {
      await events.emit({
        type: "backfeed.comment.created",
        data: {
          commentId,
          postId,
          projectId: post.projectId,
          organizationId: post.project.organizationId
        },
        organizationId: post.project.organizationId,
        subject: commentId
      });
    } catch (error) {
      console.error("[Events] Failed to emit comment.created:", error);
    }
  });
  return $result;
};
function applyInputToInsert(_, $object) {
  return $object;
}
function oldPlan4(_, args) {
  const $insert = pgInsertSingle(resource_project_linkPgResource);
  args.apply($insert);
  return object({
    result: $insert
  });
}
const planWrapper3 = (plan, _, fieldArgs) => {
  const $input = fieldArgs.getRaw(["input", "projectLink"]),
    $observer = context().get("observer"),
    $db = context().get("db");
  sideEffect([$input, $observer, $db], async ([input, observer, db]) => {
    if (!observer) throw Error("Unauthorized");
    let organizationId;
    {
      const projectId = input.projectId,
        project = await db.query.projects.findFirst({
          where(table, {
            eq
          }) {
            return eq(table.id, projectId);
          }
        });
      if (!project) throw Error("Project not found");
      organizationId = project.organizationId;
    }
    if (!(await checkPermission(observer.identityProviderId, "organization", organizationId, "admin"))) throw Error("Insufficient permissions");
  });
  return plan();
};
function oldPlan3(...planParams) {
  const smartPlan = (...overrideParams) => {
      const args = [...overrideParams.concat(planParams.slice(overrideParams.length))],
        $prev = oldPlan4.apply(this, args);
      if (!($prev instanceof ExecutableStep)) {
        console.error(`Wrapped a plan function at Mutation.createProjectLink, but that function did not return a step!
${String(oldPlan4)}`);
        throw Error("Wrapped a plan function, but that function did not return a step!");
      }
      args[1].autoApply($prev);
      return $prev;
    },
    [$source, fieldArgs, info] = planParams,
    $newPlan = planWrapper3(smartPlan, $source, fieldArgs, info);
  if ($newPlan === void 0) throw Error("Your plan wrapper didn't return anything; it must return a step or null!");
  if ($newPlan !== null && !isStep($newPlan)) throw Error(`Your plan wrapper returned something other than a step... It must return a step (or null). (Returned: ${inspect($newPlan)})`);
  return $newPlan;
}
const planWrapper4 = (plan, _, fieldArgs) => {
  const $result = plan(),
    $input = fieldArgs.getRaw(["input", "projectLink"]),
    $db = context().get("db");
  sideEffect([$result, $input, $db], async ([result, input, db]) => {
    if (!result) return;
    const {
        projectId
      } = input,
      linkId = result?.id;
    if (!linkId) return;
    const project = await db.query.projects.findFirst({
      where(table, {
        eq
      }) {
        return eq(table.id, projectId);
      },
      columns: {
        organizationId: !0
      }
    });
    if (!project) return;
    try {
      await events.emit({
        type: "backfeed.projectLink.created",
        data: {
          projectLinkId: linkId,
          projectId,
          organizationId: project.organizationId
        },
        organizationId: project.organizationId,
        subject: linkId
      });
    } catch (error) {
      console.error("[Events] Failed to emit projectLink.created:", error);
    }
  });
  return $result;
};
function oldPlan6(_, args) {
  const $insert = pgInsertSingle(resource_status_templatePgResource);
  args.apply($insert);
  return object({
    result: $insert
  });
}
const planWrapper5 = (plan, _, fieldArgs) => {
  const $input = fieldArgs.getRaw(["input", "statusTemplate"]),
    $observer = context().get("observer"),
    $db = context().get("db");
  sideEffect([$input, $observer, $db], async ([input, observer, db]) => {
    if (!observer) throw Error("Unauthorized");
    let organizationId;
    organizationId = input.organizationId;
    if (!(await checkPermission(observer.identityProviderId, "organization", organizationId, "admin"))) throw Error("Insufficient permissions");
  });
  return plan();
};
function oldPlan5(...planParams) {
  const smartPlan = (...overrideParams) => {
      const args = [...overrideParams.concat(planParams.slice(overrideParams.length))],
        $prev = oldPlan6.apply(this, args);
      if (!($prev instanceof ExecutableStep)) {
        console.error(`Wrapped a plan function at Mutation.createStatusTemplate, but that function did not return a step!
${String(oldPlan6)}`);
        throw Error("Wrapped a plan function, but that function did not return a step!");
      }
      args[1].autoApply($prev);
      return $prev;
    },
    [$source, fieldArgs, info] = planParams,
    $newPlan = planWrapper5(smartPlan, $source, fieldArgs, info);
  if ($newPlan === void 0) throw Error("Your plan wrapper didn't return anything; it must return a step or null!");
  if ($newPlan !== null && !isStep($newPlan)) throw Error(`Your plan wrapper returned something other than a step... It must return a step (or null). (Returned: ${inspect($newPlan)})`);
  return $newPlan;
}
const planWrapper6 = (plan, _, fieldArgs) => {
  const $result = plan(),
    $input = fieldArgs.getRaw(["input", "statusTemplate"]);
  sideEffect([$result, $input], async ([result, input]) => {
    if (!result) return;
    const {
        organizationId
      } = input,
      templateId = result?.id;
    if (!templateId) return;
    try {
      await events.emit({
        type: "backfeed.statusTemplate.created",
        data: {
          statusTemplateId: templateId,
          organizationId
        },
        organizationId,
        subject: templateId
      });
    } catch (error) {
      console.error("[Events] Failed to emit statusTemplate.created:", error);
    }
  });
  return $result;
};
function oldPlan7(_, args) {
  const $insert = pgInsertSingle(resource_votePgResource);
  args.apply($insert);
  return object({
    result: $insert
  });
}
const planWrapper7 = (plan, _, fieldArgs) => {
  const $result = plan(),
    $input = fieldArgs.getRaw(["input", "vote"]),
    $db = context().get("db");
  sideEffect([$result, $input, $db], async ([result, input, db]) => {
    if (!result) return;
    const {
        postId
      } = input,
      voteId = result?.id;
    if (!voteId) return;
    const post = await db.query.posts.findFirst({
      where(table, {
        eq
      }) {
        return eq(table.id, postId);
      },
      with: {
        project: {
          columns: {
            organizationId: !0
          }
        }
      }
    });
    if (!post?.project) return;
    try {
      await events.emit({
        type: "backfeed.vote.created",
        data: {
          voteId,
          postId,
          projectId: post.projectId,
          organizationId: post.project.organizationId
        },
        organizationId: post.project.organizationId,
        subject: voteId
      });
    } catch (error) {
      console.error("[Events] Failed to emit vote.created:", error);
    }
  });
  return $result;
};
function oldPlan8(_, args) {
  const $insert = pgInsertSingle(resource_userPgResource);
  args.apply($insert);
  return object({
    result: $insert
  });
}
const planWrapper8 = (plan, _, fieldArgs) => {
  const $userId = fieldArgs.getRaw(["input", "user"]),
    $observer = context().get("observer");
  sideEffect([$userId, $observer], async ([userId, observer]) => {
    if (!observer) throw Error("Unauthorized");
  });
  return plan();
};
function oldPlan10(_, args) {
  const $insert = pgInsertSingle(resource_project_status_configPgResource);
  args.apply($insert);
  return object({
    result: $insert
  });
}
const planWrapper9 = (plan, _, fieldArgs) => {
  const $input = fieldArgs.getRaw(["input", "projectStatusConfig"]),
    $observer = context().get("observer"),
    $db = context().get("db");
  sideEffect([$input, $observer, $db], async ([input, observer, db]) => {
    if (!observer) throw Error("Unauthorized");
    let organizationId;
    {
      const projectId = input.projectId,
        project = await db.query.projects.findFirst({
          where(table, {
            eq
          }) {
            return eq(table.id, projectId);
          }
        });
      if (!project) throw Error("Project not found");
      organizationId = project.organizationId;
    }
    if (!(await checkPermission(observer.identityProviderId, "organization", organizationId, "admin"))) throw Error("Insufficient permissions");
  });
  return plan();
};
function oldPlan9(...planParams) {
  const smartPlan = (...overrideParams) => {
      const args = [...overrideParams.concat(planParams.slice(overrideParams.length))],
        $prev = oldPlan10.apply(this, args);
      if (!($prev instanceof ExecutableStep)) {
        console.error(`Wrapped a plan function at Mutation.createProjectStatusConfig, but that function did not return a step!
${String(oldPlan10)}`);
        throw Error("Wrapped a plan function, but that function did not return a step!");
      }
      args[1].autoApply($prev);
      return $prev;
    },
    [$source, fieldArgs, info] = planParams,
    $newPlan = planWrapper9(smartPlan, $source, fieldArgs, info);
  if ($newPlan === void 0) throw Error("Your plan wrapper didn't return anything; it must return a step or null!");
  if ($newPlan !== null && !isStep($newPlan)) throw Error(`Your plan wrapper returned something other than a step... It must return a step (or null). (Returned: ${inspect($newPlan)})`);
  return $newPlan;
}
const planWrapper10 = (plan, _, fieldArgs) => {
  const $result = plan(),
    $input = fieldArgs.getRaw(["input", "projectStatusConfig"]),
    $db = context().get("db");
  sideEffect([$result, $input, $db], async ([result, input, db]) => {
    if (!result) return;
    const {
        projectId
      } = input,
      configId = result?.id;
    if (!configId) return;
    const project = await db.query.projects.findFirst({
      where(table, {
        eq
      }) {
        return eq(table.id, projectId);
      },
      columns: {
        organizationId: !0
      }
    });
    if (!project) return;
    try {
      await events.emit({
        type: "backfeed.projectStatusConfig.created",
        data: {
          projectStatusConfigId: configId,
          projectId,
          organizationId: project.organizationId
        },
        organizationId: project.organizationId,
        subject: configId
      });
    } catch (error) {
      console.error("[Events] Failed to emit projectStatusConfig.created:", error);
    }
  });
  return $result;
};
function oldPlan13(_, args) {
  const $insert = pgInsertSingle(resource_postPgResource);
  args.apply($insert);
  return object({
    result: $insert
  });
}
const planWrapper11 = (plan, _, fieldArgs) => {
  const $input = fieldArgs.getRaw(["input", "post"]),
    $observer = context().get("observer"),
    $db = context().get("db");
  sideEffect([$input, $observer, $db], async ([input, observer, db]) => {
    if (!observer) throw Error("Unauthorized");
    {
      const post = input,
        project = await db.query.projects.findFirst({
          where(table, {
            eq
          }) {
            return eq(table.id, post.projectId);
          }
        });
      if (!project) throw Error("Project not found");
      const posts = await db.query.posts.findMany({
          where(table, {
            eq
          }) {
            return eq(table.projectId, post.projectId);
          },
          columns: {
            userId: !0
          }
        }),
        uniqueUsers = [...new Set(posts.map(p => p.userId))],
        currentUniqueCount = uniqueUsers.includes(observer.id) ? uniqueUsers.length : uniqueUsers.length + 1;
      if (!(await isWithinLimit({
        organizationId: project.organizationId
      }, FEATURE_KEYS.MAX_FEEDBACK_USERS, currentUniqueCount - 1, billingBypassOrgIds)) && !uniqueUsers.includes(observer.id)) throw Error("Maximum number of unique users providing feedback has been reached");
    }
  });
  return plan();
};
function oldPlan12(...planParams) {
  const smartPlan = (...overrideParams) => {
      const args = [...overrideParams.concat(planParams.slice(overrideParams.length))],
        $prev = oldPlan13.apply(this, args);
      if (!($prev instanceof ExecutableStep)) {
        console.error(`Wrapped a plan function at Mutation.createPost, but that function did not return a step!
${String(oldPlan13)}`);
        throw Error("Wrapped a plan function, but that function did not return a step!");
      }
      args[1].autoApply($prev);
      return $prev;
    },
    [$source, fieldArgs, info] = planParams,
    $newPlan = planWrapper11(smartPlan, $source, fieldArgs, info);
  if ($newPlan === void 0) throw Error("Your plan wrapper didn't return anything; it must return a step or null!");
  if ($newPlan !== null && !isStep($newPlan)) throw Error(`Your plan wrapper returned something other than a step... It must return a step (or null). (Returned: ${inspect($newPlan)})`);
  return $newPlan;
}
const planWrapper12 = (plan, _, fieldArgs) => {
  const $result = plan(),
    $input = fieldArgs.getRaw(["input", "post"]),
    $db = context().get("db");
  sideEffect([$result, $input, $db], async ([result, input, db]) => {
    if (!result) return;
    const {
        projectId
      } = input,
      postId = result?.id;
    if (!postId) return;
    const project = await db.query.projects.findFirst({
      where(table, {
        eq
      }) {
        return eq(table.id, projectId);
      },
      columns: {
        organizationId: !0
      }
    });
    if (!project) return;
    try {
      await events.emit({
        type: "backfeed.post.created",
        data: {
          postId,
          projectId,
          organizationId: project.organizationId
        },
        organizationId: project.organizationId,
        subject: postId
      });
    } catch (error) {
      console.error("[Events] Failed to emit post.created:", error);
    }
  });
  return $result;
};
function oldPlan11(...planParams) {
  const smartPlan = (...overrideParams) => {
      const args = [...overrideParams.concat(planParams.slice(overrideParams.length))],
        $prev = oldPlan12.apply(this, args);
      if (!($prev instanceof ExecutableStep)) {
        console.error(`Wrapped a plan function at Mutation.createPost, but that function did not return a step!
${String(oldPlan12)}`);
        throw Error("Wrapped a plan function, but that function did not return a step!");
      }
      args[1].autoApply($prev);
      return $prev;
    },
    [$source, fieldArgs, info] = planParams,
    $newPlan = planWrapper12(smartPlan, $source, fieldArgs, info);
  if ($newPlan === void 0) throw Error("Your plan wrapper didn't return anything; it must return a step or null!");
  if ($newPlan !== null && !isStep($newPlan)) throw Error(`Your plan wrapper returned something other than a step... It must return a step (or null). (Returned: ${inspect($newPlan)})`);
  return $newPlan;
}
const planWrapper13 = (plan, $record) => {
  if (!false) return plan();
  const $db = context().get("db");
  sideEffect([$record, $db], async ([record, db]) => {
    if (!record?.id) return;
    const post = await db.query.posts.findFirst({
      where(table, {
        eq
      }) {
        return eq(table.id, record.id);
      },
      with: {
        project: !0
      }
    });
    if (post?.project) await indexPost(post, post.project.organizationId);
  });
  return plan();
};
function oldPlan18(_, args) {
  const $insert = pgInsertSingle(resource_projectPgResource);
  args.apply($insert);
  return object({
    result: $insert
  });
}
const planWrapper14 = (plan, _, fieldArgs) => {
  const $input = fieldArgs.getRaw(["input", "project"]),
    $observer = context().get("observer"),
    $db = context().get("db");
  sideEffect([$input, $observer, $db], async ([input, observer, db]) => {
    if (!observer) throw Error("Unauthorized");
    let organizationId;
    organizationId = input.organizationId;
    if (!(await checkPermission(observer.identityProviderId, "organization", organizationId, "admin"))) throw Error("Insufficient permissions");
    {
      const projectCount = await db.query.projects.findMany({
        where(table, {
          eq
        }) {
          return eq(table.organizationId, organizationId);
        }
      });
      if (!(await isWithinLimit({
        organizationId
      }, FEATURE_KEYS.MAX_PROJECTS, projectCount.length, billingBypassOrgIds))) throw Error("Maximum number of projects reached.");
    }
  });
  return plan();
};
function oldPlan17(...planParams) {
  const smartPlan = (...overrideParams) => {
      const args = [...overrideParams.concat(planParams.slice(overrideParams.length))],
        $prev = oldPlan18.apply(this, args);
      if (!($prev instanceof ExecutableStep)) {
        console.error(`Wrapped a plan function at Mutation.createProject, but that function did not return a step!
${String(oldPlan18)}`);
        throw Error("Wrapped a plan function, but that function did not return a step!");
      }
      args[1].autoApply($prev);
      return $prev;
    },
    [$source, fieldArgs, info] = planParams,
    $newPlan = planWrapper14(smartPlan, $source, fieldArgs, info);
  if ($newPlan === void 0) throw Error("Your plan wrapper didn't return anything; it must return a step or null!");
  if ($newPlan !== null && !isStep($newPlan)) throw Error(`Your plan wrapper returned something other than a step... It must return a step (or null). (Returned: ${inspect($newPlan)})`);
  return $newPlan;
}
const planWrapper15 = (plan, _, fieldArgs) => {
  const $result = plan(),
    $input = fieldArgs.getRaw(["input", "project"]);
  sideEffect([$result, $input], async ([result, input]) => {
    if (!result) return;
    if (!isAuthzEnabled()) return;
    const {
        organizationId
      } = input,
      projectId = result?.id;
    if (!projectId) {
      console.error("[AuthZ Sync] Project ID not found in result");
      return;
    }
    try {
      await writeTuples([{
        user: `organization:${organizationId}`,
        relation: "organization",
        object: `project:${projectId}`
      }]);
    } catch (error) {
      console.error("[AuthZ Sync] Failed to sync project creation:", error);
    }
  });
  return $result;
};
function oldPlan16(...planParams) {
  const smartPlan = (...overrideParams) => {
      const args = [...overrideParams.concat(planParams.slice(overrideParams.length))],
        $prev = oldPlan17.apply(this, args);
      if (!($prev instanceof ExecutableStep)) {
        console.error(`Wrapped a plan function at Mutation.createProject, but that function did not return a step!
${String(oldPlan17)}`);
        throw Error("Wrapped a plan function, but that function did not return a step!");
      }
      args[1].autoApply($prev);
      return $prev;
    },
    [$source, fieldArgs, info] = planParams,
    $newPlan = planWrapper15(smartPlan, $source, fieldArgs, info);
  if ($newPlan === void 0) throw Error("Your plan wrapper didn't return anything; it must return a step or null!");
  if ($newPlan !== null && !isStep($newPlan)) throw Error(`Your plan wrapper returned something other than a step... It must return a step (or null). (Returned: ${inspect($newPlan)})`);
  return $newPlan;
}
const planWrapper16 = (plan, _, fieldArgs) => {
  const $result = plan(),
    $input = fieldArgs.getRaw(["input", "project"]);
  sideEffect([$result, $input], async ([result, input]) => {
    if (!result) return;
    const {
        organizationId
      } = input,
      projectId = result?.id;
    if (!projectId) return;
    try {
      await events.emit({
        type: "backfeed.project.created",
        data: {
          projectId,
          organizationId
        },
        organizationId,
        subject: projectId
      });
    } catch (error) {
      console.error("[Events] Failed to emit project.created:", error);
    }
  });
  return $result;
};
function oldPlan15(...planParams) {
  const smartPlan = (...overrideParams) => {
      const args = [...overrideParams.concat(planParams.slice(overrideParams.length))],
        $prev = oldPlan16.apply(this, args);
      if (!($prev instanceof ExecutableStep)) {
        console.error(`Wrapped a plan function at Mutation.createProject, but that function did not return a step!
${String(oldPlan16)}`);
        throw Error("Wrapped a plan function, but that function did not return a step!");
      }
      args[1].autoApply($prev);
      return $prev;
    },
    [$source, fieldArgs, info] = planParams,
    $newPlan = planWrapper16(smartPlan, $source, fieldArgs, info);
  if ($newPlan === void 0) throw Error("Your plan wrapper didn't return anything; it must return a step or null!");
  if ($newPlan !== null && !isStep($newPlan)) throw Error(`Your plan wrapper returned something other than a step... It must return a step (or null). (Returned: ${inspect($newPlan)})`);
  return $newPlan;
}
const DEFAULT_STATUS_TEMPLATES = [{
  name: "open",
  displayName: "Open",
  color: "#3b82f6",
  description: "New and awaiting review",
  sortOrder: 0
}, {
  name: "under_review",
  displayName: "Under Review",
  color: "#f59e0b",
  description: "Being evaluated by the team",
  sortOrder: 1
}, {
  name: "planned",
  displayName: "Planned",
  color: "#8b5cf6",
  description: "Scheduled for implementation",
  sortOrder: 2
}, {
  name: "in_progress",
  displayName: "In Progress",
  color: "#10b981",
  description: "Currently being worked on",
  sortOrder: 3
}, {
  name: "completed",
  displayName: "Completed",
  color: "#22c55e",
  description: "Done",
  sortOrder: 4
}, {
  name: "closed",
  displayName: "Closed",
  color: "#6b7280",
  description: "Will not be implemented",
  sortOrder: 5
}];
const planWrapper17 = (plan, _, fieldArgs) => {
  const $result = plan(),
    $input = fieldArgs.getRaw(["input", "project"]),
    $db = context().get("db");
  sideEffect([$result, $input, $db], async ([result, input, db]) => {
    if (!result) return;
    const {
      organizationId
    } = input;
    if (!organizationId) {
      console.error("[Default Status Templates] Organization ID not found in input");
      return;
    }
    try {
      const values = DEFAULT_STATUS_TEMPLATES.map(template => ({
        ...template,
        organizationId
      }));
      await db.insert(statusTemplates).values(values).onConflictDoNothing({
        target: [statusTemplates.organizationId, statusTemplates.name]
      });
    } catch (error) {
      console.error("[Default Status Templates] Failed to seed templates:", error);
    }
  });
  return $result;
};
function oldPlan14(...planParams) {
  const smartPlan = (...overrideParams) => {
      const args = [...overrideParams.concat(planParams.slice(overrideParams.length))],
        $prev = oldPlan15.apply(this, args);
      if (!($prev instanceof ExecutableStep)) {
        console.error(`Wrapped a plan function at Mutation.createProject, but that function did not return a step!
${String(oldPlan15)}`);
        throw Error("Wrapped a plan function, but that function did not return a step!");
      }
      args[1].autoApply($prev);
      return $prev;
    },
    [$source, fieldArgs, info] = planParams,
    $newPlan = planWrapper17(smartPlan, $source, fieldArgs, info);
  if ($newPlan === void 0) throw Error("Your plan wrapper didn't return anything; it must return a step or null!");
  if ($newPlan !== null && !isStep($newPlan)) throw Error(`Your plan wrapper returned something other than a step... It must return a step (or null). (Returned: ${inspect($newPlan)})`);
  return $newPlan;
}
const planWrapper18 = (plan, $record) => {
  if (!false) return plan();
  const $db = context().get("db");
  sideEffect([$record, $db], async ([record, db]) => {
    if (!record?.id) return;
    const project = await db.query.projects.findFirst({
      where(table, {
        eq
      }) {
        return eq(table.id, record.id);
      }
    });
    if (project) await indexProject(project);
  });
  return plan();
};
const oldPlan20 = (_$root, args) => {
  const $update = pgUpdateSingle(resource_commentPgResource, {
    id: args.getRaw(['input', "rowId"])
  });
  args.apply($update);
  return object({
    result: $update
  });
};
const planWrapper19 = (plan, _, fieldArgs) => {
  const $input = fieldArgs.getRaw(["input", "rowId"]),
    $observer = context().get("observer"),
    $db = context().get("db");
  sideEffect([$input, $observer, $db], async ([input, observer, db]) => {
    if (!observer) throw Error("Unauthorized");
    {
      const comment = await db.query.comments.findFirst({
        where(table, {
          eq
        }) {
          return eq(table.id, input);
        },
        with: {
          post: {
            with: {
              project: !0
            }
          }
        }
      });
      if (!comment) throw Error("Comment not found");
      if (comment.userId !== observer.id) {
        if (!(await checkPermission(observer.identityProviderId, "organization", comment.post.project.organizationId, "admin"))) throw Error("Unauthorized");
      }
    }
  });
  return plan();
};
function oldPlan19(...planParams) {
  const smartPlan = (...overrideParams) => {
      const args = [...overrideParams.concat(planParams.slice(overrideParams.length))],
        $prev = oldPlan20.apply(this, args);
      if (!($prev instanceof ExecutableStep)) {
        console.error(`Wrapped a plan function at Mutation.updateComment, but that function did not return a step!
${String(oldPlan20)}`);
        throw Error("Wrapped a plan function, but that function did not return a step!");
      }
      args[1].autoApply($prev);
      return $prev;
    },
    [$source, fieldArgs, info] = planParams,
    $newPlan = planWrapper19(smartPlan, $source, fieldArgs, info);
  if ($newPlan === void 0) throw Error("Your plan wrapper didn't return anything; it must return a step or null!");
  if ($newPlan !== null && !isStep($newPlan)) throw Error(`Your plan wrapper returned something other than a step... It must return a step (or null). (Returned: ${inspect($newPlan)})`);
  return $newPlan;
}
const planWrapper20 = (plan, _, fieldArgs) => {
  const $result = plan(),
    $commentId = fieldArgs.getRaw(["input", "rowId"]),
    $db = context().get("db");
  sideEffect([$result, $commentId, $db], async ([result, commentId, db]) => {
    if (!result) return;
    const comment = await db.query.comments.findFirst({
      where(table, {
        eq
      }) {
        return eq(table.id, commentId);
      },
      with: {
        post: {
          with: {
            project: {
              columns: {
                organizationId: !0
              }
            }
          }
        }
      }
    });
    if (!comment?.post?.project) return;
    try {
      await events.emit({
        type: "backfeed.comment.updated",
        data: {
          commentId,
          postId: comment.postId,
          projectId: comment.post.projectId,
          organizationId: comment.post.project.organizationId
        },
        organizationId: comment.post.project.organizationId,
        subject: commentId
      });
    } catch (error) {
      console.error("[Events] Failed to emit comment.updated:", error);
    }
  });
  return $result;
};
function applyInputToUpdateOrDelete(_, $object) {
  return $object;
}
const oldPlan22 = (_$root, args) => {
  const $update = pgUpdateSingle(resource_project_linkPgResource, {
    id: args.getRaw(['input', "rowId"])
  });
  args.apply($update);
  return object({
    result: $update
  });
};
const planWrapper21 = (plan, _, fieldArgs) => {
  const $input = fieldArgs.getRaw(["input", "rowId"]),
    $observer = context().get("observer"),
    $db = context().get("db");
  sideEffect([$input, $observer, $db], async ([input, observer, db]) => {
    if (!observer) throw Error("Unauthorized");
    let organizationId;
    {
      const link = await db.query.projectLinks.findFirst({
        where(table, {
          eq
        }) {
          return eq(table.id, input);
        },
        with: {
          project: !0
        }
      });
      if (!link) throw Error("Project link not found");
      organizationId = link.project.organizationId;
    }
    if (!(await checkPermission(observer.identityProviderId, "organization", organizationId, "admin"))) throw Error("Insufficient permissions");
  });
  return plan();
};
function oldPlan21(...planParams) {
  const smartPlan = (...overrideParams) => {
      const args = [...overrideParams.concat(planParams.slice(overrideParams.length))],
        $prev = oldPlan22.apply(this, args);
      if (!($prev instanceof ExecutableStep)) {
        console.error(`Wrapped a plan function at Mutation.updateProjectLink, but that function did not return a step!
${String(oldPlan22)}`);
        throw Error("Wrapped a plan function, but that function did not return a step!");
      }
      args[1].autoApply($prev);
      return $prev;
    },
    [$source, fieldArgs, info] = planParams,
    $newPlan = planWrapper21(smartPlan, $source, fieldArgs, info);
  if ($newPlan === void 0) throw Error("Your plan wrapper didn't return anything; it must return a step or null!");
  if ($newPlan !== null && !isStep($newPlan)) throw Error(`Your plan wrapper returned something other than a step... It must return a step (or null). (Returned: ${inspect($newPlan)})`);
  return $newPlan;
}
const planWrapper22 = (plan, _, fieldArgs) => {
  const $result = plan(),
    $linkId = fieldArgs.getRaw(["input", "rowId"]),
    $db = context().get("db");
  sideEffect([$result, $linkId, $db], async ([result, linkId, db]) => {
    if (!result) return;
    const link = await db.query.projectLinks.findFirst({
      where(table, {
        eq
      }) {
        return eq(table.id, linkId);
      },
      with: {
        project: {
          columns: {
            organizationId: !0
          }
        }
      }
    });
    if (!link?.project) return;
    try {
      await events.emit({
        type: "backfeed.projectLink.updated",
        data: {
          projectLinkId: linkId,
          projectId: link.projectId,
          organizationId: link.project.organizationId
        },
        organizationId: link.project.organizationId,
        subject: linkId
      });
    } catch (error) {
      console.error("[Events] Failed to emit projectLink.updated:", error);
    }
  });
  return $result;
};
const oldPlan24 = (_$root, args) => {
  const $update = pgUpdateSingle(resource_status_templatePgResource, {
    id: args.getRaw(['input', "rowId"])
  });
  args.apply($update);
  return object({
    result: $update
  });
};
const planWrapper23 = (plan, _, fieldArgs) => {
  const $input = fieldArgs.getRaw(["input", "rowId"]),
    $observer = context().get("observer"),
    $db = context().get("db");
  sideEffect([$input, $observer, $db], async ([input, observer, db]) => {
    if (!observer) throw Error("Unauthorized");
    let organizationId;
    {
      const statusTemplate = await db.query.statusTemplates.findFirst({
        where(table, {
          eq
        }) {
          return eq(table.id, input);
        }
      });
      if (!statusTemplate) throw Error("Status template not found");
      organizationId = statusTemplate.organizationId;
    }
    if (!(await checkPermission(observer.identityProviderId, "organization", organizationId, "admin"))) throw Error("Insufficient permissions");
  });
  return plan();
};
function oldPlan23(...planParams) {
  const smartPlan = (...overrideParams) => {
      const args = [...overrideParams.concat(planParams.slice(overrideParams.length))],
        $prev = oldPlan24.apply(this, args);
      if (!($prev instanceof ExecutableStep)) {
        console.error(`Wrapped a plan function at Mutation.updateStatusTemplate, but that function did not return a step!
${String(oldPlan24)}`);
        throw Error("Wrapped a plan function, but that function did not return a step!");
      }
      args[1].autoApply($prev);
      return $prev;
    },
    [$source, fieldArgs, info] = planParams,
    $newPlan = planWrapper23(smartPlan, $source, fieldArgs, info);
  if ($newPlan === void 0) throw Error("Your plan wrapper didn't return anything; it must return a step or null!");
  if ($newPlan !== null && !isStep($newPlan)) throw Error(`Your plan wrapper returned something other than a step... It must return a step (or null). (Returned: ${inspect($newPlan)})`);
  return $newPlan;
}
const planWrapper24 = (plan, _, fieldArgs) => {
  const $result = plan(),
    $templateId = fieldArgs.getRaw(["input", "rowId"]),
    $db = context().get("db");
  sideEffect([$result, $templateId, $db], async ([result, templateId, db]) => {
    if (!result) return;
    const template = await db.query.statusTemplates.findFirst({
      where(table, {
        eq
      }) {
        return eq(table.id, templateId);
      },
      columns: {
        organizationId: !0
      }
    });
    if (!template) return;
    try {
      await events.emit({
        type: "backfeed.statusTemplate.updated",
        data: {
          statusTemplateId: templateId,
          organizationId: template.organizationId
        },
        organizationId: template.organizationId,
        subject: templateId
      });
    } catch (error) {
      console.error("[Events] Failed to emit statusTemplate.updated:", error);
    }
  });
  return $result;
};
const oldPlan26 = (_$root, args) => {
  const $update = pgUpdateSingle(resource_votePgResource, {
    id: args.getRaw(['input', "rowId"])
  });
  args.apply($update);
  return object({
    result: $update
  });
};
const planWrapper25 = (plan, _, fieldArgs) => {
  const $input = fieldArgs.getRaw(["input", "rowId"]),
    $observer = context().get("observer"),
    $db = context().get("db");
  sideEffect([$input, $observer, $db], async ([input, observer, db]) => {
    if (!observer) throw Error("Unauthorized");
    const vote = await db.query.votes.findFirst({
      where(table, {
        eq
      }) {
        return eq(table.id, input);
      }
    });
    if (observer.id !== vote?.userId) throw Error("Unauthorized");
  });
  return plan();
};
function oldPlan25(...planParams) {
  const smartPlan = (...overrideParams) => {
      const args = [...overrideParams.concat(planParams.slice(overrideParams.length))],
        $prev = oldPlan26.apply(this, args);
      if (!($prev instanceof ExecutableStep)) {
        console.error(`Wrapped a plan function at Mutation.updateVote, but that function did not return a step!
${String(oldPlan26)}`);
        throw Error("Wrapped a plan function, but that function did not return a step!");
      }
      args[1].autoApply($prev);
      return $prev;
    },
    [$source, fieldArgs, info] = planParams,
    $newPlan = planWrapper25(smartPlan, $source, fieldArgs, info);
  if ($newPlan === void 0) throw Error("Your plan wrapper didn't return anything; it must return a step or null!");
  if ($newPlan !== null && !isStep($newPlan)) throw Error(`Your plan wrapper returned something other than a step... It must return a step (or null). (Returned: ${inspect($newPlan)})`);
  return $newPlan;
}
const planWrapper26 = (plan, _, fieldArgs) => {
  const $result = plan(),
    $voteId = fieldArgs.getRaw(["input", "rowId"]),
    $db = context().get("db");
  sideEffect([$result, $voteId, $db], async ([result, voteId, db]) => {
    if (!result) return;
    const vote = await db.query.votes.findFirst({
      where(table, {
        eq
      }) {
        return eq(table.id, voteId);
      },
      with: {
        post: {
          with: {
            project: {
              columns: {
                organizationId: !0
              }
            }
          }
        }
      }
    });
    if (!vote?.post?.project) return;
    try {
      await events.emit({
        type: "backfeed.vote.updated",
        data: {
          voteId,
          postId: vote.postId,
          projectId: vote.post.projectId,
          organizationId: vote.post.project.organizationId
        },
        organizationId: vote.post.project.organizationId,
        subject: voteId
      });
    } catch (error) {
      console.error("[Events] Failed to emit vote.updated:", error);
    }
  });
  return $result;
};
const oldPlan27 = (_$root, args) => {
  const $update = pgUpdateSingle(resource_userPgResource, {
    id: args.getRaw(['input', "rowId"])
  });
  args.apply($update);
  return object({
    result: $update
  });
};
const planWrapper27 = (plan, _, fieldArgs) => {
  const $userId = fieldArgs.getRaw(["input", "rowId"]),
    $observer = context().get("observer");
  sideEffect([$userId, $observer], async ([userId, observer]) => {
    if (!observer) throw Error("Unauthorized");
    if (userId !== observer.id) throw Error("Insufficient permissions");
  });
  return plan();
};
const oldPlan29 = (_$root, args) => {
  const $update = pgUpdateSingle(resource_project_status_configPgResource, {
    id: args.getRaw(['input', "rowId"])
  });
  args.apply($update);
  return object({
    result: $update
  });
};
const planWrapper28 = (plan, _, fieldArgs) => {
  const $input = fieldArgs.getRaw(["input", "rowId"]),
    $observer = context().get("observer"),
    $db = context().get("db");
  sideEffect([$input, $observer, $db], async ([input, observer, db]) => {
    if (!observer) throw Error("Unauthorized");
    let organizationId;
    {
      const config = await db.query.projectStatusConfigs.findFirst({
        where(table, {
          eq
        }) {
          return eq(table.id, input);
        },
        with: {
          project: !0
        }
      });
      if (!config) throw Error("Project status config not found");
      organizationId = config.project.organizationId;
    }
    if (!(await checkPermission(observer.identityProviderId, "organization", organizationId, "admin"))) throw Error("Insufficient permissions");
  });
  return plan();
};
function oldPlan28(...planParams) {
  const smartPlan = (...overrideParams) => {
      const args = [...overrideParams.concat(planParams.slice(overrideParams.length))],
        $prev = oldPlan29.apply(this, args);
      if (!($prev instanceof ExecutableStep)) {
        console.error(`Wrapped a plan function at Mutation.updateProjectStatusConfig, but that function did not return a step!
${String(oldPlan29)}`);
        throw Error("Wrapped a plan function, but that function did not return a step!");
      }
      args[1].autoApply($prev);
      return $prev;
    },
    [$source, fieldArgs, info] = planParams,
    $newPlan = planWrapper28(smartPlan, $source, fieldArgs, info);
  if ($newPlan === void 0) throw Error("Your plan wrapper didn't return anything; it must return a step or null!");
  if ($newPlan !== null && !isStep($newPlan)) throw Error(`Your plan wrapper returned something other than a step... It must return a step (or null). (Returned: ${inspect($newPlan)})`);
  return $newPlan;
}
const planWrapper29 = (plan, _, fieldArgs) => {
  const $result = plan(),
    $configId = fieldArgs.getRaw(["input", "rowId"]),
    $db = context().get("db");
  sideEffect([$result, $configId, $db], async ([result, configId, db]) => {
    if (!result) return;
    const config = await db.query.projectStatusConfigs.findFirst({
      where(table, {
        eq
      }) {
        return eq(table.id, configId);
      },
      with: {
        project: {
          columns: {
            organizationId: !0
          }
        }
      }
    });
    if (!config?.project) return;
    try {
      await events.emit({
        type: "backfeed.projectStatusConfig.updated",
        data: {
          projectStatusConfigId: configId,
          projectId: config.projectId,
          organizationId: config.project.organizationId
        },
        organizationId: config.project.organizationId,
        subject: configId
      });
    } catch (error) {
      console.error("[Events] Failed to emit projectStatusConfig.updated:", error);
    }
  });
  return $result;
};
const oldPlan32 = (_$root, args) => {
  const $update = pgUpdateSingle(resource_postPgResource, {
    id: args.getRaw(['input', "rowId"])
  });
  args.apply($update);
  return object({
    result: $update
  });
};
const planWrapper30 = (plan, _, fieldArgs) => {
  const $input = fieldArgs.getRaw(["input", "rowId"]),
    $observer = context().get("observer"),
    $db = context().get("db");
  sideEffect([$input, $observer, $db], async ([input, observer, db]) => {
    if (!observer) throw Error("Unauthorized");
    {
      const post = await db.query.posts.findFirst({
        where(table, {
          eq
        }) {
          return eq(table.id, input);
        },
        with: {
          project: !0
        }
      });
      if (!post) throw Error("Post not found");
      if (observer.id !== post.userId) {
        if (!(await checkPermission(observer.identityProviderId, "organization", post.project.organizationId, "admin"))) throw Error("Insufficient permissions");
      }
    }
  });
  return plan();
};
function oldPlan31(...planParams) {
  const smartPlan = (...overrideParams) => {
      const args = [...overrideParams.concat(planParams.slice(overrideParams.length))],
        $prev = oldPlan32.apply(this, args);
      if (!($prev instanceof ExecutableStep)) {
        console.error(`Wrapped a plan function at Mutation.updatePost, but that function did not return a step!
${String(oldPlan32)}`);
        throw Error("Wrapped a plan function, but that function did not return a step!");
      }
      args[1].autoApply($prev);
      return $prev;
    },
    [$source, fieldArgs, info] = planParams,
    $newPlan = planWrapper30(smartPlan, $source, fieldArgs, info);
  if ($newPlan === void 0) throw Error("Your plan wrapper didn't return anything; it must return a step or null!");
  if ($newPlan !== null && !isStep($newPlan)) throw Error(`Your plan wrapper returned something other than a step... It must return a step (or null). (Returned: ${inspect($newPlan)})`);
  return $newPlan;
}
const planWrapper31 = (plan, _, fieldArgs) => {
  const $result = plan(),
    $postId = fieldArgs.getRaw(["input", "rowId"]),
    $db = context().get("db");
  sideEffect([$result, $postId, $db], async ([result, postId, db]) => {
    if (!result) return;
    const post = await db.query.posts.findFirst({
      where(table, {
        eq
      }) {
        return eq(table.id, postId);
      },
      with: {
        project: {
          columns: {
            organizationId: !0
          }
        }
      }
    });
    if (!post?.project) return;
    try {
      await events.emit({
        type: "backfeed.post.updated",
        data: {
          postId,
          projectId: post.projectId,
          organizationId: post.project.organizationId
        },
        organizationId: post.project.organizationId,
        subject: postId
      });
    } catch (error) {
      console.error("[Events] Failed to emit post.updated:", error);
    }
  });
  return $result;
};
function oldPlan30(...planParams) {
  const smartPlan = (...overrideParams) => {
      const args = [...overrideParams.concat(planParams.slice(overrideParams.length))],
        $prev = oldPlan31.apply(this, args);
      if (!($prev instanceof ExecutableStep)) {
        console.error(`Wrapped a plan function at Mutation.updatePost, but that function did not return a step!
${String(oldPlan31)}`);
        throw Error("Wrapped a plan function, but that function did not return a step!");
      }
      args[1].autoApply($prev);
      return $prev;
    },
    [$source, fieldArgs, info] = planParams,
    $newPlan = planWrapper31(smartPlan, $source, fieldArgs, info);
  if ($newPlan === void 0) throw Error("Your plan wrapper didn't return anything; it must return a step or null!");
  if ($newPlan !== null && !isStep($newPlan)) throw Error(`Your plan wrapper returned something other than a step... It must return a step (or null). (Returned: ${inspect($newPlan)})`);
  return $newPlan;
}
const oldPlan35 = (_$root, args) => {
  const $update = pgUpdateSingle(resource_projectPgResource, {
    id: args.getRaw(['input', "rowId"])
  });
  args.apply($update);
  return object({
    result: $update
  });
};
const planWrapper33 = (plan, _, fieldArgs) => {
  const $input = fieldArgs.getRaw(["input", "rowId"]),
    $observer = context().get("observer"),
    $db = context().get("db");
  sideEffect([$input, $observer, $db], async ([input, observer, db]) => {
    if (!observer) throw Error("Unauthorized");
    let organizationId;
    {
      const project = await db.query.projects.findFirst({
        where(table, {
          eq
        }) {
          return eq(table.id, input);
        }
      });
      if (!project) throw Error("Project not found");
      organizationId = project.organizationId;
    }
    if (!(await checkPermission(observer.identityProviderId, "organization", organizationId, "admin"))) throw Error("Insufficient permissions");
  });
  return plan();
};
function oldPlan34(...planParams) {
  const smartPlan = (...overrideParams) => {
      const args = [...overrideParams.concat(planParams.slice(overrideParams.length))],
        $prev = oldPlan35.apply(this, args);
      if (!($prev instanceof ExecutableStep)) {
        console.error(`Wrapped a plan function at Mutation.updateProject, but that function did not return a step!
${String(oldPlan35)}`);
        throw Error("Wrapped a plan function, but that function did not return a step!");
      }
      args[1].autoApply($prev);
      return $prev;
    },
    [$source, fieldArgs, info] = planParams,
    $newPlan = planWrapper33(smartPlan, $source, fieldArgs, info);
  if ($newPlan === void 0) throw Error("Your plan wrapper didn't return anything; it must return a step or null!");
  if ($newPlan !== null && !isStep($newPlan)) throw Error(`Your plan wrapper returned something other than a step... It must return a step (or null). (Returned: ${inspect($newPlan)})`);
  return $newPlan;
}
const planWrapper34 = (plan, _, fieldArgs) => {
  const $result = plan(),
    $projectId = fieldArgs.getRaw(["input", "rowId"]),
    $db = context().get("db");
  sideEffect([$result, $projectId, $db], async ([result, projectId, db]) => {
    if (!result) return;
    const project = await db.query.projects.findFirst({
      where(table, {
        eq
      }) {
        return eq(table.id, projectId);
      },
      columns: {
        organizationId: !0
      }
    });
    if (!project) return;
    try {
      await events.emit({
        type: "backfeed.project.updated",
        data: {
          projectId,
          organizationId: project.organizationId
        },
        organizationId: project.organizationId,
        subject: projectId
      });
    } catch (error) {
      console.error("[Events] Failed to emit project.updated:", error);
    }
  });
  return $result;
};
function oldPlan33(...planParams) {
  const smartPlan = (...overrideParams) => {
      const args = [...overrideParams.concat(planParams.slice(overrideParams.length))],
        $prev = oldPlan34.apply(this, args);
      if (!($prev instanceof ExecutableStep)) {
        console.error(`Wrapped a plan function at Mutation.updateProject, but that function did not return a step!
${String(oldPlan34)}`);
        throw Error("Wrapped a plan function, but that function did not return a step!");
      }
      args[1].autoApply($prev);
      return $prev;
    },
    [$source, fieldArgs, info] = planParams,
    $newPlan = planWrapper34(smartPlan, $source, fieldArgs, info);
  if ($newPlan === void 0) throw Error("Your plan wrapper didn't return anything; it must return a step or null!");
  if ($newPlan !== null && !isStep($newPlan)) throw Error(`Your plan wrapper returned something other than a step... It must return a step (or null). (Returned: ${inspect($newPlan)})`);
  return $newPlan;
}
const oldPlan37 = (_$root, args) => {
  const $delete = pgDeleteSingle(resource_commentPgResource, {
    id: args.getRaw(['input', "rowId"])
  });
  args.apply($delete);
  return object({
    result: $delete
  });
};
const planWrapper36 = (plan, _, fieldArgs) => {
  const $input = fieldArgs.getRaw(["input", "rowId"]),
    $observer = context().get("observer"),
    $db = context().get("db");
  sideEffect([$input, $observer, $db], async ([input, observer, db]) => {
    if (!observer) throw Error("Unauthorized");
    {
      const comment = await db.query.comments.findFirst({
        where(table, {
          eq
        }) {
          return eq(table.id, input);
        },
        with: {
          post: {
            with: {
              project: !0
            }
          }
        }
      });
      if (!comment) throw Error("Comment not found");
      if (comment.userId !== observer.id) {
        if (!(await checkPermission(observer.identityProviderId, "organization", comment.post.project.organizationId, "admin"))) throw Error("Unauthorized");
      }
    }
  });
  return plan();
};
function oldPlan36(...planParams) {
  const smartPlan = (...overrideParams) => {
      const args = [...overrideParams.concat(planParams.slice(overrideParams.length))],
        $prev = oldPlan37.apply(this, args);
      if (!($prev instanceof ExecutableStep)) {
        console.error(`Wrapped a plan function at Mutation.deleteComment, but that function did not return a step!
${String(oldPlan37)}`);
        throw Error("Wrapped a plan function, but that function did not return a step!");
      }
      args[1].autoApply($prev);
      return $prev;
    },
    [$source, fieldArgs, info] = planParams,
    $newPlan = planWrapper36(smartPlan, $source, fieldArgs, info);
  if ($newPlan === void 0) throw Error("Your plan wrapper didn't return anything; it must return a step or null!");
  if ($newPlan !== null && !isStep($newPlan)) throw Error(`Your plan wrapper returned something other than a step... It must return a step (or null). (Returned: ${inspect($newPlan)})`);
  return $newPlan;
}
const planWrapper37 = (plan, _, fieldArgs) => {
  const $result = plan(),
    $commentId = fieldArgs.getRaw(["input", "rowId"]),
    $db = context().get("db");
  sideEffect([$result, $commentId, $db], async ([result, commentId, db]) => {
    if (!result) return;
    const comment = await db.query.comments.findFirst({
      where(table, {
        eq
      }) {
        return eq(table.id, commentId);
      },
      with: {
        post: {
          with: {
            project: {
              columns: {
                organizationId: !0
              }
            }
          }
        }
      }
    });
    if (!comment?.post?.project) return;
    try {
      await events.emit({
        type: "backfeed.comment.deleted",
        data: {
          commentId,
          postId: comment.postId,
          projectId: comment.post.projectId,
          organizationId: comment.post.project.organizationId
        },
        organizationId: comment.post.project.organizationId,
        subject: commentId
      });
    } catch (error) {
      console.error("[Events] Failed to emit comment.deleted:", error);
    }
  });
  return $result;
};
const oldPlan39 = (_$root, args) => {
  const $delete = pgDeleteSingle(resource_project_linkPgResource, {
    id: args.getRaw(['input', "rowId"])
  });
  args.apply($delete);
  return object({
    result: $delete
  });
};
const planWrapper38 = (plan, _, fieldArgs) => {
  const $input = fieldArgs.getRaw(["input", "rowId"]),
    $observer = context().get("observer"),
    $db = context().get("db");
  sideEffect([$input, $observer, $db], async ([input, observer, db]) => {
    if (!observer) throw Error("Unauthorized");
    let organizationId;
    {
      const link = await db.query.projectLinks.findFirst({
        where(table, {
          eq
        }) {
          return eq(table.id, input);
        },
        with: {
          project: !0
        }
      });
      if (!link) throw Error("Project link not found");
      organizationId = link.project.organizationId;
    }
    if (!(await checkPermission(observer.identityProviderId, "organization", organizationId, "admin"))) throw Error("Insufficient permissions");
  });
  return plan();
};
function oldPlan38(...planParams) {
  const smartPlan = (...overrideParams) => {
      const args = [...overrideParams.concat(planParams.slice(overrideParams.length))],
        $prev = oldPlan39.apply(this, args);
      if (!($prev instanceof ExecutableStep)) {
        console.error(`Wrapped a plan function at Mutation.deleteProjectLink, but that function did not return a step!
${String(oldPlan39)}`);
        throw Error("Wrapped a plan function, but that function did not return a step!");
      }
      args[1].autoApply($prev);
      return $prev;
    },
    [$source, fieldArgs, info] = planParams,
    $newPlan = planWrapper38(smartPlan, $source, fieldArgs, info);
  if ($newPlan === void 0) throw Error("Your plan wrapper didn't return anything; it must return a step or null!");
  if ($newPlan !== null && !isStep($newPlan)) throw Error(`Your plan wrapper returned something other than a step... It must return a step (or null). (Returned: ${inspect($newPlan)})`);
  return $newPlan;
}
const planWrapper39 = (plan, _, fieldArgs) => {
  const $result = plan(),
    $linkId = fieldArgs.getRaw(["input", "rowId"]),
    $db = context().get("db");
  sideEffect([$result, $linkId, $db], async ([result, linkId, db]) => {
    if (!result) return;
    const link = await db.query.projectLinks.findFirst({
      where(table, {
        eq
      }) {
        return eq(table.id, linkId);
      },
      with: {
        project: {
          columns: {
            organizationId: !0
          }
        }
      }
    });
    if (!link?.project) return;
    try {
      await events.emit({
        type: "backfeed.projectLink.deleted",
        data: {
          projectLinkId: linkId,
          projectId: link.projectId,
          organizationId: link.project.organizationId
        },
        organizationId: link.project.organizationId,
        subject: linkId
      });
    } catch (error) {
      console.error("[Events] Failed to emit projectLink.deleted:", error);
    }
  });
  return $result;
};
const oldPlan41 = (_$root, args) => {
  const $delete = pgDeleteSingle(resource_status_templatePgResource, {
    id: args.getRaw(['input', "rowId"])
  });
  args.apply($delete);
  return object({
    result: $delete
  });
};
const planWrapper40 = (plan, _, fieldArgs) => {
  const $input = fieldArgs.getRaw(["input", "rowId"]),
    $observer = context().get("observer"),
    $db = context().get("db");
  sideEffect([$input, $observer, $db], async ([input, observer, db]) => {
    if (!observer) throw Error("Unauthorized");
    let organizationId;
    {
      const statusTemplate = await db.query.statusTemplates.findFirst({
        where(table, {
          eq
        }) {
          return eq(table.id, input);
        }
      });
      if (!statusTemplate) throw Error("Status template not found");
      organizationId = statusTemplate.organizationId;
    }
    if (!(await checkPermission(observer.identityProviderId, "organization", organizationId, "admin"))) throw Error("Insufficient permissions");
  });
  return plan();
};
function oldPlan40(...planParams) {
  const smartPlan = (...overrideParams) => {
      const args = [...overrideParams.concat(planParams.slice(overrideParams.length))],
        $prev = oldPlan41.apply(this, args);
      if (!($prev instanceof ExecutableStep)) {
        console.error(`Wrapped a plan function at Mutation.deleteStatusTemplate, but that function did not return a step!
${String(oldPlan41)}`);
        throw Error("Wrapped a plan function, but that function did not return a step!");
      }
      args[1].autoApply($prev);
      return $prev;
    },
    [$source, fieldArgs, info] = planParams,
    $newPlan = planWrapper40(smartPlan, $source, fieldArgs, info);
  if ($newPlan === void 0) throw Error("Your plan wrapper didn't return anything; it must return a step or null!");
  if ($newPlan !== null && !isStep($newPlan)) throw Error(`Your plan wrapper returned something other than a step... It must return a step (or null). (Returned: ${inspect($newPlan)})`);
  return $newPlan;
}
const planWrapper41 = (plan, _, fieldArgs) => {
  const $result = plan(),
    $templateId = fieldArgs.getRaw(["input", "rowId"]),
    $db = context().get("db");
  sideEffect([$result, $templateId, $db], async ([result, templateId, db]) => {
    if (!result) return;
    const template = await db.query.statusTemplates.findFirst({
      where(table, {
        eq
      }) {
        return eq(table.id, templateId);
      },
      columns: {
        organizationId: !0
      }
    });
    if (!template) return;
    try {
      await events.emit({
        type: "backfeed.statusTemplate.deleted",
        data: {
          statusTemplateId: templateId,
          organizationId: template.organizationId
        },
        organizationId: template.organizationId,
        subject: templateId
      });
    } catch (error) {
      console.error("[Events] Failed to emit statusTemplate.deleted:", error);
    }
  });
  return $result;
};
const oldPlan43 = (_$root, args) => {
  const $delete = pgDeleteSingle(resource_votePgResource, {
    id: args.getRaw(['input', "rowId"])
  });
  args.apply($delete);
  return object({
    result: $delete
  });
};
function oldPlan42(...planParams) {
  const smartPlan = (...overrideParams) => {
      const args = [...overrideParams.concat(planParams.slice(overrideParams.length))],
        $prev = oldPlan43.apply(this, args);
      if (!($prev instanceof ExecutableStep)) {
        console.error(`Wrapped a plan function at Mutation.deleteVote, but that function did not return a step!
${String(oldPlan43)}`);
        throw Error("Wrapped a plan function, but that function did not return a step!");
      }
      args[1].autoApply($prev);
      return $prev;
    },
    [$source, fieldArgs, info] = planParams,
    $newPlan = planWrapper25(smartPlan, $source, fieldArgs, info);
  if ($newPlan === void 0) throw Error("Your plan wrapper didn't return anything; it must return a step or null!");
  if ($newPlan !== null && !isStep($newPlan)) throw Error(`Your plan wrapper returned something other than a step... It must return a step (or null). (Returned: ${inspect($newPlan)})`);
  return $newPlan;
}
const planWrapper43 = (plan, _, fieldArgs) => {
  const $result = plan(),
    $voteId = fieldArgs.getRaw(["input", "rowId"]),
    $db = context().get("db");
  sideEffect([$result, $voteId, $db], async ([result, voteId, db]) => {
    if (!result) return;
    const vote = await db.query.votes.findFirst({
      where(table, {
        eq
      }) {
        return eq(table.id, voteId);
      },
      with: {
        post: {
          with: {
            project: {
              columns: {
                organizationId: !0
              }
            }
          }
        }
      }
    });
    if (!vote?.post?.project) return;
    try {
      await events.emit({
        type: "backfeed.vote.deleted",
        data: {
          voteId,
          postId: vote.postId,
          projectId: vote.post.projectId,
          organizationId: vote.post.project.organizationId
        },
        organizationId: vote.post.project.organizationId,
        subject: voteId
      });
    } catch (error) {
      console.error("[Events] Failed to emit vote.deleted:", error);
    }
  });
  return $result;
};
const oldPlan44 = (_$root, args) => {
  const $delete = pgDeleteSingle(resource_userPgResource, {
    id: args.getRaw(['input', "rowId"])
  });
  args.apply($delete);
  return object({
    result: $delete
  });
};
const planWrapper44 = (plan, _, fieldArgs) => {
  const $userId = fieldArgs.getRaw(["input", "rowId"]),
    $observer = context().get("observer");
  sideEffect([$userId, $observer], async ([userId, observer]) => {
    if (!observer) throw Error("Unauthorized");
    if (userId !== observer.id) throw Error("Insufficient permissions");
  });
  return plan();
};
const oldPlan46 = (_$root, args) => {
  const $delete = pgDeleteSingle(resource_project_status_configPgResource, {
    id: args.getRaw(['input', "rowId"])
  });
  args.apply($delete);
  return object({
    result: $delete
  });
};
const planWrapper45 = (plan, _, fieldArgs) => {
  const $input = fieldArgs.getRaw(["input", "rowId"]),
    $observer = context().get("observer"),
    $db = context().get("db");
  sideEffect([$input, $observer, $db], async ([input, observer, db]) => {
    if (!observer) throw Error("Unauthorized");
    let organizationId;
    {
      const config = await db.query.projectStatusConfigs.findFirst({
        where(table, {
          eq
        }) {
          return eq(table.id, input);
        },
        with: {
          project: !0
        }
      });
      if (!config) throw Error("Project status config not found");
      organizationId = config.project.organizationId;
    }
    if (!(await checkPermission(observer.identityProviderId, "organization", organizationId, "admin"))) throw Error("Insufficient permissions");
  });
  return plan();
};
function oldPlan45(...planParams) {
  const smartPlan = (...overrideParams) => {
      const args = [...overrideParams.concat(planParams.slice(overrideParams.length))],
        $prev = oldPlan46.apply(this, args);
      if (!($prev instanceof ExecutableStep)) {
        console.error(`Wrapped a plan function at Mutation.deleteProjectStatusConfig, but that function did not return a step!
${String(oldPlan46)}`);
        throw Error("Wrapped a plan function, but that function did not return a step!");
      }
      args[1].autoApply($prev);
      return $prev;
    },
    [$source, fieldArgs, info] = planParams,
    $newPlan = planWrapper45(smartPlan, $source, fieldArgs, info);
  if ($newPlan === void 0) throw Error("Your plan wrapper didn't return anything; it must return a step or null!");
  if ($newPlan !== null && !isStep($newPlan)) throw Error(`Your plan wrapper returned something other than a step... It must return a step (or null). (Returned: ${inspect($newPlan)})`);
  return $newPlan;
}
const planWrapper46 = (plan, _, fieldArgs) => {
  const $result = plan(),
    $configId = fieldArgs.getRaw(["input", "rowId"]),
    $db = context().get("db");
  sideEffect([$result, $configId, $db], async ([result, configId, db]) => {
    if (!result) return;
    const config = await db.query.projectStatusConfigs.findFirst({
      where(table, {
        eq
      }) {
        return eq(table.id, configId);
      },
      with: {
        project: {
          columns: {
            organizationId: !0
          }
        }
      }
    });
    if (!config?.project) return;
    try {
      await events.emit({
        type: "backfeed.projectStatusConfig.deleted",
        data: {
          projectStatusConfigId: configId,
          projectId: config.projectId,
          organizationId: config.project.organizationId
        },
        organizationId: config.project.organizationId,
        subject: configId
      });
    } catch (error) {
      console.error("[Events] Failed to emit projectStatusConfig.deleted:", error);
    }
  });
  return $result;
};
const oldPlan49 = (_$root, args) => {
  const $delete = pgDeleteSingle(resource_postPgResource, {
    id: args.getRaw(['input', "rowId"])
  });
  args.apply($delete);
  return object({
    result: $delete
  });
};
const planWrapper47 = (plan, _, fieldArgs) => {
  const $input = fieldArgs.getRaw(["input", "rowId"]),
    $observer = context().get("observer"),
    $db = context().get("db");
  sideEffect([$input, $observer, $db], async ([input, observer, db]) => {
    if (!observer) throw Error("Unauthorized");
    {
      const post = await db.query.posts.findFirst({
        where(table, {
          eq
        }) {
          return eq(table.id, input);
        },
        with: {
          project: !0
        }
      });
      if (!post) throw Error("Post not found");
      if (observer.id !== post.userId) {
        if (!(await checkPermission(observer.identityProviderId, "organization", post.project.organizationId, "admin"))) throw Error("Insufficient permissions");
      }
    }
  });
  return plan();
};
function oldPlan48(...planParams) {
  const smartPlan = (...overrideParams) => {
      const args = [...overrideParams.concat(planParams.slice(overrideParams.length))],
        $prev = oldPlan49.apply(this, args);
      if (!($prev instanceof ExecutableStep)) {
        console.error(`Wrapped a plan function at Mutation.deletePost, but that function did not return a step!
${String(oldPlan49)}`);
        throw Error("Wrapped a plan function, but that function did not return a step!");
      }
      args[1].autoApply($prev);
      return $prev;
    },
    [$source, fieldArgs, info] = planParams,
    $newPlan = planWrapper47(smartPlan, $source, fieldArgs, info);
  if ($newPlan === void 0) throw Error("Your plan wrapper didn't return anything; it must return a step or null!");
  if ($newPlan !== null && !isStep($newPlan)) throw Error(`Your plan wrapper returned something other than a step... It must return a step (or null). (Returned: ${inspect($newPlan)})`);
  return $newPlan;
}
const planWrapper48 = (plan, _, fieldArgs) => {
  const $result = plan(),
    $postId = fieldArgs.getRaw(["input", "rowId"]),
    $db = context().get("db");
  sideEffect([$result, $postId, $db], async ([result, postId, db]) => {
    if (!result) return;
    const post = await db.query.posts.findFirst({
      where(table, {
        eq
      }) {
        return eq(table.id, postId);
      },
      with: {
        project: {
          columns: {
            organizationId: !0
          }
        }
      }
    });
    if (!post?.project) return;
    try {
      await events.emit({
        type: "backfeed.post.deleted",
        data: {
          postId,
          projectId: post.projectId,
          organizationId: post.project.organizationId
        },
        organizationId: post.project.organizationId,
        subject: postId
      });
    } catch (error) {
      console.error("[Events] Failed to emit post.deleted:", error);
    }
  });
  return $result;
};
function oldPlan47(...planParams) {
  const smartPlan = (...overrideParams) => {
      const args = [...overrideParams.concat(planParams.slice(overrideParams.length))],
        $prev = oldPlan48.apply(this, args);
      if (!($prev instanceof ExecutableStep)) {
        console.error(`Wrapped a plan function at Mutation.deletePost, but that function did not return a step!
${String(oldPlan48)}`);
        throw Error("Wrapped a plan function, but that function did not return a step!");
      }
      args[1].autoApply($prev);
      return $prev;
    },
    [$source, fieldArgs, info] = planParams,
    $newPlan = planWrapper48(smartPlan, $source, fieldArgs, info);
  if ($newPlan === void 0) throw Error("Your plan wrapper didn't return anything; it must return a step or null!");
  if ($newPlan !== null && !isStep($newPlan)) throw Error(`Your plan wrapper returned something other than a step... It must return a step (or null). (Returned: ${inspect($newPlan)})`);
  return $newPlan;
}
const planWrapper49 = (plan, _, fieldArgs) => {
  if (!false) return plan();
  const $input = fieldArgs.getRaw(["input", "rowId"]);
  sideEffect([$input], async ([postId]) => {
    if (postId) await deletePostFromIndex(postId);
  });
  return plan();
};
const oldPlan53 = (_$root, args) => {
  const $delete = pgDeleteSingle(resource_projectPgResource, {
    id: args.getRaw(['input', "rowId"])
  });
  args.apply($delete);
  return object({
    result: $delete
  });
};
const planWrapper50 = (plan, _, fieldArgs) => {
  const $input = fieldArgs.getRaw(["input", "rowId"]),
    $observer = context().get("observer"),
    $db = context().get("db");
  sideEffect([$input, $observer, $db], async ([input, observer, db]) => {
    if (!observer) throw Error("Unauthorized");
    let organizationId;
    {
      const project = await db.query.projects.findFirst({
        where(table, {
          eq
        }) {
          return eq(table.id, input);
        }
      });
      if (!project) throw Error("Project not found");
      organizationId = project.organizationId;
    }
    if (!(await checkPermission(observer.identityProviderId, "organization", organizationId, "admin"))) throw Error("Insufficient permissions");
  });
  return plan();
};
function oldPlan52(...planParams) {
  const smartPlan = (...overrideParams) => {
      const args = [...overrideParams.concat(planParams.slice(overrideParams.length))],
        $prev = oldPlan53.apply(this, args);
      if (!($prev instanceof ExecutableStep)) {
        console.error(`Wrapped a plan function at Mutation.deleteProject, but that function did not return a step!
${String(oldPlan53)}`);
        throw Error("Wrapped a plan function, but that function did not return a step!");
      }
      args[1].autoApply($prev);
      return $prev;
    },
    [$source, fieldArgs, info] = planParams,
    $newPlan = planWrapper50(smartPlan, $source, fieldArgs, info);
  if ($newPlan === void 0) throw Error("Your plan wrapper didn't return anything; it must return a step or null!");
  if ($newPlan !== null && !isStep($newPlan)) throw Error(`Your plan wrapper returned something other than a step... It must return a step (or null). (Returned: ${inspect($newPlan)})`);
  return $newPlan;
}
const planWrapper51 = (plan, _, fieldArgs) => {
  const $result = plan(),
    $projectId = fieldArgs.getRaw(["input", "rowId"]),
    $db = context().get("db");
  sideEffect([$result, $projectId, $db], async ([result, projectId, db]) => {
    if (!result) return;
    if (!isAuthzEnabled()) return;
    const project = await db.query.projects.findFirst({
      where(table, {
        eq
      }) {
        return eq(table.id, projectId);
      }
    });
    if (!project) return;
    try {
      await deleteTuples([{
        user: `organization:${project.organizationId}`,
        relation: "organization",
        object: `project:${projectId}`
      }]);
    } catch (error) {
      console.error("[AuthZ Sync] Failed to sync project deletion:", error);
    }
  });
  return $result;
};
function oldPlan51(...planParams) {
  const smartPlan = (...overrideParams) => {
      const args = [...overrideParams.concat(planParams.slice(overrideParams.length))],
        $prev = oldPlan52.apply(this, args);
      if (!($prev instanceof ExecutableStep)) {
        console.error(`Wrapped a plan function at Mutation.deleteProject, but that function did not return a step!
${String(oldPlan52)}`);
        throw Error("Wrapped a plan function, but that function did not return a step!");
      }
      args[1].autoApply($prev);
      return $prev;
    },
    [$source, fieldArgs, info] = planParams,
    $newPlan = planWrapper51(smartPlan, $source, fieldArgs, info);
  if ($newPlan === void 0) throw Error("Your plan wrapper didn't return anything; it must return a step or null!");
  if ($newPlan !== null && !isStep($newPlan)) throw Error(`Your plan wrapper returned something other than a step... It must return a step (or null). (Returned: ${inspect($newPlan)})`);
  return $newPlan;
}
const planWrapper52 = (plan, _, fieldArgs) => {
  const $result = plan(),
    $projectId = fieldArgs.getRaw(["input", "rowId"]),
    $db = context().get("db");
  sideEffect([$result, $projectId, $db], async ([result, projectId, db]) => {
    if (!result) return;
    const project = await db.query.projects.findFirst({
      where(table, {
        eq
      }) {
        return eq(table.id, projectId);
      },
      columns: {
        organizationId: !0
      }
    });
    if (!project) return;
    try {
      await events.emit({
        type: "backfeed.project.deleted",
        data: {
          projectId,
          organizationId: project.organizationId
        },
        organizationId: project.organizationId,
        subject: projectId
      });
    } catch (error) {
      console.error("[Events] Failed to emit project.deleted:", error);
    }
  });
  return $result;
};
function oldPlan50(...planParams) {
  const smartPlan = (...overrideParams) => {
      const args = [...overrideParams.concat(planParams.slice(overrideParams.length))],
        $prev = oldPlan51.apply(this, args);
      if (!($prev instanceof ExecutableStep)) {
        console.error(`Wrapped a plan function at Mutation.deleteProject, but that function did not return a step!
${String(oldPlan51)}`);
        throw Error("Wrapped a plan function, but that function did not return a step!");
      }
      args[1].autoApply($prev);
      return $prev;
    },
    [$source, fieldArgs, info] = planParams,
    $newPlan = planWrapper52(smartPlan, $source, fieldArgs, info);
  if ($newPlan === void 0) throw Error("Your plan wrapper didn't return anything; it must return a step or null!");
  if ($newPlan !== null && !isStep($newPlan)) throw Error(`Your plan wrapper returned something other than a step... It must return a step (or null). (Returned: ${inspect($newPlan)})`);
  return $newPlan;
}
const planWrapper53 = (plan, _, fieldArgs) => {
  if (!false) return plan();
  const $input = fieldArgs.getRaw(["input", "rowId"]);
  sideEffect([$input], async ([projectId]) => {
    if (projectId) await deleteProjectFromIndex(projectId);
  });
  return plan();
};
function getClientMutationIdForCreatePlan($mutation) {
  return $mutation.getStepForKey("result").getMeta("clientMutationId");
}
function planCreatePayloadResult($object) {
  return $object.get("result");
}
function queryPlan() {
  return rootValue();
}
const getPgSelectSingleFromMutationResult = (resource, pkAttributes, $mutation) => {
  const $result = $mutation.getStepForKey("result", !0);
  if (!$result) return null;
  if ($result instanceof PgDeleteSingleStep) return pgSelectFromRecord($result.resource, $result.record());else {
    const spec = pkAttributes.reduce((memo, attributeName) => {
      memo[attributeName] = $result.get(attributeName);
      return memo;
    }, Object.create(null));
    return resource.find(spec);
  }
};
const pgMutationPayloadEdge = (resource, pkAttributes, $mutation, fieldArgs) => {
  const $select = getPgSelectSingleFromMutationResult(resource, pkAttributes, $mutation);
  if (!$select) return constant(null);
  fieldArgs.apply($select, "orderBy");
  const $connection = connection($select);
  return new EdgeStep($connection, first($connection));
};
const CreateCommentPayload_commentEdgePlan = ($mutation, fieldArgs) => pgMutationPayloadEdge(resource_commentPgResource, commentUniques[0].attributes, $mutation, fieldArgs);
function applyClientMutationIdForCreate(qb, val) {
  qb.setMeta("clientMutationId", val);
}
function applyCreateFields(qb, arg) {
  if (arg != null) return qb.setBuilder();
}
function CommentInput_rowIdApply(obj, val, info) {
  obj.set("id", bakedInputRuntime(info.schema, info.field.type, val));
}
function CommentInput_messageApply(obj, val, info) {
  obj.set("message", bakedInputRuntime(info.schema, info.field.type, val));
}
function CommentInput_postIdApply(obj, val, info) {
  obj.set("post_id", bakedInputRuntime(info.schema, info.field.type, val));
}
function CommentInput_userIdApply(obj, val, info) {
  obj.set("user_id", bakedInputRuntime(info.schema, info.field.type, val));
}
function CommentInput_parentIdApply(obj, val, info) {
  obj.set("parent_id", bakedInputRuntime(info.schema, info.field.type, val));
}
function CommentInput_createdAtApply(obj, val, info) {
  obj.set("created_at", bakedInputRuntime(info.schema, info.field.type, val));
}
function CommentInput_updatedAtApply(obj, val, info) {
  obj.set("updated_at", bakedInputRuntime(info.schema, info.field.type, val));
}
const CreateProjectLinkPayload_projectLinkEdgePlan = ($mutation, fieldArgs) => pgMutationPayloadEdge(resource_project_linkPgResource, project_linkUniques[0].attributes, $mutation, fieldArgs);
function ProjectLinkInput_projectIdApply(obj, val, info) {
  obj.set("project_id", bakedInputRuntime(info.schema, info.field.type, val));
}
function ProjectLinkInput_urlApply(obj, val, info) {
  obj.set("url", bakedInputRuntime(info.schema, info.field.type, val));
}
function ProjectLinkInput_titleApply(obj, val, info) {
  obj.set("title", bakedInputRuntime(info.schema, info.field.type, val));
}
function ProjectLinkInput_orderApply(obj, val, info) {
  obj.set("order", bakedInputRuntime(info.schema, info.field.type, val));
}
const CreateStatusTemplatePayload_statusTemplateEdgePlan = ($mutation, fieldArgs) => pgMutationPayloadEdge(resource_status_templatePgResource, status_templateUniques[0].attributes, $mutation, fieldArgs);
function StatusTemplateInput_organizationIdApply(obj, val, info) {
  obj.set("organization_id", bakedInputRuntime(info.schema, info.field.type, val));
}
function StatusTemplateInput_nameApply(obj, val, info) {
  obj.set("name", bakedInputRuntime(info.schema, info.field.type, val));
}
function StatusTemplateInput_displayNameApply(obj, val, info) {
  obj.set("display_name", bakedInputRuntime(info.schema, info.field.type, val));
}
function StatusTemplateInput_colorApply(obj, val, info) {
  obj.set("color", bakedInputRuntime(info.schema, info.field.type, val));
}
function StatusTemplateInput_descriptionApply(obj, val, info) {
  obj.set("description", bakedInputRuntime(info.schema, info.field.type, val));
}
function StatusTemplateInput_sortOrderApply(obj, val, info) {
  obj.set("sort_order", bakedInputRuntime(info.schema, info.field.type, val));
}
const CreateVotePayload_voteEdgePlan = ($mutation, fieldArgs) => pgMutationPayloadEdge(resource_votePgResource, voteUniques[0].attributes, $mutation, fieldArgs);
function VoteInput_voteTypeApply(obj, val, info) {
  obj.set("vote_type", bakedInputRuntime(info.schema, info.field.type, val));
}
const CreateUserPayload_userEdgePlan = ($mutation, fieldArgs) => pgMutationPayloadEdge(resource_userPgResource, userUniques[0].attributes, $mutation, fieldArgs);
function UserInput_identityProviderIdApply(obj, val, info) {
  obj.set("identity_provider_id", bakedInputRuntime(info.schema, info.field.type, val));
}
function UserInput_usernameApply(obj, val, info) {
  obj.set("username", bakedInputRuntime(info.schema, info.field.type, val));
}
function UserInput_emailApply(obj, val, info) {
  obj.set("email", bakedInputRuntime(info.schema, info.field.type, val));
}
function UserInput_avatarUrlApply(obj, val, info) {
  obj.set("avatar_url", bakedInputRuntime(info.schema, info.field.type, val));
}
const CreateProjectStatusConfigPayload_projectStatusConfigEdgePlan = ($mutation, fieldArgs) => pgMutationPayloadEdge(resource_project_status_configPgResource, project_status_configUniques[0].attributes, $mutation, fieldArgs);
function ProjectStatusConfigInput_statusTemplateIdApply(obj, val, info) {
  obj.set("status_template_id", bakedInputRuntime(info.schema, info.field.type, val));
}
function ProjectStatusConfigInput_customColorApply(obj, val, info) {
  obj.set("custom_color", bakedInputRuntime(info.schema, info.field.type, val));
}
function ProjectStatusConfigInput_customDescriptionApply(obj, val, info) {
  obj.set("custom_description", bakedInputRuntime(info.schema, info.field.type, val));
}
function ProjectStatusConfigInput_isEnabledApply(obj, val, info) {
  obj.set("is_enabled", bakedInputRuntime(info.schema, info.field.type, val));
}
function ProjectStatusConfigInput_isDefaultApply(obj, val, info) {
  obj.set("is_default", bakedInputRuntime(info.schema, info.field.type, val));
}
const CreatePostPayload_postEdgePlan = ($mutation, fieldArgs) => pgMutationPayloadEdge(resource_postPgResource, postUniques[0].attributes, $mutation, fieldArgs);
function PostInput_statusUpdatedAtApply(obj, val, info) {
  obj.set("status_updated_at", bakedInputRuntime(info.schema, info.field.type, val));
}
function PostInput_numberApply(obj, val, info) {
  obj.set("number", bakedInputRuntime(info.schema, info.field.type, val));
}
const CreateProjectPayload_projectEdgePlan = ($mutation, fieldArgs) => pgMutationPayloadEdge(resource_projectPgResource, projectUniques[0].attributes, $mutation, fieldArgs);
function ProjectInput_imageApply(obj, val, info) {
  obj.set("image", bakedInputRuntime(info.schema, info.field.type, val));
}
function ProjectInput_slugApply(obj, val, info) {
  obj.set("slug", bakedInputRuntime(info.schema, info.field.type, val));
}
function ProjectInput_nextPostNumberApply(obj, val, info) {
  obj.set("next_post_number", bakedInputRuntime(info.schema, info.field.type, val));
}
function ProjectInput_prefixApply(obj, val, info) {
  obj.set("prefix", bakedInputRuntime(info.schema, info.field.type, val));
}
function ProjectInput_isPublicApply(obj, val, info) {
  obj.set("is_public", bakedInputRuntime(info.schema, info.field.type, val));
}
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

  """Get a single \`Comment\`."""
  comment(rowId: UUID!): Comment

  """Get a single \`ProjectLink\`."""
  projectLink(rowId: UUID!): ProjectLink

  """Get a single \`StatusTemplate\`."""
  statusTemplate(rowId: UUID!): StatusTemplate

  """Get a single \`StatusTemplate\`."""
  statusTemplateByOrganizationIdAndName(organizationId: UUID!, name: String!): StatusTemplate

  """Get a single \`Vote\`."""
  vote(rowId: UUID!): Vote

  """Get a single \`Vote\`."""
  voteByPostIdAndUserId(postId: UUID!, userId: UUID!): Vote

  """Get a single \`User\`."""
  user(rowId: UUID!): User

  """Get a single \`User\`."""
  userByEmail(email: String!): User

  """Get a single \`User\`."""
  userByIdentityProviderId(identityProviderId: UUID!): User

  """Get a single \`User\`."""
  userByUsername(username: String!): User

  """Get a single \`ProjectStatusConfig\`."""
  projectStatusConfig(rowId: UUID!): ProjectStatusConfig

  """Get a single \`ProjectStatusConfig\`."""
  projectStatusConfigByProjectIdAndStatusTemplateId(projectId: UUID!, statusTemplateId: UUID!): ProjectStatusConfig

  """Get a single \`Post\`."""
  post(rowId: UUID!): Post

  """Get a single \`Post\`."""
  postByProjectIdAndNumber(projectId: UUID!, number: Int!): Post

  """Get a single \`Project\`."""
  project(rowId: UUID!): Project

  """Get a single \`Project\`."""
  projectBySlugAndOrganizationId(slug: String!, organizationId: UUID!): Project

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

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: CommentCondition

    """
    A filter to be used in determining which values should be returned by the collection.
    """
    filter: CommentFilter

    """The method to use when ordering \`Comment\`."""
    orderBy: [CommentOrderBy!] = [PRIMARY_KEY_ASC]
  ): CommentConnection

  """Reads and enables pagination through a set of \`ProjectLink\`."""
  projectLinks(
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

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: ProjectLinkCondition

    """
    A filter to be used in determining which values should be returned by the collection.
    """
    filter: ProjectLinkFilter

    """The method to use when ordering \`ProjectLink\`."""
    orderBy: [ProjectLinkOrderBy!] = [PRIMARY_KEY_ASC]
  ): ProjectLinkConnection

  """Reads and enables pagination through a set of \`StatusTemplate\`."""
  statusTemplates(
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

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: StatusTemplateCondition

    """
    A filter to be used in determining which values should be returned by the collection.
    """
    filter: StatusTemplateFilter

    """The method to use when ordering \`StatusTemplate\`."""
    orderBy: [StatusTemplateOrderBy!] = [PRIMARY_KEY_ASC]
  ): StatusTemplateConnection

  """Reads and enables pagination through a set of \`Vote\`."""
  votes(
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

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: VoteCondition

    """
    A filter to be used in determining which values should be returned by the collection.
    """
    filter: VoteFilter

    """The method to use when ordering \`Vote\`."""
    orderBy: [VoteOrderBy!] = [PRIMARY_KEY_ASC]
  ): VoteConnection

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

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: UserCondition

    """
    A filter to be used in determining which values should be returned by the collection.
    """
    filter: UserFilter

    """The method to use when ordering \`User\`."""
    orderBy: [UserOrderBy!] = [PRIMARY_KEY_ASC]
  ): UserConnection

  """Reads and enables pagination through a set of \`ProjectStatusConfig\`."""
  projectStatusConfigs(
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

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: ProjectStatusConfigCondition

    """
    A filter to be used in determining which values should be returned by the collection.
    """
    filter: ProjectStatusConfigFilter

    """The method to use when ordering \`ProjectStatusConfig\`."""
    orderBy: [ProjectStatusConfigOrderBy!] = [PRIMARY_KEY_ASC]
  ): ProjectStatusConfigConnection

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

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: PostCondition

    """
    A filter to be used in determining which values should be returned by the collection.
    """
    filter: PostFilter

    """The method to use when ordering \`Post\`."""
    orderBy: [PostOrderBy!] = [PRIMARY_KEY_ASC]
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

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: ProjectCondition

    """
    A filter to be used in determining which values should be returned by the collection.
    """
    filter: ProjectFilter

    """The method to use when ordering \`Project\`."""
    orderBy: [ProjectOrderBy!] = [PRIMARY_KEY_ASC]
  ): ProjectConnection

  """
  Returns the currently authenticated user (observer).
  Returns null if not authenticated.
  """
  observer: Observer
}

"""An object with a globally unique \`ID\`."""
interface Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  id: ID!
}

type Comment {
  rowId: UUID!
  message: String
  postId: UUID!
  userId: UUID!
  parentId: UUID
  createdAt: Datetime!
  updatedAt: Datetime!

  """Reads a single \`Comment\` that is related to this \`Comment\`."""
  parent: Comment

  """Reads a single \`Post\` that is related to this \`Comment\`."""
  post: Post

  """Reads a single \`User\` that is related to this \`Comment\`."""
  user: User

  """Reads and enables pagination through a set of \`Comment\`."""
  childComments(
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

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: CommentCondition

    """
    A filter to be used in determining which values should be returned by the collection.
    """
    filter: CommentFilter

    """The method to use when ordering \`Comment\`."""
    orderBy: [CommentOrderBy!] = [PRIMARY_KEY_ASC]
  ): CommentConnection!
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

type Post {
  rowId: UUID!
  title: String
  description: String
  projectId: UUID!
  userId: UUID!
  statusTemplateId: UUID
  statusUpdatedAt: Datetime!
  createdAt: Datetime!
  updatedAt: Datetime!
  number: Int

  """Reads a single \`Project\` that is related to this \`Post\`."""
  project: Project

  """Reads a single \`StatusTemplate\` that is related to this \`Post\`."""
  statusTemplate: StatusTemplate

  """Reads a single \`User\` that is related to this \`Post\`."""
  user: User

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

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: CommentCondition

    """
    A filter to be used in determining which values should be returned by the collection.
    """
    filter: CommentFilter

    """The method to use when ordering \`Comment\`."""
    orderBy: [CommentOrderBy!] = [PRIMARY_KEY_ASC]
  ): CommentConnection!

  """Reads and enables pagination through a set of \`Vote\`."""
  votes(
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

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: VoteCondition

    """
    A filter to be used in determining which values should be returned by the collection.
    """
    filter: VoteFilter

    """The method to use when ordering \`Vote\`."""
    orderBy: [VoteOrderBy!] = [PRIMARY_KEY_ASC]
  ): VoteConnection!
}

type Project {
  rowId: UUID!
  name: String!
  image: String
  slug: String!
  description: String
  organizationId: UUID!
  createdAt: Datetime!
  updatedAt: Datetime!
  nextPostNumber: Int!
  prefix: String
  isPublic: Boolean!

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

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: PostCondition

    """
    A filter to be used in determining which values should be returned by the collection.
    """
    filter: PostFilter

    """The method to use when ordering \`Post\`."""
    orderBy: [PostOrderBy!] = [PRIMARY_KEY_ASC]
  ): PostConnection!

  """Reads and enables pagination through a set of \`ProjectStatusConfig\`."""
  projectStatusConfigs(
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

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: ProjectStatusConfigCondition

    """
    A filter to be used in determining which values should be returned by the collection.
    """
    filter: ProjectStatusConfigFilter

    """The method to use when ordering \`ProjectStatusConfig\`."""
    orderBy: [ProjectStatusConfigOrderBy!] = [PRIMARY_KEY_ASC]
  ): ProjectStatusConfigConnection!

  """Reads and enables pagination through a set of \`ProjectLink\`."""
  projectLinks(
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

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: ProjectLinkCondition

    """
    A filter to be used in determining which values should be returned by the collection.
    """
    filter: ProjectLinkFilter

    """The method to use when ordering \`ProjectLink\`."""
    orderBy: [ProjectLinkOrderBy!] = [PRIMARY_KEY_ASC]
  ): ProjectLinkConnection!
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
  """Sum of number across the matching connection"""
  number: BigInt!
}

"""
A signed eight-byte integer. The upper big integer values are greater than the
max value for a JavaScript number. Therefore all big integers will be output as
strings and not numbers.
"""
scalar BigInt

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

  """Distinct count of statusTemplateId across the matching connection"""
  statusTemplateId: BigInt

  """Distinct count of statusUpdatedAt across the matching connection"""
  statusUpdatedAt: BigInt

  """Distinct count of createdAt across the matching connection"""
  createdAt: BigInt

  """Distinct count of updatedAt across the matching connection"""
  updatedAt: BigInt

  """Distinct count of number across the matching connection"""
  number: BigInt
}

type PostMinAggregates {
  """Minimum of number across the matching connection"""
  number: Int
}

type PostMaxAggregates {
  """Maximum of number across the matching connection"""
  number: Int
}

type PostAverageAggregates {
  """Mean average of number across the matching connection"""
  number: BigFloat
}

"""
A floating point number that requires more precision than IEEE 754 binary 64
"""
scalar BigFloat

type PostStddevSampleAggregates {
  """Sample standard deviation of number across the matching connection"""
  number: BigFloat
}

type PostStddevPopulationAggregates {
  """Population standard deviation of number across the matching connection"""
  number: BigFloat
}

type PostVarianceSampleAggregates {
  """Sample variance of number across the matching connection"""
  number: BigFloat
}

type PostVariancePopulationAggregates {
  """Population variance of number across the matching connection"""
  number: BigFloat
}

"""Grouping methods for \`Post\` for usage during aggregation."""
enum PostGroupBy {
  TITLE
  DESCRIPTION
  PROJECT_ID
  USER_ID
  STATUS_TEMPLATE_ID
  STATUS_UPDATED_AT
  STATUS_UPDATED_AT_TRUNCATED_TO_HOUR
  STATUS_UPDATED_AT_TRUNCATED_TO_DAY
  CREATED_AT
  CREATED_AT_TRUNCATED_TO_HOUR
  CREATED_AT_TRUNCATED_TO_DAY
  UPDATED_AT
  UPDATED_AT_TRUNCATED_TO_HOUR
  UPDATED_AT_TRUNCATED_TO_DAY
  NUMBER
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
  statusUpdatedAt: HavingDatetimeFilter
  createdAt: HavingDatetimeFilter
  updatedAt: HavingDatetimeFilter
  number: HavingIntFilter
}

input HavingDatetimeFilter {
  equalTo: Datetime
  notEqualTo: Datetime
  greaterThan: Datetime
  greaterThanOrEqualTo: Datetime
  lessThan: Datetime
  lessThanOrEqualTo: Datetime
}

input HavingIntFilter {
  equalTo: Int
  notEqualTo: Int
  greaterThan: Int
  greaterThanOrEqualTo: Int
  lessThan: Int
  lessThanOrEqualTo: Int
}

input PostHavingDistinctCountInput {
  statusUpdatedAt: HavingDatetimeFilter
  createdAt: HavingDatetimeFilter
  updatedAt: HavingDatetimeFilter
  number: HavingIntFilter
}

input PostHavingMinInput {
  statusUpdatedAt: HavingDatetimeFilter
  createdAt: HavingDatetimeFilter
  updatedAt: HavingDatetimeFilter
  number: HavingIntFilter
}

input PostHavingMaxInput {
  statusUpdatedAt: HavingDatetimeFilter
  createdAt: HavingDatetimeFilter
  updatedAt: HavingDatetimeFilter
  number: HavingIntFilter
}

input PostHavingAverageInput {
  statusUpdatedAt: HavingDatetimeFilter
  createdAt: HavingDatetimeFilter
  updatedAt: HavingDatetimeFilter
  number: HavingIntFilter
}

input PostHavingStddevSampleInput {
  statusUpdatedAt: HavingDatetimeFilter
  createdAt: HavingDatetimeFilter
  updatedAt: HavingDatetimeFilter
  number: HavingIntFilter
}

input PostHavingStddevPopulationInput {
  statusUpdatedAt: HavingDatetimeFilter
  createdAt: HavingDatetimeFilter
  updatedAt: HavingDatetimeFilter
  number: HavingIntFilter
}

input PostHavingVarianceSampleInput {
  statusUpdatedAt: HavingDatetimeFilter
  createdAt: HavingDatetimeFilter
  updatedAt: HavingDatetimeFilter
  number: HavingIntFilter
}

input PostHavingVariancePopulationInput {
  statusUpdatedAt: HavingDatetimeFilter
  createdAt: HavingDatetimeFilter
  updatedAt: HavingDatetimeFilter
  number: HavingIntFilter
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

  """Checks for equality with the object’s \`statusTemplateId\` field."""
  statusTemplateId: UUID

  """Checks for equality with the object’s \`statusUpdatedAt\` field."""
  statusUpdatedAt: Datetime

  """Checks for equality with the object’s \`createdAt\` field."""
  createdAt: Datetime

  """Checks for equality with the object’s \`updatedAt\` field."""
  updatedAt: Datetime

  """Checks for equality with the object’s \`number\` field."""
  number: Int
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

  """Filter by the object’s \`statusTemplateId\` field."""
  statusTemplateId: UUIDFilter

  """Filter by the object’s \`statusUpdatedAt\` field."""
  statusUpdatedAt: DatetimeFilter

  """Filter by the object’s \`createdAt\` field."""
  createdAt: DatetimeFilter

  """Filter by the object’s \`updatedAt\` field."""
  updatedAt: DatetimeFilter

  """Filter by the object’s \`number\` field."""
  number: IntFilter

  """Filter by the object’s \`comments\` relation."""
  comments: PostToManyCommentFilter

  """Some related \`comments\` exist."""
  commentsExist: Boolean

  """Filter by the object’s \`votes\` relation."""
  votes: PostToManyVoteFilter

  """Some related \`votes\` exist."""
  votesExist: Boolean

  """Filter by the object’s \`project\` relation."""
  project: ProjectFilter

  """Filter by the object’s \`statusTemplate\` relation."""
  statusTemplate: StatusTemplateFilter

  """A related \`statusTemplate\` exists."""
  statusTemplateExists: Boolean

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

  """Filter by the object’s \`parentId\` field."""
  parentId: UUIDFilter

  """Filter by the object’s \`createdAt\` field."""
  createdAt: DatetimeFilter

  """Filter by the object’s \`updatedAt\` field."""
  updatedAt: DatetimeFilter

  """Filter by the object’s \`childComments\` relation."""
  childComments: CommentToManyCommentFilter

  """Some related \`childComments\` exist."""
  childCommentsExist: Boolean

  """Filter by the object’s \`parent\` relation."""
  parent: CommentFilter

  """A related \`parent\` exists."""
  parentExists: Boolean

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

"""
A filter to be used against many \`Comment\` object types. All fields are combined with a logical ‘and.’
"""
input CommentToManyCommentFilter {
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
  parentId: BigIntFilter
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
A filter to be used against \`User\` object types. All fields are combined with a logical ‘and.’
"""
input UserFilter {
  """Filter by the object’s \`rowId\` field."""
  rowId: UUIDFilter

  """Filter by the object’s \`identityProviderId\` field."""
  identityProviderId: UUIDFilter

  """Filter by the object’s \`username\` field."""
  username: StringFilter

  """Filter by the object’s \`email\` field."""
  email: StringFilter

  """Filter by the object’s \`createdAt\` field."""
  createdAt: DatetimeFilter

  """Filter by the object’s \`updatedAt\` field."""
  updatedAt: DatetimeFilter

  """Filter by the object’s \`name\` field."""
  name: StringFilter

  """Filter by the object’s \`avatarUrl\` field."""
  avatarUrl: StringFilter

  """Filter by the object’s \`comments\` relation."""
  comments: UserToManyCommentFilter

  """Some related \`comments\` exist."""
  commentsExist: Boolean

  """Filter by the object’s \`posts\` relation."""
  posts: UserToManyPostFilter

  """Some related \`posts\` exist."""
  postsExist: Boolean

  """Filter by the object’s \`votes\` relation."""
  votes: UserToManyVoteFilter

  """Some related \`votes\` exist."""
  votesExist: Boolean

  """Checks for all expressions in this list."""
  and: [UserFilter!]

  """Checks for any expressions in this list."""
  or: [UserFilter!]

  """Negates the expression."""
  not: UserFilter
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

  """Sum aggregate over matching \`Post\` objects."""
  sum: PostSumAggregateFilter

  """Distinct count aggregate over matching \`Post\` objects."""
  distinctCount: PostDistinctCountAggregateFilter

  """Minimum aggregate over matching \`Post\` objects."""
  min: PostMinAggregateFilter

  """Maximum aggregate over matching \`Post\` objects."""
  max: PostMaxAggregateFilter

  """Mean average aggregate over matching \`Post\` objects."""
  average: PostAverageAggregateFilter

  """Sample standard deviation aggregate over matching \`Post\` objects."""
  stddevSample: PostStddevSampleAggregateFilter

  """Population standard deviation aggregate over matching \`Post\` objects."""
  stddevPopulation: PostStddevPopulationAggregateFilter

  """Sample variance aggregate over matching \`Post\` objects."""
  varianceSample: PostVarianceSampleAggregateFilter

  """Population variance aggregate over matching \`Post\` objects."""
  variancePopulation: PostVariancePopulationAggregateFilter
}

input PostSumAggregateFilter {
  number: BigIntFilter
}

input PostDistinctCountAggregateFilter {
  rowId: BigIntFilter
  title: BigIntFilter
  description: BigIntFilter
  projectId: BigIntFilter
  userId: BigIntFilter
  statusTemplateId: BigIntFilter
  statusUpdatedAt: BigIntFilter
  createdAt: BigIntFilter
  updatedAt: BigIntFilter
  number: BigIntFilter
}

input PostMinAggregateFilter {
  number: IntFilter
}

input PostMaxAggregateFilter {
  number: IntFilter
}

input PostAverageAggregateFilter {
  number: BigFloatFilter
}

"""
A filter to be used against BigFloat fields. All fields are combined with a logical ‘and.’
"""
input BigFloatFilter {
  """
  Is null (if \`true\` is specified) or is not null (if \`false\` is specified).
  """
  isNull: Boolean

  """Equal to the specified value."""
  equalTo: BigFloat

  """Not equal to the specified value."""
  notEqualTo: BigFloat

  """
  Not equal to the specified value, treating null like an ordinary value.
  """
  distinctFrom: BigFloat

  """Equal to the specified value, treating null like an ordinary value."""
  notDistinctFrom: BigFloat

  """Included in the specified list."""
  in: [BigFloat!]

  """Not included in the specified list."""
  notIn: [BigFloat!]

  """Less than the specified value."""
  lessThan: BigFloat

  """Less than or equal to the specified value."""
  lessThanOrEqualTo: BigFloat

  """Greater than the specified value."""
  greaterThan: BigFloat

  """Greater than or equal to the specified value."""
  greaterThanOrEqualTo: BigFloat
}

input PostStddevSampleAggregateFilter {
  number: BigFloatFilter
}

input PostStddevPopulationAggregateFilter {
  number: BigFloatFilter
}

input PostVarianceSampleAggregateFilter {
  number: BigFloatFilter
}

input PostVariancePopulationAggregateFilter {
  number: BigFloatFilter
}

"""
A filter to be used against many \`Vote\` object types. All fields are combined with a logical ‘and.’
"""
input UserToManyVoteFilter {
  """
  Every related \`Vote\` matches the filter criteria. All fields are combined with a logical ‘and.’
  """
  every: VoteFilter

  """
  Some related \`Vote\` matches the filter criteria. All fields are combined with a logical ‘and.’
  """
  some: VoteFilter

  """
  No related \`Vote\` matches the filter criteria. All fields are combined with a logical ‘and.’
  """
  none: VoteFilter

  """Aggregates across related \`Vote\` match the filter criteria."""
  aggregates: VoteAggregatesFilter
}

"""
A filter to be used against \`Vote\` object types. All fields are combined with a logical ‘and.’
"""
input VoteFilter {
  """Filter by the object’s \`rowId\` field."""
  rowId: UUIDFilter

  """Filter by the object’s \`postId\` field."""
  postId: UUIDFilter

  """Filter by the object’s \`userId\` field."""
  userId: UUIDFilter

  """Filter by the object’s \`voteType\` field."""
  voteType: VoteTypeFilter

  """Filter by the object’s \`createdAt\` field."""
  createdAt: DatetimeFilter

  """Filter by the object’s \`updatedAt\` field."""
  updatedAt: DatetimeFilter

  """Filter by the object’s \`post\` relation."""
  post: PostFilter

  """Filter by the object’s \`user\` relation."""
  user: UserFilter

  """Checks for all expressions in this list."""
  and: [VoteFilter!]

  """Checks for any expressions in this list."""
  or: [VoteFilter!]

  """Negates the expression."""
  not: VoteFilter
}

"""
A filter to be used against VoteType fields. All fields are combined with a logical ‘and.’
"""
input VoteTypeFilter {
  """
  Is null (if \`true\` is specified) or is not null (if \`false\` is specified).
  """
  isNull: Boolean

  """Equal to the specified value."""
  equalTo: VoteType

  """Not equal to the specified value."""
  notEqualTo: VoteType

  """
  Not equal to the specified value, treating null like an ordinary value.
  """
  distinctFrom: VoteType

  """Equal to the specified value, treating null like an ordinary value."""
  notDistinctFrom: VoteType

  """Included in the specified list."""
  in: [VoteType!]

  """Not included in the specified list."""
  notIn: [VoteType!]

  """Less than the specified value."""
  lessThan: VoteType

  """Less than or equal to the specified value."""
  lessThanOrEqualTo: VoteType

  """Greater than the specified value."""
  greaterThan: VoteType

  """Greater than or equal to the specified value."""
  greaterThanOrEqualTo: VoteType
}

enum VoteType {
  up
  down
}

"""A filter to be used against aggregates of \`Vote\` object types."""
input VoteAggregatesFilter {
  """
  A filter that must pass for the relevant \`Vote\` object to be included within the aggregate.
  """
  filter: VoteFilter

  """Distinct count aggregate over matching \`Vote\` objects."""
  distinctCount: VoteDistinctCountAggregateFilter
}

input VoteDistinctCountAggregateFilter {
  rowId: BigIntFilter
  postId: BigIntFilter
  userId: BigIntFilter
  voteType: BigIntFilter
  createdAt: BigIntFilter
  updatedAt: BigIntFilter
}

"""
A filter to be used against many \`Vote\` object types. All fields are combined with a logical ‘and.’
"""
input PostToManyVoteFilter {
  """
  Every related \`Vote\` matches the filter criteria. All fields are combined with a logical ‘and.’
  """
  every: VoteFilter

  """
  Some related \`Vote\` matches the filter criteria. All fields are combined with a logical ‘and.’
  """
  some: VoteFilter

  """
  No related \`Vote\` matches the filter criteria. All fields are combined with a logical ‘and.’
  """
  none: VoteFilter

  """Aggregates across related \`Vote\` match the filter criteria."""
  aggregates: VoteAggregatesFilter
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

  """Filter by the object’s \`nextPostNumber\` field."""
  nextPostNumber: IntFilter

  """Filter by the object’s \`prefix\` field."""
  prefix: StringFilter

  """Filter by the object’s \`isPublic\` field."""
  isPublic: BooleanFilter

  """Filter by the object’s \`posts\` relation."""
  posts: ProjectToManyPostFilter

  """Some related \`posts\` exist."""
  postsExist: Boolean

  """Filter by the object’s \`projectStatusConfigs\` relation."""
  projectStatusConfigs: ProjectToManyProjectStatusConfigFilter

  """Some related \`projectStatusConfigs\` exist."""
  projectStatusConfigsExist: Boolean

  """Filter by the object’s \`projectLinks\` relation."""
  projectLinks: ProjectToManyProjectLinkFilter

  """Some related \`projectLinks\` exist."""
  projectLinksExist: Boolean

  """Checks for all expressions in this list."""
  and: [ProjectFilter!]

  """Checks for any expressions in this list."""
  or: [ProjectFilter!]

  """Negates the expression."""
  not: ProjectFilter
}

"""
A filter to be used against Boolean fields. All fields are combined with a logical ‘and.’
"""
input BooleanFilter {
  """
  Is null (if \`true\` is specified) or is not null (if \`false\` is specified).
  """
  isNull: Boolean

  """Equal to the specified value."""
  equalTo: Boolean

  """Not equal to the specified value."""
  notEqualTo: Boolean

  """
  Not equal to the specified value, treating null like an ordinary value.
  """
  distinctFrom: Boolean

  """Equal to the specified value, treating null like an ordinary value."""
  notDistinctFrom: Boolean

  """Included in the specified list."""
  in: [Boolean!]

  """Not included in the specified list."""
  notIn: [Boolean!]

  """Less than the specified value."""
  lessThan: Boolean

  """Less than or equal to the specified value."""
  lessThanOrEqualTo: Boolean

  """Greater than the specified value."""
  greaterThan: Boolean

  """Greater than or equal to the specified value."""
  greaterThanOrEqualTo: Boolean
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

"""
A filter to be used against many \`ProjectStatusConfig\` object types. All fields are combined with a logical ‘and.’
"""
input ProjectToManyProjectStatusConfigFilter {
  """
  Every related \`ProjectStatusConfig\` matches the filter criteria. All fields are combined with a logical ‘and.’
  """
  every: ProjectStatusConfigFilter

  """
  Some related \`ProjectStatusConfig\` matches the filter criteria. All fields are combined with a logical ‘and.’
  """
  some: ProjectStatusConfigFilter

  """
  No related \`ProjectStatusConfig\` matches the filter criteria. All fields are combined with a logical ‘and.’
  """
  none: ProjectStatusConfigFilter

  """
  Aggregates across related \`ProjectStatusConfig\` match the filter criteria.
  """
  aggregates: ProjectStatusConfigAggregatesFilter
}

"""
A filter to be used against \`ProjectStatusConfig\` object types. All fields are combined with a logical ‘and.’
"""
input ProjectStatusConfigFilter {
  """Filter by the object’s \`rowId\` field."""
  rowId: UUIDFilter

  """Filter by the object’s \`projectId\` field."""
  projectId: UUIDFilter

  """Filter by the object’s \`statusTemplateId\` field."""
  statusTemplateId: UUIDFilter

  """Filter by the object’s \`customColor\` field."""
  customColor: StringFilter

  """Filter by the object’s \`customDescription\` field."""
  customDescription: StringFilter

  """Filter by the object’s \`isEnabled\` field."""
  isEnabled: BooleanFilter

  """Filter by the object’s \`isDefault\` field."""
  isDefault: BooleanFilter

  """Filter by the object’s \`sortOrder\` field."""
  sortOrder: IntFilter

  """Filter by the object’s \`createdAt\` field."""
  createdAt: DatetimeFilter

  """Filter by the object’s \`project\` relation."""
  project: ProjectFilter

  """Filter by the object’s \`statusTemplate\` relation."""
  statusTemplate: StatusTemplateFilter

  """Checks for all expressions in this list."""
  and: [ProjectStatusConfigFilter!]

  """Checks for any expressions in this list."""
  or: [ProjectStatusConfigFilter!]

  """Negates the expression."""
  not: ProjectStatusConfigFilter
}

"""
A filter to be used against \`StatusTemplate\` object types. All fields are combined with a logical ‘and.’
"""
input StatusTemplateFilter {
  """Filter by the object’s \`rowId\` field."""
  rowId: UUIDFilter

  """Filter by the object’s \`organizationId\` field."""
  organizationId: UUIDFilter

  """Filter by the object’s \`name\` field."""
  name: StringFilter

  """Filter by the object’s \`displayName\` field."""
  displayName: StringFilter

  """Filter by the object’s \`color\` field."""
  color: StringFilter

  """Filter by the object’s \`description\` field."""
  description: StringFilter

  """Filter by the object’s \`sortOrder\` field."""
  sortOrder: IntFilter

  """Filter by the object’s \`createdAt\` field."""
  createdAt: DatetimeFilter

  """Filter by the object’s \`updatedAt\` field."""
  updatedAt: DatetimeFilter

  """Filter by the object’s \`posts\` relation."""
  posts: StatusTemplateToManyPostFilter

  """Some related \`posts\` exist."""
  postsExist: Boolean

  """Filter by the object’s \`projectStatusConfigs\` relation."""
  projectStatusConfigs: StatusTemplateToManyProjectStatusConfigFilter

  """Some related \`projectStatusConfigs\` exist."""
  projectStatusConfigsExist: Boolean

  """Checks for all expressions in this list."""
  and: [StatusTemplateFilter!]

  """Checks for any expressions in this list."""
  or: [StatusTemplateFilter!]

  """Negates the expression."""
  not: StatusTemplateFilter
}

"""
A filter to be used against many \`Post\` object types. All fields are combined with a logical ‘and.’
"""
input StatusTemplateToManyPostFilter {
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

"""
A filter to be used against many \`ProjectStatusConfig\` object types. All fields are combined with a logical ‘and.’
"""
input StatusTemplateToManyProjectStatusConfigFilter {
  """
  Every related \`ProjectStatusConfig\` matches the filter criteria. All fields are combined with a logical ‘and.’
  """
  every: ProjectStatusConfigFilter

  """
  Some related \`ProjectStatusConfig\` matches the filter criteria. All fields are combined with a logical ‘and.’
  """
  some: ProjectStatusConfigFilter

  """
  No related \`ProjectStatusConfig\` matches the filter criteria. All fields are combined with a logical ‘and.’
  """
  none: ProjectStatusConfigFilter

  """
  Aggregates across related \`ProjectStatusConfig\` match the filter criteria.
  """
  aggregates: ProjectStatusConfigAggregatesFilter
}

"""
A filter to be used against aggregates of \`ProjectStatusConfig\` object types.
"""
input ProjectStatusConfigAggregatesFilter {
  """
  A filter that must pass for the relevant \`ProjectStatusConfig\` object to be included within the aggregate.
  """
  filter: ProjectStatusConfigFilter

  """Sum aggregate over matching \`ProjectStatusConfig\` objects."""
  sum: ProjectStatusConfigSumAggregateFilter

  """Distinct count aggregate over matching \`ProjectStatusConfig\` objects."""
  distinctCount: ProjectStatusConfigDistinctCountAggregateFilter

  """Minimum aggregate over matching \`ProjectStatusConfig\` objects."""
  min: ProjectStatusConfigMinAggregateFilter

  """Maximum aggregate over matching \`ProjectStatusConfig\` objects."""
  max: ProjectStatusConfigMaxAggregateFilter

  """Mean average aggregate over matching \`ProjectStatusConfig\` objects."""
  average: ProjectStatusConfigAverageAggregateFilter

  """
  Sample standard deviation aggregate over matching \`ProjectStatusConfig\` objects.
  """
  stddevSample: ProjectStatusConfigStddevSampleAggregateFilter

  """
  Population standard deviation aggregate over matching \`ProjectStatusConfig\` objects.
  """
  stddevPopulation: ProjectStatusConfigStddevPopulationAggregateFilter

  """Sample variance aggregate over matching \`ProjectStatusConfig\` objects."""
  varianceSample: ProjectStatusConfigVarianceSampleAggregateFilter

  """
  Population variance aggregate over matching \`ProjectStatusConfig\` objects.
  """
  variancePopulation: ProjectStatusConfigVariancePopulationAggregateFilter
}

input ProjectStatusConfigSumAggregateFilter {
  sortOrder: BigIntFilter
}

input ProjectStatusConfigDistinctCountAggregateFilter {
  rowId: BigIntFilter
  projectId: BigIntFilter
  statusTemplateId: BigIntFilter
  customColor: BigIntFilter
  customDescription: BigIntFilter
  isEnabled: BigIntFilter
  isDefault: BigIntFilter
  sortOrder: BigIntFilter
  createdAt: BigIntFilter
}

input ProjectStatusConfigMinAggregateFilter {
  sortOrder: IntFilter
}

input ProjectStatusConfigMaxAggregateFilter {
  sortOrder: IntFilter
}

input ProjectStatusConfigAverageAggregateFilter {
  sortOrder: BigFloatFilter
}

input ProjectStatusConfigStddevSampleAggregateFilter {
  sortOrder: BigFloatFilter
}

input ProjectStatusConfigStddevPopulationAggregateFilter {
  sortOrder: BigFloatFilter
}

input ProjectStatusConfigVarianceSampleAggregateFilter {
  sortOrder: BigFloatFilter
}

input ProjectStatusConfigVariancePopulationAggregateFilter {
  sortOrder: BigFloatFilter
}

"""
A filter to be used against many \`ProjectLink\` object types. All fields are combined with a logical ‘and.’
"""
input ProjectToManyProjectLinkFilter {
  """
  Every related \`ProjectLink\` matches the filter criteria. All fields are combined with a logical ‘and.’
  """
  every: ProjectLinkFilter

  """
  Some related \`ProjectLink\` matches the filter criteria. All fields are combined with a logical ‘and.’
  """
  some: ProjectLinkFilter

  """
  No related \`ProjectLink\` matches the filter criteria. All fields are combined with a logical ‘and.’
  """
  none: ProjectLinkFilter

  """Aggregates across related \`ProjectLink\` match the filter criteria."""
  aggregates: ProjectLinkAggregatesFilter
}

"""
A filter to be used against \`ProjectLink\` object types. All fields are combined with a logical ‘and.’
"""
input ProjectLinkFilter {
  """Filter by the object’s \`rowId\` field."""
  rowId: UUIDFilter

  """Filter by the object’s \`projectId\` field."""
  projectId: UUIDFilter

  """Filter by the object’s \`url\` field."""
  url: StringFilter

  """Filter by the object’s \`title\` field."""
  title: StringFilter

  """Filter by the object’s \`order\` field."""
  order: IntFilter

  """Filter by the object’s \`createdAt\` field."""
  createdAt: DatetimeFilter

  """Filter by the object’s \`updatedAt\` field."""
  updatedAt: DatetimeFilter

  """Filter by the object’s \`project\` relation."""
  project: ProjectFilter

  """Checks for all expressions in this list."""
  and: [ProjectLinkFilter!]

  """Checks for any expressions in this list."""
  or: [ProjectLinkFilter!]

  """Negates the expression."""
  not: ProjectLinkFilter
}

"""A filter to be used against aggregates of \`ProjectLink\` object types."""
input ProjectLinkAggregatesFilter {
  """
  A filter that must pass for the relevant \`ProjectLink\` object to be included within the aggregate.
  """
  filter: ProjectLinkFilter

  """Sum aggregate over matching \`ProjectLink\` objects."""
  sum: ProjectLinkSumAggregateFilter

  """Distinct count aggregate over matching \`ProjectLink\` objects."""
  distinctCount: ProjectLinkDistinctCountAggregateFilter

  """Minimum aggregate over matching \`ProjectLink\` objects."""
  min: ProjectLinkMinAggregateFilter

  """Maximum aggregate over matching \`ProjectLink\` objects."""
  max: ProjectLinkMaxAggregateFilter

  """Mean average aggregate over matching \`ProjectLink\` objects."""
  average: ProjectLinkAverageAggregateFilter

  """
  Sample standard deviation aggregate over matching \`ProjectLink\` objects.
  """
  stddevSample: ProjectLinkStddevSampleAggregateFilter

  """
  Population standard deviation aggregate over matching \`ProjectLink\` objects.
  """
  stddevPopulation: ProjectLinkStddevPopulationAggregateFilter

  """Sample variance aggregate over matching \`ProjectLink\` objects."""
  varianceSample: ProjectLinkVarianceSampleAggregateFilter

  """Population variance aggregate over matching \`ProjectLink\` objects."""
  variancePopulation: ProjectLinkVariancePopulationAggregateFilter
}

input ProjectLinkSumAggregateFilter {
  order: BigIntFilter
}

input ProjectLinkDistinctCountAggregateFilter {
  rowId: BigIntFilter
  projectId: BigIntFilter
  url: BigIntFilter
  title: BigIntFilter
  order: BigIntFilter
  createdAt: BigIntFilter
  updatedAt: BigIntFilter
}

input ProjectLinkMinAggregateFilter {
  order: IntFilter
}

input ProjectLinkMaxAggregateFilter {
  order: IntFilter
}

input ProjectLinkAverageAggregateFilter {
  order: BigFloatFilter
}

input ProjectLinkStddevSampleAggregateFilter {
  order: BigFloatFilter
}

input ProjectLinkStddevPopulationAggregateFilter {
  order: BigFloatFilter
}

input ProjectLinkVarianceSampleAggregateFilter {
  order: BigFloatFilter
}

input ProjectLinkVariancePopulationAggregateFilter {
  order: BigFloatFilter
}

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
  STATUS_TEMPLATE_ID_ASC
  STATUS_TEMPLATE_ID_DESC
  STATUS_UPDATED_AT_ASC
  STATUS_UPDATED_AT_DESC
  CREATED_AT_ASC
  CREATED_AT_DESC
  UPDATED_AT_ASC
  UPDATED_AT_DESC
  NUMBER_ASC
  NUMBER_DESC
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
  COMMENTS_DISTINCT_COUNT_PARENT_ID_ASC
  COMMENTS_DISTINCT_COUNT_PARENT_ID_DESC
  COMMENTS_DISTINCT_COUNT_CREATED_AT_ASC
  COMMENTS_DISTINCT_COUNT_CREATED_AT_DESC
  COMMENTS_DISTINCT_COUNT_UPDATED_AT_ASC
  COMMENTS_DISTINCT_COUNT_UPDATED_AT_DESC
  VOTES_COUNT_ASC
  VOTES_COUNT_DESC
  VOTES_DISTINCT_COUNT_ROW_ID_ASC
  VOTES_DISTINCT_COUNT_ROW_ID_DESC
  VOTES_DISTINCT_COUNT_POST_ID_ASC
  VOTES_DISTINCT_COUNT_POST_ID_DESC
  VOTES_DISTINCT_COUNT_USER_ID_ASC
  VOTES_DISTINCT_COUNT_USER_ID_DESC
  VOTES_DISTINCT_COUNT_VOTE_TYPE_ASC
  VOTES_DISTINCT_COUNT_VOTE_TYPE_DESC
  VOTES_DISTINCT_COUNT_CREATED_AT_ASC
  VOTES_DISTINCT_COUNT_CREATED_AT_DESC
  VOTES_DISTINCT_COUNT_UPDATED_AT_ASC
  VOTES_DISTINCT_COUNT_UPDATED_AT_DESC
}

"""A connection to a list of \`ProjectStatusConfig\` values."""
type ProjectStatusConfigConnection {
  """A list of \`ProjectStatusConfig\` objects."""
  nodes: [ProjectStatusConfig]!

  """
  A list of edges which contains the \`ProjectStatusConfig\` and cursor to aid in pagination.
  """
  edges: [ProjectStatusConfigEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """
  The count of *all* \`ProjectStatusConfig\` you could get from the connection.
  """
  totalCount: Int!

  """
  Aggregates across the matching connection (ignoring before/after/first/last/offset)
  """
  aggregates: ProjectStatusConfigAggregates

  """
  Grouped aggregates across the matching connection (ignoring before/after/first/last/offset)
  """
  groupedAggregates(
    """
    The method to use when grouping \`ProjectStatusConfig\` for these aggregates.
    """
    groupBy: [ProjectStatusConfigGroupBy!]!

    """Conditions on the grouped aggregates."""
    having: ProjectStatusConfigHavingInput
  ): [ProjectStatusConfigAggregates!]
}

type ProjectStatusConfig {
  rowId: UUID!
  projectId: UUID!
  statusTemplateId: UUID!
  customColor: String
  customDescription: String
  isEnabled: Boolean
  isDefault: Boolean
  sortOrder: Int
  createdAt: Datetime!

  """
  Reads a single \`Project\` that is related to this \`ProjectStatusConfig\`.
  """
  project: Project

  """
  Reads a single \`StatusTemplate\` that is related to this \`ProjectStatusConfig\`.
  """
  statusTemplate: StatusTemplate
}

type StatusTemplate {
  rowId: UUID!
  organizationId: UUID!
  name: String!
  displayName: String!
  color: String
  description: String
  sortOrder: Int
  createdAt: Datetime!
  updatedAt: Datetime!

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

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: PostCondition

    """
    A filter to be used in determining which values should be returned by the collection.
    """
    filter: PostFilter

    """The method to use when ordering \`Post\`."""
    orderBy: [PostOrderBy!] = [PRIMARY_KEY_ASC]
  ): PostConnection!

  """Reads and enables pagination through a set of \`ProjectStatusConfig\`."""
  projectStatusConfigs(
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

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: ProjectStatusConfigCondition

    """
    A filter to be used in determining which values should be returned by the collection.
    """
    filter: ProjectStatusConfigFilter

    """The method to use when ordering \`ProjectStatusConfig\`."""
    orderBy: [ProjectStatusConfigOrderBy!] = [PRIMARY_KEY_ASC]
  ): ProjectStatusConfigConnection!
}

"""
A condition to be used against \`ProjectStatusConfig\` object types. All fields
are tested for equality and combined with a logical ‘and.’
"""
input ProjectStatusConfigCondition {
  """Checks for equality with the object’s \`rowId\` field."""
  rowId: UUID

  """Checks for equality with the object’s \`projectId\` field."""
  projectId: UUID

  """Checks for equality with the object’s \`statusTemplateId\` field."""
  statusTemplateId: UUID

  """Checks for equality with the object’s \`customColor\` field."""
  customColor: String

  """Checks for equality with the object’s \`customDescription\` field."""
  customDescription: String

  """Checks for equality with the object’s \`isEnabled\` field."""
  isEnabled: Boolean

  """Checks for equality with the object’s \`isDefault\` field."""
  isDefault: Boolean

  """Checks for equality with the object’s \`sortOrder\` field."""
  sortOrder: Int

  """Checks for equality with the object’s \`createdAt\` field."""
  createdAt: Datetime
}

"""Methods to use when ordering \`ProjectStatusConfig\`."""
enum ProjectStatusConfigOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ROW_ID_ASC
  ROW_ID_DESC
  PROJECT_ID_ASC
  PROJECT_ID_DESC
  STATUS_TEMPLATE_ID_ASC
  STATUS_TEMPLATE_ID_DESC
  CUSTOM_COLOR_ASC
  CUSTOM_COLOR_DESC
  CUSTOM_DESCRIPTION_ASC
  CUSTOM_DESCRIPTION_DESC
  IS_ENABLED_ASC
  IS_ENABLED_DESC
  IS_DEFAULT_ASC
  IS_DEFAULT_DESC
  SORT_ORDER_ASC
  SORT_ORDER_DESC
  CREATED_AT_ASC
  CREATED_AT_DESC
}

"""A \`ProjectStatusConfig\` edge in the connection."""
type ProjectStatusConfigEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`ProjectStatusConfig\` at the end of the edge."""
  node: ProjectStatusConfig
}

type ProjectStatusConfigAggregates {
  keys: [String]

  """
  Sum aggregates across the matching connection (ignoring before/after/first/last/offset)
  """
  sum: ProjectStatusConfigSumAggregates

  """
  Distinct count aggregates across the matching connection (ignoring before/after/first/last/offset)
  """
  distinctCount: ProjectStatusConfigDistinctCountAggregates

  """
  Minimum aggregates across the matching connection (ignoring before/after/first/last/offset)
  """
  min: ProjectStatusConfigMinAggregates

  """
  Maximum aggregates across the matching connection (ignoring before/after/first/last/offset)
  """
  max: ProjectStatusConfigMaxAggregates

  """
  Mean average aggregates across the matching connection (ignoring before/after/first/last/offset)
  """
  average: ProjectStatusConfigAverageAggregates

  """
  Sample standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset)
  """
  stddevSample: ProjectStatusConfigStddevSampleAggregates

  """
  Population standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset)
  """
  stddevPopulation: ProjectStatusConfigStddevPopulationAggregates

  """
  Sample variance aggregates across the matching connection (ignoring before/after/first/last/offset)
  """
  varianceSample: ProjectStatusConfigVarianceSampleAggregates

  """
  Population variance aggregates across the matching connection (ignoring before/after/first/last/offset)
  """
  variancePopulation: ProjectStatusConfigVariancePopulationAggregates
}

type ProjectStatusConfigSumAggregates {
  """Sum of sortOrder across the matching connection"""
  sortOrder: BigInt!
}

type ProjectStatusConfigDistinctCountAggregates {
  """Distinct count of rowId across the matching connection"""
  rowId: BigInt

  """Distinct count of projectId across the matching connection"""
  projectId: BigInt

  """Distinct count of statusTemplateId across the matching connection"""
  statusTemplateId: BigInt

  """Distinct count of customColor across the matching connection"""
  customColor: BigInt

  """Distinct count of customDescription across the matching connection"""
  customDescription: BigInt

  """Distinct count of isEnabled across the matching connection"""
  isEnabled: BigInt

  """Distinct count of isDefault across the matching connection"""
  isDefault: BigInt

  """Distinct count of sortOrder across the matching connection"""
  sortOrder: BigInt

  """Distinct count of createdAt across the matching connection"""
  createdAt: BigInt
}

type ProjectStatusConfigMinAggregates {
  """Minimum of sortOrder across the matching connection"""
  sortOrder: Int
}

type ProjectStatusConfigMaxAggregates {
  """Maximum of sortOrder across the matching connection"""
  sortOrder: Int
}

type ProjectStatusConfigAverageAggregates {
  """Mean average of sortOrder across the matching connection"""
  sortOrder: BigFloat
}

type ProjectStatusConfigStddevSampleAggregates {
  """Sample standard deviation of sortOrder across the matching connection"""
  sortOrder: BigFloat
}

type ProjectStatusConfigStddevPopulationAggregates {
  """
  Population standard deviation of sortOrder across the matching connection
  """
  sortOrder: BigFloat
}

type ProjectStatusConfigVarianceSampleAggregates {
  """Sample variance of sortOrder across the matching connection"""
  sortOrder: BigFloat
}

type ProjectStatusConfigVariancePopulationAggregates {
  """Population variance of sortOrder across the matching connection"""
  sortOrder: BigFloat
}

"""
Grouping methods for \`ProjectStatusConfig\` for usage during aggregation.
"""
enum ProjectStatusConfigGroupBy {
  PROJECT_ID
  STATUS_TEMPLATE_ID
  CUSTOM_COLOR
  CUSTOM_DESCRIPTION
  IS_ENABLED
  IS_DEFAULT
  SORT_ORDER
  CREATED_AT
  CREATED_AT_TRUNCATED_TO_HOUR
  CREATED_AT_TRUNCATED_TO_DAY
}

"""Conditions for \`ProjectStatusConfig\` aggregates."""
input ProjectStatusConfigHavingInput {
  AND: [ProjectStatusConfigHavingInput!]
  OR: [ProjectStatusConfigHavingInput!]
  sum: ProjectStatusConfigHavingSumInput
  distinctCount: ProjectStatusConfigHavingDistinctCountInput
  min: ProjectStatusConfigHavingMinInput
  max: ProjectStatusConfigHavingMaxInput
  average: ProjectStatusConfigHavingAverageInput
  stddevSample: ProjectStatusConfigHavingStddevSampleInput
  stddevPopulation: ProjectStatusConfigHavingStddevPopulationInput
  varianceSample: ProjectStatusConfigHavingVarianceSampleInput
  variancePopulation: ProjectStatusConfigHavingVariancePopulationInput
}

input ProjectStatusConfigHavingSumInput {
  sortOrder: HavingIntFilter
  createdAt: HavingDatetimeFilter
}

input ProjectStatusConfigHavingDistinctCountInput {
  sortOrder: HavingIntFilter
  createdAt: HavingDatetimeFilter
}

input ProjectStatusConfigHavingMinInput {
  sortOrder: HavingIntFilter
  createdAt: HavingDatetimeFilter
}

input ProjectStatusConfigHavingMaxInput {
  sortOrder: HavingIntFilter
  createdAt: HavingDatetimeFilter
}

input ProjectStatusConfigHavingAverageInput {
  sortOrder: HavingIntFilter
  createdAt: HavingDatetimeFilter
}

input ProjectStatusConfigHavingStddevSampleInput {
  sortOrder: HavingIntFilter
  createdAt: HavingDatetimeFilter
}

input ProjectStatusConfigHavingStddevPopulationInput {
  sortOrder: HavingIntFilter
  createdAt: HavingDatetimeFilter
}

input ProjectStatusConfigHavingVarianceSampleInput {
  sortOrder: HavingIntFilter
  createdAt: HavingDatetimeFilter
}

input ProjectStatusConfigHavingVariancePopulationInput {
  sortOrder: HavingIntFilter
  createdAt: HavingDatetimeFilter
}

"""A connection to a list of \`ProjectLink\` values."""
type ProjectLinkConnection {
  """A list of \`ProjectLink\` objects."""
  nodes: [ProjectLink]!

  """
  A list of edges which contains the \`ProjectLink\` and cursor to aid in pagination.
  """
  edges: [ProjectLinkEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`ProjectLink\` you could get from the connection."""
  totalCount: Int!

  """
  Aggregates across the matching connection (ignoring before/after/first/last/offset)
  """
  aggregates: ProjectLinkAggregates

  """
  Grouped aggregates across the matching connection (ignoring before/after/first/last/offset)
  """
  groupedAggregates(
    """The method to use when grouping \`ProjectLink\` for these aggregates."""
    groupBy: [ProjectLinkGroupBy!]!

    """Conditions on the grouped aggregates."""
    having: ProjectLinkHavingInput
  ): [ProjectLinkAggregates!]
}

type ProjectLink {
  rowId: UUID!
  projectId: UUID!
  url: String!
  title: String
  order: Int!
  createdAt: Datetime!
  updatedAt: Datetime!

  """Reads a single \`Project\` that is related to this \`ProjectLink\`."""
  project: Project
}

"""A \`ProjectLink\` edge in the connection."""
type ProjectLinkEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`ProjectLink\` at the end of the edge."""
  node: ProjectLink
}

type ProjectLinkAggregates {
  keys: [String]

  """
  Sum aggregates across the matching connection (ignoring before/after/first/last/offset)
  """
  sum: ProjectLinkSumAggregates

  """
  Distinct count aggregates across the matching connection (ignoring before/after/first/last/offset)
  """
  distinctCount: ProjectLinkDistinctCountAggregates

  """
  Minimum aggregates across the matching connection (ignoring before/after/first/last/offset)
  """
  min: ProjectLinkMinAggregates

  """
  Maximum aggregates across the matching connection (ignoring before/after/first/last/offset)
  """
  max: ProjectLinkMaxAggregates

  """
  Mean average aggregates across the matching connection (ignoring before/after/first/last/offset)
  """
  average: ProjectLinkAverageAggregates

  """
  Sample standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset)
  """
  stddevSample: ProjectLinkStddevSampleAggregates

  """
  Population standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset)
  """
  stddevPopulation: ProjectLinkStddevPopulationAggregates

  """
  Sample variance aggregates across the matching connection (ignoring before/after/first/last/offset)
  """
  varianceSample: ProjectLinkVarianceSampleAggregates

  """
  Population variance aggregates across the matching connection (ignoring before/after/first/last/offset)
  """
  variancePopulation: ProjectLinkVariancePopulationAggregates
}

type ProjectLinkSumAggregates {
  """Sum of order across the matching connection"""
  order: BigInt!
}

type ProjectLinkDistinctCountAggregates {
  """Distinct count of rowId across the matching connection"""
  rowId: BigInt

  """Distinct count of projectId across the matching connection"""
  projectId: BigInt

  """Distinct count of url across the matching connection"""
  url: BigInt

  """Distinct count of title across the matching connection"""
  title: BigInt

  """Distinct count of order across the matching connection"""
  order: BigInt

  """Distinct count of createdAt across the matching connection"""
  createdAt: BigInt

  """Distinct count of updatedAt across the matching connection"""
  updatedAt: BigInt
}

type ProjectLinkMinAggregates {
  """Minimum of order across the matching connection"""
  order: Int
}

type ProjectLinkMaxAggregates {
  """Maximum of order across the matching connection"""
  order: Int
}

type ProjectLinkAverageAggregates {
  """Mean average of order across the matching connection"""
  order: BigFloat
}

type ProjectLinkStddevSampleAggregates {
  """Sample standard deviation of order across the matching connection"""
  order: BigFloat
}

type ProjectLinkStddevPopulationAggregates {
  """Population standard deviation of order across the matching connection"""
  order: BigFloat
}

type ProjectLinkVarianceSampleAggregates {
  """Sample variance of order across the matching connection"""
  order: BigFloat
}

type ProjectLinkVariancePopulationAggregates {
  """Population variance of order across the matching connection"""
  order: BigFloat
}

"""Grouping methods for \`ProjectLink\` for usage during aggregation."""
enum ProjectLinkGroupBy {
  PROJECT_ID
  URL
  TITLE
  ORDER
  CREATED_AT
  CREATED_AT_TRUNCATED_TO_HOUR
  CREATED_AT_TRUNCATED_TO_DAY
  UPDATED_AT
  UPDATED_AT_TRUNCATED_TO_HOUR
  UPDATED_AT_TRUNCATED_TO_DAY
}

"""Conditions for \`ProjectLink\` aggregates."""
input ProjectLinkHavingInput {
  AND: [ProjectLinkHavingInput!]
  OR: [ProjectLinkHavingInput!]
  sum: ProjectLinkHavingSumInput
  distinctCount: ProjectLinkHavingDistinctCountInput
  min: ProjectLinkHavingMinInput
  max: ProjectLinkHavingMaxInput
  average: ProjectLinkHavingAverageInput
  stddevSample: ProjectLinkHavingStddevSampleInput
  stddevPopulation: ProjectLinkHavingStddevPopulationInput
  varianceSample: ProjectLinkHavingVarianceSampleInput
  variancePopulation: ProjectLinkHavingVariancePopulationInput
}

input ProjectLinkHavingSumInput {
  order: HavingIntFilter
  createdAt: HavingDatetimeFilter
  updatedAt: HavingDatetimeFilter
}

input ProjectLinkHavingDistinctCountInput {
  order: HavingIntFilter
  createdAt: HavingDatetimeFilter
  updatedAt: HavingDatetimeFilter
}

input ProjectLinkHavingMinInput {
  order: HavingIntFilter
  createdAt: HavingDatetimeFilter
  updatedAt: HavingDatetimeFilter
}

input ProjectLinkHavingMaxInput {
  order: HavingIntFilter
  createdAt: HavingDatetimeFilter
  updatedAt: HavingDatetimeFilter
}

input ProjectLinkHavingAverageInput {
  order: HavingIntFilter
  createdAt: HavingDatetimeFilter
  updatedAt: HavingDatetimeFilter
}

input ProjectLinkHavingStddevSampleInput {
  order: HavingIntFilter
  createdAt: HavingDatetimeFilter
  updatedAt: HavingDatetimeFilter
}

input ProjectLinkHavingStddevPopulationInput {
  order: HavingIntFilter
  createdAt: HavingDatetimeFilter
  updatedAt: HavingDatetimeFilter
}

input ProjectLinkHavingVarianceSampleInput {
  order: HavingIntFilter
  createdAt: HavingDatetimeFilter
  updatedAt: HavingDatetimeFilter
}

input ProjectLinkHavingVariancePopulationInput {
  order: HavingIntFilter
  createdAt: HavingDatetimeFilter
  updatedAt: HavingDatetimeFilter
}

"""
A condition to be used against \`ProjectLink\` object types. All fields are tested
for equality and combined with a logical ‘and.’
"""
input ProjectLinkCondition {
  """Checks for equality with the object’s \`rowId\` field."""
  rowId: UUID

  """Checks for equality with the object’s \`projectId\` field."""
  projectId: UUID

  """Checks for equality with the object’s \`url\` field."""
  url: String

  """Checks for equality with the object’s \`title\` field."""
  title: String

  """Checks for equality with the object’s \`order\` field."""
  order: Int

  """Checks for equality with the object’s \`createdAt\` field."""
  createdAt: Datetime

  """Checks for equality with the object’s \`updatedAt\` field."""
  updatedAt: Datetime
}

"""Methods to use when ordering \`ProjectLink\`."""
enum ProjectLinkOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ROW_ID_ASC
  ROW_ID_DESC
  PROJECT_ID_ASC
  PROJECT_ID_DESC
  URL_ASC
  URL_DESC
  TITLE_ASC
  TITLE_DESC
  ORDER_ASC
  ORDER_DESC
  CREATED_AT_ASC
  CREATED_AT_DESC
  UPDATED_AT_ASC
  UPDATED_AT_DESC
}

type User {
  rowId: UUID!
  identityProviderId: UUID!
  username: String
  email: String!
  createdAt: Datetime!
  updatedAt: Datetime!
  name: String!
  avatarUrl: String

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

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: CommentCondition

    """
    A filter to be used in determining which values should be returned by the collection.
    """
    filter: CommentFilter

    """The method to use when ordering \`Comment\`."""
    orderBy: [CommentOrderBy!] = [PRIMARY_KEY_ASC]
  ): CommentConnection!

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

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: PostCondition

    """
    A filter to be used in determining which values should be returned by the collection.
    """
    filter: PostFilter

    """The method to use when ordering \`Post\`."""
    orderBy: [PostOrderBy!] = [PRIMARY_KEY_ASC]
  ): PostConnection!

  """Reads and enables pagination through a set of \`Vote\`."""
  votes(
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

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: VoteCondition

    """
    A filter to be used in determining which values should be returned by the collection.
    """
    filter: VoteFilter

    """The method to use when ordering \`Vote\`."""
    orderBy: [VoteOrderBy!] = [PRIMARY_KEY_ASC]
  ): VoteConnection!
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

  """Distinct count of parentId across the matching connection"""
  parentId: BigInt

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
  PARENT_ID
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

  """Checks for equality with the object’s \`parentId\` field."""
  parentId: UUID

  """Checks for equality with the object’s \`createdAt\` field."""
  createdAt: Datetime

  """Checks for equality with the object’s \`updatedAt\` field."""
  updatedAt: Datetime
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
  PARENT_ID_ASC
  PARENT_ID_DESC
  CREATED_AT_ASC
  CREATED_AT_DESC
  UPDATED_AT_ASC
  UPDATED_AT_DESC
  CHILD_COMMENTS_COUNT_ASC
  CHILD_COMMENTS_COUNT_DESC
  CHILD_COMMENTS_DISTINCT_COUNT_ROW_ID_ASC
  CHILD_COMMENTS_DISTINCT_COUNT_ROW_ID_DESC
  CHILD_COMMENTS_DISTINCT_COUNT_MESSAGE_ASC
  CHILD_COMMENTS_DISTINCT_COUNT_MESSAGE_DESC
  CHILD_COMMENTS_DISTINCT_COUNT_POST_ID_ASC
  CHILD_COMMENTS_DISTINCT_COUNT_POST_ID_DESC
  CHILD_COMMENTS_DISTINCT_COUNT_USER_ID_ASC
  CHILD_COMMENTS_DISTINCT_COUNT_USER_ID_DESC
  CHILD_COMMENTS_DISTINCT_COUNT_PARENT_ID_ASC
  CHILD_COMMENTS_DISTINCT_COUNT_PARENT_ID_DESC
  CHILD_COMMENTS_DISTINCT_COUNT_CREATED_AT_ASC
  CHILD_COMMENTS_DISTINCT_COUNT_CREATED_AT_DESC
  CHILD_COMMENTS_DISTINCT_COUNT_UPDATED_AT_ASC
  CHILD_COMMENTS_DISTINCT_COUNT_UPDATED_AT_DESC
}

"""A connection to a list of \`Vote\` values."""
type VoteConnection {
  """A list of \`Vote\` objects."""
  nodes: [Vote]!

  """
  A list of edges which contains the \`Vote\` and cursor to aid in pagination.
  """
  edges: [VoteEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`Vote\` you could get from the connection."""
  totalCount: Int!

  """
  Aggregates across the matching connection (ignoring before/after/first/last/offset)
  """
  aggregates: VoteAggregates

  """
  Grouped aggregates across the matching connection (ignoring before/after/first/last/offset)
  """
  groupedAggregates(
    """The method to use when grouping \`Vote\` for these aggregates."""
    groupBy: [VoteGroupBy!]!

    """Conditions on the grouped aggregates."""
    having: VoteHavingInput
  ): [VoteAggregates!]
}

type Vote {
  rowId: UUID!
  postId: UUID!
  userId: UUID!
  voteType: VoteType!
  createdAt: Datetime!
  updatedAt: Datetime!

  """Reads a single \`Post\` that is related to this \`Vote\`."""
  post: Post

  """Reads a single \`User\` that is related to this \`Vote\`."""
  user: User
}

"""A \`Vote\` edge in the connection."""
type VoteEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`Vote\` at the end of the edge."""
  node: Vote
}

type VoteAggregates {
  keys: [String]

  """
  Distinct count aggregates across the matching connection (ignoring before/after/first/last/offset)
  """
  distinctCount: VoteDistinctCountAggregates
}

type VoteDistinctCountAggregates {
  """Distinct count of rowId across the matching connection"""
  rowId: BigInt

  """Distinct count of postId across the matching connection"""
  postId: BigInt

  """Distinct count of userId across the matching connection"""
  userId: BigInt

  """Distinct count of voteType across the matching connection"""
  voteType: BigInt

  """Distinct count of createdAt across the matching connection"""
  createdAt: BigInt

  """Distinct count of updatedAt across the matching connection"""
  updatedAt: BigInt
}

"""Grouping methods for \`Vote\` for usage during aggregation."""
enum VoteGroupBy {
  POST_ID
  USER_ID
  VOTE_TYPE
  CREATED_AT
  CREATED_AT_TRUNCATED_TO_HOUR
  CREATED_AT_TRUNCATED_TO_DAY
  UPDATED_AT
  UPDATED_AT_TRUNCATED_TO_HOUR
  UPDATED_AT_TRUNCATED_TO_DAY
}

"""Conditions for \`Vote\` aggregates."""
input VoteHavingInput {
  AND: [VoteHavingInput!]
  OR: [VoteHavingInput!]
  sum: VoteHavingSumInput
  distinctCount: VoteHavingDistinctCountInput
  min: VoteHavingMinInput
  max: VoteHavingMaxInput
  average: VoteHavingAverageInput
  stddevSample: VoteHavingStddevSampleInput
  stddevPopulation: VoteHavingStddevPopulationInput
  varianceSample: VoteHavingVarianceSampleInput
  variancePopulation: VoteHavingVariancePopulationInput
}

input VoteHavingSumInput {
  createdAt: HavingDatetimeFilter
  updatedAt: HavingDatetimeFilter
}

input VoteHavingDistinctCountInput {
  createdAt: HavingDatetimeFilter
  updatedAt: HavingDatetimeFilter
}

input VoteHavingMinInput {
  createdAt: HavingDatetimeFilter
  updatedAt: HavingDatetimeFilter
}

input VoteHavingMaxInput {
  createdAt: HavingDatetimeFilter
  updatedAt: HavingDatetimeFilter
}

input VoteHavingAverageInput {
  createdAt: HavingDatetimeFilter
  updatedAt: HavingDatetimeFilter
}

input VoteHavingStddevSampleInput {
  createdAt: HavingDatetimeFilter
  updatedAt: HavingDatetimeFilter
}

input VoteHavingStddevPopulationInput {
  createdAt: HavingDatetimeFilter
  updatedAt: HavingDatetimeFilter
}

input VoteHavingVarianceSampleInput {
  createdAt: HavingDatetimeFilter
  updatedAt: HavingDatetimeFilter
}

input VoteHavingVariancePopulationInput {
  createdAt: HavingDatetimeFilter
  updatedAt: HavingDatetimeFilter
}

"""
A condition to be used against \`Vote\` object types. All fields are tested for equality and combined with a logical ‘and.’
"""
input VoteCondition {
  """Checks for equality with the object’s \`rowId\` field."""
  rowId: UUID

  """Checks for equality with the object’s \`postId\` field."""
  postId: UUID

  """Checks for equality with the object’s \`userId\` field."""
  userId: UUID

  """Checks for equality with the object’s \`voteType\` field."""
  voteType: VoteType

  """Checks for equality with the object’s \`createdAt\` field."""
  createdAt: Datetime

  """Checks for equality with the object’s \`updatedAt\` field."""
  updatedAt: Datetime
}

"""Methods to use when ordering \`Vote\`."""
enum VoteOrderBy {
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

"""A connection to a list of \`StatusTemplate\` values."""
type StatusTemplateConnection {
  """A list of \`StatusTemplate\` objects."""
  nodes: [StatusTemplate]!

  """
  A list of edges which contains the \`StatusTemplate\` and cursor to aid in pagination.
  """
  edges: [StatusTemplateEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`StatusTemplate\` you could get from the connection."""
  totalCount: Int!

  """
  Aggregates across the matching connection (ignoring before/after/first/last/offset)
  """
  aggregates: StatusTemplateAggregates

  """
  Grouped aggregates across the matching connection (ignoring before/after/first/last/offset)
  """
  groupedAggregates(
    """The method to use when grouping \`StatusTemplate\` for these aggregates."""
    groupBy: [StatusTemplateGroupBy!]!

    """Conditions on the grouped aggregates."""
    having: StatusTemplateHavingInput
  ): [StatusTemplateAggregates!]
}

"""A \`StatusTemplate\` edge in the connection."""
type StatusTemplateEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`StatusTemplate\` at the end of the edge."""
  node: StatusTemplate
}

type StatusTemplateAggregates {
  keys: [String]

  """
  Sum aggregates across the matching connection (ignoring before/after/first/last/offset)
  """
  sum: StatusTemplateSumAggregates

  """
  Distinct count aggregates across the matching connection (ignoring before/after/first/last/offset)
  """
  distinctCount: StatusTemplateDistinctCountAggregates

  """
  Minimum aggregates across the matching connection (ignoring before/after/first/last/offset)
  """
  min: StatusTemplateMinAggregates

  """
  Maximum aggregates across the matching connection (ignoring before/after/first/last/offset)
  """
  max: StatusTemplateMaxAggregates

  """
  Mean average aggregates across the matching connection (ignoring before/after/first/last/offset)
  """
  average: StatusTemplateAverageAggregates

  """
  Sample standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset)
  """
  stddevSample: StatusTemplateStddevSampleAggregates

  """
  Population standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset)
  """
  stddevPopulation: StatusTemplateStddevPopulationAggregates

  """
  Sample variance aggregates across the matching connection (ignoring before/after/first/last/offset)
  """
  varianceSample: StatusTemplateVarianceSampleAggregates

  """
  Population variance aggregates across the matching connection (ignoring before/after/first/last/offset)
  """
  variancePopulation: StatusTemplateVariancePopulationAggregates
}

type StatusTemplateSumAggregates {
  """Sum of sortOrder across the matching connection"""
  sortOrder: BigInt!
}

type StatusTemplateDistinctCountAggregates {
  """Distinct count of rowId across the matching connection"""
  rowId: BigInt

  """Distinct count of organizationId across the matching connection"""
  organizationId: BigInt

  """Distinct count of name across the matching connection"""
  name: BigInt

  """Distinct count of displayName across the matching connection"""
  displayName: BigInt

  """Distinct count of color across the matching connection"""
  color: BigInt

  """Distinct count of description across the matching connection"""
  description: BigInt

  """Distinct count of sortOrder across the matching connection"""
  sortOrder: BigInt

  """Distinct count of createdAt across the matching connection"""
  createdAt: BigInt

  """Distinct count of updatedAt across the matching connection"""
  updatedAt: BigInt
}

type StatusTemplateMinAggregates {
  """Minimum of sortOrder across the matching connection"""
  sortOrder: Int
}

type StatusTemplateMaxAggregates {
  """Maximum of sortOrder across the matching connection"""
  sortOrder: Int
}

type StatusTemplateAverageAggregates {
  """Mean average of sortOrder across the matching connection"""
  sortOrder: BigFloat
}

type StatusTemplateStddevSampleAggregates {
  """Sample standard deviation of sortOrder across the matching connection"""
  sortOrder: BigFloat
}

type StatusTemplateStddevPopulationAggregates {
  """
  Population standard deviation of sortOrder across the matching connection
  """
  sortOrder: BigFloat
}

type StatusTemplateVarianceSampleAggregates {
  """Sample variance of sortOrder across the matching connection"""
  sortOrder: BigFloat
}

type StatusTemplateVariancePopulationAggregates {
  """Population variance of sortOrder across the matching connection"""
  sortOrder: BigFloat
}

"""Grouping methods for \`StatusTemplate\` for usage during aggregation."""
enum StatusTemplateGroupBy {
  ORGANIZATION_ID
  NAME
  DISPLAY_NAME
  COLOR
  DESCRIPTION
  SORT_ORDER
  CREATED_AT
  CREATED_AT_TRUNCATED_TO_HOUR
  CREATED_AT_TRUNCATED_TO_DAY
  UPDATED_AT
  UPDATED_AT_TRUNCATED_TO_HOUR
  UPDATED_AT_TRUNCATED_TO_DAY
}

"""Conditions for \`StatusTemplate\` aggregates."""
input StatusTemplateHavingInput {
  AND: [StatusTemplateHavingInput!]
  OR: [StatusTemplateHavingInput!]
  sum: StatusTemplateHavingSumInput
  distinctCount: StatusTemplateHavingDistinctCountInput
  min: StatusTemplateHavingMinInput
  max: StatusTemplateHavingMaxInput
  average: StatusTemplateHavingAverageInput
  stddevSample: StatusTemplateHavingStddevSampleInput
  stddevPopulation: StatusTemplateHavingStddevPopulationInput
  varianceSample: StatusTemplateHavingVarianceSampleInput
  variancePopulation: StatusTemplateHavingVariancePopulationInput
}

input StatusTemplateHavingSumInput {
  sortOrder: HavingIntFilter
  createdAt: HavingDatetimeFilter
  updatedAt: HavingDatetimeFilter
}

input StatusTemplateHavingDistinctCountInput {
  sortOrder: HavingIntFilter
  createdAt: HavingDatetimeFilter
  updatedAt: HavingDatetimeFilter
}

input StatusTemplateHavingMinInput {
  sortOrder: HavingIntFilter
  createdAt: HavingDatetimeFilter
  updatedAt: HavingDatetimeFilter
}

input StatusTemplateHavingMaxInput {
  sortOrder: HavingIntFilter
  createdAt: HavingDatetimeFilter
  updatedAt: HavingDatetimeFilter
}

input StatusTemplateHavingAverageInput {
  sortOrder: HavingIntFilter
  createdAt: HavingDatetimeFilter
  updatedAt: HavingDatetimeFilter
}

input StatusTemplateHavingStddevSampleInput {
  sortOrder: HavingIntFilter
  createdAt: HavingDatetimeFilter
  updatedAt: HavingDatetimeFilter
}

input StatusTemplateHavingStddevPopulationInput {
  sortOrder: HavingIntFilter
  createdAt: HavingDatetimeFilter
  updatedAt: HavingDatetimeFilter
}

input StatusTemplateHavingVarianceSampleInput {
  sortOrder: HavingIntFilter
  createdAt: HavingDatetimeFilter
  updatedAt: HavingDatetimeFilter
}

input StatusTemplateHavingVariancePopulationInput {
  sortOrder: HavingIntFilter
  createdAt: HavingDatetimeFilter
  updatedAt: HavingDatetimeFilter
}

"""
A condition to be used against \`StatusTemplate\` object types. All fields are
tested for equality and combined with a logical ‘and.’
"""
input StatusTemplateCondition {
  """Checks for equality with the object’s \`rowId\` field."""
  rowId: UUID

  """Checks for equality with the object’s \`organizationId\` field."""
  organizationId: UUID

  """Checks for equality with the object’s \`name\` field."""
  name: String

  """Checks for equality with the object’s \`displayName\` field."""
  displayName: String

  """Checks for equality with the object’s \`color\` field."""
  color: String

  """Checks for equality with the object’s \`description\` field."""
  description: String

  """Checks for equality with the object’s \`sortOrder\` field."""
  sortOrder: Int

  """Checks for equality with the object’s \`createdAt\` field."""
  createdAt: Datetime

  """Checks for equality with the object’s \`updatedAt\` field."""
  updatedAt: Datetime
}

"""Methods to use when ordering \`StatusTemplate\`."""
enum StatusTemplateOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ROW_ID_ASC
  ROW_ID_DESC
  ORGANIZATION_ID_ASC
  ORGANIZATION_ID_DESC
  NAME_ASC
  NAME_DESC
  DISPLAY_NAME_ASC
  DISPLAY_NAME_DESC
  COLOR_ASC
  COLOR_DESC
  DESCRIPTION_ASC
  DESCRIPTION_DESC
  SORT_ORDER_ASC
  SORT_ORDER_DESC
  CREATED_AT_ASC
  CREATED_AT_DESC
  UPDATED_AT_ASC
  UPDATED_AT_DESC
  POSTS_COUNT_ASC
  POSTS_COUNT_DESC
  POSTS_SUM_NUMBER_ASC
  POSTS_SUM_NUMBER_DESC
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
  POSTS_DISTINCT_COUNT_STATUS_TEMPLATE_ID_ASC
  POSTS_DISTINCT_COUNT_STATUS_TEMPLATE_ID_DESC
  POSTS_DISTINCT_COUNT_STATUS_UPDATED_AT_ASC
  POSTS_DISTINCT_COUNT_STATUS_UPDATED_AT_DESC
  POSTS_DISTINCT_COUNT_CREATED_AT_ASC
  POSTS_DISTINCT_COUNT_CREATED_AT_DESC
  POSTS_DISTINCT_COUNT_UPDATED_AT_ASC
  POSTS_DISTINCT_COUNT_UPDATED_AT_DESC
  POSTS_DISTINCT_COUNT_NUMBER_ASC
  POSTS_DISTINCT_COUNT_NUMBER_DESC
  POSTS_MIN_NUMBER_ASC
  POSTS_MIN_NUMBER_DESC
  POSTS_MAX_NUMBER_ASC
  POSTS_MAX_NUMBER_DESC
  POSTS_AVERAGE_NUMBER_ASC
  POSTS_AVERAGE_NUMBER_DESC
  POSTS_STDDEV_SAMPLE_NUMBER_ASC
  POSTS_STDDEV_SAMPLE_NUMBER_DESC
  POSTS_STDDEV_POPULATION_NUMBER_ASC
  POSTS_STDDEV_POPULATION_NUMBER_DESC
  POSTS_VARIANCE_SAMPLE_NUMBER_ASC
  POSTS_VARIANCE_SAMPLE_NUMBER_DESC
  POSTS_VARIANCE_POPULATION_NUMBER_ASC
  POSTS_VARIANCE_POPULATION_NUMBER_DESC
  PROJECT_STATUS_CONFIGS_COUNT_ASC
  PROJECT_STATUS_CONFIGS_COUNT_DESC
  PROJECT_STATUS_CONFIGS_SUM_SORT_ORDER_ASC
  PROJECT_STATUS_CONFIGS_SUM_SORT_ORDER_DESC
  PROJECT_STATUS_CONFIGS_DISTINCT_COUNT_ROW_ID_ASC
  PROJECT_STATUS_CONFIGS_DISTINCT_COUNT_ROW_ID_DESC
  PROJECT_STATUS_CONFIGS_DISTINCT_COUNT_PROJECT_ID_ASC
  PROJECT_STATUS_CONFIGS_DISTINCT_COUNT_PROJECT_ID_DESC
  PROJECT_STATUS_CONFIGS_DISTINCT_COUNT_STATUS_TEMPLATE_ID_ASC
  PROJECT_STATUS_CONFIGS_DISTINCT_COUNT_STATUS_TEMPLATE_ID_DESC
  PROJECT_STATUS_CONFIGS_DISTINCT_COUNT_CUSTOM_COLOR_ASC
  PROJECT_STATUS_CONFIGS_DISTINCT_COUNT_CUSTOM_COLOR_DESC
  PROJECT_STATUS_CONFIGS_DISTINCT_COUNT_CUSTOM_DESCRIPTION_ASC
  PROJECT_STATUS_CONFIGS_DISTINCT_COUNT_CUSTOM_DESCRIPTION_DESC
  PROJECT_STATUS_CONFIGS_DISTINCT_COUNT_IS_ENABLED_ASC
  PROJECT_STATUS_CONFIGS_DISTINCT_COUNT_IS_ENABLED_DESC
  PROJECT_STATUS_CONFIGS_DISTINCT_COUNT_IS_DEFAULT_ASC
  PROJECT_STATUS_CONFIGS_DISTINCT_COUNT_IS_DEFAULT_DESC
  PROJECT_STATUS_CONFIGS_DISTINCT_COUNT_SORT_ORDER_ASC
  PROJECT_STATUS_CONFIGS_DISTINCT_COUNT_SORT_ORDER_DESC
  PROJECT_STATUS_CONFIGS_DISTINCT_COUNT_CREATED_AT_ASC
  PROJECT_STATUS_CONFIGS_DISTINCT_COUNT_CREATED_AT_DESC
  PROJECT_STATUS_CONFIGS_MIN_SORT_ORDER_ASC
  PROJECT_STATUS_CONFIGS_MIN_SORT_ORDER_DESC
  PROJECT_STATUS_CONFIGS_MAX_SORT_ORDER_ASC
  PROJECT_STATUS_CONFIGS_MAX_SORT_ORDER_DESC
  PROJECT_STATUS_CONFIGS_AVERAGE_SORT_ORDER_ASC
  PROJECT_STATUS_CONFIGS_AVERAGE_SORT_ORDER_DESC
  PROJECT_STATUS_CONFIGS_STDDEV_SAMPLE_SORT_ORDER_ASC
  PROJECT_STATUS_CONFIGS_STDDEV_SAMPLE_SORT_ORDER_DESC
  PROJECT_STATUS_CONFIGS_STDDEV_POPULATION_SORT_ORDER_ASC
  PROJECT_STATUS_CONFIGS_STDDEV_POPULATION_SORT_ORDER_DESC
  PROJECT_STATUS_CONFIGS_VARIANCE_SAMPLE_SORT_ORDER_ASC
  PROJECT_STATUS_CONFIGS_VARIANCE_SAMPLE_SORT_ORDER_DESC
  PROJECT_STATUS_CONFIGS_VARIANCE_POPULATION_SORT_ORDER_ASC
  PROJECT_STATUS_CONFIGS_VARIANCE_POPULATION_SORT_ORDER_DESC
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

  """Distinct count of identityProviderId across the matching connection"""
  identityProviderId: BigInt

  """Distinct count of username across the matching connection"""
  username: BigInt

  """Distinct count of email across the matching connection"""
  email: BigInt

  """Distinct count of createdAt across the matching connection"""
  createdAt: BigInt

  """Distinct count of updatedAt across the matching connection"""
  updatedAt: BigInt

  """Distinct count of name across the matching connection"""
  name: BigInt

  """Distinct count of avatarUrl across the matching connection"""
  avatarUrl: BigInt
}

"""Grouping methods for \`User\` for usage during aggregation."""
enum UserGroupBy {
  CREATED_AT
  CREATED_AT_TRUNCATED_TO_HOUR
  CREATED_AT_TRUNCATED_TO_DAY
  UPDATED_AT
  UPDATED_AT_TRUNCATED_TO_HOUR
  UPDATED_AT_TRUNCATED_TO_DAY
  NAME
  AVATAR_URL
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

"""
A condition to be used against \`User\` object types. All fields are tested for equality and combined with a logical ‘and.’
"""
input UserCondition {
  """Checks for equality with the object’s \`rowId\` field."""
  rowId: UUID

  """Checks for equality with the object’s \`identityProviderId\` field."""
  identityProviderId: UUID

  """Checks for equality with the object’s \`username\` field."""
  username: String

  """Checks for equality with the object’s \`email\` field."""
  email: String

  """Checks for equality with the object’s \`createdAt\` field."""
  createdAt: Datetime

  """Checks for equality with the object’s \`updatedAt\` field."""
  updatedAt: Datetime

  """Checks for equality with the object’s \`name\` field."""
  name: String

  """Checks for equality with the object’s \`avatarUrl\` field."""
  avatarUrl: String
}

"""Methods to use when ordering \`User\`."""
enum UserOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ROW_ID_ASC
  ROW_ID_DESC
  IDENTITY_PROVIDER_ID_ASC
  IDENTITY_PROVIDER_ID_DESC
  USERNAME_ASC
  USERNAME_DESC
  EMAIL_ASC
  EMAIL_DESC
  CREATED_AT_ASC
  CREATED_AT_DESC
  UPDATED_AT_ASC
  UPDATED_AT_DESC
  NAME_ASC
  NAME_DESC
  AVATAR_URL_ASC
  AVATAR_URL_DESC
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
  COMMENTS_DISTINCT_COUNT_PARENT_ID_ASC
  COMMENTS_DISTINCT_COUNT_PARENT_ID_DESC
  COMMENTS_DISTINCT_COUNT_CREATED_AT_ASC
  COMMENTS_DISTINCT_COUNT_CREATED_AT_DESC
  COMMENTS_DISTINCT_COUNT_UPDATED_AT_ASC
  COMMENTS_DISTINCT_COUNT_UPDATED_AT_DESC
  POSTS_COUNT_ASC
  POSTS_COUNT_DESC
  POSTS_SUM_NUMBER_ASC
  POSTS_SUM_NUMBER_DESC
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
  POSTS_DISTINCT_COUNT_STATUS_TEMPLATE_ID_ASC
  POSTS_DISTINCT_COUNT_STATUS_TEMPLATE_ID_DESC
  POSTS_DISTINCT_COUNT_STATUS_UPDATED_AT_ASC
  POSTS_DISTINCT_COUNT_STATUS_UPDATED_AT_DESC
  POSTS_DISTINCT_COUNT_CREATED_AT_ASC
  POSTS_DISTINCT_COUNT_CREATED_AT_DESC
  POSTS_DISTINCT_COUNT_UPDATED_AT_ASC
  POSTS_DISTINCT_COUNT_UPDATED_AT_DESC
  POSTS_DISTINCT_COUNT_NUMBER_ASC
  POSTS_DISTINCT_COUNT_NUMBER_DESC
  POSTS_MIN_NUMBER_ASC
  POSTS_MIN_NUMBER_DESC
  POSTS_MAX_NUMBER_ASC
  POSTS_MAX_NUMBER_DESC
  POSTS_AVERAGE_NUMBER_ASC
  POSTS_AVERAGE_NUMBER_DESC
  POSTS_STDDEV_SAMPLE_NUMBER_ASC
  POSTS_STDDEV_SAMPLE_NUMBER_DESC
  POSTS_STDDEV_POPULATION_NUMBER_ASC
  POSTS_STDDEV_POPULATION_NUMBER_DESC
  POSTS_VARIANCE_SAMPLE_NUMBER_ASC
  POSTS_VARIANCE_SAMPLE_NUMBER_DESC
  POSTS_VARIANCE_POPULATION_NUMBER_ASC
  POSTS_VARIANCE_POPULATION_NUMBER_DESC
  VOTES_COUNT_ASC
  VOTES_COUNT_DESC
  VOTES_DISTINCT_COUNT_ROW_ID_ASC
  VOTES_DISTINCT_COUNT_ROW_ID_DESC
  VOTES_DISTINCT_COUNT_POST_ID_ASC
  VOTES_DISTINCT_COUNT_POST_ID_DESC
  VOTES_DISTINCT_COUNT_USER_ID_ASC
  VOTES_DISTINCT_COUNT_USER_ID_DESC
  VOTES_DISTINCT_COUNT_VOTE_TYPE_ASC
  VOTES_DISTINCT_COUNT_VOTE_TYPE_DESC
  VOTES_DISTINCT_COUNT_CREATED_AT_ASC
  VOTES_DISTINCT_COUNT_CREATED_AT_DESC
  VOTES_DISTINCT_COUNT_UPDATED_AT_ASC
  VOTES_DISTINCT_COUNT_UPDATED_AT_DESC
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
  """Sum of nextPostNumber across the matching connection"""
  nextPostNumber: BigInt!
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

  """Distinct count of nextPostNumber across the matching connection"""
  nextPostNumber: BigInt

  """Distinct count of prefix across the matching connection"""
  prefix: BigInt

  """Distinct count of isPublic across the matching connection"""
  isPublic: BigInt
}

type ProjectMinAggregates {
  """Minimum of nextPostNumber across the matching connection"""
  nextPostNumber: Int
}

type ProjectMaxAggregates {
  """Maximum of nextPostNumber across the matching connection"""
  nextPostNumber: Int
}

type ProjectAverageAggregates {
  """Mean average of nextPostNumber across the matching connection"""
  nextPostNumber: BigFloat
}

type ProjectStddevSampleAggregates {
  """
  Sample standard deviation of nextPostNumber across the matching connection
  """
  nextPostNumber: BigFloat
}

type ProjectStddevPopulationAggregates {
  """
  Population standard deviation of nextPostNumber across the matching connection
  """
  nextPostNumber: BigFloat
}

type ProjectVarianceSampleAggregates {
  """Sample variance of nextPostNumber across the matching connection"""
  nextPostNumber: BigFloat
}

type ProjectVariancePopulationAggregates {
  """Population variance of nextPostNumber across the matching connection"""
  nextPostNumber: BigFloat
}

"""Grouping methods for \`Project\` for usage during aggregation."""
enum ProjectGroupBy {
  NAME
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
  NEXT_POST_NUMBER
  PREFIX
  IS_PUBLIC
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
  nextPostNumber: HavingIntFilter
}

input ProjectHavingDistinctCountInput {
  createdAt: HavingDatetimeFilter
  updatedAt: HavingDatetimeFilter
  nextPostNumber: HavingIntFilter
}

input ProjectHavingMinInput {
  createdAt: HavingDatetimeFilter
  updatedAt: HavingDatetimeFilter
  nextPostNumber: HavingIntFilter
}

input ProjectHavingMaxInput {
  createdAt: HavingDatetimeFilter
  updatedAt: HavingDatetimeFilter
  nextPostNumber: HavingIntFilter
}

input ProjectHavingAverageInput {
  createdAt: HavingDatetimeFilter
  updatedAt: HavingDatetimeFilter
  nextPostNumber: HavingIntFilter
}

input ProjectHavingStddevSampleInput {
  createdAt: HavingDatetimeFilter
  updatedAt: HavingDatetimeFilter
  nextPostNumber: HavingIntFilter
}

input ProjectHavingStddevPopulationInput {
  createdAt: HavingDatetimeFilter
  updatedAt: HavingDatetimeFilter
  nextPostNumber: HavingIntFilter
}

input ProjectHavingVarianceSampleInput {
  createdAt: HavingDatetimeFilter
  updatedAt: HavingDatetimeFilter
  nextPostNumber: HavingIntFilter
}

input ProjectHavingVariancePopulationInput {
  createdAt: HavingDatetimeFilter
  updatedAt: HavingDatetimeFilter
  nextPostNumber: HavingIntFilter
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

  """Checks for equality with the object’s \`nextPostNumber\` field."""
  nextPostNumber: Int

  """Checks for equality with the object’s \`prefix\` field."""
  prefix: String

  """Checks for equality with the object’s \`isPublic\` field."""
  isPublic: Boolean
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
  NEXT_POST_NUMBER_ASC
  NEXT_POST_NUMBER_DESC
  PREFIX_ASC
  PREFIX_DESC
  IS_PUBLIC_ASC
  IS_PUBLIC_DESC
  POSTS_COUNT_ASC
  POSTS_COUNT_DESC
  POSTS_SUM_NUMBER_ASC
  POSTS_SUM_NUMBER_DESC
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
  POSTS_DISTINCT_COUNT_STATUS_TEMPLATE_ID_ASC
  POSTS_DISTINCT_COUNT_STATUS_TEMPLATE_ID_DESC
  POSTS_DISTINCT_COUNT_STATUS_UPDATED_AT_ASC
  POSTS_DISTINCT_COUNT_STATUS_UPDATED_AT_DESC
  POSTS_DISTINCT_COUNT_CREATED_AT_ASC
  POSTS_DISTINCT_COUNT_CREATED_AT_DESC
  POSTS_DISTINCT_COUNT_UPDATED_AT_ASC
  POSTS_DISTINCT_COUNT_UPDATED_AT_DESC
  POSTS_DISTINCT_COUNT_NUMBER_ASC
  POSTS_DISTINCT_COUNT_NUMBER_DESC
  POSTS_MIN_NUMBER_ASC
  POSTS_MIN_NUMBER_DESC
  POSTS_MAX_NUMBER_ASC
  POSTS_MAX_NUMBER_DESC
  POSTS_AVERAGE_NUMBER_ASC
  POSTS_AVERAGE_NUMBER_DESC
  POSTS_STDDEV_SAMPLE_NUMBER_ASC
  POSTS_STDDEV_SAMPLE_NUMBER_DESC
  POSTS_STDDEV_POPULATION_NUMBER_ASC
  POSTS_STDDEV_POPULATION_NUMBER_DESC
  POSTS_VARIANCE_SAMPLE_NUMBER_ASC
  POSTS_VARIANCE_SAMPLE_NUMBER_DESC
  POSTS_VARIANCE_POPULATION_NUMBER_ASC
  POSTS_VARIANCE_POPULATION_NUMBER_DESC
  PROJECT_STATUS_CONFIGS_COUNT_ASC
  PROJECT_STATUS_CONFIGS_COUNT_DESC
  PROJECT_STATUS_CONFIGS_SUM_SORT_ORDER_ASC
  PROJECT_STATUS_CONFIGS_SUM_SORT_ORDER_DESC
  PROJECT_STATUS_CONFIGS_DISTINCT_COUNT_ROW_ID_ASC
  PROJECT_STATUS_CONFIGS_DISTINCT_COUNT_ROW_ID_DESC
  PROJECT_STATUS_CONFIGS_DISTINCT_COUNT_PROJECT_ID_ASC
  PROJECT_STATUS_CONFIGS_DISTINCT_COUNT_PROJECT_ID_DESC
  PROJECT_STATUS_CONFIGS_DISTINCT_COUNT_STATUS_TEMPLATE_ID_ASC
  PROJECT_STATUS_CONFIGS_DISTINCT_COUNT_STATUS_TEMPLATE_ID_DESC
  PROJECT_STATUS_CONFIGS_DISTINCT_COUNT_CUSTOM_COLOR_ASC
  PROJECT_STATUS_CONFIGS_DISTINCT_COUNT_CUSTOM_COLOR_DESC
  PROJECT_STATUS_CONFIGS_DISTINCT_COUNT_CUSTOM_DESCRIPTION_ASC
  PROJECT_STATUS_CONFIGS_DISTINCT_COUNT_CUSTOM_DESCRIPTION_DESC
  PROJECT_STATUS_CONFIGS_DISTINCT_COUNT_IS_ENABLED_ASC
  PROJECT_STATUS_CONFIGS_DISTINCT_COUNT_IS_ENABLED_DESC
  PROJECT_STATUS_CONFIGS_DISTINCT_COUNT_IS_DEFAULT_ASC
  PROJECT_STATUS_CONFIGS_DISTINCT_COUNT_IS_DEFAULT_DESC
  PROJECT_STATUS_CONFIGS_DISTINCT_COUNT_SORT_ORDER_ASC
  PROJECT_STATUS_CONFIGS_DISTINCT_COUNT_SORT_ORDER_DESC
  PROJECT_STATUS_CONFIGS_DISTINCT_COUNT_CREATED_AT_ASC
  PROJECT_STATUS_CONFIGS_DISTINCT_COUNT_CREATED_AT_DESC
  PROJECT_STATUS_CONFIGS_MIN_SORT_ORDER_ASC
  PROJECT_STATUS_CONFIGS_MIN_SORT_ORDER_DESC
  PROJECT_STATUS_CONFIGS_MAX_SORT_ORDER_ASC
  PROJECT_STATUS_CONFIGS_MAX_SORT_ORDER_DESC
  PROJECT_STATUS_CONFIGS_AVERAGE_SORT_ORDER_ASC
  PROJECT_STATUS_CONFIGS_AVERAGE_SORT_ORDER_DESC
  PROJECT_STATUS_CONFIGS_STDDEV_SAMPLE_SORT_ORDER_ASC
  PROJECT_STATUS_CONFIGS_STDDEV_SAMPLE_SORT_ORDER_DESC
  PROJECT_STATUS_CONFIGS_STDDEV_POPULATION_SORT_ORDER_ASC
  PROJECT_STATUS_CONFIGS_STDDEV_POPULATION_SORT_ORDER_DESC
  PROJECT_STATUS_CONFIGS_VARIANCE_SAMPLE_SORT_ORDER_ASC
  PROJECT_STATUS_CONFIGS_VARIANCE_SAMPLE_SORT_ORDER_DESC
  PROJECT_STATUS_CONFIGS_VARIANCE_POPULATION_SORT_ORDER_ASC
  PROJECT_STATUS_CONFIGS_VARIANCE_POPULATION_SORT_ORDER_DESC
  PROJECT_LINKS_COUNT_ASC
  PROJECT_LINKS_COUNT_DESC
  PROJECT_LINKS_SUM_ORDER_ASC
  PROJECT_LINKS_SUM_ORDER_DESC
  PROJECT_LINKS_DISTINCT_COUNT_ROW_ID_ASC
  PROJECT_LINKS_DISTINCT_COUNT_ROW_ID_DESC
  PROJECT_LINKS_DISTINCT_COUNT_PROJECT_ID_ASC
  PROJECT_LINKS_DISTINCT_COUNT_PROJECT_ID_DESC
  PROJECT_LINKS_DISTINCT_COUNT_URL_ASC
  PROJECT_LINKS_DISTINCT_COUNT_URL_DESC
  PROJECT_LINKS_DISTINCT_COUNT_TITLE_ASC
  PROJECT_LINKS_DISTINCT_COUNT_TITLE_DESC
  PROJECT_LINKS_DISTINCT_COUNT_ORDER_ASC
  PROJECT_LINKS_DISTINCT_COUNT_ORDER_DESC
  PROJECT_LINKS_DISTINCT_COUNT_CREATED_AT_ASC
  PROJECT_LINKS_DISTINCT_COUNT_CREATED_AT_DESC
  PROJECT_LINKS_DISTINCT_COUNT_UPDATED_AT_ASC
  PROJECT_LINKS_DISTINCT_COUNT_UPDATED_AT_DESC
  PROJECT_LINKS_MIN_ORDER_ASC
  PROJECT_LINKS_MIN_ORDER_DESC
  PROJECT_LINKS_MAX_ORDER_ASC
  PROJECT_LINKS_MAX_ORDER_DESC
  PROJECT_LINKS_AVERAGE_ORDER_ASC
  PROJECT_LINKS_AVERAGE_ORDER_DESC
  PROJECT_LINKS_STDDEV_SAMPLE_ORDER_ASC
  PROJECT_LINKS_STDDEV_SAMPLE_ORDER_DESC
  PROJECT_LINKS_STDDEV_POPULATION_ORDER_ASC
  PROJECT_LINKS_STDDEV_POPULATION_ORDER_DESC
  PROJECT_LINKS_VARIANCE_SAMPLE_ORDER_ASC
  PROJECT_LINKS_VARIANCE_SAMPLE_ORDER_DESC
  PROJECT_LINKS_VARIANCE_POPULATION_ORDER_ASC
  PROJECT_LINKS_VARIANCE_POPULATION_ORDER_DESC
}

"""
The root mutation type which contains root level fields which mutate data.
"""
type Mutation {
  """Creates a single \`Comment\`."""
  createComment(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateCommentInput!
  ): CreateCommentPayload

  """Creates a single \`ProjectLink\`."""
  createProjectLink(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateProjectLinkInput!
  ): CreateProjectLinkPayload

  """Creates a single \`StatusTemplate\`."""
  createStatusTemplate(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateStatusTemplateInput!
  ): CreateStatusTemplatePayload

  """Creates a single \`Vote\`."""
  createVote(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateVoteInput!
  ): CreateVotePayload

  """Creates a single \`User\`."""
  createUser(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateUserInput!
  ): CreateUserPayload

  """Creates a single \`ProjectStatusConfig\`."""
  createProjectStatusConfig(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateProjectStatusConfigInput!
  ): CreateProjectStatusConfigPayload

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

  """Updates a single \`Comment\` using a unique key and a patch."""
  updateComment(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateCommentInput!
  ): UpdateCommentPayload

  """Updates a single \`ProjectLink\` using a unique key and a patch."""
  updateProjectLink(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateProjectLinkInput!
  ): UpdateProjectLinkPayload

  """Updates a single \`StatusTemplate\` using a unique key and a patch."""
  updateStatusTemplate(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateStatusTemplateInput!
  ): UpdateStatusTemplatePayload

  """Updates a single \`Vote\` using a unique key and a patch."""
  updateVote(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateVoteInput!
  ): UpdateVotePayload

  """Updates a single \`User\` using a unique key and a patch."""
  updateUser(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateUserInput!
  ): UpdateUserPayload

  """Updates a single \`ProjectStatusConfig\` using a unique key and a patch."""
  updateProjectStatusConfig(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateProjectStatusConfigInput!
  ): UpdateProjectStatusConfigPayload

  """Updates a single \`Post\` using a unique key and a patch."""
  updatePost(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdatePostInput!
  ): UpdatePostPayload

  """Updates a single \`Project\` using a unique key and a patch."""
  updateProject(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateProjectInput!
  ): UpdateProjectPayload

  """Deletes a single \`Comment\` using a unique key."""
  deleteComment(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteCommentInput!
  ): DeleteCommentPayload

  """Deletes a single \`ProjectLink\` using a unique key."""
  deleteProjectLink(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteProjectLinkInput!
  ): DeleteProjectLinkPayload

  """Deletes a single \`StatusTemplate\` using a unique key."""
  deleteStatusTemplate(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteStatusTemplateInput!
  ): DeleteStatusTemplatePayload

  """Deletes a single \`Vote\` using a unique key."""
  deleteVote(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteVoteInput!
  ): DeleteVotePayload

  """Deletes a single \`User\` using a unique key."""
  deleteUser(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteUserInput!
  ): DeleteUserPayload

  """Deletes a single \`ProjectStatusConfig\` using a unique key."""
  deleteProjectStatusConfig(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteProjectStatusConfigInput!
  ): DeleteProjectStatusConfigPayload

  """Deletes a single \`Post\` using a unique key."""
  deletePost(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeletePostInput!
  ): DeletePostPayload

  """Deletes a single \`Project\` using a unique key."""
  deleteProject(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteProjectInput!
  ): DeleteProjectPayload
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
  parentId: UUID
  createdAt: Datetime
  updatedAt: Datetime
}

"""The output of our create \`ProjectLink\` mutation."""
type CreateProjectLinkPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`ProjectLink\` that was created by this mutation."""
  projectLink: ProjectLink

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`ProjectLink\`. May be used by Relay 1."""
  projectLinkEdge(
    """The method to use when ordering \`ProjectLink\`."""
    orderBy: [ProjectLinkOrderBy!]! = [PRIMARY_KEY_ASC]
  ): ProjectLinkEdge
}

"""All input for the create \`ProjectLink\` mutation."""
input CreateProjectLinkInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The \`ProjectLink\` to be created by this mutation."""
  projectLink: ProjectLinkInput!
}

"""An input for mutations affecting \`ProjectLink\`"""
input ProjectLinkInput {
  rowId: UUID
  projectId: UUID!
  url: String!
  title: String
  order: Int
  createdAt: Datetime
  updatedAt: Datetime
}

"""The output of our create \`StatusTemplate\` mutation."""
type CreateStatusTemplatePayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`StatusTemplate\` that was created by this mutation."""
  statusTemplate: StatusTemplate

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`StatusTemplate\`. May be used by Relay 1."""
  statusTemplateEdge(
    """The method to use when ordering \`StatusTemplate\`."""
    orderBy: [StatusTemplateOrderBy!]! = [PRIMARY_KEY_ASC]
  ): StatusTemplateEdge
}

"""All input for the create \`StatusTemplate\` mutation."""
input CreateStatusTemplateInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The \`StatusTemplate\` to be created by this mutation."""
  statusTemplate: StatusTemplateInput!
}

"""An input for mutations affecting \`StatusTemplate\`"""
input StatusTemplateInput {
  rowId: UUID
  organizationId: UUID!
  name: String!
  displayName: String!
  color: String
  description: String
  sortOrder: Int
  createdAt: Datetime
  updatedAt: Datetime
}

"""The output of our create \`Vote\` mutation."""
type CreateVotePayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Vote\` that was created by this mutation."""
  vote: Vote

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Vote\`. May be used by Relay 1."""
  voteEdge(
    """The method to use when ordering \`Vote\`."""
    orderBy: [VoteOrderBy!]! = [PRIMARY_KEY_ASC]
  ): VoteEdge
}

"""All input for the create \`Vote\` mutation."""
input CreateVoteInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The \`Vote\` to be created by this mutation."""
  vote: VoteInput!
}

"""An input for mutations affecting \`Vote\`"""
input VoteInput {
  rowId: UUID
  postId: UUID!
  userId: UUID!
  voteType: VoteType!
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
  identityProviderId: UUID!
  username: String
  email: String!
  createdAt: Datetime
  updatedAt: Datetime
  name: String!
  avatarUrl: String
}

"""The output of our create \`ProjectStatusConfig\` mutation."""
type CreateProjectStatusConfigPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`ProjectStatusConfig\` that was created by this mutation."""
  projectStatusConfig: ProjectStatusConfig

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`ProjectStatusConfig\`. May be used by Relay 1."""
  projectStatusConfigEdge(
    """The method to use when ordering \`ProjectStatusConfig\`."""
    orderBy: [ProjectStatusConfigOrderBy!]! = [PRIMARY_KEY_ASC]
  ): ProjectStatusConfigEdge
}

"""All input for the create \`ProjectStatusConfig\` mutation."""
input CreateProjectStatusConfigInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The \`ProjectStatusConfig\` to be created by this mutation."""
  projectStatusConfig: ProjectStatusConfigInput!
}

"""An input for mutations affecting \`ProjectStatusConfig\`"""
input ProjectStatusConfigInput {
  rowId: UUID
  projectId: UUID!
  statusTemplateId: UUID!
  customColor: String
  customDescription: String
  isEnabled: Boolean
  isDefault: Boolean
  sortOrder: Int
  createdAt: Datetime
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
  statusTemplateId: UUID
  statusUpdatedAt: Datetime
  createdAt: Datetime
  updatedAt: Datetime
  number: Int
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
  name: String!
  image: String
  slug: String!
  description: String
  organizationId: UUID!
  createdAt: Datetime
  updatedAt: Datetime
  nextPostNumber: Int
  prefix: String
  isPublic: Boolean
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

"""
Represents an update to a \`Comment\`. Fields that are set will be updated.
"""
input CommentPatch {
  rowId: UUID
  message: String
  postId: UUID
  userId: UUID
  parentId: UUID
  createdAt: Datetime
  updatedAt: Datetime
}

"""The output of our update \`ProjectLink\` mutation."""
type UpdateProjectLinkPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`ProjectLink\` that was updated by this mutation."""
  projectLink: ProjectLink

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`ProjectLink\`. May be used by Relay 1."""
  projectLinkEdge(
    """The method to use when ordering \`ProjectLink\`."""
    orderBy: [ProjectLinkOrderBy!]! = [PRIMARY_KEY_ASC]
  ): ProjectLinkEdge
}

"""All input for the \`updateProjectLink\` mutation."""
input UpdateProjectLinkInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  rowId: UUID!

  """
  An object where the defined keys will be set on the \`ProjectLink\` being updated.
  """
  patch: ProjectLinkPatch!
}

"""
Represents an update to a \`ProjectLink\`. Fields that are set will be updated.
"""
input ProjectLinkPatch {
  rowId: UUID
  projectId: UUID
  url: String
  title: String
  order: Int
  createdAt: Datetime
  updatedAt: Datetime
}

"""The output of our update \`StatusTemplate\` mutation."""
type UpdateStatusTemplatePayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`StatusTemplate\` that was updated by this mutation."""
  statusTemplate: StatusTemplate

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`StatusTemplate\`. May be used by Relay 1."""
  statusTemplateEdge(
    """The method to use when ordering \`StatusTemplate\`."""
    orderBy: [StatusTemplateOrderBy!]! = [PRIMARY_KEY_ASC]
  ): StatusTemplateEdge
}

"""All input for the \`updateStatusTemplate\` mutation."""
input UpdateStatusTemplateInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  rowId: UUID!

  """
  An object where the defined keys will be set on the \`StatusTemplate\` being updated.
  """
  patch: StatusTemplatePatch!
}

"""
Represents an update to a \`StatusTemplate\`. Fields that are set will be updated.
"""
input StatusTemplatePatch {
  rowId: UUID
  organizationId: UUID
  name: String
  displayName: String
  color: String
  description: String
  sortOrder: Int
  createdAt: Datetime
  updatedAt: Datetime
}

"""The output of our update \`Vote\` mutation."""
type UpdateVotePayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Vote\` that was updated by this mutation."""
  vote: Vote

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Vote\`. May be used by Relay 1."""
  voteEdge(
    """The method to use when ordering \`Vote\`."""
    orderBy: [VoteOrderBy!]! = [PRIMARY_KEY_ASC]
  ): VoteEdge
}

"""All input for the \`updateVote\` mutation."""
input UpdateVoteInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  rowId: UUID!

  """
  An object where the defined keys will be set on the \`Vote\` being updated.
  """
  patch: VotePatch!
}

"""Represents an update to a \`Vote\`. Fields that are set will be updated."""
input VotePatch {
  rowId: UUID
  postId: UUID
  userId: UUID
  voteType: VoteType
  createdAt: Datetime
  updatedAt: Datetime
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
  rowId: UUID!

  """
  An object where the defined keys will be set on the \`User\` being updated.
  """
  patch: UserPatch!
}

"""Represents an update to a \`User\`. Fields that are set will be updated."""
input UserPatch {
  rowId: UUID
  identityProviderId: UUID
  username: String
  email: String
  createdAt: Datetime
  updatedAt: Datetime
  name: String
  avatarUrl: String
}

"""The output of our update \`ProjectStatusConfig\` mutation."""
type UpdateProjectStatusConfigPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`ProjectStatusConfig\` that was updated by this mutation."""
  projectStatusConfig: ProjectStatusConfig

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`ProjectStatusConfig\`. May be used by Relay 1."""
  projectStatusConfigEdge(
    """The method to use when ordering \`ProjectStatusConfig\`."""
    orderBy: [ProjectStatusConfigOrderBy!]! = [PRIMARY_KEY_ASC]
  ): ProjectStatusConfigEdge
}

"""All input for the \`updateProjectStatusConfig\` mutation."""
input UpdateProjectStatusConfigInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  rowId: UUID!

  """
  An object where the defined keys will be set on the \`ProjectStatusConfig\` being updated.
  """
  patch: ProjectStatusConfigPatch!
}

"""
Represents an update to a \`ProjectStatusConfig\`. Fields that are set will be updated.
"""
input ProjectStatusConfigPatch {
  rowId: UUID
  projectId: UUID
  statusTemplateId: UUID
  customColor: String
  customDescription: String
  isEnabled: Boolean
  isDefault: Boolean
  sortOrder: Int
  createdAt: Datetime
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
  rowId: UUID!

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
  statusTemplateId: UUID
  statusUpdatedAt: Datetime
  createdAt: Datetime
  updatedAt: Datetime
  number: Int
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
  rowId: UUID!

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
  nextPostNumber: Int
  prefix: String
  isPublic: Boolean
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

"""All input for the \`deleteComment\` mutation."""
input DeleteCommentInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  rowId: UUID!
}

"""The output of our delete \`ProjectLink\` mutation."""
type DeleteProjectLinkPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`ProjectLink\` that was deleted by this mutation."""
  projectLink: ProjectLink

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`ProjectLink\`. May be used by Relay 1."""
  projectLinkEdge(
    """The method to use when ordering \`ProjectLink\`."""
    orderBy: [ProjectLinkOrderBy!]! = [PRIMARY_KEY_ASC]
  ): ProjectLinkEdge
}

"""All input for the \`deleteProjectLink\` mutation."""
input DeleteProjectLinkInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  rowId: UUID!
}

"""The output of our delete \`StatusTemplate\` mutation."""
type DeleteStatusTemplatePayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`StatusTemplate\` that was deleted by this mutation."""
  statusTemplate: StatusTemplate

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`StatusTemplate\`. May be used by Relay 1."""
  statusTemplateEdge(
    """The method to use when ordering \`StatusTemplate\`."""
    orderBy: [StatusTemplateOrderBy!]! = [PRIMARY_KEY_ASC]
  ): StatusTemplateEdge
}

"""All input for the \`deleteStatusTemplate\` mutation."""
input DeleteStatusTemplateInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  rowId: UUID!
}

"""The output of our delete \`Vote\` mutation."""
type DeleteVotePayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Vote\` that was deleted by this mutation."""
  vote: Vote

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Vote\`. May be used by Relay 1."""
  voteEdge(
    """The method to use when ordering \`Vote\`."""
    orderBy: [VoteOrderBy!]! = [PRIMARY_KEY_ASC]
  ): VoteEdge
}

"""All input for the \`deleteVote\` mutation."""
input DeleteVoteInput {
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
  rowId: UUID!
}

"""The output of our delete \`ProjectStatusConfig\` mutation."""
type DeleteProjectStatusConfigPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`ProjectStatusConfig\` that was deleted by this mutation."""
  projectStatusConfig: ProjectStatusConfig

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`ProjectStatusConfig\`. May be used by Relay 1."""
  projectStatusConfigEdge(
    """The method to use when ordering \`ProjectStatusConfig\`."""
    orderBy: [ProjectStatusConfigOrderBy!]! = [PRIMARY_KEY_ASC]
  ): ProjectStatusConfigEdge
}

"""All input for the \`deleteProjectStatusConfig\` mutation."""
input DeleteProjectStatusConfigInput {
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
  rowId: UUID!
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
  rowId: UUID!
}

"""The currently authenticated user."""
type Observer {
  rowId: UUID!
  identityProviderId: UUID!
  name: String!
  email: String!
  username: String
}`;
export const objects = {
  Query: {
    assertStep() {
      return !0;
    },
    plans: {
      comment(_$root, {
        $rowId
      }) {
        return resource_commentPgResource.get({
          id: $rowId
        });
      },
      comments: {
        plan() {
          return connection(resource_commentPgResource.find());
        },
        args: {
          first: applyFirstArg,
          last: applyLastArg,
          offset: applyOffsetArg,
          before: applyBeforeArg,
          after: applyAfterArg,
          condition: applyConditionArgToConnection,
          filter: Query_commentsfilterApplyPlan,
          orderBy: applyOrderByArgToConnection
        }
      },
      id($parent) {
        const specifier = nodeIdHandler_Query.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_Query.codec.name].encode);
      },
      node(_$root, fieldArgs) {
        return fieldArgs.getRaw("id");
      },
      observer() {
        const $observer = context().get("observer");
        return lambda($observer, observer2 => {
          if (!observer2) return null;
          const result = {};
          for (const field of allFields2) {
            const key = field.contextKey ?? field.name;
            if (key === "rowId") result[key] = observer2.id;else result[key] = observer2[key];
          }
          return result;
        });
      },
      post(_$root, {
        $rowId
      }) {
        return resource_postPgResource.get({
          id: $rowId
        });
      },
      postByProjectIdAndNumber(_$root, {
        $projectId,
        $number
      }) {
        return resource_postPgResource.get({
          project_id: $projectId,
          number: $number
        });
      },
      posts: {
        plan() {
          return connection(resource_postPgResource.find());
        },
        args: {
          first: applyFirstArg,
          last: applyLastArg,
          offset: applyOffsetArg,
          before: applyBeforeArg,
          after: applyAfterArg,
          condition: applyConditionArgToConnection,
          filter: Query_commentsfilterApplyPlan,
          orderBy: applyOrderByArgToConnection
        }
      },
      project(_$root, {
        $rowId
      }) {
        return resource_projectPgResource.get({
          id: $rowId
        });
      },
      projectBySlugAndOrganizationId(_$root, {
        $slug,
        $organizationId
      }) {
        return resource_projectPgResource.get({
          slug: $slug,
          organization_id: $organizationId
        });
      },
      projectLink(_$root, {
        $rowId
      }) {
        return resource_project_linkPgResource.get({
          id: $rowId
        });
      },
      projectLinks: {
        plan() {
          return connection(resource_project_linkPgResource.find());
        },
        args: {
          first: applyFirstArg,
          last: applyLastArg,
          offset: applyOffsetArg,
          before: applyBeforeArg,
          after: applyAfterArg,
          condition: applyConditionArgToConnection,
          filter: Query_commentsfilterApplyPlan,
          orderBy: applyOrderByArgToConnection
        }
      },
      projects: {
        plan() {
          return connection(resource_projectPgResource.find());
        },
        args: {
          first: applyFirstArg,
          last: applyLastArg,
          offset: applyOffsetArg,
          before: applyBeforeArg,
          after: applyAfterArg,
          condition: applyConditionArgToConnection,
          filter: Query_commentsfilterApplyPlan,
          orderBy: applyOrderByArgToConnection
        }
      },
      projectStatusConfig(_$root, {
        $rowId
      }) {
        return resource_project_status_configPgResource.get({
          id: $rowId
        });
      },
      projectStatusConfigByProjectIdAndStatusTemplateId(_$root, {
        $projectId,
        $statusTemplateId
      }) {
        return resource_project_status_configPgResource.get({
          project_id: $projectId,
          status_template_id: $statusTemplateId
        });
      },
      projectStatusConfigs: {
        plan() {
          return connection(resource_project_status_configPgResource.find());
        },
        args: {
          first: applyFirstArg,
          last: applyLastArg,
          offset: applyOffsetArg,
          before: applyBeforeArg,
          after: applyAfterArg,
          condition: applyConditionArgToConnection,
          filter: Query_commentsfilterApplyPlan,
          orderBy: applyOrderByArgToConnection
        }
      },
      query() {
        return rootValue();
      },
      statusTemplate(_$root, {
        $rowId
      }) {
        return resource_status_templatePgResource.get({
          id: $rowId
        });
      },
      statusTemplateByOrganizationIdAndName(_$root, {
        $organizationId,
        $name
      }) {
        return resource_status_templatePgResource.get({
          organization_id: $organizationId,
          name: $name
        });
      },
      statusTemplates: {
        plan() {
          return connection(resource_status_templatePgResource.find());
        },
        args: {
          first: applyFirstArg,
          last: applyLastArg,
          offset: applyOffsetArg,
          before: applyBeforeArg,
          after: applyAfterArg,
          condition: applyConditionArgToConnection,
          filter: Query_commentsfilterApplyPlan,
          orderBy: applyOrderByArgToConnection
        }
      },
      user(_$root, {
        $rowId
      }) {
        return resource_userPgResource.get({
          id: $rowId
        });
      },
      userByEmail(_$root, {
        $email
      }) {
        return resource_userPgResource.get({
          email: $email
        });
      },
      userByIdentityProviderId(_$root, {
        $identityProviderId
      }) {
        return resource_userPgResource.get({
          identity_provider_id: $identityProviderId
        });
      },
      userByUsername(_$root, {
        $username
      }) {
        return resource_userPgResource.get({
          username: $username
        });
      },
      users: {
        plan() {
          return connection(resource_userPgResource.find());
        },
        args: {
          first: applyFirstArg,
          last: applyLastArg,
          offset: applyOffsetArg,
          before: applyBeforeArg,
          after: applyAfterArg,
          condition: applyConditionArgToConnection,
          filter: Query_commentsfilterApplyPlan,
          orderBy: applyOrderByArgToConnection
        }
      },
      vote(_$root, {
        $rowId
      }) {
        return resource_votePgResource.get({
          id: $rowId
        });
      },
      voteByPostIdAndUserId(_$root, {
        $postId,
        $userId
      }) {
        return resource_votePgResource.get({
          post_id: $postId,
          user_id: $userId
        });
      },
      votes: {
        plan() {
          return connection(resource_votePgResource.find());
        },
        args: {
          first: applyFirstArg,
          last: applyLastArg,
          offset: applyOffsetArg,
          before: applyBeforeArg,
          after: applyAfterArg,
          condition: applyConditionArgToConnection,
          filter: Query_commentsfilterApplyPlan,
          orderBy: applyOrderByArgToConnection
        }
      }
    }
  },
  Mutation: {
    assertStep: __ValueStep,
    plans: {
      createComment: {
        plan(...planParams) {
          const smartPlan = (...overrideParams) => {
              const args = [...overrideParams.concat(planParams.slice(overrideParams.length))],
                $prev = oldPlan.apply(this, args);
              if (!($prev instanceof ExecutableStep)) {
                console.error(`Wrapped a plan function at Mutation.createComment, but that function did not return a step!
${String(oldPlan)}`);
                throw Error("Wrapped a plan function, but that function did not return a step!");
              }
              args[1].autoApply($prev);
              return $prev;
            },
            [$source, fieldArgs, info] = planParams,
            $newPlan = planWrapper2(smartPlan, $source, fieldArgs, info);
          if ($newPlan === void 0) throw Error("Your plan wrapper didn't return anything; it must return a step or null!");
          if ($newPlan !== null && !isStep($newPlan)) throw Error(`Your plan wrapper returned something other than a step... It must return a step (or null). (Returned: ${inspect($newPlan)})`);
          return $newPlan;
        },
        args: {
          input: applyInputToInsert
        }
      },
      createPost: {
        plan(...planParams) {
          const smartPlan = (...overrideParams) => {
              const args = [...overrideParams.concat(planParams.slice(overrideParams.length))],
                $prev = oldPlan11.apply(this, args);
              if (!($prev instanceof ExecutableStep)) {
                console.error(`Wrapped a plan function at Mutation.createPost, but that function did not return a step!
${String(oldPlan11)}`);
                throw Error("Wrapped a plan function, but that function did not return a step!");
              }
              args[1].autoApply($prev);
              return $prev;
            },
            [$source, fieldArgs, info] = planParams,
            $newPlan = planWrapper13(smartPlan, $source, fieldArgs, info);
          if ($newPlan === void 0) throw Error("Your plan wrapper didn't return anything; it must return a step or null!");
          if ($newPlan !== null && !isStep($newPlan)) throw Error(`Your plan wrapper returned something other than a step... It must return a step (or null). (Returned: ${inspect($newPlan)})`);
          return $newPlan;
        },
        args: {
          input: applyInputToInsert
        }
      },
      createProject: {
        plan(...planParams) {
          const smartPlan = (...overrideParams) => {
              const args = [...overrideParams.concat(planParams.slice(overrideParams.length))],
                $prev = oldPlan14.apply(this, args);
              if (!($prev instanceof ExecutableStep)) {
                console.error(`Wrapped a plan function at Mutation.createProject, but that function did not return a step!
${String(oldPlan14)}`);
                throw Error("Wrapped a plan function, but that function did not return a step!");
              }
              args[1].autoApply($prev);
              return $prev;
            },
            [$source, fieldArgs, info] = planParams,
            $newPlan = planWrapper18(smartPlan, $source, fieldArgs, info);
          if ($newPlan === void 0) throw Error("Your plan wrapper didn't return anything; it must return a step or null!");
          if ($newPlan !== null && !isStep($newPlan)) throw Error(`Your plan wrapper returned something other than a step... It must return a step (or null). (Returned: ${inspect($newPlan)})`);
          return $newPlan;
        },
        args: {
          input: applyInputToInsert
        }
      },
      createProjectLink: {
        plan(...planParams) {
          const smartPlan = (...overrideParams) => {
              const args = [...overrideParams.concat(planParams.slice(overrideParams.length))],
                $prev = oldPlan3.apply(this, args);
              if (!($prev instanceof ExecutableStep)) {
                console.error(`Wrapped a plan function at Mutation.createProjectLink, but that function did not return a step!
${String(oldPlan3)}`);
                throw Error("Wrapped a plan function, but that function did not return a step!");
              }
              args[1].autoApply($prev);
              return $prev;
            },
            [$source, fieldArgs, info] = planParams,
            $newPlan = planWrapper4(smartPlan, $source, fieldArgs, info);
          if ($newPlan === void 0) throw Error("Your plan wrapper didn't return anything; it must return a step or null!");
          if ($newPlan !== null && !isStep($newPlan)) throw Error(`Your plan wrapper returned something other than a step... It must return a step (or null). (Returned: ${inspect($newPlan)})`);
          return $newPlan;
        },
        args: {
          input: applyInputToInsert
        }
      },
      createProjectStatusConfig: {
        plan(...planParams) {
          const smartPlan = (...overrideParams) => {
              const args = [...overrideParams.concat(planParams.slice(overrideParams.length))],
                $prev = oldPlan9.apply(this, args);
              if (!($prev instanceof ExecutableStep)) {
                console.error(`Wrapped a plan function at Mutation.createProjectStatusConfig, but that function did not return a step!
${String(oldPlan9)}`);
                throw Error("Wrapped a plan function, but that function did not return a step!");
              }
              args[1].autoApply($prev);
              return $prev;
            },
            [$source, fieldArgs, info] = planParams,
            $newPlan = planWrapper10(smartPlan, $source, fieldArgs, info);
          if ($newPlan === void 0) throw Error("Your plan wrapper didn't return anything; it must return a step or null!");
          if ($newPlan !== null && !isStep($newPlan)) throw Error(`Your plan wrapper returned something other than a step... It must return a step (or null). (Returned: ${inspect($newPlan)})`);
          return $newPlan;
        },
        args: {
          input: applyInputToInsert
        }
      },
      createStatusTemplate: {
        plan(...planParams) {
          const smartPlan = (...overrideParams) => {
              const args = [...overrideParams.concat(planParams.slice(overrideParams.length))],
                $prev = oldPlan5.apply(this, args);
              if (!($prev instanceof ExecutableStep)) {
                console.error(`Wrapped a plan function at Mutation.createStatusTemplate, but that function did not return a step!
${String(oldPlan5)}`);
                throw Error("Wrapped a plan function, but that function did not return a step!");
              }
              args[1].autoApply($prev);
              return $prev;
            },
            [$source, fieldArgs, info] = planParams,
            $newPlan = planWrapper6(smartPlan, $source, fieldArgs, info);
          if ($newPlan === void 0) throw Error("Your plan wrapper didn't return anything; it must return a step or null!");
          if ($newPlan !== null && !isStep($newPlan)) throw Error(`Your plan wrapper returned something other than a step... It must return a step (or null). (Returned: ${inspect($newPlan)})`);
          return $newPlan;
        },
        args: {
          input: applyInputToInsert
        }
      },
      createUser: {
        plan(...planParams) {
          const smartPlan = (...overrideParams) => {
              const args = [...overrideParams.concat(planParams.slice(overrideParams.length))],
                $prev = oldPlan8.apply(this, args);
              if (!($prev instanceof ExecutableStep)) {
                console.error(`Wrapped a plan function at Mutation.createUser, but that function did not return a step!
${String(oldPlan8)}`);
                throw Error("Wrapped a plan function, but that function did not return a step!");
              }
              args[1].autoApply($prev);
              return $prev;
            },
            [$source, fieldArgs, info] = planParams,
            $newPlan = planWrapper8(smartPlan, $source, fieldArgs, info);
          if ($newPlan === void 0) throw Error("Your plan wrapper didn't return anything; it must return a step or null!");
          if ($newPlan !== null && !isStep($newPlan)) throw Error(`Your plan wrapper returned something other than a step... It must return a step (or null). (Returned: ${inspect($newPlan)})`);
          return $newPlan;
        },
        args: {
          input: applyInputToInsert
        }
      },
      createVote: {
        plan(...planParams) {
          const smartPlan = (...overrideParams) => {
              const args = [...overrideParams.concat(planParams.slice(overrideParams.length))],
                $prev = oldPlan7.apply(this, args);
              if (!($prev instanceof ExecutableStep)) {
                console.error(`Wrapped a plan function at Mutation.createVote, but that function did not return a step!
${String(oldPlan7)}`);
                throw Error("Wrapped a plan function, but that function did not return a step!");
              }
              args[1].autoApply($prev);
              return $prev;
            },
            [$source, fieldArgs, info] = planParams,
            $newPlan = planWrapper7(smartPlan, $source, fieldArgs, info);
          if ($newPlan === void 0) throw Error("Your plan wrapper didn't return anything; it must return a step or null!");
          if ($newPlan !== null && !isStep($newPlan)) throw Error(`Your plan wrapper returned something other than a step... It must return a step (or null). (Returned: ${inspect($newPlan)})`);
          return $newPlan;
        },
        args: {
          input: applyInputToInsert
        }
      },
      deleteComment: {
        plan(...planParams) {
          const smartPlan = (...overrideParams) => {
              const args = [...overrideParams.concat(planParams.slice(overrideParams.length))],
                $prev = oldPlan36.apply(this, args);
              if (!($prev instanceof ExecutableStep)) {
                console.error(`Wrapped a plan function at Mutation.deleteComment, but that function did not return a step!
${String(oldPlan36)}`);
                throw Error("Wrapped a plan function, but that function did not return a step!");
              }
              args[1].autoApply($prev);
              return $prev;
            },
            [$source, fieldArgs, info] = planParams,
            $newPlan = planWrapper37(smartPlan, $source, fieldArgs, info);
          if ($newPlan === void 0) throw Error("Your plan wrapper didn't return anything; it must return a step or null!");
          if ($newPlan !== null && !isStep($newPlan)) throw Error(`Your plan wrapper returned something other than a step... It must return a step (or null). (Returned: ${inspect($newPlan)})`);
          return $newPlan;
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      deletePost: {
        plan(...planParams) {
          const smartPlan = (...overrideParams) => {
              const args = [...overrideParams.concat(planParams.slice(overrideParams.length))],
                $prev = oldPlan47.apply(this, args);
              if (!($prev instanceof ExecutableStep)) {
                console.error(`Wrapped a plan function at Mutation.deletePost, but that function did not return a step!
${String(oldPlan47)}`);
                throw Error("Wrapped a plan function, but that function did not return a step!");
              }
              args[1].autoApply($prev);
              return $prev;
            },
            [$source, fieldArgs, info] = planParams,
            $newPlan = planWrapper49(smartPlan, $source, fieldArgs, info);
          if ($newPlan === void 0) throw Error("Your plan wrapper didn't return anything; it must return a step or null!");
          if ($newPlan !== null && !isStep($newPlan)) throw Error(`Your plan wrapper returned something other than a step... It must return a step (or null). (Returned: ${inspect($newPlan)})`);
          return $newPlan;
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      deleteProject: {
        plan(...planParams) {
          const smartPlan = (...overrideParams) => {
              const args = [...overrideParams.concat(planParams.slice(overrideParams.length))],
                $prev = oldPlan50.apply(this, args);
              if (!($prev instanceof ExecutableStep)) {
                console.error(`Wrapped a plan function at Mutation.deleteProject, but that function did not return a step!
${String(oldPlan50)}`);
                throw Error("Wrapped a plan function, but that function did not return a step!");
              }
              args[1].autoApply($prev);
              return $prev;
            },
            [$source, fieldArgs, info] = planParams,
            $newPlan = planWrapper53(smartPlan, $source, fieldArgs, info);
          if ($newPlan === void 0) throw Error("Your plan wrapper didn't return anything; it must return a step or null!");
          if ($newPlan !== null && !isStep($newPlan)) throw Error(`Your plan wrapper returned something other than a step... It must return a step (or null). (Returned: ${inspect($newPlan)})`);
          return $newPlan;
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      deleteProjectLink: {
        plan(...planParams) {
          const smartPlan = (...overrideParams) => {
              const args = [...overrideParams.concat(planParams.slice(overrideParams.length))],
                $prev = oldPlan38.apply(this, args);
              if (!($prev instanceof ExecutableStep)) {
                console.error(`Wrapped a plan function at Mutation.deleteProjectLink, but that function did not return a step!
${String(oldPlan38)}`);
                throw Error("Wrapped a plan function, but that function did not return a step!");
              }
              args[1].autoApply($prev);
              return $prev;
            },
            [$source, fieldArgs, info] = planParams,
            $newPlan = planWrapper39(smartPlan, $source, fieldArgs, info);
          if ($newPlan === void 0) throw Error("Your plan wrapper didn't return anything; it must return a step or null!");
          if ($newPlan !== null && !isStep($newPlan)) throw Error(`Your plan wrapper returned something other than a step... It must return a step (or null). (Returned: ${inspect($newPlan)})`);
          return $newPlan;
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      deleteProjectStatusConfig: {
        plan(...planParams) {
          const smartPlan = (...overrideParams) => {
              const args = [...overrideParams.concat(planParams.slice(overrideParams.length))],
                $prev = oldPlan45.apply(this, args);
              if (!($prev instanceof ExecutableStep)) {
                console.error(`Wrapped a plan function at Mutation.deleteProjectStatusConfig, but that function did not return a step!
${String(oldPlan45)}`);
                throw Error("Wrapped a plan function, but that function did not return a step!");
              }
              args[1].autoApply($prev);
              return $prev;
            },
            [$source, fieldArgs, info] = planParams,
            $newPlan = planWrapper46(smartPlan, $source, fieldArgs, info);
          if ($newPlan === void 0) throw Error("Your plan wrapper didn't return anything; it must return a step or null!");
          if ($newPlan !== null && !isStep($newPlan)) throw Error(`Your plan wrapper returned something other than a step... It must return a step (or null). (Returned: ${inspect($newPlan)})`);
          return $newPlan;
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      deleteStatusTemplate: {
        plan(...planParams) {
          const smartPlan = (...overrideParams) => {
              const args = [...overrideParams.concat(planParams.slice(overrideParams.length))],
                $prev = oldPlan40.apply(this, args);
              if (!($prev instanceof ExecutableStep)) {
                console.error(`Wrapped a plan function at Mutation.deleteStatusTemplate, but that function did not return a step!
${String(oldPlan40)}`);
                throw Error("Wrapped a plan function, but that function did not return a step!");
              }
              args[1].autoApply($prev);
              return $prev;
            },
            [$source, fieldArgs, info] = planParams,
            $newPlan = planWrapper41(smartPlan, $source, fieldArgs, info);
          if ($newPlan === void 0) throw Error("Your plan wrapper didn't return anything; it must return a step or null!");
          if ($newPlan !== null && !isStep($newPlan)) throw Error(`Your plan wrapper returned something other than a step... It must return a step (or null). (Returned: ${inspect($newPlan)})`);
          return $newPlan;
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      deleteUser: {
        plan(...planParams) {
          const smartPlan = (...overrideParams) => {
              const args = [...overrideParams.concat(planParams.slice(overrideParams.length))],
                $prev = oldPlan44.apply(this, args);
              if (!($prev instanceof ExecutableStep)) {
                console.error(`Wrapped a plan function at Mutation.deleteUser, but that function did not return a step!
${String(oldPlan44)}`);
                throw Error("Wrapped a plan function, but that function did not return a step!");
              }
              args[1].autoApply($prev);
              return $prev;
            },
            [$source, fieldArgs, info] = planParams,
            $newPlan = planWrapper44(smartPlan, $source, fieldArgs, info);
          if ($newPlan === void 0) throw Error("Your plan wrapper didn't return anything; it must return a step or null!");
          if ($newPlan !== null && !isStep($newPlan)) throw Error(`Your plan wrapper returned something other than a step... It must return a step (or null). (Returned: ${inspect($newPlan)})`);
          return $newPlan;
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      deleteVote: {
        plan(...planParams) {
          const smartPlan = (...overrideParams) => {
              const args = [...overrideParams.concat(planParams.slice(overrideParams.length))],
                $prev = oldPlan42.apply(this, args);
              if (!($prev instanceof ExecutableStep)) {
                console.error(`Wrapped a plan function at Mutation.deleteVote, but that function did not return a step!
${String(oldPlan42)}`);
                throw Error("Wrapped a plan function, but that function did not return a step!");
              }
              args[1].autoApply($prev);
              return $prev;
            },
            [$source, fieldArgs, info] = planParams,
            $newPlan = planWrapper43(smartPlan, $source, fieldArgs, info);
          if ($newPlan === void 0) throw Error("Your plan wrapper didn't return anything; it must return a step or null!");
          if ($newPlan !== null && !isStep($newPlan)) throw Error(`Your plan wrapper returned something other than a step... It must return a step (or null). (Returned: ${inspect($newPlan)})`);
          return $newPlan;
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      updateComment: {
        plan(...planParams) {
          const smartPlan = (...overrideParams) => {
              const args = [...overrideParams.concat(planParams.slice(overrideParams.length))],
                $prev = oldPlan19.apply(this, args);
              if (!($prev instanceof ExecutableStep)) {
                console.error(`Wrapped a plan function at Mutation.updateComment, but that function did not return a step!
${String(oldPlan19)}`);
                throw Error("Wrapped a plan function, but that function did not return a step!");
              }
              args[1].autoApply($prev);
              return $prev;
            },
            [$source, fieldArgs, info] = planParams,
            $newPlan = planWrapper20(smartPlan, $source, fieldArgs, info);
          if ($newPlan === void 0) throw Error("Your plan wrapper didn't return anything; it must return a step or null!");
          if ($newPlan !== null && !isStep($newPlan)) throw Error(`Your plan wrapper returned something other than a step... It must return a step (or null). (Returned: ${inspect($newPlan)})`);
          return $newPlan;
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      updatePost: {
        plan(...planParams) {
          const smartPlan = (...overrideParams) => {
              const args = [...overrideParams.concat(planParams.slice(overrideParams.length))],
                $prev = oldPlan30.apply(this, args);
              if (!($prev instanceof ExecutableStep)) {
                console.error(`Wrapped a plan function at Mutation.updatePost, but that function did not return a step!
${String(oldPlan30)}`);
                throw Error("Wrapped a plan function, but that function did not return a step!");
              }
              args[1].autoApply($prev);
              return $prev;
            },
            [$source, fieldArgs, info] = planParams,
            $newPlan = planWrapper13(smartPlan, $source, fieldArgs, info);
          if ($newPlan === void 0) throw Error("Your plan wrapper didn't return anything; it must return a step or null!");
          if ($newPlan !== null && !isStep($newPlan)) throw Error(`Your plan wrapper returned something other than a step... It must return a step (or null). (Returned: ${inspect($newPlan)})`);
          return $newPlan;
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      updateProject: {
        plan(...planParams) {
          const smartPlan = (...overrideParams) => {
              const args = [...overrideParams.concat(planParams.slice(overrideParams.length))],
                $prev = oldPlan33.apply(this, args);
              if (!($prev instanceof ExecutableStep)) {
                console.error(`Wrapped a plan function at Mutation.updateProject, but that function did not return a step!
${String(oldPlan33)}`);
                throw Error("Wrapped a plan function, but that function did not return a step!");
              }
              args[1].autoApply($prev);
              return $prev;
            },
            [$source, fieldArgs, info] = planParams,
            $newPlan = planWrapper18(smartPlan, $source, fieldArgs, info);
          if ($newPlan === void 0) throw Error("Your plan wrapper didn't return anything; it must return a step or null!");
          if ($newPlan !== null && !isStep($newPlan)) throw Error(`Your plan wrapper returned something other than a step... It must return a step (or null). (Returned: ${inspect($newPlan)})`);
          return $newPlan;
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      updateProjectLink: {
        plan(...planParams) {
          const smartPlan = (...overrideParams) => {
              const args = [...overrideParams.concat(planParams.slice(overrideParams.length))],
                $prev = oldPlan21.apply(this, args);
              if (!($prev instanceof ExecutableStep)) {
                console.error(`Wrapped a plan function at Mutation.updateProjectLink, but that function did not return a step!
${String(oldPlan21)}`);
                throw Error("Wrapped a plan function, but that function did not return a step!");
              }
              args[1].autoApply($prev);
              return $prev;
            },
            [$source, fieldArgs, info] = planParams,
            $newPlan = planWrapper22(smartPlan, $source, fieldArgs, info);
          if ($newPlan === void 0) throw Error("Your plan wrapper didn't return anything; it must return a step or null!");
          if ($newPlan !== null && !isStep($newPlan)) throw Error(`Your plan wrapper returned something other than a step... It must return a step (or null). (Returned: ${inspect($newPlan)})`);
          return $newPlan;
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      updateProjectStatusConfig: {
        plan(...planParams) {
          const smartPlan = (...overrideParams) => {
              const args = [...overrideParams.concat(planParams.slice(overrideParams.length))],
                $prev = oldPlan28.apply(this, args);
              if (!($prev instanceof ExecutableStep)) {
                console.error(`Wrapped a plan function at Mutation.updateProjectStatusConfig, but that function did not return a step!
${String(oldPlan28)}`);
                throw Error("Wrapped a plan function, but that function did not return a step!");
              }
              args[1].autoApply($prev);
              return $prev;
            },
            [$source, fieldArgs, info] = planParams,
            $newPlan = planWrapper29(smartPlan, $source, fieldArgs, info);
          if ($newPlan === void 0) throw Error("Your plan wrapper didn't return anything; it must return a step or null!");
          if ($newPlan !== null && !isStep($newPlan)) throw Error(`Your plan wrapper returned something other than a step... It must return a step (or null). (Returned: ${inspect($newPlan)})`);
          return $newPlan;
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      updateStatusTemplate: {
        plan(...planParams) {
          const smartPlan = (...overrideParams) => {
              const args = [...overrideParams.concat(planParams.slice(overrideParams.length))],
                $prev = oldPlan23.apply(this, args);
              if (!($prev instanceof ExecutableStep)) {
                console.error(`Wrapped a plan function at Mutation.updateStatusTemplate, but that function did not return a step!
${String(oldPlan23)}`);
                throw Error("Wrapped a plan function, but that function did not return a step!");
              }
              args[1].autoApply($prev);
              return $prev;
            },
            [$source, fieldArgs, info] = planParams,
            $newPlan = planWrapper24(smartPlan, $source, fieldArgs, info);
          if ($newPlan === void 0) throw Error("Your plan wrapper didn't return anything; it must return a step or null!");
          if ($newPlan !== null && !isStep($newPlan)) throw Error(`Your plan wrapper returned something other than a step... It must return a step (or null). (Returned: ${inspect($newPlan)})`);
          return $newPlan;
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      updateUser: {
        plan(...planParams) {
          const smartPlan = (...overrideParams) => {
              const args = [...overrideParams.concat(planParams.slice(overrideParams.length))],
                $prev = oldPlan27.apply(this, args);
              if (!($prev instanceof ExecutableStep)) {
                console.error(`Wrapped a plan function at Mutation.updateUser, but that function did not return a step!
${String(oldPlan27)}`);
                throw Error("Wrapped a plan function, but that function did not return a step!");
              }
              args[1].autoApply($prev);
              return $prev;
            },
            [$source, fieldArgs, info] = planParams,
            $newPlan = planWrapper27(smartPlan, $source, fieldArgs, info);
          if ($newPlan === void 0) throw Error("Your plan wrapper didn't return anything; it must return a step or null!");
          if ($newPlan !== null && !isStep($newPlan)) throw Error(`Your plan wrapper returned something other than a step... It must return a step (or null). (Returned: ${inspect($newPlan)})`);
          return $newPlan;
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      updateVote: {
        plan(...planParams) {
          const smartPlan = (...overrideParams) => {
              const args = [...overrideParams.concat(planParams.slice(overrideParams.length))],
                $prev = oldPlan25.apply(this, args);
              if (!($prev instanceof ExecutableStep)) {
                console.error(`Wrapped a plan function at Mutation.updateVote, but that function did not return a step!
${String(oldPlan25)}`);
                throw Error("Wrapped a plan function, but that function did not return a step!");
              }
              args[1].autoApply($prev);
              return $prev;
            },
            [$source, fieldArgs, info] = planParams,
            $newPlan = planWrapper26(smartPlan, $source, fieldArgs, info);
          if ($newPlan === void 0) throw Error("Your plan wrapper didn't return anything; it must return a step or null!");
          if ($newPlan !== null && !isStep($newPlan)) throw Error(`Your plan wrapper returned something other than a step... It must return a step (or null). (Returned: ${inspect($newPlan)})`);
          return $newPlan;
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      }
    }
  },
  Comment: {
    assertStep: assertPgClassSingleStep,
    plans: {
      childComments: {
        plan($record) {
          const $records = resource_commentPgResource.find({
            parent_id: $record.get("id")
          });
          return connection($records);
        },
        args: {
          first: applyFirstArg,
          last: applyLastArg,
          offset: applyOffsetArg,
          before: applyBeforeArg,
          after: applyAfterArg,
          condition: applyConditionArgToConnection,
          filter: Query_commentsfilterApplyPlan,
          orderBy: applyOrderByArgToConnection
        }
      },
      createdAt: Comment_createdAtPlan,
      parent($record) {
        return resource_commentPgResource.get({
          id: $record.get("parent_id")
        });
      },
      parentId($record) {
        return $record.get("parent_id");
      },
      post: Comment_postPlan,
      postId: Comment_postIdPlan,
      rowId: Comment_rowIdPlan,
      updatedAt: Comment_updatedAtPlan,
      user: Comment_userPlan,
      userId: Comment_userIdPlan
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of commentUniques[0].attributes) spec[pkCol] = get2($specifier, pkCol);
      return resource_commentPgResource.get(spec);
    }
  },
  CommentAggregates: {
    assertStep: assertPgClassSingleStep,
    plans: {
      distinctCount: pgAggregatesPlanAggregates,
      keys: PostAggregates_keysPlan
    }
  },
  CommentConnection: {
    assertStep: ConnectionStep,
    plans: {
      aggregates: pgAggregatesCloneSubplanWithoutPaginationSingle,
      groupedAggregates: {
        plan: pgAggregateCloneSubplanWithoutPaginationAsAggregate,
        args: {
          groupBy: pgAggregatesApplyGroupedAggregate,
          having: pgAggregatesApplyConditionsToGroupedAggregates
        }
      },
      totalCount: totalCountConnectionPlan
    }
  },
  CommentDistinctCountAggregates: {
    plans: {
      createdAt: PostDistinctCountAggregates_createdAtPlan,
      message($pgSelectSingle) {
        return pgAggregatesPlanAggregateAttribute(TYPES.text, "message", TYPES.bigint, pgAggregateSpec_distinctCount, $pgSelectSingle);
      },
      parentId($pgSelectSingle) {
        return pgAggregatesPlanAggregateAttribute(TYPES.uuid, "parent_id", TYPES.bigint, pgAggregateSpec_distinctCount, $pgSelectSingle);
      },
      postId: CommentDistinctCountAggregates_postIdPlan,
      rowId: PostDistinctCountAggregates_rowIdPlan,
      updatedAt: PostDistinctCountAggregates_updatedAtPlan,
      userId: PostDistinctCountAggregates_userIdPlan
    }
  },
  CreateCommentPayload: {
    assertStep: assertStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      comment: planCreatePayloadResult,
      commentEdge: CreateCommentPayload_commentEdgePlan,
      query: queryPlan
    }
  },
  CreatePostPayload: {
    assertStep: assertStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      post: planCreatePayloadResult,
      postEdge: CreatePostPayload_postEdgePlan,
      query: queryPlan
    }
  },
  CreateProjectLinkPayload: {
    assertStep: assertStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      projectLink: planCreatePayloadResult,
      projectLinkEdge: CreateProjectLinkPayload_projectLinkEdgePlan,
      query: queryPlan
    }
  },
  CreateProjectPayload: {
    assertStep: assertStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      project: planCreatePayloadResult,
      projectEdge: CreateProjectPayload_projectEdgePlan,
      query: queryPlan
    }
  },
  CreateProjectStatusConfigPayload: {
    assertStep: assertStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      projectStatusConfig: planCreatePayloadResult,
      projectStatusConfigEdge: CreateProjectStatusConfigPayload_projectStatusConfigEdgePlan,
      query: queryPlan
    }
  },
  CreateStatusTemplatePayload: {
    assertStep: assertStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      query: queryPlan,
      statusTemplate: planCreatePayloadResult,
      statusTemplateEdge: CreateStatusTemplatePayload_statusTemplateEdgePlan
    }
  },
  CreateUserPayload: {
    assertStep: assertStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      query: queryPlan,
      user: planCreatePayloadResult,
      userEdge: CreateUserPayload_userEdgePlan
    }
  },
  CreateVotePayload: {
    assertStep: assertStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      query: queryPlan,
      vote: planCreatePayloadResult,
      voteEdge: CreateVotePayload_voteEdgePlan
    }
  },
  DeleteCommentPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      comment: planCreatePayloadResult,
      commentEdge: CreateCommentPayload_commentEdgePlan,
      query: queryPlan
    }
  },
  DeletePostPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      post: planCreatePayloadResult,
      postEdge: CreatePostPayload_postEdgePlan,
      query: queryPlan
    }
  },
  DeleteProjectLinkPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      projectLink: planCreatePayloadResult,
      projectLinkEdge: CreateProjectLinkPayload_projectLinkEdgePlan,
      query: queryPlan
    }
  },
  DeleteProjectPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      project: planCreatePayloadResult,
      projectEdge: CreateProjectPayload_projectEdgePlan,
      query: queryPlan
    }
  },
  DeleteProjectStatusConfigPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      projectStatusConfig: planCreatePayloadResult,
      projectStatusConfigEdge: CreateProjectStatusConfigPayload_projectStatusConfigEdgePlan,
      query: queryPlan
    }
  },
  DeleteStatusTemplatePayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      query: queryPlan,
      statusTemplate: planCreatePayloadResult,
      statusTemplateEdge: CreateStatusTemplatePayload_statusTemplateEdgePlan
    }
  },
  DeleteUserPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      query: queryPlan,
      user: planCreatePayloadResult,
      userEdge: CreateUserPayload_userEdgePlan
    }
  },
  DeleteVotePayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      query: queryPlan,
      vote: planCreatePayloadResult,
      voteEdge: CreateVotePayload_voteEdgePlan
    }
  },
  Post: {
    assertStep: assertPgClassSingleStep,
    plans: {
      comments: {
        plan($record) {
          const $records = resource_commentPgResource.find({
            post_id: $record.get("id")
          });
          return connection($records);
        },
        args: {
          first: applyFirstArg,
          last: applyLastArg,
          offset: applyOffsetArg,
          before: applyBeforeArg,
          after: applyAfterArg,
          condition: applyConditionArgToConnection,
          filter: Query_commentsfilterApplyPlan,
          orderBy: applyOrderByArgToConnection
        }
      },
      createdAt: Comment_createdAtPlan,
      project: Post_projectPlan,
      projectId: Post_projectIdPlan,
      rowId: Comment_rowIdPlan,
      statusTemplate: Post_statusTemplatePlan,
      statusTemplateId: Post_statusTemplateIdPlan,
      statusUpdatedAt($record) {
        return $record.get("status_updated_at");
      },
      updatedAt: Comment_updatedAtPlan,
      user: Comment_userPlan,
      userId: Comment_userIdPlan,
      votes: {
        plan($record) {
          const $records = resource_votePgResource.find({
            post_id: $record.get("id")
          });
          return connection($records);
        },
        args: {
          first: applyFirstArg,
          last: applyLastArg,
          offset: applyOffsetArg,
          before: applyBeforeArg,
          after: applyAfterArg,
          condition: applyConditionArgToConnection,
          filter: Query_commentsfilterApplyPlan,
          orderBy: applyOrderByArgToConnection
        }
      }
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of postUniques[0].attributes) spec[pkCol] = get2($specifier, pkCol);
      return resource_postPgResource.get(spec);
    }
  },
  PostAggregates: {
    assertStep: assertPgClassSingleStep,
    plans: {
      average: pgAggregatesPlanAggregates,
      distinctCount: pgAggregatesPlanAggregates,
      keys: PostAggregates_keysPlan,
      max: pgAggregatesPlanAggregates,
      min: pgAggregatesPlanAggregates,
      stddevPopulation: pgAggregatesPlanAggregates,
      stddevSample: pgAggregatesPlanAggregates,
      sum: pgAggregatesPlanAggregates,
      variancePopulation: pgAggregatesPlanAggregates,
      varianceSample: pgAggregatesPlanAggregates
    }
  },
  PostAverageAggregates: {
    plans: {
      number($pgSelectSingle) {
        return pgAggregatesPlanAggregateAttribute(TYPES.int, "number", TYPES.numeric, pgAggregateSpec_average, $pgSelectSingle);
      }
    }
  },
  PostConnection: {
    assertStep: ConnectionStep,
    plans: {
      aggregates: pgAggregatesCloneSubplanWithoutPaginationSingle,
      groupedAggregates: {
        plan: pgAggregateCloneSubplanWithoutPaginationAsAggregate,
        args: {
          groupBy: pgAggregatesApplyGroupedAggregate,
          having: pgAggregatesApplyConditionsToGroupedAggregates
        }
      },
      totalCount: totalCountConnectionPlan
    }
  },
  PostDistinctCountAggregates: {
    plans: {
      createdAt: PostDistinctCountAggregates_createdAtPlan,
      description: PostDistinctCountAggregates_descriptionPlan,
      number($pgSelectSingle) {
        return pgAggregatesPlanAggregateAttribute(TYPES.int, "number", TYPES.bigint, pgAggregateSpec_distinctCount, $pgSelectSingle);
      },
      projectId: PostDistinctCountAggregates_projectIdPlan,
      rowId: PostDistinctCountAggregates_rowIdPlan,
      statusTemplateId: PostDistinctCountAggregates_statusTemplateIdPlan,
      statusUpdatedAt($pgSelectSingle) {
        return pgAggregatesPlanAggregateAttribute(TYPES.timestamptz, "status_updated_at", TYPES.bigint, pgAggregateSpec_distinctCount, $pgSelectSingle);
      },
      title: PostDistinctCountAggregates_titlePlan,
      updatedAt: PostDistinctCountAggregates_updatedAtPlan,
      userId: PostDistinctCountAggregates_userIdPlan
    }
  },
  PostMaxAggregates: {
    plans: {
      number($pgSelectSingle) {
        return pgAggregatesPlanAggregateAttribute(TYPES.int, "number", TYPES.int, pgAggregateSpec_max, $pgSelectSingle);
      }
    }
  },
  PostMinAggregates: {
    plans: {
      number($pgSelectSingle) {
        return pgAggregatesPlanAggregateAttribute(TYPES.int, "number", TYPES.int, pgAggregateSpec_min, $pgSelectSingle);
      }
    }
  },
  PostStddevPopulationAggregates: {
    plans: {
      number($pgSelectSingle) {
        return pgAggregatesPlanAggregateAttribute(TYPES.int, "number", TYPES.numeric, pgAggregateSpec_stddevPopulation, $pgSelectSingle);
      }
    }
  },
  PostStddevSampleAggregates: {
    plans: {
      number($pgSelectSingle) {
        return pgAggregatesPlanAggregateAttribute(TYPES.int, "number", TYPES.numeric, pgAggregateSpec_stddevSample, $pgSelectSingle);
      }
    }
  },
  PostSumAggregates: {
    plans: {
      number($pgSelectSingle) {
        return pgAggregatesPlanAggregateAttribute(TYPES.int, "number", TYPES.bigint, pgAggregateSpec_sum, $pgSelectSingle);
      }
    }
  },
  PostVariancePopulationAggregates: {
    plans: {
      number($pgSelectSingle) {
        return pgAggregatesPlanAggregateAttribute(TYPES.int, "number", TYPES.numeric, pgAggregateSpec_variancePopulation, $pgSelectSingle);
      }
    }
  },
  PostVarianceSampleAggregates: {
    plans: {
      number($pgSelectSingle) {
        return pgAggregatesPlanAggregateAttribute(TYPES.int, "number", TYPES.numeric, pgAggregateSpec_varianceSample, $pgSelectSingle);
      }
    }
  },
  Project: {
    assertStep: assertPgClassSingleStep,
    plans: {
      createdAt: Comment_createdAtPlan,
      isPublic($record) {
        return $record.get("is_public");
      },
      nextPostNumber($record) {
        return $record.get("next_post_number");
      },
      organizationId: Project_organizationIdPlan,
      posts: {
        plan($record) {
          const $records = resource_postPgResource.find({
            project_id: $record.get("id")
          });
          return connection($records);
        },
        args: {
          first: applyFirstArg,
          last: applyLastArg,
          offset: applyOffsetArg,
          before: applyBeforeArg,
          after: applyAfterArg,
          condition: applyConditionArgToConnection,
          filter: Query_commentsfilterApplyPlan,
          orderBy: applyOrderByArgToConnection
        }
      },
      projectLinks: {
        plan($record) {
          const $records = resource_project_linkPgResource.find({
            project_id: $record.get("id")
          });
          return connection($records);
        },
        args: {
          first: applyFirstArg,
          last: applyLastArg,
          offset: applyOffsetArg,
          before: applyBeforeArg,
          after: applyAfterArg,
          condition: applyConditionArgToConnection,
          filter: Query_commentsfilterApplyPlan,
          orderBy: applyOrderByArgToConnection
        }
      },
      projectStatusConfigs: {
        plan($record) {
          const $records = resource_project_status_configPgResource.find({
            project_id: $record.get("id")
          });
          return connection($records);
        },
        args: {
          first: applyFirstArg,
          last: applyLastArg,
          offset: applyOffsetArg,
          before: applyBeforeArg,
          after: applyAfterArg,
          condition: applyConditionArgToConnection,
          filter: Query_commentsfilterApplyPlan,
          orderBy: applyOrderByArgToConnection
        }
      },
      rowId: Comment_rowIdPlan,
      updatedAt: Comment_updatedAtPlan
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of projectUniques[0].attributes) spec[pkCol] = get2($specifier, pkCol);
      return resource_projectPgResource.get(spec);
    }
  },
  ProjectAggregates: {
    assertStep: assertPgClassSingleStep,
    plans: {
      average: pgAggregatesPlanAggregates,
      distinctCount: pgAggregatesPlanAggregates,
      keys: PostAggregates_keysPlan,
      max: pgAggregatesPlanAggregates,
      min: pgAggregatesPlanAggregates,
      stddevPopulation: pgAggregatesPlanAggregates,
      stddevSample: pgAggregatesPlanAggregates,
      sum: pgAggregatesPlanAggregates,
      variancePopulation: pgAggregatesPlanAggregates,
      varianceSample: pgAggregatesPlanAggregates
    }
  },
  ProjectAverageAggregates: {
    plans: {
      nextPostNumber($pgSelectSingle) {
        return pgAggregatesPlanAggregateAttribute(TYPES.int, "next_post_number", TYPES.numeric, pgAggregateSpec_average, $pgSelectSingle);
      }
    }
  },
  ProjectConnection: {
    assertStep: ConnectionStep,
    plans: {
      aggregates: pgAggregatesCloneSubplanWithoutPaginationSingle,
      groupedAggregates: {
        plan: pgAggregateCloneSubplanWithoutPaginationAsAggregate,
        args: {
          groupBy: pgAggregatesApplyGroupedAggregate,
          having: pgAggregatesApplyConditionsToGroupedAggregates
        }
      },
      totalCount: totalCountConnectionPlan
    }
  },
  ProjectDistinctCountAggregates: {
    plans: {
      createdAt: PostDistinctCountAggregates_createdAtPlan,
      description: PostDistinctCountAggregates_descriptionPlan,
      image($pgSelectSingle) {
        return pgAggregatesPlanAggregateAttribute(TYPES.text, "image", TYPES.bigint, pgAggregateSpec_distinctCount, $pgSelectSingle);
      },
      isPublic($pgSelectSingle) {
        return pgAggregatesPlanAggregateAttribute(TYPES.boolean, "is_public", TYPES.bigint, pgAggregateSpec_distinctCount, $pgSelectSingle);
      },
      name: StatusTemplateDistinctCountAggregates_namePlan,
      nextPostNumber($pgSelectSingle) {
        return pgAggregatesPlanAggregateAttribute(TYPES.int, "next_post_number", TYPES.bigint, pgAggregateSpec_distinctCount, $pgSelectSingle);
      },
      organizationId: StatusTemplateDistinctCountAggregates_organizationIdPlan,
      prefix($pgSelectSingle) {
        return pgAggregatesPlanAggregateAttribute(TYPES.varchar, "prefix", TYPES.bigint, pgAggregateSpec_distinctCount, $pgSelectSingle);
      },
      rowId: PostDistinctCountAggregates_rowIdPlan,
      slug($pgSelectSingle) {
        return pgAggregatesPlanAggregateAttribute(TYPES.text, "slug", TYPES.bigint, pgAggregateSpec_distinctCount, $pgSelectSingle);
      },
      updatedAt: PostDistinctCountAggregates_updatedAtPlan
    }
  },
  ProjectLink: {
    assertStep: assertPgClassSingleStep,
    plans: {
      createdAt: Comment_createdAtPlan,
      project: Post_projectPlan,
      projectId: Post_projectIdPlan,
      rowId: Comment_rowIdPlan,
      updatedAt: Comment_updatedAtPlan
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of project_linkUniques[0].attributes) spec[pkCol] = get2($specifier, pkCol);
      return resource_project_linkPgResource.get(spec);
    }
  },
  ProjectLinkAggregates: {
    assertStep: assertPgClassSingleStep,
    plans: {
      average: pgAggregatesPlanAggregates,
      distinctCount: pgAggregatesPlanAggregates,
      keys: PostAggregates_keysPlan,
      max: pgAggregatesPlanAggregates,
      min: pgAggregatesPlanAggregates,
      stddevPopulation: pgAggregatesPlanAggregates,
      stddevSample: pgAggregatesPlanAggregates,
      sum: pgAggregatesPlanAggregates,
      variancePopulation: pgAggregatesPlanAggregates,
      varianceSample: pgAggregatesPlanAggregates
    }
  },
  ProjectLinkAverageAggregates: {
    plans: {
      order($pgSelectSingle) {
        return pgAggregatesPlanAggregateAttribute(TYPES.int, "order", TYPES.numeric, pgAggregateSpec_average, $pgSelectSingle);
      }
    }
  },
  ProjectLinkConnection: {
    assertStep: ConnectionStep,
    plans: {
      aggregates: pgAggregatesCloneSubplanWithoutPaginationSingle,
      groupedAggregates: {
        plan: pgAggregateCloneSubplanWithoutPaginationAsAggregate,
        args: {
          groupBy: pgAggregatesApplyGroupedAggregate,
          having: pgAggregatesApplyConditionsToGroupedAggregates
        }
      },
      totalCount: totalCountConnectionPlan
    }
  },
  ProjectLinkDistinctCountAggregates: {
    plans: {
      createdAt: PostDistinctCountAggregates_createdAtPlan,
      order($pgSelectSingle) {
        return pgAggregatesPlanAggregateAttribute(TYPES.int, "order", TYPES.bigint, pgAggregateSpec_distinctCount, $pgSelectSingle);
      },
      projectId: PostDistinctCountAggregates_projectIdPlan,
      rowId: PostDistinctCountAggregates_rowIdPlan,
      title: PostDistinctCountAggregates_titlePlan,
      updatedAt: PostDistinctCountAggregates_updatedAtPlan,
      url($pgSelectSingle) {
        return pgAggregatesPlanAggregateAttribute(TYPES.text, "url", TYPES.bigint, pgAggregateSpec_distinctCount, $pgSelectSingle);
      }
    }
  },
  ProjectLinkMaxAggregates: {
    plans: {
      order($pgSelectSingle) {
        return pgAggregatesPlanAggregateAttribute(TYPES.int, "order", TYPES.int, pgAggregateSpec_max, $pgSelectSingle);
      }
    }
  },
  ProjectLinkMinAggregates: {
    plans: {
      order($pgSelectSingle) {
        return pgAggregatesPlanAggregateAttribute(TYPES.int, "order", TYPES.int, pgAggregateSpec_min, $pgSelectSingle);
      }
    }
  },
  ProjectLinkStddevPopulationAggregates: {
    plans: {
      order($pgSelectSingle) {
        return pgAggregatesPlanAggregateAttribute(TYPES.int, "order", TYPES.numeric, pgAggregateSpec_stddevPopulation, $pgSelectSingle);
      }
    }
  },
  ProjectLinkStddevSampleAggregates: {
    plans: {
      order($pgSelectSingle) {
        return pgAggregatesPlanAggregateAttribute(TYPES.int, "order", TYPES.numeric, pgAggregateSpec_stddevSample, $pgSelectSingle);
      }
    }
  },
  ProjectLinkSumAggregates: {
    plans: {
      order($pgSelectSingle) {
        return pgAggregatesPlanAggregateAttribute(TYPES.int, "order", TYPES.bigint, pgAggregateSpec_sum, $pgSelectSingle);
      }
    }
  },
  ProjectLinkVariancePopulationAggregates: {
    plans: {
      order($pgSelectSingle) {
        return pgAggregatesPlanAggregateAttribute(TYPES.int, "order", TYPES.numeric, pgAggregateSpec_variancePopulation, $pgSelectSingle);
      }
    }
  },
  ProjectLinkVarianceSampleAggregates: {
    plans: {
      order($pgSelectSingle) {
        return pgAggregatesPlanAggregateAttribute(TYPES.int, "order", TYPES.numeric, pgAggregateSpec_varianceSample, $pgSelectSingle);
      }
    }
  },
  ProjectMaxAggregates: {
    plans: {
      nextPostNumber($pgSelectSingle) {
        return pgAggregatesPlanAggregateAttribute(TYPES.int, "next_post_number", TYPES.int, pgAggregateSpec_max, $pgSelectSingle);
      }
    }
  },
  ProjectMinAggregates: {
    plans: {
      nextPostNumber($pgSelectSingle) {
        return pgAggregatesPlanAggregateAttribute(TYPES.int, "next_post_number", TYPES.int, pgAggregateSpec_min, $pgSelectSingle);
      }
    }
  },
  ProjectStatusConfig: {
    assertStep: assertPgClassSingleStep,
    plans: {
      createdAt: Comment_createdAtPlan,
      customColor($record) {
        return $record.get("custom_color");
      },
      customDescription($record) {
        return $record.get("custom_description");
      },
      isDefault($record) {
        return $record.get("is_default");
      },
      isEnabled($record) {
        return $record.get("is_enabled");
      },
      project: Post_projectPlan,
      projectId: Post_projectIdPlan,
      rowId: Comment_rowIdPlan,
      sortOrder: ProjectStatusConfig_sortOrderPlan,
      statusTemplate: Post_statusTemplatePlan,
      statusTemplateId: Post_statusTemplateIdPlan
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of project_status_configUniques[0].attributes) spec[pkCol] = get2($specifier, pkCol);
      return resource_project_status_configPgResource.get(spec);
    }
  },
  ProjectStatusConfigAggregates: {
    assertStep: assertPgClassSingleStep,
    plans: {
      average: pgAggregatesPlanAggregates,
      distinctCount: pgAggregatesPlanAggregates,
      keys: PostAggregates_keysPlan,
      max: pgAggregatesPlanAggregates,
      min: pgAggregatesPlanAggregates,
      stddevPopulation: pgAggregatesPlanAggregates,
      stddevSample: pgAggregatesPlanAggregates,
      sum: pgAggregatesPlanAggregates,
      variancePopulation: pgAggregatesPlanAggregates,
      varianceSample: pgAggregatesPlanAggregates
    }
  },
  ProjectStatusConfigAverageAggregates: {
    plans: {
      sortOrder: ProjectStatusConfigAverageAggregates_sortOrderPlan
    }
  },
  ProjectStatusConfigConnection: {
    assertStep: ConnectionStep,
    plans: {
      aggregates: pgAggregatesCloneSubplanWithoutPaginationSingle,
      groupedAggregates: {
        plan: pgAggregateCloneSubplanWithoutPaginationAsAggregate,
        args: {
          groupBy: pgAggregatesApplyGroupedAggregate,
          having: pgAggregatesApplyConditionsToGroupedAggregates
        }
      },
      totalCount: totalCountConnectionPlan
    }
  },
  ProjectStatusConfigDistinctCountAggregates: {
    plans: {
      createdAt: PostDistinctCountAggregates_createdAtPlan,
      customColor($pgSelectSingle) {
        return pgAggregatesPlanAggregateAttribute(TYPES.text, "custom_color", TYPES.bigint, pgAggregateSpec_distinctCount, $pgSelectSingle);
      },
      customDescription($pgSelectSingle) {
        return pgAggregatesPlanAggregateAttribute(TYPES.text, "custom_description", TYPES.bigint, pgAggregateSpec_distinctCount, $pgSelectSingle);
      },
      isDefault($pgSelectSingle) {
        return pgAggregatesPlanAggregateAttribute(TYPES.boolean, "is_default", TYPES.bigint, pgAggregateSpec_distinctCount, $pgSelectSingle);
      },
      isEnabled($pgSelectSingle) {
        return pgAggregatesPlanAggregateAttribute(TYPES.boolean, "is_enabled", TYPES.bigint, pgAggregateSpec_distinctCount, $pgSelectSingle);
      },
      projectId: PostDistinctCountAggregates_projectIdPlan,
      rowId: PostDistinctCountAggregates_rowIdPlan,
      sortOrder: ProjectStatusConfigDistinctCountAggregates_sortOrderPlan,
      statusTemplateId: PostDistinctCountAggregates_statusTemplateIdPlan
    }
  },
  ProjectStatusConfigMaxAggregates: {
    plans: {
      sortOrder: ProjectStatusConfigMaxAggregates_sortOrderPlan
    }
  },
  ProjectStatusConfigMinAggregates: {
    plans: {
      sortOrder: ProjectStatusConfigMinAggregates_sortOrderPlan
    }
  },
  ProjectStatusConfigStddevPopulationAggregates: {
    plans: {
      sortOrder: ProjectStatusConfigStddevPopulationAggregates_sortOrderPlan
    }
  },
  ProjectStatusConfigStddevSampleAggregates: {
    plans: {
      sortOrder: ProjectStatusConfigStddevSampleAggregates_sortOrderPlan
    }
  },
  ProjectStatusConfigSumAggregates: {
    plans: {
      sortOrder: ProjectStatusConfigSumAggregates_sortOrderPlan
    }
  },
  ProjectStatusConfigVariancePopulationAggregates: {
    plans: {
      sortOrder: ProjectStatusConfigVariancePopulationAggregates_sortOrderPlan
    }
  },
  ProjectStatusConfigVarianceSampleAggregates: {
    plans: {
      sortOrder: ProjectStatusConfigVarianceSampleAggregates_sortOrderPlan
    }
  },
  ProjectStddevPopulationAggregates: {
    plans: {
      nextPostNumber($pgSelectSingle) {
        return pgAggregatesPlanAggregateAttribute(TYPES.int, "next_post_number", TYPES.numeric, pgAggregateSpec_stddevPopulation, $pgSelectSingle);
      }
    }
  },
  ProjectStddevSampleAggregates: {
    plans: {
      nextPostNumber($pgSelectSingle) {
        return pgAggregatesPlanAggregateAttribute(TYPES.int, "next_post_number", TYPES.numeric, pgAggregateSpec_stddevSample, $pgSelectSingle);
      }
    }
  },
  ProjectSumAggregates: {
    plans: {
      nextPostNumber($pgSelectSingle) {
        return pgAggregatesPlanAggregateAttribute(TYPES.int, "next_post_number", TYPES.bigint, pgAggregateSpec_sum, $pgSelectSingle);
      }
    }
  },
  ProjectVariancePopulationAggregates: {
    plans: {
      nextPostNumber($pgSelectSingle) {
        return pgAggregatesPlanAggregateAttribute(TYPES.int, "next_post_number", TYPES.numeric, pgAggregateSpec_variancePopulation, $pgSelectSingle);
      }
    }
  },
  ProjectVarianceSampleAggregates: {
    plans: {
      nextPostNumber($pgSelectSingle) {
        return pgAggregatesPlanAggregateAttribute(TYPES.int, "next_post_number", TYPES.numeric, pgAggregateSpec_varianceSample, $pgSelectSingle);
      }
    }
  },
  StatusTemplate: {
    assertStep: assertPgClassSingleStep,
    plans: {
      createdAt: Comment_createdAtPlan,
      displayName($record) {
        return $record.get("display_name");
      },
      organizationId: Project_organizationIdPlan,
      posts: {
        plan($record) {
          const $records = resource_postPgResource.find({
            status_template_id: $record.get("id")
          });
          return connection($records);
        },
        args: {
          first: applyFirstArg,
          last: applyLastArg,
          offset: applyOffsetArg,
          before: applyBeforeArg,
          after: applyAfterArg,
          condition: applyConditionArgToConnection,
          filter: Query_commentsfilterApplyPlan,
          orderBy: applyOrderByArgToConnection
        }
      },
      projectStatusConfigs: {
        plan($record) {
          const $records = resource_project_status_configPgResource.find({
            status_template_id: $record.get("id")
          });
          return connection($records);
        },
        args: {
          first: applyFirstArg,
          last: applyLastArg,
          offset: applyOffsetArg,
          before: applyBeforeArg,
          after: applyAfterArg,
          condition: applyConditionArgToConnection,
          filter: Query_commentsfilterApplyPlan,
          orderBy: applyOrderByArgToConnection
        }
      },
      rowId: Comment_rowIdPlan,
      sortOrder: ProjectStatusConfig_sortOrderPlan,
      updatedAt: Comment_updatedAtPlan
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of status_templateUniques[0].attributes) spec[pkCol] = get2($specifier, pkCol);
      return resource_status_templatePgResource.get(spec);
    }
  },
  StatusTemplateAggregates: {
    assertStep: assertPgClassSingleStep,
    plans: {
      average: pgAggregatesPlanAggregates,
      distinctCount: pgAggregatesPlanAggregates,
      keys: PostAggregates_keysPlan,
      max: pgAggregatesPlanAggregates,
      min: pgAggregatesPlanAggregates,
      stddevPopulation: pgAggregatesPlanAggregates,
      stddevSample: pgAggregatesPlanAggregates,
      sum: pgAggregatesPlanAggregates,
      variancePopulation: pgAggregatesPlanAggregates,
      varianceSample: pgAggregatesPlanAggregates
    }
  },
  StatusTemplateAverageAggregates: {
    plans: {
      sortOrder: ProjectStatusConfigAverageAggregates_sortOrderPlan
    }
  },
  StatusTemplateConnection: {
    assertStep: ConnectionStep,
    plans: {
      aggregates: pgAggregatesCloneSubplanWithoutPaginationSingle,
      groupedAggregates: {
        plan: pgAggregateCloneSubplanWithoutPaginationAsAggregate,
        args: {
          groupBy: pgAggregatesApplyGroupedAggregate,
          having: pgAggregatesApplyConditionsToGroupedAggregates
        }
      },
      totalCount: totalCountConnectionPlan
    }
  },
  StatusTemplateDistinctCountAggregates: {
    plans: {
      color($pgSelectSingle) {
        return pgAggregatesPlanAggregateAttribute(TYPES.text, "color", TYPES.bigint, pgAggregateSpec_distinctCount, $pgSelectSingle);
      },
      createdAt: PostDistinctCountAggregates_createdAtPlan,
      description: PostDistinctCountAggregates_descriptionPlan,
      displayName($pgSelectSingle) {
        return pgAggregatesPlanAggregateAttribute(TYPES.text, "display_name", TYPES.bigint, pgAggregateSpec_distinctCount, $pgSelectSingle);
      },
      name: StatusTemplateDistinctCountAggregates_namePlan,
      organizationId: StatusTemplateDistinctCountAggregates_organizationIdPlan,
      rowId: PostDistinctCountAggregates_rowIdPlan,
      sortOrder: ProjectStatusConfigDistinctCountAggregates_sortOrderPlan,
      updatedAt: PostDistinctCountAggregates_updatedAtPlan
    }
  },
  StatusTemplateMaxAggregates: {
    plans: {
      sortOrder: ProjectStatusConfigMaxAggregates_sortOrderPlan
    }
  },
  StatusTemplateMinAggregates: {
    plans: {
      sortOrder: ProjectStatusConfigMinAggregates_sortOrderPlan
    }
  },
  StatusTemplateStddevPopulationAggregates: {
    plans: {
      sortOrder: ProjectStatusConfigStddevPopulationAggregates_sortOrderPlan
    }
  },
  StatusTemplateStddevSampleAggregates: {
    plans: {
      sortOrder: ProjectStatusConfigStddevSampleAggregates_sortOrderPlan
    }
  },
  StatusTemplateSumAggregates: {
    plans: {
      sortOrder: ProjectStatusConfigSumAggregates_sortOrderPlan
    }
  },
  StatusTemplateVariancePopulationAggregates: {
    plans: {
      sortOrder: ProjectStatusConfigVariancePopulationAggregates_sortOrderPlan
    }
  },
  StatusTemplateVarianceSampleAggregates: {
    plans: {
      sortOrder: ProjectStatusConfigVarianceSampleAggregates_sortOrderPlan
    }
  },
  UpdateCommentPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      comment: planCreatePayloadResult,
      commentEdge: CreateCommentPayload_commentEdgePlan,
      query: queryPlan
    }
  },
  UpdatePostPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      post: planCreatePayloadResult,
      postEdge: CreatePostPayload_postEdgePlan,
      query: queryPlan
    }
  },
  UpdateProjectLinkPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      projectLink: planCreatePayloadResult,
      projectLinkEdge: CreateProjectLinkPayload_projectLinkEdgePlan,
      query: queryPlan
    }
  },
  UpdateProjectPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      project: planCreatePayloadResult,
      projectEdge: CreateProjectPayload_projectEdgePlan,
      query: queryPlan
    }
  },
  UpdateProjectStatusConfigPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      projectStatusConfig: planCreatePayloadResult,
      projectStatusConfigEdge: CreateProjectStatusConfigPayload_projectStatusConfigEdgePlan,
      query: queryPlan
    }
  },
  UpdateStatusTemplatePayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      query: queryPlan,
      statusTemplate: planCreatePayloadResult,
      statusTemplateEdge: CreateStatusTemplatePayload_statusTemplateEdgePlan
    }
  },
  UpdateUserPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      query: queryPlan,
      user: planCreatePayloadResult,
      userEdge: CreateUserPayload_userEdgePlan
    }
  },
  UpdateVotePayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      query: queryPlan,
      vote: planCreatePayloadResult,
      voteEdge: CreateVotePayload_voteEdgePlan
    }
  },
  User: {
    assertStep: assertPgClassSingleStep,
    plans: {
      avatarUrl($record) {
        return $record.get("avatar_url");
      },
      comments: {
        plan($record) {
          const $records = resource_commentPgResource.find({
            user_id: $record.get("id")
          });
          return connection($records);
        },
        args: {
          first: applyFirstArg,
          last: applyLastArg,
          offset: applyOffsetArg,
          before: applyBeforeArg,
          after: applyAfterArg,
          condition: applyConditionArgToConnection,
          filter: Query_commentsfilterApplyPlan,
          orderBy: applyOrderByArgToConnection
        }
      },
      createdAt: Comment_createdAtPlan,
      identityProviderId($record) {
        return $record.get("identity_provider_id");
      },
      posts: {
        plan($record) {
          const $records = resource_postPgResource.find({
            user_id: $record.get("id")
          });
          return connection($records);
        },
        args: {
          first: applyFirstArg,
          last: applyLastArg,
          offset: applyOffsetArg,
          before: applyBeforeArg,
          after: applyAfterArg,
          condition: applyConditionArgToConnection,
          filter: Query_commentsfilterApplyPlan,
          orderBy: applyOrderByArgToConnection
        }
      },
      rowId: Comment_rowIdPlan,
      updatedAt: Comment_updatedAtPlan,
      votes: {
        plan($record) {
          const $records = resource_votePgResource.find({
            user_id: $record.get("id")
          });
          return connection($records);
        },
        args: {
          first: applyFirstArg,
          last: applyLastArg,
          offset: applyOffsetArg,
          before: applyBeforeArg,
          after: applyAfterArg,
          condition: applyConditionArgToConnection,
          filter: Query_commentsfilterApplyPlan,
          orderBy: applyOrderByArgToConnection
        }
      }
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of userUniques[0].attributes) spec[pkCol] = get2($specifier, pkCol);
      return resource_userPgResource.get(spec);
    }
  },
  UserAggregates: {
    assertStep: assertPgClassSingleStep,
    plans: {
      distinctCount: pgAggregatesPlanAggregates,
      keys: PostAggregates_keysPlan
    }
  },
  UserConnection: {
    assertStep: ConnectionStep,
    plans: {
      aggregates: pgAggregatesCloneSubplanWithoutPaginationSingle,
      groupedAggregates: {
        plan: pgAggregateCloneSubplanWithoutPaginationAsAggregate,
        args: {
          groupBy: pgAggregatesApplyGroupedAggregate,
          having: pgAggregatesApplyConditionsToGroupedAggregates
        }
      },
      totalCount: totalCountConnectionPlan
    }
  },
  UserDistinctCountAggregates: {
    plans: {
      avatarUrl($pgSelectSingle) {
        return pgAggregatesPlanAggregateAttribute(TYPES.text, "avatar_url", TYPES.bigint, pgAggregateSpec_distinctCount, $pgSelectSingle);
      },
      createdAt: PostDistinctCountAggregates_createdAtPlan,
      email($pgSelectSingle) {
        return pgAggregatesPlanAggregateAttribute(TYPES.text, "email", TYPES.bigint, pgAggregateSpec_distinctCount, $pgSelectSingle);
      },
      identityProviderId($pgSelectSingle) {
        return pgAggregatesPlanAggregateAttribute(TYPES.uuid, "identity_provider_id", TYPES.bigint, pgAggregateSpec_distinctCount, $pgSelectSingle);
      },
      name: StatusTemplateDistinctCountAggregates_namePlan,
      rowId: PostDistinctCountAggregates_rowIdPlan,
      updatedAt: PostDistinctCountAggregates_updatedAtPlan,
      username($pgSelectSingle) {
        return pgAggregatesPlanAggregateAttribute(TYPES.text, "username", TYPES.bigint, pgAggregateSpec_distinctCount, $pgSelectSingle);
      }
    }
  },
  Vote: {
    assertStep: assertPgClassSingleStep,
    plans: {
      createdAt: Comment_createdAtPlan,
      post: Comment_postPlan,
      postId: Comment_postIdPlan,
      rowId: Comment_rowIdPlan,
      updatedAt: Comment_updatedAtPlan,
      user: Comment_userPlan,
      userId: Comment_userIdPlan,
      voteType($record) {
        return $record.get("vote_type");
      }
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of voteUniques[0].attributes) spec[pkCol] = get2($specifier, pkCol);
      return resource_votePgResource.get(spec);
    }
  },
  VoteAggregates: {
    assertStep: assertPgClassSingleStep,
    plans: {
      distinctCount: pgAggregatesPlanAggregates,
      keys: PostAggregates_keysPlan
    }
  },
  VoteConnection: {
    assertStep: ConnectionStep,
    plans: {
      aggregates: pgAggregatesCloneSubplanWithoutPaginationSingle,
      groupedAggregates: {
        plan: pgAggregateCloneSubplanWithoutPaginationAsAggregate,
        args: {
          groupBy: pgAggregatesApplyGroupedAggregate,
          having: pgAggregatesApplyConditionsToGroupedAggregates
        }
      },
      totalCount: totalCountConnectionPlan
    }
  },
  VoteDistinctCountAggregates: {
    plans: {
      createdAt: PostDistinctCountAggregates_createdAtPlan,
      postId: CommentDistinctCountAggregates_postIdPlan,
      rowId: PostDistinctCountAggregates_rowIdPlan,
      updatedAt: PostDistinctCountAggregates_updatedAtPlan,
      userId: PostDistinctCountAggregates_userIdPlan,
      voteType($pgSelectSingle) {
        return pgAggregatesPlanAggregateAttribute(voteTypeCodec, "vote_type", TYPES.bigint, pgAggregateSpec_distinctCount, $pgSelectSingle);
      }
    }
  }
};
export const interfaces = {
  Node: {
    planType($nodeId) {
      const $specifier = decodeNodeId($nodeId);
      return {
        $__typename: lambda($specifier, findTypeNameMatch, !0),
        planForType(type) {
          const spec = nodeIdHandlerByTypeName[type.name];
          if (spec) return spec.get(spec.getSpec(access($specifier, [spec.codec.name])));else throw Error(`Failed to find handler for ${type.name}`);
        }
      };
    }
  }
};
export const inputObjects = {
  BigFloatFilter: {
    plans: {
      distinctFrom: pgAggregatesApply_distinctFrom,
      equalTo: pgAggregatesApply_equalTo,
      greaterThan: pgAggregatesApply_greaterThan,
      greaterThanOrEqualTo: pgAggregatesApply_greaterThanOrEqualTo,
      in: pgAggregatesApply_in,
      isNull: pgAggregatesApply_isNull,
      lessThan: pgAggregatesApply_lessThan,
      lessThanOrEqualTo: pgAggregatesApply_lessThanOrEqualTo,
      notDistinctFrom: pgAggregatesApply_notDistinctFrom,
      notEqualTo: pgAggregatesApply_notEqualTo,
      notIn: pgAggregatesApply_notIn
    }
  },
  BigIntFilter: {
    plans: {
      distinctFrom: pgAggregatesApply_distinctFrom,
      equalTo: pgAggregatesApply_equalTo,
      greaterThan: pgAggregatesApply_greaterThan,
      greaterThanOrEqualTo: pgAggregatesApply_greaterThanOrEqualTo,
      in: pgAggregatesApply_in,
      isNull: pgAggregatesApply_isNull,
      lessThan: pgAggregatesApply_lessThan,
      lessThanOrEqualTo: pgAggregatesApply_lessThanOrEqualTo,
      notDistinctFrom: pgAggregatesApply_notDistinctFrom,
      notEqualTo: pgAggregatesApply_notEqualTo,
      notIn: pgAggregatesApply_notIn
    }
  },
  BooleanFilter: {
    plans: {
      distinctFrom: pgAggregatesApply_distinctFrom,
      equalTo: pgAggregatesApply_equalTo,
      greaterThan: pgAggregatesApply_greaterThan,
      greaterThanOrEqualTo: pgAggregatesApply_greaterThanOrEqualTo,
      in: pgAggregatesApply_in,
      isNull: pgAggregatesApply_isNull,
      lessThan: pgAggregatesApply_lessThan,
      lessThanOrEqualTo: pgAggregatesApply_lessThanOrEqualTo,
      notDistinctFrom: pgAggregatesApply_notDistinctFrom,
      notEqualTo: pgAggregatesApply_notEqualTo,
      notIn: pgAggregatesApply_notIn
    }
  },
  CommentAggregatesFilter: {
    plans: {
      distinctCount: CommentAggregatesFilter_distinctCountApply,
      filter: filterApply
    }
  },
  CommentCondition: {
    plans: {
      createdAt: PostCondition_createdAtApply,
      message($condition, val) {
        return applyAttributeCondition("message", TYPES.text, $condition, val);
      },
      parentId($condition, val) {
        return applyAttributeCondition("parent_id", TYPES.uuid, $condition, val);
      },
      postId: CommentCondition_postIdApply,
      rowId: PostCondition_rowIdApply,
      updatedAt: PostCondition_updatedAtApply,
      userId: PostCondition_userIdApply
    }
  },
  CommentDistinctCountAggregateFilter: {
    plans: {
      createdAt: CommentDistinctCountAggregateFilter_createdAtApply,
      message($parent, input) {
        return pgAggregateApplyAttributeOrder(pgAggregateSpec_distinctCount, "message", TYPES.bigint, TYPES.text, $parent, input);
      },
      parentId($parent, input) {
        return pgAggregateApplyAttributeOrder(pgAggregateSpec_distinctCount, "parent_id", TYPES.bigint, TYPES.uuid, $parent, input);
      },
      postId: CommentDistinctCountAggregateFilter_postIdApply,
      rowId: CommentDistinctCountAggregateFilter_rowIdApply,
      updatedAt: CommentDistinctCountAggregateFilter_updatedAtApply,
      userId: CommentDistinctCountAggregateFilter_userIdApply
    }
  },
  CommentFilter: {
    plans: {
      and: PostFilter_andApply,
      childComments($where, value) {
        assertAllowed(value, "object");
        const $rel = $where.andPlan();
        $rel.extensions.pgFilterRelation = {
          tableExpression: commentIdentifier,
          alias: resource_commentPgResource.name,
          localAttributes: registryConfig.pgRelations.comment.commentsByTheirParentId.localAttributes,
          remoteAttributes: registryConfig.pgRelations.comment.commentsByTheirParentId.remoteAttributes
        };
        return $rel;
      },
      childCommentsExist($where, value) {
        assertAllowed(value, "scalar");
        if (value == null) return;
        const $subQuery = $where.existsPlan({
          tableExpression: commentIdentifier,
          alias: resource_commentPgResource.name,
          equals: value
        });
        registryConfig.pgRelations.comment.commentsByTheirParentId.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = registryConfig.pgRelations.comment.commentsByTheirParentId.remoteAttributes[i];
          $subQuery.where(sql`${$where.alias}.${sql.identifier(localAttribute)} = ${$subQuery.alias}.${sql.identifier(remoteAttribute)}`);
        });
      },
      createdAt(queryBuilder, value) {
        return pgConnectionFilterApplyAttribute("createdAt", "created_at", spec_comment.attributes.created_at, queryBuilder, value);
      },
      message(queryBuilder, value) {
        return pgConnectionFilterApplyAttribute("message", "message", spec_comment.attributes.message, queryBuilder, value);
      },
      not: PostFilter_notApply,
      or: PostFilter_orApply,
      parent($where, value) {
        return pgConnectionFilterApplySingleRelation(resource_commentPgResource, commentIdentifier, registryConfig.pgRelations.comment.commentByMyParentId.localAttributes, registryConfig.pgRelations.comment.commentByMyParentId.remoteAttributes, $where, value);
      },
      parentExists($where, value) {
        return pgConnectionFilterApplyForwardRelationExists(resource_commentPgResource, commentIdentifier, registryConfig.pgRelations.comment.commentByMyParentId.localAttributes, registryConfig.pgRelations.comment.commentByMyParentId.remoteAttributes, $where, value);
      },
      parentId(queryBuilder, value) {
        return pgConnectionFilterApplyAttribute("parentId", "parent_id", spec_comment.attributes.parent_id, queryBuilder, value);
      },
      post($where, value) {
        return pgConnectionFilterApplySingleRelation(resource_postPgResource, postIdentifier, registryConfig.pgRelations.comment.postByMyPostId.localAttributes, registryConfig.pgRelations.comment.postByMyPostId.remoteAttributes, $where, value);
      },
      postId(queryBuilder, value) {
        return pgConnectionFilterApplyAttribute("postId", "post_id", spec_comment.attributes.post_id, queryBuilder, value);
      },
      rowId(queryBuilder, value) {
        return pgConnectionFilterApplyAttribute("rowId", "id", spec_comment.attributes.id, queryBuilder, value);
      },
      updatedAt(queryBuilder, value) {
        return pgConnectionFilterApplyAttribute("updatedAt", "updated_at", spec_comment.attributes.updated_at, queryBuilder, value);
      },
      user($where, value) {
        return pgConnectionFilterApplySingleRelation(resource_userPgResource, userIdentifier, registryConfig.pgRelations.comment.userByMyUserId.localAttributes, registryConfig.pgRelations.comment.userByMyUserId.remoteAttributes, $where, value);
      },
      userId(queryBuilder, value) {
        return pgConnectionFilterApplyAttribute("userId", "user_id", spec_comment.attributes.user_id, queryBuilder, value);
      }
    }
  },
  CommentHavingAverageInput: {
    plans: {
      createdAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_average, spec_comment.attributes.created_at, "created_at", $having);
      },
      updatedAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_average, spec_comment.attributes.updated_at, "updated_at", $having);
      }
    }
  },
  CommentHavingDistinctCountInput: {
    plans: {
      createdAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_distinctCount, spec_comment.attributes.created_at, "created_at", $having);
      },
      updatedAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_distinctCount, spec_comment.attributes.updated_at, "updated_at", $having);
      }
    }
  },
  CommentHavingInput: {
    plans: {
      AND: pgAggregatesApplyAnd,
      average: pgAggregatesPlanAggregatesField,
      distinctCount: pgAggregatesPlanAggregatesField,
      max: pgAggregatesPlanAggregatesField,
      min: pgAggregatesPlanAggregatesField,
      OR: PostHavingInput_ORApply,
      stddevPopulation: pgAggregatesPlanAggregatesField,
      stddevSample: pgAggregatesPlanAggregatesField,
      sum: pgAggregatesPlanAggregatesField,
      variancePopulation: pgAggregatesPlanAggregatesField,
      varianceSample: pgAggregatesPlanAggregatesField
    }
  },
  CommentHavingMaxInput: {
    plans: {
      createdAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_max, spec_comment.attributes.created_at, "created_at", $having);
      },
      updatedAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_max, spec_comment.attributes.updated_at, "updated_at", $having);
      }
    }
  },
  CommentHavingMinInput: {
    plans: {
      createdAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_min, spec_comment.attributes.created_at, "created_at", $having);
      },
      updatedAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_min, spec_comment.attributes.updated_at, "updated_at", $having);
      }
    }
  },
  CommentHavingStddevPopulationInput: {
    plans: {
      createdAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_stddevPopulation, spec_comment.attributes.created_at, "created_at", $having);
      },
      updatedAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_stddevPopulation, spec_comment.attributes.updated_at, "updated_at", $having);
      }
    }
  },
  CommentHavingStddevSampleInput: {
    plans: {
      createdAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_stddevSample, spec_comment.attributes.created_at, "created_at", $having);
      },
      updatedAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_stddevSample, spec_comment.attributes.updated_at, "updated_at", $having);
      }
    }
  },
  CommentHavingSumInput: {
    plans: {
      createdAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_sum, spec_comment.attributes.created_at, "created_at", $having);
      },
      updatedAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_sum, spec_comment.attributes.updated_at, "updated_at", $having);
      }
    }
  },
  CommentHavingVariancePopulationInput: {
    plans: {
      createdAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_variancePopulation, spec_comment.attributes.created_at, "created_at", $having);
      },
      updatedAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_variancePopulation, spec_comment.attributes.updated_at, "updated_at", $having);
      }
    }
  },
  CommentHavingVarianceSampleInput: {
    plans: {
      createdAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_varianceSample, spec_comment.attributes.created_at, "created_at", $having);
      },
      updatedAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_varianceSample, spec_comment.attributes.updated_at, "updated_at", $having);
      }
    }
  },
  CommentInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      createdAt: CommentInput_createdAtApply,
      message: CommentInput_messageApply,
      parentId: CommentInput_parentIdApply,
      postId: CommentInput_postIdApply,
      rowId: CommentInput_rowIdApply,
      updatedAt: CommentInput_updatedAtApply,
      userId: CommentInput_userIdApply
    }
  },
  CommentPatch: {
    baked: createObjectAndApplyChildren,
    plans: {
      createdAt: CommentInput_createdAtApply,
      message: CommentInput_messageApply,
      parentId: CommentInput_parentIdApply,
      postId: CommentInput_postIdApply,
      rowId: CommentInput_rowIdApply,
      updatedAt: CommentInput_updatedAtApply,
      userId: CommentInput_userIdApply
    }
  },
  CommentToManyCommentFilter: {
    plans: {
      aggregates: PostToManyCommentFilter_aggregatesApply,
      every: PostToManyCommentFilter_everyApply,
      none: PostToManyCommentFilter_noneApply,
      some: PostToManyCommentFilter_someApply
    }
  },
  CreateCommentInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      comment: applyCreateFields
    }
  },
  CreatePostInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      post: applyCreateFields
    }
  },
  CreateProjectInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      project: applyCreateFields
    }
  },
  CreateProjectLinkInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      projectLink: applyCreateFields
    }
  },
  CreateProjectStatusConfigInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      projectStatusConfig: applyCreateFields
    }
  },
  CreateStatusTemplateInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      statusTemplate: applyCreateFields
    }
  },
  CreateUserInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      user: applyCreateFields
    }
  },
  CreateVoteInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      vote: applyCreateFields
    }
  },
  DatetimeFilter: {
    plans: {
      distinctFrom: pgAggregatesApply_distinctFrom,
      equalTo: pgAggregatesApply_equalTo,
      greaterThan: pgAggregatesApply_greaterThan,
      greaterThanOrEqualTo: pgAggregatesApply_greaterThanOrEqualTo,
      in: pgAggregatesApply_in,
      isNull: pgAggregatesApply_isNull,
      lessThan: pgAggregatesApply_lessThan,
      lessThanOrEqualTo: pgAggregatesApply_lessThanOrEqualTo,
      notDistinctFrom: pgAggregatesApply_notDistinctFrom,
      notEqualTo: pgAggregatesApply_notEqualTo,
      notIn: pgAggregatesApply_notIn
    }
  },
  DeleteCommentInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate
    }
  },
  DeletePostInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate
    }
  },
  DeleteProjectInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate
    }
  },
  DeleteProjectLinkInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate
    }
  },
  DeleteProjectStatusConfigInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate
    }
  },
  DeleteStatusTemplateInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate
    }
  },
  DeleteUserInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate
    }
  },
  DeleteVoteInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate
    }
  },
  HavingDatetimeFilter: {
    plans: {
      equalTo($booleanFilter, input) {
        return pgAggregatesApplyHavingBinaryOperation(TYPES.timestamptz, infix, $booleanFilter, input);
      },
      greaterThan($booleanFilter, input) {
        return pgAggregatesApplyHavingBinaryOperation(TYPES.timestamptz, infix3, $booleanFilter, input);
      },
      greaterThanOrEqualTo($booleanFilter, input) {
        return pgAggregatesApplyHavingBinaryOperation(TYPES.timestamptz, infix4, $booleanFilter, input);
      },
      lessThan($booleanFilter, input) {
        return pgAggregatesApplyHavingBinaryOperation(TYPES.timestamptz, infix5, $booleanFilter, input);
      },
      lessThanOrEqualTo($booleanFilter, input) {
        return pgAggregatesApplyHavingBinaryOperation(TYPES.timestamptz, infix6, $booleanFilter, input);
      },
      notEqualTo($booleanFilter, input) {
        return pgAggregatesApplyHavingBinaryOperation(TYPES.timestamptz, infix2, $booleanFilter, input);
      }
    }
  },
  HavingIntFilter: {
    plans: {
      equalTo($booleanFilter, input) {
        return pgAggregatesApplyHavingBinaryOperation(TYPES.int, infix, $booleanFilter, input);
      },
      greaterThan($booleanFilter, input) {
        return pgAggregatesApplyHavingBinaryOperation(TYPES.int, infix3, $booleanFilter, input);
      },
      greaterThanOrEqualTo($booleanFilter, input) {
        return pgAggregatesApplyHavingBinaryOperation(TYPES.int, infix4, $booleanFilter, input);
      },
      lessThan($booleanFilter, input) {
        return pgAggregatesApplyHavingBinaryOperation(TYPES.int, infix5, $booleanFilter, input);
      },
      lessThanOrEqualTo($booleanFilter, input) {
        return pgAggregatesApplyHavingBinaryOperation(TYPES.int, infix6, $booleanFilter, input);
      },
      notEqualTo($booleanFilter, input) {
        return pgAggregatesApplyHavingBinaryOperation(TYPES.int, infix2, $booleanFilter, input);
      }
    }
  },
  IntFilter: {
    plans: {
      distinctFrom: pgAggregatesApply_distinctFrom,
      equalTo: pgAggregatesApply_equalTo,
      greaterThan: pgAggregatesApply_greaterThan,
      greaterThanOrEqualTo: pgAggregatesApply_greaterThanOrEqualTo,
      in: pgAggregatesApply_in,
      isNull: pgAggregatesApply_isNull,
      lessThan: pgAggregatesApply_lessThan,
      lessThanOrEqualTo: pgAggregatesApply_lessThanOrEqualTo,
      notDistinctFrom: pgAggregatesApply_notDistinctFrom,
      notEqualTo: pgAggregatesApply_notEqualTo,
      notIn: pgAggregatesApply_notIn
    }
  },
  PostAggregatesFilter: {
    plans: {
      average: PostAggregatesFilter_averageApply,
      distinctCount: CommentAggregatesFilter_distinctCountApply,
      filter: filterApply,
      max: PostAggregatesFilter_maxApply,
      min: PostAggregatesFilter_minApply,
      stddevPopulation: PostAggregatesFilter_stddevPopulationApply,
      stddevSample: PostAggregatesFilter_stddevSampleApply,
      sum: PostAggregatesFilter_sumApply,
      variancePopulation: PostAggregatesFilter_variancePopulationApply,
      varianceSample: PostAggregatesFilter_varianceSampleApply
    }
  },
  PostAverageAggregateFilter: {
    plans: {
      number($parent, input) {
        return pgAggregateApplyAttributeOrder(pgAggregateSpec_average, "number", TYPES.numeric, TYPES.int, $parent, input);
      }
    }
  },
  PostCondition: {
    plans: {
      createdAt: PostCondition_createdAtApply,
      description: PostCondition_descriptionApply,
      number($condition, val) {
        return applyAttributeCondition("number", TYPES.int, $condition, val);
      },
      projectId: PostCondition_projectIdApply,
      rowId: PostCondition_rowIdApply,
      statusTemplateId: PostCondition_statusTemplateIdApply,
      statusUpdatedAt($condition, val) {
        return applyAttributeCondition("status_updated_at", TYPES.timestamptz, $condition, val);
      },
      title: PostCondition_titleApply,
      updatedAt: PostCondition_updatedAtApply,
      userId: PostCondition_userIdApply
    }
  },
  PostDistinctCountAggregateFilter: {
    plans: {
      createdAt: CommentDistinctCountAggregateFilter_createdAtApply,
      description($parent, input) {
        return pgAggregateApplyAttributeOrder(pgAggregateSpec_distinctCount, "description", TYPES.bigint, TYPES.text, $parent, input);
      },
      number($parent, input) {
        return pgAggregateApplyAttributeOrder(pgAggregateSpec_distinctCount, "number", TYPES.bigint, TYPES.int, $parent, input);
      },
      projectId: PostDistinctCountAggregateFilter_projectIdApply,
      rowId: CommentDistinctCountAggregateFilter_rowIdApply,
      statusTemplateId: PostDistinctCountAggregateFilter_statusTemplateIdApply,
      statusUpdatedAt($parent, input) {
        return pgAggregateApplyAttributeOrder(pgAggregateSpec_distinctCount, "status_updated_at", TYPES.bigint, TYPES.timestamptz, $parent, input);
      },
      title: PostDistinctCountAggregateFilter_titleApply,
      updatedAt: CommentDistinctCountAggregateFilter_updatedAtApply,
      userId: CommentDistinctCountAggregateFilter_userIdApply
    }
  },
  PostFilter: {
    plans: {
      and: PostFilter_andApply,
      comments($where, value) {
        assertAllowed(value, "object");
        const $rel = $where.andPlan();
        $rel.extensions.pgFilterRelation = {
          tableExpression: commentIdentifier,
          alias: resource_commentPgResource.name,
          localAttributes: registryConfig.pgRelations.post.commentsByTheirPostId.localAttributes,
          remoteAttributes: registryConfig.pgRelations.post.commentsByTheirPostId.remoteAttributes
        };
        return $rel;
      },
      commentsExist($where, value) {
        assertAllowed(value, "scalar");
        if (value == null) return;
        const $subQuery = $where.existsPlan({
          tableExpression: commentIdentifier,
          alias: resource_commentPgResource.name,
          equals: value
        });
        registryConfig.pgRelations.post.commentsByTheirPostId.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = registryConfig.pgRelations.post.commentsByTheirPostId.remoteAttributes[i];
          $subQuery.where(sql`${$where.alias}.${sql.identifier(localAttribute)} = ${$subQuery.alias}.${sql.identifier(remoteAttribute)}`);
        });
      },
      createdAt(queryBuilder, value) {
        return pgConnectionFilterApplyAttribute("createdAt", "created_at", spec_post.attributes.created_at, queryBuilder, value);
      },
      description(queryBuilder, value) {
        return pgConnectionFilterApplyAttribute("description", "description", spec_post.attributes.description, queryBuilder, value);
      },
      not: PostFilter_notApply,
      number(queryBuilder, value) {
        return pgConnectionFilterApplyAttribute("number", "number", spec_post.attributes.number, queryBuilder, value);
      },
      or: PostFilter_orApply,
      project($where, value) {
        return pgConnectionFilterApplySingleRelation(resource_projectPgResource, projectIdentifier, registryConfig.pgRelations.post.projectByMyProjectId.localAttributes, registryConfig.pgRelations.post.projectByMyProjectId.remoteAttributes, $where, value);
      },
      projectId(queryBuilder, value) {
        return pgConnectionFilterApplyAttribute("projectId", "project_id", spec_post.attributes.project_id, queryBuilder, value);
      },
      rowId(queryBuilder, value) {
        return pgConnectionFilterApplyAttribute("rowId", "id", spec_post.attributes.id, queryBuilder, value);
      },
      statusTemplate($where, value) {
        return pgConnectionFilterApplySingleRelation(resource_status_templatePgResource, statusTemplateIdentifier, registryConfig.pgRelations.post.statusTemplateByMyStatusTemplateId.localAttributes, registryConfig.pgRelations.post.statusTemplateByMyStatusTemplateId.remoteAttributes, $where, value);
      },
      statusTemplateExists($where, value) {
        return pgConnectionFilterApplyForwardRelationExists(resource_status_templatePgResource, statusTemplateIdentifier, registryConfig.pgRelations.post.statusTemplateByMyStatusTemplateId.localAttributes, registryConfig.pgRelations.post.statusTemplateByMyStatusTemplateId.remoteAttributes, $where, value);
      },
      statusTemplateId(queryBuilder, value) {
        return pgConnectionFilterApplyAttribute("statusTemplateId", "status_template_id", spec_post.attributes.status_template_id, queryBuilder, value);
      },
      statusUpdatedAt(queryBuilder, value) {
        return pgConnectionFilterApplyAttribute("statusUpdatedAt", "status_updated_at", spec_post.attributes.status_updated_at, queryBuilder, value);
      },
      title(queryBuilder, value) {
        return pgConnectionFilterApplyAttribute("title", "title", spec_post.attributes.title, queryBuilder, value);
      },
      updatedAt(queryBuilder, value) {
        return pgConnectionFilterApplyAttribute("updatedAt", "updated_at", spec_post.attributes.updated_at, queryBuilder, value);
      },
      user($where, value) {
        return pgConnectionFilterApplySingleRelation(resource_userPgResource, userIdentifier, registryConfig.pgRelations.post.userByMyUserId.localAttributes, registryConfig.pgRelations.post.userByMyUserId.remoteAttributes, $where, value);
      },
      userId(queryBuilder, value) {
        return pgConnectionFilterApplyAttribute("userId", "user_id", spec_post.attributes.user_id, queryBuilder, value);
      },
      votes($where, value) {
        assertAllowed(value, "object");
        const $rel = $where.andPlan();
        $rel.extensions.pgFilterRelation = {
          tableExpression: voteIdentifier,
          alias: resource_votePgResource.name,
          localAttributes: registryConfig.pgRelations.post.votesByTheirPostId.localAttributes,
          remoteAttributes: registryConfig.pgRelations.post.votesByTheirPostId.remoteAttributes
        };
        return $rel;
      },
      votesExist($where, value) {
        assertAllowed(value, "scalar");
        if (value == null) return;
        const $subQuery = $where.existsPlan({
          tableExpression: voteIdentifier,
          alias: resource_votePgResource.name,
          equals: value
        });
        registryConfig.pgRelations.post.votesByTheirPostId.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = registryConfig.pgRelations.post.votesByTheirPostId.remoteAttributes[i];
          $subQuery.where(sql`${$where.alias}.${sql.identifier(localAttribute)} = ${$subQuery.alias}.${sql.identifier(remoteAttribute)}`);
        });
      }
    }
  },
  PostHavingAverageInput: {
    plans: {
      createdAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_average, spec_post.attributes.created_at, "created_at", $having);
      },
      number($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_average, spec_post.attributes.number, "number", $having);
      },
      statusUpdatedAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_average, spec_post.attributes.status_updated_at, "status_updated_at", $having);
      },
      updatedAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_average, spec_post.attributes.updated_at, "updated_at", $having);
      }
    }
  },
  PostHavingDistinctCountInput: {
    plans: {
      createdAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_distinctCount, spec_post.attributes.created_at, "created_at", $having);
      },
      number($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_distinctCount, spec_post.attributes.number, "number", $having);
      },
      statusUpdatedAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_distinctCount, spec_post.attributes.status_updated_at, "status_updated_at", $having);
      },
      updatedAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_distinctCount, spec_post.attributes.updated_at, "updated_at", $having);
      }
    }
  },
  PostHavingInput: {
    plans: {
      AND: pgAggregatesApplyAnd,
      average: pgAggregatesPlanAggregatesField,
      distinctCount: pgAggregatesPlanAggregatesField,
      max: pgAggregatesPlanAggregatesField,
      min: pgAggregatesPlanAggregatesField,
      OR: PostHavingInput_ORApply,
      stddevPopulation: pgAggregatesPlanAggregatesField,
      stddevSample: pgAggregatesPlanAggregatesField,
      sum: pgAggregatesPlanAggregatesField,
      variancePopulation: pgAggregatesPlanAggregatesField,
      varianceSample: pgAggregatesPlanAggregatesField
    }
  },
  PostHavingMaxInput: {
    plans: {
      createdAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_max, spec_post.attributes.created_at, "created_at", $having);
      },
      number($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_max, spec_post.attributes.number, "number", $having);
      },
      statusUpdatedAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_max, spec_post.attributes.status_updated_at, "status_updated_at", $having);
      },
      updatedAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_max, spec_post.attributes.updated_at, "updated_at", $having);
      }
    }
  },
  PostHavingMinInput: {
    plans: {
      createdAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_min, spec_post.attributes.created_at, "created_at", $having);
      },
      number($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_min, spec_post.attributes.number, "number", $having);
      },
      statusUpdatedAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_min, spec_post.attributes.status_updated_at, "status_updated_at", $having);
      },
      updatedAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_min, spec_post.attributes.updated_at, "updated_at", $having);
      }
    }
  },
  PostHavingStddevPopulationInput: {
    plans: {
      createdAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_stddevPopulation, spec_post.attributes.created_at, "created_at", $having);
      },
      number($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_stddevPopulation, spec_post.attributes.number, "number", $having);
      },
      statusUpdatedAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_stddevPopulation, spec_post.attributes.status_updated_at, "status_updated_at", $having);
      },
      updatedAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_stddevPopulation, spec_post.attributes.updated_at, "updated_at", $having);
      }
    }
  },
  PostHavingStddevSampleInput: {
    plans: {
      createdAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_stddevSample, spec_post.attributes.created_at, "created_at", $having);
      },
      number($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_stddevSample, spec_post.attributes.number, "number", $having);
      },
      statusUpdatedAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_stddevSample, spec_post.attributes.status_updated_at, "status_updated_at", $having);
      },
      updatedAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_stddevSample, spec_post.attributes.updated_at, "updated_at", $having);
      }
    }
  },
  PostHavingSumInput: {
    plans: {
      createdAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_sum, spec_post.attributes.created_at, "created_at", $having);
      },
      number($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_sum, spec_post.attributes.number, "number", $having);
      },
      statusUpdatedAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_sum, spec_post.attributes.status_updated_at, "status_updated_at", $having);
      },
      updatedAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_sum, spec_post.attributes.updated_at, "updated_at", $having);
      }
    }
  },
  PostHavingVariancePopulationInput: {
    plans: {
      createdAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_variancePopulation, spec_post.attributes.created_at, "created_at", $having);
      },
      number($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_variancePopulation, spec_post.attributes.number, "number", $having);
      },
      statusUpdatedAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_variancePopulation, spec_post.attributes.status_updated_at, "status_updated_at", $having);
      },
      updatedAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_variancePopulation, spec_post.attributes.updated_at, "updated_at", $having);
      }
    }
  },
  PostHavingVarianceSampleInput: {
    plans: {
      createdAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_varianceSample, spec_post.attributes.created_at, "created_at", $having);
      },
      number($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_varianceSample, spec_post.attributes.number, "number", $having);
      },
      statusUpdatedAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_varianceSample, spec_post.attributes.status_updated_at, "status_updated_at", $having);
      },
      updatedAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_varianceSample, spec_post.attributes.updated_at, "updated_at", $having);
      }
    }
  },
  PostInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      createdAt: CommentInput_createdAtApply,
      description: StatusTemplateInput_descriptionApply,
      number: PostInput_numberApply,
      projectId: ProjectLinkInput_projectIdApply,
      rowId: CommentInput_rowIdApply,
      statusTemplateId: ProjectStatusConfigInput_statusTemplateIdApply,
      statusUpdatedAt: PostInput_statusUpdatedAtApply,
      title: ProjectLinkInput_titleApply,
      updatedAt: CommentInput_updatedAtApply,
      userId: CommentInput_userIdApply
    }
  },
  PostMaxAggregateFilter: {
    plans: {
      number($parent, input) {
        return pgAggregateApplyAttributeOrder(pgAggregateSpec_max, "number", TYPES.int, TYPES.int, $parent, input);
      }
    }
  },
  PostMinAggregateFilter: {
    plans: {
      number($parent, input) {
        return pgAggregateApplyAttributeOrder(pgAggregateSpec_min, "number", TYPES.int, TYPES.int, $parent, input);
      }
    }
  },
  PostPatch: {
    baked: createObjectAndApplyChildren,
    plans: {
      createdAt: CommentInput_createdAtApply,
      description: StatusTemplateInput_descriptionApply,
      number: PostInput_numberApply,
      projectId: ProjectLinkInput_projectIdApply,
      rowId: CommentInput_rowIdApply,
      statusTemplateId: ProjectStatusConfigInput_statusTemplateIdApply,
      statusUpdatedAt: PostInput_statusUpdatedAtApply,
      title: ProjectLinkInput_titleApply,
      updatedAt: CommentInput_updatedAtApply,
      userId: CommentInput_userIdApply
    }
  },
  PostStddevPopulationAggregateFilter: {
    plans: {
      number($parent, input) {
        return pgAggregateApplyAttributeOrder(pgAggregateSpec_stddevPopulation, "number", TYPES.numeric, TYPES.int, $parent, input);
      }
    }
  },
  PostStddevSampleAggregateFilter: {
    plans: {
      number($parent, input) {
        return pgAggregateApplyAttributeOrder(pgAggregateSpec_stddevSample, "number", TYPES.numeric, TYPES.int, $parent, input);
      }
    }
  },
  PostSumAggregateFilter: {
    plans: {
      number($parent, input) {
        return pgAggregateApplyAttributeOrder(pgAggregateSpec_sum, "number", TYPES.bigint, TYPES.int, $parent, input);
      }
    }
  },
  PostToManyCommentFilter: {
    plans: {
      aggregates: PostToManyCommentFilter_aggregatesApply,
      every: PostToManyCommentFilter_everyApply,
      none: PostToManyCommentFilter_noneApply,
      some: PostToManyCommentFilter_someApply
    }
  },
  PostToManyVoteFilter: {
    plans: {
      aggregates: PostToManyCommentFilter_aggregatesApply,
      every: PostToManyCommentFilter_everyApply,
      none: PostToManyCommentFilter_noneApply,
      some: PostToManyCommentFilter_someApply
    }
  },
  PostVariancePopulationAggregateFilter: {
    plans: {
      number($parent, input) {
        return pgAggregateApplyAttributeOrder(pgAggregateSpec_variancePopulation, "number", TYPES.numeric, TYPES.int, $parent, input);
      }
    }
  },
  PostVarianceSampleAggregateFilter: {
    plans: {
      number($parent, input) {
        return pgAggregateApplyAttributeOrder(pgAggregateSpec_varianceSample, "number", TYPES.numeric, TYPES.int, $parent, input);
      }
    }
  },
  ProjectCondition: {
    plans: {
      createdAt: PostCondition_createdAtApply,
      description: PostCondition_descriptionApply,
      image($condition, val) {
        return applyAttributeCondition("image", TYPES.text, $condition, val);
      },
      isPublic($condition, val) {
        return applyAttributeCondition("is_public", TYPES.boolean, $condition, val);
      },
      name: StatusTemplateCondition_nameApply,
      nextPostNumber($condition, val) {
        return applyAttributeCondition("next_post_number", TYPES.int, $condition, val);
      },
      organizationId: StatusTemplateCondition_organizationIdApply,
      prefix($condition, val) {
        return applyAttributeCondition("prefix", TYPES.varchar, $condition, val);
      },
      rowId: PostCondition_rowIdApply,
      slug($condition, val) {
        return applyAttributeCondition("slug", TYPES.text, $condition, val);
      },
      updatedAt: PostCondition_updatedAtApply
    }
  },
  ProjectFilter: {
    plans: {
      and: PostFilter_andApply,
      createdAt(queryBuilder, value) {
        return pgConnectionFilterApplyAttribute("createdAt", "created_at", spec_project.attributes.created_at, queryBuilder, value);
      },
      description(queryBuilder, value) {
        return pgConnectionFilterApplyAttribute("description", "description", spec_project.attributes.description, queryBuilder, value);
      },
      image(queryBuilder, value) {
        return pgConnectionFilterApplyAttribute("image", "image", spec_project.attributes.image, queryBuilder, value);
      },
      isPublic(queryBuilder, value) {
        return pgConnectionFilterApplyAttribute("isPublic", "is_public", spec_project.attributes.is_public, queryBuilder, value);
      },
      name(queryBuilder, value) {
        return pgConnectionFilterApplyAttribute("name", "name", spec_project.attributes.name, queryBuilder, value);
      },
      nextPostNumber(queryBuilder, value) {
        return pgConnectionFilterApplyAttribute("nextPostNumber", "next_post_number", spec_project.attributes.next_post_number, queryBuilder, value);
      },
      not: PostFilter_notApply,
      or: PostFilter_orApply,
      organizationId(queryBuilder, value) {
        return pgConnectionFilterApplyAttribute("organizationId", "organization_id", spec_project.attributes.organization_id, queryBuilder, value);
      },
      posts($where, value) {
        assertAllowed(value, "object");
        const $rel = $where.andPlan();
        $rel.extensions.pgFilterRelation = {
          tableExpression: postIdentifier,
          alias: resource_postPgResource.name,
          localAttributes: registryConfig.pgRelations.project.postsByTheirProjectId.localAttributes,
          remoteAttributes: registryConfig.pgRelations.project.postsByTheirProjectId.remoteAttributes
        };
        return $rel;
      },
      postsExist($where, value) {
        assertAllowed(value, "scalar");
        if (value == null) return;
        const $subQuery = $where.existsPlan({
          tableExpression: postIdentifier,
          alias: resource_postPgResource.name,
          equals: value
        });
        registryConfig.pgRelations.project.postsByTheirProjectId.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = registryConfig.pgRelations.project.postsByTheirProjectId.remoteAttributes[i];
          $subQuery.where(sql`${$where.alias}.${sql.identifier(localAttribute)} = ${$subQuery.alias}.${sql.identifier(remoteAttribute)}`);
        });
      },
      prefix(queryBuilder, value) {
        return pgConnectionFilterApplyAttribute("prefix", "prefix", spec_project.attributes.prefix, queryBuilder, value);
      },
      projectLinks($where, value) {
        assertAllowed(value, "object");
        const $rel = $where.andPlan();
        $rel.extensions.pgFilterRelation = {
          tableExpression: projectLinkIdentifier,
          alias: resource_project_linkPgResource.name,
          localAttributes: registryConfig.pgRelations.project.projectLinksByTheirProjectId.localAttributes,
          remoteAttributes: registryConfig.pgRelations.project.projectLinksByTheirProjectId.remoteAttributes
        };
        return $rel;
      },
      projectLinksExist($where, value) {
        assertAllowed(value, "scalar");
        if (value == null) return;
        const $subQuery = $where.existsPlan({
          tableExpression: projectLinkIdentifier,
          alias: resource_project_linkPgResource.name,
          equals: value
        });
        registryConfig.pgRelations.project.projectLinksByTheirProjectId.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = registryConfig.pgRelations.project.projectLinksByTheirProjectId.remoteAttributes[i];
          $subQuery.where(sql`${$where.alias}.${sql.identifier(localAttribute)} = ${$subQuery.alias}.${sql.identifier(remoteAttribute)}`);
        });
      },
      projectStatusConfigs($where, value) {
        assertAllowed(value, "object");
        const $rel = $where.andPlan();
        $rel.extensions.pgFilterRelation = {
          tableExpression: projectStatusConfigIdentifier,
          alias: resource_project_status_configPgResource.name,
          localAttributes: registryConfig.pgRelations.project.projectStatusConfigsByTheirProjectId.localAttributes,
          remoteAttributes: registryConfig.pgRelations.project.projectStatusConfigsByTheirProjectId.remoteAttributes
        };
        return $rel;
      },
      projectStatusConfigsExist($where, value) {
        assertAllowed(value, "scalar");
        if (value == null) return;
        const $subQuery = $where.existsPlan({
          tableExpression: projectStatusConfigIdentifier,
          alias: resource_project_status_configPgResource.name,
          equals: value
        });
        registryConfig.pgRelations.project.projectStatusConfigsByTheirProjectId.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = registryConfig.pgRelations.project.projectStatusConfigsByTheirProjectId.remoteAttributes[i];
          $subQuery.where(sql`${$where.alias}.${sql.identifier(localAttribute)} = ${$subQuery.alias}.${sql.identifier(remoteAttribute)}`);
        });
      },
      rowId(queryBuilder, value) {
        return pgConnectionFilterApplyAttribute("rowId", "id", spec_project.attributes.id, queryBuilder, value);
      },
      slug(queryBuilder, value) {
        return pgConnectionFilterApplyAttribute("slug", "slug", spec_project.attributes.slug, queryBuilder, value);
      },
      updatedAt(queryBuilder, value) {
        return pgConnectionFilterApplyAttribute("updatedAt", "updated_at", spec_project.attributes.updated_at, queryBuilder, value);
      }
    }
  },
  ProjectHavingAverageInput: {
    plans: {
      createdAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_average, spec_project.attributes.created_at, "created_at", $having);
      },
      nextPostNumber($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_average, spec_project.attributes.next_post_number, "next_post_number", $having);
      },
      updatedAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_average, spec_project.attributes.updated_at, "updated_at", $having);
      }
    }
  },
  ProjectHavingDistinctCountInput: {
    plans: {
      createdAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_distinctCount, spec_project.attributes.created_at, "created_at", $having);
      },
      nextPostNumber($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_distinctCount, spec_project.attributes.next_post_number, "next_post_number", $having);
      },
      updatedAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_distinctCount, spec_project.attributes.updated_at, "updated_at", $having);
      }
    }
  },
  ProjectHavingInput: {
    plans: {
      AND: pgAggregatesApplyAnd,
      average: pgAggregatesPlanAggregatesField,
      distinctCount: pgAggregatesPlanAggregatesField,
      max: pgAggregatesPlanAggregatesField,
      min: pgAggregatesPlanAggregatesField,
      OR: PostHavingInput_ORApply,
      stddevPopulation: pgAggregatesPlanAggregatesField,
      stddevSample: pgAggregatesPlanAggregatesField,
      sum: pgAggregatesPlanAggregatesField,
      variancePopulation: pgAggregatesPlanAggregatesField,
      varianceSample: pgAggregatesPlanAggregatesField
    }
  },
  ProjectHavingMaxInput: {
    plans: {
      createdAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_max, spec_project.attributes.created_at, "created_at", $having);
      },
      nextPostNumber($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_max, spec_project.attributes.next_post_number, "next_post_number", $having);
      },
      updatedAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_max, spec_project.attributes.updated_at, "updated_at", $having);
      }
    }
  },
  ProjectHavingMinInput: {
    plans: {
      createdAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_min, spec_project.attributes.created_at, "created_at", $having);
      },
      nextPostNumber($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_min, spec_project.attributes.next_post_number, "next_post_number", $having);
      },
      updatedAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_min, spec_project.attributes.updated_at, "updated_at", $having);
      }
    }
  },
  ProjectHavingStddevPopulationInput: {
    plans: {
      createdAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_stddevPopulation, spec_project.attributes.created_at, "created_at", $having);
      },
      nextPostNumber($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_stddevPopulation, spec_project.attributes.next_post_number, "next_post_number", $having);
      },
      updatedAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_stddevPopulation, spec_project.attributes.updated_at, "updated_at", $having);
      }
    }
  },
  ProjectHavingStddevSampleInput: {
    plans: {
      createdAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_stddevSample, spec_project.attributes.created_at, "created_at", $having);
      },
      nextPostNumber($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_stddevSample, spec_project.attributes.next_post_number, "next_post_number", $having);
      },
      updatedAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_stddevSample, spec_project.attributes.updated_at, "updated_at", $having);
      }
    }
  },
  ProjectHavingSumInput: {
    plans: {
      createdAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_sum, spec_project.attributes.created_at, "created_at", $having);
      },
      nextPostNumber($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_sum, spec_project.attributes.next_post_number, "next_post_number", $having);
      },
      updatedAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_sum, spec_project.attributes.updated_at, "updated_at", $having);
      }
    }
  },
  ProjectHavingVariancePopulationInput: {
    plans: {
      createdAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_variancePopulation, spec_project.attributes.created_at, "created_at", $having);
      },
      nextPostNumber($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_variancePopulation, spec_project.attributes.next_post_number, "next_post_number", $having);
      },
      updatedAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_variancePopulation, spec_project.attributes.updated_at, "updated_at", $having);
      }
    }
  },
  ProjectHavingVarianceSampleInput: {
    plans: {
      createdAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_varianceSample, spec_project.attributes.created_at, "created_at", $having);
      },
      nextPostNumber($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_varianceSample, spec_project.attributes.next_post_number, "next_post_number", $having);
      },
      updatedAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_varianceSample, spec_project.attributes.updated_at, "updated_at", $having);
      }
    }
  },
  ProjectInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      createdAt: CommentInput_createdAtApply,
      description: StatusTemplateInput_descriptionApply,
      image: ProjectInput_imageApply,
      isPublic: ProjectInput_isPublicApply,
      name: StatusTemplateInput_nameApply,
      nextPostNumber: ProjectInput_nextPostNumberApply,
      organizationId: StatusTemplateInput_organizationIdApply,
      prefix: ProjectInput_prefixApply,
      rowId: CommentInput_rowIdApply,
      slug: ProjectInput_slugApply,
      updatedAt: CommentInput_updatedAtApply
    }
  },
  ProjectLinkAggregatesFilter: {
    plans: {
      average: PostAggregatesFilter_averageApply,
      distinctCount: CommentAggregatesFilter_distinctCountApply,
      filter: filterApply,
      max: PostAggregatesFilter_maxApply,
      min: PostAggregatesFilter_minApply,
      stddevPopulation: PostAggregatesFilter_stddevPopulationApply,
      stddevSample: PostAggregatesFilter_stddevSampleApply,
      sum: PostAggregatesFilter_sumApply,
      variancePopulation: PostAggregatesFilter_variancePopulationApply,
      varianceSample: PostAggregatesFilter_varianceSampleApply
    }
  },
  ProjectLinkAverageAggregateFilter: {
    plans: {
      order($parent, input) {
        return pgAggregateApplyAttributeOrder(pgAggregateSpec_average, "order", TYPES.numeric, TYPES.int, $parent, input);
      }
    }
  },
  ProjectLinkCondition: {
    plans: {
      createdAt: PostCondition_createdAtApply,
      order($condition, val) {
        return applyAttributeCondition("order", TYPES.int, $condition, val);
      },
      projectId: PostCondition_projectIdApply,
      rowId: PostCondition_rowIdApply,
      title: PostCondition_titleApply,
      updatedAt: PostCondition_updatedAtApply,
      url($condition, val) {
        return applyAttributeCondition("url", TYPES.text, $condition, val);
      }
    }
  },
  ProjectLinkDistinctCountAggregateFilter: {
    plans: {
      createdAt: CommentDistinctCountAggregateFilter_createdAtApply,
      order($parent, input) {
        return pgAggregateApplyAttributeOrder(pgAggregateSpec_distinctCount, "order", TYPES.bigint, TYPES.int, $parent, input);
      },
      projectId: PostDistinctCountAggregateFilter_projectIdApply,
      rowId: CommentDistinctCountAggregateFilter_rowIdApply,
      title: PostDistinctCountAggregateFilter_titleApply,
      updatedAt: CommentDistinctCountAggregateFilter_updatedAtApply,
      url($parent, input) {
        return pgAggregateApplyAttributeOrder(pgAggregateSpec_distinctCount, "url", TYPES.bigint, TYPES.text, $parent, input);
      }
    }
  },
  ProjectLinkFilter: {
    plans: {
      and: PostFilter_andApply,
      createdAt(queryBuilder, value) {
        return pgConnectionFilterApplyAttribute("createdAt", "created_at", spec_projectLink.attributes.created_at, queryBuilder, value);
      },
      not: PostFilter_notApply,
      or: PostFilter_orApply,
      order(queryBuilder, value) {
        return pgConnectionFilterApplyAttribute("order", "order", spec_projectLink.attributes.order, queryBuilder, value);
      },
      project($where, value) {
        return pgConnectionFilterApplySingleRelation(resource_projectPgResource, projectIdentifier, registryConfig.pgRelations.projectLink.projectByMyProjectId.localAttributes, registryConfig.pgRelations.projectLink.projectByMyProjectId.remoteAttributes, $where, value);
      },
      projectId(queryBuilder, value) {
        return pgConnectionFilterApplyAttribute("projectId", "project_id", spec_projectLink.attributes.project_id, queryBuilder, value);
      },
      rowId(queryBuilder, value) {
        return pgConnectionFilterApplyAttribute("rowId", "id", spec_projectLink.attributes.id, queryBuilder, value);
      },
      title(queryBuilder, value) {
        return pgConnectionFilterApplyAttribute("title", "title", spec_projectLink.attributes.title, queryBuilder, value);
      },
      updatedAt(queryBuilder, value) {
        return pgConnectionFilterApplyAttribute("updatedAt", "updated_at", spec_projectLink.attributes.updated_at, queryBuilder, value);
      },
      url(queryBuilder, value) {
        return pgConnectionFilterApplyAttribute("url", "url", spec_projectLink.attributes.url, queryBuilder, value);
      }
    }
  },
  ProjectLinkHavingAverageInput: {
    plans: {
      createdAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_average, spec_projectLink.attributes.created_at, "created_at", $having);
      },
      order($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_average, spec_projectLink.attributes.order, "order", $having);
      },
      updatedAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_average, spec_projectLink.attributes.updated_at, "updated_at", $having);
      }
    }
  },
  ProjectLinkHavingDistinctCountInput: {
    plans: {
      createdAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_distinctCount, spec_projectLink.attributes.created_at, "created_at", $having);
      },
      order($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_distinctCount, spec_projectLink.attributes.order, "order", $having);
      },
      updatedAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_distinctCount, spec_projectLink.attributes.updated_at, "updated_at", $having);
      }
    }
  },
  ProjectLinkHavingInput: {
    plans: {
      AND: pgAggregatesApplyAnd,
      average: pgAggregatesPlanAggregatesField,
      distinctCount: pgAggregatesPlanAggregatesField,
      max: pgAggregatesPlanAggregatesField,
      min: pgAggregatesPlanAggregatesField,
      OR: PostHavingInput_ORApply,
      stddevPopulation: pgAggregatesPlanAggregatesField,
      stddevSample: pgAggregatesPlanAggregatesField,
      sum: pgAggregatesPlanAggregatesField,
      variancePopulation: pgAggregatesPlanAggregatesField,
      varianceSample: pgAggregatesPlanAggregatesField
    }
  },
  ProjectLinkHavingMaxInput: {
    plans: {
      createdAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_max, spec_projectLink.attributes.created_at, "created_at", $having);
      },
      order($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_max, spec_projectLink.attributes.order, "order", $having);
      },
      updatedAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_max, spec_projectLink.attributes.updated_at, "updated_at", $having);
      }
    }
  },
  ProjectLinkHavingMinInput: {
    plans: {
      createdAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_min, spec_projectLink.attributes.created_at, "created_at", $having);
      },
      order($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_min, spec_projectLink.attributes.order, "order", $having);
      },
      updatedAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_min, spec_projectLink.attributes.updated_at, "updated_at", $having);
      }
    }
  },
  ProjectLinkHavingStddevPopulationInput: {
    plans: {
      createdAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_stddevPopulation, spec_projectLink.attributes.created_at, "created_at", $having);
      },
      order($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_stddevPopulation, spec_projectLink.attributes.order, "order", $having);
      },
      updatedAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_stddevPopulation, spec_projectLink.attributes.updated_at, "updated_at", $having);
      }
    }
  },
  ProjectLinkHavingStddevSampleInput: {
    plans: {
      createdAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_stddevSample, spec_projectLink.attributes.created_at, "created_at", $having);
      },
      order($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_stddevSample, spec_projectLink.attributes.order, "order", $having);
      },
      updatedAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_stddevSample, spec_projectLink.attributes.updated_at, "updated_at", $having);
      }
    }
  },
  ProjectLinkHavingSumInput: {
    plans: {
      createdAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_sum, spec_projectLink.attributes.created_at, "created_at", $having);
      },
      order($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_sum, spec_projectLink.attributes.order, "order", $having);
      },
      updatedAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_sum, spec_projectLink.attributes.updated_at, "updated_at", $having);
      }
    }
  },
  ProjectLinkHavingVariancePopulationInput: {
    plans: {
      createdAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_variancePopulation, spec_projectLink.attributes.created_at, "created_at", $having);
      },
      order($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_variancePopulation, spec_projectLink.attributes.order, "order", $having);
      },
      updatedAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_variancePopulation, spec_projectLink.attributes.updated_at, "updated_at", $having);
      }
    }
  },
  ProjectLinkHavingVarianceSampleInput: {
    plans: {
      createdAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_varianceSample, spec_projectLink.attributes.created_at, "created_at", $having);
      },
      order($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_varianceSample, spec_projectLink.attributes.order, "order", $having);
      },
      updatedAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_varianceSample, spec_projectLink.attributes.updated_at, "updated_at", $having);
      }
    }
  },
  ProjectLinkInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      createdAt: CommentInput_createdAtApply,
      order: ProjectLinkInput_orderApply,
      projectId: ProjectLinkInput_projectIdApply,
      rowId: CommentInput_rowIdApply,
      title: ProjectLinkInput_titleApply,
      updatedAt: CommentInput_updatedAtApply,
      url: ProjectLinkInput_urlApply
    }
  },
  ProjectLinkMaxAggregateFilter: {
    plans: {
      order($parent, input) {
        return pgAggregateApplyAttributeOrder(pgAggregateSpec_max, "order", TYPES.int, TYPES.int, $parent, input);
      }
    }
  },
  ProjectLinkMinAggregateFilter: {
    plans: {
      order($parent, input) {
        return pgAggregateApplyAttributeOrder(pgAggregateSpec_min, "order", TYPES.int, TYPES.int, $parent, input);
      }
    }
  },
  ProjectLinkPatch: {
    baked: createObjectAndApplyChildren,
    plans: {
      createdAt: CommentInput_createdAtApply,
      order: ProjectLinkInput_orderApply,
      projectId: ProjectLinkInput_projectIdApply,
      rowId: CommentInput_rowIdApply,
      title: ProjectLinkInput_titleApply,
      updatedAt: CommentInput_updatedAtApply,
      url: ProjectLinkInput_urlApply
    }
  },
  ProjectLinkStddevPopulationAggregateFilter: {
    plans: {
      order($parent, input) {
        return pgAggregateApplyAttributeOrder(pgAggregateSpec_stddevPopulation, "order", TYPES.numeric, TYPES.int, $parent, input);
      }
    }
  },
  ProjectLinkStddevSampleAggregateFilter: {
    plans: {
      order($parent, input) {
        return pgAggregateApplyAttributeOrder(pgAggregateSpec_stddevSample, "order", TYPES.numeric, TYPES.int, $parent, input);
      }
    }
  },
  ProjectLinkSumAggregateFilter: {
    plans: {
      order($parent, input) {
        return pgAggregateApplyAttributeOrder(pgAggregateSpec_sum, "order", TYPES.bigint, TYPES.int, $parent, input);
      }
    }
  },
  ProjectLinkVariancePopulationAggregateFilter: {
    plans: {
      order($parent, input) {
        return pgAggregateApplyAttributeOrder(pgAggregateSpec_variancePopulation, "order", TYPES.numeric, TYPES.int, $parent, input);
      }
    }
  },
  ProjectLinkVarianceSampleAggregateFilter: {
    plans: {
      order($parent, input) {
        return pgAggregateApplyAttributeOrder(pgAggregateSpec_varianceSample, "order", TYPES.numeric, TYPES.int, $parent, input);
      }
    }
  },
  ProjectPatch: {
    baked: createObjectAndApplyChildren,
    plans: {
      createdAt: CommentInput_createdAtApply,
      description: StatusTemplateInput_descriptionApply,
      image: ProjectInput_imageApply,
      isPublic: ProjectInput_isPublicApply,
      name: StatusTemplateInput_nameApply,
      nextPostNumber: ProjectInput_nextPostNumberApply,
      organizationId: StatusTemplateInput_organizationIdApply,
      prefix: ProjectInput_prefixApply,
      rowId: CommentInput_rowIdApply,
      slug: ProjectInput_slugApply,
      updatedAt: CommentInput_updatedAtApply
    }
  },
  ProjectStatusConfigAggregatesFilter: {
    plans: {
      average: PostAggregatesFilter_averageApply,
      distinctCount: CommentAggregatesFilter_distinctCountApply,
      filter: filterApply,
      max: PostAggregatesFilter_maxApply,
      min: PostAggregatesFilter_minApply,
      stddevPopulation: PostAggregatesFilter_stddevPopulationApply,
      stddevSample: PostAggregatesFilter_stddevSampleApply,
      sum: PostAggregatesFilter_sumApply,
      variancePopulation: PostAggregatesFilter_variancePopulationApply,
      varianceSample: PostAggregatesFilter_varianceSampleApply
    }
  },
  ProjectStatusConfigAverageAggregateFilter: {
    plans: {
      sortOrder($parent, input) {
        return pgAggregateApplyAttributeOrder(pgAggregateSpec_average, "sort_order", TYPES.numeric, TYPES.int, $parent, input);
      }
    }
  },
  ProjectStatusConfigCondition: {
    plans: {
      createdAt: PostCondition_createdAtApply,
      customColor($condition, val) {
        return applyAttributeCondition("custom_color", TYPES.text, $condition, val);
      },
      customDescription($condition, val) {
        return applyAttributeCondition("custom_description", TYPES.text, $condition, val);
      },
      isDefault($condition, val) {
        return applyAttributeCondition("is_default", TYPES.boolean, $condition, val);
      },
      isEnabled($condition, val) {
        return applyAttributeCondition("is_enabled", TYPES.boolean, $condition, val);
      },
      projectId: PostCondition_projectIdApply,
      rowId: PostCondition_rowIdApply,
      sortOrder: ProjectStatusConfigCondition_sortOrderApply,
      statusTemplateId: PostCondition_statusTemplateIdApply
    }
  },
  ProjectStatusConfigDistinctCountAggregateFilter: {
    plans: {
      createdAt: CommentDistinctCountAggregateFilter_createdAtApply,
      customColor($parent, input) {
        return pgAggregateApplyAttributeOrder(pgAggregateSpec_distinctCount, "custom_color", TYPES.bigint, TYPES.text, $parent, input);
      },
      customDescription($parent, input) {
        return pgAggregateApplyAttributeOrder(pgAggregateSpec_distinctCount, "custom_description", TYPES.bigint, TYPES.text, $parent, input);
      },
      isDefault($parent, input) {
        return pgAggregateApplyAttributeOrder(pgAggregateSpec_distinctCount, "is_default", TYPES.bigint, TYPES.boolean, $parent, input);
      },
      isEnabled($parent, input) {
        return pgAggregateApplyAttributeOrder(pgAggregateSpec_distinctCount, "is_enabled", TYPES.bigint, TYPES.boolean, $parent, input);
      },
      projectId: PostDistinctCountAggregateFilter_projectIdApply,
      rowId: CommentDistinctCountAggregateFilter_rowIdApply,
      sortOrder($parent, input) {
        return pgAggregateApplyAttributeOrder(pgAggregateSpec_distinctCount, "sort_order", TYPES.bigint, TYPES.int, $parent, input);
      },
      statusTemplateId: PostDistinctCountAggregateFilter_statusTemplateIdApply
    }
  },
  ProjectStatusConfigFilter: {
    plans: {
      and: PostFilter_andApply,
      createdAt(queryBuilder, value) {
        return pgConnectionFilterApplyAttribute("createdAt", "created_at", spec_projectStatusConfig.attributes.created_at, queryBuilder, value);
      },
      customColor(queryBuilder, value) {
        return pgConnectionFilterApplyAttribute("customColor", "custom_color", spec_projectStatusConfig.attributes.custom_color, queryBuilder, value);
      },
      customDescription(queryBuilder, value) {
        return pgConnectionFilterApplyAttribute("customDescription", "custom_description", spec_projectStatusConfig.attributes.custom_description, queryBuilder, value);
      },
      isDefault(queryBuilder, value) {
        return pgConnectionFilterApplyAttribute("isDefault", "is_default", spec_projectStatusConfig.attributes.is_default, queryBuilder, value);
      },
      isEnabled(queryBuilder, value) {
        return pgConnectionFilterApplyAttribute("isEnabled", "is_enabled", spec_projectStatusConfig.attributes.is_enabled, queryBuilder, value);
      },
      not: PostFilter_notApply,
      or: PostFilter_orApply,
      project($where, value) {
        return pgConnectionFilterApplySingleRelation(resource_projectPgResource, projectIdentifier, registryConfig.pgRelations.projectStatusConfig.projectByMyProjectId.localAttributes, registryConfig.pgRelations.projectStatusConfig.projectByMyProjectId.remoteAttributes, $where, value);
      },
      projectId(queryBuilder, value) {
        return pgConnectionFilterApplyAttribute("projectId", "project_id", spec_projectStatusConfig.attributes.project_id, queryBuilder, value);
      },
      rowId(queryBuilder, value) {
        return pgConnectionFilterApplyAttribute("rowId", "id", spec_projectStatusConfig.attributes.id, queryBuilder, value);
      },
      sortOrder(queryBuilder, value) {
        return pgConnectionFilterApplyAttribute("sortOrder", "sort_order", spec_projectStatusConfig.attributes.sort_order, queryBuilder, value);
      },
      statusTemplate($where, value) {
        return pgConnectionFilterApplySingleRelation(resource_status_templatePgResource, statusTemplateIdentifier, registryConfig.pgRelations.projectStatusConfig.statusTemplateByMyStatusTemplateId.localAttributes, registryConfig.pgRelations.projectStatusConfig.statusTemplateByMyStatusTemplateId.remoteAttributes, $where, value);
      },
      statusTemplateId(queryBuilder, value) {
        return pgConnectionFilterApplyAttribute("statusTemplateId", "status_template_id", spec_projectStatusConfig.attributes.status_template_id, queryBuilder, value);
      }
    }
  },
  ProjectStatusConfigHavingAverageInput: {
    plans: {
      createdAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_average, spec_projectStatusConfig.attributes.created_at, "created_at", $having);
      },
      sortOrder($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_average, spec_projectStatusConfig.attributes.sort_order, "sort_order", $having);
      }
    }
  },
  ProjectStatusConfigHavingDistinctCountInput: {
    plans: {
      createdAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_distinctCount, spec_projectStatusConfig.attributes.created_at, "created_at", $having);
      },
      sortOrder($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_distinctCount, spec_projectStatusConfig.attributes.sort_order, "sort_order", $having);
      }
    }
  },
  ProjectStatusConfigHavingInput: {
    plans: {
      AND: pgAggregatesApplyAnd,
      average: pgAggregatesPlanAggregatesField,
      distinctCount: pgAggregatesPlanAggregatesField,
      max: pgAggregatesPlanAggregatesField,
      min: pgAggregatesPlanAggregatesField,
      OR: PostHavingInput_ORApply,
      stddevPopulation: pgAggregatesPlanAggregatesField,
      stddevSample: pgAggregatesPlanAggregatesField,
      sum: pgAggregatesPlanAggregatesField,
      variancePopulation: pgAggregatesPlanAggregatesField,
      varianceSample: pgAggregatesPlanAggregatesField
    }
  },
  ProjectStatusConfigHavingMaxInput: {
    plans: {
      createdAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_max, spec_projectStatusConfig.attributes.created_at, "created_at", $having);
      },
      sortOrder($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_max, spec_projectStatusConfig.attributes.sort_order, "sort_order", $having);
      }
    }
  },
  ProjectStatusConfigHavingMinInput: {
    plans: {
      createdAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_min, spec_projectStatusConfig.attributes.created_at, "created_at", $having);
      },
      sortOrder($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_min, spec_projectStatusConfig.attributes.sort_order, "sort_order", $having);
      }
    }
  },
  ProjectStatusConfigHavingStddevPopulationInput: {
    plans: {
      createdAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_stddevPopulation, spec_projectStatusConfig.attributes.created_at, "created_at", $having);
      },
      sortOrder($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_stddevPopulation, spec_projectStatusConfig.attributes.sort_order, "sort_order", $having);
      }
    }
  },
  ProjectStatusConfigHavingStddevSampleInput: {
    plans: {
      createdAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_stddevSample, spec_projectStatusConfig.attributes.created_at, "created_at", $having);
      },
      sortOrder($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_stddevSample, spec_projectStatusConfig.attributes.sort_order, "sort_order", $having);
      }
    }
  },
  ProjectStatusConfigHavingSumInput: {
    plans: {
      createdAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_sum, spec_projectStatusConfig.attributes.created_at, "created_at", $having);
      },
      sortOrder($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_sum, spec_projectStatusConfig.attributes.sort_order, "sort_order", $having);
      }
    }
  },
  ProjectStatusConfigHavingVariancePopulationInput: {
    plans: {
      createdAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_variancePopulation, spec_projectStatusConfig.attributes.created_at, "created_at", $having);
      },
      sortOrder($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_variancePopulation, spec_projectStatusConfig.attributes.sort_order, "sort_order", $having);
      }
    }
  },
  ProjectStatusConfigHavingVarianceSampleInput: {
    plans: {
      createdAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_varianceSample, spec_projectStatusConfig.attributes.created_at, "created_at", $having);
      },
      sortOrder($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_varianceSample, spec_projectStatusConfig.attributes.sort_order, "sort_order", $having);
      }
    }
  },
  ProjectStatusConfigInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      createdAt: CommentInput_createdAtApply,
      customColor: ProjectStatusConfigInput_customColorApply,
      customDescription: ProjectStatusConfigInput_customDescriptionApply,
      isDefault: ProjectStatusConfigInput_isDefaultApply,
      isEnabled: ProjectStatusConfigInput_isEnabledApply,
      projectId: ProjectLinkInput_projectIdApply,
      rowId: CommentInput_rowIdApply,
      sortOrder: StatusTemplateInput_sortOrderApply,
      statusTemplateId: ProjectStatusConfigInput_statusTemplateIdApply
    }
  },
  ProjectStatusConfigMaxAggregateFilter: {
    plans: {
      sortOrder($parent, input) {
        return pgAggregateApplyAttributeOrder(pgAggregateSpec_max, "sort_order", TYPES.int, TYPES.int, $parent, input);
      }
    }
  },
  ProjectStatusConfigMinAggregateFilter: {
    plans: {
      sortOrder($parent, input) {
        return pgAggregateApplyAttributeOrder(pgAggregateSpec_min, "sort_order", TYPES.int, TYPES.int, $parent, input);
      }
    }
  },
  ProjectStatusConfigPatch: {
    baked: createObjectAndApplyChildren,
    plans: {
      createdAt: CommentInput_createdAtApply,
      customColor: ProjectStatusConfigInput_customColorApply,
      customDescription: ProjectStatusConfigInput_customDescriptionApply,
      isDefault: ProjectStatusConfigInput_isDefaultApply,
      isEnabled: ProjectStatusConfigInput_isEnabledApply,
      projectId: ProjectLinkInput_projectIdApply,
      rowId: CommentInput_rowIdApply,
      sortOrder: StatusTemplateInput_sortOrderApply,
      statusTemplateId: ProjectStatusConfigInput_statusTemplateIdApply
    }
  },
  ProjectStatusConfigStddevPopulationAggregateFilter: {
    plans: {
      sortOrder($parent, input) {
        return pgAggregateApplyAttributeOrder(pgAggregateSpec_stddevPopulation, "sort_order", TYPES.numeric, TYPES.int, $parent, input);
      }
    }
  },
  ProjectStatusConfigStddevSampleAggregateFilter: {
    plans: {
      sortOrder($parent, input) {
        return pgAggregateApplyAttributeOrder(pgAggregateSpec_stddevSample, "sort_order", TYPES.numeric, TYPES.int, $parent, input);
      }
    }
  },
  ProjectStatusConfigSumAggregateFilter: {
    plans: {
      sortOrder($parent, input) {
        return pgAggregateApplyAttributeOrder(pgAggregateSpec_sum, "sort_order", TYPES.bigint, TYPES.int, $parent, input);
      }
    }
  },
  ProjectStatusConfigVariancePopulationAggregateFilter: {
    plans: {
      sortOrder($parent, input) {
        return pgAggregateApplyAttributeOrder(pgAggregateSpec_variancePopulation, "sort_order", TYPES.numeric, TYPES.int, $parent, input);
      }
    }
  },
  ProjectStatusConfigVarianceSampleAggregateFilter: {
    plans: {
      sortOrder($parent, input) {
        return pgAggregateApplyAttributeOrder(pgAggregateSpec_varianceSample, "sort_order", TYPES.numeric, TYPES.int, $parent, input);
      }
    }
  },
  ProjectToManyPostFilter: {
    plans: {
      aggregates: PostToManyCommentFilter_aggregatesApply,
      every: PostToManyCommentFilter_everyApply,
      none: PostToManyCommentFilter_noneApply,
      some: PostToManyCommentFilter_someApply
    }
  },
  ProjectToManyProjectLinkFilter: {
    plans: {
      aggregates: PostToManyCommentFilter_aggregatesApply,
      every: PostToManyCommentFilter_everyApply,
      none: PostToManyCommentFilter_noneApply,
      some: PostToManyCommentFilter_someApply
    }
  },
  ProjectToManyProjectStatusConfigFilter: {
    plans: {
      aggregates: PostToManyCommentFilter_aggregatesApply,
      every: PostToManyCommentFilter_everyApply,
      none: PostToManyCommentFilter_noneApply,
      some: PostToManyCommentFilter_someApply
    }
  },
  StatusTemplateCondition: {
    plans: {
      color($condition, val) {
        return applyAttributeCondition("color", TYPES.text, $condition, val);
      },
      createdAt: PostCondition_createdAtApply,
      description: PostCondition_descriptionApply,
      displayName($condition, val) {
        return applyAttributeCondition("display_name", TYPES.text, $condition, val);
      },
      name: StatusTemplateCondition_nameApply,
      organizationId: StatusTemplateCondition_organizationIdApply,
      rowId: PostCondition_rowIdApply,
      sortOrder: ProjectStatusConfigCondition_sortOrderApply,
      updatedAt: PostCondition_updatedAtApply
    }
  },
  StatusTemplateFilter: {
    plans: {
      and: PostFilter_andApply,
      color(queryBuilder, value) {
        return pgConnectionFilterApplyAttribute("color", "color", spec_statusTemplate.attributes.color, queryBuilder, value);
      },
      createdAt(queryBuilder, value) {
        return pgConnectionFilterApplyAttribute("createdAt", "created_at", spec_statusTemplate.attributes.created_at, queryBuilder, value);
      },
      description(queryBuilder, value) {
        return pgConnectionFilterApplyAttribute("description", "description", spec_statusTemplate.attributes.description, queryBuilder, value);
      },
      displayName(queryBuilder, value) {
        return pgConnectionFilterApplyAttribute("displayName", "display_name", spec_statusTemplate.attributes.display_name, queryBuilder, value);
      },
      name(queryBuilder, value) {
        return pgConnectionFilterApplyAttribute("name", "name", spec_statusTemplate.attributes.name, queryBuilder, value);
      },
      not: PostFilter_notApply,
      or: PostFilter_orApply,
      organizationId(queryBuilder, value) {
        return pgConnectionFilterApplyAttribute("organizationId", "organization_id", spec_statusTemplate.attributes.organization_id, queryBuilder, value);
      },
      posts($where, value) {
        assertAllowed(value, "object");
        const $rel = $where.andPlan();
        $rel.extensions.pgFilterRelation = {
          tableExpression: postIdentifier,
          alias: resource_postPgResource.name,
          localAttributes: registryConfig.pgRelations.statusTemplate.postsByTheirStatusTemplateId.localAttributes,
          remoteAttributes: registryConfig.pgRelations.statusTemplate.postsByTheirStatusTemplateId.remoteAttributes
        };
        return $rel;
      },
      postsExist($where, value) {
        assertAllowed(value, "scalar");
        if (value == null) return;
        const $subQuery = $where.existsPlan({
          tableExpression: postIdentifier,
          alias: resource_postPgResource.name,
          equals: value
        });
        registryConfig.pgRelations.statusTemplate.postsByTheirStatusTemplateId.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = registryConfig.pgRelations.statusTemplate.postsByTheirStatusTemplateId.remoteAttributes[i];
          $subQuery.where(sql`${$where.alias}.${sql.identifier(localAttribute)} = ${$subQuery.alias}.${sql.identifier(remoteAttribute)}`);
        });
      },
      projectStatusConfigs($where, value) {
        assertAllowed(value, "object");
        const $rel = $where.andPlan();
        $rel.extensions.pgFilterRelation = {
          tableExpression: projectStatusConfigIdentifier,
          alias: resource_project_status_configPgResource.name,
          localAttributes: registryConfig.pgRelations.statusTemplate.projectStatusConfigsByTheirStatusTemplateId.localAttributes,
          remoteAttributes: registryConfig.pgRelations.statusTemplate.projectStatusConfigsByTheirStatusTemplateId.remoteAttributes
        };
        return $rel;
      },
      projectStatusConfigsExist($where, value) {
        assertAllowed(value, "scalar");
        if (value == null) return;
        const $subQuery = $where.existsPlan({
          tableExpression: projectStatusConfigIdentifier,
          alias: resource_project_status_configPgResource.name,
          equals: value
        });
        registryConfig.pgRelations.statusTemplate.projectStatusConfigsByTheirStatusTemplateId.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = registryConfig.pgRelations.statusTemplate.projectStatusConfigsByTheirStatusTemplateId.remoteAttributes[i];
          $subQuery.where(sql`${$where.alias}.${sql.identifier(localAttribute)} = ${$subQuery.alias}.${sql.identifier(remoteAttribute)}`);
        });
      },
      rowId(queryBuilder, value) {
        return pgConnectionFilterApplyAttribute("rowId", "id", spec_statusTemplate.attributes.id, queryBuilder, value);
      },
      sortOrder(queryBuilder, value) {
        return pgConnectionFilterApplyAttribute("sortOrder", "sort_order", spec_statusTemplate.attributes.sort_order, queryBuilder, value);
      },
      updatedAt(queryBuilder, value) {
        return pgConnectionFilterApplyAttribute("updatedAt", "updated_at", spec_statusTemplate.attributes.updated_at, queryBuilder, value);
      }
    }
  },
  StatusTemplateHavingAverageInput: {
    plans: {
      createdAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_average, spec_statusTemplate.attributes.created_at, "created_at", $having);
      },
      sortOrder($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_average, spec_statusTemplate.attributes.sort_order, "sort_order", $having);
      },
      updatedAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_average, spec_statusTemplate.attributes.updated_at, "updated_at", $having);
      }
    }
  },
  StatusTemplateHavingDistinctCountInput: {
    plans: {
      createdAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_distinctCount, spec_statusTemplate.attributes.created_at, "created_at", $having);
      },
      sortOrder($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_distinctCount, spec_statusTemplate.attributes.sort_order, "sort_order", $having);
      },
      updatedAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_distinctCount, spec_statusTemplate.attributes.updated_at, "updated_at", $having);
      }
    }
  },
  StatusTemplateHavingInput: {
    plans: {
      AND: pgAggregatesApplyAnd,
      average: pgAggregatesPlanAggregatesField,
      distinctCount: pgAggregatesPlanAggregatesField,
      max: pgAggregatesPlanAggregatesField,
      min: pgAggregatesPlanAggregatesField,
      OR: PostHavingInput_ORApply,
      stddevPopulation: pgAggregatesPlanAggregatesField,
      stddevSample: pgAggregatesPlanAggregatesField,
      sum: pgAggregatesPlanAggregatesField,
      variancePopulation: pgAggregatesPlanAggregatesField,
      varianceSample: pgAggregatesPlanAggregatesField
    }
  },
  StatusTemplateHavingMaxInput: {
    plans: {
      createdAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_max, spec_statusTemplate.attributes.created_at, "created_at", $having);
      },
      sortOrder($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_max, spec_statusTemplate.attributes.sort_order, "sort_order", $having);
      },
      updatedAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_max, spec_statusTemplate.attributes.updated_at, "updated_at", $having);
      }
    }
  },
  StatusTemplateHavingMinInput: {
    plans: {
      createdAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_min, spec_statusTemplate.attributes.created_at, "created_at", $having);
      },
      sortOrder($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_min, spec_statusTemplate.attributes.sort_order, "sort_order", $having);
      },
      updatedAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_min, spec_statusTemplate.attributes.updated_at, "updated_at", $having);
      }
    }
  },
  StatusTemplateHavingStddevPopulationInput: {
    plans: {
      createdAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_stddevPopulation, spec_statusTemplate.attributes.created_at, "created_at", $having);
      },
      sortOrder($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_stddevPopulation, spec_statusTemplate.attributes.sort_order, "sort_order", $having);
      },
      updatedAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_stddevPopulation, spec_statusTemplate.attributes.updated_at, "updated_at", $having);
      }
    }
  },
  StatusTemplateHavingStddevSampleInput: {
    plans: {
      createdAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_stddevSample, spec_statusTemplate.attributes.created_at, "created_at", $having);
      },
      sortOrder($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_stddevSample, spec_statusTemplate.attributes.sort_order, "sort_order", $having);
      },
      updatedAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_stddevSample, spec_statusTemplate.attributes.updated_at, "updated_at", $having);
      }
    }
  },
  StatusTemplateHavingSumInput: {
    plans: {
      createdAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_sum, spec_statusTemplate.attributes.created_at, "created_at", $having);
      },
      sortOrder($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_sum, spec_statusTemplate.attributes.sort_order, "sort_order", $having);
      },
      updatedAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_sum, spec_statusTemplate.attributes.updated_at, "updated_at", $having);
      }
    }
  },
  StatusTemplateHavingVariancePopulationInput: {
    plans: {
      createdAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_variancePopulation, spec_statusTemplate.attributes.created_at, "created_at", $having);
      },
      sortOrder($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_variancePopulation, spec_statusTemplate.attributes.sort_order, "sort_order", $having);
      },
      updatedAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_variancePopulation, spec_statusTemplate.attributes.updated_at, "updated_at", $having);
      }
    }
  },
  StatusTemplateHavingVarianceSampleInput: {
    plans: {
      createdAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_varianceSample, spec_statusTemplate.attributes.created_at, "created_at", $having);
      },
      sortOrder($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_varianceSample, spec_statusTemplate.attributes.sort_order, "sort_order", $having);
      },
      updatedAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_varianceSample, spec_statusTemplate.attributes.updated_at, "updated_at", $having);
      }
    }
  },
  StatusTemplateInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      color: StatusTemplateInput_colorApply,
      createdAt: CommentInput_createdAtApply,
      description: StatusTemplateInput_descriptionApply,
      displayName: StatusTemplateInput_displayNameApply,
      name: StatusTemplateInput_nameApply,
      organizationId: StatusTemplateInput_organizationIdApply,
      rowId: CommentInput_rowIdApply,
      sortOrder: StatusTemplateInput_sortOrderApply,
      updatedAt: CommentInput_updatedAtApply
    }
  },
  StatusTemplatePatch: {
    baked: createObjectAndApplyChildren,
    plans: {
      color: StatusTemplateInput_colorApply,
      createdAt: CommentInput_createdAtApply,
      description: StatusTemplateInput_descriptionApply,
      displayName: StatusTemplateInput_displayNameApply,
      name: StatusTemplateInput_nameApply,
      organizationId: StatusTemplateInput_organizationIdApply,
      rowId: CommentInput_rowIdApply,
      sortOrder: StatusTemplateInput_sortOrderApply,
      updatedAt: CommentInput_updatedAtApply
    }
  },
  StatusTemplateToManyPostFilter: {
    plans: {
      aggregates: PostToManyCommentFilter_aggregatesApply,
      every: PostToManyCommentFilter_everyApply,
      none: PostToManyCommentFilter_noneApply,
      some: PostToManyCommentFilter_someApply
    }
  },
  StatusTemplateToManyProjectStatusConfigFilter: {
    plans: {
      aggregates: PostToManyCommentFilter_aggregatesApply,
      every: PostToManyCommentFilter_everyApply,
      none: PostToManyCommentFilter_noneApply,
      some: PostToManyCommentFilter_someApply
    }
  },
  StringFilter: {
    plans: {
      distinctFrom: pgAggregatesApply_distinctFrom,
      distinctFromInsensitive($where, value) {
        return pgConnectionFilterApplyFromOperator("distinctFromInsensitive", resolveDistinct, undefined, resolveInputCodecInsensitiveOperator, resolveSqlIdentifierInsensitiveOperator, resolveSqlValueInsensitiveOperator, $where, value);
      },
      endsWith($where, value) {
        return pgConnectionFilterApplyFromOperator("endsWith", resolveLike, resolveInputEndsWith, resolveInputCodecSensitive, resolveSqlIdentifierSensitive, undefined, $where, value);
      },
      endsWithInsensitive($where, value) {
        return pgConnectionFilterApplyFromOperator("endsWithInsensitive", resolveILike, resolveInputEndsWith, resolveInputCodecInsensitive, resolveSqlIdentifierInsensitive, undefined, $where, value);
      },
      equalTo: pgAggregatesApply_equalTo,
      equalToInsensitive($where, value) {
        return pgConnectionFilterApplyFromOperator("equalToInsensitive", resolveEquality, undefined, resolveInputCodecInsensitiveOperator, resolveSqlIdentifierInsensitiveOperator, resolveSqlValueInsensitiveOperator, $where, value);
      },
      greaterThan: pgAggregatesApply_greaterThan,
      greaterThanInsensitive($where, value) {
        return pgConnectionFilterApplyFromOperator("greaterThanInsensitive", resolveGreaterThan, undefined, resolveInputCodecInsensitiveOperator, resolveSqlIdentifierInsensitiveOperator, resolveSqlValueInsensitiveOperator, $where, value);
      },
      greaterThanOrEqualTo: pgAggregatesApply_greaterThanOrEqualTo,
      greaterThanOrEqualToInsensitive($where, value) {
        return pgConnectionFilterApplyFromOperator("greaterThanOrEqualToInsensitive", resolveGreaterThanOrEqualTo, undefined, resolveInputCodecInsensitiveOperator, resolveSqlIdentifierInsensitiveOperator, resolveSqlValueInsensitiveOperator, $where, value);
      },
      in: pgAggregatesApply_in,
      includes($where, value) {
        return pgConnectionFilterApplyFromOperator("includes", resolveLike, resolveInputContains, resolveInputCodecSensitive, resolveSqlIdentifierSensitive, undefined, $where, value);
      },
      includesInsensitive($where, value) {
        return pgConnectionFilterApplyFromOperator("includesInsensitive", resolveILike, resolveInputContains, resolveInputCodecInsensitive, resolveSqlIdentifierInsensitive, undefined, $where, value);
      },
      inInsensitive($where, value) {
        return pgConnectionFilterApplyFromOperator("inInsensitive", resolveEqualsAny, undefined, resolveInputCodecInsensitiveOperator_list, resolveSqlIdentifierInsensitiveOperator, resolveSqlValueInsensitiveOperator_list, $where, value);
      },
      isNull: pgAggregatesApply_isNull,
      lessThan: pgAggregatesApply_lessThan,
      lessThanInsensitive($where, value) {
        return pgConnectionFilterApplyFromOperator("lessThanInsensitive", resolveLessThan, undefined, resolveInputCodecInsensitiveOperator, resolveSqlIdentifierInsensitiveOperator, resolveSqlValueInsensitiveOperator, $where, value);
      },
      lessThanOrEqualTo: pgAggregatesApply_lessThanOrEqualTo,
      lessThanOrEqualToInsensitive($where, value) {
        return pgConnectionFilterApplyFromOperator("lessThanOrEqualToInsensitive", resolveLessThanOrEqualTo, undefined, resolveInputCodecInsensitiveOperator, resolveSqlIdentifierInsensitiveOperator, resolveSqlValueInsensitiveOperator, $where, value);
      },
      like($where, value) {
        return pgConnectionFilterApplyFromOperator("like", resolveLike, undefined, resolveInputCodecSensitive, resolveSqlIdentifierSensitive, undefined, $where, value);
      },
      likeInsensitive($where, value) {
        return pgConnectionFilterApplyFromOperator("likeInsensitive", resolveILike, undefined, resolveInputCodecInsensitive, resolveSqlIdentifierInsensitive, undefined, $where, value);
      },
      notDistinctFrom: pgAggregatesApply_notDistinctFrom,
      notDistinctFromInsensitive($where, value) {
        return pgConnectionFilterApplyFromOperator("notDistinctFromInsensitive", resolveNotDistinct, undefined, resolveInputCodecInsensitiveOperator, resolveSqlIdentifierInsensitiveOperator, resolveSqlValueInsensitiveOperator, $where, value);
      },
      notEndsWith($where, value) {
        return pgConnectionFilterApplyFromOperator("notEndsWith", resolveNotLike, resolveInputEndsWith, resolveInputCodecSensitive, resolveSqlIdentifierSensitive, undefined, $where, value);
      },
      notEndsWithInsensitive($where, value) {
        return pgConnectionFilterApplyFromOperator("notEndsWithInsensitive", resolveNotILike, resolveInputEndsWith, resolveInputCodecInsensitive, resolveSqlIdentifierInsensitive, undefined, $where, value);
      },
      notEqualTo: pgAggregatesApply_notEqualTo,
      notEqualToInsensitive($where, value) {
        return pgConnectionFilterApplyFromOperator("notEqualToInsensitive", resolveInequality, undefined, resolveInputCodecInsensitiveOperator, resolveSqlIdentifierInsensitiveOperator, resolveSqlValueInsensitiveOperator, $where, value);
      },
      notIn: pgAggregatesApply_notIn,
      notIncludes($where, value) {
        return pgConnectionFilterApplyFromOperator("notIncludes", resolveNotLike, resolveInputContains, resolveInputCodecSensitive, resolveSqlIdentifierSensitive, undefined, $where, value);
      },
      notIncludesInsensitive($where, value) {
        return pgConnectionFilterApplyFromOperator("notIncludesInsensitive", resolveNotILike, resolveInputContains, resolveInputCodecInsensitive, resolveSqlIdentifierInsensitive, undefined, $where, value);
      },
      notInInsensitive($where, value) {
        return pgConnectionFilterApplyFromOperator("notInInsensitive", resolveInequalAll, undefined, resolveInputCodecInsensitiveOperator_list, resolveSqlIdentifierInsensitiveOperator, resolveSqlValueInsensitiveOperator_list, $where, value);
      },
      notLike($where, value) {
        return pgConnectionFilterApplyFromOperator("notLike", resolveNotLike, undefined, resolveInputCodecSensitive, resolveSqlIdentifierSensitive, undefined, $where, value);
      },
      notLikeInsensitive($where, value) {
        return pgConnectionFilterApplyFromOperator("notLikeInsensitive", resolveNotILike, undefined, resolveInputCodecInsensitive, resolveSqlIdentifierInsensitive, undefined, $where, value);
      },
      notStartsWith($where, value) {
        return pgConnectionFilterApplyFromOperator("notStartsWith", resolveNotLike, resolveInputStartsWith, resolveInputCodecSensitive, resolveSqlIdentifierSensitive, undefined, $where, value);
      },
      notStartsWithInsensitive($where, value) {
        return pgConnectionFilterApplyFromOperator("notStartsWithInsensitive", resolveNotILike, resolveInputStartsWith, resolveInputCodecInsensitive, resolveSqlIdentifierInsensitive, undefined, $where, value);
      },
      startsWith($where, value) {
        return pgConnectionFilterApplyFromOperator("startsWith", resolveLike, resolveInputStartsWith, resolveInputCodecSensitive, resolveSqlIdentifierSensitive, undefined, $where, value);
      },
      startsWithInsensitive($where, value) {
        return pgConnectionFilterApplyFromOperator("startsWithInsensitive", resolveILike, resolveInputStartsWith, resolveInputCodecInsensitive, resolveSqlIdentifierInsensitive, undefined, $where, value);
      }
    }
  },
  UpdateCommentInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      patch: applyCreateFields
    }
  },
  UpdatePostInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      patch: applyCreateFields
    }
  },
  UpdateProjectInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      patch: applyCreateFields
    }
  },
  UpdateProjectLinkInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      patch: applyCreateFields
    }
  },
  UpdateProjectStatusConfigInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      patch: applyCreateFields
    }
  },
  UpdateStatusTemplateInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      patch: applyCreateFields
    }
  },
  UpdateUserInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      patch: applyCreateFields
    }
  },
  UpdateVoteInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      patch: applyCreateFields
    }
  },
  UserCondition: {
    plans: {
      avatarUrl($condition, val) {
        return applyAttributeCondition("avatar_url", TYPES.text, $condition, val);
      },
      createdAt: PostCondition_createdAtApply,
      email($condition, val) {
        return applyAttributeCondition("email", TYPES.text, $condition, val);
      },
      identityProviderId($condition, val) {
        return applyAttributeCondition("identity_provider_id", TYPES.uuid, $condition, val);
      },
      name: StatusTemplateCondition_nameApply,
      rowId: PostCondition_rowIdApply,
      updatedAt: PostCondition_updatedAtApply,
      username($condition, val) {
        return applyAttributeCondition("username", TYPES.text, $condition, val);
      }
    }
  },
  UserFilter: {
    plans: {
      and: PostFilter_andApply,
      avatarUrl(queryBuilder, value) {
        return pgConnectionFilterApplyAttribute("avatarUrl", "avatar_url", spec_user.attributes.avatar_url, queryBuilder, value);
      },
      comments($where, value) {
        assertAllowed(value, "object");
        const $rel = $where.andPlan();
        $rel.extensions.pgFilterRelation = {
          tableExpression: commentIdentifier,
          alias: resource_commentPgResource.name,
          localAttributes: registryConfig.pgRelations.user.commentsByTheirUserId.localAttributes,
          remoteAttributes: registryConfig.pgRelations.user.commentsByTheirUserId.remoteAttributes
        };
        return $rel;
      },
      commentsExist($where, value) {
        assertAllowed(value, "scalar");
        if (value == null) return;
        const $subQuery = $where.existsPlan({
          tableExpression: commentIdentifier,
          alias: resource_commentPgResource.name,
          equals: value
        });
        registryConfig.pgRelations.user.commentsByTheirUserId.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = registryConfig.pgRelations.user.commentsByTheirUserId.remoteAttributes[i];
          $subQuery.where(sql`${$where.alias}.${sql.identifier(localAttribute)} = ${$subQuery.alias}.${sql.identifier(remoteAttribute)}`);
        });
      },
      createdAt(queryBuilder, value) {
        return pgConnectionFilterApplyAttribute("createdAt", "created_at", spec_user.attributes.created_at, queryBuilder, value);
      },
      email(queryBuilder, value) {
        return pgConnectionFilterApplyAttribute("email", "email", spec_user.attributes.email, queryBuilder, value);
      },
      identityProviderId(queryBuilder, value) {
        return pgConnectionFilterApplyAttribute("identityProviderId", "identity_provider_id", spec_user.attributes.identity_provider_id, queryBuilder, value);
      },
      name(queryBuilder, value) {
        return pgConnectionFilterApplyAttribute("name", "name", spec_user.attributes.name, queryBuilder, value);
      },
      not: PostFilter_notApply,
      or: PostFilter_orApply,
      posts($where, value) {
        assertAllowed(value, "object");
        const $rel = $where.andPlan();
        $rel.extensions.pgFilterRelation = {
          tableExpression: postIdentifier,
          alias: resource_postPgResource.name,
          localAttributes: registryConfig.pgRelations.user.postsByTheirUserId.localAttributes,
          remoteAttributes: registryConfig.pgRelations.user.postsByTheirUserId.remoteAttributes
        };
        return $rel;
      },
      postsExist($where, value) {
        assertAllowed(value, "scalar");
        if (value == null) return;
        const $subQuery = $where.existsPlan({
          tableExpression: postIdentifier,
          alias: resource_postPgResource.name,
          equals: value
        });
        registryConfig.pgRelations.user.postsByTheirUserId.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = registryConfig.pgRelations.user.postsByTheirUserId.remoteAttributes[i];
          $subQuery.where(sql`${$where.alias}.${sql.identifier(localAttribute)} = ${$subQuery.alias}.${sql.identifier(remoteAttribute)}`);
        });
      },
      rowId(queryBuilder, value) {
        return pgConnectionFilterApplyAttribute("rowId", "id", spec_user.attributes.id, queryBuilder, value);
      },
      updatedAt(queryBuilder, value) {
        return pgConnectionFilterApplyAttribute("updatedAt", "updated_at", spec_user.attributes.updated_at, queryBuilder, value);
      },
      username(queryBuilder, value) {
        return pgConnectionFilterApplyAttribute("username", "username", spec_user.attributes.username, queryBuilder, value);
      },
      votes($where, value) {
        assertAllowed(value, "object");
        const $rel = $where.andPlan();
        $rel.extensions.pgFilterRelation = {
          tableExpression: voteIdentifier,
          alias: resource_votePgResource.name,
          localAttributes: registryConfig.pgRelations.user.votesByTheirUserId.localAttributes,
          remoteAttributes: registryConfig.pgRelations.user.votesByTheirUserId.remoteAttributes
        };
        return $rel;
      },
      votesExist($where, value) {
        assertAllowed(value, "scalar");
        if (value == null) return;
        const $subQuery = $where.existsPlan({
          tableExpression: voteIdentifier,
          alias: resource_votePgResource.name,
          equals: value
        });
        registryConfig.pgRelations.user.votesByTheirUserId.localAttributes.forEach((localAttribute, i) => {
          const remoteAttribute = registryConfig.pgRelations.user.votesByTheirUserId.remoteAttributes[i];
          $subQuery.where(sql`${$where.alias}.${sql.identifier(localAttribute)} = ${$subQuery.alias}.${sql.identifier(remoteAttribute)}`);
        });
      }
    }
  },
  UserHavingAverageInput: {
    plans: {
      createdAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_average, spec_user.attributes.created_at, "created_at", $having);
      },
      updatedAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_average, spec_user.attributes.updated_at, "updated_at", $having);
      }
    }
  },
  UserHavingDistinctCountInput: {
    plans: {
      createdAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_distinctCount, spec_user.attributes.created_at, "created_at", $having);
      },
      updatedAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_distinctCount, spec_user.attributes.updated_at, "updated_at", $having);
      }
    }
  },
  UserHavingInput: {
    plans: {
      AND: pgAggregatesApplyAnd,
      average: pgAggregatesPlanAggregatesField,
      distinctCount: pgAggregatesPlanAggregatesField,
      max: pgAggregatesPlanAggregatesField,
      min: pgAggregatesPlanAggregatesField,
      OR: PostHavingInput_ORApply,
      stddevPopulation: pgAggregatesPlanAggregatesField,
      stddevSample: pgAggregatesPlanAggregatesField,
      sum: pgAggregatesPlanAggregatesField,
      variancePopulation: pgAggregatesPlanAggregatesField,
      varianceSample: pgAggregatesPlanAggregatesField
    }
  },
  UserHavingMaxInput: {
    plans: {
      createdAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_max, spec_user.attributes.created_at, "created_at", $having);
      },
      updatedAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_max, spec_user.attributes.updated_at, "updated_at", $having);
      }
    }
  },
  UserHavingMinInput: {
    plans: {
      createdAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_min, spec_user.attributes.created_at, "created_at", $having);
      },
      updatedAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_min, spec_user.attributes.updated_at, "updated_at", $having);
      }
    }
  },
  UserHavingStddevPopulationInput: {
    plans: {
      createdAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_stddevPopulation, spec_user.attributes.created_at, "created_at", $having);
      },
      updatedAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_stddevPopulation, spec_user.attributes.updated_at, "updated_at", $having);
      }
    }
  },
  UserHavingStddevSampleInput: {
    plans: {
      createdAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_stddevSample, spec_user.attributes.created_at, "created_at", $having);
      },
      updatedAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_stddevSample, spec_user.attributes.updated_at, "updated_at", $having);
      }
    }
  },
  UserHavingSumInput: {
    plans: {
      createdAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_sum, spec_user.attributes.created_at, "created_at", $having);
      },
      updatedAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_sum, spec_user.attributes.updated_at, "updated_at", $having);
      }
    }
  },
  UserHavingVariancePopulationInput: {
    plans: {
      createdAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_variancePopulation, spec_user.attributes.created_at, "created_at", $having);
      },
      updatedAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_variancePopulation, spec_user.attributes.updated_at, "updated_at", $having);
      }
    }
  },
  UserHavingVarianceSampleInput: {
    plans: {
      createdAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_varianceSample, spec_user.attributes.created_at, "created_at", $having);
      },
      updatedAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_varianceSample, spec_user.attributes.updated_at, "updated_at", $having);
      }
    }
  },
  UserInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      avatarUrl: UserInput_avatarUrlApply,
      createdAt: CommentInput_createdAtApply,
      email: UserInput_emailApply,
      identityProviderId: UserInput_identityProviderIdApply,
      name: StatusTemplateInput_nameApply,
      rowId: CommentInput_rowIdApply,
      updatedAt: CommentInput_updatedAtApply,
      username: UserInput_usernameApply
    }
  },
  UserPatch: {
    baked: createObjectAndApplyChildren,
    plans: {
      avatarUrl: UserInput_avatarUrlApply,
      createdAt: CommentInput_createdAtApply,
      email: UserInput_emailApply,
      identityProviderId: UserInput_identityProviderIdApply,
      name: StatusTemplateInput_nameApply,
      rowId: CommentInput_rowIdApply,
      updatedAt: CommentInput_updatedAtApply,
      username: UserInput_usernameApply
    }
  },
  UserToManyCommentFilter: {
    plans: {
      aggregates: PostToManyCommentFilter_aggregatesApply,
      every: PostToManyCommentFilter_everyApply,
      none: PostToManyCommentFilter_noneApply,
      some: PostToManyCommentFilter_someApply
    }
  },
  UserToManyPostFilter: {
    plans: {
      aggregates: PostToManyCommentFilter_aggregatesApply,
      every: PostToManyCommentFilter_everyApply,
      none: PostToManyCommentFilter_noneApply,
      some: PostToManyCommentFilter_someApply
    }
  },
  UserToManyVoteFilter: {
    plans: {
      aggregates: PostToManyCommentFilter_aggregatesApply,
      every: PostToManyCommentFilter_everyApply,
      none: PostToManyCommentFilter_noneApply,
      some: PostToManyCommentFilter_someApply
    }
  },
  UUIDFilter: {
    plans: {
      distinctFrom: pgAggregatesApply_distinctFrom,
      equalTo: pgAggregatesApply_equalTo,
      greaterThan: pgAggregatesApply_greaterThan,
      greaterThanOrEqualTo: pgAggregatesApply_greaterThanOrEqualTo,
      in: pgAggregatesApply_in,
      isNull: pgAggregatesApply_isNull,
      lessThan: pgAggregatesApply_lessThan,
      lessThanOrEqualTo: pgAggregatesApply_lessThanOrEqualTo,
      notDistinctFrom: pgAggregatesApply_notDistinctFrom,
      notEqualTo: pgAggregatesApply_notEqualTo,
      notIn: pgAggregatesApply_notIn
    }
  },
  VoteAggregatesFilter: {
    plans: {
      distinctCount: CommentAggregatesFilter_distinctCountApply,
      filter: filterApply
    }
  },
  VoteCondition: {
    plans: {
      createdAt: PostCondition_createdAtApply,
      postId: CommentCondition_postIdApply,
      rowId: PostCondition_rowIdApply,
      updatedAt: PostCondition_updatedAtApply,
      userId: PostCondition_userIdApply,
      voteType($condition, val) {
        return applyAttributeCondition("vote_type", voteTypeCodec, $condition, val);
      }
    }
  },
  VoteDistinctCountAggregateFilter: {
    plans: {
      createdAt: CommentDistinctCountAggregateFilter_createdAtApply,
      postId: CommentDistinctCountAggregateFilter_postIdApply,
      rowId: CommentDistinctCountAggregateFilter_rowIdApply,
      updatedAt: CommentDistinctCountAggregateFilter_updatedAtApply,
      userId: CommentDistinctCountAggregateFilter_userIdApply,
      voteType($parent, input) {
        return pgAggregateApplyAttributeOrder(pgAggregateSpec_distinctCount, "vote_type", TYPES.bigint, voteTypeCodec, $parent, input);
      }
    }
  },
  VoteFilter: {
    plans: {
      and: PostFilter_andApply,
      createdAt(queryBuilder, value) {
        return pgConnectionFilterApplyAttribute("createdAt", "created_at", spec_vote.attributes.created_at, queryBuilder, value);
      },
      not: PostFilter_notApply,
      or: PostFilter_orApply,
      post($where, value) {
        return pgConnectionFilterApplySingleRelation(resource_postPgResource, postIdentifier, registryConfig.pgRelations.vote.postByMyPostId.localAttributes, registryConfig.pgRelations.vote.postByMyPostId.remoteAttributes, $where, value);
      },
      postId(queryBuilder, value) {
        return pgConnectionFilterApplyAttribute("postId", "post_id", spec_vote.attributes.post_id, queryBuilder, value);
      },
      rowId(queryBuilder, value) {
        return pgConnectionFilterApplyAttribute("rowId", "id", spec_vote.attributes.id, queryBuilder, value);
      },
      updatedAt(queryBuilder, value) {
        return pgConnectionFilterApplyAttribute("updatedAt", "updated_at", spec_vote.attributes.updated_at, queryBuilder, value);
      },
      user($where, value) {
        return pgConnectionFilterApplySingleRelation(resource_userPgResource, userIdentifier, registryConfig.pgRelations.vote.userByMyUserId.localAttributes, registryConfig.pgRelations.vote.userByMyUserId.remoteAttributes, $where, value);
      },
      userId(queryBuilder, value) {
        return pgConnectionFilterApplyAttribute("userId", "user_id", spec_vote.attributes.user_id, queryBuilder, value);
      },
      voteType(queryBuilder, value) {
        return pgConnectionFilterApplyAttribute("voteType", "vote_type", spec_vote.attributes.vote_type, queryBuilder, value);
      }
    }
  },
  VoteHavingAverageInput: {
    plans: {
      createdAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_average, spec_vote.attributes.created_at, "created_at", $having);
      },
      updatedAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_average, spec_vote.attributes.updated_at, "updated_at", $having);
      }
    }
  },
  VoteHavingDistinctCountInput: {
    plans: {
      createdAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_distinctCount, spec_vote.attributes.created_at, "created_at", $having);
      },
      updatedAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_distinctCount, spec_vote.attributes.updated_at, "updated_at", $having);
      }
    }
  },
  VoteHavingInput: {
    plans: {
      AND: pgAggregatesApplyAnd,
      average: pgAggregatesPlanAggregatesField,
      distinctCount: pgAggregatesPlanAggregatesField,
      max: pgAggregatesPlanAggregatesField,
      min: pgAggregatesPlanAggregatesField,
      OR: PostHavingInput_ORApply,
      stddevPopulation: pgAggregatesPlanAggregatesField,
      stddevSample: pgAggregatesPlanAggregatesField,
      sum: pgAggregatesPlanAggregatesField,
      variancePopulation: pgAggregatesPlanAggregatesField,
      varianceSample: pgAggregatesPlanAggregatesField
    }
  },
  VoteHavingMaxInput: {
    plans: {
      createdAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_max, spec_vote.attributes.created_at, "created_at", $having);
      },
      updatedAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_max, spec_vote.attributes.updated_at, "updated_at", $having);
      }
    }
  },
  VoteHavingMinInput: {
    plans: {
      createdAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_min, spec_vote.attributes.created_at, "created_at", $having);
      },
      updatedAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_min, spec_vote.attributes.updated_at, "updated_at", $having);
      }
    }
  },
  VoteHavingStddevPopulationInput: {
    plans: {
      createdAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_stddevPopulation, spec_vote.attributes.created_at, "created_at", $having);
      },
      updatedAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_stddevPopulation, spec_vote.attributes.updated_at, "updated_at", $having);
      }
    }
  },
  VoteHavingStddevSampleInput: {
    plans: {
      createdAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_stddevSample, spec_vote.attributes.created_at, "created_at", $having);
      },
      updatedAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_stddevSample, spec_vote.attributes.updated_at, "updated_at", $having);
      }
    }
  },
  VoteHavingSumInput: {
    plans: {
      createdAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_sum, spec_vote.attributes.created_at, "created_at", $having);
      },
      updatedAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_sum, spec_vote.attributes.updated_at, "updated_at", $having);
      }
    }
  },
  VoteHavingVariancePopulationInput: {
    plans: {
      createdAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_variancePopulation, spec_vote.attributes.created_at, "created_at", $having);
      },
      updatedAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_variancePopulation, spec_vote.attributes.updated_at, "updated_at", $having);
      }
    }
  },
  VoteHavingVarianceSampleInput: {
    plans: {
      createdAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_varianceSample, spec_vote.attributes.created_at, "created_at", $having);
      },
      updatedAt($having) {
        return pgAggregatesApplyAttributeFilter(pgAggregateSpec_varianceSample, spec_vote.attributes.updated_at, "updated_at", $having);
      }
    }
  },
  VoteInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      createdAt: CommentInput_createdAtApply,
      postId: CommentInput_postIdApply,
      rowId: CommentInput_rowIdApply,
      updatedAt: CommentInput_updatedAtApply,
      userId: CommentInput_userIdApply,
      voteType: VoteInput_voteTypeApply
    }
  },
  VotePatch: {
    baked: createObjectAndApplyChildren,
    plans: {
      createdAt: CommentInput_createdAtApply,
      postId: CommentInput_postIdApply,
      rowId: CommentInput_rowIdApply,
      updatedAt: CommentInput_updatedAtApply,
      userId: CommentInput_userIdApply,
      voteType: VoteInput_voteTypeApply
    }
  },
  VoteTypeFilter: {
    plans: {
      distinctFrom: pgAggregatesApply_distinctFrom,
      equalTo: pgAggregatesApply_equalTo,
      greaterThan: pgAggregatesApply_greaterThan,
      greaterThanOrEqualTo: pgAggregatesApply_greaterThanOrEqualTo,
      in: pgAggregatesApply_in,
      isNull: pgAggregatesApply_isNull,
      lessThan: pgAggregatesApply_lessThan,
      lessThanOrEqualTo: pgAggregatesApply_lessThanOrEqualTo,
      notDistinctFrom: pgAggregatesApply_notDistinctFrom,
      notEqualTo: pgAggregatesApply_notEqualTo,
      notIn: pgAggregatesApply_notIn
    }
  }
};
export const scalars = {
  BigFloat: {
    serialize: toString,
    parseValue: toString,
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) return ast.value;
      throw new GraphQLError(`BigFloat can only parse string values (kind='${ast.kind}')`);
    }
  },
  BigInt: {
    serialize: toString,
    parseValue: toString,
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) return ast.value;
      throw new GraphQLError(`BigInt can only parse string values (kind='${ast.kind}')`);
    }
  },
  Cursor: {
    serialize: toString,
    parseValue: toString,
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) return ast.value;
      throw new GraphQLError(`Cursor can only parse string values (kind='${ast.kind}')`);
    }
  },
  Datetime: {
    serialize: toString,
    parseValue: toString,
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) return ast.value;
      throw new GraphQLError(`Datetime can only parse string values (kind='${ast.kind}')`);
    }
  },
  UUID: {
    serialize: toString,
    parseValue(value) {
      return coerce("" + value);
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) return coerce(ast.value);
      throw new GraphQLError(`UUID can only parse string values (kind = '${ast.kind}')`);
    }
  }
};
export const enums = {
  CommentGroupBy: {
    values: {
      CREATED_AT: PostGroupBy_CREATED_ATApply,
      CREATED_AT_TRUNCATED_TO_DAY: PostGroupBy_CREATED_AT_TRUNCATED_TO_DAYApply,
      CREATED_AT_TRUNCATED_TO_HOUR: PostGroupBy_CREATED_AT_TRUNCATED_TO_HOURApply,
      MESSAGE($pgSelect) {
        applyGroupByAttribute("message", TYPES.text, $pgSelect);
      },
      PARENT_ID($pgSelect) {
        applyGroupByAttribute("parent_id", TYPES.uuid, $pgSelect);
      },
      POST_ID: CommentGroupBy_POST_IDApply,
      UPDATED_AT: PostGroupBy_UPDATED_ATApply,
      UPDATED_AT_TRUNCATED_TO_DAY: PostGroupBy_UPDATED_AT_TRUNCATED_TO_DAYApply,
      UPDATED_AT_TRUNCATED_TO_HOUR: PostGroupBy_UPDATED_AT_TRUNCATED_TO_HOURApply,
      USER_ID: PostGroupBy_USER_IDApply
    }
  },
  CommentOrderBy: {
    values: {
      CHILD_COMMENTS_COUNT_ASC($select) {
        pgAggregatesApplyOrderByTotalCount("ASC", relation3, resource_commentPgResource, $select);
      },
      CHILD_COMMENTS_COUNT_DESC($select) {
        pgAggregatesApplyOrderByTotalCount("DESC", relation3, resource_commentPgResource, $select);
      },
      CHILD_COMMENTS_DISTINCT_COUNT_CREATED_AT_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_comment.attributes.created_at, "created_at", "ASC", relation3, resource_commentPgResource, $select);
      },
      CHILD_COMMENTS_DISTINCT_COUNT_CREATED_AT_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_comment.attributes.created_at, "created_at", "DESC", relation3, resource_commentPgResource, $select);
      },
      CHILD_COMMENTS_DISTINCT_COUNT_MESSAGE_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_comment.attributes.message, "message", "ASC", relation3, resource_commentPgResource, $select);
      },
      CHILD_COMMENTS_DISTINCT_COUNT_MESSAGE_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_comment.attributes.message, "message", "DESC", relation3, resource_commentPgResource, $select);
      },
      CHILD_COMMENTS_DISTINCT_COUNT_PARENT_ID_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_comment.attributes.parent_id, "parent_id", "ASC", relation3, resource_commentPgResource, $select);
      },
      CHILD_COMMENTS_DISTINCT_COUNT_PARENT_ID_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_comment.attributes.parent_id, "parent_id", "DESC", relation3, resource_commentPgResource, $select);
      },
      CHILD_COMMENTS_DISTINCT_COUNT_POST_ID_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_comment.attributes.post_id, "post_id", "ASC", relation3, resource_commentPgResource, $select);
      },
      CHILD_COMMENTS_DISTINCT_COUNT_POST_ID_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_comment.attributes.post_id, "post_id", "DESC", relation3, resource_commentPgResource, $select);
      },
      CHILD_COMMENTS_DISTINCT_COUNT_ROW_ID_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_comment.attributes.id, "id", "ASC", relation3, resource_commentPgResource, $select);
      },
      CHILD_COMMENTS_DISTINCT_COUNT_ROW_ID_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_comment.attributes.id, "id", "DESC", relation3, resource_commentPgResource, $select);
      },
      CHILD_COMMENTS_DISTINCT_COUNT_UPDATED_AT_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_comment.attributes.updated_at, "updated_at", "ASC", relation3, resource_commentPgResource, $select);
      },
      CHILD_COMMENTS_DISTINCT_COUNT_UPDATED_AT_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_comment.attributes.updated_at, "updated_at", "DESC", relation3, resource_commentPgResource, $select);
      },
      CHILD_COMMENTS_DISTINCT_COUNT_USER_ID_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_comment.attributes.user_id, "user_id", "ASC", relation3, resource_commentPgResource, $select);
      },
      CHILD_COMMENTS_DISTINCT_COUNT_USER_ID_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_comment.attributes.user_id, "user_id", "DESC", relation3, resource_commentPgResource, $select);
      },
      CREATED_AT_ASC: PostOrderBy_CREATED_AT_ASCApply,
      CREATED_AT_DESC: PostOrderBy_CREATED_AT_DESCApply,
      MESSAGE_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "message",
          direction: "ASC"
        });
      },
      MESSAGE_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "message",
          direction: "DESC"
        });
      },
      PARENT_ID_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "parent_id",
          direction: "ASC"
        });
      },
      PARENT_ID_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "parent_id",
          direction: "DESC"
        });
      },
      POST_ID_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "post_id",
          direction: "ASC"
        });
      },
      POST_ID_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "post_id",
          direction: "DESC"
        });
      },
      PRIMARY_KEY_ASC(queryBuilder) {
        commentUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "ASC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      PRIMARY_KEY_DESC(queryBuilder) {
        commentUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "DESC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      ROW_ID_ASC: PostOrderBy_ROW_ID_ASCApply,
      ROW_ID_DESC: PostOrderBy_ROW_ID_DESCApply,
      UPDATED_AT_ASC: PostOrderBy_UPDATED_AT_ASCApply,
      UPDATED_AT_DESC: PostOrderBy_UPDATED_AT_DESCApply,
      USER_ID_ASC: PostOrderBy_USER_ID_ASCApply,
      USER_ID_DESC: PostOrderBy_USER_ID_DESCApply
    }
  },
  PostGroupBy: {
    values: {
      CREATED_AT: PostGroupBy_CREATED_ATApply,
      CREATED_AT_TRUNCATED_TO_DAY: PostGroupBy_CREATED_AT_TRUNCATED_TO_DAYApply,
      CREATED_AT_TRUNCATED_TO_HOUR: PostGroupBy_CREATED_AT_TRUNCATED_TO_HOURApply,
      DESCRIPTION: PostGroupBy_DESCRIPTIONApply,
      NUMBER($pgSelect) {
        applyGroupByAttribute("number", TYPES.int, $pgSelect);
      },
      PROJECT_ID: PostGroupBy_PROJECT_IDApply,
      STATUS_TEMPLATE_ID: PostGroupBy_STATUS_TEMPLATE_IDApply,
      STATUS_UPDATED_AT($pgSelect) {
        applyGroupByAttribute("status_updated_at", TYPES.timestamptz, $pgSelect);
      },
      STATUS_UPDATED_AT_TRUNCATED_TO_DAY(qb) {
        applyGroupByAggregateSpec(pgAggregateGroupBySpec_truncated_to_day, "status_updated_at", TYPES.timestamptz, qb);
      },
      STATUS_UPDATED_AT_TRUNCATED_TO_HOUR(qb) {
        applyGroupByAggregateSpec(pgAggregateGroupBySpec_truncated_to_hour, "status_updated_at", TYPES.timestamptz, qb);
      },
      TITLE: PostGroupBy_TITLEApply,
      UPDATED_AT: PostGroupBy_UPDATED_ATApply,
      UPDATED_AT_TRUNCATED_TO_DAY: PostGroupBy_UPDATED_AT_TRUNCATED_TO_DAYApply,
      UPDATED_AT_TRUNCATED_TO_HOUR: PostGroupBy_UPDATED_AT_TRUNCATED_TO_HOURApply,
      USER_ID: PostGroupBy_USER_IDApply
    }
  },
  PostOrderBy: {
    values: {
      COMMENTS_COUNT_ASC($select) {
        pgAggregatesApplyOrderByTotalCount("ASC", relation, resource_commentPgResource, $select);
      },
      COMMENTS_COUNT_DESC($select) {
        pgAggregatesApplyOrderByTotalCount("DESC", relation, resource_commentPgResource, $select);
      },
      COMMENTS_DISTINCT_COUNT_CREATED_AT_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_comment.attributes.created_at, "created_at", "ASC", relation, resource_commentPgResource, $select);
      },
      COMMENTS_DISTINCT_COUNT_CREATED_AT_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_comment.attributes.created_at, "created_at", "DESC", relation, resource_commentPgResource, $select);
      },
      COMMENTS_DISTINCT_COUNT_MESSAGE_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_comment.attributes.message, "message", "ASC", relation, resource_commentPgResource, $select);
      },
      COMMENTS_DISTINCT_COUNT_MESSAGE_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_comment.attributes.message, "message", "DESC", relation, resource_commentPgResource, $select);
      },
      COMMENTS_DISTINCT_COUNT_PARENT_ID_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_comment.attributes.parent_id, "parent_id", "ASC", relation, resource_commentPgResource, $select);
      },
      COMMENTS_DISTINCT_COUNT_PARENT_ID_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_comment.attributes.parent_id, "parent_id", "DESC", relation, resource_commentPgResource, $select);
      },
      COMMENTS_DISTINCT_COUNT_POST_ID_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_comment.attributes.post_id, "post_id", "ASC", relation, resource_commentPgResource, $select);
      },
      COMMENTS_DISTINCT_COUNT_POST_ID_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_comment.attributes.post_id, "post_id", "DESC", relation, resource_commentPgResource, $select);
      },
      COMMENTS_DISTINCT_COUNT_ROW_ID_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_comment.attributes.id, "id", "ASC", relation, resource_commentPgResource, $select);
      },
      COMMENTS_DISTINCT_COUNT_ROW_ID_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_comment.attributes.id, "id", "DESC", relation, resource_commentPgResource, $select);
      },
      COMMENTS_DISTINCT_COUNT_UPDATED_AT_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_comment.attributes.updated_at, "updated_at", "ASC", relation, resource_commentPgResource, $select);
      },
      COMMENTS_DISTINCT_COUNT_UPDATED_AT_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_comment.attributes.updated_at, "updated_at", "DESC", relation, resource_commentPgResource, $select);
      },
      COMMENTS_DISTINCT_COUNT_USER_ID_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_comment.attributes.user_id, "user_id", "ASC", relation, resource_commentPgResource, $select);
      },
      COMMENTS_DISTINCT_COUNT_USER_ID_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_comment.attributes.user_id, "user_id", "DESC", relation, resource_commentPgResource, $select);
      },
      CREATED_AT_ASC: PostOrderBy_CREATED_AT_ASCApply,
      CREATED_AT_DESC: PostOrderBy_CREATED_AT_DESCApply,
      DESCRIPTION_ASC: PostOrderBy_DESCRIPTION_ASCApply,
      DESCRIPTION_DESC: PostOrderBy_DESCRIPTION_DESCApply,
      NUMBER_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "number",
          direction: "ASC"
        });
      },
      NUMBER_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "number",
          direction: "DESC"
        });
      },
      PRIMARY_KEY_ASC(queryBuilder) {
        postUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "ASC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      PRIMARY_KEY_DESC(queryBuilder) {
        postUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "DESC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      PROJECT_ID_ASC: PostOrderBy_PROJECT_ID_ASCApply,
      PROJECT_ID_DESC: PostOrderBy_PROJECT_ID_DESCApply,
      ROW_ID_ASC: PostOrderBy_ROW_ID_ASCApply,
      ROW_ID_DESC: PostOrderBy_ROW_ID_DESCApply,
      STATUS_TEMPLATE_ID_ASC: PostOrderBy_STATUS_TEMPLATE_ID_ASCApply,
      STATUS_TEMPLATE_ID_DESC: PostOrderBy_STATUS_TEMPLATE_ID_DESCApply,
      STATUS_UPDATED_AT_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "status_updated_at",
          direction: "ASC"
        });
      },
      STATUS_UPDATED_AT_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "status_updated_at",
          direction: "DESC"
        });
      },
      TITLE_ASC: PostOrderBy_TITLE_ASCApply,
      TITLE_DESC: PostOrderBy_TITLE_DESCApply,
      UPDATED_AT_ASC: PostOrderBy_UPDATED_AT_ASCApply,
      UPDATED_AT_DESC: PostOrderBy_UPDATED_AT_DESCApply,
      USER_ID_ASC: PostOrderBy_USER_ID_ASCApply,
      USER_ID_DESC: PostOrderBy_USER_ID_DESCApply,
      VOTES_COUNT_ASC($select) {
        pgAggregatesApplyOrderByTotalCount("ASC", relation2, resource_votePgResource, $select);
      },
      VOTES_COUNT_DESC($select) {
        pgAggregatesApplyOrderByTotalCount("DESC", relation2, resource_votePgResource, $select);
      },
      VOTES_DISTINCT_COUNT_CREATED_AT_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_vote.attributes.created_at, "created_at", "ASC", relation2, resource_votePgResource, $select);
      },
      VOTES_DISTINCT_COUNT_CREATED_AT_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_vote.attributes.created_at, "created_at", "DESC", relation2, resource_votePgResource, $select);
      },
      VOTES_DISTINCT_COUNT_POST_ID_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_vote.attributes.post_id, "post_id", "ASC", relation2, resource_votePgResource, $select);
      },
      VOTES_DISTINCT_COUNT_POST_ID_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_vote.attributes.post_id, "post_id", "DESC", relation2, resource_votePgResource, $select);
      },
      VOTES_DISTINCT_COUNT_ROW_ID_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_vote.attributes.id, "id", "ASC", relation2, resource_votePgResource, $select);
      },
      VOTES_DISTINCT_COUNT_ROW_ID_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_vote.attributes.id, "id", "DESC", relation2, resource_votePgResource, $select);
      },
      VOTES_DISTINCT_COUNT_UPDATED_AT_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_vote.attributes.updated_at, "updated_at", "ASC", relation2, resource_votePgResource, $select);
      },
      VOTES_DISTINCT_COUNT_UPDATED_AT_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_vote.attributes.updated_at, "updated_at", "DESC", relation2, resource_votePgResource, $select);
      },
      VOTES_DISTINCT_COUNT_USER_ID_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_vote.attributes.user_id, "user_id", "ASC", relation2, resource_votePgResource, $select);
      },
      VOTES_DISTINCT_COUNT_USER_ID_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_vote.attributes.user_id, "user_id", "DESC", relation2, resource_votePgResource, $select);
      },
      VOTES_DISTINCT_COUNT_VOTE_TYPE_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_vote.attributes.vote_type, "vote_type", "ASC", relation2, resource_votePgResource, $select);
      },
      VOTES_DISTINCT_COUNT_VOTE_TYPE_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_vote.attributes.vote_type, "vote_type", "DESC", relation2, resource_votePgResource, $select);
      }
    }
  },
  ProjectGroupBy: {
    values: {
      CREATED_AT: PostGroupBy_CREATED_ATApply,
      CREATED_AT_TRUNCATED_TO_DAY: PostGroupBy_CREATED_AT_TRUNCATED_TO_DAYApply,
      CREATED_AT_TRUNCATED_TO_HOUR: PostGroupBy_CREATED_AT_TRUNCATED_TO_HOURApply,
      DESCRIPTION: PostGroupBy_DESCRIPTIONApply,
      IMAGE($pgSelect) {
        applyGroupByAttribute("image", TYPES.text, $pgSelect);
      },
      IS_PUBLIC($pgSelect) {
        applyGroupByAttribute("is_public", TYPES.boolean, $pgSelect);
      },
      NAME: StatusTemplateGroupBy_NAMEApply,
      NEXT_POST_NUMBER($pgSelect) {
        applyGroupByAttribute("next_post_number", TYPES.int, $pgSelect);
      },
      ORGANIZATION_ID: StatusTemplateGroupBy_ORGANIZATION_IDApply,
      PREFIX($pgSelect) {
        applyGroupByAttribute("prefix", TYPES.varchar, $pgSelect);
      },
      SLUG($pgSelect) {
        applyGroupByAttribute("slug", TYPES.text, $pgSelect);
      },
      UPDATED_AT: PostGroupBy_UPDATED_ATApply,
      UPDATED_AT_TRUNCATED_TO_DAY: PostGroupBy_UPDATED_AT_TRUNCATED_TO_DAYApply,
      UPDATED_AT_TRUNCATED_TO_HOUR: PostGroupBy_UPDATED_AT_TRUNCATED_TO_HOURApply
    }
  },
  ProjectLinkGroupBy: {
    values: {
      CREATED_AT: PostGroupBy_CREATED_ATApply,
      CREATED_AT_TRUNCATED_TO_DAY: PostGroupBy_CREATED_AT_TRUNCATED_TO_DAYApply,
      CREATED_AT_TRUNCATED_TO_HOUR: PostGroupBy_CREATED_AT_TRUNCATED_TO_HOURApply,
      ORDER($pgSelect) {
        applyGroupByAttribute("order", TYPES.int, $pgSelect);
      },
      PROJECT_ID: PostGroupBy_PROJECT_IDApply,
      TITLE: PostGroupBy_TITLEApply,
      UPDATED_AT: PostGroupBy_UPDATED_ATApply,
      UPDATED_AT_TRUNCATED_TO_DAY: PostGroupBy_UPDATED_AT_TRUNCATED_TO_DAYApply,
      UPDATED_AT_TRUNCATED_TO_HOUR: PostGroupBy_UPDATED_AT_TRUNCATED_TO_HOURApply,
      URL($pgSelect) {
        applyGroupByAttribute("url", TYPES.text, $pgSelect);
      }
    }
  },
  ProjectLinkOrderBy: {
    values: {
      CREATED_AT_ASC: PostOrderBy_CREATED_AT_ASCApply,
      CREATED_AT_DESC: PostOrderBy_CREATED_AT_DESCApply,
      ORDER_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "order",
          direction: "ASC"
        });
      },
      ORDER_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "order",
          direction: "DESC"
        });
      },
      PRIMARY_KEY_ASC(queryBuilder) {
        project_linkUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "ASC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      PRIMARY_KEY_DESC(queryBuilder) {
        project_linkUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "DESC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      PROJECT_ID_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "project_id",
          direction: "ASC"
        });
      },
      PROJECT_ID_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "project_id",
          direction: "DESC"
        });
      },
      ROW_ID_ASC: PostOrderBy_ROW_ID_ASCApply,
      ROW_ID_DESC: PostOrderBy_ROW_ID_DESCApply,
      TITLE_ASC: PostOrderBy_TITLE_ASCApply,
      TITLE_DESC: PostOrderBy_TITLE_DESCApply,
      UPDATED_AT_ASC: PostOrderBy_UPDATED_AT_ASCApply,
      UPDATED_AT_DESC: PostOrderBy_UPDATED_AT_DESCApply,
      URL_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "url",
          direction: "ASC"
        });
      },
      URL_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "url",
          direction: "DESC"
        });
      }
    }
  },
  ProjectOrderBy: {
    values: {
      CREATED_AT_ASC: PostOrderBy_CREATED_AT_ASCApply,
      CREATED_AT_DESC: PostOrderBy_CREATED_AT_DESCApply,
      DESCRIPTION_ASC: PostOrderBy_DESCRIPTION_ASCApply,
      DESCRIPTION_DESC: PostOrderBy_DESCRIPTION_DESCApply,
      IMAGE_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "image",
          direction: "ASC"
        });
      },
      IMAGE_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "image",
          direction: "DESC"
        });
      },
      IS_PUBLIC_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "is_public",
          direction: "ASC"
        });
      },
      IS_PUBLIC_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "is_public",
          direction: "DESC"
        });
      },
      NAME_ASC: StatusTemplateOrderBy_NAME_ASCApply,
      NAME_DESC: StatusTemplateOrderBy_NAME_DESCApply,
      NEXT_POST_NUMBER_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "next_post_number",
          direction: "ASC"
        });
      },
      NEXT_POST_NUMBER_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "next_post_number",
          direction: "DESC"
        });
      },
      ORGANIZATION_ID_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "organization_id",
          direction: "ASC"
        });
      },
      ORGANIZATION_ID_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "organization_id",
          direction: "DESC"
        });
      },
      POSTS_AVERAGE_NUMBER_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_average, spec_post.attributes.number, "number", "ASC", relation9, resource_postPgResource, $select);
      },
      POSTS_AVERAGE_NUMBER_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_average, spec_post.attributes.number, "number", "DESC", relation9, resource_postPgResource, $select);
      },
      POSTS_COUNT_ASC($select) {
        pgAggregatesApplyOrderByTotalCount("ASC", relation9, resource_postPgResource, $select);
      },
      POSTS_COUNT_DESC($select) {
        pgAggregatesApplyOrderByTotalCount("DESC", relation9, resource_postPgResource, $select);
      },
      POSTS_DISTINCT_COUNT_CREATED_AT_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_post.attributes.created_at, "created_at", "ASC", relation9, resource_postPgResource, $select);
      },
      POSTS_DISTINCT_COUNT_CREATED_AT_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_post.attributes.created_at, "created_at", "DESC", relation9, resource_postPgResource, $select);
      },
      POSTS_DISTINCT_COUNT_DESCRIPTION_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_post.attributes.description, "description", "ASC", relation9, resource_postPgResource, $select);
      },
      POSTS_DISTINCT_COUNT_DESCRIPTION_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_post.attributes.description, "description", "DESC", relation9, resource_postPgResource, $select);
      },
      POSTS_DISTINCT_COUNT_NUMBER_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_post.attributes.number, "number", "ASC", relation9, resource_postPgResource, $select);
      },
      POSTS_DISTINCT_COUNT_NUMBER_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_post.attributes.number, "number", "DESC", relation9, resource_postPgResource, $select);
      },
      POSTS_DISTINCT_COUNT_PROJECT_ID_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_post.attributes.project_id, "project_id", "ASC", relation9, resource_postPgResource, $select);
      },
      POSTS_DISTINCT_COUNT_PROJECT_ID_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_post.attributes.project_id, "project_id", "DESC", relation9, resource_postPgResource, $select);
      },
      POSTS_DISTINCT_COUNT_ROW_ID_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_post.attributes.id, "id", "ASC", relation9, resource_postPgResource, $select);
      },
      POSTS_DISTINCT_COUNT_ROW_ID_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_post.attributes.id, "id", "DESC", relation9, resource_postPgResource, $select);
      },
      POSTS_DISTINCT_COUNT_STATUS_TEMPLATE_ID_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_post.attributes.status_template_id, "status_template_id", "ASC", relation9, resource_postPgResource, $select);
      },
      POSTS_DISTINCT_COUNT_STATUS_TEMPLATE_ID_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_post.attributes.status_template_id, "status_template_id", "DESC", relation9, resource_postPgResource, $select);
      },
      POSTS_DISTINCT_COUNT_STATUS_UPDATED_AT_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_post.attributes.status_updated_at, "status_updated_at", "ASC", relation9, resource_postPgResource, $select);
      },
      POSTS_DISTINCT_COUNT_STATUS_UPDATED_AT_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_post.attributes.status_updated_at, "status_updated_at", "DESC", relation9, resource_postPgResource, $select);
      },
      POSTS_DISTINCT_COUNT_TITLE_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_post.attributes.title, "title", "ASC", relation9, resource_postPgResource, $select);
      },
      POSTS_DISTINCT_COUNT_TITLE_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_post.attributes.title, "title", "DESC", relation9, resource_postPgResource, $select);
      },
      POSTS_DISTINCT_COUNT_UPDATED_AT_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_post.attributes.updated_at, "updated_at", "ASC", relation9, resource_postPgResource, $select);
      },
      POSTS_DISTINCT_COUNT_UPDATED_AT_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_post.attributes.updated_at, "updated_at", "DESC", relation9, resource_postPgResource, $select);
      },
      POSTS_DISTINCT_COUNT_USER_ID_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_post.attributes.user_id, "user_id", "ASC", relation9, resource_postPgResource, $select);
      },
      POSTS_DISTINCT_COUNT_USER_ID_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_post.attributes.user_id, "user_id", "DESC", relation9, resource_postPgResource, $select);
      },
      POSTS_MAX_NUMBER_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_max, spec_post.attributes.number, "number", "ASC", relation9, resource_postPgResource, $select);
      },
      POSTS_MAX_NUMBER_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_max, spec_post.attributes.number, "number", "DESC", relation9, resource_postPgResource, $select);
      },
      POSTS_MIN_NUMBER_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_min, spec_post.attributes.number, "number", "ASC", relation9, resource_postPgResource, $select);
      },
      POSTS_MIN_NUMBER_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_min, spec_post.attributes.number, "number", "DESC", relation9, resource_postPgResource, $select);
      },
      POSTS_STDDEV_POPULATION_NUMBER_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_stddevPopulation, spec_post.attributes.number, "number", "ASC", relation9, resource_postPgResource, $select);
      },
      POSTS_STDDEV_POPULATION_NUMBER_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_stddevPopulation, spec_post.attributes.number, "number", "DESC", relation9, resource_postPgResource, $select);
      },
      POSTS_STDDEV_SAMPLE_NUMBER_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_stddevSample, spec_post.attributes.number, "number", "ASC", relation9, resource_postPgResource, $select);
      },
      POSTS_STDDEV_SAMPLE_NUMBER_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_stddevSample, spec_post.attributes.number, "number", "DESC", relation9, resource_postPgResource, $select);
      },
      POSTS_SUM_NUMBER_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_sum, spec_post.attributes.number, "number", "ASC", relation9, resource_postPgResource, $select);
      },
      POSTS_SUM_NUMBER_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_sum, spec_post.attributes.number, "number", "DESC", relation9, resource_postPgResource, $select);
      },
      POSTS_VARIANCE_POPULATION_NUMBER_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_variancePopulation, spec_post.attributes.number, "number", "ASC", relation9, resource_postPgResource, $select);
      },
      POSTS_VARIANCE_POPULATION_NUMBER_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_variancePopulation, spec_post.attributes.number, "number", "DESC", relation9, resource_postPgResource, $select);
      },
      POSTS_VARIANCE_SAMPLE_NUMBER_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_varianceSample, spec_post.attributes.number, "number", "ASC", relation9, resource_postPgResource, $select);
      },
      POSTS_VARIANCE_SAMPLE_NUMBER_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_varianceSample, spec_post.attributes.number, "number", "DESC", relation9, resource_postPgResource, $select);
      },
      PREFIX_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "prefix",
          direction: "ASC"
        });
      },
      PREFIX_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "prefix",
          direction: "DESC"
        });
      },
      PRIMARY_KEY_ASC(queryBuilder) {
        projectUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "ASC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      PRIMARY_KEY_DESC(queryBuilder) {
        projectUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "DESC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      PROJECT_LINKS_AVERAGE_ORDER_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_average, spec_projectLink.attributes.order, "order", "ASC", relation11, resource_project_linkPgResource, $select);
      },
      PROJECT_LINKS_AVERAGE_ORDER_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_average, spec_projectLink.attributes.order, "order", "DESC", relation11, resource_project_linkPgResource, $select);
      },
      PROJECT_LINKS_COUNT_ASC($select) {
        pgAggregatesApplyOrderByTotalCount("ASC", relation11, resource_project_linkPgResource, $select);
      },
      PROJECT_LINKS_COUNT_DESC($select) {
        pgAggregatesApplyOrderByTotalCount("DESC", relation11, resource_project_linkPgResource, $select);
      },
      PROJECT_LINKS_DISTINCT_COUNT_CREATED_AT_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_projectLink.attributes.created_at, "created_at", "ASC", relation11, resource_project_linkPgResource, $select);
      },
      PROJECT_LINKS_DISTINCT_COUNT_CREATED_AT_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_projectLink.attributes.created_at, "created_at", "DESC", relation11, resource_project_linkPgResource, $select);
      },
      PROJECT_LINKS_DISTINCT_COUNT_ORDER_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_projectLink.attributes.order, "order", "ASC", relation11, resource_project_linkPgResource, $select);
      },
      PROJECT_LINKS_DISTINCT_COUNT_ORDER_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_projectLink.attributes.order, "order", "DESC", relation11, resource_project_linkPgResource, $select);
      },
      PROJECT_LINKS_DISTINCT_COUNT_PROJECT_ID_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_projectLink.attributes.project_id, "project_id", "ASC", relation11, resource_project_linkPgResource, $select);
      },
      PROJECT_LINKS_DISTINCT_COUNT_PROJECT_ID_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_projectLink.attributes.project_id, "project_id", "DESC", relation11, resource_project_linkPgResource, $select);
      },
      PROJECT_LINKS_DISTINCT_COUNT_ROW_ID_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_projectLink.attributes.id, "id", "ASC", relation11, resource_project_linkPgResource, $select);
      },
      PROJECT_LINKS_DISTINCT_COUNT_ROW_ID_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_projectLink.attributes.id, "id", "DESC", relation11, resource_project_linkPgResource, $select);
      },
      PROJECT_LINKS_DISTINCT_COUNT_TITLE_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_projectLink.attributes.title, "title", "ASC", relation11, resource_project_linkPgResource, $select);
      },
      PROJECT_LINKS_DISTINCT_COUNT_TITLE_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_projectLink.attributes.title, "title", "DESC", relation11, resource_project_linkPgResource, $select);
      },
      PROJECT_LINKS_DISTINCT_COUNT_UPDATED_AT_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_projectLink.attributes.updated_at, "updated_at", "ASC", relation11, resource_project_linkPgResource, $select);
      },
      PROJECT_LINKS_DISTINCT_COUNT_UPDATED_AT_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_projectLink.attributes.updated_at, "updated_at", "DESC", relation11, resource_project_linkPgResource, $select);
      },
      PROJECT_LINKS_DISTINCT_COUNT_URL_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_projectLink.attributes.url, "url", "ASC", relation11, resource_project_linkPgResource, $select);
      },
      PROJECT_LINKS_DISTINCT_COUNT_URL_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_projectLink.attributes.url, "url", "DESC", relation11, resource_project_linkPgResource, $select);
      },
      PROJECT_LINKS_MAX_ORDER_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_max, spec_projectLink.attributes.order, "order", "ASC", relation11, resource_project_linkPgResource, $select);
      },
      PROJECT_LINKS_MAX_ORDER_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_max, spec_projectLink.attributes.order, "order", "DESC", relation11, resource_project_linkPgResource, $select);
      },
      PROJECT_LINKS_MIN_ORDER_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_min, spec_projectLink.attributes.order, "order", "ASC", relation11, resource_project_linkPgResource, $select);
      },
      PROJECT_LINKS_MIN_ORDER_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_min, spec_projectLink.attributes.order, "order", "DESC", relation11, resource_project_linkPgResource, $select);
      },
      PROJECT_LINKS_STDDEV_POPULATION_ORDER_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_stddevPopulation, spec_projectLink.attributes.order, "order", "ASC", relation11, resource_project_linkPgResource, $select);
      },
      PROJECT_LINKS_STDDEV_POPULATION_ORDER_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_stddevPopulation, spec_projectLink.attributes.order, "order", "DESC", relation11, resource_project_linkPgResource, $select);
      },
      PROJECT_LINKS_STDDEV_SAMPLE_ORDER_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_stddevSample, spec_projectLink.attributes.order, "order", "ASC", relation11, resource_project_linkPgResource, $select);
      },
      PROJECT_LINKS_STDDEV_SAMPLE_ORDER_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_stddevSample, spec_projectLink.attributes.order, "order", "DESC", relation11, resource_project_linkPgResource, $select);
      },
      PROJECT_LINKS_SUM_ORDER_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_sum, spec_projectLink.attributes.order, "order", "ASC", relation11, resource_project_linkPgResource, $select);
      },
      PROJECT_LINKS_SUM_ORDER_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_sum, spec_projectLink.attributes.order, "order", "DESC", relation11, resource_project_linkPgResource, $select);
      },
      PROJECT_LINKS_VARIANCE_POPULATION_ORDER_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_variancePopulation, spec_projectLink.attributes.order, "order", "ASC", relation11, resource_project_linkPgResource, $select);
      },
      PROJECT_LINKS_VARIANCE_POPULATION_ORDER_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_variancePopulation, spec_projectLink.attributes.order, "order", "DESC", relation11, resource_project_linkPgResource, $select);
      },
      PROJECT_LINKS_VARIANCE_SAMPLE_ORDER_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_varianceSample, spec_projectLink.attributes.order, "order", "ASC", relation11, resource_project_linkPgResource, $select);
      },
      PROJECT_LINKS_VARIANCE_SAMPLE_ORDER_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_varianceSample, spec_projectLink.attributes.order, "order", "DESC", relation11, resource_project_linkPgResource, $select);
      },
      PROJECT_STATUS_CONFIGS_AVERAGE_SORT_ORDER_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_average, spec_projectStatusConfig.attributes.sort_order, "sort_order", "ASC", relation10, resource_project_status_configPgResource, $select);
      },
      PROJECT_STATUS_CONFIGS_AVERAGE_SORT_ORDER_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_average, spec_projectStatusConfig.attributes.sort_order, "sort_order", "DESC", relation10, resource_project_status_configPgResource, $select);
      },
      PROJECT_STATUS_CONFIGS_COUNT_ASC($select) {
        pgAggregatesApplyOrderByTotalCount("ASC", relation10, resource_project_status_configPgResource, $select);
      },
      PROJECT_STATUS_CONFIGS_COUNT_DESC($select) {
        pgAggregatesApplyOrderByTotalCount("DESC", relation10, resource_project_status_configPgResource, $select);
      },
      PROJECT_STATUS_CONFIGS_DISTINCT_COUNT_CREATED_AT_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_projectStatusConfig.attributes.created_at, "created_at", "ASC", relation10, resource_project_status_configPgResource, $select);
      },
      PROJECT_STATUS_CONFIGS_DISTINCT_COUNT_CREATED_AT_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_projectStatusConfig.attributes.created_at, "created_at", "DESC", relation10, resource_project_status_configPgResource, $select);
      },
      PROJECT_STATUS_CONFIGS_DISTINCT_COUNT_CUSTOM_COLOR_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_projectStatusConfig.attributes.custom_color, "custom_color", "ASC", relation10, resource_project_status_configPgResource, $select);
      },
      PROJECT_STATUS_CONFIGS_DISTINCT_COUNT_CUSTOM_COLOR_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_projectStatusConfig.attributes.custom_color, "custom_color", "DESC", relation10, resource_project_status_configPgResource, $select);
      },
      PROJECT_STATUS_CONFIGS_DISTINCT_COUNT_CUSTOM_DESCRIPTION_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_projectStatusConfig.attributes.custom_description, "custom_description", "ASC", relation10, resource_project_status_configPgResource, $select);
      },
      PROJECT_STATUS_CONFIGS_DISTINCT_COUNT_CUSTOM_DESCRIPTION_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_projectStatusConfig.attributes.custom_description, "custom_description", "DESC", relation10, resource_project_status_configPgResource, $select);
      },
      PROJECT_STATUS_CONFIGS_DISTINCT_COUNT_IS_DEFAULT_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_projectStatusConfig.attributes.is_default, "is_default", "ASC", relation10, resource_project_status_configPgResource, $select);
      },
      PROJECT_STATUS_CONFIGS_DISTINCT_COUNT_IS_DEFAULT_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_projectStatusConfig.attributes.is_default, "is_default", "DESC", relation10, resource_project_status_configPgResource, $select);
      },
      PROJECT_STATUS_CONFIGS_DISTINCT_COUNT_IS_ENABLED_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_projectStatusConfig.attributes.is_enabled, "is_enabled", "ASC", relation10, resource_project_status_configPgResource, $select);
      },
      PROJECT_STATUS_CONFIGS_DISTINCT_COUNT_IS_ENABLED_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_projectStatusConfig.attributes.is_enabled, "is_enabled", "DESC", relation10, resource_project_status_configPgResource, $select);
      },
      PROJECT_STATUS_CONFIGS_DISTINCT_COUNT_PROJECT_ID_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_projectStatusConfig.attributes.project_id, "project_id", "ASC", relation10, resource_project_status_configPgResource, $select);
      },
      PROJECT_STATUS_CONFIGS_DISTINCT_COUNT_PROJECT_ID_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_projectStatusConfig.attributes.project_id, "project_id", "DESC", relation10, resource_project_status_configPgResource, $select);
      },
      PROJECT_STATUS_CONFIGS_DISTINCT_COUNT_ROW_ID_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_projectStatusConfig.attributes.id, "id", "ASC", relation10, resource_project_status_configPgResource, $select);
      },
      PROJECT_STATUS_CONFIGS_DISTINCT_COUNT_ROW_ID_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_projectStatusConfig.attributes.id, "id", "DESC", relation10, resource_project_status_configPgResource, $select);
      },
      PROJECT_STATUS_CONFIGS_DISTINCT_COUNT_SORT_ORDER_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_projectStatusConfig.attributes.sort_order, "sort_order", "ASC", relation10, resource_project_status_configPgResource, $select);
      },
      PROJECT_STATUS_CONFIGS_DISTINCT_COUNT_SORT_ORDER_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_projectStatusConfig.attributes.sort_order, "sort_order", "DESC", relation10, resource_project_status_configPgResource, $select);
      },
      PROJECT_STATUS_CONFIGS_DISTINCT_COUNT_STATUS_TEMPLATE_ID_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_projectStatusConfig.attributes.status_template_id, "status_template_id", "ASC", relation10, resource_project_status_configPgResource, $select);
      },
      PROJECT_STATUS_CONFIGS_DISTINCT_COUNT_STATUS_TEMPLATE_ID_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_projectStatusConfig.attributes.status_template_id, "status_template_id", "DESC", relation10, resource_project_status_configPgResource, $select);
      },
      PROJECT_STATUS_CONFIGS_MAX_SORT_ORDER_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_max, spec_projectStatusConfig.attributes.sort_order, "sort_order", "ASC", relation10, resource_project_status_configPgResource, $select);
      },
      PROJECT_STATUS_CONFIGS_MAX_SORT_ORDER_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_max, spec_projectStatusConfig.attributes.sort_order, "sort_order", "DESC", relation10, resource_project_status_configPgResource, $select);
      },
      PROJECT_STATUS_CONFIGS_MIN_SORT_ORDER_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_min, spec_projectStatusConfig.attributes.sort_order, "sort_order", "ASC", relation10, resource_project_status_configPgResource, $select);
      },
      PROJECT_STATUS_CONFIGS_MIN_SORT_ORDER_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_min, spec_projectStatusConfig.attributes.sort_order, "sort_order", "DESC", relation10, resource_project_status_configPgResource, $select);
      },
      PROJECT_STATUS_CONFIGS_STDDEV_POPULATION_SORT_ORDER_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_stddevPopulation, spec_projectStatusConfig.attributes.sort_order, "sort_order", "ASC", relation10, resource_project_status_configPgResource, $select);
      },
      PROJECT_STATUS_CONFIGS_STDDEV_POPULATION_SORT_ORDER_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_stddevPopulation, spec_projectStatusConfig.attributes.sort_order, "sort_order", "DESC", relation10, resource_project_status_configPgResource, $select);
      },
      PROJECT_STATUS_CONFIGS_STDDEV_SAMPLE_SORT_ORDER_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_stddevSample, spec_projectStatusConfig.attributes.sort_order, "sort_order", "ASC", relation10, resource_project_status_configPgResource, $select);
      },
      PROJECT_STATUS_CONFIGS_STDDEV_SAMPLE_SORT_ORDER_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_stddevSample, spec_projectStatusConfig.attributes.sort_order, "sort_order", "DESC", relation10, resource_project_status_configPgResource, $select);
      },
      PROJECT_STATUS_CONFIGS_SUM_SORT_ORDER_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_sum, spec_projectStatusConfig.attributes.sort_order, "sort_order", "ASC", relation10, resource_project_status_configPgResource, $select);
      },
      PROJECT_STATUS_CONFIGS_SUM_SORT_ORDER_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_sum, spec_projectStatusConfig.attributes.sort_order, "sort_order", "DESC", relation10, resource_project_status_configPgResource, $select);
      },
      PROJECT_STATUS_CONFIGS_VARIANCE_POPULATION_SORT_ORDER_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_variancePopulation, spec_projectStatusConfig.attributes.sort_order, "sort_order", "ASC", relation10, resource_project_status_configPgResource, $select);
      },
      PROJECT_STATUS_CONFIGS_VARIANCE_POPULATION_SORT_ORDER_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_variancePopulation, spec_projectStatusConfig.attributes.sort_order, "sort_order", "DESC", relation10, resource_project_status_configPgResource, $select);
      },
      PROJECT_STATUS_CONFIGS_VARIANCE_SAMPLE_SORT_ORDER_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_varianceSample, spec_projectStatusConfig.attributes.sort_order, "sort_order", "ASC", relation10, resource_project_status_configPgResource, $select);
      },
      PROJECT_STATUS_CONFIGS_VARIANCE_SAMPLE_SORT_ORDER_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_varianceSample, spec_projectStatusConfig.attributes.sort_order, "sort_order", "DESC", relation10, resource_project_status_configPgResource, $select);
      },
      ROW_ID_ASC: PostOrderBy_ROW_ID_ASCApply,
      ROW_ID_DESC: PostOrderBy_ROW_ID_DESCApply,
      SLUG_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "slug",
          direction: "ASC"
        });
        queryBuilder.setOrderIsUnique();
      },
      SLUG_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "slug",
          direction: "DESC"
        });
        queryBuilder.setOrderIsUnique();
      },
      UPDATED_AT_ASC: PostOrderBy_UPDATED_AT_ASCApply,
      UPDATED_AT_DESC: PostOrderBy_UPDATED_AT_DESCApply
    }
  },
  ProjectStatusConfigGroupBy: {
    values: {
      CREATED_AT: PostGroupBy_CREATED_ATApply,
      CREATED_AT_TRUNCATED_TO_DAY: PostGroupBy_CREATED_AT_TRUNCATED_TO_DAYApply,
      CREATED_AT_TRUNCATED_TO_HOUR: PostGroupBy_CREATED_AT_TRUNCATED_TO_HOURApply,
      CUSTOM_COLOR($pgSelect) {
        applyGroupByAttribute("custom_color", TYPES.text, $pgSelect);
      },
      CUSTOM_DESCRIPTION($pgSelect) {
        applyGroupByAttribute("custom_description", TYPES.text, $pgSelect);
      },
      IS_DEFAULT($pgSelect) {
        applyGroupByAttribute("is_default", TYPES.boolean, $pgSelect);
      },
      IS_ENABLED($pgSelect) {
        applyGroupByAttribute("is_enabled", TYPES.boolean, $pgSelect);
      },
      PROJECT_ID: PostGroupBy_PROJECT_IDApply,
      SORT_ORDER: ProjectStatusConfigGroupBy_SORT_ORDERApply,
      STATUS_TEMPLATE_ID: PostGroupBy_STATUS_TEMPLATE_IDApply
    }
  },
  ProjectStatusConfigOrderBy: {
    values: {
      CREATED_AT_ASC: PostOrderBy_CREATED_AT_ASCApply,
      CREATED_AT_DESC: PostOrderBy_CREATED_AT_DESCApply,
      CUSTOM_COLOR_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "custom_color",
          direction: "ASC"
        });
      },
      CUSTOM_COLOR_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "custom_color",
          direction: "DESC"
        });
      },
      CUSTOM_DESCRIPTION_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "custom_description",
          direction: "ASC"
        });
      },
      CUSTOM_DESCRIPTION_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "custom_description",
          direction: "DESC"
        });
      },
      IS_DEFAULT_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "is_default",
          direction: "ASC"
        });
      },
      IS_DEFAULT_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "is_default",
          direction: "DESC"
        });
      },
      IS_ENABLED_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "is_enabled",
          direction: "ASC"
        });
      },
      IS_ENABLED_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "is_enabled",
          direction: "DESC"
        });
      },
      PRIMARY_KEY_ASC(queryBuilder) {
        project_status_configUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "ASC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      PRIMARY_KEY_DESC(queryBuilder) {
        project_status_configUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "DESC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      PROJECT_ID_ASC: PostOrderBy_PROJECT_ID_ASCApply,
      PROJECT_ID_DESC: PostOrderBy_PROJECT_ID_DESCApply,
      ROW_ID_ASC: PostOrderBy_ROW_ID_ASCApply,
      ROW_ID_DESC: PostOrderBy_ROW_ID_DESCApply,
      SORT_ORDER_ASC: ProjectStatusConfigOrderBy_SORT_ORDER_ASCApply,
      SORT_ORDER_DESC: ProjectStatusConfigOrderBy_SORT_ORDER_DESCApply,
      STATUS_TEMPLATE_ID_ASC: PostOrderBy_STATUS_TEMPLATE_ID_ASCApply,
      STATUS_TEMPLATE_ID_DESC: PostOrderBy_STATUS_TEMPLATE_ID_DESCApply
    }
  },
  StatusTemplateGroupBy: {
    values: {
      COLOR($pgSelect) {
        applyGroupByAttribute("color", TYPES.text, $pgSelect);
      },
      CREATED_AT: PostGroupBy_CREATED_ATApply,
      CREATED_AT_TRUNCATED_TO_DAY: PostGroupBy_CREATED_AT_TRUNCATED_TO_DAYApply,
      CREATED_AT_TRUNCATED_TO_HOUR: PostGroupBy_CREATED_AT_TRUNCATED_TO_HOURApply,
      DESCRIPTION: PostGroupBy_DESCRIPTIONApply,
      DISPLAY_NAME($pgSelect) {
        applyGroupByAttribute("display_name", TYPES.text, $pgSelect);
      },
      NAME: StatusTemplateGroupBy_NAMEApply,
      ORGANIZATION_ID: StatusTemplateGroupBy_ORGANIZATION_IDApply,
      SORT_ORDER: ProjectStatusConfigGroupBy_SORT_ORDERApply,
      UPDATED_AT: PostGroupBy_UPDATED_ATApply,
      UPDATED_AT_TRUNCATED_TO_DAY: PostGroupBy_UPDATED_AT_TRUNCATED_TO_DAYApply,
      UPDATED_AT_TRUNCATED_TO_HOUR: PostGroupBy_UPDATED_AT_TRUNCATED_TO_HOURApply
    }
  },
  StatusTemplateOrderBy: {
    values: {
      COLOR_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "color",
          direction: "ASC"
        });
      },
      COLOR_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "color",
          direction: "DESC"
        });
      },
      CREATED_AT_ASC: PostOrderBy_CREATED_AT_ASCApply,
      CREATED_AT_DESC: PostOrderBy_CREATED_AT_DESCApply,
      DESCRIPTION_ASC: PostOrderBy_DESCRIPTION_ASCApply,
      DESCRIPTION_DESC: PostOrderBy_DESCRIPTION_DESCApply,
      DISPLAY_NAME_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "display_name",
          direction: "ASC"
        });
      },
      DISPLAY_NAME_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "display_name",
          direction: "DESC"
        });
      },
      NAME_ASC: StatusTemplateOrderBy_NAME_ASCApply,
      NAME_DESC: StatusTemplateOrderBy_NAME_DESCApply,
      ORGANIZATION_ID_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "organization_id",
          direction: "ASC"
        });
        queryBuilder.setOrderIsUnique();
      },
      ORGANIZATION_ID_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "organization_id",
          direction: "DESC"
        });
        queryBuilder.setOrderIsUnique();
      },
      POSTS_AVERAGE_NUMBER_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_average, spec_post.attributes.number, "number", "ASC", relation4, resource_postPgResource, $select);
      },
      POSTS_AVERAGE_NUMBER_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_average, spec_post.attributes.number, "number", "DESC", relation4, resource_postPgResource, $select);
      },
      POSTS_COUNT_ASC($select) {
        pgAggregatesApplyOrderByTotalCount("ASC", relation4, resource_postPgResource, $select);
      },
      POSTS_COUNT_DESC($select) {
        pgAggregatesApplyOrderByTotalCount("DESC", relation4, resource_postPgResource, $select);
      },
      POSTS_DISTINCT_COUNT_CREATED_AT_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_post.attributes.created_at, "created_at", "ASC", relation4, resource_postPgResource, $select);
      },
      POSTS_DISTINCT_COUNT_CREATED_AT_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_post.attributes.created_at, "created_at", "DESC", relation4, resource_postPgResource, $select);
      },
      POSTS_DISTINCT_COUNT_DESCRIPTION_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_post.attributes.description, "description", "ASC", relation4, resource_postPgResource, $select);
      },
      POSTS_DISTINCT_COUNT_DESCRIPTION_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_post.attributes.description, "description", "DESC", relation4, resource_postPgResource, $select);
      },
      POSTS_DISTINCT_COUNT_NUMBER_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_post.attributes.number, "number", "ASC", relation4, resource_postPgResource, $select);
      },
      POSTS_DISTINCT_COUNT_NUMBER_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_post.attributes.number, "number", "DESC", relation4, resource_postPgResource, $select);
      },
      POSTS_DISTINCT_COUNT_PROJECT_ID_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_post.attributes.project_id, "project_id", "ASC", relation4, resource_postPgResource, $select);
      },
      POSTS_DISTINCT_COUNT_PROJECT_ID_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_post.attributes.project_id, "project_id", "DESC", relation4, resource_postPgResource, $select);
      },
      POSTS_DISTINCT_COUNT_ROW_ID_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_post.attributes.id, "id", "ASC", relation4, resource_postPgResource, $select);
      },
      POSTS_DISTINCT_COUNT_ROW_ID_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_post.attributes.id, "id", "DESC", relation4, resource_postPgResource, $select);
      },
      POSTS_DISTINCT_COUNT_STATUS_TEMPLATE_ID_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_post.attributes.status_template_id, "status_template_id", "ASC", relation4, resource_postPgResource, $select);
      },
      POSTS_DISTINCT_COUNT_STATUS_TEMPLATE_ID_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_post.attributes.status_template_id, "status_template_id", "DESC", relation4, resource_postPgResource, $select);
      },
      POSTS_DISTINCT_COUNT_STATUS_UPDATED_AT_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_post.attributes.status_updated_at, "status_updated_at", "ASC", relation4, resource_postPgResource, $select);
      },
      POSTS_DISTINCT_COUNT_STATUS_UPDATED_AT_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_post.attributes.status_updated_at, "status_updated_at", "DESC", relation4, resource_postPgResource, $select);
      },
      POSTS_DISTINCT_COUNT_TITLE_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_post.attributes.title, "title", "ASC", relation4, resource_postPgResource, $select);
      },
      POSTS_DISTINCT_COUNT_TITLE_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_post.attributes.title, "title", "DESC", relation4, resource_postPgResource, $select);
      },
      POSTS_DISTINCT_COUNT_UPDATED_AT_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_post.attributes.updated_at, "updated_at", "ASC", relation4, resource_postPgResource, $select);
      },
      POSTS_DISTINCT_COUNT_UPDATED_AT_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_post.attributes.updated_at, "updated_at", "DESC", relation4, resource_postPgResource, $select);
      },
      POSTS_DISTINCT_COUNT_USER_ID_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_post.attributes.user_id, "user_id", "ASC", relation4, resource_postPgResource, $select);
      },
      POSTS_DISTINCT_COUNT_USER_ID_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_post.attributes.user_id, "user_id", "DESC", relation4, resource_postPgResource, $select);
      },
      POSTS_MAX_NUMBER_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_max, spec_post.attributes.number, "number", "ASC", relation4, resource_postPgResource, $select);
      },
      POSTS_MAX_NUMBER_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_max, spec_post.attributes.number, "number", "DESC", relation4, resource_postPgResource, $select);
      },
      POSTS_MIN_NUMBER_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_min, spec_post.attributes.number, "number", "ASC", relation4, resource_postPgResource, $select);
      },
      POSTS_MIN_NUMBER_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_min, spec_post.attributes.number, "number", "DESC", relation4, resource_postPgResource, $select);
      },
      POSTS_STDDEV_POPULATION_NUMBER_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_stddevPopulation, spec_post.attributes.number, "number", "ASC", relation4, resource_postPgResource, $select);
      },
      POSTS_STDDEV_POPULATION_NUMBER_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_stddevPopulation, spec_post.attributes.number, "number", "DESC", relation4, resource_postPgResource, $select);
      },
      POSTS_STDDEV_SAMPLE_NUMBER_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_stddevSample, spec_post.attributes.number, "number", "ASC", relation4, resource_postPgResource, $select);
      },
      POSTS_STDDEV_SAMPLE_NUMBER_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_stddevSample, spec_post.attributes.number, "number", "DESC", relation4, resource_postPgResource, $select);
      },
      POSTS_SUM_NUMBER_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_sum, spec_post.attributes.number, "number", "ASC", relation4, resource_postPgResource, $select);
      },
      POSTS_SUM_NUMBER_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_sum, spec_post.attributes.number, "number", "DESC", relation4, resource_postPgResource, $select);
      },
      POSTS_VARIANCE_POPULATION_NUMBER_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_variancePopulation, spec_post.attributes.number, "number", "ASC", relation4, resource_postPgResource, $select);
      },
      POSTS_VARIANCE_POPULATION_NUMBER_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_variancePopulation, spec_post.attributes.number, "number", "DESC", relation4, resource_postPgResource, $select);
      },
      POSTS_VARIANCE_SAMPLE_NUMBER_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_varianceSample, spec_post.attributes.number, "number", "ASC", relation4, resource_postPgResource, $select);
      },
      POSTS_VARIANCE_SAMPLE_NUMBER_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_varianceSample, spec_post.attributes.number, "number", "DESC", relation4, resource_postPgResource, $select);
      },
      PRIMARY_KEY_ASC(queryBuilder) {
        status_templateUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "ASC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      PRIMARY_KEY_DESC(queryBuilder) {
        status_templateUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "DESC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      PROJECT_STATUS_CONFIGS_AVERAGE_SORT_ORDER_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_average, spec_projectStatusConfig.attributes.sort_order, "sort_order", "ASC", relation5, resource_project_status_configPgResource, $select);
      },
      PROJECT_STATUS_CONFIGS_AVERAGE_SORT_ORDER_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_average, spec_projectStatusConfig.attributes.sort_order, "sort_order", "DESC", relation5, resource_project_status_configPgResource, $select);
      },
      PROJECT_STATUS_CONFIGS_COUNT_ASC($select) {
        pgAggregatesApplyOrderByTotalCount("ASC", relation5, resource_project_status_configPgResource, $select);
      },
      PROJECT_STATUS_CONFIGS_COUNT_DESC($select) {
        pgAggregatesApplyOrderByTotalCount("DESC", relation5, resource_project_status_configPgResource, $select);
      },
      PROJECT_STATUS_CONFIGS_DISTINCT_COUNT_CREATED_AT_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_projectStatusConfig.attributes.created_at, "created_at", "ASC", relation5, resource_project_status_configPgResource, $select);
      },
      PROJECT_STATUS_CONFIGS_DISTINCT_COUNT_CREATED_AT_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_projectStatusConfig.attributes.created_at, "created_at", "DESC", relation5, resource_project_status_configPgResource, $select);
      },
      PROJECT_STATUS_CONFIGS_DISTINCT_COUNT_CUSTOM_COLOR_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_projectStatusConfig.attributes.custom_color, "custom_color", "ASC", relation5, resource_project_status_configPgResource, $select);
      },
      PROJECT_STATUS_CONFIGS_DISTINCT_COUNT_CUSTOM_COLOR_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_projectStatusConfig.attributes.custom_color, "custom_color", "DESC", relation5, resource_project_status_configPgResource, $select);
      },
      PROJECT_STATUS_CONFIGS_DISTINCT_COUNT_CUSTOM_DESCRIPTION_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_projectStatusConfig.attributes.custom_description, "custom_description", "ASC", relation5, resource_project_status_configPgResource, $select);
      },
      PROJECT_STATUS_CONFIGS_DISTINCT_COUNT_CUSTOM_DESCRIPTION_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_projectStatusConfig.attributes.custom_description, "custom_description", "DESC", relation5, resource_project_status_configPgResource, $select);
      },
      PROJECT_STATUS_CONFIGS_DISTINCT_COUNT_IS_DEFAULT_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_projectStatusConfig.attributes.is_default, "is_default", "ASC", relation5, resource_project_status_configPgResource, $select);
      },
      PROJECT_STATUS_CONFIGS_DISTINCT_COUNT_IS_DEFAULT_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_projectStatusConfig.attributes.is_default, "is_default", "DESC", relation5, resource_project_status_configPgResource, $select);
      },
      PROJECT_STATUS_CONFIGS_DISTINCT_COUNT_IS_ENABLED_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_projectStatusConfig.attributes.is_enabled, "is_enabled", "ASC", relation5, resource_project_status_configPgResource, $select);
      },
      PROJECT_STATUS_CONFIGS_DISTINCT_COUNT_IS_ENABLED_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_projectStatusConfig.attributes.is_enabled, "is_enabled", "DESC", relation5, resource_project_status_configPgResource, $select);
      },
      PROJECT_STATUS_CONFIGS_DISTINCT_COUNT_PROJECT_ID_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_projectStatusConfig.attributes.project_id, "project_id", "ASC", relation5, resource_project_status_configPgResource, $select);
      },
      PROJECT_STATUS_CONFIGS_DISTINCT_COUNT_PROJECT_ID_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_projectStatusConfig.attributes.project_id, "project_id", "DESC", relation5, resource_project_status_configPgResource, $select);
      },
      PROJECT_STATUS_CONFIGS_DISTINCT_COUNT_ROW_ID_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_projectStatusConfig.attributes.id, "id", "ASC", relation5, resource_project_status_configPgResource, $select);
      },
      PROJECT_STATUS_CONFIGS_DISTINCT_COUNT_ROW_ID_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_projectStatusConfig.attributes.id, "id", "DESC", relation5, resource_project_status_configPgResource, $select);
      },
      PROJECT_STATUS_CONFIGS_DISTINCT_COUNT_SORT_ORDER_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_projectStatusConfig.attributes.sort_order, "sort_order", "ASC", relation5, resource_project_status_configPgResource, $select);
      },
      PROJECT_STATUS_CONFIGS_DISTINCT_COUNT_SORT_ORDER_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_projectStatusConfig.attributes.sort_order, "sort_order", "DESC", relation5, resource_project_status_configPgResource, $select);
      },
      PROJECT_STATUS_CONFIGS_DISTINCT_COUNT_STATUS_TEMPLATE_ID_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_projectStatusConfig.attributes.status_template_id, "status_template_id", "ASC", relation5, resource_project_status_configPgResource, $select);
      },
      PROJECT_STATUS_CONFIGS_DISTINCT_COUNT_STATUS_TEMPLATE_ID_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_projectStatusConfig.attributes.status_template_id, "status_template_id", "DESC", relation5, resource_project_status_configPgResource, $select);
      },
      PROJECT_STATUS_CONFIGS_MAX_SORT_ORDER_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_max, spec_projectStatusConfig.attributes.sort_order, "sort_order", "ASC", relation5, resource_project_status_configPgResource, $select);
      },
      PROJECT_STATUS_CONFIGS_MAX_SORT_ORDER_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_max, spec_projectStatusConfig.attributes.sort_order, "sort_order", "DESC", relation5, resource_project_status_configPgResource, $select);
      },
      PROJECT_STATUS_CONFIGS_MIN_SORT_ORDER_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_min, spec_projectStatusConfig.attributes.sort_order, "sort_order", "ASC", relation5, resource_project_status_configPgResource, $select);
      },
      PROJECT_STATUS_CONFIGS_MIN_SORT_ORDER_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_min, spec_projectStatusConfig.attributes.sort_order, "sort_order", "DESC", relation5, resource_project_status_configPgResource, $select);
      },
      PROJECT_STATUS_CONFIGS_STDDEV_POPULATION_SORT_ORDER_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_stddevPopulation, spec_projectStatusConfig.attributes.sort_order, "sort_order", "ASC", relation5, resource_project_status_configPgResource, $select);
      },
      PROJECT_STATUS_CONFIGS_STDDEV_POPULATION_SORT_ORDER_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_stddevPopulation, spec_projectStatusConfig.attributes.sort_order, "sort_order", "DESC", relation5, resource_project_status_configPgResource, $select);
      },
      PROJECT_STATUS_CONFIGS_STDDEV_SAMPLE_SORT_ORDER_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_stddevSample, spec_projectStatusConfig.attributes.sort_order, "sort_order", "ASC", relation5, resource_project_status_configPgResource, $select);
      },
      PROJECT_STATUS_CONFIGS_STDDEV_SAMPLE_SORT_ORDER_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_stddevSample, spec_projectStatusConfig.attributes.sort_order, "sort_order", "DESC", relation5, resource_project_status_configPgResource, $select);
      },
      PROJECT_STATUS_CONFIGS_SUM_SORT_ORDER_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_sum, spec_projectStatusConfig.attributes.sort_order, "sort_order", "ASC", relation5, resource_project_status_configPgResource, $select);
      },
      PROJECT_STATUS_CONFIGS_SUM_SORT_ORDER_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_sum, spec_projectStatusConfig.attributes.sort_order, "sort_order", "DESC", relation5, resource_project_status_configPgResource, $select);
      },
      PROJECT_STATUS_CONFIGS_VARIANCE_POPULATION_SORT_ORDER_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_variancePopulation, spec_projectStatusConfig.attributes.sort_order, "sort_order", "ASC", relation5, resource_project_status_configPgResource, $select);
      },
      PROJECT_STATUS_CONFIGS_VARIANCE_POPULATION_SORT_ORDER_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_variancePopulation, spec_projectStatusConfig.attributes.sort_order, "sort_order", "DESC", relation5, resource_project_status_configPgResource, $select);
      },
      PROJECT_STATUS_CONFIGS_VARIANCE_SAMPLE_SORT_ORDER_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_varianceSample, spec_projectStatusConfig.attributes.sort_order, "sort_order", "ASC", relation5, resource_project_status_configPgResource, $select);
      },
      PROJECT_STATUS_CONFIGS_VARIANCE_SAMPLE_SORT_ORDER_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_varianceSample, spec_projectStatusConfig.attributes.sort_order, "sort_order", "DESC", relation5, resource_project_status_configPgResource, $select);
      },
      ROW_ID_ASC: PostOrderBy_ROW_ID_ASCApply,
      ROW_ID_DESC: PostOrderBy_ROW_ID_DESCApply,
      SORT_ORDER_ASC: ProjectStatusConfigOrderBy_SORT_ORDER_ASCApply,
      SORT_ORDER_DESC: ProjectStatusConfigOrderBy_SORT_ORDER_DESCApply,
      UPDATED_AT_ASC: PostOrderBy_UPDATED_AT_ASCApply,
      UPDATED_AT_DESC: PostOrderBy_UPDATED_AT_DESCApply
    }
  },
  UserGroupBy: {
    values: {
      AVATAR_URL($pgSelect) {
        applyGroupByAttribute("avatar_url", TYPES.text, $pgSelect);
      },
      CREATED_AT: PostGroupBy_CREATED_ATApply,
      CREATED_AT_TRUNCATED_TO_DAY: PostGroupBy_CREATED_AT_TRUNCATED_TO_DAYApply,
      CREATED_AT_TRUNCATED_TO_HOUR: PostGroupBy_CREATED_AT_TRUNCATED_TO_HOURApply,
      NAME: StatusTemplateGroupBy_NAMEApply,
      UPDATED_AT: PostGroupBy_UPDATED_ATApply,
      UPDATED_AT_TRUNCATED_TO_DAY: PostGroupBy_UPDATED_AT_TRUNCATED_TO_DAYApply,
      UPDATED_AT_TRUNCATED_TO_HOUR: PostGroupBy_UPDATED_AT_TRUNCATED_TO_HOURApply
    }
  },
  UserOrderBy: {
    values: {
      AVATAR_URL_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "avatar_url",
          direction: "ASC"
        });
      },
      AVATAR_URL_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "avatar_url",
          direction: "DESC"
        });
      },
      COMMENTS_COUNT_ASC($select) {
        pgAggregatesApplyOrderByTotalCount("ASC", relation6, resource_commentPgResource, $select);
      },
      COMMENTS_COUNT_DESC($select) {
        pgAggregatesApplyOrderByTotalCount("DESC", relation6, resource_commentPgResource, $select);
      },
      COMMENTS_DISTINCT_COUNT_CREATED_AT_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_comment.attributes.created_at, "created_at", "ASC", relation6, resource_commentPgResource, $select);
      },
      COMMENTS_DISTINCT_COUNT_CREATED_AT_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_comment.attributes.created_at, "created_at", "DESC", relation6, resource_commentPgResource, $select);
      },
      COMMENTS_DISTINCT_COUNT_MESSAGE_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_comment.attributes.message, "message", "ASC", relation6, resource_commentPgResource, $select);
      },
      COMMENTS_DISTINCT_COUNT_MESSAGE_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_comment.attributes.message, "message", "DESC", relation6, resource_commentPgResource, $select);
      },
      COMMENTS_DISTINCT_COUNT_PARENT_ID_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_comment.attributes.parent_id, "parent_id", "ASC", relation6, resource_commentPgResource, $select);
      },
      COMMENTS_DISTINCT_COUNT_PARENT_ID_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_comment.attributes.parent_id, "parent_id", "DESC", relation6, resource_commentPgResource, $select);
      },
      COMMENTS_DISTINCT_COUNT_POST_ID_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_comment.attributes.post_id, "post_id", "ASC", relation6, resource_commentPgResource, $select);
      },
      COMMENTS_DISTINCT_COUNT_POST_ID_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_comment.attributes.post_id, "post_id", "DESC", relation6, resource_commentPgResource, $select);
      },
      COMMENTS_DISTINCT_COUNT_ROW_ID_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_comment.attributes.id, "id", "ASC", relation6, resource_commentPgResource, $select);
      },
      COMMENTS_DISTINCT_COUNT_ROW_ID_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_comment.attributes.id, "id", "DESC", relation6, resource_commentPgResource, $select);
      },
      COMMENTS_DISTINCT_COUNT_UPDATED_AT_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_comment.attributes.updated_at, "updated_at", "ASC", relation6, resource_commentPgResource, $select);
      },
      COMMENTS_DISTINCT_COUNT_UPDATED_AT_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_comment.attributes.updated_at, "updated_at", "DESC", relation6, resource_commentPgResource, $select);
      },
      COMMENTS_DISTINCT_COUNT_USER_ID_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_comment.attributes.user_id, "user_id", "ASC", relation6, resource_commentPgResource, $select);
      },
      COMMENTS_DISTINCT_COUNT_USER_ID_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_comment.attributes.user_id, "user_id", "DESC", relation6, resource_commentPgResource, $select);
      },
      CREATED_AT_ASC: PostOrderBy_CREATED_AT_ASCApply,
      CREATED_AT_DESC: PostOrderBy_CREATED_AT_DESCApply,
      EMAIL_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "email",
          direction: "ASC"
        });
        queryBuilder.setOrderIsUnique();
      },
      EMAIL_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "email",
          direction: "DESC"
        });
        queryBuilder.setOrderIsUnique();
      },
      IDENTITY_PROVIDER_ID_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "identity_provider_id",
          direction: "ASC"
        });
        queryBuilder.setOrderIsUnique();
      },
      IDENTITY_PROVIDER_ID_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "identity_provider_id",
          direction: "DESC"
        });
        queryBuilder.setOrderIsUnique();
      },
      NAME_ASC: StatusTemplateOrderBy_NAME_ASCApply,
      NAME_DESC: StatusTemplateOrderBy_NAME_DESCApply,
      POSTS_AVERAGE_NUMBER_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_average, spec_post.attributes.number, "number", "ASC", relation7, resource_postPgResource, $select);
      },
      POSTS_AVERAGE_NUMBER_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_average, spec_post.attributes.number, "number", "DESC", relation7, resource_postPgResource, $select);
      },
      POSTS_COUNT_ASC($select) {
        pgAggregatesApplyOrderByTotalCount("ASC", relation7, resource_postPgResource, $select);
      },
      POSTS_COUNT_DESC($select) {
        pgAggregatesApplyOrderByTotalCount("DESC", relation7, resource_postPgResource, $select);
      },
      POSTS_DISTINCT_COUNT_CREATED_AT_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_post.attributes.created_at, "created_at", "ASC", relation7, resource_postPgResource, $select);
      },
      POSTS_DISTINCT_COUNT_CREATED_AT_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_post.attributes.created_at, "created_at", "DESC", relation7, resource_postPgResource, $select);
      },
      POSTS_DISTINCT_COUNT_DESCRIPTION_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_post.attributes.description, "description", "ASC", relation7, resource_postPgResource, $select);
      },
      POSTS_DISTINCT_COUNT_DESCRIPTION_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_post.attributes.description, "description", "DESC", relation7, resource_postPgResource, $select);
      },
      POSTS_DISTINCT_COUNT_NUMBER_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_post.attributes.number, "number", "ASC", relation7, resource_postPgResource, $select);
      },
      POSTS_DISTINCT_COUNT_NUMBER_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_post.attributes.number, "number", "DESC", relation7, resource_postPgResource, $select);
      },
      POSTS_DISTINCT_COUNT_PROJECT_ID_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_post.attributes.project_id, "project_id", "ASC", relation7, resource_postPgResource, $select);
      },
      POSTS_DISTINCT_COUNT_PROJECT_ID_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_post.attributes.project_id, "project_id", "DESC", relation7, resource_postPgResource, $select);
      },
      POSTS_DISTINCT_COUNT_ROW_ID_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_post.attributes.id, "id", "ASC", relation7, resource_postPgResource, $select);
      },
      POSTS_DISTINCT_COUNT_ROW_ID_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_post.attributes.id, "id", "DESC", relation7, resource_postPgResource, $select);
      },
      POSTS_DISTINCT_COUNT_STATUS_TEMPLATE_ID_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_post.attributes.status_template_id, "status_template_id", "ASC", relation7, resource_postPgResource, $select);
      },
      POSTS_DISTINCT_COUNT_STATUS_TEMPLATE_ID_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_post.attributes.status_template_id, "status_template_id", "DESC", relation7, resource_postPgResource, $select);
      },
      POSTS_DISTINCT_COUNT_STATUS_UPDATED_AT_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_post.attributes.status_updated_at, "status_updated_at", "ASC", relation7, resource_postPgResource, $select);
      },
      POSTS_DISTINCT_COUNT_STATUS_UPDATED_AT_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_post.attributes.status_updated_at, "status_updated_at", "DESC", relation7, resource_postPgResource, $select);
      },
      POSTS_DISTINCT_COUNT_TITLE_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_post.attributes.title, "title", "ASC", relation7, resource_postPgResource, $select);
      },
      POSTS_DISTINCT_COUNT_TITLE_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_post.attributes.title, "title", "DESC", relation7, resource_postPgResource, $select);
      },
      POSTS_DISTINCT_COUNT_UPDATED_AT_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_post.attributes.updated_at, "updated_at", "ASC", relation7, resource_postPgResource, $select);
      },
      POSTS_DISTINCT_COUNT_UPDATED_AT_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_post.attributes.updated_at, "updated_at", "DESC", relation7, resource_postPgResource, $select);
      },
      POSTS_DISTINCT_COUNT_USER_ID_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_post.attributes.user_id, "user_id", "ASC", relation7, resource_postPgResource, $select);
      },
      POSTS_DISTINCT_COUNT_USER_ID_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_post.attributes.user_id, "user_id", "DESC", relation7, resource_postPgResource, $select);
      },
      POSTS_MAX_NUMBER_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_max, spec_post.attributes.number, "number", "ASC", relation7, resource_postPgResource, $select);
      },
      POSTS_MAX_NUMBER_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_max, spec_post.attributes.number, "number", "DESC", relation7, resource_postPgResource, $select);
      },
      POSTS_MIN_NUMBER_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_min, spec_post.attributes.number, "number", "ASC", relation7, resource_postPgResource, $select);
      },
      POSTS_MIN_NUMBER_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_min, spec_post.attributes.number, "number", "DESC", relation7, resource_postPgResource, $select);
      },
      POSTS_STDDEV_POPULATION_NUMBER_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_stddevPopulation, spec_post.attributes.number, "number", "ASC", relation7, resource_postPgResource, $select);
      },
      POSTS_STDDEV_POPULATION_NUMBER_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_stddevPopulation, spec_post.attributes.number, "number", "DESC", relation7, resource_postPgResource, $select);
      },
      POSTS_STDDEV_SAMPLE_NUMBER_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_stddevSample, spec_post.attributes.number, "number", "ASC", relation7, resource_postPgResource, $select);
      },
      POSTS_STDDEV_SAMPLE_NUMBER_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_stddevSample, spec_post.attributes.number, "number", "DESC", relation7, resource_postPgResource, $select);
      },
      POSTS_SUM_NUMBER_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_sum, spec_post.attributes.number, "number", "ASC", relation7, resource_postPgResource, $select);
      },
      POSTS_SUM_NUMBER_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_sum, spec_post.attributes.number, "number", "DESC", relation7, resource_postPgResource, $select);
      },
      POSTS_VARIANCE_POPULATION_NUMBER_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_variancePopulation, spec_post.attributes.number, "number", "ASC", relation7, resource_postPgResource, $select);
      },
      POSTS_VARIANCE_POPULATION_NUMBER_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_variancePopulation, spec_post.attributes.number, "number", "DESC", relation7, resource_postPgResource, $select);
      },
      POSTS_VARIANCE_SAMPLE_NUMBER_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_varianceSample, spec_post.attributes.number, "number", "ASC", relation7, resource_postPgResource, $select);
      },
      POSTS_VARIANCE_SAMPLE_NUMBER_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_varianceSample, spec_post.attributes.number, "number", "DESC", relation7, resource_postPgResource, $select);
      },
      PRIMARY_KEY_ASC(queryBuilder) {
        userUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "ASC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      PRIMARY_KEY_DESC(queryBuilder) {
        userUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "DESC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      ROW_ID_ASC: PostOrderBy_ROW_ID_ASCApply,
      ROW_ID_DESC: PostOrderBy_ROW_ID_DESCApply,
      UPDATED_AT_ASC: PostOrderBy_UPDATED_AT_ASCApply,
      UPDATED_AT_DESC: PostOrderBy_UPDATED_AT_DESCApply,
      USERNAME_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "username",
          direction: "ASC"
        });
        queryBuilder.setOrderIsUnique();
      },
      USERNAME_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "username",
          direction: "DESC"
        });
        queryBuilder.setOrderIsUnique();
      },
      VOTES_COUNT_ASC($select) {
        pgAggregatesApplyOrderByTotalCount("ASC", relation8, resource_votePgResource, $select);
      },
      VOTES_COUNT_DESC($select) {
        pgAggregatesApplyOrderByTotalCount("DESC", relation8, resource_votePgResource, $select);
      },
      VOTES_DISTINCT_COUNT_CREATED_AT_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_vote.attributes.created_at, "created_at", "ASC", relation8, resource_votePgResource, $select);
      },
      VOTES_DISTINCT_COUNT_CREATED_AT_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_vote.attributes.created_at, "created_at", "DESC", relation8, resource_votePgResource, $select);
      },
      VOTES_DISTINCT_COUNT_POST_ID_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_vote.attributes.post_id, "post_id", "ASC", relation8, resource_votePgResource, $select);
      },
      VOTES_DISTINCT_COUNT_POST_ID_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_vote.attributes.post_id, "post_id", "DESC", relation8, resource_votePgResource, $select);
      },
      VOTES_DISTINCT_COUNT_ROW_ID_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_vote.attributes.id, "id", "ASC", relation8, resource_votePgResource, $select);
      },
      VOTES_DISTINCT_COUNT_ROW_ID_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_vote.attributes.id, "id", "DESC", relation8, resource_votePgResource, $select);
      },
      VOTES_DISTINCT_COUNT_UPDATED_AT_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_vote.attributes.updated_at, "updated_at", "ASC", relation8, resource_votePgResource, $select);
      },
      VOTES_DISTINCT_COUNT_UPDATED_AT_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_vote.attributes.updated_at, "updated_at", "DESC", relation8, resource_votePgResource, $select);
      },
      VOTES_DISTINCT_COUNT_USER_ID_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_vote.attributes.user_id, "user_id", "ASC", relation8, resource_votePgResource, $select);
      },
      VOTES_DISTINCT_COUNT_USER_ID_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_vote.attributes.user_id, "user_id", "DESC", relation8, resource_votePgResource, $select);
      },
      VOTES_DISTINCT_COUNT_VOTE_TYPE_ASC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_vote.attributes.vote_type, "vote_type", "ASC", relation8, resource_votePgResource, $select);
      },
      VOTES_DISTINCT_COUNT_VOTE_TYPE_DESC($select) {
        pgAggregatesApplyOrderByAttribute(pgAggregateSpec_distinctCount, spec_vote.attributes.vote_type, "vote_type", "DESC", relation8, resource_votePgResource, $select);
      }
    }
  },
  VoteGroupBy: {
    values: {
      CREATED_AT: PostGroupBy_CREATED_ATApply,
      CREATED_AT_TRUNCATED_TO_DAY: PostGroupBy_CREATED_AT_TRUNCATED_TO_DAYApply,
      CREATED_AT_TRUNCATED_TO_HOUR: PostGroupBy_CREATED_AT_TRUNCATED_TO_HOURApply,
      POST_ID: CommentGroupBy_POST_IDApply,
      UPDATED_AT: PostGroupBy_UPDATED_ATApply,
      UPDATED_AT_TRUNCATED_TO_DAY: PostGroupBy_UPDATED_AT_TRUNCATED_TO_DAYApply,
      UPDATED_AT_TRUNCATED_TO_HOUR: PostGroupBy_UPDATED_AT_TRUNCATED_TO_HOURApply,
      USER_ID: PostGroupBy_USER_IDApply,
      VOTE_TYPE($pgSelect) {
        applyGroupByAttribute("vote_type", voteTypeCodec, $pgSelect);
      }
    }
  },
  VoteOrderBy: {
    values: {
      CREATED_AT_ASC: PostOrderBy_CREATED_AT_ASCApply,
      CREATED_AT_DESC: PostOrderBy_CREATED_AT_DESCApply,
      POST_ID_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "post_id",
          direction: "ASC"
        });
        queryBuilder.setOrderIsUnique();
      },
      POST_ID_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "post_id",
          direction: "DESC"
        });
        queryBuilder.setOrderIsUnique();
      },
      PRIMARY_KEY_ASC(queryBuilder) {
        voteUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "ASC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      PRIMARY_KEY_DESC(queryBuilder) {
        voteUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "DESC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      ROW_ID_ASC: PostOrderBy_ROW_ID_ASCApply,
      ROW_ID_DESC: PostOrderBy_ROW_ID_DESCApply,
      UPDATED_AT_ASC: PostOrderBy_UPDATED_AT_ASCApply,
      UPDATED_AT_DESC: PostOrderBy_UPDATED_AT_DESCApply,
      USER_ID_ASC: PostOrderBy_USER_ID_ASCApply,
      USER_ID_DESC: PostOrderBy_USER_ID_DESCApply
    }
  }
};
export const schema = makeGrafastSchema({
  typeDefs: typeDefs,
  objects: objects,
  interfaces: interfaces,
  inputObjects: inputObjects,
  scalars: scalars,
  enums: enums
});