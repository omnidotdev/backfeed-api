// @ts-nocheck
import * as Inputs from '../../inputs';
import { BatchPayload } from '../../objects';
import { defineMutation, defineMutationFunction, defineMutationObject } from '../../utils';

export const updateManyUpvoteMutationObject = defineMutationFunction((t) =>
  defineMutationObject({
    type: BatchPayload,
    nullable: false,
    args: {
      where: t.arg({ type: Inputs.UpvoteWhereInput, required: false }),
      data: t.arg({ type: Inputs.UpvoteUpdateManyMutationInput, required: true }),
    },
    resolve: async (_root, args, _context, _info) =>
      await _context.db.upvote.updateMany({ where: args.where || undefined, data: args.data }),
  }),
);

export const updateManyUpvoteMutation = defineMutation((t) => ({
  updateManyUpvote: t.field(updateManyUpvoteMutationObject(t)),
}));
