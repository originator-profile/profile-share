import { defineConfig } from "tsup";

export default defineConfig({
  loader: {
    ".md": "text",
  },
  esbuildOptions(options) {
    options.conditions = ["typescript"];
  },
});
