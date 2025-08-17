/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
export default {
  plugins: ["prettier-plugin-tailwindcss", "prettier-plugin-packagejson"],
  tailwindAttributes: ["cva", "cn", "clsx"],
  tailwindFunctions: ["cva", "cn", "clsx"],
  tailwindStylesheet: "./apps/web/src/[locale]/globals.css",
  tailwindConfig: "./apps/web/tailwind.config.js",
};
