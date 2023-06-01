// @ts-nocheck
import * as Inputs from '../../inputs';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const deleteOneProjectMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: 'Project',
    nullable: true,
    args: { where: t.arg({ type: Inputs.ProjectWhereUniqueInput, required: true }) },
    resolve: async (query, _root, args, _context, _info) =>
      await _context.db.project.delete({ where: args.where, ...query }),
  }),
);

export const deleteOneProjectMutation = defineMutation((t) => ({
  deleteOneProject: t.prismaField(deleteOneProjectMutationObject(t)),
}));
