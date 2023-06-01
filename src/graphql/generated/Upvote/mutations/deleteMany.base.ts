// @ts-nocheck
import * as Inputs from '../../inputs';
import { BatchPayload } from '../../objects';
import { defineMutation, defineMutationFunction, defineMutationObject } from '../../utils';

export const deleteManyUpvoteMutationObject = defineMutationFunction((t) =>
  defineMutationObject({
    type: BatchPayload,
    nullable: true,
    args: { where: t.arg({ type: Inputs.UpvoteWhereInput, required: true }) },
    resolve: async (_root, args, _context, _info) =>
      await _context.db.upvote.deleteMany({ where: args.where }),
  }),
);

export const deleteManyUpvoteMutation = defineMutation((t) => ({
  deleteManyUpvote: t.field(deleteManyUpvoteMutationObject(t)),
}));
