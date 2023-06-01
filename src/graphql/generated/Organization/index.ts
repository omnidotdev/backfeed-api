// @ts-nocheck
export {
  OrganizationObject,
  OrganizationIdFieldObject,
  OrganizationCreatedAtFieldObject,
  OrganizationUpdatedAtFieldObject,
  OrganizationNameFieldObject,
  OrganizationSlugFieldObject,
  OrganizationProjectsFieldObject
} from './object.base';
export {
  createManyOrganizationMutation,
  createOneOrganizationMutation,
  deleteManyOrganizationMutation,
  deleteOneOrganizationMutation,
  updateManyOrganizationMutation,
  updateOneOrganizationMutation,
  upsertOneOrganizationMutation,
  createManyOrganizationMutationObject,
  createOneOrganizationMutationObject,
  deleteManyOrganizationMutationObject,
  deleteOneOrganizationMutationObject,
  updateManyOrganizationMutationObject,
  updateOneOrganizationMutationObject,
  upsertOneOrganizationMutationObject
} from './mutations';
export {
  findFirstOrganizationQuery,
  findManyOrganizationQuery,
  countOrganizationQuery,
  findUniqueOrganizationQuery,
  findFirstOrganizationQueryObject,
  findManyOrganizationQueryObject,
  countOrganizationQueryObject,
  findUniqueOrganizationQueryObject
} from './queries';
