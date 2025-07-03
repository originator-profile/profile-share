import { defineConfig } from "tsup";
import typedoc from "./typedoc.json" with { type: "json" };

export default defineConfig({
  entry: ["src/commands", ...typedoc.entryPoints],
  format: "esm",
  clean: true,
  dts: {
    entry: typedoc.entryPoints,
  },
  esbuildOptions(options) {
    options.conditions = ["typescript"];
  },
});
