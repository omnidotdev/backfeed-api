// @ts-nocheck
import * as Inputs from '../../inputs';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const createOneOrganizationMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: 'Organization',
    nullable: false,
    args: { data: t.arg({ type: Inputs.OrganizationCreateInput, required: true }) },
    resolve: async (query, _root, args, _context, _info) =>
      await _context.db.organization.create({ data: args.data, ...query }),
  }),
);

export const createOneOrganizationMutation = defineMutation((t) => ({
  createOneOrganization: t.prismaField(createOneOrganizationMutationObject(t)),
}));
