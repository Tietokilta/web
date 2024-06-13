import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme.js";
import twPlugin from "tailwindcss/plugin.js";

export const config: Partial<Config> = {
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
        mono: ["Roboto Mono", ...defaultTheme.fontFamily.mono],
      },
      colors: {
        primary: {
          900: "#034d22",
          800: "#087831",
          700: "#0fbe40",
          600: "#38ec5c",
          500: "#7ef98c",
          400: "#9ff9a9",
          300: "#bbf9c2",
          200: "#d8fadc",
          100: "#e8fcea",
        },
        secondary: {
          900: "#42045f",
          800: "#5b0881",
          700: "#8b0fc4",
          600: "#ba45f0",
          500: "#d690f6",
          400: "#dfabf7",
          300: "#e7c4f7",
          200: "#f0dcf9",
          100: "#f7eefc",
        },
        danger: {
          900: "#55031c",
          800: "#710525",
          700: "#930d35",
          600: "#be1548",
          500: "#e02f64",
          400: "#e75d86",
          300: "#ea8ca9",
          200: "#f3c8d5",
          100: "#f8e7ec",
        },
        gray: {
          900: "#0a0d10",
          800: "#2b313b",
          700: "#515862",
          600: "#8a96a8",
          500: "#b1becb",
          400: "#c4cdd4",
          300: "#d6dde4",
          200: "#f0f3f5",
          100: "#f8f9fa",
        },
        success: {
          900: "#224804",
          800: "#387508",
          700: "#4c9a0f",
          600: "#63c616",
          500: "#73e01e",
          400: "#93e552",
          300: "#b2ec85",
          200: "#d5f5bb",
          100: "#e4fdd1",
        },
        warning: {
          900: "#583704",
          800: "#a87a10",
          700: "#e2b71a",
          600: "#e8cb37",
          500: "#f1e04d",
          400: "#f2e67d",
          300: "#f5eda6",
          200: "#f9f4c9",
          100: "#fbf7e6",
        },
      },
      boxShadow: {
        solid: "2px 2px 0px 0px #0a0d10",
        "solid-lg": "4px 4px 0px 0px #0a0d10",
        "solid-xl": "6px 6px 0px 0px #0a0d10",
        underline: "inset 0 -2px 0 0 #0a0d10",
      },
    },
  },
};

export const plugin = twPlugin(({ addUtilities, matchUtilities }) => {
  matchUtilities({
    "content-alt": (value) => ({
      '@supports (content: "x" / "y")': {
        content: `var(--tw-content) / ${value}`,
      },
    }),
  });
  addUtilities({
    ".content-alt-empty": {
      '@supports (content: "x" / "y")': {
        content: `var(--tw-content) / ''`,
      },
    },
  });
}, config);

export default plugin;
