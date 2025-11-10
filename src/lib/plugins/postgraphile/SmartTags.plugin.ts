import { jsonPgSmartTags } from "postgraphile/utils";

export default jsonPgSmartTags({
  version: 1,
  config: {
    class: {
      organization: {
        attribute: {
          tier: {
            tags: {
              behavior: "-insert -update",
            },
          },
        },
      },
      member: {
        attribute: {
          role: {
            tags: {
              behavior: "+orderBy",
            },
          },
        },
      },
    },
  },
});
