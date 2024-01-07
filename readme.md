# Tietokilta Web

Monorepo containing packages used for the Tietokilta website.

## Getting started

Prerequisites: [Node.js](https://nodejs.org/en/), [Docker](https://www.docker.com/), [MongoDB Database Tools](https://www.mongodb.com/docs/database-tools/#installation)(for seeding the dev-db) installed

```sh
# install pnpm
npm corepack enable

# install dependencies
pnpm install

# start the local database
docker compose up -d

# seed the database with data
pnpm seeding:populate

# start the dev server
pnpm dev
```

In case you run into issues when changing branches etc. Try re-seeding your local dev DB:
```sh
pnpm mongo:clear
pnpm seeding:populate
```

Recommended VSCode settings:

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
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ]
}
```

## Packages

### `packages/cms`

Admin panel and CMS, Express server using [Payload CMS](https://payloadcms.com/)

### `packages/next`

Main website, [Next.js](https://nextjs.org/) 14 with the App Router setup

### `packages/ui` (`@tietokilta/ui`)

React UI component library and Storybook. Built with Tailwind and [shadcn/ui](https://ui.shadcn.com/)
