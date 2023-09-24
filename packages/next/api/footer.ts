import { getGlobal } from "./fetcher";

import type { Footer } from "payload/generated-types";

export const fetchFooter = getGlobal<Footer>("/api/globals/footer?foo=bar");
