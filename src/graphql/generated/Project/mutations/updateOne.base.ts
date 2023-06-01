// @ts-nocheck
import * as Inputs from '../../inputs';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const updateOneProjectMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: 'Project',
    nullable: true,
    args: {
      where: t.arg({ type: Inputs.ProjectWhereUniqueInput, required: true }),
      data: t.arg({ type: Inputs.ProjectUpdateInput, required: true }),
    },
    resolve: async (query, _root, args, _context, _info) =>
      await _context.db.project.update({ where: args.where, data: args.data, ...query }),
  }),
);

export const updateOneProjectMutation = defineMutation((t) => ({
  updateOneProject: t.prismaField(updateOneProjectMutationObject(t)),
}));
