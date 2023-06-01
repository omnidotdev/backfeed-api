// @ts-nocheck
import * as Inputs from '../../inputs';
import { BatchPayload } from '../../objects';
import { defineMutation, defineMutationFunction, defineMutationObject } from '../../utils';

export const updateManyProjectMutationObject = defineMutationFunction((t) =>
  defineMutationObject({
    type: BatchPayload,
    nullable: false,
    args: {
      where: t.arg({ type: Inputs.ProjectWhereInput, required: false }),
      data: t.arg({ type: Inputs.ProjectUpdateManyMutationInput, required: true }),
    },
    resolve: async (_root, args, _context, _info) =>
      await _context.db.project.updateMany({ where: args.where || undefined, data: args.data }),
  }),
);

export const updateManyProjectMutation = defineMutation((t) => ({
  updateManyProject: t.field(updateManyProjectMutationObject(t)),
}));
