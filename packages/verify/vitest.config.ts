import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    conditions: ["typescript"],
  },
  test: {
    dir: "src",
    environment: "happy-dom",
  },
});
