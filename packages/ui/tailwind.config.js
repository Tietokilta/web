const { config } = require("./lib/plugin");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./lib/**/*.{html,js,ts,jsx,tsx}"],
  theme: config.theme,
};
