// @ts-nocheck
import * as Inputs from '../../inputs';
import { BatchPayload } from '../../objects';
import { defineMutation, defineMutationFunction, defineMutationObject } from '../../utils';

export const deleteManyPoolMutationObject = defineMutationFunction((t) =>
  defineMutationObject({
    type: BatchPayload,
    nullable: true,
    args: { where: t.arg({ type: Inputs.PoolWhereInput, required: true }) },
    resolve: async (_root, args, _context, _info) =>
      await _context.db.pool.deleteMany({ where: args.where }),
  }),
);

export const deleteManyPoolMutation = defineMutation((t) => ({
  deleteManyPool: t.field(deleteManyPoolMutationObject(t)),
}));
