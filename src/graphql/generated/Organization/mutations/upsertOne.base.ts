// @ts-nocheck
import * as Inputs from '../../inputs';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const upsertOneOrganizationMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: 'Organization',
    nullable: false,
    args: {
      where: t.arg({ type: Inputs.OrganizationWhereUniqueInput, required: true }),
      create: t.arg({ type: Inputs.OrganizationCreateInput, required: true }),
      update: t.arg({ type: Inputs.OrganizationUpdateInput, required: true }),
    },
    resolve: async (query, _root, args, _context, _info) =>
      await _context.db.organization.upsert({
        where: args.where,
        create: args.create,
        update: args.update,
        ...query,
      }),
  }),
);

export const upsertOneOrganizationMutation = defineMutation((t) => ({
  upsertOneOrganization: t.prismaField(upsertOneOrganizationMutationObject(t)),
}));
