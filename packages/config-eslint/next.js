import js from "@eslint/js";
import ts from "typescript-eslint";
import { fixupPluginRules } from "@eslint/compat";
import onlyWarn from "eslint-plugin-only-warn";
import turbo from "eslint-plugin-turbo";
import globals from "globals";
import tailwindcss from "eslint-plugin-tailwindcss";
import vercelNode from "./configs/node.js";
import vercelTypescript from "./configs/typescript.js";
import vercelBrowser from "./configs/browser.js";
import vercelReact from "./configs/react.js";
import vercelNext from "./configs/next.js";

/*
 * This is a custom ESLint configuration for use with
 * Next.js apps.
 *
 * This config extends the Vercel Engineering Style Guide.
 * For more information, see https://github.com/vercel/style-guide
 */
export default ts.config(
  js.configs.recommended,
  turbo.configs["flat/recommended"],
  vercelNode,
  vercelTypescript,
  vercelBrowser,
  vercelReact,
  vercelNext,
  tailwindcss.configs["flat/recommended"],
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
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
    ignores: ["node_modules/", "dist/"],
  },
  {
    rules: {
      "import-x/no-default-export": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "no-implicit-coercion": ["error", { allow: ["!!"] }],
      "tailwindcss/classnames-order": "off",
      "tailwindcss/no-custom-classname": [
        "warn",
        {
          // react-dvd-screensaver uses custom classnames to detect parent container
          whitelist: ["screensaver-container"],
        },
      ],
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
