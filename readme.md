# Tietokilta Website

[![CI](https://github.com/Tietokilta/web/actions/workflows/build.yml/badge.svg)](https://github.com/Tietokilta/web/actions/workflows/build.yml)

Monorepo containing apps and packages used for the Tietokilta website.

## Getting started

### Set up

Prerequisites:

- [Node.js](https://nodejs.org/en/), usage of [fnm](https://github.com/Schniz/fnm) or [nvm](https://github.com/nvm-sh/nvm) recommended
- [Docker](https://www.docker.com/) and docker-compose
- [MongoDB Database Tools](https://www.mongodb.com/docs/database-tools/installation/installation/) (for seeding the dev-db).

  NOTE: make sure you are installing MongoDB Database Tools, not something else, the documentation for Linux is quite wonky.

```sh
# copy .env.example to .env
cp .env.example .env

# install pnpm
corepack enable

# install dependencies
pnpm install

# start the local database
pnpm db:start

# seed the database with data
pnpm db:populate

# start the dev server
pnpm dev
```

In case you run into issues when changing branches etc. Try re-seeding your local dev DB:

```sh
pnpm db:reset
```

### Recommended VSCode settings

```json
{
  "editor.tabSize": 2,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll": true,
    "source.fixAll.eslint": true,
    "source.fixAll.stylelint": true
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ],
  "eslint.workingDirectories": [
    {
      "mode": "auto"
    }
  ],
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ]
}
```

### Other utilities

```sh
# lint all packages
pnpm lint

# format all packages
pnpm format

# typecheck all packages
pnpm typecheck

# codegen (currently includes cms types and graphql schema)
pnpm codegen

# export database to version control
pnpm db:export
```

## What's inside?

This repo includes the following packages and apps:

### Apps and Packages

- `@tietokilta/cms`: a [Payload CMS](https://payloadcms.com/) server, admin panel and CMS
- `@tietokilta/web`: a [Next.js](https://nextjs.org/) app, main website using Next 14 and App Router
- `@tietokilta/ui`: React UI component library. Built with Tailwind and [shadcn/ui](https://ui.shadcn.com/)
- `@tietokilta/config-typescript`: tsconfigs used throughout the monorepo
- `@tietokilta/eslint-config`: eslintconfigs used throughout the monorepo

Each package and app is 100% [TypeScript](https://www.typescriptlang.org/).
