import { defineConfig } from "tsup";

export default defineConfig({
  loader: {
    ".key": "file",
  },
});
