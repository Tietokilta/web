import type { LandingPage } from "@tietokilta/cms-types/payload";
import { getGlobal } from "./fetcher";

export const fetchLandingPage = (locale: string) =>
  getGlobal<LandingPage>("landing-page", { locale });
