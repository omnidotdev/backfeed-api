// @ts-nocheck
import * as Inputs from '../../inputs';
import { defineQuery, defineQueryFunction, defineQueryPrismaObject } from '../../utils';

export const findManyOrganizationQueryObject = defineQueryFunction((t) =>
  defineQueryPrismaObject({
    type: ['Organization'],
    nullable: false,
    args: {
      where: t.arg({ type: Inputs.OrganizationWhereInput, required: false }),
      orderBy: t.arg({ type: [Inputs.OrganizationOrderByWithRelationInput], required: false }),
      cursor: t.arg({ type: Inputs.OrganizationWhereUniqueInput, required: false }),
      take: t.arg({ type: 'Int', required: false }),
      skip: t.arg({ type: 'Int', required: false }),
      distinct: t.arg({ type: [Inputs.OrganizationScalarFieldEnum], required: false }),
    },
    resolve: async (query, _root, args, _context, _info) =>
      await _context.db.organization.findMany({
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

export const findManyOrganizationQuery = defineQuery((t) => ({
  findManyOrganization: t.prismaField(findManyOrganizationQueryObject(t)),
}));
