// @ts-nocheck
import * as Inputs from '../inputs';
import {
  defineExposeObject,
  definePrismaObject,
  defineFieldObject,
  defineRelationFunction,
  defineRelationObject,
} from '../utils';

export const PostObject = definePrismaObject('Post', {
  description: undefined,
  findUnique: ({ id }) => ({ id }),
  fields: (t) => ({
    id: t.exposeID('id', PostIdFieldObject),
    createdAt: t.field(PostCreatedAtFieldObject),
    updatedAt: t.field(PostUpdatedAtFieldObject),
    title: t.exposeString('title', PostTitleFieldObject),
    description: t.exposeString('description', PostDescriptionFieldObject),
    authorId: t.exposeString('authorId', PostAuthorIdFieldObject),
    author: t.relation('author', PostAuthorFieldObject),
    projectId: t.exposeString('projectId', PostProjectIdFieldObject),
    project: t.relation('project', PostProjectFieldObject),
    upvotes: t.relation('upvotes', PostUpvotesFieldObject(t)),
  }),
});

export const PostIdFieldObject = defineExposeObject('String', {
  description: undefined,
  nullable: false,
});

export const PostCreatedAtFieldObject = defineFieldObject('Post', {
  type: Inputs.DateTime,
  description: undefined,
  nullable: false,
  resolve: (parent) => parent.createdAt,
});

export const PostUpdatedAtFieldObject = defineFieldObject('Post', {
  type: Inputs.DateTime,
  description: undefined,
  nullable: false,
  resolve: (parent) => parent.updatedAt,
});

export const PostTitleFieldObject = defineExposeObject('String', {
  description: undefined,
  nullable: false,
});

export const PostDescriptionFieldObject = defineExposeObject('String', {
  description: undefined,
  nullable: false,
});

export const PostAuthorIdFieldObject = defineExposeObject('String', {
  description: undefined,
  nullable: false,
});

export const PostAuthorFieldObject = defineRelationObject('Post', 'author', {
  description: undefined,
  nullable: false,
  args: undefined,
  query: undefined,
});

export const PostProjectIdFieldObject = defineExposeObject('String', {
  description: undefined,
  nullable: false,
});

export const PostProjectFieldObject = defineRelationObject('Post', 'project', {
  description: undefined,
  nullable: false,
  args: undefined,
  query: undefined,
});

export const PostUpvotesFieldObject = defineRelationFunction('Post', (t) =>
  defineRelationObject('Post', 'upvotes', {
    description: undefined,
    nullable: false,
    args: {
      where: t.arg({ type: Inputs.UpvoteWhereInput, required: false }),
      orderBy: t.arg({ type: [Inputs.UpvoteOrderByWithRelationInput], required: false }),
      cursor: t.arg({ type: Inputs.UpvoteWhereUniqueInput, required: false }),
      take: t.arg({ type: 'Int', required: false }),
      skip: t.arg({ type: 'Int', required: false }),
      distinct: t.arg({ type: [Inputs.UpvoteScalarFieldEnum], required: false }),
    },
    query: (args) => ({
      where: args.where || undefined,
      cursor: args.cursor || undefined,
      take: args.take || undefined,
      distinct: args.distinct || undefined,
      skip: args.skip || undefined,
      orderBy: args.orderBy || undefined,
    }),
  }),
);
