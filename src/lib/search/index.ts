export { isSearchEnabled } from "lib/config/env.config";
export { initializeSearchIndexes, search } from "./client";
export {
  deletePostFromIndex,
  deleteProjectFromIndex,
  indexPost,
  indexProject,
} from "./indexing";
