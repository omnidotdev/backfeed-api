// @ts-nocheck
import * as Inputs from '../../inputs';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const createOneProjectMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: 'Project',
    nullable: false,
    args: { data: t.arg({ type: Inputs.ProjectCreateInput, required: true }) },
    resolve: async (query, _root, args, _context, _info) =>
      await _context.db.project.create({ data: args.data, ...query }),
  }),
);

export const createOneProjectMutation = defineMutation((t) => ({
  createOneProject: t.prismaField(createOneProjectMutationObject(t)),
}));
