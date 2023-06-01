// @ts-nocheck
import * as Inputs from '../../inputs';
import { defineQuery, defineQueryFunction, defineQueryPrismaObject } from '../../utils';

export const findUniqueOrganizationQueryObject = defineQueryFunction((t) =>
  defineQueryPrismaObject({
    type: 'Organization',
    nullable: true,
    args: { where: t.arg({ type: Inputs.OrganizationWhereUniqueInput, required: true }) },
    resolve: async (query, _root, args, _context, _info) =>
      await _context.db.organization.findUnique({ where: args.where, ...query }),
  }),
);

export const findUniqueOrganizationQuery = defineQuery((t) => ({
  findUniqueOrganization: t.prismaField(findUniqueOrganizationQueryObject(t)),
}));
