// @ts-nocheck
import * as Inputs from '../../inputs';
import { defineQuery, defineQueryFunction, defineQueryObject } from '../../utils';

export const countUpvoteQueryObject = defineQueryFunction((t) =>
  defineQueryObject({
    type: 'Int',
    nullable: false,
    args: {
      where: t.arg({ type: Inputs.UpvoteWhereInput, required: false }),
      orderBy: t.arg({ type: [Inputs.UpvoteOrderByWithRelationInput], required: false }),
      cursor: t.arg({ type: Inputs.UpvoteWhereUniqueInput, required: false }),
      take: t.arg({ type: 'Int', required: false }),
      skip: t.arg({ type: 'Int', required: false }),
      distinct: t.arg({ type: [Inputs.UpvoteScalarFieldEnum], required: false }),
    },
    resolve: async (_root, args, _context, _info) =>
      await _context.db.upvote.count({
        where: args.where || undefined,
        cursor: args.cursor || undefined,
        take: args.take || undefined,
        distinct: args.distinct || undefined,
        skip: args.skip || undefined,
        orderBy: args.orderBy || undefined,
      }),
  }),
);

export const countUpvoteQuery = defineQuery((t) => ({
  countUpvote: t.field(countUpvoteQueryObject(t)),
}));
