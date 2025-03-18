import base from "./_base.js";
import globals from "globals";

/**
 * Adapter from deprecated Vercel Style Guide
 * @see https://github.com/vercel/style-guide/blob/canary/eslint/node.js
 *
 * @type {import("typescript-eslint").InfiniteDepthConfigWithExtends}
 */
const config = [
  base,
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
];
export default config;
