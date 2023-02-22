import { defineConfig } from "tsup";

export default defineConfig({
  loader: {
    ".pem": "file",
  },
});
