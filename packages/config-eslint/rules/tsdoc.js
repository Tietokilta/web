import { fixupPluginRules } from "@eslint/compat";
import tsdoc from "eslint-plugin-tsdoc";

/**
 * Adapter from deprecated Vercel Style Guide
 * @see https://github.com/vercel/style-guide/blob/canary/eslint/rules/tsdoc.js
 *
 * @satisfies {import("typescript-eslint").InfiniteDepthConfigWithExtends}
 */
const config = [
  {
    plugins: {
      tsdoc: fixupPluginRules(tsdoc),
    },
    rules: {
      /**
       * Require TSDoc comments conform to the TSDoc specification.
       *
       * 🚫 Not fixable - https://github.com/microsoft/tsdoc/tree/master/eslint-plugin
       */
      "tsdoc/syntax": "error",
    },
  },
];
export default config;
