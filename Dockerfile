# Base image with Node.js
ARG NODE_VERSION=22.7.0
# Use a specific version of the Node.js Alpine image as the base. Alpine images are minimal and lightweight.
FROM node:${NODE_VERSION}-alpine AS base
# Update the package list and install libc6-compat. This package is often required for binary Node.js modules.
RUN apk add --no-cache libc6-compat

# Setup pnpm and turbo
# Start a new stage based on the base image for setting up pnpm (a package manager) and turbo (for monorepo management).
FROM base AS setup
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN pnpm config set store-dir ~/.pnpm-store
RUN pnpm install --global turbo

# Build argument for specifying the project
# Introduce a build argument 'PROJECT' to specify which project in the monorepo to build.
ARG PROJECT=web
# Install all dependencies in the monorepo
# Start a new stage for handling dependencies. This stage uses the previously setup image with pnpm and turbo installed.
FROM setup AS dependencies
WORKDIR /app
# Copy the essential configuration files and the specific project's files into the Docker image.
COPY patches/ ./patches/
COPY packages/ ./packages/
COPY turbo.json ./
COPY package.json turbo.json packages ./
COPY pnpm-lock.yaml pnpm-workspace.yaml ./
# Install dependencies as per the lockfile to ensure consistent dependency resolution.
RUN pnpm install --frozen-lockfile

# Prune projects to focus on the specified project scope
# Start a new stage to prune the monorepo, focusing only on the necessary parts for the specified project.
FROM dependencies AS pruner
COPY apps/${PROJECT} ./apps/${PROJECT}
RUN turbo prune --scope=${PROJECT} --docker
# Remove all empty node_modules folders. This is a cleanup step to remove unnecessary directories and reduce image size.
RUN rm -rf /app/out/full/*/*/node_modules

# Build the project using turbo
# Start a new stage for building the project. This stage will compile and prepare the project for production.
FROM setup AS builder
WORKDIR /app

ARG GIT_COMMIT_SHA=development
ENV GIT_COMMIT_SHA=$GIT_COMMIT_SHA

# Copy pruned lockfile and package.json files
# This ensures that the builder stage has the exact dependencies needed for the project.
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=pruner /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=pruner /app/out/json/ .

# Install dependencies for the pruned project
# Utilize BuildKit's cache to speed up the dependency installation process.
RUN --mount=type=cache,id=pnpm,target=~/.pnpm-store pnpm install
# TODO Re-add: --frozen-lockfile when turbo prune is fixed https://github.com/vercel/turbo/issues/3382#issuecomment-1684098542

# Copy pruned source code
# Bring in the necessary source code to the builder stage for compilation.
COPY --from=pruner /app/out/full/ .

# Build with turbo and prune dev dependencies
# Use turbo to build the project, followed by pruning development dependencies to minimize the final image size.
RUN turbo build --filter=${PROJECT}...
# NOTE: --no-optional breaks payload webpack build, let's not use it :)
RUN --mount=type=cache,id=pnpm,target=~/.pnpm-store rm -rf node_modules && pnpm install --prod
# Remove source files to further reduce the image size, keeping only the compiled output and necessary runtime files.
RUN rm -rf ./**/*/src

# Final production image
# Start the final stage for the production-ready image.
FROM base AS runner
#this needs to be here for some reason again, otherwise the WORKDIR command doesn't pick it up
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

WORKDIR /app/apps/${PROJECT}
# Specify the command to run the application. Adjust the path as needed for your project's start script.
CMD ["npm", "run", "start"]