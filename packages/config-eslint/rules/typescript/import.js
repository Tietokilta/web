/**
 * These are enabled by `import/recommended`, but are better handled by
 * TypeScript and @typescript-eslint.
 */
const disabledRules = /** @type {const} */ ({
  "import-x/default": "off",
  "import-x/export": "off",
  "import-x/namespace": "off",
  "import-x/no-unresolved": "off",
});

/**
 * Adapter from deprecated Vercel Style Guide
 * @see https://github.com/vercel/style-guide/blob/canary/eslint/rules/typescript/import.js
 *
 * @satisfies {import("typescript-eslint").InfiniteDepthConfigWithExtends}
 */
const config = [
  {
    rules: {
      ...disabledRules,
    },
  },
];
export default config;
