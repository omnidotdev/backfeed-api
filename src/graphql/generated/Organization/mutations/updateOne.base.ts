// @ts-nocheck
import * as Inputs from '../../inputs';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const updateOneOrganizationMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: 'Organization',
    nullable: true,
    args: {
      where: t.arg({ type: Inputs.OrganizationWhereUniqueInput, required: true }),
      data: t.arg({ type: Inputs.OrganizationUpdateInput, required: true }),
    },
    resolve: async (query, _root, args, _context, _info) =>
      await _context.db.organization.update({ where: args.where, data: args.data, ...query }),
  }),
);

export const updateOneOrganizationMutation = defineMutation((t) => ({
  updateOneOrganization: t.prismaField(updateOneOrganizationMutationObject(t)),
}));
