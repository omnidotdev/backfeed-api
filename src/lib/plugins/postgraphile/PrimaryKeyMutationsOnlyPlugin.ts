/**
 * Plugin that restricts the optionality for mutations to only expose those that are linked by a primary key.
 */
const PrimaryKeyMutationsOnlyPlugin: GraphileConfig.Plugin = {
  name: "PrimaryKeyMutationsOnlyPlugin",
  version: "0.0.0",

  gather: {
    hooks: {
      pgIntrospection_introspection(_info, event) {
        const { introspection } = event;
        for (const pgConstraint of introspection.constraints) {
          if (pgConstraint.contype === "u") {
            const tags = pgConstraint.getTags();
            const newBehavior = ["-update", "-delete"];
            if (typeof tags.behavior === "string") {
              newBehavior.push(tags.behavior);
            } else if (Array.isArray(tags.behavior)) {
              newBehavior.push(...(tags.behavior as string[]));
            }
            tags.behavior = newBehavior;
          }
        }
      },
    },
  },
};

export default PrimaryKeyMutationsOnlyPlugin;
