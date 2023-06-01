// @ts-nocheck
import * as Inputs from '../../inputs';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const createManyPoolMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: ['Pool'],
    nullable: false,
    args: { data: t.arg({ type: [Inputs.PoolCreateInput], required: true }) },
    resolve: async (_query, _root, args, _context, _info) =>
      await _context.db.$transaction(args.data.map((data) => _context.db.pool.create({ data }))),
  }),
);

export const createManyPoolMutation = defineMutation((t) => ({
  createManyPool: t.prismaField(createManyPoolMutationObject(t)),
}));
