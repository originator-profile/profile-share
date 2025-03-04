import { defineConfig } from "vitest/config";

export default defineConfig({
  ssr: {
    resolve: {
      conditions: ["browser", "typescript"],
    },
  },
  test: {
    dir: "src",
    pool: "forks",
  },
});
