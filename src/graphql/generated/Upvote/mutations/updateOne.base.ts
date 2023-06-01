// @ts-nocheck
import * as Inputs from '../../inputs';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const updateOneUpvoteMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: 'Upvote',
    nullable: true,
    args: {
      where: t.arg({ type: Inputs.UpvoteWhereUniqueInput, required: true }),
      data: t.arg({ type: Inputs.UpvoteUpdateInput, required: true }),
    },
    resolve: async (query, _root, args, _context, _info) =>
      await _context.db.upvote.update({ where: args.where, data: args.data, ...query }),
  }),
);

export const updateOneUpvoteMutation = defineMutation((t) => ({
  updateOneUpvote: t.prismaField(updateOneUpvoteMutationObject(t)),
}));
