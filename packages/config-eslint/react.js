import js from "@eslint/js";
import ts from "typescript-eslint";
import { FlatCompat } from "@eslint/eslintrc";
import vercelTypescript from "@vercel/style-guide/eslint/typescript";
import vercelBrowser from "@vercel/style-guide/eslint/browser";
import vercelReact from "@vercel/style-guide/eslint/react";
import { fixupConfigRules, fixupPluginRules } from "@eslint/compat";
import onlyWarn from "eslint-plugin-only-warn";
import turbo from "eslint-plugin-turbo";
import globals from "globals";
import tailwindcss from "eslint-plugin-tailwindcss";
import importPlugin from "eslint-plugin-import";

const compat = new FlatCompat({ recommendedConfig: js.configs.recommended });

/*
 * This is a custom ESLint configuration for use a library
 * that utilizes React.
 *
 * This config extends the Vercel Engineering Style Guide.
 * For more information, see https://github.com/vercel/style-guide
 */
export default ts.config(
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.react,
  importPlugin.flatConfigs.typescript,
  ...fixupConfigRules(compat.config(vercelBrowser)),
  ...fixupConfigRules(compat.config(vercelTypescript)),
  ...fixupConfigRules(compat.config(vercelReact)),
  ...tailwindcss.configs["flat/recommended"],
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
      turbo: fixupPluginRules(turbo),
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
    ignores: ["node_modules/", "dist/", ".eslintrc.js", "**/*.css"],
  },
  {
    rules: {
      "import/no-default-export": "off",
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
