// @ts-nocheck
export {
  PostObject,
  PostIdFieldObject,
  PostCreatedAtFieldObject,
  PostUpdatedAtFieldObject,
  PostTitleFieldObject,
  PostDescriptionFieldObject,
  PostAuthorIdFieldObject,
  PostAuthorFieldObject,
  PostProjectIdFieldObject,
  PostProjectFieldObject,
  PostUpvotesFieldObject
} from './object.base';
export {
  createManyPostMutation,
  createOnePostMutation,
  deleteManyPostMutation,
  deleteOnePostMutation,
  updateManyPostMutation,
  updateOnePostMutation,
  upsertOnePostMutation,
  createManyPostMutationObject,
  createOnePostMutationObject,
  deleteManyPostMutationObject,
  deleteOnePostMutationObject,
  updateManyPostMutationObject,
  updateOnePostMutationObject,
  upsertOnePostMutationObject
} from './mutations';
export {
  findFirstPostQuery,
  findManyPostQuery,
  countPostQuery,
  findUniquePostQuery,
  findFirstPostQueryObject,
  findManyPostQueryObject,
  countPostQueryObject,
  findUniquePostQueryObject
} from './queries';
