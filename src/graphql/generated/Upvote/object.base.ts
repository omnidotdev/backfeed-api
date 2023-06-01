// @ts-nocheck
import * as Inputs from '../inputs';
import {
  defineExposeObject,
  definePrismaObject,
  defineFieldObject,
  defineRelationFunction,
  defineRelationObject,
} from '../utils';

export const UpvoteObject = definePrismaObject('Upvote', {
  description: undefined,
  findUnique: ({ id }) => ({ id }),
  fields: (t) => ({
    id: t.exposeID('id', UpvoteIdFieldObject),
    createdAt: t.field(UpvoteCreatedAtFieldObject),
    updatedAt: t.field(UpvoteUpdatedAtFieldObject),
    postId: t.exposeString('postId', UpvotePostIdFieldObject),
    post: t.relation('post', UpvotePostFieldObject),
    userId: t.exposeString('userId', UpvoteUserIdFieldObject),
    user: t.relation('user', UpvoteUserFieldObject),
  }),
});

export const UpvoteIdFieldObject = defineExposeObject('String', {
  description: undefined,
  nullable: false,
});

export const UpvoteCreatedAtFieldObject = defineFieldObject('Upvote', {
  type: Inputs.DateTime,
  description: undefined,
  nullable: false,
  resolve: (parent) => parent.createdAt,
});

export const UpvoteUpdatedAtFieldObject = defineFieldObject('Upvote', {
  type: Inputs.DateTime,
  description: undefined,
  nullable: false,
  resolve: (parent) => parent.updatedAt,
});

export const UpvotePostIdFieldObject = defineExposeObject('String', {
  description: undefined,
  nullable: false,
});

export const UpvotePostFieldObject = defineRelationObject('Upvote', 'post', {
  description: undefined,
  nullable: false,
  args: undefined,
  query: undefined,
});

export const UpvoteUserIdFieldObject = defineExposeObject('String', {
  description: undefined,
  nullable: false,
});

export const UpvoteUserFieldObject = defineRelationObject('Upvote', 'user', {
  description: undefined,
  nullable: false,
  args: undefined,
  query: undefined,
});
