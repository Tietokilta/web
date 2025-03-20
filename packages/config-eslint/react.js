import js from "@eslint/js";
import ts from "typescript-eslint";
import { fixupPluginRules } from "@eslint/compat";
import onlyWarn from "eslint-plugin-only-warn";
import turbo from "eslint-plugin-turbo";
import globals from "globals";
import tailwindcss from "eslint-plugin-tailwindcss";
import vercelTypescript from "./configs/typescript.js";
import vercelBrowser from "./configs/browser.js";
import vercelReact from "./configs/react.js";

/*
 * This is a custom ESLint configuration for use a library
 * that utilizes React.
 *
 * This config extends the Vercel Engineering Style Guide.
 * For more information, see https://github.com/vercel/style-guide
 */
export default ts.config(
  js.configs.recommended,
  turbo.configs["flat/recommended"],
  vercelBrowser,
  vercelTypescript,
  vercelReact,
  tailwindcss.configs["flat/recommended"],
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        JSX: "readonly",
        React: "readonly",
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
    ignores: ["node_modules/", "dist/", ".eslintrc.js", "**/*.css"],
  },
  {
    rules: {
      "import-x/no-default-export": "off",
      "tailwindcss/classnames-order": "off", // handled by prettier
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
