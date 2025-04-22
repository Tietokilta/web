import { type InfoScreen } from "@tietokilta/cms-types/payload";
import { getGlobal } from "./fetcher";

export const fetchInfoScreen = (locale: string) =>
  getGlobal<InfoScreen>("info-screen", { locale });
