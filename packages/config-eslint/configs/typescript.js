import { TYPESCRIPT_FILES } from "./constants.js";
import ts from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import importPlugin from "eslint-plugin-import-x";
import typescript from "../rules/typescript/index.js";
import typescriptExtension from "../rules/typescript/extension.js";
import typescriptImport from "../rules/typescript/import.js";
import tsdoc from "../rules/tsdoc.js";

/**
 * Adapter from deprecated Vercel Style Guide
 * @see https://github.com/vercel/style-guide/blob/canary/eslint/typescript.js
 *
 * @satisfies {import("typescript-eslint").InfiniteDepthConfigWithExtends}
 */
const config = ts.config([
  {
    files: TYPESCRIPT_FILES,
    extends: [
      ts.configs.recommendedTypeChecked,
      ts.configs.strictTypeChecked,
      ts.configs.stylisticTypeChecked,
      importPlugin.flatConfigs.typescript,
      eslintConfigPrettier,
      typescript,
      typescriptExtension,
      typescriptImport,
      tsdoc,
    ],
  },
]);
export default config;
