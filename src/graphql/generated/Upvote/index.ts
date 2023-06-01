// @ts-nocheck
export {
  UpvoteObject,
  UpvoteIdFieldObject,
  UpvoteCreatedAtFieldObject,
  UpvoteUpdatedAtFieldObject,
  UpvotePostIdFieldObject,
  UpvotePostFieldObject,
  UpvoteUserIdFieldObject,
  UpvoteUserFieldObject
} from './object.base';
export {
  createManyUpvoteMutation,
  createOneUpvoteMutation,
  deleteManyUpvoteMutation,
  deleteOneUpvoteMutation,
  updateManyUpvoteMutation,
  updateOneUpvoteMutation,
  upsertOneUpvoteMutation,
  createManyUpvoteMutationObject,
  createOneUpvoteMutationObject,
  deleteManyUpvoteMutationObject,
  deleteOneUpvoteMutationObject,
  updateManyUpvoteMutationObject,
  updateOneUpvoteMutationObject,
  upsertOneUpvoteMutationObject
} from './mutations';
export {
  findFirstUpvoteQuery,
  findManyUpvoteQuery,
  countUpvoteQuery,
  findUniqueUpvoteQuery,
  findFirstUpvoteQueryObject,
  findManyUpvoteQueryObject,
  countUpvoteQueryObject,
  findUniqueUpvoteQueryObject
} from './queries';
