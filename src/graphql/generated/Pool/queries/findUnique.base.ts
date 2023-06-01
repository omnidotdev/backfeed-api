// @ts-nocheck
import * as Inputs from '../../inputs';
import { defineQuery, defineQueryFunction, defineQueryPrismaObject } from '../../utils';

export const findUniquePoolQueryObject = defineQueryFunction((t) =>
  defineQueryPrismaObject({
    type: 'Pool',
    nullable: true,
    args: { where: t.arg({ type: Inputs.PoolWhereUniqueInput, required: true }) },
    resolve: async (query, _root, args, _context, _info) =>
      await _context.db.pool.findUnique({ where: args.where, ...query }),
  }),
);

export const findUniquePoolQuery = defineQuery((t) => ({
  findUniquePool: t.prismaField(findUniquePoolQueryObject(t)),
}));
