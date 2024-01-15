import { getGlobal, getOne } from "./fetcher";

import type { LandingPage, Page } from "payload/generated-types";

export const fetchPage = getOne<
  { where: { slug: { equals: string }; topic?: { slug: { equals: string } } } },
  Page
>("/api/pages");

export const fetchLandingPage = getGlobal<LandingPage>(
  "/api/globals/landing-page",
);
