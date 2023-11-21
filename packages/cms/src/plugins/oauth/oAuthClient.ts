import OAuthButton from "./OAuthButton";

import { Config } from "payload/config";

import type { oAuthPluginOptions } from "./types";
function oAuthPluginClient(
  incoming: Config,
  options: oAuthPluginOptions,
): Config {
  const button: React.ComponentType = options.components?.Button ?? OAuthButton;
  return {
    ...incoming,
    admin: {
      ...incoming.admin,
      components: {
        ...incoming.admin?.components,
        beforeLogin: (incoming.admin?.components?.beforeLogin ?? []).concat(
          button,
        ),
      },
    },
  };
}
export default oAuthPluginClient;
