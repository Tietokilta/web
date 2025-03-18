import unicorn from "eslint-plugin-unicorn";

/**
 * Adapter from deprecated Vercel Style Guide
 * @see https://github.com/vercel/style-guide/blob/canary/eslint/rules/unicorn.js
 *
 * @satisfies {import("typescript-eslint").InfiniteDepthConfigWithExtends}
 */
const config = [
  {
    plugins: {
      unicorn: unicorn,
    },
    rules: {
      /**
       * Require consistent filename case for all linted files.
       *
       * 🚫 Not fixable - https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/filename-case.md
       */
      "unicorn/filename-case": [
        "error",
        {
          case: "kebabCase",
        },
      ],
      /**
       * Require using the `node:` protocol when importing Node.js built-in modules.
       *
       * 🔧 Fixable - https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-node-protocol.md
       */
      "unicorn/prefer-node-protocol": "warn",
    },
  },
];
export default config;
