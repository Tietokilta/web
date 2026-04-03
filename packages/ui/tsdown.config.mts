import { defineConfig } from "tsdown";

export default defineConfig({
  target: "es2020",
  deps: {
    neverBundle: ["react"],
  },
});
