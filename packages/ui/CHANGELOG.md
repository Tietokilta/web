# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### 💥 BREAKING CHANGES

- **Tailwind CSS v4 required** - Package now requires Tailwind CSS v4.0+ (CSS-first configuration)
- **Removed JavaScript configuration** - No more `preset.ts` or `plugin.ts` exports
  - All configuration now happens via CSS imports
  - No `tailwind.config.js` needed in consuming apps
- **New setup approach** - Users must:
  1. Import `@import "@tietokilta/ui/global.css"` in their global CSS
  2. Add `@source "../../node_modules/@tietokilta/ui/dist/**/*.{js,mjs}"` to scan component classes
  3. Use Tailwind v4's `@tailwindcss/vite` plugin (or equivalent for their bundler)

### Added

- **CSS-first configuration** - Design tokens defined using Tailwind v4's `@theme inline` directive
- **Custom utilities in CSS** - `content-alt-empty` and dynamic `content-alt-*` utilities now defined via `@layer utilities`
- **Simplified setup** - No JavaScript config required, all configuration in CSS
- **Component documentation** - Added comprehensive table of all components and their key props to README
- **Repository metadata** - Added `repository` field to package.json for npm provenance verification
- **Type field** - Added `"type": "commonjs"` for Node.js performance optimization

### Changed

- **Migrated to Tailwind v4** - Complete rewrite of theme and plugin system
  - Theme tokens now use `@theme inline` instead of JavaScript config
  - Custom utilities use `@layer utilities` instead of `addUtilities` API
  - Font families, colors, and box shadows all defined in CSS
- **Improved TypeScript types** - Fixed "masquerading as CJS" issue by:
  - Using `.d.mts` for ESM imports
  - Using `.d.ts` for CJS requires
  - Properly structured conditional exports with separate type declarations
- **Updated README** - Complete rewrite for Tailwind v4 CSS-first approach
  - Removed v3 preset/plugin instructions
  - Added v4 CSS import and `@source` directive instructions
  - Updated troubleshooting section for v4
- **Build configuration** - Simplified build to only compile TypeScript components
  - CSS files now shipped directly from `lib/` directory
  - No longer building CSS through tsup
- **Repository URL format** - Changed to full git URL format (`git+https://...`)

### Removed

- **Preset export** - `@tietokilta/ui/preset` removed (replaced by CSS imports)
- **Plugin export** - JavaScript plugin API removed (replaced by CSS `@layer` directives)
- **Tailwind v3 support** - Package now requires v4.0+

### Fixed

- **Type resolution errors** - Fixed all issues reported by "Are The Types Wrong" tool
  - No more "Resolution failed" errors
  - No more "Masquerading as CJS" warnings
- **CI/CD publishing** - Fixed npm publishing workflow:
  - Corrected GitHub repository name in OIDC configuration (Tietokilta vs tietokilta)
  - Added required `repository` field for provenance verification
  - Removed duplicate `--access public` flag

## [0.0.0-alpha.5] - 2024-12-02

### Initial Release

- React UI components built with Tailwind CSS and shadcn/ui
- Components: Button, Card, Input, Checkbox, Radio, Textarea, Tabs, Sheet, Collapsible, NavigationMenu, ScrollArea, Separator, Progress
- Icon re-exports from Lucide React and Phosphor Icons
- Custom Tailwind plugin with utilities
- Default design tokens (colors, shadows, fonts)
