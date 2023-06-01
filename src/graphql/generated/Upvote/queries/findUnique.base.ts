// @ts-nocheck
import * as Inputs from '../../inputs';
import { defineQuery, defineQueryFunction, defineQueryPrismaObject } from '../../utils';

export const findUniqueUpvoteQueryObject = defineQueryFunction((t) =>
  defineQueryPrismaObject({
    type: 'Upvote',
    nullable: true,
    args: { where: t.arg({ type: Inputs.UpvoteWhereUniqueInput, required: true }) },
    resolve: async (query, _root, args, _context, _info) =>
      await _context.db.upvote.findUnique({ where: args.where, ...query }),
  }),
);

export const findUniqueUpvoteQuery = defineQuery((t) => ({
  findUniqueUpvote: t.prismaField(findUniqueUpvoteQueryObject(t)),
}));
