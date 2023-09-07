# @tietokilta/ui

Component library built in Tietokilta style, for use in React apps w/ tailwindcss

## Getting Started

### With Tailwind

If you're using Tailwind in the project, you can extend your Tailwind config with our configuration.

1. Install `@tietokilta/ui` dependency

```bash
pnpm install @tietokilta/ui # or npm/yarn
```

2. Use the `tailwindTiKUI` function to extend your Tailwind config in your `tailwind.config.{js,ts}`:

```cjs
import { tailwindTiKUI } from "@tietokilta/ui";
export default tailwindTiKUI({
  // ... your config ...
});
```

3. Import components:

```tsx
import { Button } from "@tietokilta/ui";

const App = () => (
  <div>
    <Button action="primary" destructive>
      Tietokilta!
    </Button>
  </div>
);
```

### Without Tailwind

1. Install `@tietokilta/ui` dependency

```bash
pnpm install @tietokilta/ui # or npm/yarn
```

1. Include the CSS file `dist/lib/main.css` in your app:

```cjs
import "@tietokilta/ui/dist/lib/main.css";
```

3. Import components:

```tsx
import { Button } from "@tietokilta/ui";

const App = () => (
  <div>
    <Button action="primary" destructive>
      Tietokilta!
    </Button>
  </div>
);
```

## Developing TiKUI

Recommended VSCode settings:

```json
{
  "editor.tabSize": 2,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ]
}
```

```sh
# install dependencies
pnpm install

# launch storybook w/ HMR
pnpm dev

# format style
pnpm format

# lint
pnpm lint

# run tests
pnpm test
```
