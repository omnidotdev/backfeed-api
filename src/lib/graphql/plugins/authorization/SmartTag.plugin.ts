import { jsonPgSmartTags } from "postgraphile/utils";

/**
 * Smart tag plugin, which controls Postgraphile API surface emission.
 * @see https://postgraphile.org/postgraphile/5/pg-smart-tags
 */
const SmartTagPlugin = jsonPgSmartTags({
  version: 1,
  config: {
    class: {
      post: {
        attribute: {
          // `number` is a per-project sequential identifier assigned by the
          // `assign_post_number` BEFORE INSERT trigger, so it must not be part
          // of the create/update input (the column is NOT NULL with no default,
          // which would otherwise make Postgraphile require it on `createPost`).
          number: {
            tags: { behavior: "-attribute:insert -attribute:update" },
          },
        },
      },
    },
  },
});

export default SmartTagPlugin;
