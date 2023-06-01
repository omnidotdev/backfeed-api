// @ts-nocheck
import * as Inputs from '../../inputs';
import { defineQuery, defineQueryFunction, defineQueryPrismaObject } from '../../utils';

export const findUniqueProjectQueryObject = defineQueryFunction((t) =>
  defineQueryPrismaObject({
    type: 'Project',
    nullable: true,
    args: { where: t.arg({ type: Inputs.ProjectWhereUniqueInput, required: true }) },
    resolve: async (query, _root, args, _context, _info) =>
      await _context.db.project.findUnique({ where: args.where, ...query }),
  }),
);

export const findUniqueProjectQuery = defineQuery((t) => ({
  findUniqueProject: t.prismaField(findUniqueProjectQueryObject(t)),
}));
