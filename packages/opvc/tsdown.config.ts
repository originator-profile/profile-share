import { defineConfig } from "tsdown";
import typedoc from "./typedoc.json" with { type: "json" };

export default defineConfig({
  entry: [
    "src/index.ts",
    "src/commands/**/*.ts"
  ],
  format: "esm",
  clean: true,
  dts: {
    entry: typedoc.entryPoints,
  },
  esbuildOptions(options) {
    options.conditions = ["typescript"];
  },
});
