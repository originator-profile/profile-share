import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "e2e",
  webServer: {
    url: "http://localhost:8080",
    command:
      "pnpm exec vite dev --config vite.config.ts --port 8080 playwright",
    reuseExistingServer: !process.env.CI,
  },
  workers: process.env.CI ? 1 : undefined,
  reporter: [["html"], process.env.CI ? ["dot"] : ["line"]],
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: "http://localhost:8080",
    trace: process.env.CI ? "on-first-retry" : "on",
    video: process.env.CI ? "on-first-retry" : "on",
  },
});
