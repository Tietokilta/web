import type { MainNavigation } from "@tietokilta/cms-types/payload";
import { getGlobal } from "./fetcher";

export const fetchMainNavigation = (locale: string) =>
  getGlobal<MainNavigation>("main-navigation", { locale, depth: 1 });
