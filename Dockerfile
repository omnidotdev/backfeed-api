# syntax=docker/dockerfile:1@sha256:572cebbc2b15e6f84c077742952674889cb63cd5e9b80abdffcbe587b6f19183

FROM oven/bun:1.4.4@sha256:1d22548f177f4ff38e0c15baa3c2c46c6c2060ba2d1bc573bb4720b407548f1d AS base
WORKDIR /app

# Build
FROM base AS builder
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
ARG GIT_SHA
RUN echo "$GIT_SHA" > /app/.git-sha
RUN bun run build
# Guard: bun's bundler can emit an undefined __promiseAll helper for concurrent
# async-module init, crash-looping the server on boot (the 2026-06 aether
# incident). Fail the build before a broken bundle can deploy.
RUN if grep -q '__promiseAll' build/server.js && \
      ! grep -qE '(function|var|let|const) +__promiseAll' build/server.js; then \
      echo 'FATAL: bundle references undefined __promiseAll (bun bundler bug); aborting build'; exit 1; \
    fi
RUN bun run src/scripts/cacheSchemaHash.ts

# Run
FROM base AS runner
ENV NODE_ENV=production

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./
COPY --from=builder /app/tsconfig.json ./
COPY --from=builder /app/src ./src
COPY --from=builder /app/.cache ./.cache
COPY --from=builder /app/.git-sha ./.git-sha

EXPOSE 4000
CMD ["bun", "run", "start"]
