import { type InfoScreen } from "@payload-types";
import { getGlobal } from "./fetcher";

export const fetchInfoScreen = (locale: string) =>
  getGlobal<InfoScreen>("info-screen", { locale });
