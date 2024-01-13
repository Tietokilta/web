import type { Footer } from "@tietokilta/cms-types/payload";
import { getGlobal } from "./fetcher";

export const fetchFooter = (locale: string) =>
  getGlobal<Footer>("/api/globals/footer", locale);
