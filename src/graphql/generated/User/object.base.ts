// @ts-nocheck
import * as Inputs from '../inputs';
import {
  defineExposeObject,
  definePrismaObject,
  defineFieldObject,
  defineRelationFunction,
  defineRelationObject,
} from '../utils';

export const UserObject = definePrismaObject('User', {
  description: undefined,
  findUnique: ({ id }) => ({ id }),
  fields: (t) => ({
    id: t.exposeID('id', UserIdFieldObject),
    createdAt: t.field(UserCreatedAtFieldObject),
    updatedAt: t.field(UserUpdatedAtFieldObject),
    walletAddress: t.exposeString('walletAddress', UserWalletAddressFieldObject),
    Upvote: t.relation('Upvote', UserUpvoteFieldObject(t)),
    Post: t.relation('Post', UserPostFieldObject(t)),
  }),
});

export const UserIdFieldObject = defineExposeObject('String', {
  description: undefined,
  nullable: false,
});

export const UserCreatedAtFieldObject = defineFieldObject('User', {
  type: Inputs.DateTime,
  description: undefined,
  nullable: false,
  resolve: (parent) => parent.createdAt,
});

export const UserUpdatedAtFieldObject = defineFieldObject('User', {
  type: Inputs.DateTime,
  description: undefined,
  nullable: false,
  resolve: (parent) => parent.updatedAt,
});

export const UserWalletAddressFieldObject = defineExposeObject('String', {
  description: undefined,
  nullable: false,
});

export const UserUpvoteFieldObject = defineRelationFunction('User', (t) =>
  defineRelationObject('User', 'Upvote', {
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

export const UserPostFieldObject = defineRelationFunction('User', (t) =>
  defineRelationObject('User', 'Post', {
    description: undefined,
    nullable: false,
    args: {
      where: t.arg({ type: Inputs.PostWhereInput, required: false }),
      orderBy: t.arg({ type: [Inputs.PostOrderByWithRelationInput], required: false }),
      cursor: t.arg({ type: Inputs.PostWhereUniqueInput, required: false }),
      take: t.arg({ type: 'Int', required: false }),
      skip: t.arg({ type: 'Int', required: false }),
      distinct: t.arg({ type: [Inputs.PostScalarFieldEnum], required: false }),
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
