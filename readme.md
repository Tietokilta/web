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

To clear your local image storage so that `pnpm db:populate` (and `pnpm db:reset`)
attempts to fetch all images from production, run:

```sh
pnpm uploads:clear
```

### Recommended VSCode settings

```json
{
  "editor.tabSize": 2,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll": "explicit",
    "source.fixAll.eslint": "explicit",
    "source.fixAll.stylelint": "explicit"
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

Each package and app is 100% [TypeScript](https://www.typescriptlang.org/)!

## llms.txt Markdown Variants

Lightweight Markdown representations of pages are exposed to aid LLM-based indexing (early `llms.txt` style experiment).

### How it works

Append `/llms.txt` to any localized page URL:

| Original              | Markdown variant               |
| --------------------- | ------------------------------ |
| `/fi/some-page`       | `/fi/some-page/llms.txt`       |
| `/fi/topic/page-slug` | `/fi/topic/page-slug/llms.txt` |
| `/fi` (landing)       | `/fi/llms.txt`                 |
| `/en` (landing)       | `/en/llms.txt`                 |

Internally all variants are rewritten (middleware) to a single API route (`/next_api/llms`). No extra page-level route segments are added to the file system, avoiding App Router catch‑all conflicts.

### Response format

`text/plain; charset=utf-8`:

```
# <Page Title>
<Page description>

<Markdown converted body>
```

Currently headings, paragraphs and (flat) lists are supported. Other rich blocks are reduced to plain text when possible.

### Limitations

- Only `standard` page types are serialized (redirects, events list, newsletters, etc. return 404 for now).
- Advanced components (grids, media, embeds) are flattened to textual content.
- No global index yet; use your sitemap or crawl page URLs then append `/llms.txt`.

Extend serialization logic in `apps/web/src/app/next_api/llms/route.ts` as needed (e.g., images -> `![alt](url)`, tables, links, relationship previews).
