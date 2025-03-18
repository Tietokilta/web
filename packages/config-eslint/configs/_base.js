import js from "@eslint/js";
import importPlugin from "eslint-plugin-import-x";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import globals from "globals";
import bestPractice from "../rules/best-practice.js";
import comments from "../rules/comments.js";
import es6 from "../rules/es6.js";
import import_ from "../rules/import.js";
import possibleErrors from "../rules/possible-errors.js";
import stylistic from "../rules/stylistic.js";
import unicorn from "../rules/unicorn.js";
import variables from "../rules/variables.js";
import { ECMA_VERSION, JAVASCRIPT_FILES } from "./constants.js";

/**
 * Adapter from deprecated Vercel Style Guide
 * @see https://github.com/vercel/style-guide/blob/canary/eslint/_base.js
 *
 * @type {import("typescript-eslint").InfiniteDepthConfigWithExtends}
 */
const baseConfig = [
  js.configs.recommended,
  importPlugin.flatConfigs.recommended,
  eslintConfigPrettier,
  bestPractice,
  comments,
  es6,
  import_,
  possibleErrors,
  stylistic,
  unicorn,
  variables,
  {
    // Tell ESLint not to ignore dot-files, which are ignored by default.
    ignores: ["!.*.js"],
  },
  {
    linterOptions: {
      // Report unused `eslint-disable` comments.
      reportUnusedDisableDirectives: true,
    },
    // Global settings used by all overrides.
    settings: {
      // Use the Node resolver by default.
      "import-x/resolver": {
        node: {},
      },
    },
    languageOptions: {
      // Global parser options.
      parserOptions: {
        ecmaVersion: ECMA_VERSION,
        sourceType: "module",
      },
      globals: {
        ...globals[`es${ECMA_VERSION}`],
      },
    },
  },
  {
    files: JAVASCRIPT_FILES,
    parser: "@babel/eslint-parser",
    parserOptions: {
      requireConfigFile: false,
    },
  },
];

export default baseConfig;
