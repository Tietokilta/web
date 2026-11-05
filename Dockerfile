FROM node:24.22.2-alpine@sha256:8a32c8cf649a49915a66e81e7a609223c708d0adabf288ee3f4077d765542f85 AS base
RUN apk add --no-cache libc6-compat

FROM base AS tooling
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
# pnpm 12 is a native binary; Renovate moves this image with packageManager
COPY --from=ghcr.io/pnpm/pnpm:12.16.1-alpine@sha256:3b67e34454e18e4797a50ade3176dde31cec13ad6670f460a81bdf6e1d8b547b /opt/pnpm /opt/pnpm
RUN for bin in pnpm pn pnpx pnx; do ln -s "/opt/pnpm/$bin" "/usr/local/bin/$bin"; done
# renovate: datasource=npm depName=turbo
ARG TURBO_VERSION=2.11.10
RUN npm install --global turbo@${TURBO_VERSION}
WORKDIR /app

FROM tooling AS pruner
COPY . .
RUN turbo prune web --docker

FROM tooling AS builder
# Install only the app's dependencies; source changes can reuse this layer.
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=pruner /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --store-dir=/pnpm/store
COPY --from=pruner /app/out/full/ .

# Commit metadata must not invalidate the dependency installation.
ARG GIT_COMMIT_SHA=development
ENV GIT_COMMIT_SHA=$GIT_COMMIT_SHA
ENV SKIP_ENV_VALIDATION=true
ENV NEXT_OUTPUT=standalone
RUN turbo build --filter=web...

FROM base AS runner
ARG GIT_COMMIT_SHA=development
ENV GIT_COMMIT_SHA=$GIT_COMMIT_SHA
ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000
# Node 24 grows the young generation to 128 MiB, which costs ~100 MiB of RSS
# under load. 16 MiB semi-spaces match Node 22 at the same throughput.
ENV NODE_OPTIONS=--max-semi-space-size=16
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nodejs
WORKDIR /app
# Next.js traces runtime dependencies, avoiding a second production install.
COPY --from=builder --chown=nodejs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nodejs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=nodejs:nodejs /app/apps/web/public ./apps/web/public
USER nodejs
WORKDIR /app/apps/web
EXPOSE 3000
CMD ["node", "server.js"]
