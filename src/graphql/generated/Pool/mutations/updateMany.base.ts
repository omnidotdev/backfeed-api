// @ts-nocheck
import * as Inputs from '../../inputs';
import { BatchPayload } from '../../objects';
import { defineMutation, defineMutationFunction, defineMutationObject } from '../../utils';

export const updateManyPoolMutationObject = defineMutationFunction((t) =>
  defineMutationObject({
    type: BatchPayload,
    nullable: false,
    args: {
      where: t.arg({ type: Inputs.PoolWhereInput, required: false }),
      data: t.arg({ type: Inputs.PoolUpdateManyMutationInput, required: true }),
    },
    resolve: async (_root, args, _context, _info) =>
      await _context.db.pool.updateMany({ where: args.where || undefined, data: args.data }),
  }),
);

export const updateManyPoolMutation = defineMutation((t) => ({
  updateManyPool: t.field(updateManyPoolMutationObject(t)),
}));
