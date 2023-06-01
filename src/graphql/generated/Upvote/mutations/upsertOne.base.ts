// @ts-nocheck
import * as Inputs from '../../inputs';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const upsertOneUpvoteMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: 'Upvote',
    nullable: false,
    args: {
      where: t.arg({ type: Inputs.UpvoteWhereUniqueInput, required: true }),
      create: t.arg({ type: Inputs.UpvoteCreateInput, required: true }),
      update: t.arg({ type: Inputs.UpvoteUpdateInput, required: true }),
    },
    resolve: async (query, _root, args, _context, _info) =>
      await _context.db.upvote.upsert({
        where: args.where,
        create: args.create,
        update: args.update,
        ...query,
      }),
  }),
);

export const upsertOneUpvoteMutation = defineMutation((t) => ({
  upsertOneUpvote: t.prismaField(upsertOneUpvoteMutationObject(t)),
}));
