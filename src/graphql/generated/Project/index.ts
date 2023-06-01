// @ts-nocheck
export {
  ProjectObject,
  ProjectIdFieldObject,
  ProjectCreatedAtFieldObject,
  ProjectUpdatedAtFieldObject,
  ProjectNameFieldObject,
  ProjectSlugFieldObject,
  ProjectImageFieldObject,
  ProjectDescriptionFieldObject,
  ProjectOrganizationFieldObject,
  ProjectOrganizationIdFieldObject,
  ProjectPostsFieldObject
} from './object.base';
export {
  createManyProjectMutation,
  createOneProjectMutation,
  deleteManyProjectMutation,
  deleteOneProjectMutation,
  updateManyProjectMutation,
  updateOneProjectMutation,
  upsertOneProjectMutation,
  createManyProjectMutationObject,
  createOneProjectMutationObject,
  deleteManyProjectMutationObject,
  deleteOneProjectMutationObject,
  updateManyProjectMutationObject,
  updateOneProjectMutationObject,
  upsertOneProjectMutationObject
} from './mutations';
export {
  findFirstProjectQuery,
  findManyProjectQuery,
  countProjectQuery,
  findUniqueProjectQuery,
  findFirstProjectQueryObject,
  findManyProjectQueryObject,
  countProjectQueryObject,
  findUniqueProjectQueryObject
} from './queries';
