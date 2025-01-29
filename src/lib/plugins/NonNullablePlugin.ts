import { makeChangeNullabilityPlugin } from "postgraphile/utils";

const NonNullablePlugin = makeChangeNullabilityPlugin({
  OrganizationPatch: {
    rowId: "!",
  },
  ProjectPatch: {
    organizationId: "!",
  },
  PostPatch: {
    projectId: "!",
    userId: "!",
  },
  UpvotePatch: {
    postId: "!",
    userId: "!",
  },
  DownvotePatch: {
    postId: "!",
    userId: "!",
  },
  CommentPatch: {
    postId: "!",
    userId: "!",
  },
});

export default NonNullablePlugin;
