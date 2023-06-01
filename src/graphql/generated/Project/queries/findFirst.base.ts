// @ts-nocheck
import * as Inputs from '../../inputs';
import { defineQuery, defineQueryFunction, defineQueryPrismaObject } from '../../utils';

export const findFirstProjectQueryObject = defineQueryFunction((t) =>
  defineQueryPrismaObject({
    type: 'Project',
    nullable: true,
    args: {
      where: t.arg({ type: Inputs.ProjectWhereInput, required: false }),
      orderBy: t.arg({ type: [Inputs.ProjectOrderByWithRelationInput], required: false }),
      cursor: t.arg({ type: Inputs.ProjectWhereUniqueInput, required: false }),
      take: t.arg({ type: 'Int', required: false }),
      skip: t.arg({ type: 'Int', required: false }),
      distinct: t.arg({ type: [Inputs.ProjectScalarFieldEnum], required: false }),
    },
    resolve: async (query, _root, args, _context, _info) =>
      await _context.db.project.findFirst({
        where: args.where || undefined,
        cursor: args.cursor || undefined,
        take: args.take || undefined,
        distinct: args.distinct || undefined,
        skip: args.skip || undefined,
        orderBy: args.orderBy || undefined,
        ...query,
      }),
  }),
);

export const findFirstProjectQuery = defineQuery((t) => ({
  findFirstProject: t.prismaField(findFirstProjectQueryObject(t)),
}));
