import { defineConfig } from "vitest/config";

export default defineConfig({
  ssr: {
    resolve: {
      conditions: ["typescript"],
    },
  },
  test: {
    setupFiles: "tests/setup.ts",
    globals: true,
  },
});
