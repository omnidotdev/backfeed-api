// @ts-nocheck
import * as Inputs from '../../inputs';
import { BatchPayload } from '../../objects';
import { defineMutation, defineMutationFunction, defineMutationObject } from '../../utils';

export const deleteManyProjectMutationObject = defineMutationFunction((t) =>
  defineMutationObject({
    type: BatchPayload,
    nullable: true,
    args: { where: t.arg({ type: Inputs.ProjectWhereInput, required: true }) },
    resolve: async (_root, args, _context, _info) =>
      await _context.db.project.deleteMany({ where: args.where }),
  }),
);

export const deleteManyProjectMutation = defineMutation((t) => ({
  deleteManyProject: t.field(deleteManyProjectMutationObject(t)),
}));
