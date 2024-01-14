const path = require("path");
const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import("tailwindcss").Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    path.join(path.dirname(require.resolve("@tietokilta/ui")), "**/*.js"),
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", ...defaultTheme.fontFamily.sans],
        mono: ["var(--font-roboto-mono)", ...defaultTheme.fontFamily.mono],
      },
    },
  },
  plugins: [
    require("@tietokilta/ui"),
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
  ],
};
