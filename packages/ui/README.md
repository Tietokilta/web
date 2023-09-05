# @tietokilta/ui

Component library built in Tietokilta style, for use in React apps w/ tailwindcss

## Getting Started

1. Install @tietokilta/ui dependency (**Note:** not yet published to package managers!)

```bash
pnpm install @tietokilta/ui # or npm/yarn
```

2. Add template path to `tailwind.config.cjs` file:

```cjs
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./node_modules/@tietokilta/ui/**/*.{js,cjs}"],
  // ...
};
```

3. Import components

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
