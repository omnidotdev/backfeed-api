// @ts-nocheck
import * as Inputs from '../../inputs';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const updateOnePoolMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: 'Pool',
    nullable: true,
    args: {
      where: t.arg({ type: Inputs.PoolWhereUniqueInput, required: true }),
      data: t.arg({ type: Inputs.PoolUpdateInput, required: true }),
    },
    resolve: async (query, _root, args, _context, _info) =>
      await _context.db.pool.update({ where: args.where, data: args.data, ...query }),
  }),
);

export const updateOnePoolMutation = defineMutation((t) => ({
  updateOnePool: t.prismaField(updateOnePoolMutationObject(t)),
}));
