/**
 * Adapter from deprecated Vercel Style Guide
 * @see https://github.com/vercel/style-guide/blob/canary/eslint/rules/variables.js
 *
 * @satisfies {import("typescript-eslint").InfiniteDepthConfigWithExtends}
 */
const config = [
  {
    rules: {
      /**
       * Disallow labels that share a name with a variable.
       *
       * 🚫 Not fixable - https://eslint.org/docs/rules/no-label-var
       */
      "no-label-var": "error",
      /**
       * Disallow initializing variables to `undefined`.
       *
       * 🔧 Fixable - https://eslint.org/docs/rules/no-undef-init
       */
      "no-undef-init": "warn",
      /**
       * Disallow unused variables.
       *
       * 🚫 Not fixable - https://eslint.org/docs/rules/no-unused-vars
       */ "no-unused-vars": [
        "error",
        {
          args: "after-used",
          argsIgnorePattern: "^_",
          ignoreRestSiblings: false,
          vars: "all",
          varsIgnorePattern: "^_",
        },
      ],
    },
  },
];
export default config;
