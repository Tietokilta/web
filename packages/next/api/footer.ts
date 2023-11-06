import { getGlobal } from "./fetcher";

import type { Footer } from "payload/generated-types";

export const fetchFooter = (locale: string) =>
  getGlobal<Footer>("/api/globals/footer", locale);
