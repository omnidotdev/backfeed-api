// @ts-nocheck
import * as Inputs from '../../inputs';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const createOnePoolMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: 'Pool',
    nullable: false,
    args: { data: t.arg({ type: Inputs.PoolCreateInput, required: true }) },
    resolve: async (query, _root, args, _context, _info) =>
      await _context.db.pool.create({ data: args.data, ...query }),
  }),
);

export const createOnePoolMutation = defineMutation((t) => ({
  createOnePool: t.prismaField(createOnePoolMutationObject(t)),
}));
