import type { Config } from "tailwindcss";
import { mergeWith } from "lodash";

import tailwindConfig from "../../tailwind.config";
import { join } from "path";

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
