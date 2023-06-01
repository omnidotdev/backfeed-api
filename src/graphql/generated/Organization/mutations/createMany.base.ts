// @ts-nocheck
import * as Inputs from '../../inputs';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const createManyOrganizationMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: ['Organization'],
    nullable: false,
    args: { data: t.arg({ type: [Inputs.OrganizationCreateInput], required: true }) },
    resolve: async (_query, _root, args, _context, _info) =>
      await _context.db.$transaction(args.data.map((data) => _context.db.organization.create({ data }))),
  }),
);

export const createManyOrganizationMutation = defineMutation((t) => ({
  createManyOrganization: t.prismaField(createManyOrganizationMutationObject(t)),
}));
