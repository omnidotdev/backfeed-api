// @ts-nocheck
import * as Inputs from '../../inputs';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const deleteOneUpvoteMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: 'Upvote',
    nullable: true,
    args: { where: t.arg({ type: Inputs.UpvoteWhereUniqueInput, required: true }) },
    resolve: async (query, _root, args, _context, _info) =>
      await _context.db.upvote.delete({ where: args.where, ...query }),
  }),
);

export const deleteOneUpvoteMutation = defineMutation((t) => ({
  deleteOneUpvote: t.prismaField(deleteOneUpvoteMutationObject(t)),
}));
