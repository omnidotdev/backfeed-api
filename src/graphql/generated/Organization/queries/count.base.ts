// @ts-nocheck
import * as Inputs from '../../inputs';
import { defineQuery, defineQueryFunction, defineQueryObject } from '../../utils';

export const countOrganizationQueryObject = defineQueryFunction((t) =>
  defineQueryObject({
    type: 'Int',
    nullable: false,
    args: {
      where: t.arg({ type: Inputs.OrganizationWhereInput, required: false }),
      orderBy: t.arg({ type: [Inputs.OrganizationOrderByWithRelationInput], required: false }),
      cursor: t.arg({ type: Inputs.OrganizationWhereUniqueInput, required: false }),
      take: t.arg({ type: 'Int', required: false }),
      skip: t.arg({ type: 'Int', required: false }),
      distinct: t.arg({ type: [Inputs.OrganizationScalarFieldEnum], required: false }),
    },
    resolve: async (_root, args, _context, _info) =>
      await _context.db.organization.count({
        where: args.where || undefined,
        cursor: args.cursor || undefined,
        take: args.take || undefined,
        distinct: args.distinct || undefined,
        skip: args.skip || undefined,
        orderBy: args.orderBy || undefined,
      }),
  }),
);

export const countOrganizationQuery = defineQuery((t) => ({
  countOrganization: t.field(countOrganizationQueryObject(t)),
}));
