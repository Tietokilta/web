const path = require("path");

/** @type {import("tailwindcss").Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    path.join(path.dirname(require.resolve("@tietokilta/ui")), "**/*.js"),
  ],
  plugins: [
    require("@tietokilta/ui"),
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
  ],
};
