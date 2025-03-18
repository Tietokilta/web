import eslintComments from "eslint-plugin-eslint-comments";

/**
 * Adapter from deprecated Vercel Style Guide
 * @see https://github.com/vercel/style-guide/blob/canary/eslint/rules/comments.js
 *
 * @satisfies {import("typescript-eslint").InfiniteDepthConfigWithExtends}
 */
const config = [
  {
    plugins: {
      "eslint-comments": eslintComments,
    },
    rules: {
      /**
       * Require comments on ESlint disable directives.
       *
       * 🚫 Not fixable - https://mysticatea.github.io/eslint-plugin-eslint-comments/rules/require-description.html
       */
      "eslint-comments/require-description": "error",
    },
  },
];
export default config;
