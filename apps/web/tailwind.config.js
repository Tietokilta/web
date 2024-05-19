const path = require("path");
const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");

/** @type {import("tailwindcss").Config} */
module.exports = {
  darkMode: "media",
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
      colors: {
        "dark-bg": colors.stone[900],
        "dark-fg": colors.stone[50],
        "dark-heading": colors.stone[100],
        "dark-text": colors.stone[300],
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            "--tw-prose-body": theme("colors.gray[800]"),
            "--tw-prose-headings": theme("colors.gray[900]"),
            "--tw-prose-lead": theme("colors.gray[700]"),
            "--tw-prose-links": theme("colors.gray[900]"),
            "--tw-prose-bold": theme("colors.gray[900]"),
            "--tw-prose-counters": theme("colors.gray[600]"),
            "--tw-prose-bullets": theme("colors.gray[400]"),
            "--tw-prose-hr": theme("colors.gray[300]"),
            "--tw-prose-quotes": theme("colors.gray[900]"),
            "--tw-prose-quote-borders": theme("colors.gray[300]"),
            "--tw-prose-captions": theme("colors.gray[700]"),
            "--tw-prose-code": theme("colors.gray[900]"),
            "--tw-prose-pre-code": theme("colors.gray[100]"),
            "--tw-prose-pre-bg": theme("colors.gray[900]"),
            "--tw-prose-th-borders": theme("colors.gray[300]"),
            "--tw-prose-td-borders": theme("colors.gray[200]"),
            "h1, h2, h3, h4, h5, h6": {
              fontFamily: theme("fontFamily.mono").join(", "),
            },
            "h2, h3": {
              "&::before": {
                color: theme("colors.gray.600"),
                marginInlineEnd: "1ch",
              },
            },
            "h2::before": {
              content: "'#'",
              "@supports (content: 'x' / 'y')": {
                content: "'#'/''",
              },
            },
            "h3::before": {
              content: "'##'",
              "@supports (content: 'x' / 'y')": {
                content: "'##'/''",
              },
            },
            "a:not([data-relation])": {
              textDecoration: "none",
              boxShadow: `inset 0 -0.2em 0 0.0 ${theme("colors.gray[600]")}`,
              "&[target='_blank']": {
                "&::after": {
                  content: "''",
                  marginInlineStart: "0.125em",
                  display: "inline-block",
                  width: "1em",
                  height: "1em",
                  verticalAlign: "-0.125em",
                  backgroundColor: "currentColor",
                  maskImage:
                    // lucide:external-link
                    "url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxZW0iIGhlaWdodD0iMWVtIiB2aWV3Qm94PSIwIDAgMjQgMjQiPjxwYXRoIGZpbGw9Im5vbmUiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS13aWR0aD0iMiIgZD0iTTE4IDEzdjZhMiAyIDAgMCAxLTIgMkg1YTIgMiAwIDAgMS0yLTJWOGEyIDIgMCAwIDEgMi0yaDZtNC0zaDZ2Nm0tMTEgNUwyMSAzIi8+PC9zdmc+)",
                  maskSize: "100% 100%",
                  maskRepeat: "no-repeat",
                },
              },
            },
            code: {
              backgroundColor: theme("colors.gray.100"),
            },
            "code::before": {
              content: "''",
            },
            "code::after": {
              content: "' '",
            },
            ":where(h1, h2, h3, h4, h5, h6) + blockquote": {
              marginTop: "2.4em",
            },
            blockquote: {
              position: "relative",
              paddingLeft: "calc(1ch + 0.15em)",
              marginLeft: "1ch",
              marginTop: "2.4em",
              marginBottom: "2.4em",
              borderLeftWidth: "0.15em",
              "&::before": {
                // zero width space because open comment breaks something internally
                content: "'/\u200b*'/''",
                fontFamily: theme("fontFamily.mono").join(", "),
                fontStyle: "normal",
                position: "absolute",
                top: "-1.6em",
                left: "-0.8em",
              },
              "&::after": {
                content: "'*/'/''",
                fontFamily: theme("fontFamily.mono").join(", "),
                fontStyle: "normal",
                position: "absolute",
                bottom: "-1.6em",
                left: "-0.8em",
              },
              "& p": {
                marginTop: "0",
                marginBottom: "0",
              },
            },
            "blockquote:has(+ blockquote)": {
              "&::after": {
                content: "'*'/''",
                left: "calc(-0.8em + 1ch)",
                bottom: "calc(-1.4em)",
              },
              marginBottom: "1em",
            },
            "blockquote + blockquote": {
              "&::before": {
                content: "''",
              },
              marginTop: "1em",
            },
            "img:not(figure img)": {
              boxShadow: theme("boxShadow.solid"),
              borderRadius: theme("borderRadius.md"),
              borderWidth: "2px",
              borderColor: theme("colors.gray.900"),
              padding: "1rem",
            },
            figure: {
              boxShadow: theme("boxShadow.solid"),
              borderRadius: theme("borderRadius.md"),
              borderWidth: "2px",
              borderColor: theme("colors.gray.900"),
              padding: "1rem",

              "& figcaption": {
                fontFamily: theme("fontFamily.mono").join(", "),
                fontWeight: theme("fontWeight.bold"),
                color: theme("colors.gray.900"),
              },
            },
            "figure img": {
              borderColor: theme("colors.gray.900"),
              borderWidth: "2px",
            },
          },
        },
      }),
      aspectRatio: {
        "2/3": "2 / 3",
      },
    },
  },
  plugins: [
    require("@tietokilta/ui"),
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
  ],
};
