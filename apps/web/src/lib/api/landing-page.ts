import type { LandingPage } from "@tietokilta/cms-types/payload";
import { getGlobal } from "./fetcher";

export const fetchLandingPage = getGlobal<LandingPage>(
  "/api/globals/landing-page",
);
