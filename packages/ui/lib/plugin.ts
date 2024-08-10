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
          900: "var(--color-primary-900)",
          800: "var(--color-primary-800)",
          700: "var(--color-primary-700)",
          600: "var(--color-primary-600)",
          500: "var(--color-primary-500)",
          400: "var(--color-primary-400)",
          300: "var(--color-primary-300)",
          200: "var(--color-primary-200)",
          100: "var(--color-primary-100)",
        },
        secondary: {
          900: "var(--color-secondary-900)",
          800: "var(--color-secondary-800)",
          700: "var(--color-secondary-700)",
          600: "var(--color-secondary-600)",
          500: "var(--color-secondary-500)",
          400: "var(--color-secondary-400)",
          300: "var(--color-secondary-300)",
          200: "var(--color-secondary-200)",
          100: "var(--color-secondary-100)",
        },
        danger: {
          900: "var(--color-danger-900)",
          800: "var(--color-danger-800)",
          700: "var(--color-danger-700)",
          600: "var(--color-danger-600)",
          500: "var(--color-danger-500)",
          400: "var(--color-danger-400)",
          300: "var(--color-danger-300)",
          200: "var(--color-danger-200)",
          100: "var(--color-danger-100)",
        },
        gray: {
          900: "var(--color-gray-900)",
          800: "var(--color-gray-800)",
          700: "var(--color-gray-700)",
          600: "var(--color-gray-600)",
          500: "var(--color-gray-500)",
          400: "var(--color-gray-400)",
          300: "var(--color-gray-300)",
          200: "var(--color-gray-200)",
          100: "var(--color-gray-100)",
        },
        success: {
          900: "var(--color-success-900)",
          800: "var(--color-success-800)",
          700: "var(--color-success-700)",
          600: "var(--color-success-600)",
          500: "var(--color-success-500)",
          400: "var(--color-success-400)",
          300: "var(--color-success-300)",
          200: "var(--color-success-200)",
          100: "var(--color-success-100)",
        },
        warning: {
          900: "var(--color-warning-900)",
          800: "var(--color-warning-800)",
          700: "var(--color-warning-700)",
          600: "var(--color-warning-600)",
          500: "var(--color-warning-500)",
          400: "var(--color-warning-400)",
          300: "var(--color-warning-300)",
          200: "var(--color-warning-200)",
          100: "var(--color-warning-100)",
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
