// @ts-nocheck
import * as Inputs from '../../inputs';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const deleteOneOrganizationMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: 'Organization',
    nullable: true,
    args: { where: t.arg({ type: Inputs.OrganizationWhereUniqueInput, required: true }) },
    resolve: async (query, _root, args, _context, _info) =>
      await _context.db.organization.delete({ where: args.where, ...query }),
  }),
);

export const deleteOneOrganizationMutation = defineMutation((t) => ({
  deleteOneOrganization: t.prismaField(deleteOneOrganizationMutationObject(t)),
}));
