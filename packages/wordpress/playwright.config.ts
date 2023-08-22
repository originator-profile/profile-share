import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "e2e",
  globalSetup: "e2e/setup.ts",
  globalTeardown: "e2e/teardown.ts",
  workers: process.env.CI ? 1 : undefined,
});
