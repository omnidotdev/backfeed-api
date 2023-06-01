// @ts-nocheck
import * as Inputs from '../../inputs';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const createManyProjectMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: ['Project'],
    nullable: false,
    args: { data: t.arg({ type: [Inputs.ProjectCreateInput], required: true }) },
    resolve: async (_query, _root, args, _context, _info) =>
      await _context.db.$transaction(args.data.map((data) => _context.db.project.create({ data }))),
  }),
);

export const createManyProjectMutation = defineMutation((t) => ({
  createManyProject: t.prismaField(createManyProjectMutationObject(t)),
}));
