# `@tietokilta/ui`

Reusable React UI components built with Tailwind CSS v4 and shadcn/ui. Designed to drop into any React + Tailwind v4 project.

## Install

```sh
# with pnpm
pnpm add @tietokilta/ui react react-dom

# Tailwind CSS v4 (peer dependency)
pnpm add -D tailwindcss @tailwindcss/vite
```

Required peer dependencies:

- `react`, `react-dom`
- `tailwindcss` v4.0+

## Setup

### 1. Add Vite plugin (or your bundler's equivalent)

```ts
// vite.config.ts
import tailwindcss from "@tailwindcss/vite";

export default {
  plugins: [tailwindcss()],
};
```

### 2. Import CSS in your global styles

```css
/* app/globals.css */
@import "tailwindcss";

/* Import UI package theme and utilities */
@import "@tietokilta/ui/global.css";

/* Scan UI package components for Tailwind classes */
@source "../../node_modules/@tietokilta/ui/dist/**/*.{js,mjs}";

/* Optional: override design tokens */
:root {
  /* Example: change primary color */
  /* --color-primary-500: #custom-color; */
}
```

That's it! No `tailwind.config.js` needed.

### How it works

The package uses Tailwind v4's CSS-first configuration:

- **`@theme inline`** - Design tokens (colors, shadows, fonts) are defined in CSS
- **`@source`** - Tells Tailwind to scan the UI package for utility classes
- **`@layer utilities`** - Custom utilities like `content-alt-empty` are defined in CSS

You can customize any design token by overriding the CSS variables in your own `:root` block.

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

- **Missing styles**: Ensure `@source` includes the UI package dist folder: `@source "../../node_modules/@tietokilta/ui/dist/**/*.{js,mjs}"`
- **Unknown CSS variables**: Make sure you've imported `@import "@tietokilta/ui/global.css"` in your global CSS file
- **Build errors**: Ensure you're using Tailwind CSS v4+ and have the `@tailwindcss/vite` plugin configured
- **Type errors**: Install `@types/react`/`@types/react-dom` if using TypeScript
