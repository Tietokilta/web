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

Use the included preset for automatic configuration, or manually configure if you need more control.

### Option 1: Using the preset (recommended)

```js
// tailwind.config.js
import { preset } from "@tietokilta/ui/preset";

/** @type {import('tailwindcss').Config} */
export default {
  presets: [preset],
  content: ["./src/**/*.{ts,tsx,js,jsx}"],
  // Your customizations automatically extend the preset
};
```

### Option 2: Manual configuration

```js
// tailwind.config.js
import tietokiltaUI from "@tietokilta/ui";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{ts,tsx,js,jsx}",
    "./node_modules/@tietokilta/ui/dist/**/*.{js,mjs}",
  ],
  plugins: [
    tietokiltaUI,
    require("@tailwindcss/typography"),
    require("tailwindcss-animate"),
  ],
};
```

Notes:

- The preset automatically includes component paths and the custom plugin
- The plugin adds utilities like `content-alt` and `content-alt-empty`
- Design tokens: the package ships default CSS variables (colors, shadows, fonts) in its global stylesheet. You only need to define your own `--color-*` / `--box-shadow-*` variables if you want to customize the theme

## Global CSS

Include Tailwind and the package styles in your global CSS file.

```css
/* src/styles/globals.css */
@import "tailwindcss";

/* UI package global styles (includes default design tokens) */
@import "@tietokilta/ui/global.css";

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

## Components

| Component          | Description                                   | Key Props/Variants                                                                                                                                                                        |
| ------------------ | --------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Button**         | Versatile button with multiple style variants | `variant`: default, destructive, outline, secondary, ghost, link, backLink, outlineLink<br/>`size`: default, sm, lg<br/>`asChild`: use with Slot for custom elements                      |
| **Card**           | Container component with consistent styling   | `asChild`: render as child component                                                                                                                                                      |
| **Input**          | Form text input                               | Standard HTML input attributes                                                                                                                                                            |
| **Checkbox**       | Checkbox input                                | Standard HTML input attributes (without type)                                                                                                                                             |
| **Radio**          | Radio button input                            | Standard HTML input attributes (without type)                                                                                                                                             |
| **Textarea**       | Multi-line text input                         | Standard HTML textarea attributes                                                                                                                                                         |
| **Tabs**           | Tabbed interface components                   | `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`                                                                                                                                          |
| **Sheet**          | Slide-out panel/drawer (based on Dialog)      | `side`: top, bottom, left, right<br/>Components: `Sheet`, `SheetTrigger`, `SheetContent`, `SheetHeader`, `SheetTitle`, `SheetDescription`, `SheetFooter`, `SheetClose`                    |
| **Collapsible**    | Collapsible content container                 | `Collapsible`, `CollapsibleTrigger`, `CollapsibleContent`                                                                                                                                 |
| **NavigationMenu** | Accessible navigation menu                    | `NavigationMenu`, `NavigationMenuList`, `NavigationMenuItem`, `NavigationMenuTrigger`, `NavigationMenuContent`, `NavigationMenuLink`, `NavigationMenuViewport`, `NavigationMenuIndicator` |
| **ScrollArea**     | Custom scrollable area                        | `ScrollArea`, `ScrollBar`                                                                                                                                                                 |
| **Separator**      | Visual divider                                | `orientation`: horizontal, vertical                                                                                                                                                       |
| **Progress**       | Progress indicator                            | `value`: 0-100                                                                                                                                                                            |

### Icons

The package re-exports icons from Lucide React and Phosphor Icons:

```tsx
import {
  ChevronDownIcon,
  MenuIcon,
  XIcon,
  FacebookIcon,
  GithubIcon,
  // ... and many more
} from "@tietokilta/ui";
```

See the full list in the TypeScript definitions.

## Troubleshooting

- Missing styles: ensure `content` includes your app code and `node_modules/@tietokilta/ui/dist`.
- Unknown CSS variables: define the `--color-*` and `--box-shadow-*` tokens in global CSS.
- Type errors: install `@types/react`/`@types/react-dom` if using TypeScript.
