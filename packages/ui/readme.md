# `@tietokilta/ui`

Reusable React UI components built with Tailwind CSS and shadcn/ui. Designed to drop into any React + Tailwind project.

## Install

```sh
# with pnpm
pnpm add @tietokilta/ui react react-dom

# Tailwind + PostCSS peers (dev)
pnpm add -D tailwindcss postcss @tailwindcss/postcss tailwindcss-animate @tailwindcss/typography
```

Required peer dependencies:

- `react`, `react-dom`
- `tailwindcss`, `postcss`, `@tailwindcss/postcss`
- `tailwindcss-animate`, `@tailwindcss/typography`

## Tailwind setup

Add the package to your Tailwind config and extend the theme with the provided defaults.

```js
// tailwind.config.js or tailwind.config.cjs
import {
  plugin as tietokiltaUiPlugin,
  config as tietokiltaUiConfig,
} from "@tietokilta/ui/lib/plugin";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{ts,tsx,js,jsx}",
    "./node_modules/@tietokilta/ui/dist/**/*.{js,ts,tsx}",
  ],
  theme: {
    extend: tietokiltaUiConfig.theme.extend,
  },
  plugins: [
    tietokiltaUiPlugin,
    require("@tailwindcss/typography"),
    require("tailwindcss-animate"),
  ],
};
```

Notes:

- Import `plugin` and `config` from `@tietokilta/ui/lib/plugin`.
- The plugin adds utilities like `content-alt` and `content-alt-empty`.
- Design tokens: the UI package ships default CSS variables (colors, shadows, fonts) in its global stylesheet. You only need to define your own `--color-*` / `--box-shadow-*` variables if you want to customize the theme.

## Global CSS

Include Tailwind layers and the package styles once, then define your design tokens.

```css
/* src/styles/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* UI package global styles (includes default design tokens) */
@import "@tietokilta/ui/dist/global.css";

/* Optional: override tokens to match your brand */
:root {
  /* Example: change primary color */
  /* --color-primary-500: #2563eb; */
}
```

## Usage

```tsx
import { Button } from "@tietokilta/ui";

export default function Example() {
  return (
    <div className="p-4">
      <Button variant="primary">Hello from UI</Button>
    </div>
  );
}
```

## Troubleshooting

- Missing styles: ensure `content` includes your app code and `node_modules/@tietokilta/ui/dist`.
- Unknown CSS variables: define the `--color-*` and `--box-shadow-*` tokens in global CSS.
- Type errors: install `@types/react`/`@types/react-dom` if using TypeScript.
