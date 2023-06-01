// @ts-nocheck
import * as Inputs from '../../inputs';
import { BatchPayload } from '../../objects';
import { defineMutation, defineMutationFunction, defineMutationObject } from '../../utils';

export const updateManyOrganizationMutationObject = defineMutationFunction((t) =>
  defineMutationObject({
    type: BatchPayload,
    nullable: false,
    args: {
      where: t.arg({ type: Inputs.OrganizationWhereInput, required: false }),
      data: t.arg({ type: Inputs.OrganizationUpdateManyMutationInput, required: true }),
    },
    resolve: async (_root, args, _context, _info) =>
      await _context.db.organization.updateMany({ where: args.where || undefined, data: args.data }),
  }),
);

export const updateManyOrganizationMutation = defineMutation((t) => ({
  updateManyOrganization: t.field(updateManyOrganizationMutationObject(t)),
}));
