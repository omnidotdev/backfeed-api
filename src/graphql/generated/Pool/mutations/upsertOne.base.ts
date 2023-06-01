// @ts-nocheck
import * as Inputs from '../../inputs';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const upsertOnePoolMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: 'Pool',
    nullable: false,
    args: {
      where: t.arg({ type: Inputs.PoolWhereUniqueInput, required: true }),
      create: t.arg({ type: Inputs.PoolCreateInput, required: true }),
      update: t.arg({ type: Inputs.PoolUpdateInput, required: true }),
    },
    resolve: async (query, _root, args, _context, _info) =>
      await _context.db.pool.upsert({
        where: args.where,
        create: args.create,
        update: args.update,
        ...query,
      }),
  }),
);

export const upsertOnePoolMutation = defineMutation((t) => ({
  upsertOnePool: t.prismaField(upsertOnePoolMutationObject(t)),
}));
