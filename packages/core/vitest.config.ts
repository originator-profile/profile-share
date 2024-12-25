import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    conditions: ["typescript"],
  },
  test: {
    globalSetup: "tests/setup.ts",
  },
});
