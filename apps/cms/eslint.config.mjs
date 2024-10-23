import ts from "typescript-eslint";
import server from "@tietokilta/eslint-config/server";

export default ts.config(...server, {
  rules: {
    "unicorn/prefer-node-protocol": "off",
  },
});
