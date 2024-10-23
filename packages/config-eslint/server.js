import js from "@eslint/js";
import ts from "typescript-eslint";
import { FlatCompat } from "@eslint/eslintrc";
import vercelNode from "@vercel/style-guide/eslint/node";
import vercelTypescript from "@vercel/style-guide/eslint/typescript";
import { fixupConfigRules, fixupPluginRules } from "@eslint/compat";
import globals from "globals";
import onlyWarn from "eslint-plugin-only-warn";
import turbo from "eslint-plugin-turbo";
import importPlugin from "eslint-plugin-import";

const compat = new FlatCompat({ recommendedConfig: js.configs.recommended });

/*
 * This is a custom ESLint configuration for use server side
 * typescript packages.
 *
 * This config extends the Vercel Engineering Style Guide.
 * For more information, see https://github.com/vercel/style-guide
 */
export default ts.config(
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.typescript,
  ...fixupConfigRules(compat.config(vercelNode)),
  ...fixupConfigRules(compat.config(vercelTypescript)),
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
    ignores: ["node_modules/", "dist/", "build/"],
  },
  {
    rules: {
      "import/no-default-export": "off",
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
