# Base image with Bun
ARG BUN_VERSION=1.2
FROM oven/bun:${BUN_VERSION}-alpine AS base
# Update the package list and install libc6-compat. This package is often required for binary Node.js modules.
RUN apk add --no-cache libc6-compat

# Setup turbo
FROM base AS setup
RUN bun install --global turbo

# Install all dependencies in the monorepo
FROM setup AS dependencies
WORKDIR /app
# Copy the essential configuration files and the specific project's files into the Docker image.
COPY packages/ ./packages/
COPY turbo.json ./
COPY package.json turbo.json packages ./
COPY bun.lock ./
# Install dependencies
RUN bun install --frozen-lockfile

# Prune projects to focus on the specified project scope
FROM dependencies AS pruner
COPY apps/web ./apps/web
RUN turbo prune --scope=web --docker
# Remove all empty node_modules folders. This is a cleanup step to remove unnecessary directories and reduce image size.
RUN rm -rf /app/out/full/*/*/node_modules

# Build the project using turbo
FROM setup AS builder
WORKDIR /app

ARG GIT_COMMIT_SHA=development
ENV GIT_COMMIT_SHA=$GIT_COMMIT_SHA

# Copy pruned lockfile and package.json files
COPY --from=pruner /app/out/bun.lock ./bun.lock
COPY --from=pruner /app/out/json/ .

# Install dependencies for the pruned project
RUN --mount=type=cache,id=bun,target=/root/.bun/install/cache bun install

# Copy pruned source code
COPY --from=pruner /app/out/full/ .

# Build with turbo and prune dev dependencies
RUN turbo build --filter=web...
# Reinstall without dev dependencies
RUN --mount=type=cache,id=bun,target=/root/.bun/install/cache rm -rf node_modules && bun install --production
# Remove source files to further reduce the image size, keeping only the compiled output and necessary runtime files.
RUN rm -rf ./**/*/src

# Final production image
FROM base AS runner
ARG PROJECT=web
ARG GIT_COMMIT_SHA=development
ENV GIT_COMMIT_SHA=$GIT_COMMIT_SHA
ENV NODE_ENV=production
# Create a non-root user and group for better security.
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs
# Switch to the non-root user.
USER nodejs

WORKDIR /app
# Copy the entire app directory, including node_modules and built code. This includes all necessary runtime files.
COPY --from=builder --chown=nodejs:nodejs /app .

WORKDIR /app/apps/web
# Specify the command to run the application.
CMD ["bun", "run", "start"]
