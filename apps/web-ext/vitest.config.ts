import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    conditions: ["browser", "typescript"],
  },
  test: {
    dir: "src",
    pool: "forks",
  },
});
