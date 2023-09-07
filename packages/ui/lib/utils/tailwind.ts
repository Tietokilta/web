import tailwindConfig from "../../tailwind.config";

import { mergeWith } from "lodash";

import { join } from "path";

import type { Config } from "tailwindcss";

export const tailwindTiKUI = (config: Config): Config =>
  mergeWith(
    config,
    {
      ...tailwindConfig,
      content: [`${join(__dirname, "..")}/**/*.{html,js,ts,jsx,tsx}`],
    },
    (obj, src) => {
      if (Array.isArray(obj)) {
        return obj.concat(src);
      }
    },
  );
