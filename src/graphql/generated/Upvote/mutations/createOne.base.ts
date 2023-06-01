// @ts-nocheck
import * as Inputs from '../../inputs';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const createOneUpvoteMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: 'Upvote',
    nullable: false,
    args: { data: t.arg({ type: Inputs.UpvoteCreateInput, required: true }) },
    resolve: async (query, _root, args, _context, _info) =>
      await _context.db.upvote.create({ data: args.data, ...query }),
  }),
);

export const createOneUpvoteMutation = defineMutation((t) => ({
  createOneUpvote: t.prismaField(createOneUpvoteMutationObject(t)),
}));
