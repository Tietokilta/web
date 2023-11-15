import { getGlobal } from "./fetcher";

import type { MainNavigation } from "payload/generated-types";

export const fetchMainNavigation = (locale: string) =>
  getGlobal<MainNavigation>("/api/globals/main-navigation", locale);