// @ts-nocheck
import * as Inputs from '../../inputs';
import { defineQuery, defineQueryFunction, defineQueryPrismaObject } from '../../utils';

export const findManyPoolQueryObject = defineQueryFunction((t) =>
  defineQueryPrismaObject({
    type: ['Pool'],
    nullable: false,
    args: {
      where: t.arg({ type: Inputs.PoolWhereInput, required: false }),
      orderBy: t.arg({ type: [Inputs.PoolOrderByWithRelationInput], required: false }),
      cursor: t.arg({ type: Inputs.PoolWhereUniqueInput, required: false }),
      take: t.arg({ type: 'Int', required: false }),
      skip: t.arg({ type: 'Int', required: false }),
      distinct: t.arg({ type: [Inputs.PoolScalarFieldEnum], required: false }),
    },
    resolve: async (query, _root, args, _context, _info) =>
      await _context.db.pool.findMany({
        where: args.where || undefined,
        cursor: args.cursor || undefined,
        take: args.take || undefined,
        distinct: args.distinct || undefined,
        skip: args.skip || undefined,
        orderBy: args.orderBy || undefined,
        ...query,
      }),
  }),
);

export const findManyPoolQuery = defineQuery((t) => ({
  findManyPool: t.prismaField(findManyPoolQueryObject(t)),
}));
