import type { Config } from "@tietokilta/cms-types/payload";

declare module "payload" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface -- not applicable
  export interface GeneratedTypes extends Config {}
}
