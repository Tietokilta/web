import type { Footer } from "@payload-types";
import { getGlobal } from "./fetcher";

export const fetchFooter = (locale: string) =>
  getGlobal<Footer>("footer", { locale });
