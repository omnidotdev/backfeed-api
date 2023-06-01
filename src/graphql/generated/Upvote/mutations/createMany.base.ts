// @ts-nocheck
import * as Inputs from '../../inputs';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const createManyUpvoteMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: ['Upvote'],
    nullable: false,
    args: { data: t.arg({ type: [Inputs.UpvoteCreateInput], required: true }) },
    resolve: async (_query, _root, args, _context, _info) =>
      await _context.db.$transaction(args.data.map((data) => _context.db.upvote.create({ data }))),
  }),
);

export const createManyUpvoteMutation = defineMutation((t) => ({
  createManyUpvote: t.prismaField(createManyUpvoteMutationObject(t)),
}));
