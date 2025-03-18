import js from "@eslint/js";
import ts from "typescript-eslint";
import { fixupPluginRules } from "@eslint/compat";
import globals from "globals";
import onlyWarn from "eslint-plugin-only-warn";
import turbo from "eslint-plugin-turbo";
import vercelNode from "./configs/node.js";
import vercelTypescript from "./configs/typescript.js";

/*
 * This is a custom ESLint configuration for use server side
 * typescript packages.
 *
 * This config extends the Vercel Engineering Style Guide.
 * For more information, see https://github.com/vercel/style-guide
 */
export default ts.config(
  js.configs.recommended,
  turbo.configs["flat/recommended"],
  vercelNode,
  vercelTypescript,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2015,
      },
      parserOptions: {
        project: true,
        tsconfigRootDir: process.cwd(),
      },
    },
    plugins: {
      "only-warn": fixupPluginRules(onlyWarn),
    },
  },
  {
    ignores: ["node_modules/", "dist/", "build/"],
  },
  {
    rules: {
      "import-x/no-default-export": "off",
      "no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },
);
