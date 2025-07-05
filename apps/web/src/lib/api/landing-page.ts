import type { LandingPage } from "@payload-types";
import { getGlobal } from "./fetcher";

export const fetchLandingPage = (locale: string) =>
  getGlobal<LandingPage>("landing-page", { locale });
