// @ts-nocheck
import * as Inputs from '../../inputs';
import { BatchPayload } from '../../objects';
import { defineMutation, defineMutationFunction, defineMutationObject } from '../../utils';

export const deleteManyOrganizationMutationObject = defineMutationFunction((t) =>
  defineMutationObject({
    type: BatchPayload,
    nullable: true,
    args: { where: t.arg({ type: Inputs.OrganizationWhereInput, required: true }) },
    resolve: async (_root, args, _context, _info) =>
      await _context.db.organization.deleteMany({ where: args.where }),
  }),
);

export const deleteManyOrganizationMutation = defineMutation((t) => ({
  deleteManyOrganization: t.field(deleteManyOrganizationMutationObject(t)),
}));
