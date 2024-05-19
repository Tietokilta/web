const { config } = require("./lib/plugin");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./lib/**/*.{html,js,ts,jsx,tsx}"],
  theme: config.theme,
  plugins: [
    require("./lib/plugin"),
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
  ],
};
