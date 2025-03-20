import next from "@next/eslint-plugin-next";
import { fixupPluginRules } from "@eslint/compat";

/**
 * Adapter from deprecated Vercel Style Guide
 * @see https://github.com/vercel/style-guide/blob/canary/eslint/react.js
 *
 * @satisfies {import("typescript-eslint").InfiniteDepthConfigWithExtends}
 */
const config = [
  {
    plugins: {
      "@next/next": fixupPluginRules(next),
    },
    rules: {
      .../** @type {Awaited<import("typescript-eslint").Config>[number]["rules"]} */ (
        next.configs.recommended.rules
      ),
    },
  },
];
export default config;
