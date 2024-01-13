/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ["@tietokilta/eslint-config/server.js"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
  rules: {
    "unicorn/prefer-node-protocol": "off",
  },
};
