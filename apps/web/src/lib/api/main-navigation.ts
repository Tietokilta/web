import type { MainNavigation } from "@payload-types";
import { getGlobal } from "./fetcher";

export const fetchMainNavigation = (locale: string) =>
  getGlobal<MainNavigation>("main-navigation", { locale, depth: 1 });
