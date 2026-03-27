export default {
  schema: "src/generated/graphql/schema.graphql",
  generate: {
    targets: ["mcp"],
    output: "../backfeed-mcp/src/generated",
    operations: "src/operations/**/*.graphql",
    mcp: {
      name: "backfeed-mcp",
      description:
        "Backfeed user feedback platform. Submit feedback, browse boards, and vote on posts.",
      tools: [
        {
          operation: "projects",
          name: "list_projects",
          description: "List all feedback boards in the organization",
        },
        {
          operation: "createPost",
          name: "submit_feedback",
          description:
            "Submit user feedback to a project board. Requires a project ID and feedback title.",
        },
        {
          operation: "posts",
          name: "list_feedback",
          description:
            "List and search feedback posts on a board. Filter by project, status, or search terms.",
        },
        {
          operation: "createVote",
          name: "vote",
          description:
            "Upvote or downvote a feedback post. Vote type must be 'up' or 'down'.",
        },
      ],
    },
  },
};
