# Tietokilta Website

Monorepo containing apps and packages used for the Tietokilta website.

## Getting started

### Set up

Prerequisites: [Node.js](https://nodejs.org/en/), [Docker](https://www.docker.com/), [MongoDB Database Tools](https://www.mongodb.com/docs/database-tools/#installation)(for seeding the dev-db) installed

```sh
# copy .env.example to .env
cp .env.example .env

# install pnpm
npm corepack enable

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
    "source.organizeImports": true,
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
