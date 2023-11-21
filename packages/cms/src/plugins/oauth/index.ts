import OAuthButton from "./OAuthButton";

import { Config } from "payload/config";
import { TextField } from "payload/types";

import type { oAuthPluginOptions } from "./types";

export { OAuthButton, oAuthPluginOptions };

// Detect client side because some dependencies may be nullified
const CLIENTSIDE = typeof document !== "undefined";

export const oAuthPlugin =
  (options: oAuthPluginOptions) =>
  async (incoming: Config): Promise<Config> => {
    let funcToCall;
    if (CLIENTSIDE) {
      funcToCall = (await import("./oAuthClient")).default;
    } else {
      funcToCall = (await import("./oAuthServer")).default;
    }
    // Shorthands
    const collectionSlug = options.userCollection?.slug ?? "users";
    const sub = options.subField?.name ?? "sub";

    // Spread the existing config
    const config: Config = {
      ...incoming,
      collections: (incoming.collections ?? []).map((c) => {
        // Let's track the oAuth id (sub)
        if (
          c.slug === collectionSlug &&
          !c.fields.some((f) => (f as TextField).name === sub)
        ) {
          c.fields.push({
            name: sub,
            type: "text",
            admin: { readOnly: true },
            access: { update: () => false },
          });
        }
        return c;
      }),
    };

    return funcToCall(config, options);
  };
