export default {
  extends: [
    "plugin:storybook/recommended",
    "plugin:vitest-globals/recommended",
    "../../.eslintrc.json",
  ],
  sourceType: "module",
  env: {
    "vitest-globals/env": true,
  },
  parserOptions: {
    project: "./tsconfig.json",
  },
  overrides: [
    {
      files: "**/*.{ts,tsx}",
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: __dirname,
      },
    },
  ],
};
