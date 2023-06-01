// @ts-nocheck
import * as Inputs from '../../inputs';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const deleteOnePoolMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: 'Pool',
    nullable: true,
    args: { where: t.arg({ type: Inputs.PoolWhereUniqueInput, required: true }) },
    resolve: async (query, _root, args, _context, _info) =>
      await _context.db.pool.delete({ where: args.where, ...query }),
  }),
);

export const deleteOnePoolMutation = defineMutation((t) => ({
  deleteOnePool: t.prismaField(deleteOnePoolMutationObject(t)),
}));
