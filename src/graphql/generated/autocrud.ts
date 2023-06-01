// @ts-nocheck
import { builder } from "graphql/schema";
import * as User from './User';
import * as Organization from './Organization';
import * as Project from './Project';
import * as Post from './Post';
import * as Upvote from './Upvote';
import * as Objects from './objects';

type Model = Objects.Model;

export const Cruds: Record<
  Objects.Model,
  {
    Object: any;
    queries: Record<string, Function>;
    mutations: Record<string, Function>;
  }
> = {
  User: {
    Object: User.UserObject,
    queries: {
      findFirst: User.findFirstUserQueryObject,
      findMany: User.findManyUserQueryObject,
      count: User.countUserQueryObject,
      findUnique: User.findUniqueUserQueryObject,
    },
    mutations: {
      createMany: User.createManyUserMutationObject,
      createOne: User.createOneUserMutationObject,
      deleteMany: User.deleteManyUserMutationObject,
      deleteOne: User.deleteOneUserMutationObject,
      updateMany: User.updateManyUserMutationObject,
      updateOne: User.updateOneUserMutationObject,
      upsertOne: User.upsertOneUserMutationObject,
    },
  },
  Organization: {
    Object: Organization.OrganizationObject,
    queries: {
      findFirst: Organization.findFirstOrganizationQueryObject,
      findMany: Organization.findManyOrganizationQueryObject,
      count: Organization.countOrganizationQueryObject,
      findUnique: Organization.findUniqueOrganizationQueryObject,
    },
    mutations: {
      createMany: Organization.createManyOrganizationMutationObject,
      createOne: Organization.createOneOrganizationMutationObject,
      deleteMany: Organization.deleteManyOrganizationMutationObject,
      deleteOne: Organization.deleteOneOrganizationMutationObject,
      updateMany: Organization.updateManyOrganizationMutationObject,
      updateOne: Organization.updateOneOrganizationMutationObject,
      upsertOne: Organization.upsertOneOrganizationMutationObject,
    },
  },
  Project: {
    Object: Project.ProjectObject,
    queries: {
      findFirst: Project.findFirstProjectQueryObject,
      findMany: Project.findManyProjectQueryObject,
      count: Project.countProjectQueryObject,
      findUnique: Project.findUniqueProjectQueryObject,
    },
    mutations: {
      createMany: Project.createManyProjectMutationObject,
      createOne: Project.createOneProjectMutationObject,
      deleteMany: Project.deleteManyProjectMutationObject,
      deleteOne: Project.deleteOneProjectMutationObject,
      updateMany: Project.updateManyProjectMutationObject,
      updateOne: Project.updateOneProjectMutationObject,
      upsertOne: Project.upsertOneProjectMutationObject,
    },
  },
  Post: {
    Object: Post.PostObject,
    queries: {
      findFirst: Post.findFirstPostQueryObject,
      findMany: Post.findManyPostQueryObject,
      count: Post.countPostQueryObject,
      findUnique: Post.findUniquePostQueryObject,
    },
    mutations: {
      createMany: Post.createManyPostMutationObject,
      createOne: Post.createOnePostMutationObject,
      deleteMany: Post.deleteManyPostMutationObject,
      deleteOne: Post.deleteOnePostMutationObject,
      updateMany: Post.updateManyPostMutationObject,
      updateOne: Post.updateOnePostMutationObject,
      upsertOne: Post.upsertOnePostMutationObject,
    },
  },
  Upvote: {
    Object: Upvote.UpvoteObject,
    queries: {
      findFirst: Upvote.findFirstUpvoteQueryObject,
      findMany: Upvote.findManyUpvoteQueryObject,
      count: Upvote.countUpvoteQueryObject,
      findUnique: Upvote.findUniqueUpvoteQueryObject,
    },
    mutations: {
      createMany: Upvote.createManyUpvoteMutationObject,
      createOne: Upvote.createOneUpvoteMutationObject,
      deleteMany: Upvote.deleteManyUpvoteMutationObject,
      deleteOne: Upvote.deleteOneUpvoteMutationObject,
      updateMany: Upvote.updateManyUpvoteMutationObject,
      updateOne: Upvote.updateOneUpvoteMutationObject,
      upsertOne: Upvote.upsertOneUpvoteMutationObject,
    },
  },
};

const crudEntries = Object.entries(Cruds);

type ResolverType = "Query" | "Mutation";
function generateResolversByType(type: ResolverType, opts?: CrudOptions) {
  return crudEntries
    .filter(([modelName]) => includeModel(modelName, opts))
    .map(([modelName, config]) => {
      const resolverEntries = Object.entries(config[type === "Query" ? "queries" : "mutations"]);

      return resolverEntries.map(([operationName, resolverObjectDefiner]) => {
        const resolverName = operationName + modelName;
        const isntPrismaFieldList = ["count", "deleteMany", "updateMany"];
        const isPrismaField = !isntPrismaFieldList.includes(operationName);

        const getFields = (t: any) => {
          const field = resolverObjectDefiner(t);
          const handledField = opts?.handleResolver
            ? opts.handleResolver({
                field,
                modelName: modelName as Model,
                operationName,
                resolverName,
                t,
                isPrismaField,
                type,
              })
            : field;

          return {
            [resolverName]: isPrismaField
              ? t.prismaField(handledField)
              : t.field(handledField),
          }
        }

        return type === "Query"
          ? builder.queryFields((t) => getFields(t))
          : builder.mutationFields((t) => getFields(t));
      });
    });
}

export function generateAllObjects(opts?: CrudOptions) {
  return crudEntries
    .filter(([md]) => includeModel(md, opts))
    .map(([modelName, { Object }]) => {
      return builder.prismaObject(modelName as Model, Object); // Objects is all imports
    });
}

export function generateAllQueries(opts?: CrudOptions) {
  generateResolversByType("Query", opts);
}

export function generateAllMutations(opts?: CrudOptions) {
  generateResolversByType("Mutation", opts);
}

export function generateAllResolvers(opts?: CrudOptions) {
  generateResolversByType("Mutation", opts);
  generateResolversByType("Query", opts);
}

type CrudOptions = {
  include?: Model[];
  exclude?: Model[];
  /**
   * Caution: This is not type safe
   * Wrap all queries/mutations to override args, run extra code in resolve function (ie: throw errors, logs), apply plugins, etc.
   */
  handleResolver?: (props: {
    modelName: Model;
    field: any;
    operationName: string;
    resolverName: string;
    t: any;
    isPrismaField: boolean;
    type: ResolverType;
  }) => any;
};

const includeModel = (model: string, opts?: CrudOptions): boolean => {
  if (!opts) return true;
  if (opts.include) return opts.include.includes(model as Model);
  if (opts.exclude) return !opts.exclude.includes(model as Model);
  return true;
};

export function generateAllCrud(opts?: CrudOptions) {
  generateAllObjects(opts);
  generateAllQueries(opts);
  generateAllMutations(opts);
}
