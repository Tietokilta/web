import { tailwindTiKUI } from "../ui/lib/utils/tailwind";

import { Config } from "tailwindcss";

const config: Config = tailwindTiKUI({
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
});

export default config;
