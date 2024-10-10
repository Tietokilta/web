import js from "@eslint/js";
import ts from "typescript-eslint";
import { FlatCompat } from "@eslint/eslintrc";
import vercelNode from "@vercel/style-guide/eslint/node";
import vercelTypescript from "@vercel/style-guide/eslint/typescript";
import vercelBrowser from "@vercel/style-guide/eslint/browser";
import vercelReact from "@vercel/style-guide/eslint/react";
import vercelNext from "@vercel/style-guide/eslint/next";
import { fixupConfigRules, fixupPluginRules } from "@eslint/compat";
import onlyWarn from "eslint-plugin-only-warn";
import turbo from "eslint-plugin-turbo";
import globals from "globals";
import tailwindcss from "eslint-plugin-tailwindcss";
import importPlugin from "eslint-plugin-import";

const compat = new FlatCompat({ recommendedConfig: js.configs.recommended });

/*
 * This is a custom ESLint configuration for use with
 * Next.js apps.
 *
 * This config extends the Vercel Engineering Style Guide.
 * For more information, see https://github.com/vercel/style-guide
 */
export default ts.config(
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.react,
  importPlugin.flatConfigs.typescript,
  ...fixupConfigRules(compat.config(vercelNode)),
  ...fixupConfigRules(compat.config(vercelTypescript)),
  ...fixupConfigRules(compat.config(vercelBrowser)),
  ...fixupConfigRules(compat.config(vercelReact)),
  ...fixupConfigRules(compat.config(vercelNext)),
  ...tailwindcss.configs["flat/recommended"],
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
      turbo: fixupPluginRules(turbo),
      "only-warn": fixupPluginRules(onlyWarn),
    },
    settings: {
      "import/resolver": {
        typescript: {
          project: true,
        },
      },
    },
  },
  {
    ignores: ["node_modules/", "dist/"],
  },
  {
    rules: {
      "import/no-default-export": "off",
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
    },
  },
);
