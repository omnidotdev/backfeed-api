// @ts-nocheck
import * as Inputs from '../../inputs';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const upsertOneProjectMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: 'Project',
    nullable: false,
    args: {
      where: t.arg({ type: Inputs.ProjectWhereUniqueInput, required: true }),
      create: t.arg({ type: Inputs.ProjectCreateInput, required: true }),
      update: t.arg({ type: Inputs.ProjectUpdateInput, required: true }),
    },
    resolve: async (query, _root, args, _context, _info) =>
      await _context.db.project.upsert({
        where: args.where,
        create: args.create,
        update: args.update,
        ...query,
      }),
  }),
);

export const upsertOneProjectMutation = defineMutation((t) => ({
  upsertOneProject: t.prismaField(upsertOneProjectMutationObject(t)),
}));
