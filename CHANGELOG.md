# @omnidotdev/backfeed-api

## 0.0.1

### Patch Changes

- [#122](https://github.com/omnidotdev/backfeed-api/pull/122) [`c5fe843`](https://github.com/omnidotdev/backfeed-api/commit/c5fe843b7afa61d6e2915fc56c9b635805dce714) Thanks [@coopbri](https://github.com/coopbri)! - The production build now runs in production mode, so API errors no longer include internal details and GraphQL runs without development overhead

- [#123](https://github.com/omnidotdev/backfeed-api/pull/123) [`858f3df`](https://github.com/omnidotdev/backfeed-api/commit/858f3dfcd28995be171a1d4e1dc633e8bdaf7444) Thanks [@coopbri](https://github.com/coopbri)! - Workspaces without a provisioned plan now get the advertised Free limits: up to 2 projects and 50 comments per post

- [#118](https://github.com/omnidotdev/backfeed-api/pull/118) [`0e47601`](https://github.com/omnidotdev/backfeed-api/commit/0e476015d357ccebd45936ecd4278ce327e07472) Thanks [@coopbri](https://github.com/coopbri)! - Security: votes, comments and posts can only be created as yourself, and their author can no longer be changed afterwards. Internal authorization sync, reference and clustering records are no longer exposed to GraphQL clients.

- [#119](https://github.com/omnidotdev/backfeed-api/pull/119) [`dbb6aa7`](https://github.com/omnidotdev/backfeed-api/commit/dbb6aa79ef80416e7604a2254b04bd014ebd0ffb) Thanks [@coopbri](https://github.com/coopbri)! - Stop writing users' email addresses to the logs: email sends log only the recipient count and message id, by moving to `@omnidotdev/providers` v0.2.0.

- [#124](https://github.com/omnidotdev/backfeed-api/pull/124) [`3f08dba`](https://github.com/omnidotdev/backfeed-api/commit/3f08dba1135dc59985699995d0b12c6b8ff7c691) Thanks [@coopbri](https://github.com/coopbri)! - Every plan now includes unlimited members and admins. Workspaces without a provisioned plan are no longer limited to 5 members and 1 admin
