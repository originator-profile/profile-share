import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    conditions: ["typescript"],
  },
  test: {
    setupFiles: "tests/setup.ts",
  },
});
