import type { Config } from "tailwindcss";
import { config as baseConfig, plugin } from "./plugin";

// Get the path to the dist directory
// This works at runtime because the preset is imported from the dist directory
const distPath = __dirname;

/**
 * Tailwind CSS preset for @tietokilta/ui
 *
 * Includes:
 * - Theme configuration with design tokens
 * - Content paths for UI components
 * - Custom utilities plugin
 *
 * @example
 * ```js
 * // tailwind.config.js
 * import { preset } from "@tietokilta/ui/preset";
 *
 * export default {
 *   presets: [preset],
 *   content: ["./src/**\/*.{ts,tsx}"],
 * };
 * ```
 */
export const preset: Partial<Config> = {
  ...baseConfig,
  content: [`${distPath}/**/*.{js,mjs,ts,tsx}`],
  plugins: [plugin],
};

export default preset;
